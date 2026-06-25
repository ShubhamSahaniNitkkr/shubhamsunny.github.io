import site from '../data/site.json';
import social from '../data/social.json';
import testimonials from '../data/testimonials.json';
import faq from '../data/faq.json';
import packages from '../data/packages.json';
import models from '../data/models.json';

interface SchemaProps {
  type?: 'home' | 'service';
  serviceName?: string;
  serviceDescription?: string;
  pageUrl?: string;
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

export function getProfessionalServiceSchema() {
  const sameAs = [social.linkedin.url, social.fiverr.url, social.github.url].filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': ['ProfessionalService', 'LocalBusiness'],
    '@id': `${site.domain}/#business`,
    name: site.brand,
    description: site.tagline,
    url: site.domain,
    telephone: site.phone,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: social.googleReviews.rating,
      reviewCount: social.googleReviews.totalReviews,
    },
    priceRange: '$$',
    image: mediaUrl(site.seo?.ogImage || '/media/team/shubham.jpg'),
    sameAs,
    areaServed: { '@type': 'Country', name: 'United States' },
    knowsAbout: [
      'Website Modernization',
      'Small Business Website Design',
      'Mobile-First Web Design',
      'Website Redesign',
      'SEO Basics',
    ],
  };
}

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.domain}/#website`,
    name: site.brand,
    url: site.domain,
    description: site.seo?.description || site.tagline,
    publisher: { '@id': `${site.domain}/#business` },
    inLanguage: 'en-US',
  };
}

export function getPersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Shubham Sunny',
    jobTitle: 'Website Modernization Expert',
    worksFor: { '@id': `${site.domain}/#business` },
    url: site.domain,
    sameAs: [social.linkedin.url],
    knowsAbout: ['Website Design', 'Web Development', 'Mobile-First Design'],
  };
}

export function getFAQSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function getReviewSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${site.brand} - Website Modernization Services`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: site.stats.googleRating,
      reviewCount: social.googleReviews.totalReviews,
    },
    review: testimonials.slice(0, 5).map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.name },
      reviewRating: { '@type': 'Rating', ratingValue: r.rating },
      reviewBody: r.text,
    })),
  };
}

export function getServiceListSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Website Packages',
    itemListElement: packages.map((pkg, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: pkg.name,
        description: pkg.description,
        offers: {
          '@type': 'Offer',
          price: pkg.price,
          priceCurrency: 'USD',
        },
        provider: { '@id': `${site.domain}/#business` },
      },
    })),
  };
}

export function getServiceSchema(serviceName: string, description: string, pageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description,
    provider: { '@type': 'ProfessionalService', name: site.brand, url: site.domain },
    areaServed: { '@type': 'Country', name: 'United States' },
    url: absoluteUrl(pageUrl),
  };
}

export function getBreadcrumbSchema(serviceName: string, pageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.domain },
      { '@type': 'ListItem', position: 2, name: serviceName, item: absoluteUrl(pageUrl) },
    ],
  };
}

export function getAllSchemas(props: SchemaProps = {}) {
  const schemas: object[] = [
    getWebSiteSchema(),
    getProfessionalServiceSchema(),
    getPersonSchema(),
    getFAQSchema(),
    getReviewSchema(),
    getServiceListSchema(),
  ];
  if (props.type === 'service' && props.serviceName) {
    schemas.push(
      getServiceSchema(props.serviceName, props.serviceDescription || '', props.pageUrl || ''),
      getBreadcrumbSchema(props.serviceName, props.pageUrl || ''),
    );
  }
  return schemas;
}
