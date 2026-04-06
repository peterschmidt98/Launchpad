/**
 * User simulation: Maria, 52, returning to work after 8 years raising kids.
 * Nervous about technology, never used AI.
 *
 * This script walks through every chapter of Launchpad as Maria would,
 * verifying the experience is welcoming, encouraging, and never intimidating.
 *
 * Run:  node test/user-sim-maria.js
 */

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { createTestEnv } = require('./setup');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Click a DOM element, firing the 'click' event. */
function click(el, label) {
  assert.ok(el, `Element should exist: ${label || 'unknown'}`);
  el.click();
}

/** Set an input/textarea value and dispatch an 'input' event. */
function fillInput(el, value, label) {
  assert.ok(el, `Input should exist: ${label || 'unknown'}`);
  el.value = value;
  el.dispatchEvent(new el.ownerDocument.defaultView.Event('input', { bubbles: true }));
}

/** Assert that text contains at least one of the given positive words. */
function assertEncouraging(text, context) {
  const positiveWords = ['right', 'great', 'exactly', 'well', 'good', 'nice',
    'awesome', 'ahead', 'excellent', 'spirit', 'congratulations', 'proud',
    'real', 'doing', 'got this', 'surprise', 'already', 'unlocked', 'shape',
    'correct', 'strong', 'specific', 'formula', 'action', 'spot on',
    'instinct', 'useful', 'works', 'built for', 'smart', 'best', 'learn'];
  const lower = text.toLowerCase();
  const found = positiveWords.some(w => lower.includes(w));
  assert.ok(found, `Expected encouraging language in "${context}". Got: "${text.slice(0, 200)}..."`);
}

/** Assert that text does NOT use discouraging words in a negative way. */
function assertNotScary(text, context) {
  const scaryWords = ['failed', 'failure', 'stupid', 'dumb', 'terrible'];
  const lower = text.toLowerCase();
  for (const w of scaryWords) {
    assert.ok(!lower.includes(w), `Discouraging word "${w}" found in "${context}"`);
  }
  // "wrong" is okay when used in "no wrong answers" or "right or wrong" context
  // but should not appear as a standalone judgment like "you were wrong"
  if (lower.includes('you were wrong') || lower.includes('that is wrong') || lower.includes('that\'s wrong')) {
    assert.fail(`Harsh "wrong" phrasing found in "${context}"`);
  }
}

