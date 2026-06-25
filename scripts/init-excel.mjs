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
  ['Sheets: Site | Hero | Portfolio | Transformations | Packages | FAQ | Testimonials | Team | Social | SEO | Blog | Roadmap'],
];

const site = [
  { field: 'brand', value: 'Shubham Sunny' },
  { field: 'tagline', value: 'Website Modernization for US Businesses' },
  { field: 'phone', value: '+91 97718 23804' },
  { field: 'whatsapp', value: '919771823804' },
  { field: 'email', value: 'shubhamsahaninitkkr@gmail.com' },
  { field: 'address', value: 'Remote · Serving US & Global Clients' },
  { field: 'location', value: 'Remote · US Time Zones Welcome' },
  { field: 'domain', value: 'https://shubhamsunny.com' },
  { field: 'happy_clients', value: '40' },
  { field: 'projects_delivered', value: '50' },
  { field: 'years_experience', value: '8' },
  { field: 'google_rating', value: '4.9' },
  { field: 'certifications', value: 'NIT Kurukshetra · 8+ Years Experience' },
  { field: 'logo', value: '/media/logo.svg' },
  { field: 'logo_alt', value: 'Shubham Sunny — Website Modernization' },
  { field: 'hero_overline', value: 'Website Modernization Expert' },
  { field: 'hero_title_line1', value: 'Your website should' },
  { field: 'hero_title_line2', value: 'win customers, not lose them' },
  { field: 'intro', value: 'I redesign outdated business websites so they look professional, work perfectly on phones, and make it easy for customers to contact you. No tech jargon — just clear results.' },
  { field: 'hero_services', value: 'Website Redesign | Mobile-First | Speed & SEO | WhatsApp Integration' },
  { field: 'hero_badge', value: '8+ Years · 50+ Projects' },
  { field: 'artist_philosophy', value: 'A website should make a stranger feel confident enough to call you.' },
  { field: 'rotation_interval_ms', value: '4500' },
  { field: 'cache_version', value: '1.0.0' },
  { field: 'seo_title', value: 'Shubham Sunny | Website Modernization for US Businesses' },
  { field: 'seo_description', value: 'I modernize outdated business websites for US owners. Mobile-friendly, fast, trustworthy. 8+ years, 50+ projects. Free WhatsApp consult.' },
  { field: 'seo_keywords', value: 'website modernization, small business website redesign, outdated website makeover, US web developer, mobile friendly website' },
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
    before_file: 'before.svg',
    after_file: 'after.svg',
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
    before_file: 'before.svg',
    after_file: 'after.svg',
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
    before_file: 'before.svg',
    after_file: 'after.svg',
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
  { question: 'Do I need to know anything technical?', answer: 'No. I handle everything and explain each step in plain English. You focus on your business — I handle the website.' },
  { question: 'How long does a website redesign take?', answer: 'Most projects take 2–4 weeks depending on scope. I give you a clear timeline before we start.' },
  { question: 'Will my site work on phones?', answer: 'Yes — every site I build is mobile-first. Most of your customers will visit on their phone, so this is non-negotiable.' },
  { question: 'Do you work with US time zones?', answer: 'Absolutely. I schedule calls and updates around your timezone and keep communication simple via WhatsApp or email.' },
  { question: 'What if I already have a website?', answer: 'Perfect — that is exactly what I modernize. I take your outdated site and transform it into something you are proud to share.' },
  { question: 'How do we get started?', answer: 'Message me on WhatsApp for a free website review. I will look at your current site and suggest the best path forward — no pressure.' },
  { question: 'What happens after launch?', answer: 'I make sure everything works before handoff. You get a site that is fast, mobile-ready, and easy for customers to contact you.' },
  { question: 'Can you add WhatsApp chat to my site?', answer: 'Yes. One-click WhatsApp contact is included in all packages — customers can reach you instantly from any page.' },
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
    certification: 'NIT Kurukshetra · 8+ Years',
    bio: 'I have spent 8 years helping businesses look professional online — from global platforms like Fiverr to direct client work across the US, UK, Canada, and beyond. I focus on website modernization: taking outdated sites and turning them into something you are proud to share. Fast on mobile, easy to contact you, and built to earn trust.',
    philosophy: 'A website should make a stranger feel confident enough to call you.',
    image_path: 'shubham.jpg',
    is_founder: 'yes',
    linkedin: 'https://www.linkedin.com/in/shubham-sunny-09b013129/',
  },
];

const social = [
  { field: 'linkedin_url', value: 'https://www.linkedin.com/in/shubham-sunny-09b013129/' },
  { field: 'linkedin_handle', value: 'Shubham Sunny' },
  { field: 'fiverr_url', value: 'https://www.fiverr.com/shubhamsunny?public_mode=true' },
  { field: 'github_url', value: 'https://github.com/ShubhamSahaniNitkkr' },
  { field: 'google_reviews_url', value: 'https://www.fiverr.com/shubhamsunny?public_mode=true' },
  { field: 'google_rating', value: '4.9' },
  { field: 'google_total_reviews', value: '15' },
];

