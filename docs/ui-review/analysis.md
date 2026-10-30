# Kalavridhi UI review and Lumora adaptation

Reviewed 30 October 2026. Scope: desktop hero, class browsing, artwork gallery, and enquiry entry at the existing local server on port 3456; current component code; the complete attached Lumora specification; all four Nishkala photographs in Downloads/art_images. This is analysis only. No application source was changed.

## Findings from the current page

1. **Hero — needs a substantial redesign.** Screenshot: 01-current-hero.png. Real artwork and clear class/enquiry actions are strengths. However, the cream background, serif headline, scattered image cards and gentle pastel washes produce a different visual language from the reference. The heading visibly joins “Where” and “Creativity”. Some artwork extends below the captured first viewport. Nishkala is absent from the hero. The canvas code draws soft drifting radial-gradient blobs, which explains why it does not look like pigment dispersing in water.
2. **Class browsing — clear structure, visual refresh needed.** Screenshot: 02-current-classes.png. Category filters and real artwork support browsing. The centered heading, broad whitespace and repeated light cards continue the existing quiet style. Use the reference’s stronger hierarchy and compact interaction details while retaining useful filters and class-specific enquiry links. The initial screenshot alone does not verify filter behavior.
3. **Gallery — strong source images, presentation differs from the reference.** Screenshot: 03-current-gallery.png. A large central artwork and visible enlarge affordance support exploration. Faded, partly visible side slides make scanning several works less direct. Adopt four featured works in a two-column grid with dark framing, readable metadata, arrow controls and image enlargement; retain access to the complete artwork collection.
4. **Enquiry entry — useful information, styling and feedback need attention.** Screenshot: 04-current-contact.png. Fields have visible labels and the page explains the WhatsApp handoff. Small muted helper text and placeholders need measured contrast checks. Source inspection shows that the form opens WhatsApp and then sets a submitted flag; opening WhatsApp does not prove delivery. A redesigned modal should say “Continue in WhatsApp” or accurately describe the handoff rather than copy the reference’s simulated “Request received” state.

## Recommended visual direction

Use Lumora’s layout, Onest typography, near-white surfaces, near-black panels, generous rounded corners, oversized brand watermark, pill controls and coordinated reveal timing. Keep Kalavridhi’s official logo, actual art, classes, workshops and artist story. Make colour concentrated and expressive through cyan, magenta, violet and saffron ink rather than tinting every surface.

The attached prompt is a written specification, not a supplied screenshot or runnable reference. Its photo cursor reveal is a soft fading mask between two images; it is not a fluid simulation. Matching that mechanism alone will not achieve the requested ink-in-water look.

## Section adaptation

| Reference element | Kalavridhi adaptation |
|---|---|
| Intro loader | Short branded 000–100 sequence and upward exit; avoid imposing it on every repeat visit; do not imply the number is actual load progress |
| Full-bleed photo hero | Nishkala and her artwork, short line-reveal headline, KALAVRIDHI watermark, Explore Classes and Enquire actions |
| Floating hero carousel | Small featured-art or workshop card with working previous/next buttons |
| Partner logos / brand ratings | Verified teaching experience and art-form information; omit invented partners, reviews or student totals |
| About statement | Concise artist introduction, word reveal and portrait |
| We / Build / arrow / Better | Art-related phrase such as Learn / Create / arrow / Bloom |
| Four portfolio cards | Four real featured artworks on dark cards, tags and accessible enlargement |
| Services rows | Art learning categories with numbered rows, colour fill on hover/focus and clear enquiry actions |
| Stats panel | Verified facts only; avoid importing Lumora’s project, retention and team numbers |
| Additional existing sections | Preserve workshop photographs, upcoming-session states and accurate recognition captions within the new visual rhythm |
| Footer and menu | Large art-learning invitation, dark footer, brand watermark and full-screen navigation |
| Request modal | Class/workshop enquiry connected to the existing WhatsApp flow, with honest handoff messaging |

## Photo selection

- **nishkala_4.jpeg:** preferred desktop hero. Its landscape composition places Nishkala on the right and colourful fabric artwork on the left. Keep her face unobscured and use a restrained legibility layer behind text. A separate mobile crop will be necessary.
- **nishkala_3.jpeg:** strong closer portrait for About and a possible mobile hero crop, keeping the face, hand and painted figures readable.
- **nishkala_1.jpeg:** secondary artist/artwork image; window bars and bright background make it less suitable behind headline text.
- **nishkala_2.jpeg:** process or teaching story; portrait orientation, desk and recording equipment suit an editorial section.

These photographs are different scenes, not an aligned before/after pair. Use the same hero photograph with a subdued base treatment and a full-colour reveal to avoid a cursor trail that abruptly swaps facial positions. A prepared matching pair would be needed for a different before/after transformation.

## Motion design

1. Hero: cursor/touch-responsive colour plumes with curling edges, spreading pigment and gradual dissipation. Evaluate a small WebGL fluid effect for this rather than increasing blurred circles. Keep the photo reveal as a separate mask layer and preserve facial clarity.
2. Scrolling: clipped line entrances, staggered words and cards, restrained image movement and one or two brief colour transitions between major sections. Avoid covering every section with continuous motion.
3. Controls: spring-like pill and arrow movement, hover/focus fills on category rows, clear selected filter states and smooth carousel changes.
4. Navigation and enquiry: consistent overlay entrances, Escape close, focus containment, restored focus and coordinated scroll locking.
5. Mobile and accessibility: touch-independent controls, natural scrolling, static reduced-motion fallback, bounded rendering resolution and pause animation when offscreen. Do not require a custom cursor to use the site.

## Implementation scope

Retain the existing Next.js application, server-managed content and admin features. Treat the pasted single-file HTML requirement as part of the reference’s original delivery instructions, rather than replacing this application with an isolated static file. Rework shared tokens, Navbar, Hero, WatercolourCanvas, About, artwork presentation, art categories and Footer; add shared intro/menu/enquiry and motion primitives. Read the installed Next.js documentation before implementation as required by AGENTS.md.

Start with the hero and shared design language, then carry the same system through the remaining sections. Verify desktop and mobile layouts, reduced motion, image cropping, keyboard access, actual navigation, filter behavior and enquiry handoff.

## Evidence limits

Screenshots were captured and inspected for four desktop states. This review does not establish mobile quality, keyboard accessibility, measured contrast compliance, live fluid animation performance, filter correctness, lightbox correctness or successful WhatsApp message delivery. No enquiry was submitted and no external message was sent. The visual comparison is to the supplied written specification, not a captured Lumora website.
