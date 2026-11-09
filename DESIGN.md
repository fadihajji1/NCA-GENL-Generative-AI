# NCA-GENL Exam Simulator — Design System (v9)

Neutral, NVIDIA-inspired UI. Every color below is a value from the **Tailwind default palette**
(neutral · lime · emerald · rose · amber · teal) plus the NVIDIA brand green `#76b900`, so the
CSS in `css/styles.css` and a Tailwind build produce identical colors.

> The project is a static, no-build site and part of its markup is generated from JS strings, so the
> CSS keeps Tailwind's *palette* as custom properties instead of loading the Tailwind runtime.
> A drop-in `tailwind.config.js` is included at the bottom if you later migrate.

## 1. Principles
1. **Readable first** – body 16px, nothing below 12px, secondary text ≥ 7:1 contrast.
2. **One accent** – NVIDIA green. Emerald = correct, rose = wrong, amber = marked / low time. Never reuse them for decoration.
3. **Dark text on green** – `#76b900` with white text is only 2.4:1 (fails WCAG). Use `neutral-950` on green (8.2:1).
4. **Motion is optional** – all animation is disabled under `prefers-reduced-motion`.

## 2. Color tokens

| Token | Light | Dark | Tailwind |
|---|---|---|---|
| `--bg` | `#fafafa` | `#0a0a0a` | neutral-50 / 950 |
| `--surface-solid` | `#ffffff` | `#171717` | white / neutral-900 |
| `--surface` (glass panels) | white @ 82% | neutral-900 @ 72% | + `backdrop-blur` |
| `--line` | `#e5e5e5` | `#262626` | neutral-200 / 800 |
| `--line-strong` | `#d4d4d4` | `#404040` | neutral-300 / 700 |
| `--text` | `#171717` | `#fafafa` | neutral-900 / 50 |
| `--text-2` | `#404040` | `#d4d4d4` | neutral-700 / 300 |
| `--muted` | `#525252` | `#a3a3a3` | neutral-600 / 400 |
| `--accent` (fills, focus) | `#76b900` | `#76b900` | NVIDIA green |
| `--accent-hover` | `#84cc16` | `#84cc16` | lime-500 |
| `--accent-text` (links, eyebrow) | `#4d7c0f` | `#bef264` | lime-700 / 300 |
| `--accent-soft` | `#f7fee7` | green @ 13% | lime-50 |
| `--on-accent` | `#0a0a0a` | `#0a0a0a` | neutral-950 |
| `--ok` / `--ok-text` / `--ok-soft` | `#059669` / `#047857` / `#ecfdf5` | `#34d399` / `#6ee7b7` / emerald @ 12% | emerald 600·700·50 / 400·300 |
| `--bad` / `--bad-text` / `--bad-soft` | `#e11d48` / `#be123c` / `#fff1f2` | `#fb7185` / `#fda4af` / rose @ 12% | rose 600·700·50 / 400·300 |
| `--warn` / `--warn-text` / `--warn-soft` | `#f59e0b` / `#b45309` / `#fffbeb` | `#fbbf24` / `#fcd34d` / amber @ 12% | amber 500·700·50 / 400·300 |

Measured contrast (WCAG): body text on white 17.9:1 · muted on white 7.8:1 · lime-700 on white 5.0:1 ·
neutral-950 on `#76b900` 8.2:1 · dark-mode muted on neutral-900 7.1:1 · lime-300 on neutral-900 13.7:1.

## 3. Typography
| Role | Font | Size / weight |
|---|---|---|
| UI & body | **Inter** (Google Fonts, system fallback) | 16px / 400, line-height 1.65 |
| Numbers, timer, option letters, `kbd` | **JetBrains Mono** | 12–30px / 500–700, tabular figures |
| Hero | Inter | `clamp(36px, 5.6vw, 60px)` / 650, tracking −0.035em |
| Question stem | Inter | `clamp(21px, 2.6vw, 28px)` / 600, line-height 1.4 |
| Answer option | Inter | 17px (16px mobile) / 400 |
| Section title / eyebrow | Inter caps | 12–13px / 700, tracking 0.12–0.14em |
| Helper text (`small`, notes) | Inter | 13.5px / 400 (was 10–11px) |

## 4. Shape, depth, motion
- Radius: 8 (inputs, dots) · 12 (cards, buttons, options) · 18 (panels) · 999 (chips, pills)
- Panels: glass (`backdrop-filter: blur(16px) saturate(1.25)`), 1px `--line`, soft layered shadow
- Easing `cubic-bezier(.2,.7,.2,1)`; hover 160–180ms; panel entrance 500ms rise-and-fade

## 5. Background decoration
- 3 blurred blobs (`blur 90px`): NVIDIA green top-left, teal-400 top-right, lime-400 bottom — opacity .38 light / .20 dark, slow drift (26–38s)
- Dot-grid pattern, 26px pitch, masked to fade out toward the bottom
- Layer is `position:fixed; pointer-events:none; aria-hidden`, so it never affects layout or interaction

## 6. Components
| Component | Rest | Hover | Active / selected |
|---|---|---|---|
| Button | white, 1px neutral-300 | green border + lime-50 fill, lifts 2px | press scale .97 |
| Primary button | green gradient, dark text, green glow | brighter gradient, bigger glow, light sheen sweeps across | press scale .97 |
| Danger button | rose outline | fills solid rose, white text | — |
| Mark-for-review | neutral | — | amber fill |
| Option | white card, mono letter chip | slides right 4px, green left bar + lime-50 | green fill, letter chip solid green |
| Option (result) | — | — | emerald ✓ / rose ✕ with tinted card and left bar |
| Question-map dot | white | green border, scales 1.05 | current = green ring · answered = solid dark · correct = emerald · wrong = rose · marked = amber corner dot |
| Setup field | neutral-100 card | green border + 4px soft green halo (also on focus-within) | — |
| Toggle | 48×28 switch, neutral track | halo | green track, white knob |
| Timer | neutral | — | ≤5 min amber · ≤1 min rose + pulse |
| Score ring | conic gradient: ≥85% green · ≥65% amber · else rose | — | — |

## 7. Accessibility
- Visible 3px lime focus ring on every interactive element
- Touch targets ≥ 44px (40px for compact in-card actions)
- Correctness is never color-only: ✓ / ✕ icons on options, text labels in feedback
- Answered ≠ correct: in strict mode answered dots are neutral-dark, not green, so nothing hints at the result

## 8. Tailwind equivalent (`tailwind.config.js`)
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', 'body:not(.light)'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        nvidia: { DEFAULT: '#76b900', hover: '#84cc16', text: '#4d7c0f', textDark: '#bef264' },
        // neutral, lime, emerald, rose, amber, teal come from Tailwind's defaults unchanged
      },
      borderRadius: { md: '12px', lg: '18px' },
      boxShadow: { glow: '0 8px 22px -8px rgb(118 185 0 / .7)' },
    },
  },
};
```
Class cheat-sheet: page `bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50` ·
primary button `bg-nvidia text-neutral-950 font-bold shadow-glow hover:bg-lime-500 hover:-translate-y-0.5 active:scale-95` ·
correct `border-emerald-600 bg-emerald-50 dark:bg-emerald-500/10` ·
wrong `border-rose-600 bg-rose-50 dark:bg-rose-500/10` ·
glass panel `bg-white/80 dark:bg-neutral-900/70 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-[18px]`.
