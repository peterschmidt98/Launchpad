/**
 * Launchpad API module — handles Anthropic API calls
 */
window.LaunchpadAPI = {
  SYSTEM_PROMPT: `You are a warm, encouraging tutor inside an educational platform called Launchpad. The user is someone returning to the workforce who may not be tech-savvy. Keep all responses under 150 words. Use simple, clear language. Be encouraging. Never use jargon without explaining it.`,

  getApiKey() {
    return localStorage.getItem('launchpad_api_key');
  },

  setApiKey(key) {
    localStorage.setItem('launchpad_api_key', key.trim());
  },

  removeApiKey() {
    localStorage.removeItem('launchpad_api_key');
  },

  hasApiKey() {
    const key = this.getApiKey();
    return key && key.length > 0;
  },

  async sendMessage(userMessage) {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Please set your API key first. Click the key icon in the sidebar.');
    }

    let response;
    try {
      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 300,
          system: this.SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userMessage }],
        }),
      });
    } catch (err) {
      throw new Error("Hmm, something went wrong with the connection. Check your internet and try again.");
    }

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("That API key doesn't seem to be valid. Double-check it and try again.");
      }
      if (response.status === 429) {
        throw new Error("We're sending too many requests. Wait a moment and try again.");
      }
      throw new Error("Hmm, something went wrong. Try again in a moment.");
    }

    const data = await response.json();
    return data.content[0].text;
  },
};
