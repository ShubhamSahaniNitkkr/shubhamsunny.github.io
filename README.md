# Shubham Sunny — Portfolio

Senior Software Engineer portfolio. Built with **Astro + React + Tailwind**.

## Quick start

```bash
npm install
npm run dev
```

## Content

Edit `src/data/portfolio.json` for intro video, interviews, experience, projects, blogs, products, and use cases.

- `intro.youtubeId` — YouTube video ID for the hero intro
- `intro.interviews[].youtubeId` or `.url` — interview links
- `blogs[].url` — LinkedIn post URLs
- `digitalProducts[].videoUrl` — product walkthrough videos

Site SEO / contact: `src/data/site.json`  
Social links: `src/data/social.json`

## Build & deploy

```bash
npm run build
```

Push to `master` triggers GitHub Pages via `.github/workflows/deploy.yml`.
