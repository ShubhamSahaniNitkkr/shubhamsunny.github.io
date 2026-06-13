# Shubham Sunny

**Senior Software Developer** · 7+ years building scalable web applications, intelligent automation, and AI-driven products.

Live site: [shubhamsunny.com](https://shubhamsunny.com)

---

## Profile

| | |
|---|---|
| **Role** | Senior Software Developer |
| **Education** | B.Tech, Information Technology — NIT Kurukshetra |
| **Location** | Patna, Bihar, India (Remote) |
| **Open to** | Full-time · Part-time · Freelance |
| **Email** | [shubhamsahaninitkkr@gmail.com](mailto:shubhamsahaninitkkr@gmail.com) |
| **GitHub** | [github.com/ShubhamSahaniNitkkr](https://github.com/ShubhamSahaniNitkkr) |
| **LinkedIn** | [linkedin.com/in/shubham-sunny-09b013129](https://www.linkedin.com/in/shubham-sunny-09b013129/) |

---

## What I Do

I lead development of internal tools, real-time dashboards, and AI-powered workflows for teams that need engineering that holds up after launch. My work spans:

- **Scalable web applications** — React, TypeScript, Node.js, performance at scale
- **AI-driven products** — OpenAI, LangChain, RAG systems, frontend ML integration
- **Intelligent automation** — workflow automation, browser automation, data pipelines
- **System design** — frontend architecture, state management, API integration

Currently **Senior Software Developer at Yum! Brands**. Previously at Kvantum Marketing Insights, Tolexo Online, and Triyama Software.

---

## Featured Projects

| Project | Live demo |
|---------|-----------|
| Massive Data Explorer | [mde-web.onrender.com](https://mde-web.onrender.com) |
| Offline First Task Management App | [offline-first-task-management-app-ui.onrender.com](https://offline-first-task-management-app-ui.onrender.com) |
| Server Driven UI | [sdui-pypy.onrender.com](https://sdui-pypy.onrender.com) |
| Frontend Plugin Platform | [fpp-host.onrender.com](https://fpp-host.onrender.com) |
| NPM Module for Server Driven UI | [npmjs.com/~shubhamsunnynitkkr](https://www.npmjs.com/~shubhamsunnynitkkr) |

Each project is rendered on the portfolio site with a live iframe preview and highlight bullets — managed from a single JSON file (see below).

---

## Site configuration

All dynamic content lives in **`assets/data/site.json`**. After any edit, sync the bundled copy:

```bash
node scripts/sync-site-data.js
```

### Hide or show sections

Set any section to `false` in `sections` — the block and its nav link disappear automatically:

```json
"sections": {
  "home": true,
  "about": true,
  "experience": true,
  "skills": true,
  "portfolio": true,
  "resume": true,
  "testimonial": false,
  "services": true,
  "contact": true
}
```

Available keys: `home`, `about`, `experience`, `skills`, `portfolio`, `resume`, `testimonial`, `services`, `contact`.

### Add a project

Paste a new object into the `projects` array:

```json
{
  "slug": "my-new-project",
  "title": "My New Project",
  "liveUrl": "https://example.com",
  "highlights": [
    "First bullet — what you built.",
    "Second bullet — tech or impact.",
    "Third bullet — optional."
  ]
}
```

Then run `node scripts/sync-site-data.js` and refresh.

### Resume PDF path

Update the path in `site.json`:

```json
"resume": {
  "pdf": "assets/pdf/Shubham_Sunny_Resume_2026_updated.pdf"
}
```

Download links and the resume iframe preview both use this path.

---

## Local preview

Open `index.html` directly in a browser, or serve the folder:

```bash
npx serve .
# or
python3 -m http.server 8080
```

The site uses `assets/js/site-data.js` (generated from `site.json`) so it works over `file://` without a server.

---

## Deploy

GitHub Pages deploys from `master` via `.github/workflows/deploy.yml`. Push to publish.

Custom domain: **shubhamsunny.com** (see `CNAME`).

---

## Tech stack (this site)

Static HTML · CSS · vanilla JavaScript · JSON-driven content · GitHub Pages

---

## Contact

Interested in **full-time**, **part-time**, or **freelance** work?

- **Email:** shubhamsahaninitkkr@gmail.com
- **WhatsApp:** +91 97718 23804
- **Website:** [shubhamsunny.com](https://shubhamsunny.com)

---

<p align="center">
  <sub>© 2026 Shubham Sunny · Built with care for recruiters, hiring managers, and clients.</sub>
</p>
