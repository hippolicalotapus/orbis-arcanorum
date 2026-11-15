"""Offline Venice integration readiness check; never prints credentials."""
import os
import unittest
from urllib.parse import urlparse

ENDPOINT = "https://api.venice.ai/api/v1/chat/completions"

def check(config=None):
    env = os.environ if config is None else config
    url = urlparse(ENDPOINT)
    key = env.get("VENICE_API_KEY", "")
    model = env.get("VENICE_MODEL", "")
    return {
        "endpoint_https": url.scheme == "https" and url.hostname == "api.venice.ai",
        "api_key_present": bool(key.strip()),
        "model_configured": bool(model.strip()),
        "ready_for_authenticated_request": bool(key.strip() and model.strip()),
    }

class ReadinessTests(unittest.TestCase):
    def test_missing_credentials(self):
        self.assertFalse(check({})["ready_for_authenticated_request"])
    def test_complete_configuration(self):
        self.assertTrue(check({"VENICE_API_KEY": "test-only", "VENICE_MODEL": "test-model"})["ready_for_authenticated_request"])
    def test_no_secret_leak(self):
        result = check({"VENICE_API_KEY": "very-private-value", "VENICE_MODEL": "model"})
        self.assertNotIn("very-private-value", str(result))
    def test_https(self):
        self.assertTrue(check({})["endpoint_https"])

if __name__ == "__main__":
    import json
    import sys
    if "--self-test" in sys.argv:
        unittest.main(argv=[sys.argv[0]])
    else:
        print(json.dumps(check(), indent=2))
