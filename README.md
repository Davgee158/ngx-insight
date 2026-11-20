# NGX Insight

NGX Insight is a beginner-focused research prototype for companies listed on the Nigerian Exchange. The current MVP target is **banks only**, with **no authentication**. Market data will be integrated server-side from three provider sources; personal research records remain local to the current browser for this MVP.

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

Other project checks:

```bash
npm run lint
npm run build
```

The production build needs the configured Google Fonts to be available during build, or the project must use locally hosted font files. The developer reports that the development server runs; check a production build in the intended environment before changing the font setup.

## Project notes

- [MVP implementation plan](MVP_IMPLEMENTATION_PLAN.md): current scope, phased delivery plan, acceptance criteria, and known prototype gaps.
- [Mockup consolidation guide](public/ngx-mockups/CONSOLIDATION_GUIDE.md): visual source-of-truth mapping and notes on consolidated references.
- High-fidelity HTML mockups and Iris SVG assets are in `public/ngx-mockups/`.

Preserve the existing visual system and components. See `AGENTS.md` before making code changes; this project uses Next.js 16.2.10 and requires checking the matching installed Next.js documentation for framework changes.
