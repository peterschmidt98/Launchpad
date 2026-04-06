/**
 * User Simulation: James, 35, laid off 6 months ago.
 * Comfortable with computers, has used ChatGPT a few times.
 * Goal: sharpen skills and get back into the workforce.
 *
 * Run: node test/user-sim-james.js
 */
const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { createTestEnv } = require('./setup');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function click(el) {
  assert.ok(el, 'Element to click must exist');
  el.dispatchEvent(new el.ownerDocument.defaultView.Event('click', { bubbles: true }));
}

function flush(win, ms = 50) {
  return new Promise(r => win.setTimeout(r, ms));
}

function clickQuizOption(container, quizIndex, optionIndex) {
  const btn = container.querySelector(
    `.quiz-option[data-quiz="${quizIndex}"][data-option="${optionIndex}"]`
  );
  assert.ok(btn, `Quiz option [quiz=${quizIndex}, option=${optionIndex}] must exist`);
  click(btn);
  return btn;
}

function assertCorrect(btn) {
  assert.ok(btn.classList.contains('correct'),
    `Button should have .correct: "${btn.textContent.trim().slice(0, 50)}"`);
  assert.ok(!btn.classList.contains('incorrect'),
    'Correct answer must NOT have .incorrect');
}

function assertPositiveFeedback(container, quizIndex, attr = 'data-quiz-feedback') {
  const fb = container.querySelector(`[${attr}="${quizIndex}"] .quiz-feedback`);
  assert.ok(fb, `Feedback for question ${quizIndex} should exist`);
  assert.ok(fb.classList.contains('correct'), `Feedback for q${quizIndex} should be .correct`);
}

// ---------------------------------------------------------------------------
// Chapter navigation helpers
// ---------------------------------------------------------------------------

async function completeCh1(container, win) {
  for (let qi = 0; qi < 4; qi++) {
    click(container.querySelector(`.assessment-option[data-question="${qi}"][data-option="3"]`));
  }
  click(container.querySelector('#ch1-complete-btn'));
  await flush(win); // wait for setTimeout navigation to ch2
}

async function completeCh2(container, win) {
  click(container.querySelector('#ch2-complete-btn'));
  // ch2 does NOT auto-navigate, so navigate manually
}

async function completeCh3(container, win) {
  click(container.querySelector('#ch3-complete-btn'));
  await flush(win); // wait for setTimeout navigation to ch4
}

async function completeCh4(container, win) {
  click(container.querySelector('#ch4-complete-btn'));
  await flush(win); // wait for setTimeout navigation to ch5
}

async function completeCh5(container, win) {
  click(container.querySelector('#ch5-complete-btn'));
  await flush(win); // wait for setTimeout navigation to ch6
}

/** Navigate to a specific chapter by fast-completing all prior chapters. */
async function navigateTo(chapterNum, container, win) {
  // Ch1: always start here
  if (chapterNum <= 1) return;

  await completeCh1(container, win); // now on ch2
  if (chapterNum <= 2) return;

  await completeCh2(container, win); // still on ch2 (no auto-nav)
  win.LaunchpadApp.navigateToChapter(3);
  await flush(win);
  if (chapterNum <= 3) return;

  await completeCh3(container, win); // auto-navigates to ch4
  if (chapterNum <= 4) return;

  await completeCh4(container, win); // auto-navigates to ch5
  if (chapterNum <= 5) return;

  await completeCh5(container, win); // auto-navigates to ch6
}

// ---------------------------------------------------------------------------
// Full Journey
// ---------------------------------------------------------------------------

