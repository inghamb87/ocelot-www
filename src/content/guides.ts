import type { Art } from "./properties";

export type Guide = {
  slug: string;
  title: string;
  summary: string;
  category: "Getting there" | "Planning" | "Surf" | "Where to stay" | "Itineraries";
  minutes: number;
  updated: string; // ISO date
  art: Art;
  destinationSlug?: string;
  sections: { title: string; body: string[]; list?: string[] }[];
  related: { href: string; label: string }[];
};

export const guides: Guide[] = [
  {
    slug: "getting-to-nosara",
    title: "Getting to Nosara: flights, transfers and roads",
    summary: "Which airport to choose, how long the drive takes and what the roads are really like.",
    category: "Getting there",
    minutes: 4,
    updated: "2026-11-24",
    destinationSlug: "nosara",
    art: { scene: "path", seed: 81, alt: "An unpaved road through dry forest on the way to Nosara" },
    sections: [
      {
        title: "Choose your airport",
        body: [
          "Most international visitors fly into Liberia, officially Daniel Oduber Quirós International Airport (airport code LIR). From there Nosara is about 2.5 hours by road.",
          "San José's Juan Santamaría International Airport (airport code SJO) has more flights, but the drive to Nosara is roughly twice as long. It makes sense if you plan to see the Central Valley or Arenal first.",
          "Nosara also has a small airstrip with domestic flights. It is about 10 minutes from Playa Guiones. Schedules change with the season, so ask your concierge what is running on your dates.",
        ],
      },
      {
        title: "Book a private transfer",
        body: [
          "A private transfer is the easiest way to arrive. A driver meets you at arrivals and takes you to the door. Expect to pay around US$180 to US$200 from Liberia for up to four people.",
          "Onyx can arrange your transfer with your stay and match it to your flight times.",
        ],
      },
      {
        title: "If you drive yourself",
        body: [
          "The last stretch into Nosara is unpaved. In the dry season it is dusty and bumpy. In the green season, roughly May to November, expect mud and the occasional river crossing on back routes.",
        ],
        list: [
          "Rent a vehicle with high clearance. Four-wheel drive is the safe choice in the green season.",
          "Drive in daylight. Roads are unlit and signs are few.",
          "Download offline maps before you leave the airport.",
        ],
      },
    ],
    related: [
      { href: "/destinations/nosara", label: "Nosara travel guide" },
      { href: "/journal/a-week-in-nosara", label: "A week in Nosara" },
    ],
  },
  {
    slug: "nosara-surf-guide",
    title: "Nosara surf guide: Playa Guiones for every level",
    summary: "Why Guiones is one of the most reliable places to learn, and how to plan your sessions.",
    category: "Surf",
    minutes: 4,
    updated: "2026-11-24",
    destinationSlug: "nosara",
    art: { scene: "coast", seed: 82, alt: "Lines of swell rolling into Playa Guiones" },
    sections: [
      {
        title: "Why Guiones works",
        body: [
          "Playa Guiones is a long, open beach with a sandy bottom. It picks up swell most of the year, and with several miles of sand there is room to spread out.",
          "Whitewater near the shore suits first lessons. Farther out, the waves are longer and more powerful. That range is why families and mixed groups do well here.",
        ],
      },
      {
        title: "Plan around the tide and the wind",
        body: [
          "Mornings are usually calmest, before the onshore wind picks up. Many surfers go out at first light, rest through the middle of the day and return for the evening session.",
          "Tide changes the wave a lot. A local coach will pick the right window for your level each day.",
        ],
      },
      {
        title: "Lessons, boards and coaching",
        body: [
          "Sendero has an in-house surf school and shop with rentals and surf photography. Silvestre provides custom boards and professional instruction with video analysis, including lessons designed for children.",
          "Your Onyx trip credit can go toward lessons and coaching.",
        ],
      },
      {
        title: "Stay safe",
        body: ["Guiones is friendly, but it is still the open Pacific."],
        list: [
          "Ask about rip currents before you paddle out. They shift with the sandbanks.",
          "Wear reef-safe sunscreen and a rash guard. The sun is strong all year.",
          "Give other surfers space, and never surf alone at dawn or dusk.",
        ],
      },
    ],
    related: [
      { href: "/stays/sendero-nosara", label: "Sendero Hotel & Villas" },
      { href: "/stays/silvestre-nosara", label: "Silvestre Nosara Hotel & Residences" },
    ],
  },
  {
    slug: "villa-or-room",
    title: "Villa or room: how to choose",
    summary: "A simple way to decide between a hotel room, a suite and a private villa or residence.",
    category: "Where to stay",
    minutes: 3,
    updated: "2026-11-24",
    art: { scene: "pool", seed: 83, alt: "A private plunge pool beside a villa terrace" },
    sections: [
      {
        title: "Start with who is traveling",
        body: [
          "Couples and solo travelers are usually happiest in a room or suite. You are close to the restaurant and bar, and someone else handles everything.",
          "Families and groups almost always do better in a villa or residence. Separate bedrooms, a kitchen and a living room change the whole rhythm of a trip with children or friends.",
        ],
      },
      {
        title: "Then think about how long",
        body: [
          "For two or three nights, a room is simple and good value. For a week or more, a kitchen and laundry start to matter, and the per-person cost of a villa often compares well with booking several rooms.",
        ],
      },
      {
        title: "Questions worth asking",
        body: ["Before you request, tell your concierge:"],
        list: [
          "The ages of any children, and who can share a room.",
          "Whether a private pool matters, or a shared pool is fine.",
          "Whether you want to cook, have a chef cook, or eat out.",
          "Whether anyone needs a quiet place to work.",
        ],
      },
      {
        title: "In Nosara",
        body: [
          "Sendero offers both: rooms and suites for couples, and seven villas for groups. Silvestre is all residences, from two to four bedrooms, each with a full kitchen.",
        ],
      },
    ],
    related: [
      { href: "/stays", label: "All Onyx stays" },
      { href: "/concierge", label: "Ask the concierge" },
    ],
  },
  {
    slug: "when-to-visit-costa-rica",
    title: "When to visit Costa Rica: dry season and green season",
    summary: "What the two seasons mean for weather, crowds, wildlife and price.",
    category: "Planning",
    minutes: 4,
    updated: "2026-11-24",
    art: { scene: "canopy", seed: 84, alt: "Rain clouds lifting off green hills in Costa Rica" },
    sections: [
      {
        title: "Two seasons, not four",
        body: [
          "Costa Rica has a dry season, roughly December to April, and a green season, roughly May to November. Exact timing shifts by region and by year.",
          "On the Pacific coast, including Nosara, the dry season brings months of sun and almost no rain. The green season usually means bright mornings and afternoon showers, with the heaviest rain in September and October.",
        ],
      },
      {
        title: "Dry season: December to April",
        body: [
          "Reliable sun, easy roads and the busiest months of the year. Holiday weeks and school breaks fill early, so request well ahead and keep your dates flexible if you can.",
        ],
      },
      {
        title: "Green season: May to November",
        body: [
          "The landscape turns deep green, there are fewer visitors and many hotels lower their rates. Surf is often bigger. Some back roads become difficult, and a few businesses close for a break in the wettest weeks.",
        ],
      },
      {
        title: "Wildlife by season",
        body: [
          "Humpback whales visit the Pacific coast in two windows, roughly July to October and December to April. Sea turtles nest at Ostional most of the year, with the largest arrivals in the green season. Sightings are never guaranteed.",
        ],
      },
    ],
    related: [
      { href: "/journal/planning-a-multi-stop-costa-rica-trip", label: "Planning a multi-stop Costa Rica trip" },
      { href: "/destinations/nosara", label: "Nosara travel guide" },
    ],
  },
  {
    slug: "a-week-in-nosara",
    title: "A week in Nosara: a sample itinerary",
    summary: "Seven unhurried days of surf, food, wildlife and rest, with room to change your mind.",
    category: "Itineraries",
    minutes: 4,
    updated: "2026-11-24",
    destinationSlug: "nosara",
    art: { scene: "dusk", seed: 85, alt: "Sunset over the Pacific from Playa Guiones" },
    sections: [
      {
        title: "Days 1 and 2: arrive and find the rhythm",
        body: [
          "Land in Liberia, take a private transfer and reach Nosara by afternoon. Walk to the beach for sunset. That is the whole plan for day one.",
          "On day two, take a first surf lesson in the morning while the wind is light. Spend the afternoon in the shade.",
        ],
      },
      {
        title: "Days 3 and 4: go a little farther",
        body: [
          "Book a guided wildlife walk early, when animals are most active. Follow it with yoga or a massage.",
          "On day four, get on the water. Boat trips look for dolphins year-round and for humpback whales in season.",
        ],
      },
      {
        title: "Days 5 and 6: choose your own pace",
        body: [
          "Surfers will want more sessions by now. Others might ride horses on the beach, take an ATV to a waterfall or visit the turtle beach at Ostional with a guide.",
          "Keep one evening for a long dinner. In a villa or residence, a private chef makes it easy.",
        ],
      },
      {
        title: "Day 7: leave slowly",
        body: [
          "One more swim, a late breakfast and a transfer timed to your flight. If you have more days, add an inland stop on the way out.",
        ],
      },
    ],
    related: [
      { href: "/stays/sendero-nosara", label: "Sendero Hotel & Villas" },
      { href: "/stays/silvestre-nosara", label: "Silvestre Nosara Hotel & Residences" },
      { href: "/journal/getting-to-nosara", label: "Getting to Nosara" },
    ],
  },
  {
    slug: "planning-a-multi-stop-costa-rica-trip",
    title: "Planning a multi-stop Costa Rica trip",
    summary: "How many stops to make, how to order them and how long the drives really take.",
    category: "Planning",
    minutes: 4,
    updated: "2026-11-24",
    art: { scene: "terrace", seed: 86, alt: "A terrace looking over forested hills toward the coast" },
    sections: [
      {
        title: "Fewer stops, longer stays",
        body: [
          "Costa Rica looks small on a map, but mountain roads make travel slow. A good rule is one stop for every three or four nights. For a ten night trip, that means two or three bases, not five.",
        ],
      },
      {
        title: "Pair an inland stop with the coast",
        body: [
          "A classic shape is forest first, beach last. Start with volcano country around Arenal or the cloud forest at Monteverde, then finish on the Pacific so the last days are restful.",
          "Flying into Liberia keeps the northwest compact: Arenal, Monteverde and the Nicoya Peninsula are all within a few hours of each other.",
        ],
      },
      {
        title: "Budget time for transfers",
        body: [
          "Treat every move between stops as half a day. Private transfers remove the stress of driving unfamiliar roads, and a good driver will stop for coffee and views along the way.",
        ],
      },
      {
        title: "Let someone hold the threads",
        body: [
          "The more stops you add, the more a single planner helps. The Onyx concierge team books the stays, lines up the transfers and makes sure each check-in is expected.",
        ],
      },
    ],
    related: [
      { href: "/concierge", label: "Plan a trip with the concierge" },
      { href: "/journal/when-to-visit-costa-rica", label: "When to visit Costa Rica" },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
