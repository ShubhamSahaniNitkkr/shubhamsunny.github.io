#!/usr/bin/env node
/**
 * Creates site-data.xlsx at project root with Shubham Sunny website content.
 * Run: npm run init:excel
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const excelPath = path.join(root, 'site-data.xlsx');

if (fs.existsSync(excelPath) && !process.argv.includes('--force')) {
  console.log('site-data.xlsx already exists. Run: npm run init:excel -- --force to recreate');
  process.exit(0);
}

const readme = [
  ['HOW TO UPDATE YOUR WEBSITE'],
  [''],
  ['1. Edit site-data.xlsx — change text, phone, email, pricing'],
  ['2. Add before/after images in public/media/transformations/transform-X/'],
  ['3. Save Excel — dev server auto-syncs (npm run dev)'],
  ['4. Or run: npm run sync manually'],
  [''],
  ['Services columns: id | name | color | tagline | description | order | card_image | process_images'],
  ['ServicePackages columns: id | service_id | name | price | price_label | includes | description | starting_from | most_popular | emoji | order'],
  ['Team columns: name | role | certification | past_company | expertise | bio | philosophy | image_path | is_founder | linkedin | phone | order'],
  [''],
  ['UseCases columns: id | title | category | thumbnail | image | client | card_teaser | summary | challenge | solution | results | metric | pdf_url'],
  ['  thumbnail = card image URL  |  image = modal hero (can be same or larger)'],
];

const site = [
  { field: 'brand', value: 'Shubham Sunny' },
  { field: 'tagline', value: 'Premium Development · Vision-First Clients Only' },
  { field: 'phone', value: '+91 97718 23804' },
  { field: 'whatsapp', value: '919771823804' },
  { field: 'email', value: 'shubhamsahaninitkkr@gmail.com' },
  { field: 'address', value: 'Remote · Serving US & Global Clients' },
  { field: 'location', value: 'Remote · US Time Zones Welcome' },
  { field: 'domain', value: 'https://shubhamsunny.com' },
  { field: 'happy_clients', value: '120' },
  { field: 'projects_delivered', value: '163' },
  { field: 'years_experience', value: '8' },
  { field: 'google_rating', value: '4.9' },
  { field: 'certifications', value: '8+ Years Experience' },
  { field: 'headline', value: 'Developers for Businesses With a Vision' },
  { field: 'bio_short', value: 'We are a selective development studio — we partner with premium clients who know where they are going, not businesses looking for the cheapest quote.' },
  { field: 'bio_long', value: 'We do not take every project. If you have a clear goal and care about quality, we can talk. Websites, data work, and custom software — founder-led, with a small core team and trusted specialists when a build needs extra hands.' },
  { field: 'expertise', value: 'Website Modernization|Data Scraping|Custom Software|Mobile Apps|Chrome Extensions|Telegram & WhatsApp Bots|Automation' },
  { field: 'hero_image', value: '/media/team/shubham.jpg' },
  { field: 'logo', value: '/media/logo.svg' },
  { field: 'logo_alt', value: 'Shubham Sunny — Website Modernization' },
  { field: 'hero_overline', value: 'Premium Development Studio' },
  { field: 'hero_status', value: 'Select projects · High standards' },
  { field: 'selectivity_line', value: 'We do not work with everyone — only with clients who have a vision, clear goals, and the standards to match.' },
  { field: 'standards', value: 'Vision-first clients|Hands-on founder review|Selective engagements|No cookie-cutter work' },
  { field: 'hero_title_line1', value: 'Your website should' },
  { field: 'hero_title_line2', value: 'win customers, not lose them' },
  { field: 'intro', value: 'A selective team of developers for premium clients with a vision — not a factory that takes every job. If you care about quality, clarity, and long-term results, you are in the right place.' },
  { field: 'hero_services', value: 'Website Redesign | Mobile-First | Speed & SEO | WhatsApp Integration' },
  { field: 'hero_badge', value: '8+ Years · 150+ Projects' },
  { field: 'artist_philosophy', value: 'We say no to most inquiries — so the yes means something.' },
  { field: 'rotation_interval_ms', value: '4500' },
  { field: 'cache_version', value: '1.0.0' },
  { field: 'seo_title', value: 'Shubham Sunny | Website Modernization, Data Scraping & Custom Software' },
  { field: 'seo_description', value: 'Full-stack developer helping businesses modernize websites, scrape data at scale, and build custom software — web, mobile, desktop, and bots. 8+ years, 150+ projects.' },
  { field: 'seo_keywords', value: 'website modernization, data scraping, custom software, web app development, mobile app, chrome extension, telegram bot, whatsapp bot' },
  { field: 'og_image', value: '/media/team/shubham.jpg' },
  { field: 'wa_consultation', value: "Hi Shubham, I saw your website. I'd like a free review of my business website." },
  { field: 'wa_package', value: "Hi Shubham, I'm interested in the {packageName} package (${price}). Can we discuss?" },
  { field: 'wa_general', value: 'Hi Shubham, I visited your website and would like to know more about website modernization.' },
  { field: 'wa_payment', value: 'Hi Shubham, I have a question about getting started. Name: {name}, Package: {package}.' },
];

const hero = [
  { order: 1, folder: 'hero', file: 'hero-1.jpg', alt: 'Shubham Sunny — website modernization expert' },
  { order: 2, folder: 'team', file: 'shubham.jpg', alt: 'Professional website developer' },
];

const transformations = [
  {
    id: 'transform-1',
    client_name: 'Local Dental Clinic',
    industry: 'Healthcare',
    story: 'Their 2015 template looked outdated on phones. We rebuilt it with clear booking buttons and a modern, trustworthy design.',
    package: 'Business Modernization',
    folder: 'transform-1',
    before_file: 'before.jpg',
    after_file: 'after.jpg',
    before_type: 'image',
    after_type: 'image',
  },
  {
    id: 'transform-2',
    client_name: 'Family Restaurant',
    industry: 'Food & Hospitality',
    story: 'Slow, cluttered homepage → clean menu, hours, and click-to-call. Customers started calling from mobile within the first week.',
    package: 'Starter Refresh',
    folder: 'transform-2',
    before_file: 'before.jpg',
    after_file: 'after.jpg',
    before_type: 'image',
    after_type: 'image',
  },
  {
    id: 'transform-3',
    client_name: 'Law Office',
    industry: 'Professional Services',
    story: 'Generic template → premium look that matches their reputation. Clear practice areas and a simple contact form.',
    package: 'Growth Website',
    folder: 'transform-3',
    before_file: 'before.jpg',
    after_file: 'after.jpg',
    before_type: 'image',
    after_type: 'image',
  },
];

const packages = [
  {
    id: 'starter-refresh',
    name: 'Starter Refresh',
    price: 499,
    price_label: 'USD',
    includes: 'Mobile-friendly fixes|Speed improvements|Contact form setup|1 revision round|Launch support',
    description: 'For sites that need a quick professional upgrade without a full rebuild.',
    most_popular: '',
    starting_from: 'yes',
  },
  {
    id: 'business-modern',
    name: 'Business Modernization',
    price: 1499,
    price_label: 'USD',
    includes: 'Full visual redesign|Up to 5 pages|Mobile-first layout|Basic SEO setup|WhatsApp / chat link|2 revision rounds',
    description: 'Our most popular package — a complete trust makeover for your business.',
    most_popular: 'yes',
    starting_from: '',
  },
  {
    id: 'growth-site',
    name: 'Growth Website',
    price: 2999,
    price_label: 'USD',
    includes: 'Everything in Business Modern|Blog setup|Analytics & insights|Lead capture forms|Priority support|3 revision rounds',
    description: 'For businesses ready to grow online and capture more leads.',
    most_popular: '',
    starting_from: '',
  },
];

const faq = [
  { question: 'Do you take every project?', answer: 'Not every one. We pick work where the goal is clear and we can do it properly — if we say yes, you get our full attention.' },
  { question: 'Website modernization — what do I get?', answer: 'A mobile-first site that loads fast and makes calling or booking easy. Hosting, SSL, and handoff included.' },
  { question: 'Is data scraping legal?', answer: 'We collect publicly visible data only — no private logins. Every project starts with a scope review.' },
  { question: 'What is custom software?', answer: 'Web apps, mobile apps, bots, and tools built for your workflow when off-the-shelf products do not fit.' },
  { question: 'Price and timeline?', answer: 'Websites from ~$800. Scraping from ~$200. Custom software after discovery. Most web projects: 2–4 weeks.' },
  { question: 'Do I need technical knowledge?', answer: 'No. We handle servers, code, and deployment — you approve outcomes in plain English.' },
  { question: 'US / UK time zones?', answer: 'Yes. We schedule calls and updates around your timezone.' },
  { question: 'How do we start?', answer: 'Use the contact form at the bottom of the page — we reply within one business day.' },
  { question: 'Do you build WhatsApp or Telegram bots?', answer: 'Yes — order bots, lead qualifiers, and customer support flows. We scope the conversation, build it, and hand over docs so your team can run it.' },
  { question: 'Can you work with my existing hosting?', answer: 'Usually yes. We can redesign on your current host or migrate to something faster — we document logins and handoff either way.' },
  { question: 'What support do I get after launch?', answer: 'Every project includes a handoff guide. Optional monthly care covers updates, backups, and small content changes so you are not stuck alone.' },
  { question: 'Will you sign an NDA?', answer: 'Yes, for client work that needs confidentiality. Many portfolio pieces stay private — we are used to working under NDA.' },
];

const testimonials = [
  { id: 'rev-1', name: 'Michael S.', rating: 5, text: 'Fast, efficient, and great communication throughout. Delivered exactly what I needed — highly recommend for any business owner.', country: 'United States', project_type: 'Custom project', date: '2024', image: '', source_url: 'https://www.fiverr.com/shubhamsunny?public_mode=true', featured: 'yes' },
  { id: 'rev-2', name: 'Jesus Z.', rating: 5, text: 'Excellent job — very quick and precise. He understood what I needed without me having to explain technical details.', country: 'United States', project_type: 'Data project', date: '2024', image: '', source_url: 'https://www.fiverr.com/shubhamsunny?public_mode=true', featured: 'yes' },
  { id: 'rev-3', name: 'Steve S.', rating: 5, text: 'Excellent fast work, delivered on time. Exactly what I needed for my business.', country: 'United States', project_type: 'Automation', date: '2023', image: '', source_url: 'https://www.fiverr.com/shubhamsunny?public_mode=true', featured: 'yes' },
  { id: 'rev-4', name: 'Reef M.', rating: 4, text: 'Thank you for doing your best. I appreciate the effort and commitment to finishing the job.', country: 'United States', project_type: 'Web project', date: '2023', image: '', source_url: 'https://www.fiverr.com/shubhamsunny?public_mode=true', featured: '' },
  { id: 'rev-5', name: 'Mass G.', rating: 5, text: 'A pleasure to work with on a challenging project. Great communicator and problem solver — delivered exactly what was needed.', country: 'United Kingdom', project_type: 'Complex build', date: '2023', image: '', source_url: 'https://www.fiverr.com/shubhamsunny?public_mode=true', featured: 'yes' },
  { id: 'rev-6', name: 'Ahmidi F.', rating: 5, text: 'Perfect workflow, perfect communication, and perfect results. Will definitely come back for future work.', country: 'United Kingdom', project_type: 'Web development', date: '2023', image: '', source_url: 'https://www.fiverr.com/shubhamsunny?public_mode=true', featured: '' },
  { id: 'rev-7', name: 'Hung F.', rating: 5, text: 'Patient and hardworking until everything was delivered perfectly. Really appreciated the effort and clear updates.', country: 'Japan', project_type: 'App integration', date: '2023', image: '', source_url: 'https://www.fiverr.com/shubhamsunny?public_mode=true', featured: '' },
  { id: 'rev-8', name: 'Shuvo A.', rating: 5, text: "Professionalism and expertise shine through. Delivered exactly as promised and went above expectations.", country: 'Bangladesh', project_type: 'Development', date: '2023', image: '', source_url: 'https://www.fiverr.com/shubhamsunny?public_mode=true', featured: '' },
  { id: 'rev-9', name: 'Aqua Note', rating: 5, text: 'Great to work with. Professional and very cooperative throughout the entire project.', country: 'Canada', project_type: 'Web project', date: '2023', image: '', source_url: 'https://www.fiverr.com/shubhamsunny?public_mode=true', featured: '' },
  { id: 'rev-10', name: 'Hardworlds', rating: 5, text: 'Very satisfied with the work. Professional and quick delivery. Will hire again!', country: 'India', project_type: 'Development', date: '2023', image: '', source_url: 'https://www.fiverr.com/shubhamsunny?public_mode=true', featured: '' },
  { id: 'rev-11', name: 'Ghayath', rating: 5, text: 'Delivered what I asked for in no time. Very efficient and professional.', country: 'Jordan', project_type: 'Quick turnaround', date: '2023', image: '', source_url: 'https://www.fiverr.com/shubhamsunny?public_mode=true', featured: '' },
  { id: 'rev-12', name: 'Mark', rating: 5, text: 'Thanks for the patience and skill. Communicated clearly and delivered on time.', country: 'Luxembourg', project_type: 'Integration', date: '2023', image: '', source_url: 'https://www.fiverr.com/shubhamsunny?public_mode=true', featured: '' },
];

const team = [
  {
    name: 'Shubham Sunny',
    role: 'Founder & Lead Developer',
    certification: '8+ years · Founder',
    past_company: '',
    expertise: 'Full-Stack|Web Apps|Data Scraping|Custom Software',
    bio: 'I founded this studio and own technical direction on every project — architecture, code quality, and client outcomes. We scale with trusted specialists per project, not a bloated bench for show.',
    philosophy: 'A website should make a stranger feel confident enough to call you.',
    image_path: 'shubham.jpg',
    is_founder: 'yes',
    linkedin: 'https://www.linkedin.com/in/shubham-sunny-09b013129/',
    phone: '+91 97718 23804',
    order: 1,
  },
  {
    name: 'Deep Shikha',
    role: 'QA & Client Success Lead',
    certification: 'Quality Assurance Expert',
    past_company: '',
    expertise: 'Manual QA|Automation Testing|Client Onboarding|UAT',
    bio: 'Deep handles the rest of day-to-day delivery — QA on real devices, client kickoff calls, milestone tracking, and making sure nothing goes live until it is right.',
    philosophy: 'Quality is not a phase — it is the reason clients come back.',
    image_path: 'deep-shikha.png',
    is_founder: '',
    linkedin: '',
    phone: '+91 9142760891',
    order: 2,
  },
  {
    name: 'Shushma Devi',
    role: 'HR Expert & Marketing Team Head',
    certification: 'People & Growth',
    past_company: '',
    expertise: 'HR Operations|Talent Hiring|Brand Marketing|Client Outreach',
    bio: 'Shushma builds and runs the people side — hiring, culture, marketing outreach, and keeping the right specialists on every project.',
    philosophy: 'Great delivery starts with great people — and great people need clear direction.',
    image_path: 'shushma-devi.png',
    is_founder: '',
    linkedin: '',
    phone: '+91 9939067781',
    order: 3,
  },
  {
    name: 'Vinay Thakur',
    role: 'Delivery Manager & Mentor',
    certification: 'Program & delivery',
    past_company: '',
    expertise: 'Program Management|Agile Delivery|Enterprise Clients|Mentoring',
    bio: 'Vinay handles program management on larger builds — timelines, milestones, and mentoring developers through complex delivery.',
    philosophy: 'Ship on time, communicate early, and never hide bad news.',
    image_path: 'vinay-thakur.png',
    is_founder: '',
    linkedin: '',
    phone: '+91 9931230810',
    order: 4,
  },
];

const social = [
  { field: 'linkedin_url', value: 'https://www.linkedin.com/in/shubham-sunny-09b013129/' },
  { field: 'linkedin_handle', value: 'Shubham Sunny' },
  { field: 'twitter_url', value: '' },
  { field: 'facebook_url', value: '' },
  { field: 'instagram_url', value: '' },
  { field: 'fiverr_url', value: 'https://www.fiverr.com/shubhamsunny?public_mode=true' },
  { field: 'github_url', value: 'https://github.com/ShubhamSahaniNitkkr' },
  { field: 'google_reviews_url', value: 'https://www.fiverr.com/shubhamsunny?public_mode=true' },
  { field: 'google_rating', value: '4.9' },
  { field: 'google_total_reviews', value: '15' },
];

const servicesHub = [
  {
    id: 'web-modernization',
    name: 'Website Modernization',
    color: '#3B82F6',
    tagline: 'Turn outdated sites into trust-building machines',
    description: 'Modern, mobile-first websites that convert visitors into customers.',
    order: 1,
    card_image: '/media/transformations/transform-1/after.jpg',
    process_images: '/media/transformations/transform-1/before.jpg|/media/transformations/transform-1/after.jpg|/media/transformations/transform-2/after.jpg',
  },
  {
    id: 'data-scraping',
    name: 'Data Scraping',
    color: '#10B981',
    tagline: 'Extract data from any website or mobile app',
    description: 'Competitor intelligence, product catalogs, images — scraped cleanly and delivered ready to use.',
    order: 2,
    card_image: '/media/portfolio/massive-data-explorer/cover.jpg',
    process_images: '/media/portfolio/massive-data-explorer/cover.jpg|/media/portfolio/massive-data-explorer/cover.jpg|/media/portfolio/massive-data-explorer/cover.jpg',
  },
  {
    id: 'custom-software',
    name: 'Custom Software',
    color: '#8B5CF6',
    tagline: 'Web, mobile, desktop, and bots — built for you',
    description: 'From web apps to Android apps, Chrome extensions, and Telegram/WhatsApp bots.',
    order: 3,
    card_image: '/media/portfolio/sdui/cover.jpg',
    process_images: '/media/portfolio/sdui/cover.jpg|/media/portfolio/offline-first/cover.jpg|/media/portfolio/fpp/cover.jpg',
  },
];

const serviceBlocks = [
  // Web — intro & difference
  { service_id: 'web-modernization', block_type: 'intro', title: 'What is website modernization?', body: 'We take your outdated site and rebuild it to look modern, load fast on phones, and make it easy for customers to call or book — without you touching code or servers.', order: 1, icon: '🌐' },
  { service_id: 'web-modernization', block_type: 'difference', title: 'How it makes a difference', body: '📱|Mobile-first|80% of your customers search on phones — your site must work there|⏱|Faster load|Slow sites lose 40% of visitors before they read anything|🤝|More trust|A modern site makes strangers feel safe enough to call|📞|More leads|Clear buttons, forms, and booking = more inquiries', order: 2, icon: '' },
  { service_id: 'web-modernization', block_type: 'step', title: 'Free review call', body: 'We look at your current site on mobile & desktop and tell you what is costing you leads — no jargon.', order: 1, icon: '📞' },
  { service_id: 'web-modernization', block_type: 'step', title: 'Design & content', body: 'You share photos, menu, services. We structure pages, write clear copy, and show you mockups before building.', order: 2, icon: '🎨' },
  { service_id: 'web-modernization', block_type: 'step', title: 'Build & optimize', body: 'Mobile-first development, speed tuning, SEO basics, forms, analytics — all handled by us.', order: 3, icon: '⚙️' },
  { service_id: 'web-modernization', block_type: 'step', title: 'Launch & handoff', body: 'We deploy, test on real devices, and give you a simple guide to update text or images later.', order: 4, icon: '🚀' },
  { service_id: 'web-modernization', block_type: 'support', title: 'You do not need to do anything technical', body: '🆕|No website yet?|We register domain, set up hosting, SSL, and email forwarding — you just approve the design.|🖥️|Already have a site?|We document where it is hosted, where code lives (GitHub/your account), and migrate without downtime.|🔒|Ongoing support|Optional monthly care — updates, backups, uptime checks. You focus on your business.|📋|Full handoff doc|Server name, login links, repo URL, and how to request changes — all in one PDF.', order: 3, icon: '' },
  // Data scraping
  { service_id: 'data-scraping', block_type: 'intro', title: 'What is data scraping?', body: 'We automatically collect public data from websites and apps — prices, listings, catalogs, reviews — and deliver it clean in CSV, JSON, or your database.', order: 1, icon: '📊' },
  { service_id: 'data-scraping', block_type: 'difference', title: 'How it makes a difference', body: '⏱|Save hours daily|Stop copy-pasting from tabs — data arrives on a schedule|👀|Beat competitors|See price changes and new listings before your rivals|📈|Better decisions|Real numbers instead of gut feeling|🔄|Always fresh|Daily or hourly updates — not stale spreadsheets', order: 2, icon: '' },
  { service_id: 'data-scraping', block_type: 'step', title: 'Scope & targets', body: 'You share URLs, apps, or categories. We confirm what is public, legal, and feasible before starting.', order: 1, icon: '🎯' },
  { service_id: 'data-scraping', block_type: 'step', title: 'Build scraper', body: 'Custom scrapers with proxies, retries, and change detection — built for your exact data shape.', order: 2, icon: '🔧' },
  { service_id: 'data-scraping', block_type: 'step', title: 'Deliver data', body: 'CSV, JSON, Google Sheets, PostgreSQL, or API — formatted exactly how your team needs it.', order: 3, icon: '📦' },
  { service_id: 'data-scraping', block_type: 'step', title: 'Monitor & alert', body: 'Optional ongoing runs with Slack/email alerts when prices drop or new items appear.', order: 4, icon: '🔔' },
  { service_id: 'data-scraping', block_type: 'support', title: 'We handle the hard parts', body: '🛡️|Proxies & blocks|We manage IP rotation and anti-bot handling — you never touch it.|☁️|Where it runs|Scrapers run on our cloud or yours — documented in handoff.|📁|Your data, your account|Delivered to your S3, database, or inbox — we do not resell your data.|🔁|Maintenance|Sites change — we fix breakages as part of monitoring plans.', order: 3, icon: '' },
  // Custom software
  { service_id: 'custom-software', block_type: 'intro', title: 'What is custom software?', body: 'Web apps, mobile apps, bots, and tools built exactly for how your business works — when off-the-shelf products do not fit.', order: 1, icon: '💻' },
  { service_id: 'custom-software', block_type: 'difference', title: 'How it makes a difference', body: '🔧|Fits your workflow|No forcing your team to adapt to generic software|🌙|Runs 24/7|Bots and automations work while you sleep|📉|Fewer errors|Structured flows replace messy spreadsheets and chat orders|📈|Scales with you|Built to grow — add features without starting over', order: 2, icon: '' },
  { service_id: 'custom-software', block_type: 'step', title: 'Discovery', body: '30-min call to map your goal, users, and must-have features. You talk business — we handle tech.', order: 1, icon: '💬' },
  { service_id: 'custom-software', block_type: 'step', title: 'Prototype', body: 'Clickable mockup or MVP in 1–2 weeks so you can see it working before full build.', order: 2, icon: '📐' },
  { service_id: 'custom-software', block_type: 'step', title: 'Build sprints', body: 'Weekly demos, you test on your phone/browser, feedback applied same week.', order: 3, icon: '🏗️' },
  { service_id: 'custom-software', block_type: 'step', title: 'Launch & support', body: 'Deploy to production, train your team, hand over repo + docs. Support available after.', order: 4, icon: '🚀' },
  { service_id: 'custom-software', block_type: 'support', title: 'Deployment & code — fully documented', body: '📱|App stores|We handle Play Store / deployment — or guide your account step by step.|☁️|Where it lives|Render, Vercel, AWS, or your server — documented with access links.|📂|Your code|GitHub repo in your account (or ours, transferred to you). Full source, no lock-in.|📖|Docs included|Setup guide, API docs, and how to request changes later.', order: 3, icon: '' },
];

const servicePackages = [
  { id: 'web-starter', service_id: 'web-modernization', name: 'Starter Refresh', price: 499, price_label: 'USD', includes: 'Mobile-friendly fixes|Speed improvements|Contact form|1 revision round|Launch support', description: 'Quick professional upgrade — no full rebuild needed.', starting_from: 'yes', most_popular: '', emoji: '✨', order: 1 },
  { id: 'web-business', service_id: 'web-modernization', name: 'Business Modernization', price: 1499, price_label: 'USD', includes: 'Full visual redesign|Up to 5 pages|Mobile-first|Basic SEO|WhatsApp link|2 revision rounds', description: 'Complete trust makeover — our most popular for small businesses.', starting_from: '', most_popular: 'yes', emoji: '🏆', order: 2 },
  { id: 'web-growth', service_id: 'web-modernization', name: 'Growth Website', price: 2999, price_label: 'USD', includes: 'Everything in Business|Blog setup|Analytics|Lead forms|Priority support|3 revision rounds', description: 'For businesses ready to capture more leads online.', starting_from: '', most_popular: '', emoji: '📈', order: 3 },
  { id: 'scrape-starter', service_id: 'data-scraping', name: 'One-Time Scrape', price: 200, price_label: 'USD', includes: 'Up to 5000 records|CSV or JSON export|1 target source|Clean formatted output|Delivery in 3–5 days', description: 'Perfect for a single dataset or competitor snapshot.', starting_from: 'yes', most_popular: '', emoji: '📋', order: 1 },
  { id: 'scrape-monitor', service_id: 'data-scraping', name: 'Monitoring Plan', price: 499, price_label: 'USD', includes: 'Daily or weekly runs|Change detection|Slack/email alerts|Multiple sources|Monthly data refresh', description: 'Ongoing price or listing tracking — set and forget.', starting_from: '', most_popular: 'yes', emoji: '🔔', order: 2 },
  { id: 'scrape-enterprise', service_id: 'data-scraping', name: 'Enterprise Pipeline', price: 1499, price_label: 'USD', includes: 'Unlimited sources (scoped)|Database integration|API endpoint|Proxy management|Priority fixes|Dedicated support', description: 'Large-scale scraping with direct database delivery.', starting_from: 'yes', most_popular: '', emoji: '🏢', order: 3 },
  { id: 'soft-mvp', service_id: 'custom-software', name: 'MVP Build', price: 1999, price_label: 'USD', includes: 'Core features only|Web or mobile|2-week prototype|1 revision round|Deploy to production', description: 'Validate your idea fast with a working prototype.', starting_from: 'yes', most_popular: '', emoji: '⚡', order: 1 },
  { id: 'soft-full', service_id: 'custom-software', name: 'Full Application', price: 4999, price_label: 'USD', includes: 'Full feature set|Web + API|Weekly demos|3 revision rounds|Production deploy|30-day support', description: 'Complete custom app — bots, dashboards, mobile, or tools.', starting_from: 'yes', most_popular: 'yes', emoji: '🚀', order: 2 },
  { id: 'soft-retainer', service_id: 'custom-software', name: 'Monthly Retainer', price: 999, price_label: 'USD', includes: '20 hrs development/month|Bug fixes|Small features|Priority response|Slack access', description: 'Ongoing development after launch or for evolving products.', starting_from: 'yes', most_popular: '', emoji: '🤝', order: 3 },
];

const templates = Array.from({ length: 30 }, (_, i) => ({
  id: `template-${i + 1}`,
  name: `Modern Template ${i + 1}`,
  category: ['Business', 'Portfolio', 'E-commerce', 'Restaurant', 'Healthcare'][i % 5],
  thumbnail: '',
  download_url: '#',
  description: `Free responsive website template — ready to customize and deploy.`,
}));

const useCases = [
  { id: 'uc-ecommerce', title: 'E-commerce Price Monitoring', pdf_url: '#', thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=340&fit=crop&q=80', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80', category: 'Data Scraping', client: 'US Shopify brand · 12 competitors', card_teaser: 'Stopped checking prices manually — now gets Slack alerts before breakfast.', summary: 'A Texas e-commerce brand was getting undercut overnight with no visibility until customers compared prices on Google.', challenge: 'Ops spent 3 hours every morning copying competitor prices into Excel and still missed mid-day changes.', solution: 'Nightly scraper across 12 stores with Slack alerts when any price drops more than 5%.', results: 'Reaction time went from days to hours. Paid for itself in week one.', metric: '15 hrs/week saved' },
  { id: 'uc-restaurant', title: 'Restaurant Website Redesign', pdf_url: '#', thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=340&fit=crop&q=80', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80', category: 'Web Modernization', client: 'Family restaurant · Ohio, USA', card_teaser: 'PDF menu and no click-to-call → 40% more phone orders in month one.', summary: 'A family Italian restaurant had a 2016 site that fell apart on phones where 80% of searches happen.', challenge: 'Menu was a PDF. Hours buried in footer. Customers said the site looked closed.', solution: 'Mobile-first rebuild with scrollable menu, sticky call button, and sub-2s load on 4G.', results: 'Phone orders jumped 40%. Three Google reviews praised the easy new site.', metric: '+40% phone calls' },
  { id: 'uc-lead-gen', title: 'Lead Generation Bot', pdf_url: '#', thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=340&fit=crop&q=80', image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80', category: 'Custom Software', client: 'Marketing agency · London, UK', card_teaser: 'Leads waited 4 hours for a reply. Bot responds in 90 seconds, 24/7.', summary: 'A 6-person agency lost warm leads after 6 PM when nobody was checking the inbox.', challenge: 'Generic chat widget dumped emails into a spreadsheet checked only in the morning.', solution: 'Telegram bot with 4 qualifying questions, lead scoring, and HubSpot push with full transcript.', results: 'Response time: 4 hours → 90 seconds. Qualified conversions up 28% in Q1.', metric: '28% more conversions' },
  { id: 'uc-competitor', title: 'Competitor Analysis Report', pdf_url: '#', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=340&fit=crop&q=80', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80', category: 'Data Scraping', client: 'B2B SaaS startup · San Francisco', card_teaser: 'Founder tracked 8 rivals manually. Now gets a Monday PDF with pricing + feature changes.', summary: 'Seed-stage founder needed competitor intel but could not afford enterprise CI tools.', challenge: 'Every Sunday, 2 hours screenshotting competitor pages — mid-week updates missed.', solution: 'Weekly scrapers on 8 competitors compiled into a branded PDF every Monday 8 AM.', results: 'Used data to reposition pricing and win 2 enterprise deals.', metric: '8 rivals tracked weekly' },
  { id: 'uc-mobile-app', title: 'Offline-First Mobile App', pdf_url: '#', thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=340&fit=crop&q=80', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=80', category: 'Custom Software', client: 'Field services · rural India', card_teaser: 'Technicians in dead zones. App works offline, syncs when signal returns.', summary: 'Field techs lost job data when connectivity dropped — they went back to paper forms.', challenge: 'Existing app crashed without internet. Office staff re-typed everything.', solution: 'Offline-first Android with SQLite, photos, signatures, and background sync.', results: 'Zero lost jobs after launch. 30% more jobs completed per day.', metric: '+30% jobs/day' },
  { id: 'uc-dental', title: 'Dental Clinic Modernization', pdf_url: '#', thumbnail: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=340&fit=crop&q=80', image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&q=80', category: 'Web Modernization', client: 'Dental clinic · New Jersey, USA', card_teaser: 'Old site looked sketchy. Online bookings = 35% of new patients.', summary: 'Decent local reputation but a 2009-looking site made new patients hesitate.', challenge: 'No online booking. Missing doctor profiles. Insurance info unreadable.', solution: 'Trust-first design with doctor photos, insurance logos, and integrated booking.', results: '35% of new patients book online. First time patients complimented the site.', metric: '35% online bookings' },
  { id: 'uc-amazon', title: 'Amazon Product Scraper', pdf_url: '#', thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=340&fit=crop&q=80', image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80', category: 'Data Scraping', client: 'Amazon FBA seller · Florida, USA', card_teaser: '200K+ ASINs indexed with daily price tracking. Found 3 niches to expand into.', summary: 'FBA seller needed competitor data across 15 categories with no bulk export from Amazon.', challenge: 'Checking 50 products/day by hand — data stale before finishing a category.', solution: 'Custom scraper with proxy rotation pulling price, rating, BSR daily into PostgreSQL.', results: '200K+ products in 3 weeks. Launched products now top-10 in category.', metric: '200K+ products indexed' },
  { id: 'uc-whatsapp', title: 'WhatsApp Order Bot', pdf_url: '#', thumbnail: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=600&h=340&fit=crop&q=80', image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=1200&q=80', category: 'Custom Software', client: 'Cloud kitchen · Dubai, UAE', card_teaser: '40+ unread WhatsApps at peak. Bot cut errors 90%, orders take 90 seconds.', summary: 'Cloud kitchen took orders via messy WhatsApp messages — wrong items, missing addresses.', challenge: 'Staff spent more time clarifying orders than cooking during rush hours.', solution: 'Structured bot: menu → cart → address → Stripe payment link, all in chat.', results: 'Errors down 90%. Same staff handles 2x volume.', metric: '90% fewer errors' },
  { id: 'uc-lawfirm', title: 'Law Firm Website', pdf_url: '#', thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=340&fit=crop&q=80', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80', category: 'Web Modernization', client: 'Boutique law firm · Chicago, USA', card_teaser: 'Prospects almost did not call because the site did not match the firm.', summary: '15 years of wins but a 2008 template site hurt credibility on intake calls.', challenge: 'Thin attorney bios, broken mobile layout, unencrypted contact form.', solution: 'Premium redesign with credentials, practice area detail, and encrypted intake.', results: 'Consultation requests up 55% in Q1.', metric: '+55% consultations' },
  { id: 'uc-realestate', title: 'Real Estate Listing Aggregator', pdf_url: '#', thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=340&fit=crop&q=80', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80', category: 'Data Scraping', client: 'Property investor · Toronto, Canada', card_teaser: 'Checked 6 listing sites daily. One dashboard + instant alerts for new deals.', summary: 'Investor checked 6 portals every morning — good deals gone by the time he found them.', challenge: '2 hours daily tab-hopping. Listings often under offer before he saw them.', solution: 'Scrapers every 2 hours, unified dashboard, SMS when criteria match.', results: '4 below-market deals in month 1 that he would have missed manually.', metric: '4 deals in month 1' },
];

const seo = [
  { slug: 'website-redesign-small-business', title: 'Small Business Website Redesign | Shubham Sunny', h1: 'Small Business Website Redesign', description: 'We redesign outdated small business websites for US owners. Mobile-friendly, fast, and built to convert visitors into customers.', keywords: 'small business website redesign, website makeover small business', gallery_category: 'local-business', featured_package_id: 'business-modern' },
  { slug: 'modernize-outdated-website', title: 'Modernize Your Outdated Website | Shubham Sunny', h1: 'Modernize Your Outdated Website', description: 'Turn your old website into a modern, trustworthy online presence. Plain English process, US timezone friendly.', keywords: 'modernize outdated website, old website redesign', gallery_category: 'all', featured_package_id: 'business-modern' },
  { slug: 'website-design-for-dentists', title: 'Website Design for Dentists | Shubham Sunny', h1: 'Website Design for Dentists', description: 'Professional dental website design that builds patient trust. Mobile-first, easy booking, clear contact options.', keywords: 'dental website design, dentist website redesign', gallery_category: 'healthcare', featured_package_id: 'growth-site' },
  { slug: 'restaurant-website-redesign', title: 'Restaurant Website Redesign | Shubham Sunny', h1: 'Restaurant Website Redesign', description: 'Modern restaurant websites with menus, hours, and click-to-call. Help hungry customers find and contact you.', keywords: 'restaurant website redesign, food business website', gallery_category: 'restaurant', featured_package_id: 'starter-refresh' },
  { slug: 'professional-services-website', title: 'Professional Services Website | Shubham Sunny', h1: 'Websites for Professional Services', description: 'Premium websites for lawyers, consultants, and service businesses. Look credible, get more inquiries.', keywords: 'professional services website, law firm website design', gallery_category: 'professional-services', featured_package_id: 'growth-site' },
];

const blog = [
  { slug: 'signs-your-website-is-costing-customers', title: '5 Signs Your Website Is Costing You Customers', excerpt: 'If your site looks outdated on mobile or takes forever to load, you are losing business every day. Here is what to watch for.', status: 'published', publish_date: '2026-06-01' },
  { slug: 'what-mobile-friendly-means', title: 'What Mobile-Friendly Actually Means (Plain English)', excerpt: 'No jargon — just what mobile-friendly means for your business and why it matters for US customers.', status: 'published', publish_date: '2026-06-10' },
  { slug: 'how-long-website-redesign-takes', title: 'How Long Does a Website Redesign Take?', excerpt: 'A realistic timeline for small business website projects — from first call to launch.', status: 'published', publish_date: '2026-06-15' },
  { slug: 'when-data-scraping-makes-sense', title: 'When Does Data Scraping Actually Make Sense?', excerpt: 'Stop copy-pasting from competitor sites — here is when automation pays for itself (and when it does not).', status: 'published', publish_date: '2026-06-18' },
  { slug: 'why-we-do-not-take-every-project', title: 'Why We Do Not Take Every Project', excerpt: 'We say no to most inquiries on purpose. Here is what we look for — and what you get when we say yes.', status: 'published', publish_date: '2026-06-22' },
  { slug: 'whatsapp-bots-for-local-business', title: 'WhatsApp Bots for Local Business — Worth It?', excerpt: 'If customers message you on WhatsApp at 9 PM, a structured bot beats a messy inbox every time.', status: 'published', publish_date: '2026-06-26' },
];

const roadmap = [
  { id: 'website-modernization', name: 'Website Modernization', status: 'available', description: 'Transform your outdated website into a modern, mobile-friendly site that builds trust.', eta: 'Now' },
  { id: 'ai-chatbot', name: 'AI Website Chatbot', status: 'coming_soon', description: 'Answers visitor questions 24/7 on your website — so you never miss a lead.', eta: 'Q3 2026' },
  { id: 'lead-generation', name: 'Lead Generation Tools', status: 'planned', description: 'Capture visitor details and follow up automatically — grow your pipeline.', eta: '2026' },
  { id: 'offline-doc-chat', name: 'Private Document Chat', status: 'planned', description: 'Chat with your business documents securely — for teams that need answers fast.', eta: '2026' },
];

const portfolio = [
  { look_id: 'web-restaurant', service_id: 'web-modernization', title: 'Restaurant Website Redesign', category: 'restaurant', folder: 'web-restaurant', cover_file: '/media/transformations/transform-2/after.jpg', client_industry: 'Food & Hospitality', outcome: 'Mobile-first menu and click-to-call — client asked to keep branding private', live_url: '', is_locked: 'yes', public_description: 'Full mobile-first rebuild for a family restaurant — scrollable menu, sticky call button, sub-2s load on 4G. Client requested no public demo or branding.', highlights: 'PDF menu replaced with scrollable mobile menu|Sticky call button|Sub-2s load on 4G' },
  { look_id: 'web-dental', service_id: 'web-modernization', title: 'Dental Clinic Modernization', category: 'healthcare', folder: 'web-dental', cover_file: '/media/transformations/transform-1/after.jpg', client_industry: 'Healthcare', outcome: 'Online booking and trust-first design — live demo withheld per clinic NDA', live_url: '', is_locked: 'yes', public_description: 'Trust-first healthcare site with doctor profiles, insurance logos, and online booking. Live URL withheld per clinic NDA.', highlights: 'Doctor profiles & insurance logos|Online booking widget|Trust-first mobile design' },
  { look_id: 'massive-data-explorer', service_id: 'data-scraping', title: 'High-Performance Data Dashboard', category: 'professional-services', folder: 'massive-data-explorer', cover_file: 'cover.jpg', client_industry: 'Data & Analytics', outcome: 'Handles 1M+ records with instant search', live_url: '', is_locked: 'yes', public_description: 'Full-stack data explorer over 1M scraped records — server-side search, filter, sort. Client does not permit public access to live environment.', highlights: 'Full-stack data explorer over 1M records|Server-side search, filter, and sort|Production deploy with test coverage' },
  { look_id: 'offline-first-task-management', service_id: 'custom-software', title: 'Offline-First Business App', category: 'ecommerce', folder: 'offline-first', cover_file: 'cover.jpg', client_industry: 'Retail', outcome: 'Works without internet — syncs when back online', live_url: '', is_locked: 'yes', public_description: 'PWA for field teams — shop and checkout offline, automatic sync when back online. Demo locked per client request.', highlights: 'Shop and checkout without connectivity|Automatic sync when back online|Production PWA on Render' },
  { look_id: 'server-driven-ui', service_id: 'custom-software', title: 'Smart Admin Platform', category: 'professional-services', folder: 'sdui', cover_file: 'cover.jpg', client_industry: 'Enterprise', outcome: 'Update pages without redeploying', live_url: '', is_locked: 'yes', public_description: 'JSON-driven admin platform — pages and forms from schema, role-based access. Enterprise client — no public demo.', highlights: 'JSON-driven pages and forms|Role-based access from one schema|Live studio for schema inspection' },
  { look_id: 'frontend-plugin-platform', service_id: 'custom-software', title: 'Plugin Marketplace Platform', category: 'local-business', folder: 'fpp', cover_file: 'cover.jpg', client_industry: 'SaaS', outcome: 'Add features without rebuilding the core product', live_url: '', is_locked: 'yes', public_description: 'VS Code-style plugin host with fault isolation and E2E tests. SaaS client requested confidential delivery only.', highlights: 'VS Code-style plugin marketplace|Fault isolation per plugin|Production host with E2E tests' },
];

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(readme), 'README');
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(site), 'Site');
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(hero), 'Hero');
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(portfolio), 'Portfolio');
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(transformations), 'Transformations');
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(packages), 'Packages');
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(faq), 'FAQ');
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(testimonials), 'Testimonials');
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(team), 'Team');
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(social), 'Social');
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(seo), 'SEO');
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(blog), 'Blog');
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(roadmap), 'Roadmap');
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(servicesHub), 'Services');
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(serviceBlocks), 'ServiceBlocks');
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(servicePackages), 'ServicePackages');
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(templates), 'Templates');
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(useCases), 'UseCases');

XLSX.writeFile(wb, excelPath);
console.log('✓ Created site-data.xlsx');
console.log('  Run: npm run sync');
