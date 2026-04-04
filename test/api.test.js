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

  describe('sendMessage', () => {
    it('returns a string response', async () => {
      const result = await api.sendMessage('hello');
      assert.equal(typeof result, 'string');
      assert.ok(result.length > 0);
    });

    it('responds to greetings with a welcome message', async () => {
      const result = await api.sendMessage('Hello there!');
      assert.ok(result.toLowerCase().includes('welcome') || result.toLowerCase().includes('hello'));
    });

    it('responds to "what is AI" with an explanation', async () => {
      const result = await api.sendMessage('What is AI?');
      assert.ok(result.toLowerCase().includes('ai') || result.toLowerCase().includes('artificial'));
    });

    it('responds to job-related questions', async () => {
      const result = await api.sendMessage('How do I find a job?');
      assert.ok(result.toLowerCase().includes('job') || result.toLowerCase().includes('skill') || result.toLowerCase().includes('employer'));
    });

    it('responds to ChatGPT questions', async () => {
      const result = await api.sendMessage('Tell me about ChatGPT');
      assert.ok(result.toLowerCase().includes('chatgpt') || result.toLowerCase().includes('openai'));
    });

    it('responds to Claude questions', async () => {
      const result = await api.sendMessage('What is Claude?');
      assert.ok(result.toLowerCase().includes('claude') || result.toLowerCase().includes('anthropic'));
    });

    it('responds to Excel/spreadsheet questions', async () => {
      const result = await api.sendMessage('How do I use Excel?');
      assert.ok(result.toLowerCase().includes('spreadsheet') || result.toLowerCase().includes('excel'));
    });

    it('responds to prompt/how-to-use-AI questions', async () => {
      const result = await api.sendMessage('How to use AI?');
      assert.ok(result.toLowerCase().includes('specific') || result.toLowerCase().includes('prompt') || result.toLowerCase().includes('ask'));
    });

    it('returns default response for unrecognized input', async () => {
      const result = await api.sendMessage('xyzzy foobar baz');
      assert.ok(result.includes('simulated demo') || result.includes('great question'));
    });

    it('is case-insensitive for keyword matching', async () => {
      const result = await api.sendMessage('WHAT IS AI?');
      assert.ok(result.toLowerCase().includes('ai') || result.toLowerCase().includes('artificial'));
    });

    it('returns a response asynchronously (simulates delay)', async () => {
      const start = Date.now();
      await api.sendMessage('hello');
      const elapsed = Date.now() - start;
      // Should have some delay (at least a few hundred ms)
      assert.ok(elapsed >= 100, `Expected delay, got ${elapsed}ms`);
    });
  });

  describe('RESPONSES', () => {
    it('has multiple response categories', () => {
      assert.ok(api.RESPONSES.length >= 5);
    });

    it('each response has keywords and response text', () => {
      for (const entry of api.RESPONSES) {
        assert.ok(Array.isArray(entry.keywords), 'keywords should be an array');
        assert.ok(entry.keywords.length > 0, 'keywords should not be empty');
        assert.equal(typeof entry.response, 'string');
        assert.ok(entry.response.length > 0, 'response should not be empty');
      }
    });

    it('has a default response', () => {
      assert.equal(typeof api.DEFAULT_RESPONSE, 'string');
      assert.ok(api.DEFAULT_RESPONSE.length > 0);
    });
  });
});
