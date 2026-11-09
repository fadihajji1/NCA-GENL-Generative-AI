NCA-GENL EXAM SIMULATOR  (v9)
=============================

A browser-based practice simulator for the NVIDIA Certified Associate -
Generative AI LLMs (NCA-GENL) exam. 241 questions across 10 study domains,
timed exam mode, instant-feedback practice mode, and a performance report.

Repository: https://github.com/fadihajji1/NCA-GENL-Generative-AI


Files
-----
index.html            Main application page
css/styles.css        Design system: Tailwind-palette color tokens, light + dark themes
js/app.js             Simulator logic, theme persistence, results and history
js/question-bank.js   Question data and bank metadata
DESIGN.md             Design spec: colors, type scale, components, tailwind.config.js
README.txt            This file


Run
---
1. Extract the project folder and keep the folder structure intact.
2. Open index.html in a modern browser (Chrome, Edge, Firefox, Safari).

No build step, server or installation is required.
An internet connection is only needed for the Inter / JetBrains Mono fonts
(Google Fonts) and the NVIDIA logo (Simple Icons CDN). Offline, the app falls
back to system fonts and shows the "NVIDIA" text without the logo mark.


Features
--------
Setup
- Time limit: 30 / 60 / 90 / 120 minutes, or no limit
- Question count: 25 / 50 / 75 / all available
- Domain filter: practice one of the 10 study domains or mix them all
- Shuffle questions and shuffle answer choices (correct answers stay mapped)

Modes
- Exam mode (strict): hints, explanations and correctness stay hidden until you
  submit; the timer auto-submits at zero; the exam can be paused.
- Practice mode: untimed, with immediate correct / incorrect feedback and
  explanations after each answer.

During a session
- Question map with status colors: current, answered, unanswered,
  marked for review, correct, incorrect
- Mark questions for review, progress bar and completion percentage
- Timer turns amber at 5 minutes left and red at 1 minute left
- Keyboard shortcuts:
    Left / Right  previous / next question
    1 - 5         select an answer option
    F             mark for review
    Enter         next question
    Ctrl + Enter  submit

Results
- Score ring (green 85%+, amber 65%+, red below), correct / incorrect /
  unanswered counts and time used
- Performance per domain and your three weakest topics
- Attempt history saved in this browser only (localStorage, last 12 attempts)
- Review all questions with filters: All / Correct / Wrong answer / Not answered
- Retry only your incorrect answers, or retake with a new random order


Interface
---------
- Light theme by default. The header has a sun - switch - moon control for dark
  mode; the choice is saved in the browser.
- GitHub icon button in the header links to the repository.
- Responsive layout for desktop, tablet and phone.
- Animations are disabled automatically for users who prefer reduced motion.


Design system (v9)
------------------
- Colors come from the Tailwind default palette (neutral, lime, emerald, rose,
  amber, teal) plus NVIDIA green #76b900. Dark text is used on green buttons
  because white on #76b900 is only 2.4:1 contrast (fails WCAG); near-black is 8.2:1.
- Typography: Inter for text, JetBrains Mono for the timer, option letters and
  keyboard keys. Body text is 16px; nothing is smaller than 12px.
- Visual style: blurred background blobs and dot-grid pattern, frosted-glass
  panels, switch toggles, button glow / sheen / press effects, option hover
  and correct / wrong states with check and cross icons.
- Full details and a drop-in tailwind.config.js are in DESIGN.md.


Changelog
---------
v9
- New design system with Tailwind-palette tokens; fixed low-contrast colors.
- Larger, more readable type; Inter and JetBrains Mono fonts.
- Added background decoration, glass panels, switches, score ring and hover effects.
- Theme toggle redesigned as a sun / switch / moon control.
- Added GitHub link in the header.
- Fixed: legend that said "Blue = current", answered questions looking "correct"
  in strict mode, and "Study tip: undefined" on questions without a tip.
v8
- Neutral NVIDIA-inspired design refresh, persistent light / dark theme,
  NVIDIA branding, expanded question bank (241 questions).

The question bank and simulator behavior are unchanged from v8.


Notes
-----
- Domain categories are study groupings assigned by keyword matching; they are
  not an official NVIDIA exam blueprint.
- Attempt history never leaves your device and is cleared if you clear the
  site data for this page.
