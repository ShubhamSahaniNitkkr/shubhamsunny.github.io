export interface SiteConfig {
  brand: string;
  tagline: string;
  headline: string;
  bioShort: string;
  bioLong: string;
  expertise: string[];
  location: string;
  phone: string;
  email: string;
  address: string;
  domain: string;
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogImage: string;
  };
  stats: {
    yearsExperience: number;
    companies: number;
    flagshipProjects: number;
  };
}

export interface LegalPage {
  slug: string;
  title: string;
  shortTitle: string;
  lastUpdated: string;
  summary?: string;
  sections: { heading: string; paragraphs: string[] }[];
}
