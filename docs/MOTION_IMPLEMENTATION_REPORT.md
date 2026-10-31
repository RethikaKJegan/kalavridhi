# Kala Vridhi design and motion handoff

Production: https://kalavridhi.kalavridhi-arts.workers.dev

Date: 31 October 2026. Existing application and Cloudflare/D1 hosting retained. No database migrations, seed imports, CMS record changes, new dependencies or licence changes.

Final deployed Worker version: `28cadf94-e841-4a6c-8bf7-158c4efd604a`. Final four-width production checks confirm direct full-resolution artwork URLs, the correct desktop/mobile hero asset, contained images, one h1, no canvas and no horizontal overflow. The final image-container compatibility fix was rebuilt, deployed and smoke-checked on production.

## Completed work, in phase order

### Phase 0 — audit

See `MOTION_PHASE_0_1.md` for baseline architecture, asset mapping and existing failures. Desktop and mobile baseline captures are in `motion-review/`.

### Phase 1 — responsive compositions

All six supplied images were used as visual targets, in their supplied order: hero, artist, gallery, workshops, recognition, footer. Real DOM text, controls and original photos remain separate from decoration. The existing components were adapted rather than recreating the application. The initial four-width static checkpoint was captured **before** adding advanced motion.

- Hero: navy/pink serif heading, prominent original logo, enquiry/artwork actions and Indian-art decorative composition. The artist photograph remains in About, not the hero.
- About: authentic red-outfit portrait and paintings, experience badge, CMS biography and qualifications.
- Gallery: original mandala selected initially when present; category filters, large paper frames and artwork details. Other categories retain the CMS order. Original paintings are contained, not cropped.
- Workshops: existing approved real photography, responsive one/two/three-card presentation and existing registration/enquiry content. Published CMS cover photos now join the photo collection.
- Recognition: original trophy and certificate, preserved factual captions and document enlargement. Dates remain 2025–2026 and 22 February 2026, not generated mockup dates.
- Footer: navy/plum, restrained botanical edges, pink headline, real contacts and navigation, dynamic year and oversized low-contrast watermark.

### Phase 2 — independent decoration

Separate generated hero composite, isolated lotus botanical, original SVG mandala geometry, paper grain, watercolor washes and gold ornamental thread. These are decorative only and never attributed to Nishkala as authentic paintings. Original client assets were not overwritten. See `motion-review/asset-manifest.json` and `IMAGE_GENERATION_PROMPTS.md`.

### Phase 3 — entrance and scroll

Scoped GSAP contexts and media queries provide gentle hero settling, one-time section reveals and bounded 10px hero background scroll depth. Normal native scrolling and anchor links remain. Content is visible without motion/JavaScript enhancement. Cleanup removes observers, listeners, contexts and media handlers. Ambient motion pauses when the hero is offscreen or the document is hidden.

### Phase 4 — depth and interaction

Desktop fine-pointer hero layers use damped, clamped 5/10/15px depth. Coarse pointers and reduced motion skip parallax. Gallery frames animate on user navigation, accept horizontal pointer gestures and keyboard arrows, and retain the focus-managed lightbox. Workshop cards accept horizontal gestures and explicit navigation. Autoplay is intentionally absent. Back to top restores focus to the hero heading.

### Phase 5 — optional WebGL

Not enabled. The intended effect is delivered with CSS/GSAP; no shader, full-page canvas, Three.js brush or artificial loading gate is mounted. A future fluid experiment must justify its measured cost before inclusion.

### Phase 6 — production verification completed to the extent listed below

Existing CMS/admin routes, authentication, D1 bindings, upload handling, site settings, SEO and hosting files remain. No production CMS test records were created. Full authenticated CRUD and real-device performance auditing were not repeated in this change.

## Changed source files

