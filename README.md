# Alfonzo Louw · Portfolio

Next.js (App Router) static site. Every case study has its own address, e.g. `/work/momo-p2p/`.

## Run it locally
```bash
npm install
NEXT_PUBLIC_BASE_PATH="" npm run dev      # http://localhost:3000
```

## Edit content
- **Case studies:** `lib/cases.ts`. Each entry becomes a page. Fill in `metrics` values (second item) and they appear as big numbers; add `timeline: '...'` to show a timeline line.
- **Order:** the order in `CASES`. `featured: true` puts a project in the large list; the rest go in the "More work" grid.
- **Images:** `public/img/<key>.webp`, referenced by key (e.g. `cover: 'momo_inuse'`).
- **Hero and page chrome:** `lib/parts.json` (markup), `app/globals.css` (styles), `public/js/hero.js` (portrait animation), `public/js/site.js` (header, headings, case study interactions).
- **LinkedIn / CV:** `CONTACT` at the top of `lib/cases.ts`.

## Deploy (GitHub Pages)
1. Push this project to the `main` branch of `Alfonzo-Louw-Portfolio`.
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Every push to `main` builds and publishes to https://ddbyalfonzo.github.io/Alfonzo-Louw-Portfolio/

Using a custom domain later? Set `NEXT_PUBLIC_BASE_PATH` to an empty string in `.github/workflows/deploy.yml` and `NEXT_PUBLIC_SITE_URL` to your domain.
