/**
 * Chapter 5: "Getting Things Done" — Digital Project Management
 */
window.Chapter5 = {
  render(container, app) {
    const progress = app.getProgress();
    const isComplete = progress[5] === 'complete';

    container.innerHTML = `
      <div class="fade-in">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-3xl">📋</span>
            <div>
              <h2 class="text-3xl font-bold text-ink">Getting Things Done</h2>
              <p class="text-ink/60 text-sm">How modern teams stay organized — and how you can too</p>
            </div>
          </div>
          <div class="flex items-center gap-3 mt-4 text-sm text-ink/50">
            <span>~15 min</span>
            <span>•</span>
            <span>Chapter 5 of 6</span>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="progress-bar mb-10">
          <div class="progress-fill" id="ch5-progress" style="width: ${isComplete ? '100' : '25'}%"></div>
        </div>

        <!-- Section 1: Intro -->
        <div class="chapter-section">
          <p class="text-lg leading-relaxed mb-4">
            You already manage projects every day — grocery lists, planning a move, organizing a family event.
            Project management tools just put that on a screen so nothing slips through the cracks.
          </p>
          <p class="leading-relaxed">
            These tools are used by teams of all sizes, from small businesses to large companies. Knowing the basics
            is a real advantage on your resume. And the good news — they're all designed to be visual and easy to learn.
          </p>
        </div>

        <!-- Section 2: The Big Four Tools -->
        <div class="chapter-section">
          <h3 class="text-xl font-bold mb-4">The four tools you'll hear about</h3>
          <p class="leading-relaxed mb-6">They all help teams organize work. Each has a slightly different style, but the core idea is the same.</p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div class="card border-l-4 border-l-blue-500">
              <h4 class="font-bold mb-1">Trello</h4>
              <p class="text-sm text-ink/70">Visual boards with cards you move between columns. Think of sticky notes on a wall. Great for simple, visual task tracking.</p>
            </div>
            <div class="card border-l-4 border-l-ink/30">
              <h4 class="font-bold mb-1">Notion</h4>
              <p class="text-sm text-ink/70">An all-in-one workspace — notes, databases, wikis, and task lists. Like a digital binder that does everything.</p>
            </div>
            <div class="card border-l-4 border-l-accent">
              <h4 class="font-bold mb-1">Asana</h4>
              <p class="text-sm text-ink/70">Task management for teams — assign work, set deadlines, and track progress. Popular in marketing and operations teams.</p>
            </div>
            <div class="card border-l-4 border-l-success">
              <h4 class="font-bold mb-1">Monday.com</h4>
              <p class="text-sm text-ink/70">Visual workflow management that feels like a smart spreadsheet. Easy to learn, very popular in small and medium businesses.</p>
            </div>
          </div>

          <h4 class="font-medium mb-3">The core concepts (shared by all four):</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            <div class="card py-3 px-4">
              <p class="text-sm"><strong>Board / Project:</strong> The big container for related work</p>
            </div>
            <div class="card py-3 px-4">
              <p class="text-sm"><strong>Column / List:</strong> A group of tasks with a shared status</p>
            </div>
            <div class="card py-3 px-4">
              <p class="text-sm"><strong>Card / Task:</strong> A single piece of work with a title and details</p>
            </div>
            <div class="card py-3 px-4">
              <p class="text-sm"><strong>Status tracking:</strong> Moving cards between columns to show progress</p>
            </div>
          </div>

          <h4 class="font-medium mb-3">See the difference:</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="comparison-bad">
              <p class="font-bold text-amber-800 mb-2 text-sm">The old way</p>
              <p class="text-sm text-amber-900">Keeping track of job applications with sticky notes, memory, and scattered emails. Hoping you don't forget to follow up.</p>
            </div>
            <div class="comparison-good">
              <p class="font-bold text-emerald-800 mb-2 text-sm">The new way</p>
              <p class="text-sm text-emerald-900">A digital board where every application has a card showing the company, role, status, and your next step. Nothing falls through the cracks.</p>
            </div>
          </div>
        </div>

        <!-- Section 3: Exercise 1 — Organize the Board -->
        <div class="chapter-section">
          <div class="card border-2 border-accent/30 bg-amber-50/50">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-2xl">⚡</span>
              <h3 class="text-lg font-bold">Organize the board</h3>
            </div>
            <p class="text-ink/60 mb-4">You're helping plan a community event. For each task, click the right column: To Do, In Progress, or Done.</p>
            <div id="ch5-organize-tasks"></div>
            <div id="ch5-organize-result" class="hidden mt-4"></div>
          </div>
        </div>

        <!-- Section 4: Exercise 2 — Build Your Job Search Board -->
        <div class="chapter-section">
          <div class="card border-2 border-primary/20">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-2xl">📌</span>
              <h3 class="text-lg font-bold">Build your job search board</h3>
            </div>
            <p class="text-ink/60 mb-4">Add job applications to your personal board. Fill in the details and click "Add to Board."</p>

            <div class="space-y-3 mb-4">
              <div>
                <label class="block text-sm font-medium mb-1">Job Title *</label>
                <input type="text" id="ch5-job-title" class="w-full px-4 py-3 border border-ink/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g., Office Administrator" autocomplete="off">
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Company *</label>
                <input type="text" id="ch5-job-company" class="w-full px-4 py-3 border border-ink/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g., City Library" autocomplete="off">
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Status</label>
                <select id="ch5-job-status" class="w-full px-4 py-3 border border-ink/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white">
                  <option value="todo">To Do — Haven't applied yet</option>
                  <option value="progress">In Progress — Applied / Interviewing</option>
                  <option value="done">Done — Got an answer</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Next Step</label>
                <input type="text" id="ch5-job-next" class="w-full px-4 py-3 border border-ink/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g., Send resume by Friday" autocomplete="off">
              </div>
            </div>

            <button id="ch5-add-card" class="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-lg transition-colors mb-4">
              Add to Board
            </button>
            <div id="ch5-board-error" class="hidden text-sm text-red-600 mb-3"></div>
            <div id="ch5-board-encouragement" class="hidden"></div>

            <div class="kanban-board mt-4" id="ch5-board-display">
              <div class="kanban-column">
                <div class="kanban-column-header todo">To Do</div>
                <div id="ch5-col-todo"></div>
              </div>
              <div class="kanban-column">
                <div class="kanban-column-header in-progress">In Progress</div>
                <div id="ch5-col-progress"></div>
              </div>
              <div class="kanban-column">
                <div class="kanban-column-header done">Done</div>
                <div id="ch5-col-done"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 5: Quiz -->
        <div class="chapter-section">
          <h3 class="text-xl font-bold mb-2">Quick check</h3>
          <p class="text-ink/60 mb-6">Let's see what stuck. No pressure — this is just for you.</p>
          <div id="ch5-quiz"></div>
        </div>

        <!-- Section 6: Mark Complete -->
        <div class="chapter-section text-center pt-4">
          <div class="card inline-block px-8 py-6">
            <p class="text-ink/60 mb-4" id="ch5-complete-msg">${isComplete ? "You've completed this chapter!" : "Ready to move on? You've got the project management basics down."}</p>
            <button id="ch5-complete-btn" class="btn-complete ${isComplete ? 'completed' : ''}">
              ${isComplete ? '✓ Completed' : 'Mark as Complete →'}
            </button>
          </div>
        </div>
      </div>
    `;

    // Progress tracking
    let sectionsDone = { intro: true, organizeTask: false, jobBoard: false, quiz: false };

    function updateProgress() {
      if (isComplete) return;
      const done = Object.values(sectionsDone).filter(Boolean).length;
      const pct = Math.round((done / 4) * 100);
      const bar = container.querySelector('#ch5-progress');
      if (bar) bar.style.width = pct + '%';
    }

    // Wire up interactives
    setupOrganizeExercise(container);
    setupJobBoard(container);
    buildQuiz(container);

    // Mark complete button
    const completeBtn = container.querySelector('#ch5-complete-btn');
    if (!isComplete) {
      completeBtn.addEventListener('click', () => {
        app.setChapterStatus(5, 'complete');
        completeBtn.classList.add('completed');
        completeBtn.textContent = '✓ Completed';
        completeBtn.disabled = true;

        const bar = container.querySelector('#ch5-progress');
        if (bar) bar.style.width = '100%';

        const msg = container.querySelector('#ch5-complete-msg');
        msg.textContent = "You've got the project management basics down. On to the final chapter!";

        setTimeout(() => {
          app.navigateToChapter(6);
        }, 1200);
      });
    } else {
      completeBtn.disabled = true;
    }

    // === Organize Exercise ===
    function setupOrganizeExercise(container) {
      const tasks = [
        { name: 'Book the venue', hint: 'Confirmed last week', correct: 'done' },
        { name: 'Print event flyers', hint: 'At the printer now', correct: 'progress' },
        { name: 'Send invitations', hint: "Haven't started yet", correct: 'todo' },
        { name: 'Set up registration page', hint: 'Draft is ready, needs review', correct: 'progress' },
        { name: 'Order catering', hint: 'Need to get quotes first', correct: 'todo' },
        { name: 'Write thank-you notes', hint: 'Do this after the event', correct: 'todo' },
      ];

      const labels = { todo: 'To Do', progress: 'In Progress', done: 'Done' };
      const tasksContainer = container.querySelector('#ch5-organize-tasks');
      let answeredCount = 0;

      tasks.forEach((task, idx) => {
        const div = document.createElement('div');
        div.className = 'flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 pb-3 border-b border-ink/10';
        div.innerHTML = `
          <div class="flex-1">
            <p class="font-medium text-sm">${task.name}</p>
            <p class="text-xs text-ink/50 italic">${task.hint}</p>
          </div>
          <div class="flex gap-2" data-task-idx="${idx}">
            <button class="column-btn" data-task-idx="${idx}" data-col="todo">To Do</button>
            <button class="column-btn" data-task-idx="${idx}" data-col="progress">In Progress</button>
            <button class="column-btn" data-task-idx="${idx}" data-col="done">Done</button>
          </div>
          <div data-organize-feedback="${idx}" class="text-xs mt-1 sm:mt-0"></div>
        `;
        tasksContainer.appendChild(div);
      });

      tasksContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.column-btn');
        if (!btn || btn.disabled) return;

        const idx = parseInt(btn.dataset.taskIdx);
        const col = btn.dataset.col;
        if (isNaN(idx)) return;
        const task = tasks[idx];

        // Disable all buttons for this task
        const siblings = tasksContainer.querySelectorAll(`[data-task-idx="${idx}"].column-btn`);
        siblings.forEach(s => {
          s.disabled = true;
          if (s.dataset.col === task.correct) {
            s.classList.add('correct');
          }
        });

        const isCorrect = col === task.correct;
        if (!isCorrect) {
          btn.classList.add('incorrect');
        }

        const feedbackSlot = tasksContainer.querySelector(`[data-organize-feedback="${idx}"]`);
        feedbackSlot.innerHTML = isCorrect
          ? `<span class="text-emerald-700">✓ ${labels[task.correct]}</span>`
          : `<span class="text-red-600">→ ${labels[task.correct]}</span>`;

        answeredCount++;
        if (answeredCount === tasks.length) {
          sectionsDone.organizeTask = true;
          updateProgress();

          const result = container.querySelector('#ch5-organize-result');
          result.innerHTML = `
            <div class="quiz-feedback correct fade-in">
              🎉 You just sorted tasks like a project manager! This is exactly how Trello, Asana, Monday.com, and Notion boards work.
            </div>
          `;
          result.classList.remove('hidden');
        }
      });
    }

    // === Job Board Builder ===
    function setupJobBoard(container) {
      const titleInput = container.querySelector('#ch5-job-title');
      const companyInput = container.querySelector('#ch5-job-company');
      const statusSelect = container.querySelector('#ch5-job-status');
      const nextInput = container.querySelector('#ch5-job-next');
      const addBtn = container.querySelector('#ch5-add-card');
      const errorDiv = container.querySelector('#ch5-board-error');
      const encouragement = container.querySelector('#ch5-board-encouragement');

      const columns = {
        todo: container.querySelector('#ch5-col-todo'),
        progress: container.querySelector('#ch5-col-progress'),
        done: container.querySelector('#ch5-col-done'),
      };

      let cardCount = 0;

      addBtn.addEventListener('click', () => {
        const title = titleInput.value.trim();
        const company = companyInput.value.trim();
        const status = statusSelect.value;
        const nextStep = nextInput.value.trim();

        // Validate required fields
        if (!title || !company) {
          errorDiv.textContent = 'Please fill in at least the job title and company.';
          errorDiv.classList.remove('hidden');
          return;
        }

        errorDiv.classList.add('hidden');

        // Create card
        const card = document.createElement('div');
        card.className = 'kanban-card fade-in';
        card.innerHTML = `
          <p class="font-medium">${escapeHtml(title)}</p>
          <p class="text-ink/50 text-xs">${escapeHtml(company)}</p>
          ${nextStep ? `<p class="text-xs text-primary mt-1">Next: ${escapeHtml(nextStep)}</p>` : ''}
        `;

        columns[status].appendChild(card);
        cardCount++;

        // Clear inputs
        titleInput.value = '';
        companyInput.value = '';
        nextInput.value = '';
        statusSelect.selectedIndex = 0;

        // Check completion
        if (cardCount >= 2 && !sectionsDone.jobBoard) {
          sectionsDone.jobBoard = true;
          updateProgress();
          encouragement.innerHTML = `
            <div class="quiz-feedback correct fade-in mt-3">
              🎉 Your board is taking shape! You can use a real tool like Trello or Monday.com to keep this going.
            </div>
          `;
          encouragement.classList.remove('hidden');
        }
      });
    }

    // === End Quiz ===
    function buildQuiz(container) {
      const quizData = [
        {
          q: 'What is the purpose of columns (or lists) on a project board?',
          options: [
            'To make the board look colorful',
            'To group tasks by their status — like To Do, In Progress, and Done',
            'To sort tasks alphabetically',
            'To delete tasks you don\'t need anymore',
          ],
          correct: 1,
          explanations: [
            "Columns aren't about decoration. They represent stages of work — each column shows where a task stands.",
            "That's right! Columns represent stages in your workflow. Moving a card from 'To Do' to 'Done' shows progress at a glance.",
            "Columns aren't about alphabetical order. They group tasks by status — where each task is in the process.",
            "Columns don't delete anything. They organize tasks by status so you can see what's been done and what's left.",
          ],
        },
        {
          q: 'You\'re tracking several job applications. Which approach helps most?',
          options: [
            'A spreadsheet formula',
            'A project board with columns for each stage',
            'A search engine',
            'An email folder',
          ],
          correct: 1,
          explanations: [
            "Spreadsheets can track data, but a project board with visual columns makes it much easier to see your progress at a glance.",
            "Exactly! A board with columns like 'Researching,' 'Applied,' and 'Interview Scheduled' gives you a clear picture of where every application stands.",
            "A search engine finds listings, but it won't track your applications. A project board is built for that.",
            "Email folders sort messages, but aren't designed for tracking progress. A project board is purpose-built for this.",
          ],
        },
        {
          q: 'Which of these is NOT a project management tool we covered?',
          options: [
            'Trello',
            'Notion',
            'PowerPoint',
            'Asana',
          ],
          correct: 2,
          explanations: [
            "Trello is one of the four! It uses boards, lists, and cards to organize work visually.",
            "Notion is one of the four! It's the all-in-one workspace for notes, databases, and task management.",
            "Correct! PowerPoint is a presentation tool, not a project management tool. The four we covered are Trello, Notion, Asana, and Monday.com.",
            "Asana is one of the four! It's focused on task management with projects, tasks, and deadlines.",
          ],
        },
        {
          q: 'What does Monday.com feel like to use?',
          options: [
            'A social media feed',
            'A smart spreadsheet with visual workflows',
            'A word processor',
            'A video player',
          ],
          correct: 1,
          explanations: [
            "Monday.com isn't like social media. It uses a spreadsheet-like layout with colorful status tracking and workflow views.",
            "That's right! Monday.com has a familiar spreadsheet feel but adds visual workflow features like status colors, timelines, and automations.",
            "Word processors are for writing documents. Monday.com is for managing tasks and projects visually.",
            "Monday.com has nothing to do with video. It's a visual project management tool that feels like a smart spreadsheet.",
          ],
        },
      ];

      const quizContainer = container.querySelector('#ch5-quiz');

      quizData.forEach((q, qi) => {
        const qDiv = document.createElement('div');
        qDiv.className = 'mb-8';
        qDiv.innerHTML = `
          <p class="font-medium mb-3">${qi + 1}. ${q.q}</p>
          <div class="space-y-2" data-quiz="${qi}">
            ${q.options.map((opt, oi) => `
              <button class="quiz-option" data-quiz="${qi}" data-option="${oi}">
                ${String.fromCharCode(97 + oi)}) ${opt}
              </button>
            `).join('')}
          </div>
          <div class="quiz-feedback-slot" data-quiz-feedback="${qi}"></div>
        `;
        quizContainer.appendChild(qDiv);
      });

      let answeredCount = 0;

      quizContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.quiz-option');
        if (!btn || btn.disabled) return;

        const qi = parseInt(btn.dataset.quiz);
        const oi = parseInt(btn.dataset.option);
        if (isNaN(qi) || isNaN(oi)) return;
        const q = quizData[qi];

        const siblings = quizContainer.querySelectorAll(`[data-quiz="${qi}"].quiz-option`);
        siblings.forEach(s => {
          s.disabled = true;
          if (parseInt(s.dataset.option) === q.correct) {
            s.classList.add('correct');
          }
        });

        if (oi !== q.correct) {
          btn.classList.add('incorrect');
        }

        const feedbackSlot = quizContainer.querySelector(`[data-quiz-feedback="${qi}"]`);
        feedbackSlot.innerHTML = `
          <div class="quiz-feedback ${oi === q.correct ? 'correct' : 'incorrect'} fade-in">
            ${oi === q.correct ? '🎉' : '💡'} ${q.explanations[oi]}
          </div>
        `;

        answeredCount++;
        if (answeredCount === quizData.length) {
          sectionsDone.quiz = true;
          updateProgress();
        }
      });
    }

    function escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }
  },
};
