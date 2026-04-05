const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { createTestEnv } = require('./setup');

describe('Chapter 5: Getting Things Done', () => {
  let window, document, app, container;

  beforeEach(() => {
    const env = createTestEnv({ immediateTimers: true });
    window = env.window;
    document = env.document;
    app = window.LaunchpadApp;
    container = document.getElementById('chapter-container');
    app.setChapterStatus(2, 'complete');
    app.navigateToChapter(5);
  });

  describe('Rendering', () => {
    it('displays the chapter title', () => {
      assert.ok(container.textContent.includes('Getting Things Done'));
    });

    it('displays the subtitle', () => {
      assert.ok(container.textContent.includes('How modern teams stay organized'));
    });

    it('displays time estimate', () => {
      assert.ok(container.textContent.includes('~15 min'));
    });

    it('renders the progress bar starting at 25%', () => {
      const bar = container.querySelector('#ch5-progress');
      assert.ok(bar);
      assert.equal(bar.style.width, '25%');
    });

    it('renders all four PM tool cards', () => {
      assert.ok(container.textContent.includes('Trello'));
      assert.ok(container.textContent.includes('Notion'));
      assert.ok(container.textContent.includes('Asana'));
      assert.ok(container.textContent.includes('Monday.com'));
    });

    it('renders core concepts', () => {
      assert.ok(container.textContent.includes('Board / Project'));
      assert.ok(container.textContent.includes('Column / List'));
      assert.ok(container.textContent.includes('Card / Task'));
    });

    it('renders before/after comparison', () => {
      assert.ok(container.textContent.includes('The old way'));
      assert.ok(container.textContent.includes('The new way'));
    });
  });

  describe('Organize Exercise', () => {
    it('renders 6 tasks', () => {
      const tasks = container.querySelector('#ch5-organize-tasks');
      const rows = tasks.querySelectorAll('[data-organize-feedback]');
      assert.equal(rows.length, 6);
    });

    it('each task has 3 column buttons', () => {
      for (let i = 0; i < 6; i++) {
        const btns = container.querySelectorAll(`[data-task-idx="${i}"].column-btn`);
        assert.equal(btns.length, 3, `Task ${i} should have 3 buttons`);
      }
    });

    it('task 0 (Book the venue) correct answer is Done', () => {
      const btns = container.querySelectorAll('[data-task-idx="0"].column-btn');
      const doneBtn = Array.from(btns).find(b => b.dataset.col === 'done');
      doneBtn.click();
      assert.ok(doneBtn.classList.contains('correct'));
    });

    it('task 1 (Print event flyers) correct answer is In Progress', () => {
      const btns = container.querySelectorAll('[data-task-idx="1"].column-btn');
      const progressBtn = Array.from(btns).find(b => b.dataset.col === 'progress');
      progressBtn.click();
      assert.ok(progressBtn.classList.contains('correct'));
    });

    it('task 2 (Send invitations) correct answer is To Do', () => {
      const btns = container.querySelectorAll('[data-task-idx="2"].column-btn');
      const todoBtn = Array.from(btns).find(b => b.dataset.col === 'todo');
      todoBtn.click();
      assert.ok(todoBtn.classList.contains('correct'));
    });

    it('wrong answer gets .incorrect class and correct is highlighted', () => {
      const btns = container.querySelectorAll('[data-task-idx="0"].column-btn');
      const todoBtn = Array.from(btns).find(b => b.dataset.col === 'todo');
      const doneBtn = Array.from(btns).find(b => b.dataset.col === 'done');
      todoBtn.click(); // wrong — correct is "done"
      assert.ok(todoBtn.classList.contains('incorrect'));
      assert.ok(doneBtn.classList.contains('correct'));
    });

    it('disables buttons after answering', () => {
      const btns = container.querySelectorAll('[data-task-idx="0"].column-btn');
      btns[0].click();
      btns.forEach(b => assert.equal(b.disabled, true));
    });

    it('shows summary after all 6 tasks answered', () => {
      for (let i = 0; i < 6; i++) {
        const btns = container.querySelectorAll(`[data-task-idx="${i}"].column-btn`);
        btns[0].click(); // any answer to complete
      }
      const result = container.querySelector('#ch5-organize-result');
      assert.ok(!result.classList.contains('hidden'));
      assert.ok(result.textContent.includes('project manager'));
    });
  });

  describe('Job Board Builder', () => {
    it('has job title and company inputs', () => {
      assert.ok(container.querySelector('#ch5-job-title'));
      assert.ok(container.querySelector('#ch5-job-company'));
    });

    it('has a status select and next step input', () => {
      assert.ok(container.querySelector('#ch5-job-status'));
      assert.ok(container.querySelector('#ch5-job-next'));
    });

    it('has Add to Board button', () => {
      const btn = container.querySelector('#ch5-add-card');
      assert.ok(btn);
    });

    it('shows error when title is empty', () => {
      container.querySelector('#ch5-job-company').value = 'Acme Corp';
      container.querySelector('#ch5-add-card').click();
      const error = container.querySelector('#ch5-board-error');
      assert.ok(!error.classList.contains('hidden'));
      assert.ok(error.textContent.includes('job title'));
    });

    it('shows error when company is empty', () => {
      container.querySelector('#ch5-job-title').value = 'Manager';
      container.querySelector('#ch5-add-card').click();
      const error = container.querySelector('#ch5-board-error');
      assert.ok(!error.classList.contains('hidden'));
    });

    it('adds card to the correct column (To Do)', () => {
      container.querySelector('#ch5-job-title').value = 'Admin';
      container.querySelector('#ch5-job-company').value = 'Library';
      container.querySelector('#ch5-job-status').value = 'todo';
      container.querySelector('#ch5-add-card').click();

      const col = container.querySelector('#ch5-col-todo');
      assert.equal(col.querySelectorAll('.kanban-card').length, 1);
      assert.ok(col.textContent.includes('Admin'));
      assert.ok(col.textContent.includes('Library'));
    });

    it('adds card to In Progress column', () => {
      container.querySelector('#ch5-job-title').value = 'Clerk';
      container.querySelector('#ch5-job-company').value = 'Bank';
      container.querySelector('#ch5-job-status').value = 'progress';
      container.querySelector('#ch5-add-card').click();

      const col = container.querySelector('#ch5-col-progress');
      assert.equal(col.querySelectorAll('.kanban-card').length, 1);
    });

    it('clears inputs after adding', () => {
      container.querySelector('#ch5-job-title').value = 'Admin';
      container.querySelector('#ch5-job-company').value = 'Library';
      container.querySelector('#ch5-add-card').click();

      assert.equal(container.querySelector('#ch5-job-title').value, '');
      assert.equal(container.querySelector('#ch5-job-company').value, '');
    });

    it('shows encouragement after 2 cards added', () => {
      for (let i = 0; i < 2; i++) {
        container.querySelector('#ch5-job-title').value = `Job ${i}`;
        container.querySelector('#ch5-job-company').value = `Co ${i}`;
        container.querySelector('#ch5-add-card').click();
      }
      const enc = container.querySelector('#ch5-board-encouragement');
      assert.ok(!enc.classList.contains('hidden'));
      assert.ok(enc.textContent.includes('taking shape'));
    });

    it('includes next step when provided', () => {
      container.querySelector('#ch5-job-title').value = 'Admin';
      container.querySelector('#ch5-job-company').value = 'Library';
      container.querySelector('#ch5-job-next').value = 'Send resume';
      container.querySelector('#ch5-add-card').click();

      const col = container.querySelector('#ch5-col-todo');
      assert.ok(col.textContent.includes('Send resume'));
    });

    it('renders kanban board with 3 columns', () => {
      const board = container.querySelector('#ch5-board-display');
      assert.ok(board);
      assert.ok(container.querySelector('#ch5-col-todo'));
      assert.ok(container.querySelector('#ch5-col-progress'));
      assert.ok(container.querySelector('#ch5-col-done'));
    });
  });

  describe('Quiz', () => {
    it('renders 4 quiz questions', () => {
      const quizContainer = container.querySelector('#ch5-quiz');
      const questions = quizContainer.querySelectorAll('[class="mb-8"]');
      assert.equal(questions.length, 4);
    });

    it('each question has 4 options', () => {
      for (let qi = 0; qi < 4; qi++) {
        const options = container.querySelectorAll(`#ch5-quiz [data-quiz="${qi}"].quiz-option`);
        assert.equal(options.length, 4, `Question ${qi + 1} should have 4 options`);
      }
    });

    it('Q1: correct answer is index 1 (group by status)', () => {
      const options = container.querySelectorAll('#ch5-quiz [data-quiz="0"].quiz-option');
      options[1].click();
      assert.ok(options[1].classList.contains('correct'));
    });

    it('Q2: correct answer is index 1 (project board)', () => {
      const options = container.querySelectorAll('#ch5-quiz [data-quiz="1"].quiz-option');
      options[1].click();
      assert.ok(options[1].classList.contains('correct'));
    });

    it('Q3: correct answer is index 2 (PowerPoint)', () => {
      const options = container.querySelectorAll('#ch5-quiz [data-quiz="2"].quiz-option');
      options[2].click();
      assert.ok(options[2].classList.contains('correct'));
    });

    it('Q4: correct answer is index 1 (smart spreadsheet)', () => {
      const options = container.querySelectorAll('#ch5-quiz [data-quiz="3"].quiz-option');
      options[1].click();
      assert.ok(options[1].classList.contains('correct'));
    });
  });

  describe('Mark Complete', () => {
    it('mark complete button exists', () => {
      assert.ok(container.querySelector('#ch5-complete-btn'));
    });

    it('clicking mark complete sets chapter 5 to complete', () => {
      container.querySelector('#ch5-complete-btn').click();
      assert.equal(app.getProgress()[5], 'complete');
    });

    it('button text changes after completing', () => {
      const btn = container.querySelector('#ch5-complete-btn');
      btn.click();
      assert.ok(btn.textContent.includes('Completed'));
    });

    it('button is disabled after completing', () => {
      const btn = container.querySelector('#ch5-complete-btn');
      btn.click();
      assert.equal(btn.disabled, true);
    });
  });

  describe('Already-completed state', () => {
    it('shows completed state when previously completed', () => {
      app.setChapterStatus(5, 'complete');
      app.navigateToChapter(5);
      const btn = container.querySelector('#ch5-complete-btn');
      assert.ok(btn.textContent.includes('Completed'));
      assert.equal(btn.disabled, true);
    });

    it('progress bar shows 100% for completed chapter', () => {
      app.setChapterStatus(5, 'complete');
      app.navigateToChapter(5);
      const bar = container.querySelector('#ch5-progress');
      assert.equal(bar.style.width, '100%');
    });
  });
});
