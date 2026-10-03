# shresthasunoj.com.np

Portfolio website for **Sunoj Shrestha, Civil Engineer**. A static site with no build step and no dependencies, served from GitHub Pages (`CNAME`).

## Structure

```
index.html            Single page: header → hero → focus ticker → about →
                      expertise → process → statement → contact → footer
css/
  tokens.css          Design tokens: colours (light/dark), type scale, spacing, motion
  base.css            Reset, typography, utilities, scroll-reveal
  components.css      Header, nav, theme toggle, buttons, labels, cards, footer
  sections.css        Page sections in document order + responsive rules
js/
  theme-init.js       Runs in <head>; applies saved/OS theme before first paint
  site.js             Theme toggle, mobile menu, active nav, reveal, copy email
images/
  mainbg.jpg          Hero portrait
  PassportPhoto.jpg   Profile card photo
  icon.svg            Favicon
```

Stylesheets load in the order listed above. Each later file depends on the tokens.

## Design system

- **Palette:** warm concrete neutrals, with a burnt "site orange" accent and a blueprint blue used for drawing details. Every colour is set once in `tokens.css` with `light-dark()`, so a single value change updates both themes. Text colours meet WCAG AA contrast in both themes.
- **Type:** Instrument Sans for headings and body (key phrases highlighted in the accent colour), and JetBrains Mono for small technical labels (drawing title-block style).
- **Theme:** follows the OS setting until the visitor uses the toggle. The choice is saved in `localStorage` and is switched with a View Transition circular reveal.
- **Motion:** reveal-on-scroll and line-drawing animations. All motion is turned off under `prefers-reduced-motion`.

## Editing content

All copy lives in `index.html`. To add a skill card, copy an `<article class="card">` inside `.bento`. To change colours, edit `css/tokens.css` only.

## Local preview

Open `index.html` in a browser, or run `python -m http.server` in this folder.
