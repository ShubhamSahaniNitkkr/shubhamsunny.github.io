/** Tech logos via Iconify (Simple Icons) */
const ICONIFY = 'https://api.iconify.design/simple-icons';

type LogoDef = { slug: string; color: string };

const LOGOS: Record<string, LogoDef> = {
  HTML5: { slug: 'html5', color: 'E34F26' },
  CSS3: { slug: 'css3', color: '1572B6' },
  'JavaScript (ES6+)': { slug: 'javascript', color: 'F7DF1E' },
  TypeScript: { slug: 'typescript', color: '3178C6' },
  React: { slug: 'react', color: '61DAFB' },
  'Next.js': { slug: 'nextdotjs', color: '000000' },
  Redux: { slug: 'redux', color: '764ABC' },
  'TanStack Query': { slug: 'reactquery', color: 'FF4154' },
  'Tailwind CSS': { slug: 'tailwindcss', color: '06B6D4' },
  'Ant Design': { slug: 'antdesign', color: '0170FE' },
  'Material UI': { slug: 'mui', color: '007FFF' },
  'Node.js': { slug: 'nodedotjs', color: '5FA04E' },
  'Express.js': { slug: 'express', color: '000000' },
  GraphQL: { slug: 'graphql', color: 'E10098' },
  WebSockets: { slug: 'socketdotio', color: '010101' },
  JWT: { slug: 'jsonwebtokens', color: '000000' },
  'OAuth 2.0': { slug: 'auth0', color: 'EB5424' },
  'OpenAI APIs': { slug: 'openai', color: '412991' },
  LangChain: { slug: 'langchain', color: '1C3C3C' },
  LangGraph: { slug: 'langchain', color: '1C3C3C' },
  MongoDB: { slug: 'mongodb', color: '47A248' },
  PostgreSQL: { slug: 'postgresql', color: '4169E1' },
  Firebase: { slug: 'firebase', color: 'FFCA28' },
  Supabase: { slug: 'supabase', color: '3FCF8E' },
  AWS: { slug: 'amazonaws', color: 'FF9900' },
  Vercel: { slug: 'vercel', color: '000000' },
  Netlify: { slug: 'netlify', color: '00C7B7' },
  Git: { slug: 'git', color: 'F05032' },
  GitHub: { slug: 'github', color: '181717' },
  'GitHub Actions': { slug: 'githubactions', color: '2088FF' },
  Docker: { slug: 'docker', color: '2496ED' },
  Kubernetes: { slug: 'kubernetes', color: '326CE5' },
  Vite: { slug: 'vite', color: '646CFF' },
  Webpack: { slug: 'webpack', color: '8DD6F9' },
  Postman: { slug: 'postman', color: 'FF6C37' },
  npm: { slug: 'npm', color: 'CB3837' },
  Vitest: { slug: 'vitest', color: '6E9F18' },
  Zod: { slug: 'zod', color: '3E67B1' },
  Playwright: { slug: 'playwright', color: '2EAD33' },
};

export function getTechLogo(name: string): { src: string; alt: string } | null {
  const def = LOGOS[name];
  if (!def) return null;
  return {
    src: `${ICONIFY}:${def.slug}.svg?color=%23${def.color}`,
    alt: `${name} logo`,
  };
}
