# Header, reference-style 3D brush and mild ink flow

This update supersedes the static-only checkpoint notes in earlier reports. The user explicitly requested restoring brush and ink motion locally and pushing the current website changes to GitHub. No Cloudflare deployment was requested or run in this pass.

## Implemented

- Header: original colourful logo in a square box, supplied navy script wordmark image beside it. Responsive sizes are 68px/250px at desktop and 40–44px/143–160px at small mobile widths. The wordmark was optimized from the supplied image without generative repainting.
- One true Three.js brush modeled to the supplied reference's burgundy lacquer handle, brass ferrule, dark sable bristles and blush-pink tip. This is geometry/material reconstruction, not an exact 3D scan of the image and not a rotating flat PNG.
- Active-section detection covers home, artist, artwork, workshops, recognition and contact. The brush's position and direction are calculated from the active heading's viewport location rather than only preset angles. Smooth GSAP movement renders the brush during updates; there is no permanent idle render loop. Resources and scroll listeners are disposed on unmount.
- Brush is available on desktop fine-pointer devices at 960px and above; it unmounts when reduced motion, coarse pointer or smaller width applies. It is hidden while a modal is open and never intercepts clicks.
- Restored the existing WebGL dye-advection effect with mild settings: ambient input .14 in the hero/.10 elsewhere (previous .44/.30); pointer .6 (previous 1.9); click .8 (previous 4.1); shader strength .35/.28 (previous .84/.60). CSS opacity .4 on desktop, .28 mobile; an edge mask keeps the center clear. Resolution capped at 900px long edge desktop/450px mobile and rendering at 24fps. Pauses when the document is hidden; reduced motion disables it. No touch pointer splats.
- Removed all mounted static brush decoration from SceneDecor. Existing reference image assets are retained as source material but no brush image is rendered in the UI.
- Existing latest hero collage, artwork originals, photos, CMS data, interactions, routes and hosting configuration remain intact.

## Files specific to this update

- `src/components/studio/StudioPage.tsx`
- `src/components/studio/BrushGuide.tsx`
- `src/components/studio/InkCanvas.tsx`
- `src/components/studio/SceneDecor.tsx`
- `src/components/studio/studio-living.css`
- `public/images/logo/kalavridhi-square.webp`
- `public/images/logo/kalavridhi-script-wordmark.webp`
- `scripts/prepare-header-brand.mjs`

The GitHub push includes the earlier approved local design/components/assets that these changes depend on. No new dependencies or database changes.

## Actual verification and limits

- Cloudflare TypeScript check: pass.
- ESLint on BrushGuide, InkCanvas, StudioPage and SceneDecor: pass.
- Cloudflare/Vinext production build: pass; existing adapter route-classification warnings remain.
- Local homepage and both new logo image URLs: HTTP 200. Rendered HTML contains the ink canvas and supplied wordmark; no `paintbrush-v2.webp` static brush image.
- Browser screenshot/motion verification attempted, but the browser tool reports local browser use disabled in Work settings. Runtime WebGL rendering, exact visual brush likeness, pointing clearance, mildness of ink, mobile screenshots and GPU profiling are **not verified**. Compilation does not prove those visual properties.
- Existing whole-project lint failures in untouched admin/legacy components were documented earlier; they were not changed for this update.

Local preview: http://localhost:3000/. No production deployment in this update.
