"""Offline tests for the Met API record transformation."""
import pathlib
import sys
import unittest

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "tools"))
from harvest_met import transform

class MetHarvestTests(unittest.TestCase):
    def test_valid_object(self):
        record = transform({
            "objectID": 123, "title": "Amulet",
            "objectURL": "https://www.metmuseum.org/art/collection/search/123",
            "culture": "Egyptian", "medium": "Faience"
        })
        self.assertEqual(record["catalog_id"], "123")
        self.assertIn("Egyptian", record["description"])
    def test_missing_object_id(self):
        self.assertIsNone(transform({"title": "Amulet", "objectURL": "https://example.org/1"}))
    def test_missing_title(self):
        self.assertIsNone(transform({"objectID": 123, "objectURL": "https://example.org/1"}))
    def test_insecure_source(self):
        self.assertIsNone(transform({"objectID": 123, "title": "Amulet", "objectURL": "http://example.org/1"}))

if __name__ == "__main__":
    unittest.main()
