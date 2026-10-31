# Approved design implementation — Phases 0 and 1

## Phase 0 — audit, 31 October 2026

- Existing Next 16.4.3 / React 19.3.1 app, also built with Vinext/Vite for the live Cloudflare Worker. This checkout matches the supplied live URL.
- Public homepage: `src/app/page.tsx` → `src/components/studio/StudioPage.tsx`. Existing gallery and workshop carousel components are retained and restyled. Existing modal traps focus and restores it, enquiry prepares WhatsApp messages without sending them.
- CMS: `server-data.ts` → local JSON in Next development; Cloudflare alias selects D1 in production. Preserve admin routes, authentication, upload validation, database bindings and records. No migration or seed import needed.
- Deployment: `deploy/CLOUDFLARE.md` describes the current Worker. Preserve older Nginx deployment files; do not switch hosting.
- Existing full-page InkCanvas, Three.js BrushGuide, artificial loading screen and Lenis are decorative mechanisms. Remove them from the rendered homepage for the static layout checkpoint. Keep their source for later evaluation.
- Baseline screenshots: `docs/motion-review/baseline-1440.png` and `baseline-390.png`.
- Initial full lint fails on generated dist files and existing admin/settings, admin/workshop and legacy WorkshopMoments rules. Cloudflare TypeScript baseline passes. Default Node 20 cannot build Vinext (`node:fs/promises.glob` missing); bundled Node 24.22.1 is available and will be used for builds.

## Asset verification

The six attached references map in supplied order to hero, artist, gallery, workshops, recognition and footer. They are design references only and are not served as backgrounds.

- Actual logo `public/images/logo/logo.png`: official square watercolor logo. The clean transparent horizontal version in the reference is not supplied. Preserve original instead of tracing or inventing the emblem.
- `public/images/founder/meet-nishkala.jpg`: verified authentic red-outfit portrait with paintings, matches reference 2. Preserve face and photographic content.
- Existing individually navigable CMS artwork originals remain untouched. Mandala original matches reference 3.
- Existing workshop photos and permissions are recorded in `docs/ASSET_MANIFEST.md` as client confirmed. Retain currently published imagery; new CMS photos use existing publishing controls.
- Award original visually checked: Little Angels Play School, 2025–2026. Certificate original visually checked: Chennaiyil Oar Oviya Sangamam 2026, 22 February 2026. Existing factual captions are retained, not mockup dates.
- New hero composite and lotus ornament are generated decoration, not original Nishkala paintings or a real person. They are not placed in the gallery or attributed to the artist. Prompt and provenance recorded in the phase asset manifest.

## Phase 1 implementation plan

1. Adapt StudioPage markup in place: editorial hero, authentic portrait, existing gallery/workshops/recognition and navy contact footer. Retain data props, routes, enquiry, navigation, filtering and lightbox.
2. Add reusable noninteractive scene decoration and a scoped approved-design stylesheet. Restore Cormorant Garamond / DM Sans already loaded by the app. Preserve responsive image containment and actual DOM copy.
3. Pause automatic carousel motion and advanced effects for this checkpoint. Keep explicit controls and touch artwork navigation.
4. Validate actual browser views at 1440, 1024, 390, 360; check console, interactions, build and scoped lint. Record outcomes before any advanced motion is added.

Advanced parallax, scroll choreography and WebGL remain later phases. Do not claim performance budgets or CMS CRUD verification without measuring/testing them.
