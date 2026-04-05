/**
 * Chapter 6: "You're Ready" — Everything you've learned, now put it to work
 */
window.Chapter6 = {
  render(container, app) {
    const progress = app.getProgress();
    const isComplete = progress[6] === 'complete';

    container.innerHTML = `
      <div class="fade-in">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-3xl">🚀</span>
            <div>
              <h2 class="text-3xl font-bold text-ink">You're Ready</h2>
              <p class="text-ink/60 text-sm">Everything you've learned — now put it to work</p>
            </div>
          </div>
          <div class="flex items-center gap-3 mt-4 text-sm text-ink/50">
            <span>~12 min</span>
            <span>•</span>
            <span>Chapter 6 of 6</span>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="progress-bar mb-10">
          <div class="progress-fill" id="ch6-progress" style="width: ${isComplete ? '100' : '20'}%"></div>
        </div>

        <!-- Section 1: Intro -->
        <div class="chapter-section">
          <p class="text-lg leading-relaxed mb-4">
            Look how far you've come. You learned how spreadsheets work, how to write professional emails,
            how to search the internet like a pro, how to talk to AI, and how to manage projects with digital tools.
          </p>
          <p class="leading-relaxed">
            You already have real digital skills — the kind employers are looking for. This final chapter
            helps you see that clearly, package what you know, and take your next step with confidence.
          </p>
        </div>
        <!-- Section 2: What employers mean by "digital skills" -->
        <div class="chapter-section">
          <h3 class="text-xl font-bold mb-4">What employers really mean by "digital skills"</h3>
          <p class="leading-relaxed mb-6">Job listings are full of buzzwords. Here's what they actually mean — and why you already qualify.</p>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div class="card border-l-4 border-l-blue-500">
              <h4 class="font-bold mb-1 text-sm">"Proficient in Microsoft Office"</h4>
              <p class="text-sm text-ink/70">They mean basic Word, Excel, and PowerPoint. If you can make a spreadsheet and write a document, you're there.</p>
            </div>
            <div class="card border-l-4 border-l-accent">
              <h4 class="font-bold mb-1 text-sm">"Comfortable with digital tools"</h4>
              <p class="text-sm text-ink/70">They mean you can learn new apps without panicking. You've been doing that throughout this course.</p>
            </div>
            <div class="card border-l-4 border-l-success">
              <h4 class="font-bold mb-1 text-sm">"Strong written communication"</h4>
              <p class="text-sm text-ink/70">They mean clear, professional emails and messages. Chapter 2 covered exactly this.</p>
            </div>
            <div class="card border-l-4 border-l-primary">
              <h4 class="font-bold mb-1 text-sm">"Experience with collaboration platforms"</h4>
              <p class="text-sm text-ink/70">They mean Google Docs, Slack, Trello — tools for working together online. You've already seen how these work.</p>
            </div>
            <div class="card border-l-4 border-l-ink/30">
              <h4 class="font-bold mb-1 text-sm">"AI literacy"</h4>
              <p class="text-sm text-ink/70">They mean you understand what AI is and can use it to help with tasks. Chapter 4 gave you that.</p>
            </div>
            <div class="card border-l-4 border-l-amber-500">
              <h4 class="font-bold mb-1 text-sm">"Self-starter"</h4>
              <p class="text-sm text-ink/70">They mean you can search for answers, figure things out, and ask for help when needed. That's you.</p>
            </div>
          </div>

          <h4 class="font-medium mb-3">See the difference:</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="comparison-bad">
              <p class="font-bold text-amber-800 mb-2 text-sm">Before this course</p>
              <p class="text-sm text-amber-900">"I don't have any digital skills. I wouldn't even know where to start with technology at work."</p>
            </div>
            <div class="comparison-good">
              <p class="font-bold text-emerald-800 mb-2 text-sm">After this course</p>
              <p class="text-sm text-emerald-900">"I'm comfortable with spreadsheets, professional email, online search, AI tools, and project management platforms. I learn new tools quickly."</p>
            </div>
          </div>
        </div>
        <!-- Section 3: Exercise 1 — Decode the Job Listing -->
        <div class="chapter-section">
          <div class="card border-2 border-accent/30 bg-amber-50/50">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-2xl">⚡</span>
              <h3 class="text-lg font-bold">Decode the job listing</h3>
            </div>
            <p class="text-ink/60 mb-4">Read this real-world job listing, then answer what the buzzwords actually mean.</p>

            <div class="card bg-white mb-6">
              <p class="font-bold mb-2">Office Administrator — GreenLeaf Community Centre</p>
              <p class="text-sm text-ink/70 leading-relaxed">We're looking for a friendly, organized team player. You should be comfortable with digital tools, able to manage your own schedule, and have strong written communication skills. Experience with spreadsheets and project management software is a plus. Familiarity with AI tools is welcome but not required.</p>
            </div>

            <div id="ch6-decode-questions"></div>
            <div id="ch6-decode-result" class="hidden mt-4"></div>
          </div>
        </div>
        <!-- Section 4: Exercise 2 — Write Your Professional Summary -->
        <div class="chapter-section">
          <div class="card border-2 border-primary/20">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-2xl">📝</span>
              <h3 class="text-lg font-bold">Write your professional summary</h3>
            </div>
            <p class="text-ink/60 mb-4">Fill in a few details and we'll help you draft a professional summary you can use on your CV or LinkedIn.</p>

            <div class="space-y-3 mb-4">
              <div>
                <label class="block text-sm font-medium mb-1">Your background</label>
                <input type="text" id="ch6-summary-background" class="w-full px-4 py-3 border border-ink/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g., 10 years in retail, returning after a career break" autocomplete="off">
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Your key strengths</label>
                <input type="text" id="ch6-summary-skills" class="w-full px-4 py-3 border border-ink/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g., customer service, organizing events, problem-solving" autocomplete="off">
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Role you're looking for</label>
                <input type="text" id="ch6-summary-role" class="w-full px-4 py-3 border border-ink/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g., office admin, customer service, data entry" autocomplete="off">
              </div>
            </div>

            <p class="text-sm font-medium mb-2">Digital skills to highlight:</p>
            <div class="space-y-2 mb-4">
              <label class="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" data-skill="Spreadsheets (Google Sheets & Excel)"> Spreadsheets (Google Sheets & Excel)</label>
              <label class="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" data-skill="Professional email & calendar"> Professional email & calendar</label>
              <label class="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" data-skill="Smart search techniques"> Smart search techniques</label>
              <label class="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" data-skill="AI prompting (R-T-C-F formula)"> AI prompting (R-T-C-F formula)</label>
              <label class="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" data-skill="Project management tools (Trello, Asana)"> Project management tools (Trello, Asana)</label>
            </div>

            <button id="ch6-summary-generate" class="bg-accent hover:bg-accent/90 text-white font-semibold px-6 py-3 rounded-lg transition-colors mb-4">
              Generate My Summary
            </button>
            <div id="ch6-summary-error" class="hidden text-sm text-red-600 mb-3"></div>
            <div id="ch6-summary-result" class="hidden"></div>
            <div id="ch6-summary-ai" class="hidden mt-4"></div>
          </div>
        </div>
        <!-- Section 5: Exercise 3 — Your Action Plan -->
        <div class="chapter-section">
          <div class="card border-2 border-success/20">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-2xl">✅</span>
              <h3 class="text-lg font-bold">Your action plan</h3>
            </div>
            <p class="text-ink/60 mb-4">Commit to at least 3 actions to keep your momentum going. Click each one you're ready to do.</p>
            <div id="ch6-action-plan" class="space-y-2 mb-4"></div>
            <p class="text-sm text-ink/50" id="ch6-action-counter">0 of 8 committed</p>
            <div id="ch6-action-encouragement" class="hidden mt-3"></div>
          </div>
        </div>

        <!-- Section 6: Quiz -->
        <div class="chapter-section">
          <h3 class="text-xl font-bold mb-2">Quick check</h3>
          <p class="text-ink/60 mb-6">Let's see what stuck. No pressure — this is just for you.</p>
          <div id="ch6-quiz"></div>
        </div>

        <!-- Section 7: Graduation -->
        <div class="chapter-section text-center pt-4">
          <div class="card inline-block px-8 py-8 graduation-card">
            <span class="text-5xl block mb-4">🚀</span>
            <h3 class="text-3xl font-bold mb-4">You did it.</h3>
            <p class="text-ink/60 mb-6 max-w-md mx-auto leading-relaxed">
              Six chapters ago, you might have felt unsure about technology. Now you can build spreadsheets,
              write professional emails, search like a pro, prompt AI, manage projects, and decode job listings.
              Those are real, valuable skills.
            </p>
            <div class="flex flex-wrap justify-center gap-2 mb-6">
              <span class="skill-badge">Spreadsheets</span>
              <span class="skill-badge">Email</span>
              <span class="skill-badge">Search</span>
              <span class="skill-badge">AI Prompting</span>
              <span class="skill-badge">Project Management</span>
              <span class="skill-badge">Job Market Ready</span>
            </div>
            <p class="text-ink/60 mb-6 text-sm max-w-md mx-auto">
              The job market can feel overwhelming, but you're not starting from zero anymore.
              You have the skills, the tools, and the confidence to take your next step.
              Go get it.
            </p>
            <button id="ch6-complete-btn" class="btn-complete ${isComplete ? 'completed' : ''}">
              ${isComplete ? 'Course Completed' : "I'm Ready 🚀"}
            </button>
            <div id="ch6-celebration" class="${isComplete ? '' : 'hidden'} mt-6 fade-in">
              <p class="text-lg font-bold text-success mb-2">🎉 Congratulations!</p>
              <p class="text-sm text-ink/60">You've completed the entire Launchpad course. We're proud of you.</p>
            </div>
          </div>
        </div>
      </div>
    `;
    // Progress tracking
    let sectionsDone = { intro: true, decodeListing: false, summaryBuilder: false, actionPlan: false, quiz: false };

    function updateProgress() {
      if (isComplete) return;
      const done = Object.values(sectionsDone).filter(Boolean).length;
      const pct = Math.round((done / 5) * 100);
      const bar = container.querySelector('#ch6-progress');
      if (bar) bar.style.width = pct + '%';
    }

    // Wire up interactives
    setupDecodeListing(container);
    setupSummaryBuilder(container);
    setupActionPlan(container);
    buildQuiz(container);

    // Mark complete button
    const completeBtn = container.querySelector('#ch6-complete-btn');
    if (!isComplete) {
      completeBtn.addEventListener('click', () => {
        app.setChapterStatus(6, 'complete');
        completeBtn.classList.add('completed');
        completeBtn.textContent = 'Congratulations!';
        completeBtn.disabled = true;

        const bar = container.querySelector('#ch6-progress');
        if (bar) bar.style.width = '100%';

        const celebration = container.querySelector('#ch6-celebration');
        celebration.classList.remove('hidden');
      });
    } else {
      completeBtn.disabled = true;
    }
    // === Decode the Job Listing Exercise ===
    function setupDecodeListing(container) {
      const questions = [
        {
          q: 'In this listing, "comfortable with digital tools" means:',
          options: [
            'You need a computer science degree',
            'You can learn and use apps like email, spreadsheets, and online tools without panicking',
            'You need to know how to write code',
            'You must own the latest smartphone',
          ],
          correct: 1,
        },
        {
          q: '"Strong written communication" means:',
          options: [
            'You can write a novel',
            'You write clear, professional emails and messages',
            'You have perfect spelling at all times',
            'You have published articles online',
          ],
          correct: 1,
        },
        {
          q: '"Experience with project management software is a plus" means:',
          options: [
            'You must be an expert in every PM tool',
            'You have used or can learn tools like Trello, Asana, or Monday.com',
            'You need to manage 20+ people',
            'This requirement is only for senior managers',
          ],
          correct: 1,
        },
        {
          q: '"Familiarity with AI tools is welcome" means:',
          options: [
            'You need to build your own AI',
            'You must use AI for every task',
            'Knowing what AI tools are and being able to use them for basic tasks is enough',
            'AI experience is absolutely required',
          ],
          correct: 2,
        },
      ];

      const questionsContainer = container.querySelector('#ch6-decode-questions');
      let answeredCount = 0;

      questions.forEach((q, qi) => {
        const qDiv = document.createElement('div');
        qDiv.className = 'mb-6';
        qDiv.innerHTML = `
          <p class="font-medium mb-3 text-sm">${qi + 1}. ${q.q}</p>
          <div class="space-y-2" data-decode-q="${qi}">
            ${q.options.map((opt, oi) => `
              <button class="quiz-option" data-decode-q="${qi}" data-decode-opt="${oi}">
                ${String.fromCharCode(97 + oi)}) ${opt}
              </button>
            `).join('')}
          </div>
          <div data-decode-feedback="${qi}" class="mt-2"></div>
        `;
        questionsContainer.appendChild(qDiv);
      });

      questionsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.quiz-option');
        if (!btn || btn.disabled) return;

        const qi = parseInt(btn.dataset.decodeQ);
        const oi = parseInt(btn.dataset.decodeOpt);
        if (isNaN(qi) || isNaN(oi)) return;
        const q = questions[qi];

        const siblings = questionsContainer.querySelectorAll(`[data-decode-q="${qi}"].quiz-option`);
        siblings.forEach(s => {
          s.disabled = true;
          if (parseInt(s.dataset.decodeOpt) === q.correct) {
            s.classList.add('correct');
          }
        });

        if (oi !== q.correct) {
          btn.classList.add('incorrect');
        }

        const feedbackSlot = questionsContainer.querySelector(`[data-decode-feedback="${qi}"]`);
        feedbackSlot.innerHTML = `
          <div class="quiz-feedback ${oi === q.correct ? 'correct' : 'incorrect'} fade-in">
            ${oi === q.correct ? '🎉 Exactly right!' : '💡 Not quite — the correct answer is highlighted above.'}
          </div>
        `;

        answeredCount++;
        if (answeredCount === questions.length) {
          sectionsDone.decodeListing = true;
          updateProgress();

          const result = container.querySelector('#ch6-decode-result');
          result.innerHTML = `
            <div class="quiz-feedback correct fade-in">
              🎉 You can now read job listings like a pro. Most of these "requirements" are things you already know!
            </div>
          `;
          result.classList.remove('hidden');
        }
      });
    }
    // === Summary Builder ===
    function setupSummaryBuilder(container) {
      const bgInput = container.querySelector('#ch6-summary-background');
      const skillsInput = container.querySelector('#ch6-summary-skills');
      const roleInput = container.querySelector('#ch6-summary-role');
      const generateBtn = container.querySelector('#ch6-summary-generate');
      const errorDiv = container.querySelector('#ch6-summary-error');
      const resultDiv = container.querySelector('#ch6-summary-result');
      const aiDiv = container.querySelector('#ch6-summary-ai');

      generateBtn.addEventListener('click', () => {
        const bg = bgInput.value.trim();
        const skills = skillsInput.value.trim();
        const role = roleInput.value.trim();

        if (!bg && !skills) {
          errorDiv.textContent = 'Please fill in at least your background or key strengths.';
          errorDiv.classList.remove('hidden');
          return;
        }

        errorDiv.classList.add('hidden');

        // Gather checked digital skills
        const checkedSkills = [];
        container.querySelectorAll('[data-skill]').forEach(cb => {
          if (cb.checked) checkedSkills.push(cb.dataset.skill);
        });

        const digitalPart = checkedSkills.length > 0
          ? checkedSkills.join(', ')
          : 'digital tools and online collaboration';

        const bgPart = bg || 'Experienced';
        const skillsPart = skills || 'communication, organization, and problem-solving';
        const rolePart = role || 'a role';

        const summary = `${escapeHtml(bgPart)} professional with experience in ${escapeHtml(skillsPart)}. Recently completed digital skills training including ${escapeHtml(digitalPart)}. Seeking ${escapeHtml(rolePart)} opportunities where I can apply my strengths and continue growing in a digital workplace.`;

        resultDiv.innerHTML = `
          <div class="demo-response fade-in">
            <p class="font-medium text-sm mb-2">Your professional summary:</p>
            <p class="text-sm leading-relaxed">${summary}</p>
          </div>
        `;
        resultDiv.classList.remove('hidden');

        // Call AI for supplementary encouragement
        if (window.LaunchpadAPI && window.LaunchpadAPI.sendMessage) {
          window.LaunchpadAPI.sendMessage('Help me with my resume and career').then(response => {
            if (response) {
              aiDiv.innerHTML = `
                <div class="demo-response fade-in">
                  <p class="font-medium text-sm mb-2">💡 Additional tips from AI:</p>
                  <p class="text-sm leading-relaxed">${response}</p>
                </div>
              `;
              aiDiv.classList.remove('hidden');
            }
          }).catch(() => {});
        }

        if (!sectionsDone.summaryBuilder) {
          sectionsDone.summaryBuilder = true;
          updateProgress();
        }
      });
    }
    // === Action Plan ===
    function setupActionPlan(container) {
      const items = [
        'Update my CV/resume with my new digital skills',
        'Create a free Google account (for Sheets, Docs, Gmail)',
        'Set up or update my LinkedIn profile',
        'Try asking AI to help me write a cover letter',
        'Create a job search board using Trello or a spreadsheet',
        'Practice the R-T-C-F prompt formula from Chapter 4',
        'Apply to at least one job this week',
        'Tell someone what I learned in this course',
      ];

      const planContainer = container.querySelector('#ch6-action-plan');
      const counterEl = container.querySelector('#ch6-action-counter');
      const encouragementEl = container.querySelector('#ch6-action-encouragement');
      const checked = new Set();

      items.forEach((text, idx) => {
        const div = document.createElement('div');
        div.className = 'flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-surface transition-colors';
        div.dataset.actionIdx = idx;
        div.innerHTML = `
          <div class="w-6 h-6 rounded-full border-2 border-ink/30 flex items-center justify-center flex-shrink-0" data-action-check="${idx}"></div>
          <span class="text-sm">${text}</span>
        `;
        planContainer.appendChild(div);
      });

      planContainer.addEventListener('click', (e) => {
        const row = e.target.closest('[data-action-idx]');
        if (!row) return;
        const idx = parseInt(row.dataset.actionIdx);
        const circle = row.querySelector(`[data-action-check="${idx}"]`);

        if (checked.has(idx)) {
          checked.delete(idx);
          circle.style.backgroundColor = '';
          circle.style.borderColor = '';
          circle.innerHTML = '';
        } else {
          checked.add(idx);
          circle.style.backgroundColor = 'var(--color-success, #16a34a)';
          circle.style.borderColor = 'var(--color-success, #16a34a)';
          circle.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        }

        counterEl.textContent = `${checked.size} of 8 committed`;

        if (checked.size >= 3 && !sectionsDone.actionPlan) {
          sectionsDone.actionPlan = true;
          updateProgress();
          encouragementEl.innerHTML = `
            <div class="quiz-feedback correct fade-in">
              🎉 That's the spirit! You've committed to real next steps. Keep this list somewhere you'll see it.
            </div>
          `;
          encouragementEl.classList.remove('hidden');
        }
      });
    }
    // === End Quiz ===
    function buildQuiz(container) {
      const quizData = [
        {
          q: 'What\'s the best way to describe your digital skills on a CV?',
          options: [
            '"I took a computer course once"',
            '"Proficient in spreadsheets, professional email, project management tools, and AI-assisted writing"',
            '"I know how to use a computer"',
            '"I\'m still learning technology"',
          ],
          correct: 1,
          explanations: [
            "That's too vague. Employers want to see specific skills, not just that you attended a course.",
            "Exactly! Be specific about the tools and skills you know. This tells employers exactly what you bring.",
            "Too general. Everyone uses computers. List the specific tools and skills you've learned.",
            "While honesty is good, this undersells you. Focus on what you CAN do, not what you're still learning.",
          ],
        },
        {
          q: 'Which is the best AI prompt for a cover letter (using R-T-C-F)?',
          options: [
            '"Write me a cover letter"',
            '"You are a career coach. Write a cover letter for an office admin role at a community centre. I have 5 years of customer service experience and recently completed digital skills training. Keep it to one page, warm but professional."',
            '"Cover letter please"',
            '"Make it good"',
          ],
          correct: 1,
          explanations: [
            "Too vague. Without context about the role, your experience, or the tone, AI can't write anything useful.",
            "That's the R-T-C-F formula in action! Role (career coach), Task (cover letter), Context (your experience), Format (one page, warm but professional).",
            "Way too short. AI needs details — the role, your background, and the style you want.",
            "This gives AI nothing to work with. The more specific your prompt, the better the result.",
          ],
        },
        {
          q: 'What\'s the most important takeaway from all six chapters?',
          options: [
            'Technology is too complicated for most people',
            'You need to master every tool before applying for jobs',
            'Digital skills are learnable, and you already have more than you think',
            'AI will do all your work for you',
          ],
          correct: 2,
          explanations: [
            "Not true at all! You've just proved that technology is learnable. You've been using it throughout this course.",
            "You don't need to master everything. Employers want people who can learn and adapt, not experts in every tool.",
            "That's the big message. You've learned real skills, and you had more ability than you realized from the start. Keep building on that foundation.",
            "AI is a powerful helper, but it works best when YOU guide it with good prompts and critical thinking.",
          ],
        },
      ];

      const quizContainer = container.querySelector('#ch6-quiz');

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
