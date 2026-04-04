/**
 * Chapter 2: "What is AI?"
 */
window.Chapter2 = {
  render(container, app) {
    const progress = app.getProgress();
    const isComplete = progress[2] === 'complete';

    container.innerHTML = `
      <div class="fade-in">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-3xl">🧠</span>
            <div>
              <h2 class="text-3xl font-bold text-ink">What is AI?</h2>
              <p class="text-ink/60 text-sm">No jargon. No hype. Just what it actually is.</p>
            </div>
          </div>
          <div class="flex items-center gap-3 mt-4 text-sm text-ink/50">
            <span>~12 min</span>
            <span>•</span>
            <span>Chapter 2 of 6</span>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="progress-bar mb-10">
          <div class="progress-fill" id="ch2-progress" style="width: ${isComplete ? '100' : '0'}%"></div>
        </div>

        <!-- Section 1: Core Explanation -->
        <div class="chapter-section">
          <h3 class="text-xl font-bold mb-4">The short version</h3>
          <p class="leading-relaxed mb-4">
            AI is pattern recognition at massive scale. It's not intelligence like you have — it doesn't think,
            feel, or understand. It spots patterns in enormous amounts of data and uses those patterns to generate
            responses that look remarkably smart.
          </p>
          <p class="leading-relaxed mb-4">
            Modern AI (like ChatGPT and Claude) learned by reading huge amounts of text — books, websites, articles.
            So it can write, summarize, explain, and answer questions. But it doesn't "know" things the way you do.
            It's predicting what words should come next, based on patterns it learned.
          </p>
          <p class="leading-relaxed">
            Think of it as a very powerful tool — like a calculator or a search engine. It can do things that used
            to take hours in seconds. But it's still just a tool. You're the one who decides what to do with it.
          </p>
        </div>

        <!-- Section 2: Good At vs Not Good At -->
        <div class="chapter-section">
          <h3 class="text-xl font-bold mb-4">What AI is good at — and what it's not</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="comparison-good">
              <h4 class="font-bold text-emerald-800 mb-3 flex items-center gap-2">
                <span class="text-xl">✅</span> Good at
              </h4>
              <ul class="space-y-2 text-sm text-emerald-900">
                <li class="flex items-start gap-2"><span class="mt-1">•</span> Summarizing long documents</li>
                <li class="flex items-start gap-2"><span class="mt-1">•</span> Drafting emails and messages</li>
                <li class="flex items-start gap-2"><span class="mt-1">•</span> Explaining complex topics simply</li>
                <li class="flex items-start gap-2"><span class="mt-1">•</span> Brainstorming ideas</li>
                <li class="flex items-start gap-2"><span class="mt-1">•</span> Translating between languages</li>
                <li class="flex items-start gap-2"><span class="mt-1">•</span> Finding patterns in data</li>
                <li class="flex items-start gap-2"><span class="mt-1">•</span> Answering questions</li>
              </ul>
            </div>
            <div class="comparison-bad">
              <h4 class="font-bold text-amber-800 mb-3 flex items-center gap-2">
                <span class="text-xl">❌</span> Not good at
              </h4>
              <ul class="space-y-2 text-sm text-amber-900">
                <li class="flex items-start gap-2"><span class="mt-1">•</span> Facts it wasn't trained on</li>
                <li class="flex items-start gap-2"><span class="mt-1">•</span> Today's breaking news</li>
                <li class="flex items-start gap-2"><span class="mt-1">•</span> Deep logical reasoning</li>
                <li class="flex items-start gap-2"><span class="mt-1">•</span> Understanding emotions</li>
                <li class="flex items-start gap-2"><span class="mt-1">•</span> Making judgment calls</li>
                <li class="flex items-start gap-2"><span class="mt-1">•</span> Knowing your specific situation</li>
                <li class="flex items-start gap-2"><span class="mt-1">•</span> Being 100% accurate always</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Section 3: AI Tools -->
        <div class="chapter-section">
          <h3 class="text-xl font-bold mb-2">The AI tools you'll hear about</h3>
          <p class="text-ink/60 mb-6">They all do similar things. Learning one means you can use any of them.</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="card">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-2xl">💬</span>
                <h4 class="font-bold">ChatGPT</h4>
              </div>
              <p class="text-xs text-ink/50 mb-1">by OpenAI</p>
              <p class="text-sm text-ink/70">The one that started the mainstream wave. Great for writing, research, and conversation. The most widely used AI tool.</p>
            </div>
            <div class="card border-2 border-primary/20">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-2xl">🟣</span>
                <h4 class="font-bold">Claude</h4>
              </div>
              <p class="text-xs text-ink/50 mb-1">by Anthropic</p>
              <p class="text-sm text-ink/70">Known for being thoughtful and careful. Especially good at long documents and nuanced questions. (That's what powers the demo below!)</p>
            </div>
            <div class="card">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-2xl">🔷</span>
                <h4 class="font-bold">Copilot</h4>
              </div>
              <p class="text-xs text-ink/50 mb-1">by Microsoft</p>
              <p class="text-sm text-ink/70">Built right into Word, Excel, and Outlook. If your workplace uses Microsoft, you'll likely meet this one first.</p>
            </div>
            <div class="card">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-2xl">✨</span>
                <h4 class="font-bold">Gemini</h4>
              </div>
              <p class="text-xs text-ink/50 mb-1">by Google</p>
              <p class="text-sm text-ink/70">Built into Google Workspace — Gmail, Docs, Sheets. If you use Google tools, Gemini is right there waiting.</p>
            </div>
          </div>
        </div>

        <!-- Section 4: Live Demo -->
        <div class="chapter-section">
          <div class="card border-2 border-accent/30 bg-amber-50/50">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-2xl">⚡</span>
              <h3 class="text-xl font-bold">Talk to AI — right now, for the first time</h3>
            </div>
            <p class="text-ink/60 mb-4">Type anything. Ask a question. Say hello. See what happens.</p>
            <textarea
              id="demo-input"
              class="demo-textarea mb-3"
              placeholder="Try typing: 'What is AI in simple terms?' or ask anything you're curious about..."
              rows="3"
            ></textarea>
            <div class="flex items-center gap-3 mb-4">
              <button id="demo-send" class="bg-accent hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center gap-2">
                Send <span>→</span>
              </button>
              <span class="text-xs text-ink/40">Simulated AI demo</span>
            </div>
            <div id="demo-response" class="hidden">
              <!-- Response appears here -->
            </div>
            <div id="demo-error" class="hidden">
              <!-- Error appears here -->
            </div>
          </div>
        </div>

        <!-- Section 5: Quiz -->
        <div class="chapter-section">
          <h3 class="text-xl font-bold mb-2">Quick check</h3>
          <p class="text-ink/60 mb-6">Let's see what stuck. No pressure — this is just for you.</p>
          <div id="ch2-quiz"></div>
        </div>

        <!-- Section 6: Mark Complete -->
        <div class="chapter-section text-center pt-4">
          <div class="card inline-block px-8 py-6">
            <p class="text-ink/60 mb-4" id="ch2-complete-msg">${isComplete ? "You've completed this chapter!" : "Ready to move on? You've got this."}</p>
            <button id="ch2-complete-btn" class="btn-complete ${isComplete ? 'completed' : ''}">
              ${isComplete ? '✓ Completed' : 'Mark as Complete →'}
            </button>
          </div>
        </div>
      </div>
    `;

    // Wire up live demo
    setupDemo(container, app);

    // Build quiz
    buildQuiz(container);

    // Progress tracking
    let sectionsDone = { explanation: true, demo: false, quiz: false };

    function updateProgress() {
      if (isComplete) return;
      const done = Object.values(sectionsDone).filter(Boolean).length;
      const pct = Math.round((done / 3) * 100);
      const bar = container.querySelector('#ch2-progress');
      if (bar) bar.style.width = pct + '%';
    }

    // Mark complete button
    const completeBtn = container.querySelector('#ch2-complete-btn');
    if (!isComplete) {
      completeBtn.addEventListener('click', () => {
        app.setChapterStatus(2, 'complete');
        completeBtn.classList.add('completed');
        completeBtn.textContent = '✓ Completed';
        completeBtn.disabled = true;

        const bar = container.querySelector('#ch2-progress');
        if (bar) bar.style.width = '100%';

        const msg = container.querySelector('#ch2-complete-msg');
        msg.textContent = "Awesome! You just unlocked the rest of the course.";
      });
    } else {
      completeBtn.disabled = true;
    }

    // Animate initial progress
    if (!isComplete) {
      setTimeout(() => updateProgress(), 100);
    }

    function setupDemo(container) {
      const input = container.querySelector('#demo-input');
      const sendBtn = container.querySelector('#demo-send');
      const responseDiv = container.querySelector('#demo-response');
      const errorDiv = container.querySelector('#demo-error');

      async function handleSend() {
        const message = input.value.trim();
        if (!message) return;

        // Loading state
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<span class="loading-dots"><span></span><span></span><span></span></span> Thinking...';
        responseDiv.classList.add('hidden');
        errorDiv.classList.add('hidden');

        try {
          const reply = await window.LaunchpadAPI.sendMessage(message);
          responseDiv.innerHTML = `
            <div class="demo-response fade-in">
              <p class="text-xs text-ink/40 mb-2 font-medium">Claude says:</p>
              <div class="leading-relaxed">${escapeHtml(reply).replace(/\n/g, '<br>')}</div>
            </div>
          `;
          responseDiv.classList.remove('hidden');
          sectionsDone.demo = true;
          updateProgress();
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

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend();
        }
      });
    }

    function buildQuiz(container) {
      const quizData = [
        {
          q: "What did AI mainly learn from?",
          options: [
            "Robots and machines",
            "Huge amounts of text and data",
            "Human brains",
            "The internet's photos",
          ],
          correct: 1,
          explanations: [
            "Not quite — AI isn't physical. It learned from text, not machines.",
            "Exactly right! Modern AI was trained on massive amounts of text from the internet, books, and more.",
            "Not quite — AI doesn't work like a human brain. It spots patterns in text data.",
            "Close, but not quite. While some AI works with images, language AI mainly learned from text.",
          ],
        },
        {
          q: "Which of these is AI NOT good at?",
          options: [
            "Summarizing a document",
            "Drafting an email",
            "Knowing what happened yesterday",
            "Explaining a concept",
          ],
          correct: 2,
          explanations: [
            "Actually, summarizing is one of AI's strongest skills!",
            "Drafting emails is something AI does really well.",
            "Exactly right! AI doesn't have access to real-time news or events. It only knows what it was trained on.",
            "Explaining things is actually one of AI's best features.",
          ],
        },
        {
          q: "Which company makes Claude?",
          options: ["Google", "Microsoft", "OpenAI", "Anthropic"],
          correct: 3,
          explanations: [
            "Not quite — Google makes Gemini.",
            "Not quite — Microsoft makes Copilot.",
            "Close, but OpenAI makes ChatGPT.",
            "Exactly right! Anthropic makes Claude — the AI you just tried above!",
          ],
        },
      ];

      const quizContainer = container.querySelector('#ch2-quiz');
      let correctCount = 0;

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

      quizContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.quiz-option');
        if (!btn || btn.disabled) return;

        const qi = parseInt(btn.dataset.quiz);
        const oi = parseInt(btn.dataset.option);
        const q = quizData[qi];

        // Disable all options for this question
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
        } else {
          correctCount++;
        }

        // Show feedback
        const feedbackSlot = quizContainer.querySelector(`[data-quiz-feedback="${qi}"]`);
        feedbackSlot.innerHTML = `
          <div class="quiz-feedback ${isCorrect ? 'correct' : 'incorrect'} fade-in">
            ${isCorrect ? '🎉' : '💡'} ${q.explanations[oi]}
          </div>
        `;

        // Check if all answered
        const allAnswered = quizContainer.querySelectorAll('.quiz-option:disabled').length === quizData.length * 4;
        if (allAnswered) {
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
