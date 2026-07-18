# Shubham Sunny — Portfolio

Personal portfolio site for **Shubham Sunny** (Senior Software Developer).  
Stack: **Astro + Tailwind CSS v4**. Static site — no React runtime.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview the production build |

## Content

All copy lives in JSON under `src/data/`:

| File | Purpose |
|------|---------|
| `portfolio.json` | Hero, intro video, profile, experience, projects, skills, blogs, use cases, contact |
| `site.json` | Brand, SEO, contact defaults |
| `social.json` | LinkedIn, GitHub, npm |
| `media.json` | Portrait path |
| `notifications.json` | Web3Forms access key (optional) |

Intro YouTube ID: `portfolio.json` → `intro.youtubeId`  
Contact form key: `notifications.json` or `.env` → `PUBLIC_WEB3FORMS_ACCESS_KEY`

## Project layout

```
src/
  components/   # layout, sections, network background, SEO
  data/         # JSON content
  layouts/      # BaseLayout
  lib/          # utils, schema, tech logos
  pages/        # index + 404
  styles/       # global.css (Tailwind + tokens)
public/         # static assets, robots, media, .well-known/llms.txt
```

## Deploy

- **GitHub Pages** — push to `master` runs `.github/workflows/deploy.yml`
- **Vercel** — optional; `vercel.json` sets long-cache headers for `/_astro/*`

Domain: `shubhamsunny.com` (`public/CNAME`).

## SEO / LLM

- `/robots.txt`, `/sitemap-index.xml` (build)
- `/.well-known/llms.txt`
