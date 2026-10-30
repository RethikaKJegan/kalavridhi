import { MetadataRoute } from "next";
import { getCanonicalSiteUrl } from "@/lib/structured-data";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${getCanonicalSiteUrl()}/sitemap.xml`,
  };
}
