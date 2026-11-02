# Master motion specification — progress audit, 2 November 2026

Source: `KALAVRIDHI_CODEX_3D_MOTION_IMPLEMENTATION_SPEC.md`, especially sections 13–17 and 19. This report supersedes earlier completion impressions; implementation and verified acceptance are different.

**Rough implementation estimate: about 60% of the full scope.** This is an engineering estimate, not a measured completion score or a claim that 60% of acceptance tests passed. The visual foundation is much further along than final motion and production verification.

| Phase | Implemented | Outstanding acceptance/work |
| --- | --- | --- |
| 0 — Audit and baseline | Architecture, existing CMS, source assets, deployment and baseline failures documented; earlier desktop/mobile screenshots exist. | Baseline is historical and does not verify the latest changes. |
| 1 — Responsive reconstruction | All six sections exist as real components with original photos/art, editable text, navigation, enquiry, filters and lightboxes. Earlier versions were checked at 1440/1024/390/360. | Recheck the current logo, latest hero composition and restored effects at required widths; exact reference parity is not established. |
| 2 — Decorative layers | Transparent watercolor, lotus, peacock/profile ornaments, original SVG linework/mandala, paper grain and decorative reference collage produced. Source originals retained. | The current reference-matching hero uses one internal collage for the profile/peacock/temple/mask rather than independent foreground motifs; their independent animation requirement remains. Current visual checkpoint still pending. |
| 3 — Scroll and entrance | A scoped GSAP hook exists in source. | `useStudioMotion` is NOT imported or mounted by StudioPage. Full hero entrance, portrait/badge sequence, workshop/recognition stagger, footer paint/path reveal and section-to-section choreography are not active. Need implement/reconnect to current hero markup, then test forward/back scroll, anchors, rapid scroll and visibility/reduced-motion changes. |
| 4 — Depth and interaction | Gallery layered frames, filters, manual controls, keyboard arrows, pointer drag/swipe and focus-managed lightbox; workshop gestures/controls and hover styling. Earlier interaction checks documented. | Current desktop hero cursor-depth is not active; verify current device gestures, focus, rapid navigation and no touch-scroll conflict. No current-browser visual acceptance claimed. |
| 5 — Optional fluid / custom motion | At user's later explicit request, restored mild WebGL ink throughout page and a separate Three.js reference-style brush aiming toward active section headings. Static brush images removed from mounted UI. | This intentionally differs from the master spec's single, hero-only canvas guidance: two WebGL contexts can exist on desktop, and ink is page-wide. Runtime likeness, visibility, clearance, resource use and performance comparison remain unverified. These effects do not complete Phase 3. |
| 6 — CMS, polish and production QA | Existing authenticated CMS, database, uploads, routes, settings and artwork/workshop data flow retained. Published workshop covers feed photo carousel. Earlier builds/deployment checks documented. | Recognition and historical workshop-photo arrays remain source-backed, not fully admin-editable. Need edge-case content/consent/missing contacts validation, authenticated CRUD regression, current accessibility/contrast and real-device checks, and measured LCP/CLS/INP. No fresh performance results claimed. |

## Current logo changes being pushed

One transparent high-resolution script logo replaces the duplicate square-plus-wordmark header. Tagline is real text, increased in size and weight. Brand container: 260px desktop, 240px small desktop, 195px mobile, 180px narrow mobile. Tagline: 14/13/10.5/9.5px respectively. Header left padding is reduced to 16–28px. Original and previous logo assets remain intact.

Latest changed files: `src/components/studio/StudioPage.tsx`, `src/components/studio/studio-living.css`, new transparent WebP, its preparation script and provenance note, and this status report. No CMS, contact, artwork or production configuration changes in this push.

## Verification and limits

The latest transparent asset was checked for real alpha (0–255 range). Local homepage and asset HTTP checks previously passed after that change. TypeScript, scoped lint and Cloudflare-compatible build are rerun for the push; outcomes are reported in chat. Existing full-project admin/legacy lint failures are documented separately and are not claimed resolved.

Latest attempts at browser inspection returned `Local browser use is disabled in Work settings`. User-supplied screenshots show the page but do not prove the full desktop/mobile acceptance matrix, animation behaviour or performance. Earlier saved website screenshots must not be represented as screenshots of the current build.

No Cloudflare deployment in this update. GitHub synchronization is requested separately from publishing the website.

## Practical order to finish

1. Verify current static design, logo and hero on desktop/mobile with actual screenshots.
2. Restore/refine Phase 3 choreography against current components; add controlled hero depth without altering artwork contents.
3. Verify the user-requested brush/ink on real devices, reduced motion and hidden tabs; measure before/after costs and tune accordingly.
4. Complete required CMS editing/edge cases and accessibility/performance acceptance checks.
5. Deploy to the existing Cloudflare site when requested; preserve its database and secrets.
