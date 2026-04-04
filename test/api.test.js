const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { createApiEnv } = require('./setup');

describe('LaunchpadAPI', () => {
  let api, window;

  beforeEach(() => {
    const env = createApiEnv();
    api = env.api;
    window = env.window;
  });

  describe('API key management', () => {
    it('hasApiKey returns falsy when no key is set', () => {
      assert.ok(!api.hasApiKey());
    });

    it('setApiKey stores key and hasApiKey returns true', () => {
      api.setApiKey('sk-ant-test-key-123');
      assert.equal(api.hasApiKey(), true);
    });

    it('getApiKey returns the stored key', () => {
      api.setApiKey('sk-ant-test-key-456');
      assert.equal(api.getApiKey(), 'sk-ant-test-key-456');
    });

    it('setApiKey trims whitespace', () => {
      api.setApiKey('  sk-ant-test-key-789  ');
      assert.equal(api.getApiKey(), 'sk-ant-test-key-789');
    });

    it('removeApiKey clears the key', () => {
      api.setApiKey('sk-ant-test-key-abc');
      api.removeApiKey();
      assert.ok(!api.hasApiKey());
      assert.equal(api.getApiKey(), null);
    });

    it('hasApiKey returns falsy for empty string', () => {
      window.localStorage.setItem('launchpad_api_key', '');
      assert.ok(!api.hasApiKey());
    });
  });

  describe('SYSTEM_PROMPT', () => {
    it('contains key instructions for the tutor persona', () => {
      assert.ok(api.SYSTEM_PROMPT.includes('Launchpad'));
      assert.ok(api.SYSTEM_PROMPT.includes('150 words'));
      assert.ok(api.SYSTEM_PROMPT.includes('encouraging'));
    });
  });

  describe('sendMessage', () => {
    it('throws a user-friendly error when no API key is set', async () => {
      await assert.rejects(
        () => api.sendMessage('hello'),
        (err) => {
          assert.ok(err.message.includes('API key'));
          return true;
        }
      );
    });

    it('calls fetch with correct headers and body when key is set', async () => {
      api.setApiKey('sk-ant-test-key');

      let capturedUrl, capturedOptions;
      window.fetch = async (url, options) => {
        capturedUrl = url;
        capturedOptions = options;
        return {
          ok: true,
          json: async () => ({ content: [{ text: 'Hello there!' }] }),
        };
      };

      const result = await api.sendMessage('What is AI?');

      assert.equal(result, 'Hello there!');
      assert.equal(capturedUrl, 'https://api.anthropic.com/v1/messages');
      assert.equal(capturedOptions.method, 'POST');

      const headers = capturedOptions.headers;
      assert.equal(headers['x-api-key'], 'sk-ant-test-key');
      assert.equal(headers['anthropic-version'], '2023-06-01');
      assert.equal(headers['anthropic-dangerous-direct-browser-access'], 'true');
      assert.equal(headers['Content-Type'], 'application/json');

      const body = JSON.parse(capturedOptions.body);
      assert.equal(body.model, 'claude-sonnet-4-20250514');
      assert.equal(body.max_tokens, 300);
      assert.ok(body.system.includes('Launchpad'));
      assert.deepEqual(body.messages, [{ role: 'user', content: 'What is AI?' }]);
    });

    it('returns friendly error on 401 (invalid key)', async () => {
      api.setApiKey('sk-bad-key');
      window.fetch = async () => ({
        ok: false,
        status: 401,
        json: async () => ({ error: { message: 'invalid api key' } }),
      });

      await assert.rejects(
        () => api.sendMessage('hello'),
        (err) => {
          assert.ok(err.message.includes("doesn't seem to be valid"));
          // Must not expose raw API error
          assert.ok(!err.message.includes('invalid api key'));
          return true;
        }
      );
    });

    it('returns friendly error on 429 (rate limit)', async () => {
      api.setApiKey('sk-test-key');
      window.fetch = async () => ({
        ok: false,
        status: 429,
        json: async () => ({}),
      });

      await assert.rejects(
        () => api.sendMessage('hello'),
        (err) => {
          assert.ok(err.message.includes('too many requests'));
          return true;
        }
      );
    });

    it('returns friendly error on other server errors', async () => {
      api.setApiKey('sk-test-key');
      window.fetch = async () => ({
        ok: false,
        status: 500,
        json: async () => ({}),
      });

      await assert.rejects(
        () => api.sendMessage('hello'),
        (err) => {
          assert.ok(err.message.includes('something went wrong'));
          return true;
        }
      );
    });

    it('returns friendly error on network failure', async () => {
      api.setApiKey('sk-test-key');
      window.fetch = async () => {
        throw new TypeError('Failed to fetch');
      };

      await assert.rejects(
        () => api.sendMessage('hello'),
        (err) => {
          assert.ok(err.message.includes('connection'));
          // Must not expose raw fetch error
          assert.ok(!err.message.includes('Failed to fetch'));
          return true;
        }
      );
    });
  });
});
