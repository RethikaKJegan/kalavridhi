"use client";

import DecorativeAsset from "./DecorativeAsset";
import LivingArtwork from "./LivingArtwork";
import "./hero-reference.css";

export default function HeroArtLayers() {
  return <div className="kv-hero-media kv-layered-hero kv-reference-hero kv-living-hero">
    <div aria-hidden="true"><DecorativeAsset name="hero-living-collage-v4" mobileName="hero-mobile-story-v1" className="kv-reference-collage" eager/></div>
    <LivingArtwork/>
  </div>;
}
