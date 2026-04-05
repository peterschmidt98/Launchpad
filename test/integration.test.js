const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { createTestEnv, createApiEnv } = require('./setup');

describe('Cross-chapter integration', () => {
  let window, document, app, container;

  beforeEach(() => {
    const env = createTestEnv({ immediateTimers: true });
    window = env.window;
    document = env.document;
    app = window.LaunchpadApp;
    container = document.getElementById('chapter-container');
  });

  describe('Progress persistence', () => {
    it('progress survives full app reload (new environment)', () => {
      app.setChapterStatus(1, 'complete');
      app.setChapterStatus(2, 'complete');

      // Simulate reload: create a new env that reads from the same localStorage
      const env2 = createTestEnv({ skipInit: true });
      // Copy localStorage from first env
      const progressData = window.localStorage.getItem('launchpad_progress');
      env2.window.localStorage.setItem('launchpad_progress', progressData);
      env2.triggerInit();

      const progress = env2.window.LaunchpadApp.getProgress();
      assert.equal(progress[1], 'complete');
      assert.equal(progress[2], 'complete');
    });

    it('completing chapter 2 unlocks chapters 3-6 via button click', () => {
      app.navigateToChapter(2);
      const btn = container.querySelector('#ch2-complete-btn');
      btn.click();

      for (let i = 3; i <= 6; i++) {
        assert.equal(app.isChapterUnlocked(i), true, `Chapter ${i} should be unlocked after ch2 complete`);
      }
    });
  });

  describe('Navigation edge cases', () => {
    it('navigateToChapter with invalid ID does nothing', () => {
      const contentBefore = container.innerHTML;
      app.navigateToChapter(99);
      assert.equal(container.innerHTML, contentBefore);
    });

    it('navigateToChapter(0) does nothing', () => {
      const contentBefore = container.innerHTML;
      app.navigateToChapter(0);
      assert.equal(container.innerHTML, contentBefore);
    });

    it('sidebar updates active class when navigating', () => {
      app.navigateToChapter(1);
      let nav = document.getElementById('chapter-list');
      let items = nav.querySelectorAll('.chapter-nav-item');
      assert.ok(items[0].classList.contains('active'), 'Chapter 1 should be active');

      app.navigateToChapter(2);
      nav = document.getElementById('chapter-list');
      items = nav.querySelectorAll('.chapter-nav-item');
      assert.ok(!items[0].classList.contains('active'), 'Chapter 1 should no longer be active');
      assert.ok(items[1].classList.contains('active'), 'Chapter 2 should be active');
    });

    it('if ch1 complete and ch2 in-progress, starts on ch2', () => {
      const env2 = createTestEnv({ skipInit: true });
      env2.window.localStorage.setItem('launchpad_progress', JSON.stringify({
        1: 'complete', 2: 'in-progress', 3: 'not-started',
        4: 'not-started', 5: 'not-started', 6: 'not-started',
      }));
      env2.triggerInit();
      const c = env2.document.getElementById('chapter-container');
      assert.ok(c.textContent.includes('What is AI?'));
    });

    it('never starts on locked chapter', () => {
      const env2 = createTestEnv({ skipInit: true });
      // ch1+ch2 complete but ch3 locked shouldn't happen since ch2 complete unlocks,
      // but ch3 not-started should navigate to ch3 (it's unlocked)
      env2.window.localStorage.setItem('launchpad_progress', JSON.stringify({
        1: 'complete', 2: 'complete', 3: 'not-started',
        4: 'not-started', 5: 'not-started', 6: 'not-started',
      }));
      env2.triggerInit();
      const c = env2.document.getElementById('chapter-container');
      assert.ok(c.textContent.includes('Your Core Toolkit'));
    });
  });

  describe('Mobile sidebar', () => {
    it('menu toggle button exists', () => {
      const btn = document.getElementById('menu-toggle');
      assert.ok(btn);
    });

    it('clicking menu toggle opens sidebar', () => {
      const btn = document.getElementById('menu-toggle');
      btn.click();
      const sidebar = document.getElementById('sidebar');
      assert.ok(sidebar.classList.contains('open'));
    });

    it('clicking overlay closes sidebar', () => {
      // Open first
      document.getElementById('menu-toggle').click();
      // Click overlay
      document.getElementById('sidebar-overlay').click();
      const sidebar = document.getElementById('sidebar');
      assert.ok(!sidebar.classList.contains('open'));
    });

    it('toggling menu twice closes sidebar', () => {
      const btn = document.getElementById('menu-toggle');
      btn.click(); // open
      btn.click(); // close
      const sidebar = document.getElementById('sidebar');
      assert.ok(!sidebar.classList.contains('open'));
    });
  });

  describe('Toast notifications', () => {
    it('showToast creates a toast element', () => {
      app.showToast('Test message');
      const toasts = document.querySelectorAll('.toast');
      assert.equal(toasts.length, 1);
      assert.ok(toasts[0].textContent.includes('Test message'));
    });

    it('new toast replaces existing one', () => {
      app.showToast('First');
      app.showToast('Second');
      const toasts = document.querySelectorAll('.toast');
      assert.equal(toasts.length, 1);
      assert.ok(toasts[0].textContent.includes('Second'));
    });
  });

  describe('Locked chapter interaction', () => {
    it('clicking locked chapter in sidebar shows toast', () => {
      const nav = document.getElementById('chapter-list');
      const items = nav.querySelectorAll('.chapter-nav-item');
      // Chapter 3 (index 2) should be locked
      items[2].click();
      const toasts = document.querySelectorAll('.toast');
      assert.ok(toasts.length > 0);
      assert.ok(toasts[0].textContent.includes('Complete Chapter 2'));
    });
  });
});

