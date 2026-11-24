import { useId } from "react";
import type { Art as ArtData, Scene } from "@/content/properties";
import { site } from "@/content/site";

/*
 * Placeholder art. Until photography and film exist, every picture slot is
 * filled with a generated "strata" illustration: banded layers of sky, sea,
 * sand and canopy, like the bands in polished onyx. Each one is drawn from a
 * seed, so a given slot always looks the same.
 *
 * To use a real photograph, add `image: { src, width, height }` to the art
 * entry in src/content. The illustration is replaced and the caption removed.
 */

const C = {
  paper: "#ffffff",
  shell: "#f9f3ef",
  sand: "#e9dccf",
  sandDeep: "#d8c4b1",
  stone: "#c5c0b9",
  mist: "#dfe8ec",
  haze: "#b7c7d3",
  sea: "#4b6c8c",
  seaDeep: "#2c507a",
  navy: "#15355c",
  night: "#0e2440",
  sageLight: "#c9c9b4",
  sage: "#a5a58d",
  moss: "#6f7a5c",
  fern: "#48573f",
  forest: "#2e3b2b",
  clay: "#c77558",
  clayDeep: "#b66346",
  blush: "#ecc3ae",
  teak: "#8b5a3c",
  ink: "#25211f",
};

const W = 1200;
const H = 800;

function rng(seed: number) {
  let a = (seed * 2654435761) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/** A horizontal band whose top edge undulates. Returns the edge and the fill. */
function band(rand: () => number, y: number, amp: number, waves: number) {
  const p1 = rand() * Math.PI * 2;
  const p2 = rand() * Math.PI * 2;
  const f2 = waves * (1.7 + rand());
  const steps = 24;
  const pts: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const yy =
      y +
      amp * Math.sin(t * Math.PI * 2 * waves + p1) +
      amp * 0.35 * Math.sin(t * Math.PI * 2 * f2 + p2);
    pts.push([t * W, yy]);
  }
  let edge = `M${r1(pts[0]![0])},${r1(pts[0]![1])}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1]!;
    const [x1, y1] = pts[i]!;
    const mx = (x0 + x1) / 2;
    edge += ` C${r1(mx)},${r1(y0)} ${r1(mx)},${r1(y1)} ${r1(x1)},${r1(y1)}`;
  }
  return { edge, fill: `${edge} L${W},${H} L0,${H} Z` };
}

type Layer = { y: number; amp: number; waves: number; color: string; line?: string };

function Bands({ rand, layers }: { rand: () => number; layers: Layer[] }) {
  return (
    <>
      {layers.map((l, i) => {
        const b = band(rand, l.y, l.amp, l.waves);
        return (
          <g key={i}>
            <path d={b.fill} fill={l.color} />
            {l.line ? (
              <path d={b.edge} fill="none" stroke={l.line} strokeWidth="1.5" strokeOpacity="0.55" />
            ) : null}
          </g>
        );
      })}
    </>
  );
}

function Sky({ id, top, bottom }: { id: string; top: string; bottom: string }) {
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id})`} />
    </>
  );
}

