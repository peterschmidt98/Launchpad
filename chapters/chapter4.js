/**
 * Chapter 4: "Talking to AI" — Prompting 101
 */
window.Chapter4 = {
  render(container, app) {
    const progress = app.getProgress();
    const isComplete = progress[4] === 'complete';

    container.innerHTML = `
      <div class="fade-in">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-3xl">💬</span>
            <div>
              <h2 class="text-3xl font-bold text-ink">Talking to AI</h2>
              <p class="text-ink/60 text-sm">The simple formula for getting great answers, every time</p>
            </div>
          </div>
          <div class="flex items-center gap-3 mt-4 text-sm text-ink/50">
            <span>~15 min</span>
            <span>•</span>
            <span>Chapter 4 of 6</span>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="progress-bar mb-10">
          <div class="progress-fill" id="ch4-progress" style="width: ${isComplete ? '100' : '20'}%"></div>
        </div>

        <!-- Section 1: Intro -->
        <div class="chapter-section">
          <p class="text-lg leading-relaxed mb-4">
            Talking to AI is like texting a very patient, very knowledgeable colleague. You don't need special skills — you already ask questions every day.
          </p>
          <p class="leading-relaxed">
            The difference is that small changes in <strong>how</strong> you ask make a big difference in <strong>what</strong> you get back.
            This chapter will give you a simple formula that works every time. No wrong answers — AI won't judge you.
          </p>
        </div>

        <!-- Section 2: The Prompt Formula -->
        <div class="chapter-section">
          <h3 class="text-xl font-bold mb-4">The prompt formula: R-T-C-F</h3>
          <p class="leading-relaxed mb-6">Four simple parts make any prompt great. You don't always need all four — but the more you include, the better the answer.</p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div class="card border-l-4 border-l-primary">
              <p class="text-sm font-bold text-primary mb-1">R — Role</p>
              <p class="text-sm text-ink/70 mb-2">Tell it who to be</p>
              <p class="text-xs text-ink/50 italic">"You are a friendly career coach"</p>
            </div>
            <div class="card border-l-4 border-l-accent">
              <p class="text-sm font-bold text-accent mb-1">T — Task</p>
              <p class="text-sm text-ink/70 mb-2">Say what you want</p>
              <p class="text-xs text-ink/50 italic">"Write a short email"</p>
            </div>
            <div class="card border-l-4 border-l-success">
              <p class="text-sm font-bold text-success mb-1">C — Context</p>
              <p class="text-sm text-ink/70 mb-2">Give background</p>
              <p class="text-xs text-ink/50 italic">"I'm returning to work after 5 years"</p>
            </div>
            <div class="card border-l-4 border-l-ink/30">
              <p class="text-sm font-bold text-ink/70 mb-1">F — Format</p>
              <p class="text-sm text-ink/70 mb-2">Describe the output</p>
              <p class="text-xs text-ink/50 italic">"Keep it under 100 words, warm tone"</p>
            </div>
          </div>

          <h4 class="font-medium mb-3">See the difference:</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="comparison-bad">
              <p class="font-bold text-amber-800 mb-2 text-sm">Vague prompt</p>
              <p class="text-sm text-amber-900">"Help me with an email"</p>
            </div>
            <div class="comparison-good">
              <p class="font-bold text-emerald-800 mb-2 text-sm">Strong prompt (using R-T-C-F)</p>
              <p class="text-sm text-emerald-900">"You are a helpful writing assistant. Write a short email to a hiring manager introducing myself. I'm returning to work after raising my kids and I'm excited about an office admin role. Keep it friendly and under 100 words."</p>
            </div>
          </div>
        </div>

        <!-- Section 3: Prompt Makeover Exercise -->
        <div class="chapter-section">
          <h3 class="text-xl font-bold mb-2">Fix the prompt</h3>
          <p class="text-ink/60 mb-4">Each of these prompts is too vague. Pick the best improved version.</p>
          <div id="ch4-makeover-questions"></div>
        </div>

        <!-- Section 4: Live Prompt Lab -->
        <div class="chapter-section">
          <div class="card border-2 border-accent/30 bg-amber-50/50">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-2xl">⚡</span>
              <h3 class="text-xl font-bold">Try it yourself — talk to AI</h3>
            </div>
            <p class="text-ink/60 mb-4">Use the formula you just learned. Pick a scenario or write your own prompt.</p>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
              <button class="card py-3 px-4 text-left text-sm hover:border-primary hover:border-2 transition-all cursor-pointer" data-scenario="How do I write a good prompt to use AI effectively?">
                <span class="block font-medium">Ask about prompting</span>
                <span class="text-ink/50 text-xs">How to use AI well</span>
              </button>
              <button class="card py-3 px-4 text-left text-sm hover:border-primary hover:border-2 transition-all cursor-pointer" data-scenario="What are the most important tips for writing a professional email?">
                <span class="block font-medium">Email tips</span>
                <span class="text-ink/50 text-xs">Professional communication</span>
              </button>
              <button class="card py-3 px-4 text-left text-sm hover:border-primary hover:border-2 transition-all cursor-pointer" data-scenario="What skills do employers look for when hiring for entry-level jobs?">
                <span class="block font-medium">Career skills</span>
                <span class="text-ink/50 text-xs">What employers want</span>
              </button>
            </div>

            <textarea
              id="ch4-demo-input"
              class="demo-textarea mb-3"
              placeholder="Write your prompt here... (or click a scenario above to get started)"
              rows="3"
            ></textarea>
            <div class="flex items-center gap-3 mb-4">
              <button id="ch4-demo-send" class="bg-accent hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center gap-2">
                Send <span>→</span>
              </button>
              <span class="text-xs text-ink/40">Simulated AI demo</span>
            </div>
            <div id="ch4-demo-response" class="hidden"></div>
            <div id="ch4-demo-error" class="hidden"></div>
          </div>
        </div>

        <!-- Section 5: Prompt Builder -->
        <div class="chapter-section">
          <h3 class="text-xl font-bold mb-2">Build a prompt from scratch</h3>
          <p class="text-ink/60 mb-4">Fill in the parts of the formula. You don't need all four — even two or three makes a big difference.</p>

          <div class="space-y-3 mb-4">
            <div>
              <label class="block text-sm font-medium mb-1"><span class="text-primary font-bold">R</span> — Role</label>
              <input type="text" id="ch4-builder-role" class="w-full px-4 py-3 border border-ink/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g., You are a helpful career coach" autocomplete="off">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1"><span class="text-accent font-bold">T</span> — Task</label>
              <input type="text" id="ch4-builder-task" class="w-full px-4 py-3 border border-ink/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g., Help me write an introduction email" autocomplete="off">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1"><span class="text-success font-bold">C</span> — Context</label>
              <input type="text" id="ch4-builder-context" class="w-full px-4 py-3 border border-ink/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g., I'm starting a new office admin job on Monday" autocomplete="off">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1"><span class="text-ink/50 font-bold">F</span> — Format</label>
              <input type="text" id="ch4-builder-format" class="w-full px-4 py-3 border border-ink/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g., Keep it under 100 words, friendly tone" autocomplete="off">
            </div>
          </div>

          <button id="ch4-builder-build" class="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-lg transition-colors mb-4">
            Build My Prompt
          </button>

          <div id="ch4-builder-result" class="hidden">
            <div class="demo-response mb-3">
              <p class="text-xs text-ink/40 mb-2 font-medium">Your assembled prompt:</p>
              <div id="ch4-builder-prompt" class="leading-relaxed font-medium"></div>
            </div>
            <button id="ch4-builder-send" class="bg-accent hover:bg-amber-500 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm flex items-center gap-2">
              Send to AI <span>→</span>
            </button>
          </div>
          <div id="ch4-builder-response" class="hidden mt-3"></div>
        </div>

        <!-- Section 6: Quiz -->
        <div class="chapter-section">
          <h3 class="text-xl font-bold mb-2">Quick check</h3>
          <p class="text-ink/60 mb-6">Let's see what stuck. No pressure — this is just for you.</p>
          <div id="ch4-quiz"></div>
        </div>

        <!-- Section 7: Mark Complete -->
        <div class="chapter-section text-center pt-4">
          <div class="card inline-block px-8 py-6">
            <p class="text-ink/60 mb-4" id="ch4-complete-msg">${isComplete ? "You've completed this chapter!" : "Ready to move on? You now know how to talk to AI."}</p>
            <button id="ch4-complete-btn" class="btn-complete ${isComplete ? 'completed' : ''}">
              ${isComplete ? '✓ Completed' : 'Mark as Complete →'}
            </button>
          </div>
        </div>
      </div>
    `;

    // Progress tracking
    let sectionsDone = { intro: true, promptMakeover: false, liveDemo: false, promptBuilder: false, quiz: false };

    function updateProgress() {
      if (isComplete) return;
      const done = Object.values(sectionsDone).filter(Boolean).length;
      const pct = Math.round((done / 5) * 100);
      const bar = container.querySelector('#ch4-progress');
      if (bar) bar.style.width = pct + '%';
    }

    // Wire up interactives
    setupPromptMakeover(container);
    setupLiveDemo(container);
    setupPromptBuilder(container);
    buildQuiz(container);

    // Mark complete button
    const completeBtn = container.querySelector('#ch4-complete-btn');
    if (!isComplete) {
      completeBtn.addEventListener('click', () => {
        app.setChapterStatus(4, 'complete');
        completeBtn.classList.add('completed');
        completeBtn.textContent = '✓ Completed';
        completeBtn.disabled = true;

        const bar = container.querySelector('#ch4-progress');
        if (bar) bar.style.width = '100%';

        const msg = container.querySelector('#ch4-complete-msg');
        msg.textContent = "Excellent! You now know how to talk to AI like a pro. On to Chapter 5.";

        setTimeout(() => {
          app.navigateToChapter(5);
        }, 1200);
      });
    } else {
      completeBtn.disabled = true;
    }

    // === Prompt Makeover Exercise ===
    function setupPromptMakeover(container) {
      const makeoverData = [
        {
          vague: 'Write me an email',
          options: [
            'Write me a really long email about stuff',
            'Write a professional email to my new manager introducing myself on my first day. Keep it brief and friendly.',
            'Email. Professional. Now.',
          ],
          correct: 1,
          explanations: [
            "Still too vague — 'stuff' doesn't give AI anything to work with. Be specific about what the email is for.",
            "You gave it a clear task (introduction email), context (new manager, first day), and format (brief and friendly). That's the formula in action!",
            "Too terse — AI needs enough context to write something useful. A few more details make all the difference.",
          ],
        },
        {
          vague: 'Help with Excel',
          options: [
            'Explain how to use the SUM formula in Excel to add up a column of monthly expenses. I\'m a beginner.',
            'Tell me everything about spreadsheets from beginning to end',
            'Excel help please',
          ],
          correct: 0,
          explanations: [
            "Specific task (SUM formula), context (monthly expenses), and a note about your level (beginner). AI can now give you exactly what you need.",
            "Way too broad — you'd get an overwhelming wall of text. Focus on one specific thing you want to learn.",
            "Barely better than the original. What kind of help? With what? Adding a few details transforms the answer.",
          ],
        },
        {
          vague: 'I need a job',
          options: [
            'Find me a job immediately, I need money',
            'Jobs',
            'I\'m returning to work after a career break. I have experience in customer service. Can you suggest 3 entry-level roles that value communication skills and are flexible for parents?',
          ],
          correct: 2,
          explanations: [
            "AI can't actually find you a job, and the urgency doesn't help it give better suggestions. Context about your skills works better.",
            "A single word gives AI nothing to work with. It needs to know your background, what you're looking for, and any constraints.",
            "You gave context (career break, customer service), a specific ask (3 roles), and constraints (communication-focused, flexible). Now AI can give targeted suggestions.",
          ],
        },
      ];

      const questionsContainer = container.querySelector('#ch4-makeover-questions');
      let answeredCount = 0;

      makeoverData.forEach((q, qi) => {
        const qDiv = document.createElement('div');
        qDiv.className = 'mb-6 card';
        qDiv.innerHTML = `
          <p class="text-sm text-ink/60 mb-1">Vague prompt:</p>
          <p class="font-medium mb-3">"${q.vague}"</p>
          <p class="text-sm text-ink/60 mb-2">Which improvement is best?</p>
          <div class="space-y-2" data-makeover-q="${qi}">
            ${q.options.map((opt, oi) => `
              <button class="quiz-option" data-makeover-q="${qi}" data-makeover-opt="${oi}">
                ${opt}
              </button>
            `).join('')}
          </div>
          <div data-makeover-feedback="${qi}"></div>
        `;
        questionsContainer.appendChild(qDiv);
      });

      questionsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.quiz-option');
        if (!btn || btn.disabled) return;

        const qi = parseInt(btn.dataset.makeoverQ);
        const oi = parseInt(btn.dataset.makeoverOpt);
        if (isNaN(qi) || isNaN(oi)) return;
        const q = makeoverData[qi];

        const siblings = questionsContainer.querySelectorAll(`[data-makeover-q="${qi}"].quiz-option`);
        siblings.forEach(s => {
          s.disabled = true;
          if (parseInt(s.dataset.makeoverOpt) === q.correct) {
            s.classList.add('correct');
          }
        });

        if (oi !== q.correct) {
          btn.classList.add('incorrect');
        }

        const feedbackSlot = questionsContainer.querySelector(`[data-makeover-feedback="${qi}"]`);
        feedbackSlot.innerHTML = `
          <div class="quiz-feedback ${oi === q.correct ? 'correct' : 'incorrect'} fade-in mt-2">
            ${oi === q.correct ? '🎉' : '💡'} ${q.explanations[oi]}
          </div>
        `;

        answeredCount++;
        if (answeredCount === makeoverData.length) {
          sectionsDone.promptMakeover = true;
          updateProgress();
        }
      });
    }

    // === Live Prompt Lab ===
    function setupLiveDemo(container) {
      const textarea = container.querySelector('#ch4-demo-input');
      const sendBtn = container.querySelector('#ch4-demo-send');
      const responseDiv = container.querySelector('#ch4-demo-response');
      const errorDiv = container.querySelector('#ch4-demo-error');

      // Scenario card pre-fill
      container.querySelectorAll('[data-scenario]').forEach(card => {
        card.addEventListener('click', () => {
          textarea.value = card.dataset.scenario;
          textarea.focus();
        });
      });

      async function handleSend() {
        const message = textarea.value.trim();
        if (!message) return;

        sendBtn.disabled = true;
        sendBtn.innerHTML = '<span class="loading-dots"><span></span><span></span><span></span></span> Thinking...';
        responseDiv.classList.add('hidden');
        errorDiv.classList.add('hidden');

        try {
          const reply = await window.LaunchpadAPI.sendMessage(message);
          responseDiv.innerHTML = `
            <div class="demo-response fade-in">
              <p class="text-xs text-ink/40 mb-2 font-medium">AI says:</p>
              <div class="leading-relaxed">${escapeHtml(reply).replace(/\n/g, '<br>')}</div>
            </div>
          `;
          responseDiv.classList.remove('hidden');

          if (!sectionsDone.liveDemo) {
            sectionsDone.liveDemo = true;
            updateProgress();
          }
        } catch (err) {
          errorDiv.innerHTML = `
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700 fade-in">
              ${escapeHtml(err.message)}
            </div>
          `;
          errorDiv.classList.remove('hidden');
        } finally {
          sendBtn.disabled = false;
          sendBtn.innerHTML = 'Send <span>→</span>';
        }
      }

      sendBtn.addEventListener('click', handleSend);
      textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend();
        }
      });
    }

    // === Prompt Builder ===
    function setupPromptBuilder(container) {
      const roleInput = container.querySelector('#ch4-builder-role');
      const taskInput = container.querySelector('#ch4-builder-task');
      const contextInput = container.querySelector('#ch4-builder-context');
      const formatInput = container.querySelector('#ch4-builder-format');
      const buildBtn = container.querySelector('#ch4-builder-build');
      const resultDiv = container.querySelector('#ch4-builder-result');
      const promptDiv = container.querySelector('#ch4-builder-prompt');
      const sendBtn = container.querySelector('#ch4-builder-send');
      const responseDiv = container.querySelector('#ch4-builder-response');

      let assembledPrompt = '';

      buildBtn.addEventListener('click', () => {
        const parts = [
          roleInput.value.trim(),
          taskInput.value.trim(),
          contextInput.value.trim(),
          formatInput.value.trim(),
        ];

        const filled = parts.filter(p => p.length > 0);
        if (filled.length < 2) {
          resultDiv.classList.add('hidden');
          return;
        }

        assembledPrompt = filled.join('. ') + '.';
        promptDiv.textContent = assembledPrompt;
        resultDiv.classList.remove('hidden');
        resultDiv.classList.add('fade-in');

        if (!sectionsDone.promptBuilder) {
          sectionsDone.promptBuilder = true;
          updateProgress();
        }
      });

      sendBtn.addEventListener('click', async () => {
        if (!assembledPrompt) return;

        sendBtn.disabled = true;
        sendBtn.innerHTML = '<span class="loading-dots"><span></span><span></span><span></span></span> Thinking...';

        try {
          const reply = await window.LaunchpadAPI.sendMessage(assembledPrompt);
          responseDiv.innerHTML = `
            <div class="demo-response fade-in">
              <p class="text-xs text-ink/40 mb-2 font-medium">AI says:</p>
              <div class="leading-relaxed">${escapeHtml(reply).replace(/\n/g, '<br>')}</div>
            </div>
          `;
          responseDiv.classList.remove('hidden');
        } catch (err) {
          responseDiv.innerHTML = `
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700 fade-in">
              ${escapeHtml(err.message)}
            </div>
          `;
          responseDiv.classList.remove('hidden');
        } finally {
          sendBtn.disabled = false;
          sendBtn.innerHTML = 'Send to AI <span>→</span>';
        }
      });
    }

    // === End Quiz ===
    function buildQuiz(container) {
      const quizData = [
        {
          q: 'Which of these is the BEST prompt to ask AI for help?',
          options: [
            '"Help"',
            '"Write a 3-paragraph cover letter for a retail assistant position. I have 5 years of customer service experience."',
            '"Tell me everything you know about everything"',
            '"Can you do stuff?"',
          ],
          correct: 1,
          explanations: [
            "Way too vague. AI needs to know what you want help with, and some context to work with.",
            "That's a strong prompt. It has a clear task (cover letter), context (retail, customer service), and format (3 paragraphs). The formula works!",
            "AI works best with focused requests. Asking for 'everything' means you'll get a vague, unfocused answer.",
            "AI needs specifics. 'Stuff' could mean anything. The more specific you are, the better the answer.",
          ],
        },
        {
          q: 'What does the "Context" part of a prompt do?',
          options: [
            'Makes the AI respond faster',
            'Tells AI how long the answer should be',
            'Gives AI background information so it can tailor the answer',
            'Changes the language AI uses',
          ],
          correct: 2,
          explanations: [
            "Context doesn't affect speed. It gives AI background information so it can tailor the answer to your situation.",
            "That's more about Format. Context is the background information — who you are, what the situation is.",
            "Exactly! Context is the 'why' behind your request. The more relevant background you give, the more useful the answer.",
            "Not quite. Context is about your situation and background, not language settings.",
          ],
        },
        {
          q: 'You want AI to help you prepare for a job interview. Which prompt follows the R-T-C-F formula best?',
          options: [
            '"Job interview help"',
            '"You are an interview coach. Give me 5 common questions for an office admin role, with example answers. I haven\'t interviewed in 3 years, so keep the advice simple and encouraging."',
            '"Tell me how to get a job"',
            '"Please help me I\'m nervous about my interview tomorrow"',
          ],
          correct: 1,
          explanations: [
            "That's just a topic, not a prompt. Add a role, specific task, context about the job, and what format you want.",
            "All four parts: Role (interview coach), Task (5 questions with answers), Context (office admin, 3-year gap), Format (simple, encouraging). Perfect!",
            "Too broad. Are you asking about resumes, interviews, networking? Being specific about which part helps AI focus.",
            "AI would try to help, but it doesn't know what job, what kind of interview, or what you need. Adding those details gets much better advice.",
          ],
        },
      ];

      const quizContainer = container.querySelector('#ch4-quiz');

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