describe('Chapter 5 & 6 stubs', () => {
  let window, document, app, container;

  beforeEach(() => {
    const env = createTestEnv({ immediateTimers: true });
    window = env.window;
    document = env.document;
    app = window.LaunchpadApp;
    container = document.getElementById('chapter-container');
    app.setChapterStatus(2, 'complete');
  });

  describe('Chapter 5: Getting Things Done', () => {
    beforeEach(() => { app.navigateToChapter(5); });

    it('displays title', () => {
      assert.ok(container.textContent.includes('Getting Things Done'));
    });

    it('renders full content with tool cards', () => {
      assert.ok(container.textContent.includes('Trello'));
      assert.ok(container.textContent.includes('Notion'));
      assert.ok(container.textContent.includes('Asana'));
      assert.ok(container.textContent.includes('Monday.com'));
    });

    it('shows time estimate', () => {
      assert.ok(container.textContent.includes('~15 min'));
    });
  });

  describe('Chapter 6: You\'re Ready', () => {
    beforeEach(() => { app.navigateToChapter(6); });

    it('displays title', () => {
      assert.ok(container.textContent.includes("You're Ready"));
    });

    it('renders full content with job listing decode', () => {
      assert.ok(container.textContent.includes('Decode the job listing'));
      assert.ok(container.textContent.includes('GreenLeaf'));
    });

    it('shows time estimate', () => {
      assert.ok(container.textContent.includes('~12 min'));
    });
  });
});

describe('API edge cases', () => {
  let api;

  beforeEach(() => {
    const env = createApiEnv();
    api = env.api;
  });

  it('handles empty string input', async () => {
    const result = await api.sendMessage('');
    assert.equal(typeof result, 'string');
    assert.ok(result.length > 0);
  });

  it('handles very long input', async () => {
    const longMsg = 'a'.repeat(10000);
    const result = await api.sendMessage(longMsg);
    assert.equal(typeof result, 'string');
    assert.ok(result.length > 0);
  });

  it('returns first match when multiple keywords hit', async () => {
    // "hello" matches greetings, should return greeting response (first in array)
    const result = await api.sendMessage('hello and tell me about email');
    assert.ok(result.toLowerCase().includes('welcome') || result.toLowerCase().includes('hello'));
  });

  it('handles special characters in input', async () => {
    const result = await api.sendMessage('<script>alert("xss")</script>');
    assert.equal(typeof result, 'string');
  });
});

