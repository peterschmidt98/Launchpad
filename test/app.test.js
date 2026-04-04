const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { createTestEnv } = require('./setup');

describe('LaunchpadApp', () => {
  let window, document, app;

  beforeEach(() => {
    const env = createTestEnv({ immediateTimers: true });
    window = env.window;
    document = env.document;
    app = window.LaunchpadApp;
  });

  describe('Progress management', () => {
    it('getProgress returns default state for fresh user', () => {
      window.localStorage.removeItem('launchpad_progress');
      const progress = app.getProgress();
      assert.equal(progress[1], 'not-started');
      assert.equal(progress[2], 'not-started');
      assert.equal(progress[6], 'not-started');
    });

    it('setChapterStatus persists to localStorage', () => {
      app.setChapterStatus(1, 'complete');
      const stored = JSON.parse(window.localStorage.getItem('launchpad_progress'));
      assert.equal(stored[1], 'complete');
    });

    it('setChapterStatus updates only the targeted chapter', () => {
      app.setChapterStatus(1, 'complete');
      app.setChapterStatus(2, 'in-progress');
      const progress = app.getProgress();
      assert.equal(progress[1], 'complete');
      assert.equal(progress[2], 'in-progress');
      assert.equal(progress[3], 'not-started');
    });

    it('progress survives round-trip through localStorage', () => {
      app.setChapterStatus(1, 'complete');
      app.setChapterStatus(2, 'complete');
      // Simulate re-reading from storage
      const progress = app.getProgress();
      assert.equal(progress[1], 'complete');
      assert.equal(progress[2], 'complete');
    });
  });

  describe('Chapter unlocking', () => {
    it('chapters 1 and 2 are always unlocked', () => {
      assert.equal(app.isChapterUnlocked(1), true);
      assert.equal(app.isChapterUnlocked(2), true);
    });

    it('chapters 3-6 are locked by default', () => {
      for (let i = 3; i <= 6; i++) {
        assert.equal(app.isChapterUnlocked(i), false, `Chapter ${i} should be locked`);
      }
    });

    it('chapters 3-6 unlock when chapter 2 is complete', () => {
      app.setChapterStatus(2, 'complete');
      for (let i = 3; i <= 6; i++) {
        assert.equal(app.isChapterUnlocked(i), true, `Chapter ${i} should be unlocked`);
      }
    });

    it('chapters 3-6 stay locked when only chapter 1 is complete', () => {
      app.setChapterStatus(1, 'complete');
      for (let i = 3; i <= 6; i++) {
        assert.equal(app.isChapterUnlocked(i), false, `Chapter ${i} should be locked`);
      }
    });

    it('chapter 2 in-progress does not unlock chapters 3-6', () => {
      app.setChapterStatus(2, 'in-progress');
      assert.equal(app.isChapterUnlocked(3), false);
    });
  });

  describe('Sidebar rendering', () => {
    it('renders 6 chapter items plus API key button', () => {
      const nav = document.getElementById('chapter-list');
      const items = nav.querySelectorAll('.chapter-nav-item');
      // 6 chapters + 1 API key button
      assert.equal(items.length, 7);
    });

    it('shows lock icon for locked chapters', () => {
      const nav = document.getElementById('chapter-list');
      const items = nav.querySelectorAll('.chapter-nav-item');
      // Chapters 3-6 (indices 2-5) should show lock
      for (let i = 2; i <= 5; i++) {
        const indicator = items[i].querySelector('.status-indicator');
        assert.ok(indicator.textContent.includes('🔒'), `Chapter ${i + 1} should show lock icon`);
      }
    });

    it('shows status symbols for unlocked chapters', () => {
      const nav = document.getElementById('chapter-list');
      const items = nav.querySelectorAll('.chapter-nav-item');
      // Chapter 1 should be in-progress (navigated to on init) -> ◐
      const ch1Indicator = items[0].querySelector('.status-indicator');
      assert.ok(ch1Indicator.textContent.includes('◐'));
    });

    it('updates sidebar when chapter status changes', () => {
      app.setChapterStatus(1, 'complete');
      const nav = document.getElementById('chapter-list');
      const items = nav.querySelectorAll('.chapter-nav-item');
      const ch1Indicator = items[0].querySelector('.status-indicator');
      assert.ok(ch1Indicator.textContent.includes('●'), 'Complete chapter should show filled circle');
    });

    it('shows chapter titles', () => {
      const nav = document.getElementById('chapter-list');
      assert.ok(nav.textContent.includes('Where Are We?'));
      assert.ok(nav.textContent.includes('What is AI?'));
      assert.ok(nav.textContent.includes('Your Core Toolkit'));
    });

    it('locked chapters have .locked class', () => {
      const nav = document.getElementById('chapter-list');
      const items = nav.querySelectorAll('.chapter-nav-item');
      assert.ok(items[2].classList.contains('locked'), 'Chapter 3 should have locked class');
      assert.ok(!items[0].classList.contains('locked'), 'Chapter 1 should not have locked class');
    });
  });

  describe('Navigation', () => {
    it('navigateToChapter sets chapter to in-progress', () => {
      app.navigateToChapter(2);
      const progress = app.getProgress();
      assert.equal(progress[2], 'in-progress');
    });

    it('navigateToChapter does not downgrade a complete chapter', () => {
      app.setChapterStatus(1, 'complete');
      app.navigateToChapter(1);
      const progress = app.getProgress();
      assert.equal(progress[1], 'complete');
    });

    it('navigateToChapter renders chapter content into container', () => {
      app.navigateToChapter(1);
      const container = document.getElementById('chapter-container');
      assert.ok(container.textContent.includes('Where Are We?'));
    });

    it('navigateToChapter replaces previous chapter content', () => {
      app.navigateToChapter(1);
      app.navigateToChapter(2);
      const container = document.getElementById('chapter-container');
      assert.ok(container.textContent.includes('What is AI?'));
      assert.ok(!container.textContent.includes('A quick check-in'));
    });
  });

  describe('API key modal', () => {
    it('modal is shown on init when no API key is set', () => {
      const modal = document.getElementById('api-key-modal');
      assert.ok(modal.classList.contains('active'));
    });

    it('modal is not shown when API key exists', () => {
      // Create a new env with key pre-set
      const env2 = createTestEnv({ skipInit: true });
      env2.window.LaunchpadAPI.setApiKey('sk-test');
      env2.triggerInit();
      const modal = env2.document.getElementById('api-key-modal');
      assert.ok(!modal.classList.contains('active'));
    });
  });

  describe('Initial chapter selection', () => {
    it('starts on chapter 1 for fresh user', () => {
      const container = document.getElementById('chapter-container');
      assert.ok(container.textContent.includes('Where Are We?'));
    });

    it('starts on first incomplete chapter', () => {
      // Create env where ch1 is complete
      const env2 = createTestEnv({ skipInit: true });
      env2.window.localStorage.setItem('launchpad_progress', JSON.stringify({
        1: 'complete', 2: 'not-started', 3: 'not-started',
        4: 'not-started', 5: 'not-started', 6: 'not-started',
      }));
      env2.window.LaunchpadAPI.setApiKey('sk-test');
      env2.triggerInit();
      const container = env2.document.getElementById('chapter-container');
      assert.ok(container.textContent.includes('What is AI?'));
    });
  });
});
