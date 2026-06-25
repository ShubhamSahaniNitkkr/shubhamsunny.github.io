# Shubham Sunny — Website Modernization

Premium sales site for US business clients. Built with **Astro + React + Tailwind**, content driven from **Excel**.

## Quick start

```bash
npm install
npm run init:excel   # first time only — creates site-data.xlsx
npm run dev          # Excel auto-sync + dev server
```

## Update content

1. Edit `site-data.xlsx` at project root
2. Add images to `public/media/` (transformations, team, hero)
3. Save Excel — dev server auto-reloads

Or run manually: `npm run sync`

## Build & deploy

```bash
npm run build
```

Deploys to GitHub Pages on push to `main` via `.github/workflows/deploy.yml`.

## Sheets in Excel

| Sheet | Purpose |
|-------|---------|
| Site | Brand, contact, SEO, WhatsApp messages |
| Testimonials | Client reviews |
| Transformations | Before/after website pairs |
| Team | About you |
| Packages | USD service tiers |
| Portfolio | Projects page |
| FAQ | Plain-English answers |
| SEO | Landing page slugs |
| Blog | Article placeholders |
| Roadmap | Future products |

## Cloudinary (optional)

```bash
cp .env.example .env   # add credentials
npm run upload:cloudinary
npm run sync
```

## SEO files

- `/robots.txt` — search + AI crawlers
- `/sitemap-index.xml` — auto-generated
- `/llms.txt` + `/llms-full.txt` — LLM discovery

Legacy static site preserved in `legacy/`.
