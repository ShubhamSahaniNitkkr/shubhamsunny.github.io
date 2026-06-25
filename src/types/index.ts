export interface MediaRotationItem {
  type: 'image' | 'video';
  src: string;
  alt?: string;
  poster?: string;
}

export interface Transformation {
  id: string;
  clientName: string;
  industry: string;
  before: string;
  after: string;
  beforeType?: 'image' | 'video';
  afterType?: 'image' | 'video';
  story: string;
  packageUsed: string;
}

export interface Package {
  id: string;
  name: string;
  price: number;
  priceLabel?: string;
  mostPopular?: boolean;
  startingFrom?: boolean;
  includes: string[];
  description?: string;
}

export interface Testimonial {
  id: string;
  type: 'text' | 'google' | 'video';
  name: string;
  rating: number;
  text: string;
  country?: string;
  projectType?: string;
  date?: string;
  image?: string;
  sourceUrl?: string;
  featured?: boolean;
}

export interface TeamMember {
  name: string;
  role: string;
  certification?: string;
  bio: string;
  philosophy?: string;
  image: string;
  linkedin?: string;
  isFounder?: boolean;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface SiteConfig {
  brand: string;
  tagline: string;
  location: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  domain: string;
  seo?: {
    title: string;
    description: string;
    keywords: string;
    ogImage: string;
  };
  stats: {
    happyClients: number;
    projectsDelivered: number;
    yearsExperience: number;
    googleRating: number;
  };
  certifications: string[];
  whatsappMessages: {
    consultation: string;
    package: string;
    general: string;
    payment: string;
  };
  emailMessages?: {
    consultation: string;
    package: string;
    general: string;
    payment: string;
  };
}

export interface NotificationsConfig {
  notifyOnVisit: boolean;
  chatbotEnabled: boolean;
  web3formsAccessKey?: string;
}

export interface SocialConfig {
  linkedin: { handle: string; url: string };
  fiverr: { url: string };
  github: { url: string };
  googleReviews: { url: string; rating: number; totalReviews: number };
}

export interface ClientProject {
  id: string;
  title: string;
  category: string;
  cover: string | null;
  clientIndustry: string;
  outcome: string;
  liveUrl?: string;
  highlights: string[];
  bento?: string;
}

export interface SeoPageConfig {
  slug: string;
  title: string;
  h1: string;
  description: string;
  keywords: string;
  galleryCategory: string;
  featuredPackageId: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  status: string;
  publishDate: string;
}

export interface RoadmapItem {
  id: string;
  name: string;
  status: string;
  description: string;
  eta: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  slug: string;
}