function sceneBody(scene: Scene, seed: number, id: string) {
  const rand = rng(seed);
  const sunX = 250 + rand() * 700;

  switch (scene) {
    case "coast":
      return (
        <>
          <Sky id={`${id}s`} top={C.mist} bottom={C.shell} />
          <circle cx={sunX} cy={352} r={78} fill={C.blush} />
          <Bands
            rand={rand}
            layers={[
              { y: 372, amp: 3, waves: 1, color: C.haze },
              { y: 400, amp: 4, waves: 2, color: C.sea, line: C.mist },
              { y: 470, amp: 7, waves: 2, color: C.seaDeep, line: C.haze },
              { y: 560, amp: 10, waves: 3, color: C.sea, line: C.shell },
              { y: 628, amp: 12, waves: 2, color: C.shell },
              { y: 650, amp: 14, waves: 2, color: C.sand, line: C.paper },
              { y: 730, amp: 18, waves: 1, color: C.sandDeep },
            ]}
          />
        </>
      );
    case "canopy":
      return (
        <>
          <Sky id={`${id}s`} top={C.shell} bottom={C.mist} />
          <circle cx={sunX} cy={210} r={64} fill={C.paper} />
          <Bands
            rand={rand}
            layers={[
              { y: 330, amp: 26, waves: 1, color: C.sageLight },
              { y: 420, amp: 34, waves: 2, color: C.sage, line: C.shell },
              { y: 510, amp: 40, waves: 2, color: C.moss, line: C.sageLight },
              { y: 600, amp: 44, waves: 3, color: C.fern, line: C.sage },
              { y: 700, amp: 36, waves: 2, color: C.forest, line: C.moss },
            ]}
          />
        </>
      );
    case "dusk":
      return (
        <>
          <Sky id={`${id}s`} top={C.navy} bottom={C.clay} />
          <circle cx={sunX} cy={452} r={92} fill={C.blush} />
          <Bands
            rand={rand}
            layers={[
              { y: 470, amp: 3, waves: 1, color: C.seaDeep, line: C.blush },
              { y: 530, amp: 6, waves: 2, color: C.navy, line: C.sea },
              { y: 610, amp: 9, waves: 2, color: C.night, line: C.seaDeep },
              { y: 700, amp: 26, waves: 1, color: C.ink },
            ]}
          />
        </>
      );
    case "terrace":
      return (
        <>
          <Sky id={`${id}s`} top={C.mist} bottom={C.shell} />
          <circle cx={sunX} cy={170} r={58} fill={C.blush} />
          <Bands
            rand={rand}
            layers={[
              { y: 300, amp: 24, waves: 1, color: C.sageLight },
              { y: 370, amp: 34, waves: 2, color: C.moss, line: C.sageLight },
              { y: 450, amp: 38, waves: 2, color: C.fern, line: C.sage },
            ]}
          />
          {/* infinity edge: water runs flat to the treetops */}
          <rect x="0" y="540" width={W} height="170" fill={C.sea} />
          <rect x="0" y="540" width={W} height="5" fill={C.mist} />
          <path d="M120,600 H420 M620,640 H1010 M260,676 H560" stroke={C.haze} strokeWidth="3" strokeLinecap="round" />
          <rect x="0" y="710" width={W} height="90" fill={C.sand} />
          <rect x="0" y="710" width={W} height="6" fill={C.sandDeep} />
        </>
      );
    case "pool":
      return (
        <>
          <Sky id={`${id}s`} top={C.seaDeep} bottom={C.blush} />
          <Bands
            rand={rand}
            layers={[
              { y: 300, amp: 34, waves: 2, color: C.fern, line: C.moss },
              { y: 380, amp: 30, waves: 2, color: C.forest, line: C.fern },
            ]}
          />
          <rect x="0" y="470" width={W} height="330" fill={C.sandDeep} />
          <rect x="0" y="470" width={W} height="8" fill={C.sand} />
          {/* plunge pool seen in perspective */}
          <path d="M330,560 H870 L1010,740 H190 Z" fill={C.seaDeep} />
          <path d="M330,560 H870 L884,578 H316 Z" fill={C.navy} />
          <path d="M420,630 H640 M560,680 H860 M330,706 H520" stroke={C.haze} strokeWidth="3" strokeLinecap="round" />
        </>
      );
    case "arch": {
      const clip = `${id}c`;
      return (
        <>
          <rect width={W} height={H} fill={C.sand} />
          <rect width={W} height="120" fill={C.sandDeep} />
          <defs>
            <clipPath id={clip}>
              <path d="M150,700 V360 A150,150 0 0 1 450,360 V700 Z" />
              <path d="M525,700 V360 A150,150 0 0 1 825,360 V700 Z" />
              <path d="M900,700 V360 A150,150 0 0 1 1200,360 V700 Z" />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clip})`}>
            <rect width={W} height={H} fill={C.mist} />
            <circle cx={sunX} cy={330} r={56} fill={C.blush} />
            <Bands
              rand={rand}
              layers={[
                { y: 430, amp: 22, waves: 2, color: C.sage, line: C.shell },
                { y: 500, amp: 28, waves: 2, color: C.moss, line: C.sageLight },
                { y: 590, amp: 26, waves: 3, color: C.fern, line: C.sage },
              ]}
            />
          </g>
          <rect x="0" y="700" width={W} height="100" fill={C.teak} />
          <rect x="0" y="700" width={W} height="6" fill={C.clayDeep} />
          <rect x="0" y="0" width="60" height="700" fill={C.clay} />
        </>
      );
    }
    case "table":
      return (
        <>
          <Sky id={`${id}s`} top={C.shell} bottom={C.sand} />
          <Bands
            rand={rand}
            layers={[
              { y: 250, amp: 16, waves: 2, color: C.sageLight },
              { y: 310, amp: 22, waves: 2, color: C.sage, line: C.shell },
            ]}
          />
          <rect x="0" y="380" width={W} height="420" fill={C.sand} />
          <rect x="0" y="640" width={W} height="160" fill={C.sandDeep} />
          <rect x="0" y="640" width={W} height="5" fill={C.clayDeep} />
          {/* the tree that rises through the dining room */}
          <path d="M565,800 C575,600 548,470 590,300 H650 C688,470 665,600 680,800 Z" fill={C.teak} />
          <circle cx="430" cy="190" r="170" fill={C.moss} />
          <circle cx="800" cy="170" r="190" fill={C.fern} />
          <circle cx="610" cy="110" r="200" fill={C.forest} />
          <circle cx="330" cy="300" r="90" fill={C.fern} />
          <circle cx="900" cy="310" r="100" fill={C.moss} />
          {/* two tables */}
          <path d="M130,600 H450 M770,600 H1090" stroke={C.ink} strokeWidth="12" strokeLinecap="round" />
          <path d="M190,606 V740 M390,606 V740 M830,606 V740 M1030,606 V740" stroke={C.ink} strokeWidth="6" strokeLinecap="round" />
        </>
      );
    case "path":
      return (
        <>
          <Sky id={`${id}s`} top={C.mist} bottom={C.shell} />
          <circle cx={600} cy={270} r={70} fill={C.blush} />
          <rect x="0" y="330" width={W} height="60" fill={C.sea} />
          <rect x="0" y="330" width={W} height="4" fill={C.mist} />
          <rect x="0" y="372" width={W} height="18" fill={C.seaDeep} />
          <rect x="0" y="390" width={W} height="410" fill={C.sand} />
          {/* the sendero: a sandy path narrowing toward the water */}
          <path d="M470,800 C520,620 560,480 585,392 H615 C640,480 680,620 730,800 Z" fill={C.shell} />
          <path d="M0,800 V250 C120,200 250,260 330,330 C420,400 500,470 470,800 Z" fill={C.fern} />
          <path d="M0,800 V380 C110,340 230,400 300,470 C380,560 430,660 400,800 Z" fill={C.forest} />
          <path d="M1200,800 V230 C1080,190 950,250 870,330 C780,410 700,480 730,800 Z" fill={C.moss} />
          <path d="M1200,800 V400 C1090,350 980,410 900,490 C830,570 790,680 810,800 Z" fill={C.fern} />
        </>
      );
  }
}

type Props = {
  art: ArtData;
  /** CSS aspect ratio, e.g. "4 / 3". Omit to fill the parent. */
  ratio?: "wide" | "landscape" | "square" | "portrait" | "fill";
  /** Hide the "illustration" caption (for small or purely decorative uses). */
  bare?: boolean;
  /** Decorative art is hidden from assistive technology. */
  decorative?: boolean;
  priority?: boolean;
  className?: string;
};

export function Art({ art, ratio = "landscape", bare, decorative, priority, className }: Props) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = ["art", `art--${ratio}`, className].filter(Boolean).join(" ");

  if (art.image) {
    return (
      <figure className={cls}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={art.image.src}
          width={art.image.width}
          height={art.image.height}
          alt={decorative ? "" : art.alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : undefined}
        />
      </figure>
    );
  }

  const label = decorative ? undefined : `Illustration standing in for a photograph: ${art.alt}`;
  return (
    <figure className={cls}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        role={decorative ? undefined : "img"}
        aria-label={label}
        aria-hidden={decorative ? true : undefined}
        focusable="false"
      >
        {sceneBody(art.scene, art.seed, id)}
      </svg>
      {!bare && !decorative && site.showPlaceholderCaptions ? (
        <figcaption className="art__note">Illustration. Photography to follow.</figcaption>
      ) : null}
    </figure>
  );
}
