import { readRecords } from '@/lib/cms-local';

export interface Artwork {
  id: string; title: string; image: string; alt: string;
  medium?: string; artForm: string; category: string;
  description?: string; featured: boolean; published: boolean;
  sortOrder: number; consentStatus: string;
}

export interface Workshop {
  id: string; slug: string; title: string; description: string;
  coverImage?: string; startAt?: string; endAt?: string;
  timezone?: string; location?: string; targetAudience?: string;
  ageRange?: string; status: "draft"|"published"|"cancelled"|"completed";
  registrationOpen: boolean; featured: boolean;
  whatsappMessage?: string;
}

export interface SiteSettings {
  siteName: string; tagline: string; whatsapp: string; instagram: string;
  founderName: string; founderTitle: string; yearsExperience: string;
  shortBio: string; qualifications: string[];
  heroHeading: string; heroSubheading: string;
  contactEmail: string; enableEnquiryForm: boolean; metaDescription: string;
}

const defaultSettings: SiteSettings = {
  siteName: "Kalavridhi Arts",
  tagline: "Grow Your Dream",
  whatsapp: "918925626784",
  instagram: "https://www.instagram.com/kala_vridhi_arts/",
  founderName: "Nishkala Krishna",
  founderTitle: "Artist & Art Educator",
  yearsExperience: "20",
  shortBio: "For two decades, Nishkala Krishna has explored the expressive world of art, sharing traditional techniques and contemporary creativity through hands-on learning.",
  qualifications: ["BCA", "MSc Psychology", "Diploma in Fashion Designing", "Diploma in Fine Arts"],
  heroHeading: "Where Creativity Blooms.",
  heroSubheading: "Discover traditional and contemporary art through classes and workshops led by Nishkala Krishna.",
  contactEmail: "",
  enableEnquiryForm: true,
  metaDescription: "Explore traditional and contemporary art classes and workshops with Nishkala Krishna at Kalavridhi Arts.",
};

export async function getArtworks(): Promise<Artwork[]> {
  return (await readRecords<Artwork>('artworks'))
    .filter(a => a.published)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getAllArtworks(): Promise<Artwork[]> {
  return (await readRecords<Artwork>('artworks'))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getWorkshops(): Promise<Workshop[]> {
  return (await readRecords<Workshop>('workshops'))
    .filter(w => w.status === "published");
}

export async function getAllWorkshops(): Promise<Workshop[]> {
  return readRecords<Workshop>('workshops');
}

export async function getSettings(): Promise<SiteSettings> {
  return { ...defaultSettings, ...(await readRecords<Partial<SiteSettings>>('site-settings'))[0] };
}

export function waLink(whatsapp: string, msg: string) {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`;
}
