# Painted refinements — 2 November 2026

This supersedes the procedural 3D flower treatment documented in `../living-painting-review/REVIEW.md`.

## Delivered scope

1. Hero/footer flowers use 13 individually animated painted petal layers. Hero opens once, then sways gently. No replay button or WebGL flower remains.
2. Desktop hero typography and illustration sizing respond to viewport height. The complete collage fits within the initial desktop screen; mobile retains a readable stacked layout.
3. One larger, natural 3D brush travels between all six sections. Hero/workshops/recognition have timed painted accents; portrait/gallery/contact have corresponding pointing/resting positions. Contact hover brings it closer to the enquiry area. Brush movement uses Motion values and renders only while its model changes. It is omitted below 960 px, on coarse pointers and with reduced motion.
4. Artwork advances every 2 seconds. Manual arrows, filtering, swipe and expansion remain. Hover/focus/drag, hidden tabs, offscreen content and inert dialogs suspend advancement. Explicit play/pause is available.
5. Workshops/exhibitions cycle every 2.6 seconds with Motion layout/entry/exit transitions, manual navigation and a pause control. The next photo is prefetched.
6. Decorative containers permit overlap across section joins, washes have soft radial masks, and the unwanted gold separator threads are removed.
7. The empty “Next at the studio” announcement and divider are removed. Actual CMS workshop records and registration links still render when present; published cover photos remain in the carousel.
8. Recognition reads “Art, community & meaningful milestones.” Supporting copy and responsive typography are refined. Award facts remain unchanged.
9. An original small translucent ink cursor has a short fading trail and click bloom. It retains native text cursors in form fields. It is disabled for coarse pointers and reduced motion.
10. A faint pointer glow, three floating painted petals in the desktop hero, artwork hover lift/title emphasis, heading reveals and an enquiry-button painted hover accent complete the supporting interactions.

## Validation

- TypeScript (`tsconfig.cloudflare.json`) and scoped ESLint passed for all nine changed/new TypeScript modules.
- Production Vite/Cloudflare-adapter build completed, exit 0. Existing adapter warnings remain (sourcemaps, imports and route classification; sandbox Wrangler logging can also warn). No Cloudflare deployment was performed.
- Desktop reviewed at 1440 × 900 and 1906 × 900; mobile at 390 × 844 and 360 × 800. No horizontal overflow in those checks. At 1906 × 900 the illustration container ended at approximately y=885 within the first screen.
- Artwork changed automatically while visible. Pause held Mandala Art through a later check after more than nine seconds; explicit play resumed progression to Madhubani Peacock. Artwork detail still opened correctly on mobile.
- Workshop slides advanced from 01/02/03 to 05/06/01 and wrapped into the historical workshop photographs.
- All six section IDs were observed on the travelling brush. Its positioning was refined to avoid gallery headings, portrait faces and the contact button. Recognition stroke resolves to gold `rgb(195,147,63)`.
- Enquiry opened/closed; the brush was hidden and the flower paused while the dialog made content inert.
- Reduced-motion branches are implemented and inspected in code, but OS-level media emulation and physical low-end-phone performance were not exercised. No zero-lag, Core Web Vitals or pixel-identical artwork claim is made.

## Artwork provenance

ImageGen created one transparent watercolour petal using the user’s second image as a style reference, rather than copying assets or source from Medhavi Nanda’s website. The full generated original remains in the local generated-image library. The repo asset is `public/images/decoration/lotus-painted-petal-v1.webp`, trimmed and resized to 640 px high, WebP quality 92 with alpha quality 100 (67,356 bytes). Runtime instances share this single image resource.

Prompt:

> Reference image is STYLE ONLY: hand painted pointed pink lotus on Indian art. Generate ONE isolated single lotus PETAL on a truly transparent background, upright, narrow attached base at bottom centre, broad gently cupped middle and long pointed tip at top centre. Full petal entirely visible with generous transparent margin, tall aspect 1:2. Rich magenta carmine tip and imperfect edges, creamy pale pink central washes, beautiful delicate curved dark pink hand-drawn longitudinal veins, visible paper pigment blooms and dry brush grain. It must look exactly like a real watercolour painted lotus petal from the reference, NOT a shiny 3D render, not smooth gradient vector, not plastic. No other flower parts, no stems, no background, no text, no shadow. This petal will be layered and independently articulated in a painted blooming flower on a website. Base at x50% y90%, tip x50% y8%, widest near y48%, petal body width approximately 65% of canvas.

## Screenshots

- [Desktop hero](desktop-hero.jpg)
- [About brush position](desktop-about.jpg)
- [Selected artwork](desktop-gallery.jpg)
- [Workshop carousel](desktop-workshops.jpg)
- [Recognition](desktop-recognition.jpg)
- [Contact](desktop-contact.jpg)
- [Mobile hero](mobile-hero.jpg), [gallery](mobile-gallery.jpg), [recognition](mobile-recognition.jpg), [contact](mobile-contact.jpg)
