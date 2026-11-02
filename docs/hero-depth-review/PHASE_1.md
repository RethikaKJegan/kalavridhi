# Dimensional hero — Phase 1, 2 November 2026

This is Phase 1 of the three-phase motion plan agreed in chat, not a claim that every phase of the original master specification is complete.

## Implemented

- Eight independent SVG image planes: watercolour background, gold mandala, architecture, botanical leaves, painted woman, two lotus groups, and peacock. Hand-authored luminance masks use the approved original image as their shared texture; the woman has not been regenerated or replaced by a 3D model.
- Motion springs give each plane a different, bounded mouse offset on wide screens with a fine pointer. Normal scrolling drives gentle differential vertical movement, with one fifth of that movement on smaller/touch screens. No scroll interception or infinite floating loop was added.
- Staggered artwork entrance using Motion, plus short CSS text/control entrances. Existing copy and CMS props remain real DOM content.
- Original static picture stays visible until the necessary artwork decodes. It also remains the reduced-motion and failed-asset fallback. Existing transparent mobile image and a smaller backing plate are used below 768px.
- Pointer tracking resets on leave, blur, hidden tab and leaving the hero viewport. Listener/observer cleanup is included. The existing 3D brush and ink implementation is unchanged.

## Assets and provenance

- Original: `public/images/decoration/hero-reference-collage-v3.webp` and its existing small variant, unchanged.
- New generated backing plate: `public/images/decoration/hero-depth-backing.webp` (1484 × 1060) and `hero-depth-backing-small.webp` (840 × 600), retaining alpha. This is an underpainting revealed behind moving cutouts, not a replacement screenshot or a new woman. A matching moving occlusion mask limits it to exposed gaps so it does not darken the original translucent pigment at rest.
- Generated with the built-in ImageGen tool, using the original collage as the edit target. Original output remains at `C:/Users/JKRFamily/.codex/generated_images/01a1906e-1d9e-7103-b3c3-d82c7a457e60/exec-9a71d35c-dafa-44eb-9c21-6130cd51ef23.png`.
- Reproduction of the WebP conversion: `node scripts/prepare-hero-depth-backing.mjs <generated-png-path>`.

### Exact generation prompt

Edit target: the attached decorative hero collage. Create a clean BACKGROUND PLATE for 2.5D parallax, same composition and landscape 1.4:1 aspect ratio, full canvas and positions. Remove the entire central woman including headwear, face, earring and torso; remove the blue peacock and its foreground tail; remove the large pink lotus immediately left of the woman's face and the large lower central lotus. Reconstruct behind removed subjects with matching saffron/coral watercolor, green botanical leaves and delicate gold pattern. Preserve as closely as possible the existing background mandalas, red circular halo, right-hand temple architecture, right Kathakali mask, watercolor washes, gold flecks and botanical edges. Hand-painted Indian folk art, intricate ink linework, warm ivory paper pigment. Keep all retained elements in their original locations, do not add subjects or text. This is the backing layer beneath exact original foreground cutouts. Genuine transparent outer edges, no rectangular paper background, no shadow, no UI. Do not render the removed woman or peacock or the two removed large lotus flowers.

## Verification

- TypeScript Cloudflare configuration and scoped ESLint passed.
- Final production Vite/Vinext build passed after the responsive asset and backing-occlusion refinements.
- Local browser visually inspected at 1440 × 900, 1024 × 768, 390 × 844 and 360 × 800. No horizontal overflow at the inspected widths. Desktop and mobile captures are in this directory.
- Browser pointer input produced different transforms on background, woman, lotus and peacock planes; scrolling produced different vertical transforms. This verifies actual interaction, not just the presence of animation code.
- Desktop enquiry dialog and narrow mobile navigation dialog opened and closed successfully. No messages were sent.
- Reduced-motion fallback is implemented and code-reviewed; an OS-level reduced-motion run was not performed. No measured FPS/Core Web Vitals or physical-device certification is claimed.

## Visual limits and remaining phases

The original painted character and reference composition are preserved at rest. The cutouts are hand-masked regions with softly blended boundaries, not individually remodelled objects; strong rotations would expose their limitations. Movement is deliberately small. Background details exposed between layers are reconstructed and are not guaranteed to match unseen original artwork.

The existing mobile artwork remains below the hero copy and benefits; it is not forced beside the text on a narrow screen. The desktop reference cannot be reproduced in the same arrangement at phone width.

Section-by-section brush choreography/pigment transitions belong to Phase 2. Gallery transitions and footer choreography belong to Phase 3. No CMS content, database records or photographs were changed. No Cloudflare deployment is part of this step.
