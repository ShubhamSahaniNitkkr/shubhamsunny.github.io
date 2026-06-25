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

Deploys to GitHub Pages on push to `master` via `.github/workflows/deploy.yml` (source must be **GitHub Actions**, not branch/root).

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

## Email, chatbot & visit alerts (Vercel)

Deploy on **Vercel** (not GitHub Pages alone) so `/api/chat` and `/api/visit` work.

1. Copy `.env.example` → `.env` locally; add the same vars in Vercel → Settings → Environment Variables
2. Gmail: use an [App Password](https://myaccount.google.com/apppasswords) for `SMTP_PASS`

**Excel toggles** (Site sheet):

| field | values |
|-------|--------|
| `notify_on_visit` | `yes` / `no` — email when someone opens the site |
| `chatbot_enabled` | `yes` / `no` — floating chat widget |

**Email messages** (Site sheet): `email_consultation`, `email_package`, `email_general`

All CTAs open **Gmail compose** with pre-filled subject & body (same flow as before, email instead of WhatsApp).

## Cloudinary (optional)

```bash
cp .env.example .env   # add Cloudinary credentials
npm run upload:cloudinary
npm run sync
```


## SEO files

- `/robots.txt` — search + AI crawlers
- `/sitemap-index.xml` — auto-generated
- `/llms.txt` + `/llms-full.txt` — LLM discovery

Legacy static site preserved in `legacy/`.
