# Shubham Sunny — Portfolio

Personal portfolio for **Shubham Sunny** (Senior Software Developer).  
Stack: **Astro** (static). Same classic UI — no React runtime.

## Quick start

```bash
npm install
cp .env.example .env   # set PUBLIC_WEB3FORMS_ACCESS_KEY
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |

## Content

| Path | Purpose |
|------|---------|
| `public/assets/data/site.json` | Projects, reviews, sections, intro, skills |
| `public/assets/css/styles.css` | Site styles |
| `public/assets/js/*` | Client JS |
| `src/pages/index.astro` | Homepage |

Contact form uses **Web3Forms** (`PUBLIC_WEB3FORMS_ACCESS_KEY` in `.env`).

## SEO / LLM

- JSON-LD: Person, WebSite, ProfilePage, ProfessionalService, ItemList
- `robots.txt` (search + AI crawlers allowed)
- Sitemap via `@astrojs/sitemap`
- `/.well-known/llms.txt` and `/llms.txt`
- `site.webmanifest`

## Deploy

Push to `master` → GitHub Pages (`.github/workflows/deploy.yml`).

Optional repo secret: `PUBLIC_WEB3FORMS_ACCESS_KEY` (falls back to built-in key if unset).

Domain: `shubhamsunny.com` (`public/CNAME`).
