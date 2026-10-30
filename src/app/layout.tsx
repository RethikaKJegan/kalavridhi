import type { Metadata } from "next";
import "./globals.css";
import ScrollRevealInit from "@/hooks/useScrollReveal";

export const metadata: Metadata = {
  metadataBase: new URL("https://kalavridhi-arts.com"),
  title: "Kalavridhi Arts | Art Classes & Creative Workshops",
  description:
    "Explore traditional and contemporary art classes, original artworks and creative workshops with Nishkala Krishna at Kalavridhi Arts. Grow Your Dream.",
  keywords: "art classes, Kalavridhi, Nishkala Krishna, Mandala, Kerala Mural, Madhubani, Tanjore, Zendoodle, fabric painting, workshops",
  openGraph: {
    title: "Kalavridhi Arts | Art Classes & Creative Workshops",
    description: "Traditional and contemporary art classes led by Nishkala Krishna — 20 years of artistic experience.",
    url: "https://kalavridhi-arts.com",
    siteName: "Kalavridhi Arts",
    images: [{ url: "/images/artwork/tanjore-fabric-painting.jpeg", width: 1200, height: 630, alt: "Tanjore Fabric Painting by Nishkala Krishna" }],
    locale: "en_IN",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://kalavridhi-arts.com" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <ScrollRevealInit />
      </body>
    </html>
  );
}
