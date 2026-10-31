# Hero right-side correction

Only the hero's right-side decorative composition was changed. Left content, header, other sections, CMS, forms, gallery and workshop controls were not edited in this pass. Local only; no deployment.

## Reference gaps addressed

The previous separately generated ornaments differed from the approved reference: narrow/tall turban, different earring/profile, isolated standing peacock, sparse repeated flowers, missing temple architecture and Kerala mask. The new transparent collage includes these reference motifs and their overlapping arrangement.

Built-in ImageGen performed reference-guided background extraction from `codex-clipboard-066625a9-a114-43c1-9a08-148bc6c4913c.png`. This is a generated extraction, not a claim of pixel-identical recovery. Fine details can differ. It is decorative reference material, not an original Nishkala painting or a portrait of her. No website text, logo, navigation or controls are in the asset.

## Files

- `src/components/studio/HeroArtLayers.tsx`: replace the separate ornamental substitutes with the approved-reference composition.
- `src/components/studio/hero-reference.css`: styles scoped to this right-side artwork only, with mobile image containment.
- `public/images/decoration/hero-reference-collage-v3.webp`: 1484×1060, alpha, 776402 bytes.
- `public/images/decoration/hero-reference-collage-v3-small.webp`: 750×536, alpha, 243992 bytes.
- `scripts/prepare-hero-reference.mjs`: asset optimization; generated original preserved.

Original generated output: `C:/Users/JKRFamily/.codex/generated_images/01a1906e-1d9e-7103-b3c3-d82c7a457e60/exec-59951cb9-3e95-40e1-a096-54086b711fbf.png`.

## Final ImageGen prompt

BACKGROUND EXTRACTION / COMPOSITION PRESERVATION edit. The supplied image is an approved website reference. Extract ONLY the complete ornamental art collage occupying the RIGHT HAND SIDE (roughly x=740 to right edge, y=90 to bottom edge). Output that collage alone on genuine alpha transparency, tightly framed, with NO website text, NO header, NO logo, NO navigation, NO buttons, NO UI. Preserve the exact existing illustrated woman's face, angular broad fan shaped patterned turban, all the intricate black and white Zendoodle bands, circular earring, peacock with curved neck and eye-feather tail, pink lotus flowers, green leaves, gold mandala, coral circular print, architectural temple ink drawings and the colorful Kerala mask at far right. Keep the exact overlapping placement and relative proportions of all these objects as in the supplied image. Do not redesign or reimagine the woman; do not substitute a different turban or earring. Do not simplify patterns. Keep painterly paper and watercolor detail. Remove cream canvas around the silhouette while preserving pale watercolor feathered edge accents and gold flecks. The art is cropped naturally at right and bottom just like original reference. No new elements, no signatures, no typography. Output decorative extracted collage only, landscape aspect about 1.4:1.

## Verification

Local homepage and both image URLs return HTTP 200. Rendered HTML contains the new collage and no longer contains the old individual profile layer. TypeScript and scoped ESLint checked. Browser screenshot inspection was attempted but tooling reports `Local browser use is disabled in Work settings`; therefore final on-page crop, desktop/mobile visual comparison and interaction checks are not claimed verified. The generated asset itself was inspected visually.

This pass prioritizes the user's explicit request to preserve the right-hand composition. Internal motifs are part of one decorative art layer; no new independent motif animation or WebGL was introduced. Existing standalone assets remain available for a later motion pass.
