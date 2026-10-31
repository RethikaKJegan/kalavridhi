# Phase 0/1 recheck and local Phase 2 work

## Scope and actual status

The latest user request takes precedence over the execution prompts embedded in the two supplied specifications: work locally, verify earlier phases, improve static visual fidelity and prepare separate painted assets. No deployment, new scroll choreography, WebGL or fluid simulation was performed in this pass.

**Phase 0: engineering inventory and source checks rechecked; fresh screenshot baseline blocked.** Existing Next/React application, existing studio sections, CMS data props, D1 deployment adapter, admin/auth/upload routes, artwork originals and participant photographs are retained. No new dependency, content claim, contact detail, database mutation or original-image replacement.

**Phase 1: structural implementation exists, but exact visual acceptance is not established.** The previous implementation had broad composition/typography/responsive support, but the saved earlier screenshots and source showed a single dominant hero illustration, repeated florals, digital-gradient washes and missing brushes. Successful builds do not establish reference parity. This pass corrects those known visual gaps while preparing Phase 2 assets; it does not mark Phase 1 or Phase 2 visually accepted.

**Phase 2: assets and static component integration implemented; browser comparison remains pending.** Local browser tooling returned `Local browser use is disabled in Work settings`, including after the user reported enabling it. No alternate browser automation was used to bypass that setting. There are **no new desktop/mobile website screenshots** from this pass. Older captures in `motion-review/` are historical evidence only.

## Changes in this pass

1. Replaced the rendered single hero composite with separate pigment, coral print disc, fine mandala, botanical contour, illustrated ink profile, peacock and lotus layers. No text or controls are rasterized. The generated imaginary profile is not Nishkala or an authentic client artwork.
2. Added a granular, irregular watercolor wash instead of relying only on smooth radial gradients. Positioned separate wash layers around all six sections, with lighter edge-only treatment on mobile.
3. Added lighter lotus sprigs, dense gold mandala geometry, original botanical outline SVGs, sparse gold flecks and separately positioned dimensional paintbrush cutouts. Footer uses translucent pigment over existing navy.
4. Kept the authentic red-outfit photograph, original gallery paintings, workshop photographs, award/certificate images, CMS copy, links, forms and interaction components. Source photographs and paintings were not repainted or overwritten.
5. Unmounted the previously added `useStudioMotion` enhancement for this static checkpoint. Its source remains available. Original `BrushGuide.tsx` and `InkCanvas.tsx` are retained unchanged for the later motion phase. The new brush is currently a static dimensional image, **not an active 3D brush**. Static pigment textures are **not a running ink simulation**.
6. Added explicit small/large decorative image sources and alpha-preserving WebP variants. New generated originals remain outside public assets. Their manifest records original filenames, dimensions, bytes and transparency checks.

## Six-section comparison matrix

The following compares source composition and the previously saved implemented screenshots with the approved references. The current changes require fresh browser confirmation; entries are not pixel-match claims.

| Section / reference | Original source content | Changes prepared locally | Remaining difference / acceptance limit |
| --- | --- | --- | --- |
| Hero / image 1 | DOM headline/CTAs/benefits and original logo retained | Separate flat ink profile, peacock, lotus, coral disc, gold mandala and watercolor | Exact approved turban/face silhouette, architectural background and Kerala mask are not reproduced. Clean horizontal source logo is missing. Final crop, subject scale and text clearance unverified. |
| About / image 2 | Authentic red-outfit photograph, bio, badge and qualification chips retained | Painted frame-edge wash, lighter lotus sprigs, mandala and side brush | Photograph is intact rather than the mockup's altered composite. Exact signature styling and botanical outlines differ. Current portrait/badge positions need fresh screenshots. |
| Gallery / image 3 | CMS artwork, filters, detail text, deck and lightbox retained | Warm paper stage, granular wash, floral bridge, dense gold arc and diagonal side brush | Artwork is contained to preserve the original; the mockup uses a different crop/proportion. Precise stage sizing and title/brush spacing need current desktop/mobile checks. |
| Workshops / image 4 | Existing real photos, carousel, CMS workshop data and enquiry retained | Wash across upper-right, lotus/leaf edge framing, isolated dimensional brush and flecks | Exact paint swath and floral grouping differ; layout uses responsive existing card logic. Brush/CTA clearance unverified in browser. |
| Recognition / image 5 | Original documents and verified dates/issuer retained | Soft pigment, header lotus, mandala and edge brush; document cards remain foreground | Reference's erroneous dates/issuer intentionally not copied. Exact lotus/brush positioning differs. Caption and decoration clearance need screenshots. |
| Footer / image 6 | Existing navy contact section, real links, DOM headline and year retained | Separate screen-blended pigment, lotus, gold contour leaves, flecks and brush | Exact pink paint stroke, gold branches and large brush composition differ. New footer contrast and ornament placement need current browser verification. |

