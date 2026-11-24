// Property listings. One object per stay. Adding a listing means adding one
// object here; the page, sitemap, request form and API allowlist follow.
//
// This file is imported by the Cloudflare Pages Functions too (to validate
// requests), so keep it free of React, path aliases and browser APIs.
//
// Facts come from public sources and are unverified until Onyx confirms them.
// See README.md "Before launch".

export type Scene =
  | "coast"
  | "canopy"
  | "dusk"
  | "arch"
  | "pool"
  | "table"
  | "path"
  | "terrace";

export type Art = {
  scene: Scene;
  /** Any integer. Changes the shape of the illustration. */
  seed: number;
  /** Describes what the real photograph or film should show. */
  alt: string;
  /** Optional real image. When set it replaces the illustration. */
  image?: { src: string; width: number; height: number };
};

export type Room = {
  id: string;
  name: string;
  kind: "room" | "suite" | "villa" | "residence";
  /** Short line under the name, e.g. "Sleeps 4, two bedrooms". */
  specs: string[];
  blurb: string;
  features: string[];
  /** Villas and other high-value options get a more prominent card. */
  featured?: boolean;
  art: Art;
};

export type Property = {
  slug: string;
  name: string;
  shortName: string;
  place: string;
  region: string;
  country: string;
  destinationSlug: string;
  kindLabel: string;
  seo: { title: string; description: string };
  h1: string;
  hook: string;
  cardSummary: string;
  heroArt: Art;
  /** Indicative public "from" rate per night. null when not yet confirmed. */
  fromRate: { amount: number; currency: "USD" } | null;
  facts: { label: string; value: string }[];
  ratings: { display: boolean; items: { source: string; score: string }[]; note: string };
  tour: { intro: string; scenes: (Art & { title: string; caption: string })[] };
  honest: {
    intro: string;
    goodFor: string[];
    notFor: string[];
    expectations: { title: string; body: string }[];
  };
  roomsIntro: string;
  rooms: Room[];
  groupNote: string;
  location: {
    intro: string;
    logistics: { label: string; value: string }[];
    week: { day: string; plan: string }[];
    widerTrip: string;
  };
  proof: { themes: { title: string; body: string }[]; recognition: string[]; recognitionNote?: string };
  experiences: string[];
  faq: { q: string; a: string }[];
  officialUrl?: string;
};

