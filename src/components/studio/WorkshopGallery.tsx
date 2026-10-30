import Image from "next/image";

const moments = [
  { image: "workshop-creative-group.jpg", type: "WORKSHOP", alt: "Children and adults sharing artwork made during a creative workshop" },
  { image: "workshop-floral-craft.jpg", type: "WORKSHOP", alt: "A group displaying colourful floral craft work from a workshop" },
  { image: "workshop-hoop-painting.jpg", type: "WORKSHOP", alt: "Participants painting floral designs on fabric hoops" },
  { image: "exhibition-outdoor.jpg", type: "EXHIBITION", alt: "Kalavridhi art and painted bags displayed at an outdoor exhibition" },
  { image: "exhibition-market.jpg", type: "EXHIBITION", alt: "Colourful artwork and handmade pieces arranged at an exhibition stall" },
  { image: "exhibition-showcase.jpg", type: "EXHIBITION", alt: "Nishkala presenting painted artwork at an exhibition" },
];

export default function WorkshopGallery() {
  return (
    <div className="kv-moments kv-reveal" aria-label="Workshop and exhibition photos">
      {moments.map((moment, index) => (
        <figure className="kv-moment-card" key={moment.image}>
          <div className="kv-moment-photo">
            <Image src={`/images/workshop/${moment.image}`} alt={moment.alt} fill sizes="(max-width: 760px) 90vw, (max-width: 1100px) 45vw, 30vw" />
            <span className="kv-moment-type">{moment.type}</span>
            <span className="kv-moment-index">{String(index + 1).padStart(2, "0")}</span>
          </div>
        </figure>
      ))}
    </div>
  );
}
