const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { createTestEnv } = require('./setup');

describe('Chapter 1: Where Are We?', () => {
  let window, document, app, container;

  beforeEach(() => {
    const env = createTestEnv({ immediateTimers: true });
    window = env.window;
    document = env.document;
    app = window.LaunchpadApp;
    container = document.getElementById('chapter-container');
    // Navigate to chapter 1
    app.navigateToChapter(1);
  });

  describe('Rendering', () => {
    it('displays the chapter title', () => {
      assert.ok(container.textContent.includes('Where Are We?'));
    });

    it('displays the subtitle', () => {
      assert.ok(container.textContent.includes("arriving at the right time"));
    });

    it('displays time estimate', () => {
      assert.ok(container.textContent.includes('~10 min'));
    });

    it('renders the welcome section', () => {
      assert.ok(container.textContent.includes("you haven't missed the boat"));
    });

    it('renders all 4 "What Changed" cards', () => {
      const cards = container.querySelectorAll('#ch1-s2 .card');
      assert.equal(cards.length, 4);
    });

    it('card content matches spec topics', () => {
      const cardText = container.querySelector('#ch1-s2').textContent;
      assert.ok(cardText.includes('AI went mainstream'));
      assert.ok(cardText.includes('Remote & hybrid work'));
      assert.ok(cardText.includes('Digital tools replaced paper'));
      assert.ok(cardText.includes('Skills matter more than ever'));
    });

    it('renders the progress bar', () => {
      const bar = container.querySelector('#ch1-progress');
      assert.ok(bar, 'Progress bar should exist');
    });
  });

  describe('Self-assessment', () => {
    it('renders 4 questions', () => {
      const questions = container.querySelectorAll('#assessment-questions > div');
      assert.equal(questions.length, 4);
    });

    it('each question has 4 options', () => {
      const questions = container.querySelectorAll('#assessment-questions > div');
      questions.forEach((q, i) => {
        const options = q.querySelectorAll('.assessment-option');
        assert.equal(options.length, 4, `Question ${i + 1} should have 4 options`);
      });
    });

    it('clicking an option marks it as selected', () => {
      const firstOption = container.querySelector('.assessment-option');
      firstOption.click();
      assert.ok(firstOption.classList.contains('selected'));
    });

    it('clicking a different option in same question deselects previous', () => {
      const options = container.querySelectorAll('[data-question="0"].assessment-option');
      options[0].click();
      assert.ok(options[0].classList.contains('selected'));
      options[1].click();
      assert.ok(!options[0].classList.contains('selected'));
      assert.ok(options[1].classList.contains('selected'));
    });

    it('result is hidden before all questions are answered', () => {
      // Answer only 2 questions
      const q0opts = container.querySelectorAll('[data-question="0"].assessment-option');
      const q1opts = container.querySelectorAll('[data-question="1"].assessment-option');
      q0opts[0].click();
      q1opts[0].click();
      const result = container.querySelector('#assessment-result');
      assert.ok(result.classList.contains('hidden'));
    });

    it('shows result after all 4 questions are answered', () => {
      // Answer all 4 questions
      for (let qi = 0; qi < 4; qi++) {
        const opts = container.querySelectorAll(`[data-question="${qi}"].assessment-option`);
        opts[1].click(); // select second option (score=1)
      }
      const result = container.querySelector('#assessment-result');
      assert.ok(!result.classList.contains('hidden'), 'Result should be visible');
    });

    it('shows beginner message for low scores (all "Not at all")', () => {
      for (let qi = 0; qi < 4; qi++) {
        const opts = container.querySelectorAll(`[data-question="${qi}"].assessment-option`);
        opts[0].click(); // score=0 for all
      }
      const message = container.querySelector('#assessment-message').textContent;
      assert.ok(message.includes('starting from the right place'));
    });

    it('shows intermediate message for mixed scores', () => {
      // Scores: 1, 1, 2, 2 = 6/12 = 0.5 (middle tier)
      const selections = [1, 1, 2, 2];
      for (let qi = 0; qi < 4; qi++) {
        const opts = container.querySelectorAll(`[data-question="${qi}"].assessment-option`);
        opts[selections[qi]].click();
      }
      const message = container.querySelector('#assessment-message').textContent;
      assert.ok(message.includes('more foundation than you think'));
    });

    it('shows advanced message for high scores', () => {
      for (let qi = 0; qi < 4; qi++) {
        const opts = container.querySelectorAll(`[data-question="${qi}"].assessment-option`);
        opts[3].click(); // score=3 for all
      }
      const message = container.querySelector('#assessment-message').textContent;
      assert.ok(message.includes('sharpen and update'));
    });
  });

  describe('Mark Complete', () => {
    it('mark complete button exists', () => {
      const btn = container.querySelector('#ch1-complete-btn');
      assert.ok(btn);
      assert.ok(btn.textContent.includes('Mark as Complete'));
    });

    it('clicking mark complete updates progress to "complete"', () => {
      const btn = container.querySelector('#ch1-complete-btn');
      btn.click();
      const progress = app.getProgress();
      assert.equal(progress[1], 'complete');
    });

    it('button text changes after completing', () => {
      const btn = container.querySelector('#ch1-complete-btn');
      btn.click();
      assert.ok(btn.textContent.includes('Completed'));
    });

    it('button is disabled after completing', () => {
      const btn = container.querySelector('#ch1-complete-btn');
      btn.click();
      assert.equal(btn.disabled, true);
    });
  });

  describe('Already-completed state', () => {
    it('shows completed state when chapter was previously completed', () => {
      app.setChapterStatus(1, 'complete');
      app.navigateToChapter(1);
      const btn = container.querySelector('#ch1-complete-btn');
      assert.ok(btn.textContent.includes('Completed'));
      assert.equal(btn.disabled, true);
    });

    it('progress bar shows 100% for completed chapter', () => {
      app.setChapterStatus(1, 'complete');
      app.navigateToChapter(1);
      const bar = container.querySelector('#ch1-progress');
      assert.equal(bar.style.width, '100%');
    });
  });
});
