/**
 * Chapter 1: "Where Are We?"
 */
window.Chapter1 = {
  render(container, app) {
    const progress = app.getProgress();
    const isComplete = progress[1] === 'complete';

    container.innerHTML = `
      <div class="fade-in">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-3xl">📍</span>
            <div>
              <h2 class="text-3xl font-bold text-ink">Where Are We?</h2>
              <p class="text-ink/60 text-sm">The moment we're in — and why you're arriving at the right time</p>
            </div>
          </div>
          <div class="flex items-center gap-3 mt-4 text-sm text-ink/50">
            <span>~10 min</span>
            <span>•</span>
            <span>Chapter 1 of 6</span>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="progress-bar mb-10">
          <div class="progress-fill" id="ch1-progress" style="width: ${isComplete ? '100' : '0'}%"></div>
        </div>

        <!-- Section 1: Welcome -->
        <div class="chapter-section" id="ch1-s1">
          <p class="text-lg leading-relaxed mb-4">
            Welcome. If you're here, it means you're ready to take a step forward — and that already puts you ahead of most people.
          </p>
          <p class="leading-relaxed mb-4">
            A lot has changed in the last few years. New tools, new ways of working, new words everywhere.
            It can feel like the world moved on while you were away. But here's the truth:
            <strong>you haven't missed the boat.</strong>
          </p>
          <p class="leading-relaxed mb-4">
            The tools are new, but the fundamentals haven't changed. Communication, judgment, reliability,
            the ability to learn — these are still what employers value most. AI just changes the tools you use,
            not the skills that make you valuable.
          </p>
          <p class="leading-relaxed">
            This course is built for you. No assumptions about what you know. No jargon without explanations.
            Just a clear, friendly path from where you are to where you want to be.
          </p>
        </div>

        <!-- Section 2: What Changed Cards -->
        <div class="chapter-section" id="ch1-s2">
          <h3 class="text-xl font-bold mb-6">What changed in the last 5 years</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="card">
              <div class="text-3xl mb-3">🤖</div>
              <h4 class="font-bold text-lg mb-2">AI went mainstream</h4>
              <p class="text-sm text-ink/70 leading-relaxed">
                ChatGPT launched in late 2022 and changed everything. Suddenly, anyone could talk to an AI
                and get useful answers. It's the biggest shift in technology since the smartphone.
              </p>
            </div>
            <div class="card">
              <div class="text-3xl mb-3">🏠</div>
              <h4 class="font-bold text-lg mb-2">Remote & hybrid work became permanent</h4>
              <p class="text-sm text-ink/70 leading-relaxed">
                What started as a pandemic necessity became the new normal. Many jobs now offer flexibility
                to work from home, the office, or both. Digital collaboration tools are essential.
              </p>
            </div>
            <div class="card">
              <div class="text-3xl mb-3">💻</div>
              <h4 class="font-bold text-lg mb-2">Digital tools replaced paper processes</h4>
              <p class="text-sm text-ink/70 leading-relaxed">
                Signing documents, scheduling meetings, managing projects — almost everything moved online.
                If you can use a browser, you can learn these tools. They're designed to be easy.
              </p>
            </div>
            <div class="card">
              <div class="text-3xl mb-3">🎯</div>
              <h4 class="font-bold text-lg mb-2">Skills matter more than ever</h4>
              <p class="text-sm text-ink/70 leading-relaxed">
                Employers care less about where you learned something and more about what you can do.
                The skills in this course are exactly what they're looking for — and they're all learnable.
              </p>
            </div>
          </div>
        </div>

        <!-- Section 3: Self-Assessment -->
        <div class="chapter-section" id="ch1-s3">
          <h3 class="text-xl font-bold mb-2">A quick check-in</h3>
          <p class="text-ink/60 mb-6">No right or wrong answers — this just helps us understand where you're starting from.</p>

          <div id="assessment-questions"></div>

          <div id="assessment-result" class="hidden mt-6">
            <div class="card border-2 border-primary/20 bg-primary/5">
              <p id="assessment-message" class="text-lg leading-relaxed font-medium text-primary"></p>
            </div>
          </div>
        </div>

        <!-- Section 4: Mark Complete -->
        <div class="chapter-section text-center pt-4" id="ch1-s4">
          <div class="card inline-block px-8 py-6">
            <p class="text-ink/60 mb-4">${isComplete ? 'You\'ve completed this chapter!' : 'Finished reading? You\'re doing great.'}</p>
            <button id="ch1-complete-btn" class="btn-complete ${isComplete ? 'completed' : ''}">
              ${isComplete ? '✓ Completed' : 'Mark as Complete →'}
            </button>
          </div>
        </div>
      </div>
    `;

    // Build assessment questions
    buildAssessment(container, app);

    // Mark complete button
    const completeBtn = container.querySelector('#ch1-complete-btn');
    if (!isComplete) {
      completeBtn.addEventListener('click', () => {
        app.setChapterStatus(1, 'complete');
        completeBtn.classList.add('completed');
        completeBtn.textContent = '✓ Completed';
        completeBtn.disabled = true;
        updateProgress(100);

        // Brief celebration
        const msg = container.querySelector('#ch1-s4 p');
        msg.textContent = "Nice work! You're ready for Chapter 2.";

        setTimeout(() => {
          app.navigateToChapter(2);
        }, 1200);
      });
    } else {
      completeBtn.disabled = true;
    }

    // Animate progress on load
    if (!isComplete) {
      setTimeout(() => updateProgress(10), 100);
    }

    function updateProgress(pct) {
      const bar = container.querySelector('#ch1-progress');
      if (bar) bar.style.width = pct + '%';
    }

    function buildAssessment() {
      const questions = [
        {
          q: "How comfortable are you with email and basic computer use?",
          options: ["Not at all", "A little", "Pretty comfortable", "Very comfortable"],
          scores: [0, 1, 2, 3],
        },
        {
          q: "Have you heard of ChatGPT or AI assistants?",
          options: ["Never", "Heard of it but never tried", "Tried it once or twice", "I use it regularly"],
          scores: [0, 1, 2, 3],
        },
        {
          q: "Have you used tools like Excel, Google Sheets, or similar?",
          options: ["Never", "A long time ago", "Sometimes", "Regularly"],
          scores: [0, 1, 2, 3],
        },
        {
          q: "How do you feel about learning new digital tools?",
          options: ["Nervous", "Unsure", "Open to it", "Excited"],
          scores: [0, 1, 2, 3],
        },
      ];

      const answers = {};
      const questionsContainer = container.querySelector('#assessment-questions');

      questions.forEach((question, qi) => {
        const qDiv = document.createElement('div');
        qDiv.className = 'mb-6';
        qDiv.innerHTML = `
          <p class="font-medium mb-3">${qi + 1}. ${question.q}</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2" data-question="${qi}">
            ${question.options.map((opt, oi) => `
              <button class="assessment-option" data-question="${qi}" data-option="${oi}" data-score="${question.scores[oi]}">
                ${opt}
              </button>
            `).join('')}
          </div>
        `;
        questionsContainer.appendChild(qDiv);
      });

      // Wire up option clicks
      questionsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.assessment-option');
        if (!btn) return;

        const qi = parseInt(btn.dataset.question);
        const score = parseInt(btn.dataset.score);
        answers[qi] = score;

        // Update selected state
        const siblings = questionsContainer.querySelectorAll(`[data-question="${qi}"].assessment-option`);
        siblings.forEach(s => s.classList.remove('selected'));
        btn.classList.add('selected');

        // Update progress
        const answeredCount = Object.keys(answers).length;
        updateProgress(10 + (answeredCount / questions.length) * 60);

        // Show result if all answered
        if (answeredCount === questions.length) {
          showResult();
        }
      });

      function showResult() {
        const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
        const maxScore = questions.length * 3;
        const pct = totalScore / maxScore;

        let message;
        if (pct <= 0.33) {
          message = "You're starting from the right place — no bad habits to unlearn. Everything in this course is built for exactly where you are. One step at a time, and you'll surprise yourself.";
        } else if (pct <= 0.66) {
          message = "You have more foundation than you think. Some of this will feel familiar, some will be new — and that's a great mix. This course will build on what you already know.";
        } else {
          message = "You're here to sharpen and update — that's smart. You already have solid skills. This course will help you add AI and modern tools to your toolkit.";
        }

        const resultDiv = container.querySelector('#assessment-result');
        const messageEl = container.querySelector('#assessment-message');
        messageEl.textContent = message;
        resultDiv.classList.remove('hidden');
        resultDiv.classList.add('fade-in');

        updateProgress(80);
      }
    }
  },
};
