import site from '../data/site.json';
import social from '../data/social.json';

export type SchemaPageType = 'home' | 'page';

export interface SchemaProps {
  type?: SchemaPageType;
  pageUrl?: string;
  pageTitle?: string;
  pageDescription?: string;
}

function absoluteUrl(pathOrUrl: string) {
  const value = String(pathOrUrl || '').trim();
  if (!value) return site.domain;
  if (value.startsWith('http')) return value;
  return `${site.domain}${value.startsWith('/') ? value : `/${value}`}`;
}

function mediaUrl(src: string) {
  return src.startsWith('http') ? src : `${site.domain}${src}`;
}

export function getPersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${site.domain}/#person`,
    name: site.brand,
    jobTitle: 'Senior Software Developer',
    description: site.bioLong || site.tagline,
    url: site.domain,
    email: site.email,
    telephone: site.phone,
    image: mediaUrl(site.seo?.ogImage || '/media/team/shubham.jpg'),
    sameAs: [social.linkedin.url, social.github.url, social.npm?.url].filter(Boolean),
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'National Institute of Technology, Kurukshetra',
    },
    worksFor: {
      '@type': 'Organization',
      name: 'Yum! Brands',
    },
    knowsAbout: site.expertise,
  };
}

export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.domain}/#website`,
    name: `${site.brand} — Portfolio`,
    url: site.domain,
    description: site.seo?.description || site.tagline,
    publisher: { '@id': `${site.domain}/#person` },
  };
}

export function getWebPageSchema(props: SchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${absoluteUrl(props.pageUrl || '/')}/#webpage`,
    url: absoluteUrl(props.pageUrl || '/'),
    name: props.pageTitle || site.seo?.title,
    description: props.pageDescription || site.seo?.description,
    isPartOf: { '@id': `${site.domain}/#website` },
    about: { '@id': `${site.domain}/#person` },
  };
}

export function buildSchemaGraph(props: SchemaProps = {}) {
  const graph = [getPersonSchema(), getWebsiteSchema()];
  if (props.type === 'home' || props.type === 'page') {
    graph.push(getWebPageSchema(props));
  }
  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