- `src/components/studio/StudioPage.tsx` — adapt six existing sections; retain CMS props, navigation, enquiry and modals; integrate scoped motion and dynamic workshop photos.
- `src/components/studio/ArtworkCarousel.tsx` — initial mandala, safe active index, gesture navigation, manual control, full-resolution image presentation.
- `src/components/studio/WorkshopGallery.tsx` — manual controls/gestures, published CMS photos, responsive card count.
- `src/components/studio/SceneDecor.tsx` — new independent ornaments and reusable original SVG mandala.
- `src/components/studio/studio-approved.css` — new scoped visual compositions, breakpoints, ornaments and motion rules.
- `src/components/studio/useStudioMotion.ts` — new scoped, reversible progressive motion.
- `src/components/studio/useDeckGesture.ts` — new shared native-pointer gesture handler, vertical scrolling retained.
- `src/components/studio/studio.css` and `src/app/globals.css` — remove obsolete/duplicate external font imports; existing layout already loads Cormorant Garamond and DM Sans. This fixes the existing Next CSS import-order build error.
- `eslint.config.mjs` — exclude generated `dist/` output from source linting.
- `next-env.d.ts` — generated type references refreshed by framework builds.
- New `public/images/decoration/hero-art-collage.webp`, `hero-art-collage-mobile.webp`, `lotus-botanical.webp`, `paper-grain.svg`.
- Audit, asset manifest, prompt provenance, verification records and screenshots under `docs/`.

## Checks and actual results

- Four-width static layout checkpoint: 1440, 1024, 390 and 360 CSS px. Screenshots `motion-review/phase-1-*.png`. Raw container intersections are not artwork-pixel collisions: the hero's transparent media box overlaps empty space in the text column; visible artwork and controls remain separated.
- Four-width production checks: `motion-review/live-responsive-checks.json`; no horizontal page overflow, one h1, contained images, no mounted canvas. Final production screenshots `motion-review/live-*.png`.
- Manual browser checks: mobile menu; gallery next/previous; horizontal drag without accidental lightbox; keyboard arrows; category change and correct counts; lightbox Escape, background inert and return focus; enquiry validation/preparation using disposable QA text **without sending a message**; workshop next and mobile card count; back-to-top heading focus.
- Browser console: no captured runtime errors during the checked flows.
- Cloudflare TypeScript check passes.
- ESLint passes on all changed/new TSX/TS components/hooks. Whole-source lint still reports **13 pre-existing errors** in untouched admin/legacy components and one existing font warning. Details: `motion-review/lint-existing.json`. These are not claimed resolved.
- Both Next.js and Cloudflare/Vinext production builds passed using installed Node 24.22.1. Default system Node 20 is too old for the existing Vinext dependency. Initial sandbox compiler/socket restrictions required the local preview and Next compiler to run with approved access.
- Production read-only HTTP checks: homepage, login, robots, sitemap and mobile hero asset 200; unauthenticated settings/artworks APIs 401.
- Cloudflare smoke checks caught and corrected two adapter differences: fill images receive inline `object-fit:cover`, and responsive fill images were being emitted as 320px image requests with no srcset. Explicit containment and existing optimized image files bypass those defects. Gallery/lightbox originals load at their source resolution; mobile hero uses its own 640px asset.
- Asset bytes: desktop hero 579,848; mobile hero 170,178; botanical 161,438; paper grain 376. Initial final Worker upload measured approximately 392 KB gzip with 19ms startup; this is deployment telemetry, **not** a Core Web Vitals measurement.

## Limits and remaining work

- Clean transparent horizontal original logo was not supplied; the authentic square logo is retained beside typeset branding. Generated ornaments reproduce the visual direction, not an exact pixel copy of the reference collage. The reference's large paintbrush and separately isolated peacock are not reproduced as independent assets.
- Achievement captions and historical photo selection remain in the existing source-backed data structures; the existing admin has no editor for those. No new CMS fields/editor were invented. Artwork, settings, upcoming workshops and new workshop covers remain connected to the CMS.
- Real touch-device testing, OS reduced-motion toggling, a full screen-reader/contrast audit, Lighthouse/slow-network measurements, field LCP/CLS/INP and authenticated CMS CRUD remain unverified. Code and CSS include the reduced-motion/coarse-pointer fallbacks; this is not a claim of physical-device testing.
- Historical workshop permission is recorded as client-confirmed in the existing manifest. Newly published participant images still require the editor's appropriate consent; this change publishes no new participant photographs.

Next work: measure performance/accessibility on actual devices, obtain the clean brand asset if available, then consider the remaining CMS/editor additions. Optional fluid motion is last.
