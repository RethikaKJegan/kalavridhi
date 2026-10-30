import StudioPage from "@/components/studio/StudioPage";
import { getArtworks, getSettings, getWorkshops } from "@/lib/server-data";
import { buildStructuredData, serializeStructuredData } from "@/lib/structured-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [artworks, workshops, settings] = await Promise.all([getArtworks(),getWorkshops(),getSettings()]);
  const structuredData = serializeStructuredData(buildStructuredData(settings, workshops));
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
    <StudioPage artworks={artworks} workshops={workshops} settings={settings} />
  </>;
}
