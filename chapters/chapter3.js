/**
 * Chapter 3: "Your Core Toolkit"
 */
window.Chapter3 = {
  render(container, app) {
    const progress = app.getProgress();
    const isComplete = progress[3] === 'complete';

    container.innerHTML = `
      <div class="fade-in">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-3xl">🧰</span>
            <div>
              <h2 class="text-3xl font-bold text-ink">Your Core Toolkit</h2>
              <p class="text-ink/60 text-sm">The essential digital tools — explained like a friend would</p>
            </div>
          </div>
          <div class="flex items-center gap-3 mt-4 text-sm text-ink/50">
            <span>~15 min</span>
            <span>•</span>
            <span>Chapter 3 of 6</span>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="progress-bar mb-10">
          <div class="progress-fill" id="ch3-progress" style="width: ${isComplete ? '100' : '0'}%"></div>
        </div>

        <!-- Section 1: Intro -->
        <div class="chapter-section">
          <p class="text-lg leading-relaxed mb-4">
            Every job today uses a handful of digital tools. The good news? They're designed to be easy.
            You don't need to be a tech expert — you just need to know the basics.
          </p>
          <p class="leading-relaxed">
            In this chapter, we'll walk through three essentials: <strong>spreadsheets</strong> for organizing numbers,
            <strong>email</strong> for professional communication, and <strong>search</strong> for finding anything online.
            By the end, you'll feel comfortable with all three.
          </p>
        </div>

        <!-- Section 2: Spreadsheets -->
        <div class="chapter-section">
          <h3 class="text-xl font-bold mb-4">Spreadsheets: your digital notebook with superpowers</h3>
          <p class="leading-relaxed mb-4">
            A spreadsheet is a grid of cells organized in rows and columns. Rows go across (numbered 1, 2, 3...)
            and columns go down (lettered A, B, C...). Each cell has an address — like A1 or B3.
          </p>
          <p class="leading-relaxed mb-6">
            You can type text, numbers, or <strong>formulas</strong> that do math for you. The most common formula
            is <code class="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-sm font-mono">=SUM()</code>
            which adds numbers together. That's really all you need to get started.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div class="comparison-good">
              <h4 class="font-bold text-emerald-800 mb-2">Google Sheets</h4>
              <ul class="space-y-1 text-sm text-emerald-900">
                <li>• Free to use</li>
                <li>• Works in your browser — nothing to install</li>
                <li>• Saves automatically</li>
                <li>• Great for collaborating with others</li>
              </ul>
            </div>
            <div class="card">
              <h4 class="font-bold text-ink mb-2">Microsoft Excel</h4>
              <ul class="space-y-1 text-sm text-ink/70">
                <li>• The industry standard</li>
                <li>• More powerful for advanced work</li>
                <li>• Comes with Microsoft 365</li>
                <li>• Desktop and web versions</li>
              </ul>
            </div>
          </div>

          <p class="text-ink/60 text-sm mb-6">They work almost identically. Learning one means you can use both.</p>

          <!-- Spreadsheet Exercise -->
          <div class="card border-2 border-accent/30 bg-amber-50/50" id="ch3-spreadsheet-exercise">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-2xl">⚡</span>
              <h4 class="text-lg font-bold">Try it: build your first formula</h4>
            </div>
            <p class="text-ink/60 mb-4">This mini spreadsheet shows monthly costs. Type a formula in the Total cell to add them up.</p>

            <div class="spreadsheet-wrapper mb-4">
              <table class="spreadsheet-grid">
                <thead>
                  <tr>
                    <th></th>
                    <th>A</th>
                    <th>B</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>1</th>
                    <td>Item</td>
                    <td>Cost</td>
                  </tr>
                  <tr>
                    <th>2</th>
                    <td>Rent</td>
                    <td>1200</td>
                  </tr>
                  <tr>
                    <th>3</th>
                    <td>Food</td>
                    <td>350</td>
                  </tr>
                  <tr>
                    <th>4</th>
                    <td>Total</td>
                    <td id="ch3-formula-cell"><input type="text" id="ch3-formula-input" placeholder="Type a formula..." autocomplete="off"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="flex items-center gap-3 mb-3">
              <button id="ch3-formula-check" class="bg-accent hover:bg-amber-500 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm">
                Check
              </button>
              <span class="text-xs text-ink/40">Hint: try =SUM(B2:B3)</span>
            </div>
            <div id="ch3-formula-feedback"></div>
          </div>
        </div>

        <!-- Section 3: Email & Calendar -->
        <div class="chapter-section">
          <h3 class="text-xl font-bold mb-4">Email & calendar: your professional home base</h3>
          <p class="leading-relaxed mb-4">
            Email is still the main way workplaces communicate. Two big platforms dominate:
            <strong>Gmail</strong> (by Google, free) and <strong>Outlook</strong> (by Microsoft, included with Microsoft 365).
            Both also include calendars for scheduling meetings and setting reminders.
          </p>

          <h4 class="font-medium mb-3">5 tips for professional emails:</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            <div class="card py-3 px-4">
              <p class="text-sm"><strong>1.</strong> Write a clear subject line — not "Hi" or blank</p>
            </div>
            <div class="card py-3 px-4">
              <p class="text-sm"><strong>2.</strong> Start with a greeting, get to the point, sign off</p>
            </div>
            <div class="card py-3 px-4">
              <p class="text-sm"><strong>3.</strong> Keep it brief — 3-5 sentences is usually plenty</p>
            </div>
            <div class="card py-3 px-4">
              <p class="text-sm"><strong>4.</strong> Proofread before hitting send</p>
            </div>
            <div class="card py-3 px-4 sm:col-span-2">
              <p class="text-sm"><strong>5.</strong> Use "Reply All" only when everyone needs to see it</p>
            </div>
          </div>

          <!-- Email Exercise -->
          <div id="ch3-email-exercise">
            <h4 class="text-lg font-bold mb-2">Spot the better email</h4>
            <p class="text-ink/60 mb-4">You're emailing a new manager on your first day. Which email is more professional?</p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div class="email-choice" data-choice="a" id="ch3-email-a">
                <p class="font-medium text-sm mb-2 text-ink/50">Email A</p>
                <div class="email-preview">Subject: hey\n\nhey sarah!! so excited to start today lol.\nwhens lunch? also do i need to bring\nmy laptop or what??\n\nthx</div>
              </div>
              <div class="email-choice" data-choice="b" id="ch3-email-b">
                <p class="font-medium text-sm mb-2 text-ink/50">Email B</p>
                <div class="email-preview">Subject: First day — looking forward to starting\n\nHi Sarah,\n\nI'm excited to be joining the team today.\nI wanted to check in and see if there's\nanything I should bring or prepare.\n\nLooking forward to meeting everyone.\n\nBest,\nJordan</div>
              </div>
            </div>
            <div id="ch3-email-feedback"></div>
          </div>
        </div>

        <!-- Section 4: Smarter Searching -->
        <div class="chapter-section">
          <h3 class="text-xl font-bold mb-4">Smarter searching: find anything in seconds</h3>
          <p class="leading-relaxed mb-6">
            Most people type vague questions into Google. A few small changes make a huge difference
            in what you find. Here are five tricks that work every time:
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            <div class="card py-3 px-4">
              <p class="text-sm"><strong>Be specific:</strong> Instead of "jobs" try "entry-level admin assistant jobs in Chicago"</p>
            </div>
            <div class="card py-3 px-4">
              <p class="text-sm"><strong>Use quotes:</strong> <code class="bg-primary/10 text-primary px-1 rounded text-xs">"project manager"</code> finds that exact phrase</p>
            </div>
            <div class="card py-3 px-4">
              <p class="text-sm"><strong>Add "beginner":</strong> Great for learning new topics without jargon</p>
            </div>
            <div class="card py-3 px-4">
              <p class="text-sm"><strong>Use site:</strong> <code class="bg-primary/10 text-primary px-1 rounded text-xs">site:linkedin.com</code> searches only that website</p>
            </div>
            <div class="card py-3 px-4 sm:col-span-2">
              <p class="text-sm"><strong>Minus sign:</strong> <code class="bg-primary/10 text-primary px-1 rounded text-xs">apple -fruit</code> removes the word "fruit" from results</p>
            </div>
          </div>

          <!-- Search Exercise -->
          <div id="ch3-search-exercise">
            <h4 class="text-lg font-bold mb-2">Improve the search</h4>
            <p class="text-ink/60 mb-4">For each scenario, pick the best search query.</p>
            <div id="ch3-search-questions"></div>
          </div>
        </div>

        <!-- Section 5: Quiz -->
        <div class="chapter-section">
          <h3 class="text-xl font-bold mb-2">Quick check</h3>
          <p class="text-ink/60 mb-6">Let's see what stuck. No pressure — this is just for you.</p>
          <div id="ch3-quiz"></div>
        </div>

        <!-- Section 6: Mark Complete -->
        <div class="chapter-section text-center pt-4">
          <div class="card inline-block px-8 py-6">
            <p class="text-ink/60 mb-4" id="ch3-complete-msg">${isComplete ? "You've completed this chapter!" : "Ready to move on? You're building real skills."}</p>
            <button id="ch3-complete-btn" class="btn-complete ${isComplete ? 'completed' : ''}">
              ${isComplete ? '✓ Completed' : 'Mark as Complete →'}
            </button>
          </div>
        </div>
      </div>
    `;

    // Progress tracking
    let sectionsDone = { spreadsheet: false, email: false, search: false, quiz: false };

    function updateProgress() {
      if (isComplete) return;
      const done = Object.values(sectionsDone).filter(Boolean).length;
      const pct = Math.round((done / 4) * 100);
      const bar = container.querySelector('#ch3-progress');
      if (bar) bar.style.width = pct + '%';
    }

    // Wire up interactives
    setupSpreadsheetExercise(container);
    setupEmailExercise(container);
    setupSearchExercise(container);
    buildQuiz(container);

    // Mark complete button
    const completeBtn = container.querySelector('#ch3-complete-btn');
    if (!isComplete) {
      completeBtn.addEventListener('click', () => {
        app.setChapterStatus(3, 'complete');
        completeBtn.classList.add('completed');
        completeBtn.textContent = '✓ Completed';
        completeBtn.disabled = true;

        const bar = container.querySelector('#ch3-progress');
        if (bar) bar.style.width = '100%';

        const msg = container.querySelector('#ch3-complete-msg');
        msg.textContent = "Great work! You now have the core toolkit. On to Chapter 4.";

        setTimeout(() => {
          app.navigateToChapter(4);
        }, 1200);
      });
    } else {
      completeBtn.disabled = true;
    }

    // === Spreadsheet Exercise ===
    function setupSpreadsheetExercise(container) {
      const input = container.querySelector('#ch3-formula-input');
      const checkBtn = container.querySelector('#ch3-formula-check');
      const feedback = container.querySelector('#ch3-formula-feedback');
      const cell = container.querySelector('#ch3-formula-cell');

      const validFormulas = [
        '=sum(b2:b3)',
        '=sum(b2,b3)',
        '=b2+b3',
        '=1200+350',
        '=350+1200',
      ];

      function checkFormula() {
        const val = input.value.trim().toLowerCase().replace(/\s/g, '');
        if (!val) return;

        const isCorrect = validFormulas.includes(val);

        if (isCorrect) {
          feedback.innerHTML = `
            <div class="quiz-feedback correct fade-in">
              🎉 That's it! =SUM(B2:B3) adds up everything in those cells. The answer is <strong>1,550</strong>. You just wrote your first formula!
            </div>
          `;
          cell.innerHTML = '<span class="cell-result">1550</span>';
          checkBtn.disabled = true;
          checkBtn.classList.add('opacity-50');
          sectionsDone.spreadsheet = true;
          updateProgress();
        } else {
          feedback.innerHTML = `
            <div class="quiz-feedback incorrect fade-in">
              💡 Not quite — try typing <strong>=SUM(B2:B3)</strong> to add up the costs. SUM is a formula that adds numbers together.
            </div>
          `;
        }
      }

      checkBtn.addEventListener('click', checkFormula);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') checkFormula();
      });
    }

    // === Email Exercise ===
    function setupEmailExercise(container) {
      const emailA = container.querySelector('#ch3-email-a');
      const emailB = container.querySelector('#ch3-email-b');
      const feedback = container.querySelector('#ch3-email-feedback');
      let answered = false;

      function handleChoice(choice) {
        if (answered) return;
        answered = true;

        emailA.classList.add('disabled');
        emailB.classList.add('disabled');

        if (choice === 'b') {
          emailB.classList.add('selected-correct');
          feedback.innerHTML = `
            <div class="quiz-feedback correct fade-in mt-3">
              🎉 Exactly right! Email B has a clear subject line, proper greeting, gets to the point, and ends professionally. This is what employers expect.
            </div>
          `;
        } else {
          emailA.classList.add('selected-incorrect');
          emailB.classList.add('selected-correct');
          feedback.innerHTML = `
            <div class="quiz-feedback incorrect fade-in mt-3">
              💡 Not quite. Email A is too casual for a workplace setting. Notice how Email B has a clear subject, proper greeting, and professional tone — that's the standard.
            </div>
          `;
        }

        sectionsDone.email = true;
        updateProgress();
      }

      emailA.addEventListener('click', () => handleChoice('a'));
      emailB.addEventListener('click', () => handleChoice('b'));
    }

    // === Search Exercise ===
    function setupSearchExercise(container) {
      const searchData = [
        {
          scenario: 'You want to find free online courses for learning Excel.',
          vague: 'excel courses',
          options: [
            'excel courses online',
            'free beginner Excel courses online 2026',
            'how to use computers',
          ],
          correct: 1,
          explanations: [
            "That's better than the original, but adding 'free' and 'beginner' would narrow it down even more.",
            "Great instinct! Adding 'free,' 'beginner,' and the year helps find exactly what you need.",
            "That's way too broad — you'd get millions of unrelated results. Be specific about what you want.",
          ],
        },
        {
          scenario: 'You want to find the exact meaning of "accounts receivable."',
          vague: 'what does accounts receivable mean',
          options: [
            '"accounts receivable" definition simple',
            'accounting words',
            'accounts receivable',
          ],
          correct: 0,
          explanations: [
            "Spot on! Quotes ensure Google searches for those exact words together, and 'simple' gets you a plain-English answer.",
            "Too vague — you'd get a huge list of accounting terms. Using quotes around the exact phrase helps.",
            "That would work, but you'd get a mix of everything. Adding quotes and 'definition simple' is more precise.",
          ],
        },
        {
          scenario: 'You want to find job listings only on LinkedIn.',
          vague: 'jobs on linkedin',
          options: [
            'linkedin.com jobs',
            'site:linkedin.com entry-level jobs',
            'best job websites',
          ],
          correct: 1,
          explanations: [
            "That might work, but using 'site:linkedin.com' is more precise — it tells Google to ONLY search LinkedIn.",
            "The site: trick is one of the most useful search skills. It tells Google to only look at that one website.",
            "That would find articles about job websites, not actual job listings on LinkedIn.",
          ],
        },
      ];

      const questionsContainer = container.querySelector('#ch3-search-questions');
      let answeredCount = 0;

      searchData.forEach((q, qi) => {
        const qDiv = document.createElement('div');
        qDiv.className = 'mb-6 card';
        qDiv.innerHTML = `
          <p class="text-sm text-ink/60 mb-1">${q.scenario}</p>
          <p class="text-sm mb-3">Current search: <code class="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-xs font-mono">${q.vague}</code></p>
          <div class="space-y-2" data-search-q="${qi}">
            ${q.options.map((opt, oi) => `
              <button class="quiz-option" data-search-q="${qi}" data-search-opt="${oi}">
                ${opt}
              </button>
            `).join('')}
          </div>
          <div data-search-feedback="${qi}"></div>
        `;
        questionsContainer.appendChild(qDiv);
      });

      questionsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.quiz-option');
        if (!btn || btn.disabled) return;

        const qi = parseInt(btn.dataset.searchQ);
        const oi = parseInt(btn.dataset.searchOpt);
        if (isNaN(qi) || isNaN(oi)) return;
        const q = searchData[qi];

        const siblings = questionsContainer.querySelectorAll(`[data-search-q="${qi}"].quiz-option`);
        siblings.forEach(s => {
          s.disabled = true;
          if (parseInt(s.dataset.searchOpt) === q.correct) {
            s.classList.add('correct');
          }
        });

        const isCorrect = oi === q.correct;
        if (!isCorrect) {
          btn.classList.add('incorrect');
        }

        const feedbackSlot = questionsContainer.querySelector(`[data-search-feedback="${qi}"]`);
        feedbackSlot.innerHTML = `
          <div class="quiz-feedback ${isCorrect ? 'correct' : 'incorrect'} fade-in mt-2">
            ${isCorrect ? '🎉' : '💡'} ${q.explanations[oi]}
          </div>
        `;

        answeredCount++;
        if (answeredCount === searchData.length) {
          sectionsDone.search = true;
          updateProgress();
        }
      });
    }

    // === End Quiz ===
    function buildQuiz(container) {
      const quizData = [
        {
          q: 'In a spreadsheet, what does the formula =SUM(A1:A5) do?',
          options: [
            'Deletes cells A1 through A5',
            'Adds up the values in cells A1 through A5',
            'Sorts the cells alphabetically',
            'Copies cell A1 into A5',
          ],
          correct: 1,
          explanations: [
            "Not at all — formulas never delete anything. SUM adds numbers together.",
            "Exactly right! SUM adds up all the values in the range you give it. It's the most common formula.",
            "Not quite — SUM is for adding numbers, not sorting. Think: SUM = total.",
            "No — SUM doesn't copy anything. It adds up the numbers in those cells.",
          ],
        },
        {
          q: 'Which of these is the BEST subject line for a professional email?',
          options: [
            '"hey!"',
            '(no subject)',
            '"Meeting request: Q2 budget review — Thursday 2pm"',
            '"URGENT READ THIS NOW!!!!"',
          ],
          correct: 2,
          explanations: [
            "Too casual for a workplace email. Subject lines should tell the reader what the email is about.",
            "Leaving the subject blank makes your email easy to miss or ignore. Always include one.",
            "That's the one! It's specific, professional, and tells the reader exactly what to expect.",
            "All caps and exclamation marks come across as aggressive. Save 'urgent' for genuine emergencies.",
          ],
        },
        {
          q: 'What does putting quotes around a Google search term do?',
          options: [
            'Makes the search faster',
            'Searches for that exact phrase',
            'Searches only in images',
            'Translates the search to another language',
          ],
          correct: 1,
          explanations: [
            "Quotes don't affect speed. They tell Google to find that exact phrase, word-for-word.",
            "That's right! Quotes tell Google: 'find these words in this exact order.' Super useful for specific phrases.",
            "Nope — for images you'd click the Images tab. Quotes are for exact phrase matching.",
            "Quotes don't translate anything. They lock in the exact wording of your search.",
          ],
        },
        {
          q: 'You need to add up costs in a spreadsheet. Which tool would you use?',
          options: [
            'Google Calendar',
            'Microsoft Outlook',
            'Google Sheets or Excel',
            'A search engine',
          ],
          correct: 2,
          explanations: [
            "Google Calendar is for scheduling, not calculations. You'd want a spreadsheet for adding numbers.",
            "Outlook is for email and calendar. For adding up costs, you need a spreadsheet.",
            "Exactly! Spreadsheets like Google Sheets and Excel are built for organizing and calculating numbers.",
            "A search engine finds information online. For calculating costs, you'd use a spreadsheet.",
          ],
        },
      ];

      const quizContainer = container.querySelector('#ch3-quiz');

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

        const isCorrect = oi === q.correct;
        if (!isCorrect) {
          btn.classList.add('incorrect');
        }

        const feedbackSlot = quizContainer.querySelector(`[data-quiz-feedback="${qi}"]`);
        feedbackSlot.innerHTML = `
          <div class="quiz-feedback ${isCorrect ? 'correct' : 'incorrect'} fade-in">
            ${isCorrect ? '🎉' : '💡'} ${q.explanations[oi]}
          </div>
        `;

        answeredCount++;
        if (answeredCount === quizData.length) {
          sectionsDone.quiz = true;
          updateProgress();
        }
      });
    }
  },
};
