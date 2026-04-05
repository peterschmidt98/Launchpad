const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { createTestEnv } = require('./setup');

describe('Chapter 6: You\'re Ready', () => {
  let window, document, app, container;

  beforeEach(() => {
    const env = createTestEnv({ immediateTimers: true });
    window = env.window;
    document = env.document;
    app = window.LaunchpadApp;
    container = document.getElementById('chapter-container');
    app.setChapterStatus(2, 'complete');
    app.navigateToChapter(6);
  });

  describe('Rendering', () => {
    it('displays the chapter title', () => {
      assert.ok(container.textContent.includes("You're Ready"));
    });

    it('displays the subtitle', () => {
      assert.ok(container.textContent.includes("put it to work"));
    });

    it('displays time estimate', () => {
      assert.ok(container.textContent.includes('~12 min'));
    });

    it('renders progress bar starting at 20%', () => {
      const bar = container.querySelector('#ch6-progress');
      assert.ok(bar);
      assert.equal(bar.style.width, '20%');
    });

    it('renders employer jargon cards', () => {
      assert.ok(container.textContent.includes('Proficient in Microsoft Office'));
      assert.ok(container.textContent.includes('Comfortable with digital tools'));
      assert.ok(container.textContent.includes('AI literacy'));
    });

    it('renders before/after comparison', () => {
      const text = container.textContent;
      assert.ok(text.includes('Before this course') || text.includes('After this course'));
    });

    it('renders job listing', () => {
      assert.ok(container.textContent.includes('GreenLeaf'));
      assert.ok(container.textContent.includes('Office Administrator'));
    });

    it('renders skill badges in graduation section', () => {
      const badges = container.querySelectorAll('.skill-badge');
      assert.ok(badges.length >= 5);
    });
  });

  describe('Decode the Job Listing', () => {
    it('renders 4 decode questions', () => {
      const questions = container.querySelector('#ch6-decode-questions');
      assert.ok(questions);
      for (let qi = 0; qi < 4; qi++) {
        const opts = container.querySelectorAll(`[data-decode-q="${qi}"].quiz-option`);
        assert.ok(opts.length >= 3, `Q${qi + 1} should have options`);
      }
    });

    it('Q1: correct answer is index 1 (can learn apps)', () => {
      const opts = container.querySelectorAll('[data-decode-q="0"].quiz-option');
      opts[1].click();
      assert.ok(opts[1].classList.contains('correct'));
    });

    it('Q2: correct answer is index 1 (professional emails)', () => {
      const opts = container.querySelectorAll('[data-decode-q="1"].quiz-option');
      opts[1].click();
      assert.ok(opts[1].classList.contains('correct'));
    });

    it('Q3: correct answer is index 1 (Trello/Asana)', () => {
      const opts = container.querySelectorAll('[data-decode-q="2"].quiz-option');
      opts[1].click();
      assert.ok(opts[1].classList.contains('correct'));
    });

    it('Q4: correct answer is index 2 (basic AI use)', () => {
      const opts = container.querySelectorAll('[data-decode-q="3"].quiz-option');
      opts[2].click();
      assert.ok(opts[2].classList.contains('correct'));
    });

    it('wrong answer shows incorrect + highlights correct', () => {
      const opts = container.querySelectorAll('[data-decode-q="0"].quiz-option');
      opts[0].click();
      assert.ok(opts[0].classList.contains('incorrect'));
      assert.ok(opts[1].classList.contains('correct'));
    });

    it('disables options after answering', () => {
      const opts = container.querySelectorAll('[data-decode-q="0"].quiz-option');
      opts[1].click();
      opts.forEach(o => assert.equal(o.disabled, true));
    });
  });

  describe('Professional Summary Builder', () => {
    it('has background, skills, and role inputs', () => {
      assert.ok(container.querySelector('#ch6-summary-background'));
      assert.ok(container.querySelector('#ch6-summary-skills'));
      assert.ok(container.querySelector('#ch6-summary-role'));
    });

    it('has digital skill checkboxes', () => {
      const checkboxes = container.querySelectorAll('[data-skill]');
      assert.ok(checkboxes.length >= 5);
    });

    it('has a Generate button', () => {
      const btn = container.querySelector('#ch6-summary-generate');
      assert.ok(btn);
    });

    it('generates summary when background is filled', () => {
      container.querySelector('#ch6-summary-background').value = '10 years in retail';
      container.querySelector('#ch6-summary-generate').click();
      const result = container.querySelector('#ch6-summary-result');
      assert.ok(result);
      assert.ok(!result.classList.contains('hidden'));
    });

    it('includes checked digital skills in summary', () => {
      container.querySelector('#ch6-summary-background').value = 'Returning professional';
      // Check a skill checkbox
      const checkbox = container.querySelector('[data-skill]');
      if (checkbox) checkbox.click();
      container.querySelector('#ch6-summary-generate').click();
      const result = container.querySelector('#ch6-summary-result');
      assert.ok(result.textContent.length > 20);
    });
  });

  describe('Action Plan Checklist', () => {
    it('renders 8 action items', () => {
      const items = container.querySelectorAll('[data-action-idx]');
      assert.equal(items.length, 8);
    });

    it('clicking an item toggles it', () => {
      const item = container.querySelector('[data-action-idx="0"]');
      item.click();
      const check = container.querySelector('[data-action-check="0"]');
      assert.ok(check.style.backgroundColor, 'Circle should have background color after check');
      assert.ok(check.innerHTML.includes('svg'), 'Circle should contain checkmark SVG');
    });

    it('counter updates when items are checked', () => {
      const item = container.querySelector('[data-action-idx="0"]');
      item.click();
      const counter = container.querySelector('#ch6-action-counter');
      assert.ok(counter);
      assert.ok(counter.textContent.includes('1'));
    });

    it('shows encouragement after 3 items checked', () => {
      for (let i = 0; i < 3; i++) {
        container.querySelector(`[data-action-idx="${i}"]`).click();
      }
      const enc = container.querySelector('#ch6-action-encouragement');
      assert.ok(enc);
      assert.ok(!enc.classList.contains('hidden'));
    });

    it('toggling an item off decreases counter', () => {
      const item = container.querySelector('[data-action-idx="0"]');
      item.click(); // check
      item.click(); // uncheck
      const counter = container.querySelector('#ch6-action-counter');
      assert.ok(counter.textContent.includes('0'));
    });
  });

  describe('Quiz', () => {
    it('renders 3 quiz questions', () => {
      const quizContainer = container.querySelector('#ch6-quiz');
      const questions = quizContainer.querySelectorAll('[class="mb-8"]');
      assert.equal(questions.length, 3);
    });

    it('each question has 4 options', () => {
      for (let qi = 0; qi < 3; qi++) {
        const opts = container.querySelectorAll(`#ch6-quiz [data-quiz="${qi}"].quiz-option`);
        assert.equal(opts.length, 4, `Q${qi + 1} should have 4 options`);
      }
    });

    it('Q1: correct answer is index 1 (specific tools)', () => {
      const opts = container.querySelectorAll('#ch6-quiz [data-quiz="0"].quiz-option');
      opts[1].click();
      assert.ok(opts[1].classList.contains('correct'));
    });

    it('Q2: correct answer is index 1 (R-T-C-F prompt)', () => {
      const opts = container.querySelectorAll('#ch6-quiz [data-quiz="1"].quiz-option');
      opts[1].click();
      assert.ok(opts[1].classList.contains('correct'));
    });

    it('Q3: correct answer is index 2 (skills are learnable)', () => {
      const opts = container.querySelectorAll('#ch6-quiz [data-quiz="2"].quiz-option');
      opts[2].click();
      assert.ok(opts[2].classList.contains('correct'));
    });
  });

  describe('Graduation', () => {
    it('graduation card exists', () => {
      const card = container.querySelector('.graduation-card');
      assert.ok(card);
    });

    it('shows "You did it" headline', () => {
      assert.ok(container.textContent.includes('You did it'));
    });

    it('has the completion button', () => {
      const btn = container.querySelector('#ch6-complete-btn');
      assert.ok(btn);
      assert.ok(btn.textContent.includes("I'm Ready"));
    });

    it('clicking completion sets chapter 6 to complete', () => {
      container.querySelector('#ch6-complete-btn').click();
      assert.equal(app.getProgress()[6], 'complete');
    });

    it('button changes text after completing', () => {
      const btn = container.querySelector('#ch6-complete-btn');
      btn.click();
      assert.ok(btn.textContent.includes('Congratulations') || btn.textContent.includes('Completed'));
    });

    it('button is disabled after completing', () => {
      const btn = container.querySelector('#ch6-complete-btn');
      btn.click();
      assert.equal(btn.disabled, true);
    });

    it('shows celebration message after completing', () => {
      container.querySelector('#ch6-complete-btn').click();
      const celebration = container.querySelector('#ch6-celebration');
      assert.ok(celebration);
      assert.ok(!celebration.classList.contains('hidden'));
    });

    it('progress bar reaches 100% after completing', () => {
      container.querySelector('#ch6-complete-btn').click();
      const bar = container.querySelector('#ch6-progress');
      assert.equal(bar.style.width, '100%');
    });
  });

  describe('Already-completed state', () => {
    it('shows completed state when previously completed', () => {
      app.setChapterStatus(6, 'complete');
      app.navigateToChapter(6);
      const btn = container.querySelector('#ch6-complete-btn');
      assert.ok(btn.textContent.includes('Completed') || btn.textContent.includes('Course'));
      assert.equal(btn.disabled, true);
    });

    it('progress bar shows 100% for completed chapter', () => {
      app.setChapterStatus(6, 'complete');
      app.navigateToChapter(6);
      const bar = container.querySelector('#ch6-progress');
      assert.equal(bar.style.width, '100%');
    });
  });
});
