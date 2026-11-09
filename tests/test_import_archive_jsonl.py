"""Unit tests for the archive importer. Run: python3 -m unittest discover -s tests -v"""
import json
import pathlib
import sys
import tempfile
import unittest
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "tools"))
from import_archive_jsonl import load, normalize, reject_existing, commit
from unittest.mock import patch
import io
import os

BASE = {
    "institution": "Example Museum", "catalog_id": "A-123",
    "title": "An Occult Manuscript",
    "source_url": "https://museum.example.org/objects/A-123",
    "section": "Alchemy",
}
class ArchiveImportTests(unittest.TestCase):
    def test_normalization_preserves_draft_and_rights(self):
        x = normalize(BASE)
        self.assertEqual(x["publication_status"], "draft")
        self.assertEqual(x["rights_status"], "unverified")
        self.assertEqual(x["slug"], "example-museum-a-123")
    def test_reject_http(self):
        with self.assertRaises(ValueError):
            normalize({**BASE, "source_url": "http://museum.example.org/a"})
    def test_reject_url_fragment(self):
        with self.assertRaises(ValueError):
            normalize({**BASE, "source_url": "https://museum.example.org/a#token"})
    def test_reject_url_whitespace(self):
        with self.assertRaises(ValueError):
            normalize({**BASE, "source_url": "https://museum.example.org/a b"})
    def test_reject_missing_catalog_id(self):
        with self.assertRaises(ValueError):
            normalize({**BASE, "catalog_id": ""})
    def test_reject_duplicate_batch(self):
        with tempfile.NamedTemporaryFile(mode="w", suffix=".jsonl", encoding="utf-8") as f:
            f.write(json.dumps(BASE)+"\n"+json.dumps({**BASE,"catalog_id":"a-123"})+"\n")
            f.flush()
            with self.assertRaisesRegex(ValueError,"duplicate"):
                load(f.name)
    def test_100_record_limit(self):
        with tempfile.NamedTemporaryFile(mode="w", suffix=".jsonl", encoding="utf-8") as f:
            for n in range(101):
                f.write(json.dumps({**BASE,"catalog_id":str(n)})+"\n")
            f.flush()
            with self.assertRaisesRegex(ValueError,"maximum 100"):
                load(f.name)
    def test_reject_url_credentials(self):
        with self.assertRaises(ValueError):
            normalize({**BASE, "source_url": "https://user:pass@museum.example.org/object"})
    def test_slug_collision(self):
        with tempfile.NamedTemporaryFile(mode="w", suffix=".jsonl", encoding="utf-8") as f:
            f.write(json.dumps(BASE)+"\n"+json.dumps({**BASE,"catalog_id":"A 123"})+"\n")
            f.flush()
            with self.assertRaisesRegex(ValueError, "duplicate normalized slug"):
                load(f.name)
    @patch("import_archive_jsonl.urllib.request.urlopen")
    def test_preflight_rejects_existing_catalog(self, opener):
        response = io.BytesIO(b'[{"id":"existing"}]')
        opener.return_value.__enter__.return_value = response
        with self.assertRaisesRegex(ValueError, "existing institution/catalog"):
            reject_existing([normalize(BASE)], "https://project.supabase.co", "fake-key")
    @patch("import_archive_jsonl.urllib.request.urlopen")
    def test_preflight_accepts_new_catalog(self, opener):
        opener.return_value.__enter__.return_value = io.BytesIO(b'[]')
        reject_existing([normalize(BASE)], "https://project.supabase.co", "fake-key")
    @patch("import_archive_jsonl.urllib.request.urlopen")
    def test_preflight_rejects_existing_slug(self, opener):
        opener.return_value.__enter__.side_effect = [
            io.BytesIO(b'[]'), io.BytesIO(b'[{"id":"existing"}]')
        ]
        with self.assertRaisesRegex(ValueError, "existing institution/catalog ID or slug"):
            reject_existing([normalize(BASE)], "https://project.supabase.co", "fake-key")
        self.assertEqual(opener.call_count, 2)
    @patch("import_archive_jsonl.urllib.request.urlopen")
    def test_preflight_network_failure_blocks_post(self, opener):
        opener.side_effect = OSError("network unavailable")
        with patch.dict(os.environ, {
            "SUPABASE_URL": "https://project.supabase.co",
            "SUPABASE_SERVICE_ROLE_KEY": "test-only",
        }):
            with self.assertRaises(OSError):
                commit([normalize(BASE)])
        self.assertEqual(opener.call_count, 1)
        self.assertEqual(opener.call_args.args[0].get_method(), "GET")
    def test_valid_two_record_batch(self):
        with tempfile.NamedTemporaryFile(mode="w", suffix=".jsonl", encoding="utf-8") as f:
            f.write(json.dumps(BASE)+"\n"+json.dumps({**BASE,"catalog_id":"A-124"})+"\n")
            f.flush()
            self.assertEqual(len(load(f.name)),2)

if __name__ == "__main__":
    unittest.main()
