"""Venice configuration preflight. No network calls, no secret values in output."""
import argparse
import json
import os
import unittest
from urllib.parse import urlparse

ENDPOINT = 'https://api.venice.ai/api/v1/chat/completions'


def check(config=None):
    env = os.environ if config is None else config
    url = urlparse(ENDPOINT)
    key = env.get('VENICE_API_KEY', '')
    model = env.get('VENICE_MODEL', '')
    key_ok = isinstance(key, str) and bool(key.strip())
    model_ok = isinstance(model, str) and bool(model.strip())
    endpoint_ok = (url.scheme == 'https' and url.hostname == 'api.venice.ai'
                   and url.path == '/api/v1/chat/completions' and not url.username
                   and not url.password and not url.query and not url.fragment)
    return {
        'endpoint_https': endpoint_ok,
        'api_key_present': key_ok,
        'model_configured': model_ok,
        'ready_for_authenticated_request': endpoint_ok and key_ok and model_ok,
        'live_connection_verified': False,
    }


class ReadinessTests(unittest.TestCase):
    def test_missing_credentials(self):
        self.assertFalse(check({})['ready_for_authenticated_request'])
    def test_complete_configuration(self):
        self.assertTrue(check({'VENICE_API_KEY': 'test-only', 'VENICE_MODEL': 'test-model'})['ready_for_authenticated_request'])
    def test_no_secret_leak(self):
        result = check({'VENICE_API_KEY': 'very-private-value', 'VENICE_MODEL': 'model'})
        self.assertNotIn('very-private-value', json.dumps(result))
    def test_https(self):
        self.assertTrue(check({})['endpoint_https'])
    def test_whitespace_is_not_configuration(self):
        self.assertFalse(check({'VENICE_API_KEY': '  ', 'VENICE_MODEL': 'model'})['ready_for_authenticated_request'])
        self.assertFalse(check({'VENICE_API_KEY': 'key', 'VENICE_MODEL': '\n'})['ready_for_authenticated_request'])
    def test_never_claims_live_verification(self):
        self.assertFalse(check({'VENICE_API_KEY': 'key', 'VENICE_MODEL': 'model'})['live_connection_verified'])
    def test_unexpected_config_types(self):
        self.assertFalse(check({'VENICE_API_KEY': None, 'VENICE_MODEL': 123})['ready_for_authenticated_request'])


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Offline Venice configuration preflight')
    parser.add_argument('--self-test', action='store_true')
    args = parser.parse_args()
    if args.self_test:
        unittest.main(argv=[__file__])
    else:
        print(json.dumps(check(), indent=2))
