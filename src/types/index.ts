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
  videoUrl?: string;
  youtubeId?: string;
  sourceUrl?: string;
  featured?: boolean;
}

export interface TeamMember {
  name: string;
  role: string;
  certification?: string;
  pastCompany?: string;
  expertise?: string[];
  bio: string;
  philosophy?: string;
  image: string;
  linkedin?: string;
  phone?: string;
  isFounder?: boolean;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface SiteConfig {
  brand: string;
  tagline: string;
  headline?: string;
  bioShort?: string;
  bioLong?: string;
  expertise?: string[];
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
    fiverrRating?: number;
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
  twitter?: { url: string };
  facebook?: { url: string };
  instagram?: { url: string };
  fiverr: { url: string };
  github: { url: string };
  fiverrReviews: { url: string; rating: number; totalReviews: number };
  /** @deprecated use fiverrReviews */
  googleReviews?: { url: string; rating: number; totalReviews: number };
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
  serviceId?: string;
  isLocked?: boolean;
  publicDescription?: string;
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
  category?: string;
  readTime?: string;
  author?: string;
  image?: string;
  sections?: { heading: string; paragraphs: string[] }[];
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

export interface ServicePackage {
  id: string;
  serviceId: string;
  name: string;
  price: number;
  priceLabel?: string;
  includes: string[];
  description?: string;
  mostPopular?: boolean;
  startingFrom?: boolean;
  emoji?: string;
}

export interface ServiceHubItem {
  id: string;
  name: string;
  color: string;
  tagline: string;
  description: string;
  order: number;
  cardImage?: string;
  processImages?: string[];
}

export interface ServiceBlock {
  serviceId: string;
  blockType: string;
  title: string;
  body: string;
  order: number;
  icon?: string;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  downloadUrl: string;
  description: string;
}

export interface DataArchiveEntry {
  id: string;
  name: string;
  keywords: string[];
  url: string;
  description: string;
}

export interface VideoItem {
  id: string;
  serviceId: string;
  title: string;
  youtubeId: string;
  thumbnail: string;
}

export interface UseCasePainPoint {
  icon: string;
  label: string;
}

export interface UseCaseHighlight {
  label: string;
  value: string;
}

export interface UseCaseTimeline {
  phase: string;
  duration: string;
  detail: string;
}

export interface UseCaseOutcome {
  label: string;
  value: string;
  detail?: string;
}

export interface UseCaseQuote {
  text: string;
  author: string;
  role: string;
}

export interface UseCase {
  id: string;
  title: string;
  pdfUrl: string;
  thumbnail: string;
  category: string;
  cardTeaser?: string;
  client?: string;
  summary?: string;
  challenge?: string;
  solution?: string;
  results?: string;
  metric?: string;
  image?: string;
  duration?: string;
  teamSize?: string;
  context?: string[];
  challengeParagraphs?: string[];
  solutionParagraphs?: string[];
  resultsParagraphs?: string[];
  painPoints?: UseCasePainPoint[];
  highlights?: UseCaseHighlight[];
  timeline?: UseCaseTimeline[];
  approach?: string[];
  techStack?: string[];
  outcomes?: UseCaseOutcome[];
  quote?: UseCaseQuote;
  serviceId?: string;
  deepSections?: { title: string; paragraphs: string[] }[];
}

export interface AboutConfig {
  headline: string;
  bioShort: string;
  bioLong: string;
  expertise: string[];
  portrait: string;
  portraitAlt: string;
}