describe('James — full user journey through Launchpad', () => {
  let win, doc, container;

  beforeEach(() => {
    const env = createTestEnv({ immediateTimers: true });
    win = env.window;
    doc = env.document;
    container = doc.getElementById('chapter-container');
  });

  // ========================================================================
  // Chapter 1
  // ========================================================================
  describe('Chapter 1 — Where Are We?', () => {
    it('loads chapter 1 on first visit', () => {
      const heading = container.querySelector('h2');
      assert.ok(heading, 'Chapter heading should exist');
      assert.ok(heading.textContent.includes('Where Are We?'), 'Should show Chapter 1 heading');
    });

    it('answer self-assessment as confident user, get sharpen message, mark complete', async () => {
      // James picks the highest (index 3) option for all 4 questions
      for (let qi = 0; qi < 4; qi++) {
        const btn = container.querySelector(
          `.assessment-option[data-question="${qi}"][data-option="3"]`
        );
        assert.ok(btn, `Highest option for question ${qi} must exist`);
        click(btn);
        assert.ok(btn.classList.contains('selected'), `Option should be .selected for q${qi}`);
      }

      // Verify "sharpen and update" message
      const resultDiv = container.querySelector('#assessment-result');
      assert.ok(!resultDiv.classList.contains('hidden'), 'Assessment result should be visible');
      const msg = container.querySelector('#assessment-message');
      assert.ok(msg.textContent.includes('sharpen and update'),
        `Should contain "sharpen and update", got: "${msg.textContent}"`);

      // Progress bar should have advanced
      const bar = container.querySelector('#ch1-progress');
      assert.ok(parseFloat(bar.style.width) > 0, 'Progress bar should advance');

      // Mark complete
      click(container.querySelector('#ch1-complete-btn'));
      await flush(win);

      // Should navigate to chapter 2
      assert.ok(container.querySelector('h2').textContent.includes('What is AI?'),
        'Should navigate to Chapter 2');
    });
  });

  // ========================================================================
  // Chapter 2
  // ========================================================================
  describe('Chapter 2 — What is AI?', () => {
    it('skip to demo, type about Claude, verify response, ace quiz, mark complete', async () => {
      await navigateTo(2, container, win);

      assert.ok(container.querySelector('h2').textContent.includes('What is AI?'));

      // -- Demo: type about Claude and Anthropic --
      const demoInput = container.querySelector('#demo-input');
      assert.ok(demoInput, 'Demo textarea must exist');
      demoInput.value = 'Tell me about Claude and Anthropic';

      click(container.querySelector('#demo-send'));
      await flush(win, 100);

      const responseDiv = container.querySelector('#demo-response');
      assert.ok(!responseDiv.classList.contains('hidden'), 'Demo response should be visible');
      assert.ok(responseDiv.textContent.includes('Claude'), 'Response should mention Claude');

      // -- Quiz: answer all 3 correctly (correct indices: 1, 2, 3) --
      const quizContainer = container.querySelector('#ch2-quiz');
      assert.ok(quizContainer, 'Quiz container must exist');

      const correctAnswers = [1, 2, 3];
      for (let qi = 0; qi < correctAnswers.length; qi++) {
        const btn = clickQuizOption(quizContainer, qi, correctAnswers[qi]);
        assertCorrect(btn);
        assertPositiveFeedback(quizContainer, qi);
      }

      // -- Mark complete --
      const completeBtn = container.querySelector('#ch2-complete-btn');
      click(completeBtn);
      assert.ok(completeBtn.classList.contains('completed'), 'Button should show completed');

      const bar = container.querySelector('#ch2-progress');
      assert.equal(bar.style.width, '100%', 'Progress bar should be 100%');
    });
  });

  // ========================================================================
  // Chapter 3
  // ========================================================================
  describe('Chapter 3 — Your Core Toolkit', () => {
    it('type correct formula, pick Email B, ace search and quiz, mark complete', async () => {
      await navigateTo(3, container, win);

      assert.ok(container.querySelector('h2').textContent.includes('Your Core Toolkit'));

      // -- Spreadsheet: type =SUM(B2:B3) --
      const formulaInput = container.querySelector('#ch3-formula-input');
      assert.ok(formulaInput, 'Formula input must exist');
      formulaInput.value = '=SUM(B2:B3)';
      click(container.querySelector('#ch3-formula-check'));

      const formulaFeedback = container.querySelector('#ch3-formula-feedback .quiz-feedback');
      assert.ok(formulaFeedback, 'Formula feedback must appear');
      assert.ok(formulaFeedback.classList.contains('correct'), 'Formula should be correct');

      const cellResult = container.querySelector('.cell-result');
      assert.ok(cellResult && cellResult.textContent.includes('1550'), 'Cell should show 1550');

      // -- Email: pick Email B (correct) --
      click(container.querySelector('#ch3-email-b'));
      const emailFeedback = container.querySelector('#ch3-email-feedback .quiz-feedback');
      assert.ok(emailFeedback && emailFeedback.classList.contains('correct'), 'Email B should be correct');

      // -- Search: answer all 3 correctly (correct indices: 1, 0, 1) --
      const searchContainer = container.querySelector('#ch3-search-questions');

      const searchCorrect = [1, 0, 1];
      for (let qi = 0; qi < searchCorrect.length; qi++) {
        const btn = searchContainer.querySelector(
          `.quiz-option[data-search-q="${qi}"][data-search-opt="${searchCorrect[qi]}"]`
        );
        assert.ok(btn, `Search option q=${qi} must exist`);
        click(btn);
        assert.ok(btn.classList.contains('correct'), `Search answer ${qi} should be correct`);
        assert.ok(!btn.classList.contains('incorrect'), `Search answer ${qi} must NOT be incorrect`);

        const fb = searchContainer.querySelector(`[data-search-feedback="${qi}"] .quiz-feedback`);
        assert.ok(fb && fb.classList.contains('correct'), `Search feedback ${qi} should be positive`);
      }

      // -- End quiz: answer all 4 correctly (correct indices: 1, 2, 1, 2) --
      const quizContainer = container.querySelector('#ch3-quiz');

      const quizCorrect = [1, 2, 1, 2];
      for (let qi = 0; qi < quizCorrect.length; qi++) {
        const btn = clickQuizOption(quizContainer, qi, quizCorrect[qi]);
        assertCorrect(btn);
        assertPositiveFeedback(quizContainer, qi);
      }

      // -- Mark complete --
      click(container.querySelector('#ch3-complete-btn'));
      const bar = container.querySelector('#ch3-progress');
      assert.equal(bar.style.width, '100%', 'Ch3 progress should be 100%');

      await flush(win);
      assert.ok(container.querySelector('h2').textContent.includes('Talking to AI'),
        'Should navigate to Chapter 4');
    });
  });

  // ========================================================================
  // Chapter 4
  // ========================================================================
  describe('Chapter 4 — Talking to AI', () => {
    it('answer prompt makeovers, use live demo, build 4-field prompt, ace quiz, mark complete', async () => {
      await navigateTo(4, container, win);

      assert.ok(container.querySelector('h2').textContent.includes('Talking to AI'));

      // -- Prompt Makeover: answer all 3 correctly (correct: 1, 0, 2) --
      const makeoverContainer = container.querySelector('#ch4-makeover-questions');

      const makeoverCorrect = [1, 0, 2];
      for (let qi = 0; qi < makeoverCorrect.length; qi++) {
        const btn = makeoverContainer.querySelector(
          `.quiz-option[data-makeover-q="${qi}"][data-makeover-opt="${makeoverCorrect[qi]}"]`
        );
        assert.ok(btn, `Makeover option q=${qi} must exist`);
        click(btn);
        assert.ok(btn.classList.contains('correct'), `Makeover answer ${qi} should be correct`);
        assert.ok(!btn.classList.contains('incorrect'), `Makeover answer ${qi} must NOT be incorrect`);

        const fb = makeoverContainer.querySelector(`[data-makeover-feedback="${qi}"] .quiz-feedback`);
        assert.ok(fb && fb.classList.contains('correct'), `Makeover feedback ${qi} should be positive`);
      }

      // -- Live Demo: use a keyword prompt --
      const demoInput = container.querySelector('#ch4-demo-input');
      demoInput.value = 'How do I write a good prompt to use AI effectively?';
      click(container.querySelector('#ch4-demo-send'));
      await flush(win, 100);

      const demoResponse = container.querySelector('#ch4-demo-response');
      assert.ok(!demoResponse.classList.contains('hidden'), 'Live demo response should be visible');

      // -- Prompt Builder: fill all 4 fields --
      container.querySelector('#ch4-builder-role').value = 'You are a friendly career coach';
      container.querySelector('#ch4-builder-task').value = 'Help me write an introduction email to my new team';
      container.querySelector('#ch4-builder-context').value = 'I was laid off 6 months ago and just got a new admin job';
      container.querySelector('#ch4-builder-format').value = 'Keep it under 100 words, warm but professional';

      click(container.querySelector('#ch4-builder-build'));

      const builderResult = container.querySelector('#ch4-builder-result');
      assert.ok(!builderResult.classList.contains('hidden'), 'Builder result should be visible');
      const promptText = container.querySelector('#ch4-builder-prompt').textContent;
      assert.ok(promptText.includes('career coach'), 'Built prompt should include role');
      assert.ok(promptText.includes('introduction email'), 'Built prompt should include task');
      assert.ok(promptText.includes('laid off'), 'Built prompt should include context');
      assert.ok(promptText.includes('100 words'), 'Built prompt should include format');

      // -- Quiz: answer all 3 correctly (correct: 1, 2, 1) --
      const quizContainer = container.querySelector('#ch4-quiz');

      const quizCorrect = [1, 2, 1];
      for (let qi = 0; qi < quizCorrect.length; qi++) {
        const btn = clickQuizOption(quizContainer, qi, quizCorrect[qi]);
        assertCorrect(btn);
        assertPositiveFeedback(quizContainer, qi);
      }

      // -- Mark complete --
      click(container.querySelector('#ch4-complete-btn'));
      const bar = container.querySelector('#ch4-progress');
      assert.equal(bar.style.width, '100%');

      await flush(win);
      assert.ok(container.querySelector('h2').textContent.includes('Getting Things Done'),
        'Should navigate to Chapter 5');
    });
  });

  // ========================================================================
  // Chapter 5
  // ========================================================================
  describe('Chapter 5 — Getting Things Done', () => {
    it('assign all 6 tasks correctly, add 3 job apps, ace quiz, mark complete', async () => {
      await navigateTo(5, container, win);

      assert.ok(container.querySelector('h2').textContent.includes('Getting Things Done'));

      // -- Organize: assign all 6 tasks to correct columns --
      // 0:done, 1:progress, 2:todo, 3:progress, 4:todo, 5:todo
      const tasksContainer = container.querySelector('#ch5-organize-tasks');

      const taskAssignments = ['done', 'progress', 'todo', 'progress', 'todo', 'todo'];
      for (let idx = 0; idx < taskAssignments.length; idx++) {
        const btn = tasksContainer.querySelector(
          `.column-btn[data-task-idx="${idx}"][data-col="${taskAssignments[idx]}"]`
        );
        assert.ok(btn, `Task ${idx} button for "${taskAssignments[idx]}" must exist`);
        click(btn);
        assert.ok(btn.classList.contains('correct'), `Task ${idx} should be correct`);
        assert.ok(!btn.classList.contains('incorrect'), `Task ${idx} must NOT be incorrect`);
      }

      // Result message
      const organizeResult = container.querySelector('#ch5-organize-result');
      assert.ok(!organizeResult.classList.contains('hidden'), 'Organize result should be visible');

      // -- Job Board: add 3 applications (one per column) --
      const jobApps = [
        { title: 'Office Administrator', company: 'City Library', status: 'todo', next: 'Send resume by Friday' },
        { title: 'Customer Service Rep', company: 'TechCorp', status: 'progress', next: 'Interview next Tuesday' },
        { title: 'Data Entry Clerk', company: 'HealthFirst', status: 'done', next: 'Accepted the offer' },
      ];

      for (const job of jobApps) {
        container.querySelector('#ch5-job-title').value = job.title;
        container.querySelector('#ch5-job-company').value = job.company;
        container.querySelector('#ch5-job-status').value = job.status;
        container.querySelector('#ch5-job-next').value = job.next;
        click(container.querySelector('#ch5-add-card'));
      }

      // Verify cards in each column
      assert.ok(container.querySelector('#ch5-col-todo .kanban-card'), 'To Do column should have a card');
      assert.ok(container.querySelector('#ch5-col-progress .kanban-card'), 'In Progress column should have a card');
      assert.ok(container.querySelector('#ch5-col-done .kanban-card'), 'Done column should have a card');

      // Encouragement after >=2 cards
      const encouragement = container.querySelector('#ch5-board-encouragement');
      assert.ok(!encouragement.classList.contains('hidden'), 'Board encouragement should be visible');

      // -- Quiz: answer all 4 correctly (correct: 1, 1, 2, 1) --
      const quizContainer = container.querySelector('#ch5-quiz');

      const quizCorrect = [1, 1, 2, 1];
      for (let qi = 0; qi < quizCorrect.length; qi++) {
        const btn = clickQuizOption(quizContainer, qi, quizCorrect[qi]);
        assertCorrect(btn);
        assertPositiveFeedback(quizContainer, qi);
      }

      // -- Mark complete --
      click(container.querySelector('#ch5-complete-btn'));
      const bar = container.querySelector('#ch5-progress');
      assert.equal(bar.style.width, '100%');

      await flush(win);
      assert.ok(container.querySelector('h2').textContent.includes("You're Ready"),
        'Should navigate to Chapter 6');
    });
  });

  // ========================================================================
  // Chapter 6
  // ========================================================================
  describe('Chapter 6 — You\'re Ready', () => {
    it('decode listing, generate summary, check all 8 actions, ace quiz, click I\'m Ready', async () => {
      await navigateTo(6, container, win);

      assert.ok(container.querySelector('h2').textContent.includes("You're Ready"));

      // -- Decode job listing: answer all 4 correctly (correct: 1, 1, 1, 2) --
      const decodeContainer = container.querySelector('#ch6-decode-questions');

      const decodeCorrect = [1, 1, 1, 2];
      for (let qi = 0; qi < decodeCorrect.length; qi++) {
        const btn = decodeContainer.querySelector(
          `.quiz-option[data-decode-q="${qi}"][data-decode-opt="${decodeCorrect[qi]}"]`
        );
        assert.ok(btn, `Decode option q=${qi} must exist`);
        click(btn);
        assert.ok(btn.classList.contains('correct'), `Decode answer ${qi} should be correct`);
        assert.ok(!btn.classList.contains('incorrect'), `Decode answer ${qi} must NOT be incorrect`);

        const fb = decodeContainer.querySelector(`[data-decode-feedback="${qi}"] .quiz-feedback`);
        assert.ok(fb && fb.classList.contains('correct'), `Decode feedback ${qi} should be positive`);
      }

      const decodeResult = container.querySelector('#ch6-decode-result');
      assert.ok(!decodeResult.classList.contains('hidden'), 'Decode result should be visible');

      // -- Summary Builder: fill all fields and check all skill checkboxes --
      container.querySelector('#ch6-summary-background').value =
        'Customer service professional with 8 years experience, laid off 6 months ago';
      container.querySelector('#ch6-summary-skills').value =
        'communication, problem-solving, team leadership';
      container.querySelector('#ch6-summary-role').value =
        'office admin or customer service';

      container.querySelectorAll('[data-skill]').forEach(cb => { cb.checked = true; });

      click(container.querySelector('#ch6-summary-generate'));

      const summaryResult = container.querySelector('#ch6-summary-result');
      assert.ok(!summaryResult.classList.contains('hidden'), 'Summary result should be visible');
      assert.ok(summaryResult.textContent.includes('professional'),
        'Summary should include professional context');

      // -- Action Plan: check all 8 items --
      const actionRows = container.querySelectorAll('#ch6-action-plan [data-action-idx]');
      assert.equal(actionRows.length, 8, 'Should have 8 action items');

      for (const row of actionRows) {
        click(row);
      }

      assert.ok(container.querySelector('#ch6-action-counter').textContent.includes('8 of 8'),
        'Counter should show 8 of 8');
      assert.ok(!container.querySelector('#ch6-action-encouragement').classList.contains('hidden'),
        'Action encouragement should be visible');

      // -- Quiz: answer all 3 correctly (correct: 1, 1, 2) --
      const quizContainer = container.querySelector('#ch6-quiz');

      const quizCorrect = [1, 1, 2];
      for (let qi = 0; qi < quizCorrect.length; qi++) {
        const btn = clickQuizOption(quizContainer, qi, quizCorrect[qi]);
        assertCorrect(btn);
        assertPositiveFeedback(quizContainer, qi);
      }

      // -- Click "I'm Ready" --
      const completeBtn = container.querySelector('#ch6-complete-btn');
      assert.ok(completeBtn, "I'm Ready button must exist");
      assert.ok(completeBtn.textContent.includes("I'm Ready"), 'Button should say I\'m Ready');
      click(completeBtn);

      // Graduation celebration
      assert.ok(completeBtn.classList.contains('completed'), 'Button should be completed');

      const celebration = container.querySelector('#ch6-celebration');
      assert.ok(!celebration.classList.contains('hidden'), 'Celebration should be visible');
      assert.ok(celebration.textContent.includes('Congratulations'),
        'Celebration should say Congratulations');

      const bar = container.querySelector('#ch6-progress');
      assert.equal(bar.style.width, '100%', 'Ch6 progress should be 100%');

      // Verify all 6 chapters marked complete
      const progress = win.LaunchpadApp.getProgress();
      for (let ch = 1; ch <= 6; ch++) {
        assert.equal(progress[ch], 'complete', `Chapter ${ch} should be complete`);
      }
    });
  });
});
