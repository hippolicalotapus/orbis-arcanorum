"""Integration tests for Met harvesting with mocked network responses."""
import pathlib
import sys
import unittest
from unittest.mock import patch

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "tools"))
import harvest_met

class MetHarvestIntegrationTests(unittest.TestCase):
    @patch("harvest_met.fetch_json")
    def test_skips_invalid_and_duplicate_objects(self, fetch):
        def response(url):
            if "/search?" in url:
                return {"objectIDs": [10, 10, 11, 12]}
            if url.endswith("/10"):
                return {"objectID": 10, "title": "Protective amulet",
                        "objectURL": "https://www.metmuseum.org/art/collection/search/10"}
            if url.endswith("/11"):
                return {"objectID": 11, "title": "",
                        "objectURL": "https://www.metmuseum.org/art/collection/search/11"}
            return {"objectID": 12, "title": "Ritual object",
                    "objectURL": "https://www.metmuseum.org/art/collection/search/12"}
        fetch.side_effect = response
        records = harvest_met.harvest("amulet", 10, 0)
        self.assertEqual([x["catalog_id"] for x in records], ["10", "12"])
        self.assertEqual(fetch.call_count, 4)
    @patch("harvest_met.fetch_json", return_value={"objectIDs": None})
    def test_empty_search(self, fetch):
        self.assertEqual(harvest_met.harvest("unmatched", 10, 0), [])
    @patch("harvest_met.fetch_json")
    def test_limit(self, fetch):
        def response(url):
            if "/search?" in url:
                return {"objectIDs": [1, 2, 3]}
            n = int(url.rsplit("/", 1)[1])
            return {"objectID": n, "title": "Amulet",
                    "objectURL": f"https://www.metmuseum.org/art/collection/search/{n}"}
        fetch.side_effect = response
        self.assertEqual(len(harvest_met.harvest("amulet", 2, 0)), 2)

if __name__ == "__main__":
    unittest.main()