describe('Exercise edge cases', () => {
  let window, document, app, container;

  beforeEach(() => {
    const env = createTestEnv({ immediateTimers: true });
    window = env.window;
    document = env.document;
    app = window.LaunchpadApp;
    container = document.getElementById('chapter-container');
  });

  describe('Chapter 1 assessment boundaries', () => {
    beforeEach(() => { app.navigateToChapter(1); });

    it('score of exactly 4/12 shows beginner message (boundary at 33%)', () => {
      // scores: 1, 1, 1, 1 = 4/12 = 0.333...
      for (let qi = 0; qi < 4; qi++) {
        const opts = container.querySelectorAll(`[data-question="${qi}"].assessment-option`);
        opts[1].click(); // score = 1 each
      }
      const message = container.querySelector('#assessment-message').textContent;
      assert.ok(message.includes('more foundation than you think'));
    });

    it('score of exactly 8/12 shows intermediate message (boundary at 66%)', () => {
      // scores: 2, 2, 2, 2 = 8/12 = 0.666...
      for (let qi = 0; qi < 4; qi++) {
        const opts = container.querySelectorAll(`[data-question="${qi}"].assessment-option`);
        opts[2].click(); // score = 2 each
      }
      const message = container.querySelector('#assessment-message').textContent;
      assert.ok(message.includes('sharpen and update'));
    });
  });

  describe('Chapter 2 quiz non-sequential', () => {
    beforeEach(() => { app.navigateToChapter(2); });

    it('quiz questions can be answered in any order', () => {
      // Answer Q3 first, then Q1, then Q2
      const q3opts = container.querySelectorAll('[data-quiz="2"].quiz-option');
      q3opts[3].click(); // Anthropic - correct
      assert.ok(q3opts[3].classList.contains('correct'));

      const q1opts = container.querySelectorAll('[data-quiz="0"].quiz-option');
      q1opts[1].click(); // text and data - correct
      assert.ok(q1opts[1].classList.contains('correct'));

      const q2opts = container.querySelectorAll('[data-quiz="1"].quiz-option');
      q2opts[2].click(); // yesterday - correct
      assert.ok(q2opts[2].classList.contains('correct'));
    });
  });

  describe('Chapter 3 formula edge cases', () => {
    beforeEach(() => {
      app.setChapterStatus(2, 'complete');
      app.navigateToChapter(3);
    });

    it('formula with extra whitespace is accepted', () => {
      const input = container.querySelector('#ch3-formula-input');
      const btn = container.querySelector('#ch3-formula-check');
      input.value = '  =SUM(B2:B3)  ';
      btn.click();
      const feedback = container.querySelector('#ch3-formula-feedback');
      assert.ok(feedback.textContent.includes('1,550'));
    });

    it('pressing Enter in formula input checks formula', () => {
      const input = container.querySelector('#ch3-formula-input');
      input.value = '=SUM(B2:B3)';
      const event = new window.KeyboardEvent('keydown', { key: 'Enter' });
      input.dispatchEvent(event);
      const feedback = container.querySelector('#ch3-formula-feedback');
      assert.ok(feedback.textContent.includes('1,550'));
    });

    it('=SUM(B2,B3) with comma separator is accepted', () => {
      const input = container.querySelector('#ch3-formula-input');
      const btn = container.querySelector('#ch3-formula-check');
      input.value = '=SUM(B2,B3)';
      btn.click();
      const feedback = container.querySelector('#ch3-formula-feedback');
      assert.ok(feedback.textContent.includes('1,550'));
    });
  });

  describe('Chapter 4 prompt builder edge cases', () => {
    beforeEach(() => {
      app.setChapterStatus(2, 'complete');
      app.navigateToChapter(4);
    });

    it('builder requires at least 2 fields', () => {
      container.querySelector('#ch4-builder-role').value = 'Coach';
      container.querySelector('#ch4-builder-build').click();
      assert.ok(container.querySelector('#ch4-builder-result').classList.contains('hidden'));
    });

    it('builder works with exactly 2 fields', () => {
      container.querySelector('#ch4-builder-role').value = 'Coach';
      container.querySelector('#ch4-builder-task').value = 'Help me';
      container.querySelector('#ch4-builder-build').click();
      assert.ok(!container.querySelector('#ch4-builder-result').classList.contains('hidden'));
    });

    it('builder works with all 4 fields', () => {
      container.querySelector('#ch4-builder-role').value = 'You are a coach';
      container.querySelector('#ch4-builder-task').value = 'Write an email';
      container.querySelector('#ch4-builder-context').value = 'I am new';
      container.querySelector('#ch4-builder-format').value = 'Keep it short';
      container.querySelector('#ch4-builder-build').click();
      const prompt = container.querySelector('#ch4-builder-prompt').textContent;
      assert.ok(prompt.includes('coach'));
      assert.ok(prompt.includes('email'));
      assert.ok(prompt.includes('new'));
      assert.ok(prompt.includes('short'));
    });

    it('clicking Send to AI without building does nothing', async () => {
      const sendBtn = container.querySelector('#ch4-builder-send');
      sendBtn.click();
      await new Promise(r => setTimeout(r, 50));
      const response = container.querySelector('#ch4-builder-response');
      assert.ok(response.classList.contains('hidden'));
    });

    it('clicking different scenario cards updates textarea', () => {
      const cards = container.querySelectorAll('[data-scenario]');
      const textarea = container.querySelector('#ch4-demo-input');

      cards[0].click();
      const first = textarea.value;
      assert.ok(first.length > 0);

      cards[1].click();
      assert.notEqual(textarea.value, first);
      assert.ok(textarea.value.length > 0);
    });
  });
});
