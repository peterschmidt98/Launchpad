# Launchpad 🚀

**Help people returning to the workforce get up to speed on AI and digital skills — from zero to job-ready.**

A single-page interactive learning web app. No login, no download, works in any browser.

## What It Teaches

| Chapter | Title | Topics |
|---------|-------|--------|
| 1 | Where Are We? | What changed in 5 years, self-assessment |
| 2 | What is AI? | AI explained simply, live AI demo, quiz |
| 3 | Your Core Toolkit | Spreadsheets, email, smarter searching |
| 4 | Talking to AI | The R-T-C-F prompt formula, live exercises |
| 5 | Getting Things Done | Trello, Notion, Asana, Monday.com, kanban boards |
| 6 | You're Ready | Decoding job listings, CV writing, action plan |

Every chapter includes interactive exercises, quizzes with instant feedback, and progress tracking.

## Try It

**Option 1 — GitHub Pages** (recommended)

Enable GitHub Pages in repo Settings → Pages → Source: `main` branch. The app will be live at:
```
https://<your-username>.github.io/Launchpad/
```

**Option 2 — Local**

Just open `index.html` in a browser. Everything works offline.

## Tech Stack

- Vanilla HTML + CSS + JavaScript (no frameworks, no build step)
- Tailwind CSS via CDN
- `localStorage` for progress tracking
- Simulated AI responses (no API key needed)

## File Structure

```
├── index.html            App shell
├── style.css             Custom styles
├── app.js                Navigation, sidebar, progress tracking
├── api.js                Simulated AI responses
├── chapters/
│   ├── chapter1.js       Where Are We?
│   ├── chapter2.js       What is AI?
│   ├── chapter3.js       Your Core Toolkit
│   ├── chapter4.js       Talking to AI
│   ├── chapter5.js       Getting Things Done
│   └── chapter6.js       You're Ready
└── test/
    ├── setup.js          Test environment (jsdom)
    ├── api.test.js       API mock tests
    ├── app.test.js       Navigation & progress tests
    ├── chapter1-6.test.js  Per-chapter tests
    ├── integration.test.js  Cross-chapter tests
    ├── security.test.js  XSS, injection, boundary tests
    └── user-sim-*.js     Full user journey simulations
```

## Tests

```bash
npm install
npm test                              # 323 unit/integration/security tests
node --test test/user-sim-*.js        # 68 user simulation tests
```

**391 total tests** covering:
- All interactive exercises and quizzes
- Progress tracking and chapter unlocking
- XSS prevention and input sanitization
- localStorage integrity and edge cases
- 3 full user journey simulations (beginner, confident, adversarial)

## Design

- **Colors:** Deep indigo `#3730A3`, warm amber `#F59E0B`, off-white `#FAFAF9`
- **Tone:** Warm, encouraging, like a smart friend explaining things
- **Mobile:** Responsive sidebar collapses to hamburger menu
- **Accessibility:** High contrast, generous whitespace, clear typography
