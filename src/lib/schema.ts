import site from '../data/site.json';
import social from '../data/social.json';
import testimonials from '../data/testimonials.json';
import faq from '../data/faq.json';
import packages from '../data/packages.json';

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

function fiverrReviews() {
  return social.fiverrReviews || social.googleReviews;
}

function fiverrRating() {
  return site.stats.fiverrRating ?? site.stats.googleRating ?? fiverrReviews()?.rating;
}

function realSocialUrls() {
  const placeholders = new Set([
    'https://twitter.com/',
    'https://facebook.com/',
    'https://instagram.com/',
  ]);
  return [
    social.linkedin.url,
    social.fiverr.url,
    social.github.url,
    social.twitter?.url,
    social.facebook?.url,
    social.instagram?.url,
  ].filter((url) => url && !placeholders.has(url));
}

export function getProfessionalServiceSchema() {
  const reviews = fiverrReviews();
  return {
    '@context': 'https://schema.org',
    '@type': ['ProfessionalService', 'LocalBusiness'],
    '@id': `${site.domain}/#business`,
    name: site.brand,
    description: site.bioLong || site.tagline,
    url: site.domain,
    telephone: site.phone,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      description: site.address || site.location,
    },
    ...(reviews?.rating
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: reviews.rating,
            reviewCount: reviews.totalReviews,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    priceRange: '$$',
    image: mediaUrl(site.seo?.ogImage || '/media/team/shubham.jpg'),
    sameAs: realSocialUrls(),
    areaServed: [
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'India' },
    ],
    knowsAbout: site.expertise || [
      'Website Modernization',
      'Data Scraping',
      'Custom Software Development',
      'Mobile App Development',
      'Chrome Extensions',
      'Telegram Bots',
      'WhatsApp Bots',
    ],
  };
}

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.domain}/#website`,
    name: site.brand,
    alternateName: 'Shubham Sunny Website Modernization',
    url: site.domain,
    description: site.seo?.description || site.tagline,
    publisher: { '@id': `${site.domain}/#business` },
    inLanguage: 'en-US',
    about: {
      '@type': 'Thing',
      name: 'Website modernization for US small businesses',
    },
  };
}

export function getPersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.brand,
    jobTitle: site.headline || 'Full-Stack Developer',
    worksFor: { '@id': `${site.domain}/#business` },
    url: site.domain,
    sameAs: realSocialUrls(),
    knowsAbout: site.expertise || ['Website Design', 'Web Development', 'Data Scraping', 'Mobile Apps'],
    description: site.bioShort || site.tagline,
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
  const reviews = fiverrReviews();
  const rating = fiverrRating();
  if (!rating || !reviews?.totalReviews) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${site.brand} — Website Modernization (Fiverr reviews)`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating,
      reviewCount: reviews.totalReviews,
      bestRating: 5,
      worstRating: 1,
    },
    review: testimonials.slice(0, 5).map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.name },
      reviewRating: { '@type': 'Rating', ratingValue: r.rating },
      reviewBody: r.text,
      publisher: { '@type': 'Organization', name: 'Fiverr' },
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
  const reviewSchema = getReviewSchema();
  const schemas: object[] = [
    getWebSiteSchema(),
    getProfessionalServiceSchema(),
    getPersonSchema(),
    getFAQSchema(),
    getServiceListSchema(),
  ];
  if (reviewSchema) schemas.push(reviewSchema);
  if (props.type === 'service' && props.serviceName) {
    schemas.push(
      getServiceSchema(props.serviceName, props.serviceDescription || '', props.pageUrl || ''),
      getBreadcrumbSchema(props.serviceName, props.pageUrl || ''),
    );
  }
  return schemas;
}
