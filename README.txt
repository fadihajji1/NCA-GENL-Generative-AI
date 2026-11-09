NCA-GENL EXAM SIMULATOR — DESIGN REFRESH (v9)
=======================================

Files
-----
index.html                 Main application page
css/styles.css             Design system (Tailwind-palette tokens, light + dark)
DESIGN.md                  Design spec: colors, type scale, components, tailwind.config.js
js/app.js                  Simulator functionality and theme persistence
js/question-bank.js        Static question data and bank metadata

Run
---
Extract the project folder and open index.html in a modern browser.
Keep the folder structure intact. No build step or installation is required.

Design update
-------------
- Applied the supplied DESIGN.md visual direction: neutral palette, Inter
  typography, restrained borders, and consistent rounded components.
- Set the light theme as the default and retained a persistent dark theme toggle.
- Added NVIDIA branding to the application header. The NVIDIA mark is loaded
  from Simple Icons CDN, so an internet connection is needed to display it.
- Updated setup, exam, question navigation, answer options, results, review,
  history, and floating controls to use the refreshed design tokens.

Functionality
-------------
The existing question bank and simulator behavior have been preserved.

v9 UI update
------------
- Colors: Tailwind palette tokens; dark text on NVIDIA green (white failed WCAG at 2.4:1).
- Type: Inter + JetBrains Mono loaded from Google Fonts; minimum text size raised from 10px to 12-13px.
- New: blurred background blobs + dot grid, glass panels, switch toggles, score ring,
  option correct/wrong states with icons, button sheen/glow/press effects, keyboard hints.
- Fixes: misleading legend, answered dots no longer look "correct", "Study tip: undefined".
- Fonts and the NVIDIA logo need an internet connection; the UI falls back gracefully offline.
