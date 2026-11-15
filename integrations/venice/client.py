"""Optional Venice API client. Offline by default. No workflows or deployments.

Run tests: python3 integrations/venice/client.py --self-test
Dry run: python3 integrations/venice/client.py --model MODEL --prompt-file FILE
Live calls require explicit --live, a local VENICE_API_KEY and approval.
GitHub Actions secrets are not automatically available to this script.
"""
import argparse
import io
import json
import os
import sys
import unittest
from unittest.mock import patch
from urllib import request

ENDPOINT = "https://api.venice.ai/api/v1/chat/completions"

def payload(model, prompt):
    if not model or not model.strip() or not prompt or not prompt.strip():
        raise ValueError("Nonempty model and prompt required")
    return {"model": model, "messages": [{"role": "user", "content": prompt}], "stream": False}

def invoke(model, prompt, *, live=False, transport=None):
    body = payload(model, prompt)
    if not live:
        return {"status": "offline", "model": model, "endpoint": ENDPOINT, "request_ready": True}
    key = os.environ.get("VENICE_API_KEY", "").strip()
    if not key:
        raise RuntimeError("VENICE_API_KEY missing from local environment")
    req = request.Request(ENDPOINT, data=json.dumps(body).encode("utf-8"),
        headers={"Authorization": "Bearer " + key, "Content-Type": "application/json"},
        method="POST")
    with (transport or request.urlopen)(req, timeout=30) as response:
        return json.load(response)

class OfflineTests(unittest.TestCase):
    def test_dry_run_no_network(self):
        result = invoke("model", "hello", transport=lambda *a, **k: self.fail("network called"))
        self.assertEqual(result["status"], "offline")
    def test_missing_model(self):
        with self.assertRaises(ValueError):
            payload("", "hello")
    def test_missing_prompt(self):
        with self.assertRaises(ValueError):
            payload("model", " ")
    def test_missing_key(self):
        with patch.dict(os.environ, {}, clear=True):
            with self.assertRaises(RuntimeError):
                invoke("model", "hello", live=True)
    def test_mocked_live_request(self):
        def sender(req, timeout):
            self.assertEqual(req.full_url, ENDPOINT)
            self.assertEqual(req.get_header("Authorization"), "Bearer fake-key")
            self.assertEqual(json.loads(req.data)["messages"][0]["content"], "hello")
            self.assertEqual(timeout, 30)
            return io.BytesIO(b'{"choices":[]}')
        with patch.dict(os.environ, {"VENICE_API_KEY": "fake-key"}):
            self.assertEqual(invoke("model", "hello", live=True, transport=sender), {"choices": []})

def main():
    p = argparse.ArgumentParser(description="Offline-safe Venice integration")
    p.add_argument("--self-test", action="store_true")
    p.add_argument("--model", default=os.getenv("VENICE_MODEL", ""))
    p.add_argument("--prompt-file")
    p.add_argument("--live", action="store_true", help="May incur API charges; requires approval")
    args = p.parse_args()
    if args.self_test:
        suite = unittest.defaultTestLoader.loadTestsFromTestCase(OfflineTests)
        return 0 if unittest.TextTestRunner(verbosity=2).run(suite).wasSuccessful() else 1
    if not args.prompt_file:
        p.error("--prompt-file required unless --self-test")
    with open(args.prompt_file, encoding="utf-8") as f:
        prompt = f.read()
    try:
        print(json.dumps(invoke(args.model, prompt, live=args.live), indent=2))
    except (ValueError, RuntimeError) as exc:
        print("Configuration error: " + str(exc), file=sys.stderr)
        return 2
    return 0

if __name__ == "__main__":
    sys.exit(main())
