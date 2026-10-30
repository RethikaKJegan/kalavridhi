import type { SiteSettings, Workshop } from "./server-data";

const defaultSiteUrl = "https://kalavridhi-arts.com";

export function getCanonicalSiteUrl() {
  const candidate = process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl;
  try {
    const url = new URL(candidate);
    if (url.protocol !== "https:" && process.env.NODE_ENV === "production") return defaultSiteUrl;
    if (url.hostname.includes("_")) return defaultSiteUrl;
    return url.origin;
  } catch {
    return defaultSiteUrl;
  }
}

export function buildStructuredData(settings: SiteSettings, workshops: Workshop[]) {
  const siteUrl = getCanonicalSiteUrl();
  const now = Date.now();
  const events = workshops.flatMap(workshop => {
    if (workshop.status !== "published" || !workshop.startAt) return [];
    const startDate = new Date(workshop.startAt);
    if (!Number.isFinite(startDate.getTime()) || startDate.getTime() < now) return [];
    const endDate = workshop.endAt ? new Date(workshop.endAt) : undefined;
    return [{
      "@type": "Event",
      name: workshop.title,
      description: workshop.description,
      startDate: startDate.toISOString(),
      ...(endDate && Number.isFinite(endDate.getTime()) && endDate >= startDate ? { endDate: endDate.toISOString() } : {}),
      eventStatus: "https://schema.org/EventScheduled",
      organizer: { "@type": "Person", name: settings.founderName },
      ...(workshop.location ? { location: { "@type": "Place", name: workshop.location } } : {}),
      url: siteUrl,
    }];
  });

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "VisualArtist",
        "@id": `${siteUrl}/#nishkala-krishna`,
        name: settings.founderName,
        alternateName: "T. Nishkala Krishna",
        brand: { "@type": "Brand", name: settings.siteName },
        jobTitle: settings.founderTitle,
        knowsAbout: ["Mandala art", "Madhubani art", "Kerala mural painting", "Tanjore fabric painting", "Zendoodle art", "Fabric painting"],
        hasCredential: settings.qualifications.map(name => ({ "@type": "EducationalOccupationalCredential", name })),
        sameAs: [settings.instagram],
      },
      {
        "@type": "EducationalOrganization",
        "@id": `${siteUrl}/#organization`,
        name: settings.siteName,
        slogan: settings.tagline,
        telephone: `+${settings.whatsapp.replace(/\D/g, "")}`,
        url: siteUrl,
        sameAs: [settings.instagram],
      },
      ...events,
    ],
  };
}

export function serializeStructuredData(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
