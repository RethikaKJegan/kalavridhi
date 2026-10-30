import { MetadataRoute } from "next";
import { getCanonicalSiteUrl } from "@/lib/structured-data";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: getCanonicalSiteUrl(), lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
}
