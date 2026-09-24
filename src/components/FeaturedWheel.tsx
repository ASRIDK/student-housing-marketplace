"use client";

import { WorksWheel, type WorksWheelItem } from "@/components/ui/works-wheel";

export const HERO_TITLE = "Someone is leaving your campus. Take their keys.";
export const HERO_BLURB =
  "Apartments handed over student to student in Milan, Madrid, Geneva, Paris and Marseille. You get the place, the landlord keeps a tenant, nobody pays an agency.";

/**
 * The hero wheel. The pitch sits in the hole in the middle of the ring and
 * fades out as the ring opens into the drum, handing the space to the place
 * you are looking at. Fed from the database by the home page, so a card shows
 * the same photo as the listing it opens.
 *
 * Everything inside the label is sized in `em` against the wheel's own type
 * scale, so it grows and shrinks with the ring instead of fighting it.
 */
export default function FeaturedWheel({ items }: { items: WorksWheelItem[] }) {
  if (items.length === 0) return null;

  return (
    <WorksWheel
      items={items}
      name="Places open now"
      action="See the place"
      className="h-full bg-transparent text-white"
      label={
        <>
          <h1 className="display font-extrabold text-white">{HERO_TITLE}</h1>
          <p className="mx-auto mt-[0.6em] max-w-[22em] text-[0.44em] leading-relaxed text-white/65">
            {HERO_BLURB}
          </p>
        </>
      }
    />
  );
}