export const properties: Property[] = [
  {
    slug: "sendero-nosara",
    name: "Sendero Hotel & Villas",
    shortName: "Sendero",
    place: "Playa Guiones, Nosara",
    region: "Guanacaste",
    country: "Costa Rica",
    destinationSlug: "nosara",
    kindLabel: "Design boutique hotel and villas",
    seo: {
      title: "Sendero Hotel & Villas, Nosara: design boutique",
      description:
        "A design-led jungle hideaway minutes from Playa Guiones. Request Sendero through Onyx: same price, a person confirms first, plus trip credit.",
    },
    h1: "Sendero Hotel & Villas, Nosara",
    hook: "A design-led boutique hideaway beside an 11-acre jungle preserve, a few minutes' walk from the Playa Guiones surf break.",
    cardSummary:
      "Earthy, art-filled rooms and seven private villas, with a jungle path that reaches the beach in about five minutes.",
    heroArt: {
      scene: "path",
      seed: 11,
      alt: "The jungle path at Sendero opening onto the surf at Playa Guiones",
    },
    fromRate: { amount: 261, currency: "USD" },
    facts: [
      { label: "Where", value: "Playa Guiones, Nosara" },
      { label: "Beach", value: "4 to 5 minute walk" },
      { label: "Style", value: "Design boutique, adult-oriented" },
      { label: "Size", value: "25 rooms and suites, 7 villas" },
    ],
    ratings: {
      display: true,
      items: [
        { source: "Tripadvisor", score: "4.8 of 5" },
        { source: "Booking.com", score: "about 9.1 of 10" },
      ],
      note: "Public guest ratings at the time of writing. They change over time.",
    },
    tour: {
      intro:
        "Sendero opened in 2023, founded by two friends who met on a Nosara surf trip. It is newer and more design-led than most of the town: hacienda-style buildings in repurposed brick and Costa Rican teak, with work by local artists on the walls.",
      scenes: [
        {
          scene: "path",
          seed: 21,
          title: "The sendero",
          caption: "A short jungle path, the sendero that gives the hotel its name, runs from the grounds to Playa Guiones.",
          alt: "A sandy path through jungle leading toward the ocean",
        },
        {
          scene: "table",
          seed: 22,
          title: "Sendero Kitchen",
          caption: "Casual plates and fine dining under a mature tree that rises through the dining area. Guests often call it the best kitchen in town.",
          alt: "An open-air dining room built around a large tree",
        },
        {
          scene: "arch",
          seed: 23,
          title: "Art and architecture",
          caption: "Repurposed brick, teak and a gallery of local art. Pieces in the rooms are for sale.",
          alt: "A brick and teak hacienda-style building with arched openings",
        },
        {
          scene: "pool",
          seed: 24,
          title: "A villa at dusk",
          caption: "Several villas have a private plunge pool, a kitchenette and more than one bedroom.",
          alt: "A private villa plunge pool at dusk",
        },
        {
          scene: "canopy",
          seed: 25,
          title: "The preserve",
          caption: "The hotel sits beside an 11-acre nature preserve. Howler monkeys, coatis and iguanas pass through the grounds.",
          alt: "Dense jungle canopy in morning light",
        },
        {
          scene: "terrace",
          seed: 26,
          title: "Studio and bar",
          caption: "Daily yoga and breathwork in the studio, then the open-air bar after the evening surf.",
          alt: "An open-air studio and bar among the trees",
        },
      ],
    },
    honest: {
      intro:
        "Sendero is a specific kind of place. It is better to know that before you request it.",
      goodFor: [
        "Couples and solo travelers",
        "Design and wellness travelers who care about food",
        "Surfers who want to walk to the break",
        "Families and groups, in the villas",
      ],
      notFor: [
        "A big family pool day",
        "A polished, paved walk into town",
        "A party scene",
      ],
      expectations: [
        {
          title: "The pool is stylish and small",
          body: "It is a saltwater pool made for a dip and a drink, not for laps or for children to play in all afternoon.",
        },
        {
          title: "The mood is adult-oriented",
          body: "Sendero describes itself as adult-oriented and is most popular with couples and solo travelers. Families fit best in the villas.",
        },
        {
          title: "Town is a dusty 15 minute walk",
          body: "Shops, outside gyms and other restaurants are about 15 minutes away on unpaved roads. The hotel lends bikes at no charge.",
        },
        {
          title: "Smaller rooms have compact beds",
          body: "Guests report that queen beds in the smaller rooms feel closer to a double. If bed size matters, ask us for a suite or villa.",
        },
      ],
    },
    roomsIntro:
      "Sendero has 25 rooms and suites and 7 private villas. Tell us which you prefer and your concierge confirms the exact category with the hotel.",
    rooms: [
      {
        id: "villa",
        name: "Private villa",
        kind: "villa",
        featured: true,
        specs: ["Multiple bedrooms", "Kitchenette", "Private plunge pool in several"],
        blurb:
          "The most space and the most privacy at Sendero. The right choice for families, groups and longer stays.",
        features: [
          "More than one bedroom",
          "Kitchenette",
          "Private plunge pool in several villas",
          "Your concierge can arrange a private chef",
        ],
        art: { scene: "pool", seed: 31, alt: "A Sendero villa with a private plunge pool" },
      },
      {
        id: "suite",
        name: "Suite",
        kind: "suite",
        specs: ["More room to spread out", "Best for couples"],
        blurb:
          "A larger room in the same earthy, minimalist style, with local art on the walls.",
        features: ["Larger layout", "Local art, with pieces for sale", "Steps from the kitchen and bar"],
        art: { scene: "arch", seed: 32, alt: "A Sendero suite with teak furniture and local art" },
      },
      {
        id: "room",
        name: "Room",
        kind: "room",
        specs: ["Queen bed", "Best for solo travelers and couples"],
        blurb:
          "The simplest way to stay at Sendero. Guests note the queen beds in smaller rooms feel compact.",
        features: ["Queen bed", "Local art, with pieces for sale", "Free bikes"],
        art: { scene: "canopy", seed: 33, alt: "A Sendero room looking out to the trees" },
      },
    ],
    groupNote:
      "Traveling as a group or family? Villas include kitchenettes, and several have private plunge pools. Your concierge can arrange the villa, transfers and a private chef in advance.",
    location: {
      intro:
        "Sendero sits beside an 11-acre nature preserve in Playa Guiones, the surf heart of Nosara. The beach is a 4 to 5 minute walk along the jungle path.",
      logistics: [
        { label: "Liberia airport (LIR)", value: "About 2.5 hours by road" },
        { label: "Nosara airstrip", value: "About 10 minutes by road" },
        { label: "Private transfer from Liberia", value: "Around US$180 to US$200 for up to four people" },
        { label: "Playa Guiones", value: "4 to 5 minute walk" },
        { label: "Town shops and gyms", value: "About 15 minutes on foot, unpaved roads" },
      ],
      week: [
        { day: "Day 1", plan: "Arrive from Liberia by private transfer. Walk the sendero to the beach for sunset." },
        { day: "Day 2", plan: "Morning lesson with the in-house surf school. Lunch at Sendero Kitchen." },
        { day: "Day 3", plan: "Yoga and breathwork in the studio. An afternoon by bike." },
        { day: "Day 4", plan: "Guided wildlife morning. Dinner in the fine dining room." },
        { day: "Day 5", plan: "Free surf, then a boat trip along the coast." },
        { day: "Day 6", plan: "Work from Outpost, Nosara's private office club, if you need to. Sunset on Guiones." },
        { day: "Day 7", plan: "Last swim, then on to your next stop." },
      ],
      widerTrip:
        "Nosara pairs well with a few days inland before or after. Your concierge can connect Sendero to the rest of a Costa Rica trip and handle the transfers between stops.",
    },
    proof: {
      themes: [
        { title: "Design", body: "Guests single out the architecture, the art and the feeling of calm." },
        { title: "Food", body: "Sendero Kitchen is regularly described as the best kitchen in town." },
        { title: "Service", body: "Reviews mention warm staff who remember names." },
        { title: "Loyalty", body: "Many guests come back, which is rare for a hotel this new." },
      ],
      recognition: [],
    },
    experiences: [
      "Private airport transfers",
      "Surf lessons and board rental",
      "Guided wildlife walks",
      "A private chef in your villa",
      "Yoga and breathwork",
      "Boat trips and fishing",
    ],
    faq: [
      {
        q: "How far is Sendero from the beach?",
        a: "Playa Guiones is a 4 to 5 minute walk along a jungle path from the hotel grounds.",
      },
      {
        q: "Is Sendero right for families?",
        a: "In the villas, yes. They have multiple bedrooms and kitchenettes, and several have a private plunge pool. The main pool is small and the hotel is adult-oriented, so it is not built for a family pool day.",
      },
      {
        q: "How do I get to Sendero?",
        a: "Most guests fly into Liberia (LIR), about 2.5 hours away by road. The Nosara airstrip is about 10 minutes from the hotel. Your concierge can arrange a private transfer.",
      },
      {
        q: "Can I work from Sendero?",
        a: "Guests have access to Outpost, Nosara's private office membership club.",
      },
    ],
  },
  {
    slug: "silvestre-nosara",
    name: "Silvestre Nosara Hotel & Residences",
    shortName: "Silvestre",
    place: "Playa Guiones, Nosara",
    region: "Guanacaste",
    country: "Costa Rica",
    destinationSlug: "nosara",
    kindLabel: "Nine private residences with hotel service",
    seo: {
      title: "Silvestre Nosara Hotel & Residences: family residences",
      description:
        "Nine grand residences steps from the Playa Guiones surf break. Request Silvestre through Onyx: a person confirms first, plus trip credit.",
    },
    h1: "Silvestre Nosara Hotel & Residences",
    hook: "Nine grand residences in the jungle, steps from the Playa Guiones surf break, with the service of a hotel and the space of a home.",
    cardSummary:
      "Two to four bedroom residences with full kitchens, a rooftop pool and bar, and a surfboard waiting for you.",
    heroArt: {
      scene: "terrace",
      seed: 41,
      alt: "The rooftop terrace and infinity pool at Silvestre above the jungle canopy",
    },
    fromRate: null,
    facts: [
      { label: "Where", value: "Playa Guiones, Nosara" },
      { label: "Beach", value: "Steps from the surf break" },
      { label: "Style", value: "Private residences, family-friendly" },
      { label: "Size", value: "9 residences, 2 to 4 bedrooms" },
    ],
    ratings: {
      display: true,
      items: [{ source: "Google", score: "4.9 of 5" }],
      note: "Public guest rating shown by Silvestre at the time of writing. It changes over time.",
    },
    tour: {
      intro:
        "Silvestre blends the service of a hotel with the privacy, space and freedom of a home. Each residence has a full kitchen and generous living space, and the rooftop looks out over the jungle canopy.",
      scenes: [
        {
          scene: "terrace",
          seed: 51,
          title: "Rooftop terrace",
          caption: "A rooftop bar, infinity pool and lounge set in the jungle canopy.",
          alt: "A rooftop infinity pool and lounge surrounded by treetops",
        },
        {
          scene: "coast",
          seed: 52,
          title: "Surf",
          caption: "Your own custom Jim Banks surfboard, and professional instruction with video analysis.",
          alt: "A surfer walking toward the break at Playa Guiones",
        },
        {
          scene: "arch",
          seed: 53,
          title: "Residences",
          caption: "Two to four bedrooms, a full kitchen, a washer and dryer, and business-grade internet.",
          alt: "The living room and kitchen of a Silvestre residence",
        },
        {
          scene: "pool",
          seed: 54,
          title: "Wellness",
          caption: "In-residence spa treatments. Tropical Garden residences add an ice bath and a barrel sauna.",
          alt: "A barrel sauna and cold plunge in a private garden",
        },
        {
          scene: "table",
          seed: 55,
          title: "Breakfast on the roof",
          caption: "Breakfast each morning on the rooftop terrace, then coffee and cocktails through the day.",
          alt: "Breakfast served on the rooftop terrace",
        },
        {
          scene: "canopy",
          seed: 56,
          title: "Studio",
          caption: "An open gym, with personal training available.",
          alt: "An open-air gym facing the jungle",
        },
      ],
    },
    honest: {
      intro:
        "Silvestre is a small collection of large residences, not a sprawling resort. Here is who it suits.",
      goodFor: [
        "Families and groups who want space and a kitchen",
        "Surfers of every level, including children",
        "Longer stays and remote work",
        "Travelers who value privacy over a busy lobby",
      ],
      notFor: [
        "A large resort with several restaurants on site",
        "Travelers who want a single hotel room for a night or two",
      ],
      expectations: [
        {
          title: "You have a home, not a hotel room",
          body: "Every residence has a full kitchen, living space and laundry. Daily cleaning and breakfast are included.",
        },
        {
          title: "Dinner is your choice",
          body: "Breakfast, coffee and cocktails are served on the rooftop. For other meals you can cook, book a private chef, or walk to the restaurants nearby.",
        },
        {
          title: "Nine residences in total",
          body: "With so few residences, popular dates fill early. Flexible dates make confirmation easier.",
        },
      ],
    },
    roomsIntro:
      "Five residence types, all with a full kitchen, washer and dryer, daily cleaning, daily breakfast, business-grade internet and access to the open gym.",
    rooms: [
      {
        id: "penthouse-grand-residence",
        name: "Penthouse Grand Residence",
        kind: "residence",
        featured: true,
        specs: ["2,000 sq ft", "Four bedrooms", "Private bar"],
        blurb: "The largest residence at Silvestre, for big families and groups traveling together.",
        features: ["Four bedrooms", "Two ensuite bathrooms", "Private balcony", "Private bar", "Full kitchen"],
        art: { scene: "terrace", seed: 61, alt: "The Penthouse Grand Residence balcony above the trees" },
      },
      {
        id: "tropical-garden-grand-residence",
        name: "Tropical Garden Grand Residence",
        kind: "residence",
        featured: true,
        specs: ["1,000 sq ft", "Sleeps 4", "Two bedrooms"],
        blurb: "A ground-floor residence with a private garden, an ice bath and a barrel sauna.",
        features: ["Private garden", "Ice bath and barrel sauna", "Two bedrooms", "Full kitchen"],
        art: { scene: "pool", seed: 62, alt: "The private garden of a Tropical Garden Grand Residence" },
      },
      {
        id: "grand-residence",
        name: "Grand Residence",
        kind: "residence",
        specs: ["1,000 sq ft", "Sleeps 4", "Two bedrooms"],
        blurb: "Two bedrooms, each with its own bathroom, and a private balcony.",
        features: ["Two ensuite bathrooms", "Private balcony", "Full kitchen"],
        art: { scene: "arch", seed: 63, alt: "A Grand Residence living room opening to a balcony" },
      },
      {
        id: "family-residence",
        name: "Family Residence",
        kind: "residence",
        specs: ["1,000 sq ft", "Sleeps 5", "Two bedrooms"],
        blurb: "Laid out for a family of five, with two ensuite bathrooms and a balcony.",
        features: ["Sleeps 5", "Two ensuite bathrooms", "Private balcony", "Full kitchen"],
        art: { scene: "canopy", seed: 64, alt: "A Family Residence bedroom with jungle views" },
      },
      {
        id: "family-double-residence",
        name: "Family Double Residence",
        kind: "residence",
        specs: ["1,000 sq ft", "Sleeps 7", "Two bedrooms"],
        blurb: "The same footprint arranged to sleep seven.",
        features: ["Sleeps 7", "Two ensuite bathrooms", "Private balcony", "Full kitchen"],
        art: { scene: "dusk", seed: 65, alt: "A Family Double Residence at dusk" },
      },
    ],
    groupNote:
      "Traveling with children or a larger group? Tell us ages and bed needs. Your concierge matches the residence, arranges transfers and can book a private chef.",
    location: {
      intro:
        "Silvestre is in Playa Guiones, with direct access to one of the most consistent surf breaks in the world and restaurants and bars a short walk away.",
      logistics: [
        { label: "Liberia airport (LIR)", value: "About 2.5 hours by road" },
        { label: "Nosara airstrip", value: "About 10 minutes by road" },
        { label: "Private transfers", value: "From Liberia or Nosara airport, arranged for you" },
        { label: "Playa Guiones", value: "Steps away" },
      ],
      week: [
        { day: "Day 1", plan: "Arrive by private transfer. Settle in, then cocktails on the rooftop." },
        { day: "Day 2", plan: "Private surf lessons for adults and children. Breakfast on the terrace first." },
        { day: "Day 3", plan: "Dolphin and whale watching by boat, in season." },
        { day: "Day 4", plan: "In-residence massage. A private chef cooks dinner." },
        { day: "Day 5", plan: "ATV ride to a waterfall, or a canopy zipline." },
        { day: "Day 6", plan: "Turtle watching at Ostional, in season. Sunset horseback ride." },
        { day: "Day 7", plan: "A last surf, then on to your next stop." },
      ],
      widerTrip:
        "With a kitchen and laundry, Silvestre works well as the long, restful stop of a Costa Rica trip. Your concierge can add inland stays before or after and handle the transfers.",
    },
    proof: {
      themes: [
        { title: "Space", body: "Guests value having a real home: kitchens, living rooms and room for children." },
        { title: "Service", body: "Reviews name staff individually and describe feeling looked after." },
        { title: "Location", body: "The beach, restaurants and bars are all within walking distance." },
      ],
      recognition: [
        "MICHELIN Key 2026",
        "TIME World's Greatest Places 2024",
        "Forbes Vetted, Best Resorts in Costa Rica 2025",
      ],
      recognitionNote: "Recognition as listed by Silvestre on its own website.",
    },
    experiences: [
      "Private surf lessons, including for children",
      "Dolphin and whale watching",
      "Fishing charters from Playa Garza",
      "In-residence massage and wellness",
      "A private chef",
      "ATV, zipline and horseback tours",
      "Turtle watching at Ostional",
    ],
    officialUrl: "https://silvestre.cr/",
    faq: [
      {
        q: "How close is Silvestre to the beach?",
        a: "Silvestre is steps from Playa Guiones and its surf break.",
      },
      {
        q: "Is Silvestre good for families?",
        a: "Yes. Residences have two to four bedrooms and full kitchens, and surf lessons are available for children with boards sized for them.",
      },
      {
        q: "What is included in a stay?",
        a: "Daily breakfast, daily cleaning, business-grade internet, access to the open gym and use of a custom surfboard are included, according to Silvestre.",
      },
      {
        q: "How do I get to Silvestre?",
        a: "Most guests fly into Liberia (LIR), about 2.5 hours away by road, or into the Nosara airstrip about 10 minutes away. Private transfers can be arranged from either.",
      },
    ],
  },
];

export function getProperty(slug: string): Property | undefined {
  return properties.find((p) => p.slug === slug);
}
