// ─────────────────────────────────────────────────────
//  Kalavridhi Arts — site data
//  WhatsApp: +91 89256 26784
// ─────────────────────────────────────────────────────

export const SITE = {
  name: "Kalavridhi Arts",
  tagline: "Grow Your Dream",
  whatsapp: "918925626784",
  instagram: "https://www.instagram.com/kala_vridhi_arts/",
  domain: "https://kalavridhi-arts.com",
};

export function waLink(msg: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`;
}

export const ART_FORMS = [
  {
    id: "zendoodle",
    name: "Zendoodle Art",
    image: "/images/artwork/zendoodle-art.jpeg",
    alt: "Zendoodle art — intricate black and white patterned portrait by Nishkala Krishna",
    category: "Drawing & Patterns",
    tagline: "Meditative patterns that tell stories",
  },
  {
    id: "mandala",
    name: "Mandala Art",
    image: "/images/artwork/mandala-art.jpeg",
    alt: "Mandala art — architectural black and white mandala by Nishkala Krishna",
    category: "Drawing & Patterns",
    tagline: "Sacred geometry, timeless beauty",
  },
  {
    id: "madhubani",
    name: "Madhubani Art",
    image: "/images/artwork/madhubani-art.jpeg",
    alt: "Madhubani art — colourful peacock on black background by Nishkala Krishna",
    category: "Traditional",
    tagline: "Ancient folk art from Mithila",
  },
  {
    id: "watercolour-pencil",
    name: "Water Colour Pencil Art",
    image: "/images/artwork/watercolour-pencil-art.jpeg",
    alt: "Water colour pencil art — bright peacock on yellow by Nishkala Krishna",
    category: "Painting",
    tagline: "Vibrant blended colour techniques",
  },
  {
    id: "kids-colour-pencil",
    name: "Kids Colour Pencil Art",
    image: "/images/artwork/kids-colour-pencil-art.jpeg",
    alt: "Kids colour pencil art — pastel lotus flowers",
    category: "Kids",
    tagline: "Joyful art for young creators",
  },
  {
    id: "fabric-painting",
    name: "Fabric Painting",
    image: "/images/artwork/fabric-painting.jpeg",
    alt: "Fabric painting — Krishna and Radha on crimson fabric hoop",
    category: "Fabric & Crafts",
    tagline: "Bring fabric to life with colour",
  },
  {
    id: "tanjore-fabric",
    name: "Tanjore Fabric Painting",
    image: "/images/artwork/tanjore-fabric-painting.jpeg",
    alt: "Tanjore fabric painting — gold and jewel-adorned Goddess on deep blue fabric",
    category: "Traditional",
    tagline: "Royal heritage on fabric canvas",
  },
  {
    id: "acrylic",
    name: "Acrylic Painting",
    image: "/images/artwork/acrylic-painting.jpeg",
    alt: "Acrylic painting — dramatic split-face Kathakali portrait by Nishkala Krishna",
    category: "Painting",
    tagline: "Bold, vivid, expressive on canvas",
  },
  {
    id: "kerala-mural",
    name: "Kerala Mural Painting",
    image: "/images/artwork/kerala-mural-painting.jpeg",
    alt: "Kerala mural painting — vibrant Krishna and Radha in classical mural style",
    category: "Traditional",
    tagline: "Ancient temple art brought home",
  },
  {
    id: "poster-painting",
    name: "Poster Painting",
    image: "/images/artwork/poster-painting.jpeg",
    alt: "Poster painting — Nishkala Krishna painting a large Krishna poster",
    category: "Painting",
    tagline: "Bold illustration and colour mastery",
  },
  {
    id: "glass-painting",
    name: "Glass Painting",
    image: "/images/artwork/glass-painting.jpg",
    alt: "Glass painting — ornate Krishna with gold border work",
    category: "Fabric & Crafts",
    tagline: "Luminous art on glass",
  },
  {
    id: "watercolour",
    name: "Water Colour Painting",
    image: null,
    alt: "Water colour painting",
    category: "Painting",
    tagline: "Soft washes, endless expression",
  },
  {
    id: "pencil-shading",
    name: "Pencil Shading",
    image: null,
    alt: "Pencil shading art",
    category: "Drawing & Patterns",
    tagline: "Master light, shadow and depth",
  },
];

export const GALLERY_ARTWORKS = [
  { id: 1, title: "Tanjore Fabric Painting", image: "/images/artwork/tanjore-fabric-painting.jpeg", alt: "Gold-on-blue Goddess in Tanjore style", medium: "Fabric, gold work", artForm: "Tanjore Fabric Painting" },
  { id: 2, title: "Kerala Mural — Krishna & Radha", image: "/images/artwork/kerala-mural-painting.jpeg", alt: "Vivid Krishna and Radha in Kerala mural style", medium: "Acrylic", artForm: "Kerala Mural Painting" },
  { id: 3, title: "Madhubani Peacock", image: "/images/artwork/madhubani-art.jpeg", alt: "Peacock on black Madhubani painting", medium: "Ink & colour", artForm: "Madhubani Art" },
  { id: 4, title: "Zendoodle Portrait", image: "/images/artwork/zendoodle-art.jpeg", alt: "Black and white Zendoodle woman portrait", medium: "Ink on paper", artForm: "Zendoodle Art" },
  { id: 5, title: "Acrylic — Kathakali Fusion", image: "/images/artwork/acrylic-painting.jpeg", alt: "Split face Kathakali and Theyyam portrait in acrylic", medium: "Acrylic on canvas", artForm: "Acrylic Painting" },
  { id: 6, title: "Glass Painting — Lord Krishna", image: "/images/artwork/glass-painting.jpg", alt: "Ornate Krishna with gold border on glass", medium: "Glass painting", artForm: "Glass Painting" },
  { id: 7, title: "Mandala Art", image: "/images/artwork/mandala-art.jpeg", alt: "Intricate architectural mandala in black and white", medium: "Ink on paper", artForm: "Mandala Art" },
  { id: 8, title: "Watercolour Pencil Peacock", image: "/images/artwork/watercolour-pencil-art.jpeg", alt: "Colourful peacock on yellow watercolour background", medium: "Water colour pencil", artForm: "Water Colour Pencil Art" },
  { id: 9, title: "Fabric Painting — Radha Krishna", image: "/images/artwork/fabric-painting.jpeg", alt: "Krishna and Radha on crimson fabric hoop", medium: "Fabric paint", artForm: "Fabric Painting" },
];

export const WORKSHOPS = [
  // When real workshops are added, they go here with status:'published'
];

export const RECOGNITION = [
  {
    id: 1,
    image: "/images/awards/award-dedication.png",
    alt: "Award trophy presented to Mrs. Nishkala Krishna by Little Angels Play School",
    caption: "In Recognition of Unwavering Commitment For Exceptional Dedication",
    organization: "Little Angels Play School",
    period: "2025–2026",
    type: "award",
  },
  {
    id: 2,
    image: "/images/awards/certificate-oviya-sangamam.png",
    alt: "Certificate of Achievement for participation in Chennaiyil Oar Oviya Sangamam 2026",
    caption: "Certificate of Participation & Contribution",
    organization: "Chennaiyil Oar Oviya Sangamam 2026, Wings Convention Centre, Chennai",
    period: "22 February 2026",
    type: "certificate",
  },
  {
    id: 3,
    image: null, // Pending — client to supply medal photo
    alt: "Award medal — details pending",
    caption: "Award — details to be confirmed",
    organization: "",
    period: "",
    type: "award",
    pending: true,
  },
];
