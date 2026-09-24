"use client";

import { WorksWheel, type WorksWheelItem } from "@/components/ui/works-wheel";

/**
 * The hero wheel. Fed from the database by the home page, so a card shows the
 * same photo as the listing it opens.
 */
export default function FeaturedWheel({ items }: { items: WorksWheelItem[] }) {
  if (items.length === 0) return null;

  return (
    <WorksWheel
      items={items}
      label="Open now"
      action="See the place"
      className="h-full bg-transparent text-white"
    />
  );
}
