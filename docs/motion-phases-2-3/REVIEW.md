# Motion plan — Phases 2 and 3

Implemented locally on 2 November 2026. These are the second and third phases of the three-phase plan agreed in chat, not a declaration that every item in the original master specification has passed production acceptance.

## Phase 2: section journey

- Mounted a new Motion-based section choreography hook, separate from the old, inactive GSAP hero hook. It animates existing reveal groups once, with a smaller offset at phone widths. Complete editorial content remains visible in server-rendered HTML.
- Added low-opacity watercolour boundary pulses using the existing transparent texture. The existing full-page ink shader remains at its previously approved mild strength.
- Added decorative SVG accents beneath the hero/section headings and a footer flourish. On supported desktop pointers, the real Three.js brush briefly follows an accent path with its projected bristle tip while the stroke draws, then returns to its dock. Scroll, modal, visibility and context-loss interruptions finish the line and stop the paint gesture.
- Brush poses target the portrait, artwork stage and other section headings; gold bristles accompany recognition. Docks use surrounding space, moving below clipped cards or fading when there is insufficient clear room. The brush stays noninteractive and is removed below 960px, on coarse pointers and with reduced motion.
- Gallery lotus reveals through a gentle mask and the existing mandala fades into view once. This is a reveal of the existing illustration, not independently articulated petals.

## Phase 3: gallery and finish

- Directional gallery card enter/exit transitions with Motion AnimatePresence. Exiting cards are disabled, removed from keyboard traversal and hidden from assistive technology. No autoplay was introduced.
- Fine desktop pointers get spring-smoothed card tilt. Tilt clears when the viewport/pointer stops qualifying; mobile keeps the existing horizontal gesture and native vertical scrolling.
- Shared layout IDs connect an artwork image to its detail view. Closing returns it to the gallery. Artwork/category content, original images, manual arrows, keyboard operation and filtering remain intact.
- Detail overlays retain the focus trap, Escape dismissal, inert background, scroll lock and focus restoration. Their entrance/exit uses Motion; old competing CSS modal animations are disabled. Close and gallery arrow targets are at least 44px.
- Footer completes a short painted flourish, then the brush rests above the contact button, clear of the heading.

## Verification actually performed

- TypeScript: `tsc --noEmit -p tsconfig.cloudflare.json` passed.
- Scoped ESLint on all changed React/TypeScript files passed.
- Cloudflare-targeted Vite/Vinext production build passed. Existing adapter route-classification notice remains; no Cloudflare deployment was run.
- Browser layouts inspected at 1440x900, 1024x768, 390x844 and 360x800. No document horizontal overflow was observed at these widths.
- Desktop: section/brush state changes, rapid Next/Previous navigation, Traditional category and All reset, detail opening/closing, focus trapping in both directions, Escape restoration to the source card, and ArrowRight navigation from the focused card were checked. Only one current card remains interactive during exits.
- Mobile width: horizontal pointer drag changed the artwork without opening a dialog; next/detail controls, detail sizing, navigation menu and enquiry opening were checked. This is browser emulation, not a physical touchscreen test.
- Existing workshop controls changed the visible photo set successfully. No enquiry was sent and no external contact link was submitted.
- Browser logs inspected during checks showed no errors or warnings.

## Limits and follow-up

Reduced-motion handling is implemented and code-reviewed, including finishing in-flight reveals and leaving static strokes/content. An OS-level reduced-motion run and physical iOS/Android testing have not been performed. No measured FPS, Core Web Vitals or MotionScore grade is claimed; the Motion MCP server is not connected in this session. Formal performance/accessibility certification remains separate from these local checks.

The brush paint gesture runs once per visible section after scrolling settles. If the accent is offscreen, the gesture is skipped; normal scrolling and readable content take priority. Hand-painted hero depth remains the Phase 1 2.5D treatment, not a newly modelled rotating woman.

No original photographs, artwork files, CMS data, authentication code or database records were changed. Recognition/historical-photo CMS coverage remains as documented in the previous master-spec audit. No new raster generation was required for these phases.

API guidance was checked against the installed Motion skill and the official [AnimatePresence](https://motion.dev/docs/react-animate-presence), [shared layout](https://motion.dev/docs/react-layout-animations), [inView](https://motion.dev/docs/inview) and [animate](https://motion.dev/docs/animate) documentation. UI UX Pro Max search results on reduced/excessive motion and alternatives to dragging guided the interaction checks. The six approved references remain the visual direction.
