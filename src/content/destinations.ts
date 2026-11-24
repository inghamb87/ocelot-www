import type { Art } from "./properties";

export type Destination = {
  slug: string;
  name: string;
  country: string;
  seo: { title: string; description: string };
  intro: string;
  heroArt: Art;
  facts: { label: string; value: string }[];
  sections: { title: string; body: string[] }[];
  thingsToDo: { title: string; body: string }[];
  guideSlugs: string[];
};

export const destinations: Destination[] = [
  {
    slug: "nosara",
    name: "Nosara",
    country: "Costa Rica",
    seo: {
      title: "Nosara, Costa Rica travel guide",
      description:
        "Where to stay, when to go and how to get to Nosara on Costa Rica's Nicoya Peninsula. Stays chosen by Onyx, with a concierge for the whole trip.",
    },
    intro:
      "A surf town on the Nicoya Peninsula where the jungle runs to the sand. Nosara is known for the long, consistent break at Playa Guiones, for yoga and wellness, and for roads that are still mostly unpaved.",
    heroArt: { scene: "coast", seed: 71, alt: "The long beach at Playa Guiones, Nosara, at low tide" },
    facts: [
      { label: "Region", value: "Guanacaste, Nicoya Peninsula" },
      { label: "Nearest international airport", value: "Liberia (LIR), about 2.5 hours" },
      { label: "Local airstrip", value: "Nosara, domestic flights" },
      { label: "Known for", value: "Surf, wellness, wildlife" },
    ],
    sections: [
      {
        title: "The lay of the land",
        body: [
          "Nosara is a string of beaches and neighborhoods, not a single town center. Most visitors base themselves in Playa Guiones, where the surf schools, cafes and yoga studios cluster behind a protected strip of jungle.",
          "Building is kept back from the shore, so the beach itself stays wild: no towers and no beachfront bars. You reach the sand on foot along short paths through the trees.",
        ],
      },
      {
        title: "Getting around",
        body: [
          "Roads are mostly unpaved. They are dusty in the dry season and can be muddy in the green season. Many visitors rent a golf cart, an ATV or a 4x4, and many simply walk or cycle.",
          "A private transfer from Liberia is the simplest arrival. Your concierge can book it with your stay.",
        ],
      },
    ],
    thingsToDo: [
      { title: "Surf Playa Guiones", body: "A long sandy beach break that works at most tides, with waves for first lessons and for experienced surfers." },
      { title: "Yoga and wellness", body: "Daily classes, breathwork, massage and bodywork are easy to find. Nosara has been a wellness destination for decades." },
      { title: "Wildlife", body: "Howler monkeys, coatis and iguanas are everyday sights. Guided walks show you far more than you would spot alone." },
      { title: "Turtles at Ostional", body: "A protected nesting beach north of Nosara. Visits are guided and seasonal, and sightings are never guaranteed." },
      { title: "On the water", body: "Boat trips for dolphins and, in season, humpback whales. Fishing charters leave from nearby Playa Garza." },
      { title: "Sunset", body: "The whole town walks to the beach for it. Bring nothing but a towel." },
    ],
    guideSlugs: ["getting-to-nosara", "nosara-surf-guide", "a-week-in-nosara", "villa-or-room"],
  },
];

export function getDestination(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}
