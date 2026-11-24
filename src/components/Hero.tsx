import type { Art as ArtData } from "@/content/properties";
import { Art } from "./Art";
import { HeroMotion } from "./HeroMotion";

type Props = {
  art: ArtData;
  place?: string;
  title: string;
  lede: string;
  children?: React.ReactNode;
};

/**
 * Page-opening hero. The picture sits above a solid navy panel, so the
 * headline never runs over imagery and stays at AAA contrast whatever
 * photograph or film replaces the illustration later.
 */
export function Hero({ art, place, title, lede, children }: Props) {
  return (
    <HeroMotion>
      <div className="hero__media">
        <Art art={art} ratio="fill" priority />
      </div>
      <div className="hero__panel">
        <div className="wrap hero__grid">
          <div>
            {place ? <p className="label hero__place">{place}</p> : null}
            <h1>{title}</h1>
          </div>
          <div>
            <p className="hero__lede">{lede}</p>
            {children ? <div className="cluster hero__actions">{children}</div> : null}
          </div>
        </div>
      </div>
    </HeroMotion>
  );
}