Mobile variants simplify the ornament edges and use smaller files. A fresh check at 1440×900, 1920×1080, 768×1024, 390×844 and 360×800 remains required, followed by 1024 and text zoom checks where needed. No responsive success is inferred from CSS alone.

## Exact assets still needed for closer fidelity

- **Original horizontal logo:** transparent SVG or PNG, full palette/brush emblem and correct lettering/tagline; at least 1600px wide for raster. Do not trace/repaint the brand mark with ImageGen.
- **Exact approved hero illustrations:** original generation layers or authorized transparent extractions for the profile, architectural mandala/temple background and Kerala mask. Preferred 1600–2200px long edge, no UI/text, no embedded shadow, each subject separate. Newly generated profile/peacock are distinct decoration; they cannot promise identical details to the flattened mockup.
- **Exact lotus and gold botanical shapes, if literal identity is required:** source layers from the approved mockups. The current generated and code-native variants reproduce the motif family, not identical silhouettes.
- No additional portrait, participant, award or certificate regeneration is needed. Existing originals remain authoritative. No new factual claims are introduced.

## Asset production and provenance

Built-in ImageGen was used for five decorative assets, with no API/CLI fallback. Final prompts are recorded in `phase-2-review/PROMPTS.md`. Asset metadata is in `phase-2-review/assets.json`.

- `public/images/decoration/watercolor-wash-v2.webp` + `-small.webp`
- `public/images/decoration/lotus-sprig-v2.webp` + `-small.webp`
- `public/images/decoration/zendoodle-ornament-v2.webp` + `-small.webp`
- `public/images/decoration/paintbrush-v2.webp` + `-small.webp`
- `public/images/decoration/peacock-ornament-v2.webp` + `-small.webp`

Every new WebP has an alpha channel with measured alpha minimum 0 and maximum 255. The assets were also inspected on ivory in `phase-2-review/asset-proof.png`. **This is an asset contact sheet, not a website screenshot.**

## Exact source files changed/added in this pass

- `src/components/studio/StudioPage.tsx`: mount separate hero layers and Phase 2 stylesheet; pause existing motion hook.
- `src/components/studio/SceneDecor.tsx`: separate painted assets, richer mandala, botanical contours and flecks.
- `src/components/studio/DecorativeAsset.tsx`: new responsive asset component.
- `src/components/studio/HeroArtLayers.tsx`: new separately addressable static hero layers.
- `src/components/studio/studio-phase-two.css`: scoped composition, texture and breakpoint treatment.
- Generated files listed above; `scripts/prepare-phase-two-assets.mjs`, `scripts/preview-phase-two-assets.mjs`, `scripts/check-phase-two-http.mjs`; review records in `docs/phase-2-review/`.

Earlier uncommitted changes in this checkout were preserved. Do not attribute all of `git diff` to this pass.

## Verification

- Cloudflare TypeScript check passed.
- Scoped ESLint passed after removing an unsupported ARIA property on `picture` (empty image alt and ancestor `aria-hidden` remain).
- Cloudflare/Vinext production build passed. No publication command was run. Adapter warnings about static route classification remain unchanged.
- Local homepage returned HTTP 200; all ten new image URLs returned 200. Rendered HTML contains all six scene wrappers, the new hero layers and existing gallery/workshop controls. See `phase-2-review/http-checks.json`.
- `git diff --check` passed, apart from normal Windows line-ending notices.
- New website screenshots, visual overlap/contrast checks, interaction regression in the current browser, reduced-motion device checks and performance metrics remain **unverified** because browser access is blocked. They are the next required step before declaring visual acceptance or deploying.

## Next step

Restore local browser-tool access, capture the required sizes, refine each section against its corresponding reference, and record the remaining differences. Only after that checkpoint should the retained brush/ink motion be restored and measured. Cloudflare deployment remains deferred.
