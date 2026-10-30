import StudioPage from "@/components/studio/StudioPage";
import { getArtworks, getSettings, getWorkshops } from "@/lib/server-data";

export const dynamic = "force-dynamic";

export default function Home() {
  return <StudioPage artworks={getArtworks()} workshops={getWorkshops()} settings={getSettings()} />;
}
