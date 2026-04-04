const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { createTestEnv } = require('./setup');

describe('Chapter 3: Your Core Toolkit', () => {
  let window, document, app, container;

  beforeEach(() => {
    const env = createTestEnv({ immediateTimers: true });
    window = env.window;
    document = env.document;
    app = window.LaunchpadApp;
    container = document.getElementById('chapter-container');
    // Unlock chapter 3 by completing chapter 2
    app.setChapterStatus(2, 'complete');
    app.navigateToChapter(3);
  });

  describe('Rendering', () => {
    it('displays the chapter title', () => {
      assert.ok(container.textContent.includes('Your Core Toolkit'));
    });

    it('displays the subtitle', () => {
      assert.ok(container.textContent.includes('explained like a friend would'));
    });

    it('displays time estimate', () => {
      assert.ok(container.textContent.includes('~15 min'));
    });

    it('renders the progress bar', () => {
      const bar = container.querySelector('#ch3-progress');
      assert.ok(bar, 'Progress bar should exist');
    });

    it('renders spreadsheet section', () => {
      assert.ok(container.textContent.includes('Spreadsheets'));
      assert.ok(container.textContent.includes('=SUM()'));
    });

    it('renders email section', () => {
      assert.ok(container.textContent.includes('Email & calendar'));
      assert.ok(container.textContent.includes('professional home base'));
    });

    it('renders search section', () => {
      assert.ok(container.textContent.includes('Smarter searching'));
      assert.ok(container.textContent.includes('site:'));
    });

    it('renders Google Sheets vs Excel comparison', () => {
      assert.ok(container.textContent.includes('Google Sheets'));
      assert.ok(container.textContent.includes('Microsoft Excel'));
    });
  });

  describe('Spreadsheet Exercise', () => {
    it('renders the spreadsheet grid', () => {
      const table = container.querySelector('.spreadsheet-grid');
      assert.ok(table, 'Spreadsheet table should exist');
    });

    it('has a formula input field', () => {
      const input = container.querySelector('#ch3-formula-input');
      assert.ok(input, 'Formula input should exist');
    });

    it('has a check button', () => {
      const btn = container.querySelector('#ch3-formula-check');
      assert.ok(btn, 'Check button should exist');
    });

    it('accepts =SUM(B2:B3) as correct', () => {
      const input = container.querySelector('#ch3-formula-input');
      const btn = container.querySelector('#ch3-formula-check');
      input.value = '=SUM(B2:B3)';
      btn.click();
      const feedback = container.querySelector('#ch3-formula-feedback');
      assert.ok(feedback.textContent.includes('1,550'));
    });

    it('is case-insensitive', () => {
      const input = container.querySelector('#ch3-formula-input');
      const btn = container.querySelector('#ch3-formula-check');
      input.value = '=sum(b2:b3)';
      btn.click();
      const feedback = container.querySelector('#ch3-formula-feedback');
      assert.ok(feedback.textContent.includes('1,550'));
    });

    it('accepts =B2+B3 as correct', () => {
      const input = container.querySelector('#ch3-formula-input');
      const btn = container.querySelector('#ch3-formula-check');
      input.value = '=B2+B3';
      btn.click();
      const feedback = container.querySelector('#ch3-formula-feedback');
      assert.ok(feedback.textContent.includes('1,550'));
    });

    it('shows hint for incorrect formula', () => {
      const input = container.querySelector('#ch3-formula-input');
      const btn = container.querySelector('#ch3-formula-check');
      input.value = 'hello';
      btn.click();
      const feedback = container.querySelector('#ch3-formula-feedback');
      assert.ok(feedback.textContent.includes('Not quite'));
      assert.ok(feedback.textContent.includes('=SUM(B2:B3)'));
    });

    it('shows 1550 in the cell after correct answer', () => {
      const input = container.querySelector('#ch3-formula-input');
      const btn = container.querySelector('#ch3-formula-check');
      input.value = '=SUM(B2:B3)';
      btn.click();
      const cell = container.querySelector('#ch3-formula-cell');
      assert.ok(cell.textContent.includes('1550'));
    });

    it('disables check button after correct answer', () => {
      const input = container.querySelector('#ch3-formula-input');
      const btn = container.querySelector('#ch3-formula-check');
      input.value = '=SUM(B2:B3)';
      btn.click();
      assert.equal(btn.disabled, true);
    });

    it('does nothing when input is empty', () => {
      const btn = container.querySelector('#ch3-formula-check');
      btn.click();
      const feedback = container.querySelector('#ch3-formula-feedback');
      assert.equal(feedback.innerHTML, '');
    });
  });

  describe('Email Exercise', () => {
    it('renders two email choices', () => {
      const emailA = container.querySelector('#ch3-email-a');
      const emailB = container.querySelector('#ch3-email-b');
      assert.ok(emailA);
      assert.ok(emailB);
    });

    it('clicking Email B (correct) shows positive feedback', () => {
      const emailB = container.querySelector('#ch3-email-b');
      emailB.click();
      assert.ok(emailB.classList.contains('selected-correct'));
      const feedback = container.querySelector('#ch3-email-feedback');
      assert.ok(feedback.textContent.includes('Exactly right'));
    });

    it('clicking Email A (incorrect) highlights B as correct', () => {
      const emailA = container.querySelector('#ch3-email-a');
      const emailB = container.querySelector('#ch3-email-b');
      emailA.click();
      assert.ok(emailA.classList.contains('selected-incorrect'));
      assert.ok(emailB.classList.contains('selected-correct'));
    });

    it('disables choices after answering', () => {
      const emailA = container.querySelector('#ch3-email-a');
      const emailB = container.querySelector('#ch3-email-b');
      emailB.click();
      assert.ok(emailA.classList.contains('disabled'));
      assert.ok(emailB.classList.contains('disabled'));
    });

    it('only allows one answer', () => {
      const emailB = container.querySelector('#ch3-email-b');
      const emailA = container.querySelector('#ch3-email-a');
      emailB.click();
      // Try clicking A after answering — should not change
      emailA.click();
      assert.ok(!emailA.classList.contains('selected-incorrect'));
    });
  });

  describe('Search Exercise', () => {
    it('renders 3 search scenarios', () => {
      const questions = container.querySelector('#ch3-search-questions');
      const cards = questions.querySelectorAll('.card');
      assert.equal(cards.length, 3);
    });

    it('each scenario has 3 options', () => {
      for (let qi = 0; qi < 3; qi++) {
        const options = container.querySelectorAll(`[data-search-q="${qi}"].quiz-option`);
        assert.equal(options.length, 3, `Scenario ${qi + 1} should have 3 options`);
      }
    });

    it('correct answer gets .correct class', () => {
      // Q1 correct is index 1
      const options = container.querySelectorAll('[data-search-q="0"].quiz-option');
      options[1].click();
      assert.ok(options[1].classList.contains('correct'));
    });

    it('incorrect answer gets .incorrect class', () => {
      const options = container.querySelectorAll('[data-search-q="0"].quiz-option');
      options[0].click();
      assert.ok(options[0].classList.contains('incorrect'));
    });

    it('shows feedback after answering', () => {
      const options = container.querySelectorAll('[data-search-q="0"].quiz-option');
      options[1].click();
      const feedback = container.querySelector('[data-search-feedback="0"]');
      assert.ok(feedback.textContent.includes('Great instinct'));
    });

    it('disables options after answering', () => {
      const options = container.querySelectorAll('[data-search-q="0"].quiz-option');
      options[1].click();
      options.forEach(opt => {
        assert.equal(opt.disabled, true);
      });
    });
  });

  describe('Quiz', () => {
    it('renders 4 quiz questions', () => {
      const quizContainer = container.querySelector('#ch3-quiz');
      const questions = quizContainer.querySelectorAll('[class="mb-8"]');
      assert.equal(questions.length, 4);
    });

    it('each question has 4 options', () => {
      for (let qi = 0; qi < 4; qi++) {
        const options = container.querySelectorAll(`#ch3-quiz [data-quiz="${qi}"].quiz-option`);
        assert.equal(options.length, 4, `Question ${qi + 1} should have 4 options`);
      }
    });

    it('Q1: correct answer is index 1 (adds up values)', () => {
      const options = container.querySelectorAll('#ch3-quiz [data-quiz="0"].quiz-option');
      options[1].click();
      assert.ok(options[1].classList.contains('correct'));
    });

    it('Q2: correct answer is index 2 (specific subject line)', () => {
      const options = container.querySelectorAll('#ch3-quiz [data-quiz="1"].quiz-option');
      options[2].click();
      assert.ok(options[2].classList.contains('correct'));
    });

    it('Q3: correct answer is index 1 (exact phrase)', () => {
      const options = container.querySelectorAll('#ch3-quiz [data-quiz="2"].quiz-option');
      options[1].click();
      assert.ok(options[1].classList.contains('correct'));
    });

    it('Q4: correct answer is index 2 (Sheets or Excel)', () => {
      const options = container.querySelectorAll('#ch3-quiz [data-quiz="3"].quiz-option');
      options[2].click();
      assert.ok(options[2].classList.contains('correct'));
    });
  });

  describe('Mark Complete', () => {
    it('mark complete button exists', () => {
      const btn = container.querySelector('#ch3-complete-btn');
      assert.ok(btn);
    });

    it('clicking mark complete sets chapter 3 to complete', () => {
      const btn = container.querySelector('#ch3-complete-btn');
      btn.click();
      const progress = app.getProgress();
      assert.equal(progress[3], 'complete');
    });

    it('button text changes after completing', () => {
      const btn = container.querySelector('#ch3-complete-btn');
      btn.click();
      assert.ok(btn.textContent.includes('Completed'));
    });

    it('button is disabled after completing', () => {
      const btn = container.querySelector('#ch3-complete-btn');
      btn.click();
      assert.equal(btn.disabled, true);
    });
  });

  describe('Already-completed state', () => {
    it('shows completed state when previously completed', () => {
      app.setChapterStatus(3, 'complete');
      app.navigateToChapter(3);
      const btn = container.querySelector('#ch3-complete-btn');
      assert.ok(btn.textContent.includes('Completed'));
      assert.equal(btn.disabled, true);
    });

    it('progress bar shows 100% for completed chapter', () => {
      app.setChapterStatus(3, 'complete');
      app.navigateToChapter(3);
      const bar = container.querySelector('#ch3-progress');
      assert.equal(bar.style.width, '100%');
    });
  });
});
