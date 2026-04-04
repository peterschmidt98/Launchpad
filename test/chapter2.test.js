const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { createTestEnv } = require('./setup');

describe('Chapter 2: What is AI?', () => {
  let window, document, app, container;

  beforeEach(() => {
    const env = createTestEnv({ immediateTimers: true });
    window = env.window;
    document = env.document;
    app = window.LaunchpadApp;
    container = document.getElementById('chapter-container');
    app.navigateToChapter(2);
  });

  describe('Rendering', () => {
    it('displays the chapter title', () => {
      assert.ok(container.textContent.includes('What is AI?'));
    });

    it('displays the subtitle', () => {
      assert.ok(container.textContent.includes('No jargon. No hype.'));
    });

    it('displays time estimate', () => {
      assert.ok(container.textContent.includes('~12 min'));
    });

    it('renders AI explanation section', () => {
      assert.ok(container.textContent.includes('pattern recognition'));
    });

    it('renders good-at vs not-good-at comparison', () => {
      assert.ok(container.textContent.includes('Good at'));
      assert.ok(container.textContent.includes('Not good at'));
      assert.ok(container.textContent.includes('Summarizing long documents'));
      assert.ok(container.textContent.includes("Today's breaking news"));
    });

    it('renders 4 AI tool cards', () => {
      const text = container.textContent;
      assert.ok(text.includes('ChatGPT'));
      assert.ok(text.includes('Claude'));
      assert.ok(text.includes('Copilot'));
      assert.ok(text.includes('Gemini'));
    });

    it('renders the live demo section', () => {
      const textarea = container.querySelector('#demo-input');
      const sendBtn = container.querySelector('#demo-send');
      assert.ok(textarea, 'Demo textarea should exist');
      assert.ok(sendBtn, 'Send button should exist');
      assert.ok(container.textContent.includes('Simulated AI demo'));
    });
  });

  describe('Live Demo', () => {
    it('send button exists with correct text', () => {
      const btn = container.querySelector('#demo-send');
      assert.ok(btn.textContent.includes('Send'));
    });

    it('does nothing when textarea is empty', async () => {
      const btn = container.querySelector('#demo-send');
      const responseDiv = container.querySelector('#demo-response');
      btn.click();
      assert.ok(responseDiv.classList.contains('hidden'));
    });

    it('displays mock response on send', async () => {
      const textarea = container.querySelector('#demo-input');
      const btn = container.querySelector('#demo-send');
      textarea.value = 'What is AI?';
      btn.click();

      // Wait for mock delay (uses immediateTimers so should be fast)
      await new Promise(resolve => setTimeout(resolve, 50));

      const responseDiv = container.querySelector('#demo-response');
      assert.ok(!responseDiv.classList.contains('hidden'), 'Response should be visible');
      assert.ok(responseDiv.textContent.includes('Claude says'));
    });

    it('re-enables send button after response', async () => {
      const textarea = container.querySelector('#demo-input');
      const btn = container.querySelector('#demo-send');
      textarea.value = 'Hello';
      btn.click();

      await new Promise(resolve => setTimeout(resolve, 50));
      assert.equal(btn.disabled, false);
    });

    it('shows simulated demo label', () => {
      assert.ok(container.textContent.includes('Simulated AI demo'));
    });
  });

  describe('Quiz', () => {
    it('renders 3 quiz questions', () => {
      const quizContainer = container.querySelector('#ch2-quiz');
      const questions = quizContainer.querySelectorAll('[class="mb-8"]');
      assert.equal(questions.length, 3);
    });

    it('each question has 4 options', () => {
      for (let qi = 0; qi < 3; qi++) {
        const options = container.querySelectorAll(`[data-quiz="${qi}"].quiz-option`);
        assert.equal(options.length, 4, `Question ${qi + 1} should have 4 options`);
      }
    });

    it('correct answer gets .correct class', () => {
      // Q1: correct answer is index 1
      const options = container.querySelectorAll('[data-quiz="0"].quiz-option');
      options[1].click(); // correct
      assert.ok(options[1].classList.contains('correct'));
    });

    it('incorrect answer gets .incorrect class', () => {
      // Q1: click wrong answer (index 0)
      const options = container.querySelectorAll('[data-quiz="0"].quiz-option');
      options[0].click(); // incorrect
      assert.ok(options[0].classList.contains('incorrect'));
    });

    it('correct answer is always highlighted even when wrong answer is chosen', () => {
      // Q1: correct is index 1, click index 0
      const options = container.querySelectorAll('[data-quiz="0"].quiz-option');
      options[0].click();
      assert.ok(options[1].classList.contains('correct'), 'Correct answer should be highlighted');
    });

    it('shows feedback after answering', () => {
      const options = container.querySelectorAll('[data-quiz="0"].quiz-option');
      options[1].click();
      const feedback = container.querySelector('[data-quiz-feedback="0"]');
      assert.ok(feedback.textContent.includes('Exactly right'));
    });

    it('shows explanation for wrong answers', () => {
      const options = container.querySelectorAll('[data-quiz="0"].quiz-option');
      options[0].click(); // "Robots and machines" - wrong
      const feedback = container.querySelector('[data-quiz-feedback="0"]');
      assert.ok(feedback.textContent.includes('Not quite'));
    });

    it('disables options after answering a question', () => {
      const options = container.querySelectorAll('[data-quiz="0"].quiz-option');
      options[1].click();
      options.forEach(opt => {
        assert.equal(opt.disabled, true, 'Option should be disabled after answering');
      });
    });

    it('Q2: correct answer is index 2 (knowing what happened yesterday)', () => {
      const options = container.querySelectorAll('[data-quiz="1"].quiz-option');
      options[2].click();
      assert.ok(options[2].classList.contains('correct'));
      const feedback = container.querySelector('[data-quiz-feedback="1"]');
      assert.ok(feedback.textContent.includes('Exactly right'));
    });

    it('Q3: correct answer is index 3 (Anthropic)', () => {
      const options = container.querySelectorAll('[data-quiz="2"].quiz-option');
      options[3].click();
      assert.ok(options[3].classList.contains('correct'));
      const feedback = container.querySelector('[data-quiz-feedback="2"]');
      assert.ok(feedback.textContent.includes('Exactly right'));
    });
  });

  describe('Mark Complete', () => {
    it('mark complete button exists', () => {
      const btn = container.querySelector('#ch2-complete-btn');
      assert.ok(btn);
    });

    it('clicking mark complete sets chapter 2 to "complete"', () => {
      const btn = container.querySelector('#ch2-complete-btn');
      btn.click();
      const progress = app.getProgress();
      assert.equal(progress[2], 'complete');
    });

    it('completing chapter 2 unlocks chapters 3-6', () => {
      const btn = container.querySelector('#ch2-complete-btn');
      btn.click();
      for (let i = 3; i <= 6; i++) {
        assert.equal(app.isChapterUnlocked(i), true, `Chapter ${i} should be unlocked`);
      }
    });

    it('shows unlock message after completing', () => {
      const btn = container.querySelector('#ch2-complete-btn');
      btn.click();
      const msg = container.querySelector('#ch2-complete-msg');
      assert.ok(msg.textContent.includes('unlocked'));
    });
  });

  describe('Coming soon chapters render after unlock', () => {
    it('chapter 3 renders full content after unlock', () => {
      app.setChapterStatus(2, 'complete');
      app.navigateToChapter(3);
      assert.ok(container.textContent.includes('Your Core Toolkit'));
      assert.ok(container.textContent.includes('Spreadsheets'));
    });

    it('chapter 4 shows coming soon content', () => {
      app.setChapterStatus(2, 'complete');
      app.navigateToChapter(4);
      assert.ok(container.textContent.includes('Talking to AI'));
      assert.ok(container.textContent.includes('Coming Soon'));
    });

    it('chapter 5 shows coming soon content', () => {
      app.setChapterStatus(2, 'complete');
      app.navigateToChapter(5);
      assert.ok(container.textContent.includes('Getting Things Done'));
    });

    it('chapter 6 shows coming soon content', () => {
      app.setChapterStatus(2, 'complete');
      app.navigateToChapter(6);
      assert.ok(container.textContent.includes("You're Ready"));
    });
  });
});
