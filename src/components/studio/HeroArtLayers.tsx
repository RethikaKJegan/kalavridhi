import DecorativeAsset from "./DecorativeAsset";
import "./hero-reference.css";

/** Approved-reference decorative collage only; website text and controls remain separate. */
export default function HeroArtLayers() {
  return <div className="kv-hero-media kv-layered-hero kv-reference-hero" aria-hidden="true">
    <DecorativeAsset name="hero-reference-collage-v3" className="kv-reference-collage" eager/>
  </div>;
}
