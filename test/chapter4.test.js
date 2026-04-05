const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { createTestEnv } = require('./setup');

describe('Chapter 4: Talking to AI', () => {
  let window, document, app, container;

  beforeEach(() => {
    const env = createTestEnv({ immediateTimers: true });
    window = env.window;
    document = env.document;
    app = window.LaunchpadApp;
    container = document.getElementById('chapter-container');
    app.setChapterStatus(2, 'complete');
    app.navigateToChapter(4);
  });

  describe('Rendering', () => {
    it('displays the chapter title', () => {
      assert.ok(container.textContent.includes('Talking to AI'));
    });

    it('displays the subtitle', () => {
      assert.ok(container.textContent.includes('great answers'));
    });

    it('displays time estimate', () => {
      assert.ok(container.textContent.includes('~15 min'));
    });

    it('renders the progress bar starting at 20%', () => {
      const bar = container.querySelector('#ch4-progress');
      assert.ok(bar);
      assert.equal(bar.style.width, '20%');
    });

    it('renders the R-T-C-F formula cards', () => {
      assert.ok(container.textContent.includes('Role'));
      assert.ok(container.textContent.includes('Task'));
      assert.ok(container.textContent.includes('Context'));
      assert.ok(container.textContent.includes('Format'));
    });

    it('renders before/after prompt comparison', () => {
      assert.ok(container.textContent.includes('Vague prompt'));
      assert.ok(container.textContent.includes('Strong prompt'));
    });

    it('renders the prompt makeover section', () => {
      assert.ok(container.textContent.includes('Fix the prompt'));
    });

    it('renders the live demo section', () => {
      assert.ok(container.textContent.includes('Try it yourself'));
    });

    it('renders the prompt builder section', () => {
      assert.ok(container.textContent.includes('Build a prompt'));
    });
  });

  describe('Prompt Makeover Exercise', () => {
    it('renders 3 vague prompts', () => {
      const questions = container.querySelector('#ch4-makeover-questions');
      const cards = questions.querySelectorAll('.card');
      assert.equal(cards.length, 3);
    });

    it('each prompt has 3 options', () => {
      for (let qi = 0; qi < 3; qi++) {
        const options = container.querySelectorAll(`[data-makeover-q="${qi}"].quiz-option`);
        assert.equal(options.length, 3, `Prompt ${qi + 1} should have 3 options`);
      }
    });

    it('Q1: correct answer is index 1', () => {
      const options = container.querySelectorAll('[data-makeover-q="0"].quiz-option');
      options[1].click();
      assert.ok(options[1].classList.contains('correct'));
    });

    it('Q2: correct answer is index 0', () => {
      const options = container.querySelectorAll('[data-makeover-q="1"].quiz-option');
      options[0].click();
      assert.ok(options[0].classList.contains('correct'));
    });

    it('Q3: correct answer is index 2', () => {
      const options = container.querySelectorAll('[data-makeover-q="2"].quiz-option');
      options[2].click();
      assert.ok(options[2].classList.contains('correct'));
    });

    it('wrong answer gets .incorrect class', () => {
      const options = container.querySelectorAll('[data-makeover-q="0"].quiz-option');
      options[0].click();
      assert.ok(options[0].classList.contains('incorrect'));
    });

    it('shows feedback after answering', () => {
      const options = container.querySelectorAll('[data-makeover-q="0"].quiz-option');
      options[1].click();
      const feedback = container.querySelector('[data-makeover-feedback="0"]');
      assert.ok(feedback.textContent.includes('formula in action'));
    });

    it('disables options after answering', () => {
      const options = container.querySelectorAll('[data-makeover-q="0"].quiz-option');
      options[1].click();
      options.forEach(opt => assert.equal(opt.disabled, true));
    });
  });

  describe('Live Prompt Lab', () => {
    it('has a textarea and send button', () => {
      assert.ok(container.querySelector('#ch4-demo-input'));
      assert.ok(container.querySelector('#ch4-demo-send'));
    });

    it('scenario cards pre-fill the textarea', () => {
      const card = container.querySelector('[data-scenario]');
      card.click();
      const textarea = container.querySelector('#ch4-demo-input');
      assert.ok(textarea.value.length > 0);
    });

    it('does nothing when textarea is empty', () => {
      const btn = container.querySelector('#ch4-demo-send');
      const responseDiv = container.querySelector('#ch4-demo-response');
      btn.click();
      assert.ok(responseDiv.classList.contains('hidden'));
    });

    it('displays mock response on send', async () => {
      const textarea = container.querySelector('#ch4-demo-input');
      const btn = container.querySelector('#ch4-demo-send');
      textarea.value = 'How do I write a good prompt to use AI?';
      btn.click();

      await new Promise(resolve => setTimeout(resolve, 50));

      const responseDiv = container.querySelector('#ch4-demo-response');
      assert.ok(!responseDiv.classList.contains('hidden'));
      assert.ok(responseDiv.textContent.includes('AI says'));
    });

    it('has 3 scenario cards', () => {
      const scenarios = container.querySelectorAll('[data-scenario]');
      assert.equal(scenarios.length, 3);
    });
  });

  describe('Prompt Builder', () => {
    it('has 4 input fields', () => {
      assert.ok(container.querySelector('#ch4-builder-role'));
      assert.ok(container.querySelector('#ch4-builder-task'));
      assert.ok(container.querySelector('#ch4-builder-context'));
      assert.ok(container.querySelector('#ch4-builder-format'));
    });

    it('has a Build My Prompt button', () => {
      const btn = container.querySelector('#ch4-builder-build');
      assert.ok(btn);
      assert.ok(btn.textContent.includes('Build'));
    });

    it('does not show result when fewer than 2 fields filled', () => {
      const roleInput = container.querySelector('#ch4-builder-role');
      roleInput.value = 'You are a coach';
      container.querySelector('#ch4-builder-build').click();
      const result = container.querySelector('#ch4-builder-result');
      assert.ok(result.classList.contains('hidden'));
    });

    it('shows assembled prompt when 2+ fields filled', () => {
      container.querySelector('#ch4-builder-role').value = 'You are a coach';
      container.querySelector('#ch4-builder-task').value = 'Help me prepare';
      container.querySelector('#ch4-builder-build').click();
      const result = container.querySelector('#ch4-builder-result');
      assert.ok(!result.classList.contains('hidden'));
      const prompt = container.querySelector('#ch4-builder-prompt');
      assert.ok(prompt.textContent.includes('coach'));
      assert.ok(prompt.textContent.includes('prepare'));
    });

    it('has a Send to AI button after building', () => {
      container.querySelector('#ch4-builder-role').value = 'Coach';
      container.querySelector('#ch4-builder-task').value = 'Help';
      container.querySelector('#ch4-builder-build').click();
      const sendBtn = container.querySelector('#ch4-builder-send');
      assert.ok(sendBtn);
    });
  });

  describe('Quiz', () => {
    it('renders 3 quiz questions', () => {
      const quizContainer = container.querySelector('#ch4-quiz');
      const questions = quizContainer.querySelectorAll('[class="mb-8"]');
      assert.equal(questions.length, 3);
    });

    it('each question has 4 options', () => {
      for (let qi = 0; qi < 3; qi++) {
        const options = container.querySelectorAll(`#ch4-quiz [data-quiz="${qi}"].quiz-option`);
        assert.equal(options.length, 4, `Question ${qi + 1} should have 4 options`);
      }
    });

    it('Q1: correct answer is index 1 (cover letter prompt)', () => {
      const options = container.querySelectorAll('#ch4-quiz [data-quiz="0"].quiz-option');
      options[1].click();
      assert.ok(options[1].classList.contains('correct'));
    });

    it('Q2: correct answer is index 2 (background information)', () => {
      const options = container.querySelectorAll('#ch4-quiz [data-quiz="1"].quiz-option');
      options[2].click();
      assert.ok(options[2].classList.contains('correct'));
    });

    it('Q3: correct answer is index 1 (full R-T-C-F prompt)', () => {
      const options = container.querySelectorAll('#ch4-quiz [data-quiz="2"].quiz-option');
      options[1].click();
      assert.ok(options[1].classList.contains('correct'));
    });
  });

  describe('Mark Complete', () => {
    it('mark complete button exists', () => {
      assert.ok(container.querySelector('#ch4-complete-btn'));
    });

    it('clicking mark complete sets chapter 4 to complete', () => {
      container.querySelector('#ch4-complete-btn').click();
      assert.equal(app.getProgress()[4], 'complete');
    });

    it('button text changes after completing', () => {
      const btn = container.querySelector('#ch4-complete-btn');
      btn.click();
      assert.ok(btn.textContent.includes('Completed'));
    });

    it('button is disabled after completing', () => {
      const btn = container.querySelector('#ch4-complete-btn');
      btn.click();
      assert.equal(btn.disabled, true);
    });
  });

  describe('Already-completed state', () => {
    it('shows completed state when previously completed', () => {
      app.setChapterStatus(4, 'complete');
      app.navigateToChapter(4);
      const btn = container.querySelector('#ch4-complete-btn');
      assert.ok(btn.textContent.includes('Completed'));
      assert.equal(btn.disabled, true);
    });

    it('progress bar shows 100% for completed chapter', () => {
      app.setChapterStatus(4, 'complete');
      app.navigateToChapter(4);
      const bar = container.querySelector('#ch4-progress');
      assert.equal(bar.style.width, '100%');
    });
  });
});
