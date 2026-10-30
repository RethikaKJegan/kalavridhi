import StudioPage from "@/components/studio/StudioPage";
import { getArtworks, getSettings, getWorkshops } from "@/lib/server-data";
import { buildStructuredData, serializeStructuredData } from "@/lib/structured-data";

export const dynamic = "force-dynamic";

export default function Home() {
  const artworks = getArtworks();
  const workshops = getWorkshops();
  const settings = getSettings();
  const structuredData = serializeStructuredData(buildStructuredData(settings, workshops));
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
    <StudioPage artworks={artworks} workshops={workshops} settings={settings} />
  </>;
}
