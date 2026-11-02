# Living painting review — 2 November 2026

This change replaces the masked woman/peacock parallax with a continuous still composition and independent procedural 3D botanical elements. It does not claim completion of every phase of the older master specification.

## What changed

- Hero lotus: 23 curved petals morph from a bud into an open flower. After opening, the stem/head sway together. “Bloom again” replays the sequence; scrolling away pauses it rather than repeatedly restarting it.
- A green branch traces in, three leaves fill, and its upper leaf curls/lifts over a faint outline and shadow.
- A larger wood-grained brush has a metal ferrule, full bristles and a deforming tuft. It makes a brief painting gesture and rests in the hero. The old travelling BrushGuide is no longer mounted. The new brush is hidden below 768 px and on coarse pointers.
- Existing Motion gallery transitions remain. A CSS paper-corner lift appears with fine-pointer hover or keyboard focus. This is a corner effect, not a deformable 3D paper simulation.
- An open lotus appears in the footer. Mobile footer artwork is static.
- Existing mild ink remains; its render loop now also pauses behind an inert enquiry/gallery dialog. Section accent painting now runs on desktop as well as mobile.
- Mobile collage height adapts to width to reduce the empty gap above the artwork.

## Validation

- TypeScript: `node node_modules/typescript/bin/tsc --noEmit -p tsconfig.cloudflare.json` passed using the bundled Node 24 runtime.
- ESLint passed for the seven changed TypeScript/TSX files.
- `node node_modules/vite/bin/vite.js build` completed with exit code 0. The existing adapter emitted sourcemap/import/route-classification warnings; Wrangler also reported a sandbox log-file permission warning. Production output was generated. No deployment was run.
- In-app browser: inspected desktop 1440 × 900 and mobile 390 × 844 and 360 × 800. Neither mobile viewport had horizontal overflow. Mobile navigation opened and closed correctly. These are viewport checks, not physical-device benchmarks.
- Native pointer clicks successfully reset the hero to `bud` on desktop and mobile. Saved bud and open states are listed below.
- Enquiry dialog opened correctly and the botanical renderer changed to `paused`; artwork expansion and Escape dismissal worked.
- Gallery next navigation changed Mandala Art to Watercolour Pencil Peacock. Painting filtering returned the two painting records. Keyboard focus exposed the corner lift (sample opacity 0.947 during its transition).
- Offscreen hero rendering paused at the footer. Desktop footer rendered at its 30 fps target; mobile footer reported `static`. No warnings/errors were returned by the final browser console check.

## Performance evidence and limits

The scene uses shared geometries/materials, instanced small details, capped resolution, asynchronous shader prewarming, lazy mounting and no shadow maps or postprocessing. Animation runs outside React state. Hidden tabs, offscreen scenes and inert dialogs pause the loop. Reduced-motion mode renders a still bloom and removes replay.

Observed steady desktop hero sample: 30 fps, 44 draw calls, 693,418 canvas pixels and maximum CPU submission time 1.3 ms in that sample window. Mobile viewport sample: 24 fps, 37 calls, 108,040 pixels and maximum CPU submission time 1.2 ms. Hero construction was approximately 45 ms; asynchronous readiness was 191 ms in the inspected run. Those numbers exclude cold network/module loading, are local samples and do not measure GPU completion time. They do not establish zero lag or Core Web Vitals on every device. Physical low-end phone testing, reduced-motion media emulation and forced WebGL loss were not exercised in this review; their handling was inspected in code.

## Asset provenance

`hero-reference-collage-v3.webp` was edited with ImageGen to remove only the lower central painted lotus, leaving space for the animated flower. The resulting complete collage is optimized as:

- `public/images/decoration/hero-living-collage-v4.webp`: 1484 × 1060, WebP quality 90, alpha quality 100.
- `public/images/decoration/hero-living-collage-v4-small.webp`: 840 × 600, WebP quality 86, alpha quality 100.

ImageGen edit prompt:

> Precise localized edit of attached approved Indian painted collage. REMOVE ONLY the lower middle pink lotus flower centred near x=510,y=850 in this 1484x1060 image. Replace that flower and its yellow seed centre with continuous ochre-gold painted paper and quiet green foliage consistent with the immediate surroundings. Leave room there for a separately animated flower. KEEP EVERYTHING ELSE as unchanged as possible: the woman's face, all intricate black-and-white headwear, jewellery and neck; the peacock and every tail feather; the large upper-left pink lotus at x=430,y=470; mandalas, temples, Kathakali mask, colour washes, exact framing and positions. Do not remove the upper-left lotus or any other subjects. Preserve the genuine transparent irregular outer boundary. No new flower, no bud, no new objects, no text, no shadows. Output the same complete collage, not a crop, with same aspect ratio. This is a clean still backing for web animation; visual continuity is critical.

The edited backing is not claimed to be pixel-identical to the approved raster. The flower/leaf/brush models, grain and vein textures are procedural code, not videos or generated animation frames. Existing photographs, artwork records, CMS endpoints and content were not replaced.

## Visual differences and review files

The new lotus is a stylized shaded 3D bloom and differs from the reference’s hand-painted flower. The brush rests over the hero’s upper-right artwork; it does not travel through every section. The woman and peacock remain a still image, without the rejected cutout motion. Existing section spacing, decorative washes and typography retain their current local implementation, rather than claiming a pixel-perfect match to all six approved references.

- [Desktop open hero](desktop-open.jpg) and [desktop bud](desktop-bud.jpg).
- [Mobile first screen](mobile-top.jpg), [mobile bud](mobile-bud.jpg) and [mobile open bloom](mobile-open.jpg).
- [Desktop gallery](desktop-gallery.jpg).
- [Desktop footer](desktop-footer.jpg) and [mobile footer](mobile-footer.jpg).