const seo = [
  { slug: 'website-redesign-small-business', title: 'Small Business Website Redesign | Shubham Sunny', h1: 'Small Business Website Redesign', description: 'I redesign outdated small business websites for US owners. Mobile-friendly, fast, and built to convert visitors into customers.', keywords: 'small business website redesign, website makeover small business', gallery_category: 'local-business', featured_package_id: 'business-modern' },
  { slug: 'modernize-outdated-website', title: 'Modernize Your Outdated Website | Shubham Sunny', h1: 'Modernize Your Outdated Website', description: 'Turn your old website into a modern, trustworthy online presence. Plain English process, US timezone friendly.', keywords: 'modernize outdated website, old website redesign', gallery_category: 'all', featured_package_id: 'business-modern' },
  { slug: 'website-design-for-dentists', title: 'Website Design for Dentists | Shubham Sunny', h1: 'Website Design for Dentists', description: 'Professional dental website design that builds patient trust. Mobile-first, easy booking, clear contact options.', keywords: 'dental website design, dentist website redesign', gallery_category: 'healthcare', featured_package_id: 'growth-site' },
  { slug: 'restaurant-website-redesign', title: 'Restaurant Website Redesign | Shubham Sunny', h1: 'Restaurant Website Redesign', description: 'Modern restaurant websites with menus, hours, and click-to-call. Help hungry customers find and contact you.', keywords: 'restaurant website redesign, food business website', gallery_category: 'restaurant', featured_package_id: 'starter-refresh' },
  { slug: 'professional-services-website', title: 'Professional Services Website | Shubham Sunny', h1: 'Websites for Professional Services', description: 'Premium websites for lawyers, consultants, and service businesses. Look credible, get more inquiries.', keywords: 'professional services website, law firm website design', gallery_category: 'professional-services', featured_package_id: 'growth-site' },
];

const blog = [
  { slug: 'signs-your-website-is-costing-customers', title: '5 Signs Your Website Is Costing You Customers', excerpt: 'If your site looks outdated on mobile or takes forever to load, you are losing business every day. Here is what to watch for.', status: 'published', publish_date: '2026-06-01' },
  { slug: 'what-mobile-friendly-means', title: 'What Mobile-Friendly Actually Means (Plain English)', excerpt: 'No jargon — just what mobile-friendly means for your business and why it matters for US customers.', status: 'published', publish_date: '2026-06-10' },
  { slug: 'how-long-website-redesign-takes', title: 'How Long Does a Website Redesign Take?', excerpt: 'A realistic timeline for small business website projects — from first call to launch.', status: 'published', publish_date: '2026-06-15' },
];

const roadmap = [
  { id: 'website-modernization', name: 'Website Modernization', status: 'available', description: 'Transform your outdated website into a modern, mobile-friendly site that builds trust.', eta: 'Now' },
  { id: 'ai-chatbot', name: 'AI Website Chatbot', status: 'coming_soon', description: 'Answers visitor questions 24/7 on your website — so you never miss a lead.', eta: 'Q3 2026' },
  { id: 'lead-generation', name: 'Lead Generation Tools', status: 'planned', description: 'Capture visitor details and follow up automatically — grow your pipeline.', eta: '2026' },
  { id: 'offline-doc-chat', name: 'Private Document Chat', status: 'planned', description: 'Chat with your business documents securely — for teams that need answers fast.', eta: '2026' },
];

const portfolio = [
  { look_id: 'massive-data-explorer', title: 'High-Performance Business Dashboard', category: 'professional-services', folder: 'massive-data-explorer', cover_file: '', client_industry: 'Data & Analytics', outcome: 'Handles 1M+ records with instant search and smooth scrolling', live_url: 'https://mde-web.onrender.com', highlights: 'Full-stack data explorer over 1M records|Server-side search, filter, and sort|Production deploy with comprehensive test coverage' },
  { look_id: 'offline-first-task-management', title: 'Offline-First Business App', category: 'ecommerce', folder: 'offline-first', cover_file: '', client_industry: 'Retail', outcome: 'Works without internet — orders sync when back online', live_url: 'https://offline-first-task-management-app-ui.onrender.com', highlights: 'Shop and checkout without connectivity|Automatic sync when back online|Production PWA deployed on Render' },
  { look_id: 'server-driven-ui', title: 'Smart Admin Platform', category: 'professional-services', folder: 'sdui', cover_file: '', client_industry: 'Enterprise', outcome: 'Update pages without redeploying — saves weeks of dev time', live_url: 'https://sdui-pypy.onrender.com', highlights: 'JSON-driven pages and forms|Role-based access from one schema|Live studio for schema inspection' },
  { look_id: 'frontend-plugin-platform', title: 'Plugin Marketplace Platform', category: 'local-business', folder: 'fpp', cover_file: '', client_industry: 'SaaS', outcome: 'Add features without rebuilding the core product', live_url: 'https://fpp-host.onrender.com', highlights: 'VS Code-style plugin marketplace|Fault isolation per plugin|Production host with E2E tests' },
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

XLSX.writeFile(wb, excelPath);
console.log('✓ Created site-data.xlsx');
console.log('  Run: npm run sync');
