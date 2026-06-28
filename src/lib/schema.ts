import site from '../data/site.json';
import social from '../data/social.json';
import testimonials from '../data/testimonials.json';
import faq from '../data/faq.json';
import packages from '../data/packages.json';

export type SchemaPageType = 'home' | 'service' | 'blog' | 'blog-post' | 'page';

export interface BlogPostSchemaInput {
  slug: string;
  title: string;
  excerpt: string;
  publishDate: string;
  category?: string;
  author?: string;
  image?: string;
  sections?: { heading: string; paragraphs: string[] }[];
}

export interface SchemaProps {
  type?: SchemaPageType;
  serviceName?: string;
  serviceDescription?: string;
  pageUrl?: string;
  pageTitle?: string;
  pageDescription?: string;
  blogPost?: BlogPostSchemaInput;
  blogPosts?: BlogPostSchemaInput[];
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

export function getWebPageSchema(pageUrl: string, name: string, description: string) {
  const url = absoluteUrl(pageUrl);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { '@id': `${site.domain}/#website` },
    about: { '@id': `${site.domain}/#business` },
    inLanguage: 'en-US',
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
    provider: { '@id': `${site.domain}/#business` },
    areaServed: { '@type': 'Country', name: 'United States' },
    url: absoluteUrl(pageUrl),
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function getBlogPostingSchema(post: BlogPostSchemaInput, pageUrl: string) {
  const url = absoluteUrl(pageUrl);
  const image = post.image
    ? mediaUrl(post.image)
    : mediaUrl(site.seo?.ogImage || '/media/team/shubham.jpg');

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    image,
    datePublished: post.publishDate,
    dateModified: post.publishDate,
    author: {
      '@type': 'Person',
      name: post.author || site.brand,
      url: site.domain,
    },
    publisher: { '@id': `${site.domain}/#business` },
    mainEntityOfPage: { '@id': `${url}#webpage` },
    url,
    ...(post.category ? { articleSection: post.category } : {}),
    inLanguage: 'en-US',
    ...(post.sections?.length
      ? {
          articleBody: post.sections
            .flatMap((s) => [s.heading, ...(s.paragraphs || [])])
            .join('\n\n'),
        }
      : {}),
  };
}

export function getBlogCollectionSchema(posts: BlogPostSchemaInput[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${site.domain}/blog#collection`,
    name: `Blog | ${site.brand}`,
    description:
      'Plain-English insights on websites, data scraping, and custom software — from a developer who ships for real businesses.',
    url: `${site.domain}/blog`,
    isPartOf: { '@id': `${site.domain}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((post, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${site.domain}/blog/${post.slug}`,
        name: post.title,
      })),
    },
  };
}

export function getAllSchemas(props: SchemaProps = {}) {
  const type = props.type || 'page';
  const pageUrl = props.pageUrl || site.domain;
  const pageTitle = props.pageTitle || site.seo?.title || site.brand;
  const pageDescription = props.pageDescription || site.seo?.description || site.tagline;

  const schemas: object[] = [
    getWebSiteSchema(),
    getProfessionalServiceSchema(),
    getPersonSchema(),
    getWebPageSchema(pageUrl, pageTitle, pageDescription),
  ];

  if (type === 'home') {
    schemas.push(getFAQSchema(), getServiceListSchema());
    const reviewSchema = getReviewSchema();
    if (reviewSchema) schemas.push(reviewSchema);
  }

  if (type === 'service' && props.serviceName) {
    schemas.push(
      getServiceSchema(props.serviceName, props.serviceDescription || '', pageUrl),
      getBreadcrumbSchema([
        { name: 'Home', url: site.domain },
        { name: props.serviceName, url: pageUrl },
      ]),
    );
  }

  if (type === 'blog' && props.blogPosts?.length) {
    schemas.push(getBlogCollectionSchema(props.blogPosts));
    schemas.push(
      getBreadcrumbSchema([
        { name: 'Home', url: site.domain },
        { name: 'Blog', url: `${site.domain}/blog` },
      ]),
    );
  }

  if (type === 'blog-post' && props.blogPost) {
    schemas.push(getBlogPostingSchema(props.blogPost, pageUrl));
    schemas.push(
      getBreadcrumbSchema([
        { name: 'Home', url: site.domain },
        { name: 'Blog', url: `${site.domain}/blog` },
        { name: props.blogPost.title, url: pageUrl },
      ]),
    );
  }

  return schemas;
}
