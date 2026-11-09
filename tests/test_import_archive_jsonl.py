"""Unit tests for the archive importer. Run: python3 -m unittest discover -s tests -v"""
import json
import pathlib
import sys
import tempfile
import unittest
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "tools"))
from import_archive_jsonl import load, normalize

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
    def test_valid_two_record_batch(self):
        with tempfile.NamedTemporaryFile(mode="w", suffix=".jsonl", encoding="utf-8") as f:
            f.write(json.dumps(BASE)+"\n"+json.dumps({**BASE,"catalog_id":"A-124"})+"\n")
            f.flush()
            self.assertEqual(len(load(f.name)),2)

if __name__ == "__main__":
    unittest.main()
