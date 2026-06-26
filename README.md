# AstraFlow AI Landing Page

Standalone Phase 1 build for the Frontend Battle brief.

## Run Locally

Open `index.html` directly, or serve the folder:

```bash
python -m http.server 4173
```

Then visit `http://127.0.0.1:4173/`.

## Challenge Coverage

- Uses all SVG icons in `assets/icons/`.
- Uses `demo.mp4` as the hero motion preview.
- Applies the supplied palette and configures Inter plus JetBrains Mono font stacks in CSS.
- Feature 1: pricing is calculated from `pricingMatrix` in `app.js` with base tier rates, billing cadence, 20% annual discount, currency conversion, and regional tariff variables.
- Feature 1 isolation: billing and currency controls update only pricing text nodes plus local control state.
- Feature 2: one feature markup wrapper renders as a desktop bento grid and mobile accordion with active index persistence across breakpoint changes.
- SEO: semantic sections, meta description, OG/Twitter tags, JSON-LD, `robots.txt`, and `sitemap.xml`.

Before final deployment, replace `https://astraflow-ai.example/` in `index.html`, `robots.txt`, and `sitemap.xml` with the deployed URL.
