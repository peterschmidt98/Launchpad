/**
 * Chaos User Simulation — adversarial testing of the Launchpad app.
 *
 * Simulates a user who clicks things in the wrong order, enters garbage,
 * and tries to break every interactive. Run with: node test/user-sim-chaos.js
 */
const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { createTestEnv } = require('./setup');

/** Helper: click a sidebar nav item by 0-based index */
function clickSidebarChapter(document, index) {
  const items = document.querySelectorAll('#chapter-list .chapter-nav-item');
  items[index].click();
}

/** Helper: get current toast text (if any) */
function getToastText(document) {
  const toast = document.querySelector('.toast');
  return toast ? toast.textContent.trim() : null;
}

/** Helper: click quiz option by quiz-index and option-index within a parent */
function clickQuizOption(container, quizIdx, optIdx) {
  const btn = container.querySelector(
    `.quiz-option[data-quiz="${quizIdx}"][data-option="${optIdx}"]`
  );
  assert.ok(btn, `quiz-option [data-quiz="${quizIdx}"][data-option="${optIdx}"] should exist`);
  btn.click();
  return btn;
}

describe('Chaos User Simulation', () => {
  let window, document, app, container;

  beforeEach(() => {
    const env = createTestEnv({ immediateTimers: true });
    window = env.window;
    document = env.document;
    app = window.LaunchpadApp;
    container = document.getElementById('chapter-container');
  });

  // ----------------------------------------------------------------
  // STEP 1 — Try to navigate to Chapter 6 immediately (locked)
  // ----------------------------------------------------------------
  describe('Step 1: Try navigating to locked Chapter 6', () => {
    it('clicking Chapter 6 in sidebar shows a toast and does NOT navigate', () => {
      // App starts on Chapter 1. Chapter 6 sidebar item is index 5.
      const contentBefore = container.innerHTML;
      clickSidebarChapter(document, 5);
      const toast = getToastText(document);
      assert.ok(toast, 'A toast message should appear');
      assert.match(toast, /Complete Chapter 2/i, 'Toast should mention Chapter 2');
      // Chapter 6 content should NOT have loaded
      assert.ok(
        !container.querySelector('#ch6-progress'),
        'Chapter 6 content must not render'
      );
    });
  });

  // ----------------------------------------------------------------
  // STEP 2 — Try to navigate to Chapter 3 (locked)
  // ----------------------------------------------------------------
  describe('Step 2: Try navigating to locked Chapter 3', () => {
    it('clicking Chapter 3 in sidebar shows a toast and does NOT navigate', () => {
      clickSidebarChapter(document, 2);
      const toast = getToastText(document);
      assert.ok(toast, 'A toast message should appear');
      assert.match(toast, /Complete Chapter 2/i, 'Toast should mention Chapter 2');
      assert.ok(
        !container.querySelector('#ch3-progress'),
        'Chapter 3 content must not render'
      );
    });
  });

  // ----------------------------------------------------------------
  // STEP 3 — Chapter 1: click mark complete WITHOUT answering assessment
  // ----------------------------------------------------------------
  describe('Step 3: Chapter 1 — mark complete without answering assessment', () => {
    it('mark complete works even though assessment is unanswered', () => {
      app.navigateToChapter(1);
      // Verify assessment questions exist but none are answered
      const assessmentBtns = container.querySelectorAll('.assessment-option');
      assert.ok(assessmentBtns.length > 0, 'Assessment options should exist');
      const selected = container.querySelectorAll('.assessment-option.selected');
      assert.equal(selected.length, 0, 'No assessment options should be selected');

      // Click mark complete
      const btn = container.querySelector('#ch1-complete-btn');
      assert.ok(btn, 'Complete button should exist');
      btn.click();

      // Verify completion
      const progress = app.getProgress();
      assert.equal(progress[1], 'complete', 'Chapter 1 should be complete');
      assert.ok(btn.disabled, 'Button should be disabled after completing');
    });
  });

  // ----------------------------------------------------------------
  // STEP 4 — Chapter 2: empty message, all-wrong quiz, mark complete
  // ----------------------------------------------------------------
  describe('Step 4: Chapter 2 — empty demo message, all-wrong quiz, complete', () => {
    it('sending empty message in demo does nothing', () => {
      app.navigateToChapter(2);
      const demoInput = container.querySelector('#demo-input');
      const sendBtn = container.querySelector('#demo-send');
      const responseDiv = container.querySelector('#demo-response');

      // Ensure input is empty
      demoInput.value = '';
      sendBtn.click();

      // Response should still be hidden (empty messages are ignored)
      assert.ok(
        responseDiv.classList.contains('hidden'),
        'Response div should remain hidden for empty message'
      );
    });

    it('answering every quiz question wrong shows incorrect feedback but does not crash', () => {
      app.navigateToChapter(2);
      const quizContainer = container.querySelector('#ch2-quiz');
      assert.ok(quizContainer, '#ch2-quiz should exist');

      // 3 questions, correct answers are 1, 2, 3. Pick wrong ones: 0, 0, 0
      const wrongAnswers = [0, 0, 0];
      wrongAnswers.forEach((optIdx, qi) => {
        const btn = clickQuizOption(quizContainer, qi, optIdx);
        assert.ok(
          btn.classList.contains('incorrect'),
          `Quiz ${qi}: wrong answer should have .incorrect class`
        );
      });

      // All feedback slots should have content
      for (let qi = 0; qi < 3; qi++) {
        const fb = quizContainer.querySelector(`[data-quiz-feedback="${qi}"]`);
        assert.ok(fb.innerHTML.trim().length > 0, `Feedback for quiz ${qi} should appear`);
      }
    });

    it('marking Chapter 2 complete works after bad quiz answers', () => {
      app.navigateToChapter(2);
      const btn = container.querySelector('#ch2-complete-btn');
      btn.click();

      const progress = app.getProgress();
      assert.equal(progress[2], 'complete', 'Chapter 2 should be complete');
      assert.ok(btn.disabled, 'Button should be disabled');

      // Completing ch2 unlocks 3-6
      for (let i = 3; i <= 6; i++) {
        assert.ok(app.isChapterUnlocked(i), `Chapter ${i} should now be unlocked`);
      }
    });
  });

  // ----------------------------------------------------------------
  // STEP 5 — Chapter 3: wrong formulas (incl XSS), wrong email, wrong search, complete
  // ----------------------------------------------------------------
  describe('Step 5: Chapter 3 — garbage formulas, XSS, wrong answers, complete', () => {
    beforeEach(() => {
      // Unlock chapters by completing ch2
      app.setChapterStatus(2, 'complete');
      app.navigateToChapter(3);
    });

    it('entering "HELLO WORLD" as a formula shows incorrect feedback', () => {
      const input = container.querySelector('#ch3-formula-input');
      const checkBtn = container.querySelector('#ch3-formula-check');
      const feedback = container.querySelector('#ch3-formula-feedback');

      input.value = 'HELLO WORLD';
      checkBtn.click();

      assert.ok(
        feedback.innerHTML.includes('Not quite'),
        'Feedback should say "Not quite"'
      );
      // Check button should still be enabled (can retry)
      assert.ok(!checkBtn.disabled, 'Check button should still be enabled for retries');
    });

    it('entering XSS "<script>alert(\'xss\')</script>" as a formula is rejected and not executed', () => {
      const input = container.querySelector('#ch3-formula-input');
      const checkBtn = container.querySelector('#ch3-formula-check');
      const feedback = container.querySelector('#ch3-formula-feedback');

      input.value = "<script>alert('xss')</script>";
      checkBtn.click();

      assert.ok(
        feedback.innerHTML.includes('Not quite'),
        'XSS formula should be treated as wrong input'
      );
      // The XSS should not have created a script element
      assert.ok(
        !feedback.querySelector('script'),
        'No <script> tag should exist in feedback'
      );
    });

    it('entering the correct formula "=SUM(B2:B3)" works', () => {
      const input = container.querySelector('#ch3-formula-input');
      const checkBtn = container.querySelector('#ch3-formula-check');
      const feedback = container.querySelector('#ch3-formula-feedback');
      const cell = container.querySelector('#ch3-formula-cell');

      input.value = '=SUM(B2:B3)';
      checkBtn.click();

      assert.ok(
        feedback.innerHTML.includes('1,550') || feedback.innerHTML.includes('1550'),
        'Feedback should show the correct answer 1550'
      );
      assert.ok(checkBtn.disabled, 'Check button should be disabled after correct answer');
      assert.ok(
        cell.querySelector('.cell-result'),
        'Cell should show the computed result'
      );
    });

    it('picking Email A (wrong) shows incorrect feedback', () => {
      const emailA = container.querySelector('#ch3-email-a');
      const feedback = container.querySelector('#ch3-email-feedback');

      emailA.click();

      assert.ok(
        emailA.classList.contains('selected-incorrect'),
        'Email A should be marked incorrect'
      );
      assert.ok(
        feedback.innerHTML.includes('Not quite'),
        'Feedback should indicate wrong choice'
      );
      // Email B should be highlighted as correct
      const emailB = container.querySelector('#ch3-email-b');
      assert.ok(
        emailB.classList.contains('selected-correct'),
        'Email B should be highlighted as correct'
      );
    });

    it('answering all search questions wrong shows incorrect feedback', () => {
      const searchContainer = container.querySelector('#ch3-search-questions');
      // 3 questions, correct answers are 1, 0, 1. Pick wrong: 2, 2, 2
      const wrongAnswers = [
        { qi: 0, oi: 2 },
        { qi: 1, oi: 2 },
        { qi: 2, oi: 2 },
      ];

      wrongAnswers.forEach(({ qi, oi }) => {
        const btn = searchContainer.querySelector(
          `.quiz-option[data-search-q="${qi}"][data-search-opt="${oi}"]`
        );
        assert.ok(btn, `Search option [q=${qi}, opt=${oi}] should exist`);
        btn.click();
        assert.ok(
          btn.classList.contains('incorrect'),
          `Search q${qi} opt${oi} should be marked incorrect`
        );
      });

      // All feedback should be visible
      for (let qi = 0; qi < 3; qi++) {
        const fb = searchContainer.querySelector(`[data-search-feedback="${qi}"]`);
        assert.ok(fb.innerHTML.trim().length > 0, `Search feedback ${qi} should appear`);
      }
    });

    it('marking Chapter 3 complete works', () => {
      const btn = container.querySelector('#ch3-complete-btn');
      btn.click();

      const progress = app.getProgress();
      assert.equal(progress[3], 'complete', 'Chapter 3 should be complete');
      assert.ok(btn.disabled, 'Button should be disabled');
    });
  });

  // ----------------------------------------------------------------
  // STEP 6 — Chapter 4: wrong makeover answers, prompt builder edge cases, complete
  // ----------------------------------------------------------------
  describe('Step 6: Chapter 4 — wrong makeover, empty prompt builder, complete', () => {
    beforeEach(() => {
      app.setChapterStatus(2, 'complete');
      app.navigateToChapter(4);
    });

    it('answering all prompt makeover questions wrong shows incorrect feedback', () => {
      const makeoverContainer = container.querySelector('#ch4-makeover-questions');
      // 3 questions, correct answers are 1, 0, 2. Pick wrong: 0, 1, 0
      const wrongAnswers = [
        { qi: 0, oi: 0 },
        { qi: 1, oi: 1 },
        { qi: 2, oi: 0 },
      ];

      wrongAnswers.forEach(({ qi, oi }) => {
        const btn = makeoverContainer.querySelector(
          `.quiz-option[data-makeover-q="${qi}"][data-makeover-opt="${oi}"]`
        );
        assert.ok(btn, `Makeover option [q=${qi}, opt=${oi}] should exist`);
        btn.click();
        assert.ok(
          btn.classList.contains('incorrect'),
          `Makeover q${qi} should be marked incorrect`
        );
      });
    });

    it('building a prompt with 0 fields filled does not show result', () => {
      const buildBtn = container.querySelector('#ch4-builder-build');
      const resultDiv = container.querySelector('#ch4-builder-result');

      buildBtn.click();

      assert.ok(
        resultDiv.classList.contains('hidden'),
        'Result should remain hidden with 0 fields'
      );
    });

    it('building a prompt with only 1 field filled does not show result', () => {
      const roleInput = container.querySelector('#ch4-builder-role');
      const buildBtn = container.querySelector('#ch4-builder-build');
      const resultDiv = container.querySelector('#ch4-builder-result');

      roleInput.value = 'You are a helpful assistant';
      buildBtn.click();

      assert.ok(
        resultDiv.classList.contains('hidden'),
        'Result should remain hidden with only 1 field'
      );
    });

    it('building a prompt with 2 fields filled shows result', () => {
      const roleInput = container.querySelector('#ch4-builder-role');
      const taskInput = container.querySelector('#ch4-builder-task');
      const buildBtn = container.querySelector('#ch4-builder-build');
      const resultDiv = container.querySelector('#ch4-builder-result');

      roleInput.value = 'You are a helpful assistant';
      taskInput.value = 'Write a cover letter';
      buildBtn.click();

      assert.ok(
        !resultDiv.classList.contains('hidden'),
        'Result should be visible with 2 fields filled'
      );
      const promptText = container.querySelector('#ch4-builder-prompt').textContent;
      assert.ok(
        promptText.includes('helpful assistant'),
        'Assembled prompt should contain role text'
      );
      assert.ok(
        promptText.includes('cover letter'),
        'Assembled prompt should contain task text'
      );
    });

    it('marking Chapter 4 complete works', () => {
      const btn = container.querySelector('#ch4-complete-btn');
      btn.click();

      const progress = app.getProgress();
      assert.equal(progress[4], 'complete', 'Chapter 4 should be complete');
      assert.ok(btn.disabled, 'Button should be disabled');
    });
  });

  // ----------------------------------------------------------------
  // STEP 7 — Chapter 5: wrong task columns, empty job, XSS job, valid jobs, complete
  // ----------------------------------------------------------------
  describe('Step 7: Chapter 5 — wrong columns, empty job, XSS job, valid jobs, complete', () => {
    beforeEach(() => {
      app.setChapterStatus(2, 'complete');
      app.navigateToChapter(5);
    });

    it('assigning all tasks to wrong columns shows incorrect markers', () => {
      const tasksContainer = container.querySelector('#ch5-organize-tasks');
      // 6 tasks, correct: done, progress, todo, progress, todo, todo
      // Assign all to wrong column: all "done"
      for (let idx = 0; idx < 6; idx++) {
        // Pick a wrong column for each. Tasks at indices 1,2,3,4,5 are not "done"
        // Task 0 IS "done", so pick "todo" for it.
        const wrongCol = idx === 0 ? 'todo' : 'done';
        const btn = tasksContainer.querySelector(
          `.column-btn[data-task-idx="${idx}"][data-col="${wrongCol}"]`
        );
        assert.ok(btn, `Column button for task ${idx} col "${wrongCol}" should exist`);
        btn.click();

        // Should be marked incorrect
        assert.ok(
          btn.classList.contains('incorrect'),
          `Task ${idx} with wrong column should be marked incorrect`
        );
      }

      // Result should still show after all are answered
      const result = container.querySelector('#ch5-organize-result');
      assert.ok(
        !result.classList.contains('hidden'),
        'Organize result should appear after all tasks answered'
      );
    });

    it('adding a job with empty title shows an error', () => {
      const titleInput = container.querySelector('#ch5-job-title');
      const companyInput = container.querySelector('#ch5-job-company');
      const addBtn = container.querySelector('#ch5-add-card');
      const errorDiv = container.querySelector('#ch5-board-error');

      titleInput.value = '';
      companyInput.value = '';
      addBtn.click();

      assert.ok(
        !errorDiv.classList.contains('hidden'),
        'Error message should be visible'
      );
      assert.ok(
        errorDiv.textContent.includes('job title'),
        'Error should mention job title'
      );

      // No card should be added
      const cards = container.querySelectorAll('.kanban-card');
      assert.equal(cards.length, 0, 'No kanban cards should exist');
    });

    it('adding a job with XSS in the title escapes the HTML', () => {
      const titleInput = container.querySelector('#ch5-job-title');
      const companyInput = container.querySelector('#ch5-job-company');
      const addBtn = container.querySelector('#ch5-add-card');

      titleInput.value = '<img src=x>';
      companyInput.value = 'Evil Corp';
      addBtn.click();

      // A card should be added
      const cards = container.querySelectorAll('.kanban-card');
      assert.equal(cards.length, 1, 'One card should be created');

      // The title should be escaped — no actual img element
      const card = cards[0];
      assert.ok(
        !card.querySelector('img'),
        'XSS <img> tag should not render as an element'
      );
      // The text content should contain the literal string
      assert.ok(
        card.textContent.includes('<img src=x>'),
        'Title should display as escaped text'
      );
    });

    it('adding 2 valid jobs triggers encouragement', () => {
      const titleInput = container.querySelector('#ch5-job-title');
      const companyInput = container.querySelector('#ch5-job-company');
      const addBtn = container.querySelector('#ch5-add-card');
      const encouragement = container.querySelector('#ch5-board-encouragement');

      // Job 1
      titleInput.value = 'Office Admin';
      companyInput.value = 'City Library';
      addBtn.click();

      assert.ok(
        encouragement.classList.contains('hidden'),
        'Encouragement should not show after 1 job'
      );

      // Job 2
      titleInput.value = 'Receptionist';
      companyInput.value = 'Health Clinic';
      addBtn.click();

      assert.ok(
        !encouragement.classList.contains('hidden'),
        'Encouragement should show after 2 jobs'
      );
    });

    it('marking Chapter 5 complete works', () => {
      const btn = container.querySelector('#ch5-complete-btn');
      btn.click();

      const progress = app.getProgress();
      assert.equal(progress[5], 'complete', 'Chapter 5 should be complete');
      assert.ok(btn.disabled, 'Button should be disabled');
    });
  });

  // ----------------------------------------------------------------
  // STEP 8 — Chapter 6: wrong decode, empty summary, action items, "I'm Ready"
  // ----------------------------------------------------------------
  describe('Step 8: Chapter 6 — wrong decode, empty summary, action plan, I\'m Ready', () => {
    beforeEach(() => {
      app.setChapterStatus(2, 'complete');
      app.navigateToChapter(6);
    });

    it('answering all decode questions wrong shows incorrect feedback', () => {
      const decodeContainer = container.querySelector('#ch6-decode-questions');
      // 4 questions, correct answers are 1, 1, 1, 2. Pick wrong: 0, 0, 0, 0
      for (let qi = 0; qi < 4; qi++) {
        const btn = decodeContainer.querySelector(
          `.quiz-option[data-decode-q="${qi}"][data-decode-opt="0"]`
        );
        assert.ok(btn, `Decode option [q=${qi}, opt=0] should exist`);
        btn.click();
        assert.ok(
          btn.classList.contains('incorrect'),
          `Decode q${qi} should be marked incorrect`
        );
      }

      // All feedback slots should have content
      for (let qi = 0; qi < 4; qi++) {
        const fb = decodeContainer.querySelector(`[data-decode-feedback="${qi}"]`);
        assert.ok(fb.innerHTML.trim().length > 0, `Decode feedback ${qi} should appear`);
      }
    });

    it('generating summary with no fields shows an error', () => {
      const generateBtn = container.querySelector('#ch6-summary-generate');
      const errorDiv = container.querySelector('#ch6-summary-error');
      const resultDiv = container.querySelector('#ch6-summary-result');

      generateBtn.click();

      assert.ok(
        !errorDiv.classList.contains('hidden'),
        'Error should be visible when no fields filled'
      );
      assert.ok(
        resultDiv.classList.contains('hidden'),
        'Result should remain hidden'
      );
    });

    it('checking 2 action items does not trigger encouragement', () => {
      const planContainer = container.querySelector('#ch6-action-plan');
      const encouragementEl = container.querySelector('#ch6-action-encouragement');
      const items = planContainer.querySelectorAll('[data-action-idx]');

      // Click first 2
      items[0].click();
      items[1].click();

      const counter = container.querySelector('#ch6-action-counter');
      assert.ok(
        counter.textContent.includes('2 of 8'),
        'Counter should show 2 of 8'
      );
      assert.ok(
        encouragementEl.classList.contains('hidden'),
        'Encouragement should NOT show with only 2 items'
      );
    });

    it('checking 1 more (total 3) triggers encouragement', () => {
      const planContainer = container.querySelector('#ch6-action-plan');
      const encouragementEl = container.querySelector('#ch6-action-encouragement');
      const items = planContainer.querySelectorAll('[data-action-idx]');

      // Click 3 items
      items[0].click();
      items[1].click();
      items[2].click();

      const counter = container.querySelector('#ch6-action-counter');
      assert.ok(
        counter.textContent.includes('3 of 8'),
        'Counter should show 3 of 8'
      );
      assert.ok(
        !encouragementEl.classList.contains('hidden'),
        'Encouragement should show with 3 items checked'
      );
      assert.ok(
        encouragementEl.innerHTML.includes('spirit'),
        'Encouragement message should contain spirit'
      );
    });

    it('clicking "I\'m Ready" completes Chapter 6 and shows celebration', () => {
      const btn = container.querySelector('#ch6-complete-btn');
      assert.ok(btn, 'I\'m Ready button should exist');
      assert.ok(
        btn.textContent.includes("I'm Ready"),
        'Button text should say I\'m Ready'
      );

      btn.click();

      const progress = app.getProgress();
      assert.equal(progress[6], 'complete', 'Chapter 6 should be complete');
      assert.ok(btn.disabled, 'Button should be disabled');

      const celebration = container.querySelector('#ch6-celebration');
      assert.ok(
        !celebration.classList.contains('hidden'),
        'Celebration div should be visible'
      );
    });
  });

  // ----------------------------------------------------------------
  // STEP 9 — Navigate back to Chapter 1 and verify it shows as completed
  // ----------------------------------------------------------------
  describe('Step 9: Navigate back to Chapter 1 — verify completed', () => {
    it('Chapter 1 shows as completed when revisited', () => {
      // Complete chapters 1 and 2
      app.setChapterStatus(1, 'complete');
      app.setChapterStatus(2, 'complete');

      // Navigate back to Chapter 1
      app.navigateToChapter(1);

      const btn = container.querySelector('#ch1-complete-btn');
      assert.ok(btn, 'Complete button should exist');
      assert.ok(btn.disabled, 'Button should be disabled (already complete)');
      assert.ok(
        btn.classList.contains('completed'),
        'Button should have .completed class'
      );
      assert.ok(
        btn.textContent.includes('Completed'),
        'Button text should indicate completed'
      );

      // Progress bar should be 100%
      const bar = container.querySelector('#ch1-progress');
      assert.equal(bar.style.width, '100%', 'Progress bar should be at 100%');
    });
  });

  // ----------------------------------------------------------------
  // STEP 10 — Verify ALL 6 chapters show as complete in progress
  // ----------------------------------------------------------------
  describe('Step 10: All 6 chapters show as complete', () => {
    it('progress object has all 6 chapters marked complete', () => {
      // Complete every chapter
      for (let i = 1; i <= 6; i++) {
        app.setChapterStatus(i, 'complete');
      }

      const progress = app.getProgress();
      for (let i = 1; i <= 6; i++) {
        assert.equal(
          progress[i],
          'complete',
          `Chapter ${i} should be complete in progress`
        );
      }
    });

    it('sidebar shows completed indicator for all 6 chapters', () => {
      // Complete every chapter
      for (let i = 1; i <= 6; i++) {
        app.setChapterStatus(i, 'complete');
      }

      const navItems = document.querySelectorAll('#chapter-list .chapter-nav-item');
      assert.equal(navItems.length, 6, 'Should have 6 sidebar items');

      navItems.forEach((item, idx) => {
        const indicator = item.querySelector('.status-indicator');
        assert.ok(indicator, `Nav item ${idx} should have a status indicator`);
        // Completed chapters show the filled circle symbol
        assert.ok(
          indicator.textContent.trim().includes('\u25CF'),
          `Nav item ${idx + 1} should show filled circle (complete) indicator`
        );
        // Should NOT show lock icon
        assert.ok(
          !indicator.textContent.includes('\uD83D\uDD12'),
          `Nav item ${idx + 1} should NOT show lock icon`
        );
      });
    });

    it('navigating through all 6 completed chapters shows completed state without crashing', () => {
      for (let i = 1; i <= 6; i++) {
        app.setChapterStatus(i, 'complete');
      }

      for (let i = 1; i <= 6; i++) {
        app.navigateToChapter(i);
        // Each chapter should render without throwing
        const completeBtn = container.querySelector(
          `#ch${i}-complete-btn`
        );
        assert.ok(completeBtn, `Chapter ${i} should have a complete button`);
        assert.ok(
          completeBtn.disabled,
          `Chapter ${i} complete button should be disabled`
        );
      }
    });
  });
});