/** Wait for pending microtasks + immediate timers (api.js delay resolves at 0ms). */
async function flush(window, rounds = 5) {
  for (let i = 0; i < rounds; i++) {
    await new Promise(r => setTimeout(r, 0));
    // Also pump jsdom's promise queue
    await new Promise(r => window.setTimeout(r, 0));
  }
}

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe('Maria\'s full journey through Launchpad', () => {
  let window, document, app, container;

  beforeEach(() => {
    const env = createTestEnv({ immediateTimers: true });
    window = env.window;
    document = env.document;
    app = window.LaunchpadApp;
    container = document.getElementById('chapter-container');
  });

  // =========================================================================
  // Step 1 — Landing
  // =========================================================================
  describe('Step 1: Landing on the app', () => {
    it('shows a welcoming title, not something scary', () => {
      const title = document.querySelector('title').textContent;
      assert.ok(title.toLowerCase().includes('launchpad'), 'Page title should mention Launchpad');

      const sidebar = document.getElementById('sidebar');
      assert.ok(sidebar, 'Sidebar should be present');
      assert.ok(sidebar.textContent.includes('Launchpad'), 'Sidebar has app name');

      const footerText = sidebar.textContent;
      assert.ok(footerText.includes('Your return to the workforce'), 'Sidebar footer is welcoming');
    });

    it('starts on chapter 1 with a warm welcome message', () => {
      const text = container.textContent;
      assert.ok(text.includes('Welcome'), 'Chapter 1 opens with "Welcome"');
      assert.ok(text.includes('haven\'t missed the boat'), 'Reassuring message is visible');
      assertNotScary(text, 'chapter 1 intro');
    });

    it('shows all 6 chapters in the sidebar', () => {
      const navItems = document.querySelectorAll('#chapter-list .chapter-nav-item');
      assert.equal(navItems.length, 6, 'Should list 6 chapters');
    });
  });

  // =========================================================================
  // Step 2 — Chapter 1: Self-assessment as a nervous beginner
  // =========================================================================
  describe('Step 2: Chapter 1 — self-assessment (nervous beginner)', () => {
    it('shows 4 assessment questions', () => {
      const questions = container.querySelectorAll('#assessment-questions .assessment-option');
      // 4 questions x 4 options = 16 buttons
      assert.equal(questions.length, 16, 'Should have 16 assessment option buttons (4 x 4)');
    });

    it('picking the lowest option for all 4 questions shows encouraging result', () => {
      // Pick first option (index 0, score 0) for each question — the most nervous choice
      for (let qi = 0; qi < 4; qi++) {
        const btn = container.querySelector(`.assessment-option[data-question="${qi}"][data-option="0"]`);
        click(btn, `assessment q${qi} lowest option`);
        assert.ok(btn.classList.contains('selected'), `Q${qi} option should be selected`);
      }

      // Result should appear
      const result = container.querySelector('#assessment-result');
      assert.ok(!result.classList.contains('hidden'), 'Assessment result should be visible');

      const message = container.querySelector('#assessment-message').textContent;
      assert.ok(message.includes('starting from the right place'), 'Message says "starting from the right place"');
      assertEncouraging(message, 'assessment result');
      assertNotScary(message, 'assessment result');
    });

    it('mark complete saves progress and triggers navigation', async () => {
      // Answer assessment first
      for (let qi = 0; qi < 4; qi++) {
        click(container.querySelector(`.assessment-option[data-question="${qi}"][data-option="0"]`));
      }

      const btn = container.querySelector('#ch1-complete-btn');
      assert.ok(btn, 'Complete button exists');
      click(btn, 'ch1 complete btn');

      // Verify progress saved
      const progress = app.getProgress();
      assert.equal(progress[1], 'complete', 'Chapter 1 should be complete');

      // The button should show completed state
      assert.ok(btn.classList.contains('completed'), 'Button shows completed state');

      // Wait for the setTimeout navigation to fire
      await flush(window, 5);

      // Chapter 2 should now be rendered
      const text = container.textContent;
      assert.ok(text.includes('What is AI'), 'Should have navigated to Chapter 2');
    });
  });

  // =========================================================================
  // Step 3 — Chapter 2: AI intro, live demo, quiz
  // =========================================================================
  describe('Step 3: Chapter 2 — learn about AI', () => {
    beforeEach(() => {
      // Complete ch1 and navigate to ch2
      app.setChapterStatus(1, 'complete');
      app.navigateToChapter(2);
    });

    it('explains AI in plain language', () => {
      const text = container.textContent;
      assert.ok(text.includes('pattern recognition'), 'Explains AI as pattern recognition');
      assert.ok(text.includes('tool'), 'Calls AI a tool');
      assertNotScary(text, 'chapter 2 intro');
    });

    it('live demo responds encouragingly to a scared beginner', async () => {
      const input = container.querySelector('#demo-input');
      const sendBtn = container.querySelector('#demo-send');

      fillInput(input, "I'm scared of technology and feel overwhelmed");
      click(sendBtn, 'demo send');

      await flush(window, 10);

      const responseDiv = container.querySelector('#demo-response');
      assert.ok(!responseDiv.classList.contains('hidden'), 'Response should be visible');

      const responseText = responseDiv.textContent;
      assertEncouraging(responseText, 'AI demo response to scared beginner');
      assertNotScary(responseText, 'AI demo response');
      // "scared" keyword should trigger the encouraging response
      assert.ok(responseText.includes('normal to feel that way') || responseText.includes('one step at a time') || responseText.includes('got this'),
        'Response should address fear with encouragement');
    });

    it('quiz: get Q1 wrong first, then answer all correctly', () => {
      const quizContainer = container.querySelector('#ch2-quiz');

      // Q1: wrong answer first (option 0 — "Robots and machines")
      const q1Wrong = quizContainer.querySelector('[data-quiz="0"][data-option="0"]');
      click(q1Wrong, 'quiz q1 wrong answer');

      // Check feedback appears and is not harsh
      const fb1 = quizContainer.querySelector('[data-quiz-feedback="0"]');
      assert.ok(fb1.textContent.length > 0, 'Feedback should appear for Q1');
      assertNotScary(fb1.textContent, 'quiz q1 wrong feedback');
      // The wrong answer button should be disabled now, correct highlighted
      assert.ok(q1Wrong.disabled, 'Wrong button should be disabled');
      assert.ok(q1Wrong.classList.contains('incorrect'), 'Wrong answer gets incorrect class');

      // Q2: correct (option 2 — "Knowing what happened yesterday")
      click(quizContainer.querySelector('[data-quiz="1"][data-option="2"]'), 'quiz q2 correct');
      const fb2 = quizContainer.querySelector('[data-quiz-feedback="1"]');
      assertEncouraging(fb2.textContent, 'quiz q2 correct feedback');

      // Q3: correct (option 3 — "Anthropic")
      click(quizContainer.querySelector('[data-quiz="2"][data-option="3"]'), 'quiz q3 correct');
      const fb3 = quizContainer.querySelector('[data-quiz-feedback="2"]');
      assertEncouraging(fb3.textContent, 'quiz q3 correct feedback');
    });

    it('mark complete shows unlocked message', () => {
      const btn = container.querySelector('#ch2-complete-btn');
      click(btn, 'ch2 complete');

      const progress = app.getProgress();
      assert.equal(progress[2], 'complete', 'Chapter 2 should be complete');

      const msg = container.querySelector('#ch2-complete-msg');
      assert.ok(msg.textContent.includes('unlocked'), 'Should mention unlocking the rest');
    });
  });

  // =========================================================================
  // Step 4 — Chapter 3: Spreadsheet, email, search, quiz
  // =========================================================================
  describe('Step 4: Chapter 3 — core toolkit', () => {
    beforeEach(() => {
      app.setChapterStatus(1, 'complete');
      app.setChapterStatus(2, 'complete');
      app.navigateToChapter(3);
    });

    it('spreadsheet exercise: wrong formula first, then correct', () => {
      const input = container.querySelector('#ch3-formula-input');
      const checkBtn = container.querySelector('#ch3-formula-check');

      // Try a wrong formula
      fillInput(input, '=AVERAGE(B2:B3)');
      click(checkBtn, 'formula check (wrong)');

      const fb = container.querySelector('#ch3-formula-feedback');
      assert.ok(fb.textContent.includes('Not quite'), 'Wrong formula gets gentle "Not quite"');
      assertNotScary(fb.textContent, 'wrong formula feedback');

      // Now try the correct formula
      fillInput(input, '=SUM(B2:B3)');
      click(checkBtn, 'formula check (correct)');

      assert.ok(fb.textContent.includes('first formula'), 'Correct formula celebrated');
      assertEncouraging(fb.textContent, 'correct formula feedback');

      // Cell should show result
      const cell = container.querySelector('#ch3-formula-cell');
      assert.ok(cell.textContent.includes('1550'), 'Cell shows computed value 1550');
    });

    it('email exercise: pick wrong email A, see correction', () => {
      const emailA = container.querySelector('#ch3-email-a');
      click(emailA, 'email choice A (wrong)');

      const fb = container.querySelector('#ch3-email-feedback');
      assert.ok(fb.textContent.length > 0, 'Feedback shown for email choice');
      assert.ok(fb.textContent.includes('Not quite') || fb.textContent.includes('too casual'),
        'Explains why Email A is wrong');
      assertNotScary(fb.textContent, 'email feedback');

      // Email B should be highlighted as correct
      const emailB = container.querySelector('#ch3-email-b');
      assert.ok(emailB.classList.contains('selected-correct'), 'Email B highlighted as correct');
    });

    it('search exercise: answer all 3 questions', () => {
      const searchContainer = container.querySelector('#ch3-search-questions');

      // Q1: correct = option 1
      click(searchContainer.querySelector('[data-search-q="0"][data-search-opt="1"]'), 'search q1');
      const fb1 = searchContainer.querySelector('[data-search-feedback="0"]');
      assertEncouraging(fb1.textContent, 'search q1 feedback');

      // Q2: correct = option 0
      click(searchContainer.querySelector('[data-search-q="1"][data-search-opt="0"]'), 'search q2');
      const fb2 = searchContainer.querySelector('[data-search-feedback="1"]');
      assertEncouraging(fb2.textContent, 'search q2 feedback');

      // Q3: correct = option 1
      click(searchContainer.querySelector('[data-search-q="2"][data-search-opt="1"]'), 'search q3');
      const fb3 = searchContainer.querySelector('[data-search-feedback="2"]');
      assertEncouraging(fb3.textContent, 'search q3 feedback');
    });

    it('chapter quiz: answer all 4 correctly', () => {
      const quizContainer = container.querySelector('#ch3-quiz');

      // Q1 correct=1, Q2 correct=2, Q3 correct=1, Q4 correct=2
      const answers = [1, 2, 1, 2];
      answers.forEach((ans, qi) => {
        click(quizContainer.querySelector(`[data-quiz="${qi}"][data-option="${ans}"]`), `ch3 quiz q${qi}`);
        const fb = quizContainer.querySelector(`[data-quiz-feedback="${qi}"]`);
        assertEncouraging(fb.textContent, `ch3 quiz q${qi} feedback`);
      });
    });

    it('mark complete and navigate to chapter 4', async () => {
      const btn = container.querySelector('#ch3-complete-btn');
      click(btn, 'ch3 complete');

      const progress = app.getProgress();
      assert.equal(progress[3], 'complete', 'Chapter 3 should be complete');

      const msg = container.querySelector('#ch3-complete-msg');
      assert.ok(msg.textContent.includes('Great work'), 'Completion message is encouraging');

      // Wait for setTimeout navigation
      await flush(window, 5);

      // Should auto-navigate to ch4
      assert.ok(container.textContent.includes('Talking to AI'), 'Navigated to Chapter 4');
    });
  });

  // =========================================================================
  // Step 5 — Chapter 4: Prompting
  // =========================================================================
  describe('Step 5: Chapter 4 — talking to AI', () => {
    beforeEach(() => {
      app.setChapterStatus(1, 'complete');
      app.setChapterStatus(2, 'complete');
      app.setChapterStatus(3, 'complete');
      app.navigateToChapter(4);
    });

    it('prompt makeover: answer all 3 correctly', () => {
      const makeoverContainer = container.querySelector('#ch4-makeover-questions');

      // Q1 correct=1, Q2 correct=0, Q3 correct=2
      const answers = [1, 0, 2];
      answers.forEach((ans, qi) => {
        click(makeoverContainer.querySelector(`[data-makeover-q="${qi}"][data-makeover-opt="${ans}"]`),
          `makeover q${qi}`);
        const fb = makeoverContainer.querySelector(`[data-makeover-feedback="${qi}"]`);
        assert.ok(fb.textContent.length > 0, `Makeover q${qi} feedback visible`);
        assertNotScary(fb.textContent, `makeover q${qi} feedback`);
      });
    });

    it('use a scenario card in the live demo', async () => {
      // Click the first scenario card ("Ask about prompting")
      const scenarioCard = container.querySelector('[data-scenario]');
      click(scenarioCard, 'scenario card');

      const textarea = container.querySelector('#ch4-demo-input');
      assert.ok(textarea.value.length > 0, 'Scenario card fills textarea');

      // Send it
      const sendBtn = container.querySelector('#ch4-demo-send');
      click(sendBtn, 'ch4 demo send');

      await flush(window, 10);

      const responseDiv = container.querySelector('#ch4-demo-response');
      assert.ok(!responseDiv.classList.contains('hidden'), 'Demo response visible');
      assertEncouraging(responseDiv.textContent, 'ch4 demo response');
    });

    it('build a prompt with the builder (R-T-C-F)', () => {
      const roleInput = container.querySelector('#ch4-builder-role');
      const taskInput = container.querySelector('#ch4-builder-task');
      const contextInput = container.querySelector('#ch4-builder-context');
      const formatInput = container.querySelector('#ch4-builder-format');

      fillInput(roleInput, 'You are a friendly career coach');
      fillInput(taskInput, 'Help me write an introduction email');
      fillInput(contextInput, 'I\'m returning to work after 8 years raising kids');
      fillInput(formatInput, 'Keep it warm and under 100 words');

      click(container.querySelector('#ch4-builder-build'), 'build prompt');

      const resultDiv = container.querySelector('#ch4-builder-result');
      assert.ok(!resultDiv.classList.contains('hidden'), 'Builder result visible');

      const prompt = container.querySelector('#ch4-builder-prompt').textContent;
      assert.ok(prompt.includes('career coach'), 'Assembled prompt includes role');
      assert.ok(prompt.includes('introduction email'), 'Assembled prompt includes task');
      assert.ok(prompt.includes('8 years'), 'Assembled prompt includes context');
    });

    it('chapter quiz: answer all 3 correctly', () => {
      const quizContainer = container.querySelector('#ch4-quiz');
      // Q1 correct=1, Q2 correct=2, Q3 correct=1
      const answers = [1, 2, 1];
      answers.forEach((ans, qi) => {
        click(quizContainer.querySelector(`[data-quiz="${qi}"][data-option="${ans}"]`), `ch4 quiz q${qi}`);
        const fb = quizContainer.querySelector(`[data-quiz-feedback="${qi}"]`);
        assertEncouraging(fb.textContent, `ch4 quiz q${qi} feedback`);
      });
    });

    it('mark complete and navigate to chapter 5', async () => {
      const btn = container.querySelector('#ch4-complete-btn');
      click(btn, 'ch4 complete');

      assert.equal(app.getProgress()[4], 'complete', 'Chapter 4 complete');

      await flush(window, 5);

      assert.ok(container.textContent.includes('Getting Things Done'), 'Navigated to Chapter 5');
    });
  });

  // =========================================================================
  // Step 6 — Chapter 5: Project management
  // =========================================================================
  describe('Step 6: Chapter 5 — getting things done', () => {
    beforeEach(() => {
      for (let i = 1; i <= 4; i++) app.setChapterStatus(i, 'complete');
      app.navigateToChapter(5);
    });

    it('organize tasks exercise: get some wrong, finish all', () => {
      const tasksContainer = container.querySelector('#ch5-organize-tasks');

      // Tasks: 0=done, 1=progress, 2=todo, 3=progress, 4=todo, 5=todo
      // Maria gets task 0 wrong (picks 'todo' instead of 'done')
      click(tasksContainer.querySelector('[data-task-idx="0"][data-col="todo"]'), 'task 0 wrong');
      const fb0 = tasksContainer.querySelector('[data-organize-feedback="0"]');
      assert.ok(fb0.textContent.includes('Done'), 'Shows correct column for task 0');

      // Task 1 wrong (picks 'done' instead of 'progress')
      click(tasksContainer.querySelector('[data-task-idx="1"][data-col="done"]'), 'task 1 wrong');

      // Tasks 2-5 correct
      click(tasksContainer.querySelector('[data-task-idx="2"][data-col="todo"]'), 'task 2 correct');
      click(tasksContainer.querySelector('[data-task-idx="3"][data-col="progress"]'), 'task 3 correct');
      click(tasksContainer.querySelector('[data-task-idx="4"][data-col="todo"]'), 'task 4 correct');
      click(tasksContainer.querySelector('[data-task-idx="5"][data-col="todo"]'), 'task 5 correct');

      // Result message
      const result = container.querySelector('#ch5-organize-result');
      assert.ok(!result.classList.contains('hidden'), 'Organize result visible');
      assertEncouraging(result.textContent, 'organize result');
    });

    it('add 2 job applications to the board', () => {
      const titleInput = container.querySelector('#ch5-job-title');
      const companyInput = container.querySelector('#ch5-job-company');
      const nextInput = container.querySelector('#ch5-job-next');
      const addBtn = container.querySelector('#ch5-add-card');

      // Job 1
      fillInput(titleInput, 'Office Administrator');
      fillInput(companyInput, 'City Library');
      fillInput(nextInput, 'Send resume by Friday');
      click(addBtn, 'add job 1');

      const col1 = container.querySelector('#ch5-col-todo');
      assert.ok(col1.querySelector('.kanban-card'), 'Card appears in To Do column');
      assert.ok(col1.textContent.includes('Office Administrator'), 'Card shows job title');

      // Job 2
      fillInput(titleInput, 'Customer Service Rep');
      fillInput(companyInput, 'GreenLeaf Centre');
      fillInput(nextInput, 'Prepare for phone interview');
      click(addBtn, 'add job 2');

      // After 2 cards, encouragement should appear
      const encouragement = container.querySelector('#ch5-board-encouragement');
      assert.ok(!encouragement.classList.contains('hidden'), 'Board encouragement visible');
      assertEncouraging(encouragement.textContent, 'board encouragement');
    });

    it('chapter quiz: answer all 4 correctly', () => {
      const quizContainer = container.querySelector('#ch5-quiz');
      // Q1=1, Q2=1, Q3=2, Q4=1
      const answers = [1, 1, 2, 1];
      answers.forEach((ans, qi) => {
        click(quizContainer.querySelector(`[data-quiz="${qi}"][data-option="${ans}"]`), `ch5 quiz q${qi}`);
        const fb = quizContainer.querySelector(`[data-quiz-feedback="${qi}"]`);
        assertEncouraging(fb.textContent, `ch5 quiz q${qi} feedback`);
      });
    });

    it('mark complete and navigate to chapter 6', async () => {
      const btn = container.querySelector('#ch5-complete-btn');
      click(btn, 'ch5 complete');

      assert.equal(app.getProgress()[5], 'complete', 'Chapter 5 complete');

      await flush(window, 5);

      assert.ok(container.textContent.includes("You're Ready") || container.textContent.includes("You\u2019re Ready"),
        'Navigated to Chapter 6');
    });
  });

  // =========================================================================
  // Step 7 — Chapter 6: Job market launchpad
  // =========================================================================
  describe('Step 7: Chapter 6 — you\'re ready', () => {
    beforeEach(() => {
      for (let i = 1; i <= 5; i++) app.setChapterStatus(i, 'complete');
      app.navigateToChapter(6);
    });

    it('decode the job listing: answer all 4 questions', () => {
      const decodeContainer = container.querySelector('#ch6-decode-questions');

      // Q1=1, Q2=1, Q3=1, Q4=2
      const answers = [1, 1, 1, 2];
      answers.forEach((ans, qi) => {
        click(decodeContainer.querySelector(`[data-decode-q="${qi}"][data-decode-opt="${ans}"]`),
          `decode q${qi}`);
        const fb = decodeContainer.querySelector(`[data-decode-feedback="${qi}"]`);
        assert.ok(fb.textContent.length > 0, `Decode q${qi} has feedback`);
        assertNotScary(fb.textContent, `decode q${qi} feedback`);
      });

      // All-done result
      const result = container.querySelector('#ch6-decode-result');
      assert.ok(!result.classList.contains('hidden'), 'Decode result visible');
      assertEncouraging(result.textContent, 'decode completion');
    });

    it('generate a professional summary', () => {
      const bgInput = container.querySelector('#ch6-summary-background');
      const skillsInput = container.querySelector('#ch6-summary-skills');
      const roleInput = container.querySelector('#ch6-summary-role');

      fillInput(bgInput, '8 years raising kids, previously in customer service');
      fillInput(skillsInput, 'communication, organization, patience');
      fillInput(roleInput, 'office administration');

      // Check a few digital skills
      const checkboxes = container.querySelectorAll('[data-skill]');
      assert.ok(checkboxes.length >= 4, 'At least 4 digital skill checkboxes');
      checkboxes[0].checked = true;
      checkboxes[1].checked = true;

      click(container.querySelector('#ch6-summary-generate'), 'generate summary');

      const resultDiv = container.querySelector('#ch6-summary-result');
      assert.ok(!resultDiv.classList.contains('hidden'), 'Summary result visible');
      const summaryText = resultDiv.textContent;
      assert.ok(summaryText.includes('customer service') || summaryText.includes('raising kids'),
        'Summary includes background');
      assert.ok(summaryText.includes('Seeking'), 'Summary includes career goal');
    });

    it('check 4 action items to commit', () => {
      const planContainer = container.querySelector('#ch6-action-plan');
      const items = planContainer.querySelectorAll('[data-action-idx]');
      assert.ok(items.length === 8, '8 action items available');

      // Click 4 of them
      for (let i = 0; i < 4; i++) {
        click(items[i], `action item ${i}`);
      }

      const counter = container.querySelector('#ch6-action-counter');
      assert.ok(counter.textContent.includes('4 of 8'), 'Counter shows 4 of 8');

      const encouragement = container.querySelector('#ch6-action-encouragement');
      assert.ok(!encouragement.classList.contains('hidden'), 'Action plan encouragement visible');
      assertEncouraging(encouragement.textContent, 'action plan encouragement');
    });

    it('chapter quiz: answer all 3 correctly', () => {
      const quizContainer = container.querySelector('#ch6-quiz');
      // Q1=1, Q2=1, Q3=2
      const answers = [1, 1, 2];
      answers.forEach((ans, qi) => {
        click(quizContainer.querySelector(`[data-quiz="${qi}"][data-option="${ans}"]`), `ch6 quiz q${qi}`);
        const fb = quizContainer.querySelector(`[data-quiz-feedback="${qi}"]`);
        assertEncouraging(fb.textContent, `ch6 quiz q${qi} feedback`);
      });
    });

    it('click "I\'m Ready" to complete the course', () => {
      const btn = container.querySelector('#ch6-complete-btn');
      assert.ok(btn, 'Graduation button exists');
      assert.ok(btn.textContent.includes("I'm Ready") || btn.textContent.includes("I\u2019m Ready"),
        'Button says "I\'m Ready"');

      click(btn, 'I\'m Ready button');

      assert.equal(app.getProgress()[6], 'complete', 'Chapter 6 complete');

      const celebration = container.querySelector('#ch6-celebration');
      assert.ok(!celebration.classList.contains('hidden'), 'Celebration message visible');
      assert.ok(celebration.textContent.includes('Congratulations'), 'Shows congratulations');
      assert.ok(celebration.textContent.includes('proud'), 'Says proud of Maria');
    });

    it('all 6 chapters show as complete after finishing', () => {
      // Complete ch6
      click(container.querySelector('#ch6-complete-btn'), 'complete course');

      const progress = app.getProgress();
      for (let i = 1; i <= 6; i++) {
        assert.equal(progress[i], 'complete', `Chapter ${i} should be complete`);
      }
    });
  });
});
