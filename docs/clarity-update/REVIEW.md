# Class clarity and controllable mop brush — 2 November 2026

- Default hero copy now explains art classes/workshops with Nishkala Krishna, children/adult audiences, and original artworks. Class enquiry is the primary action. Custom CMS hero copy remains supported.
- Removed the overlapping hero-bottom slogan. Reduced/repositioned the Gallery/About mandalas and kept decoration away from About actions.
- Replaced the old brush model with pale wood, silver ferrule and a full dark mop head. Desktop uses a smaller, capped-resolution renderer; phones use a lightweight scalable vector brush.
- Dragging (or arrow keys on the focused brush) parks it for the current section. Entering the next section clears the manual position. Escape restores automatic movement; Hide/Show controls are available.
- Brush section detection works in both scroll directions. Section-entry strokes have a six-second replay cooldown. Removed repeated movement-tween restarts during ordinary scrolling.
- Removed the mounted dot-pointer effect. The native cursor remains and the existing historical fluid-dye shader now has a restrained, more visible pointer/click response across the page.
- Section headings use short upward/fade entrances on section arrival, including reverse traversal, with reduced-motion support.

Focused checks only: TypeScript and scoped ESLint passed. Production adapter build passed with its existing warnings. Desktop 1440 x 900 and mobile 390 x 844 were visually checked; neither had horizontal overflow. Native drag produced pinned=true, entering About reset it to false, and scrolling upward returned the brush to Home. Mobile Hide/Show worked and loaded no brush WebGL canvas. This was not a physical-device performance benchmark or a guarantee of zero lag.

Screenshots: [desktop](desktop.jpg), [mobile](mobile.jpg).
