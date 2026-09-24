"use client";

import { WorksWheel, type WorksWheelItem } from "@/components/ui/works-wheel";

// Four apartments to turn through on the home page. Interior photography from
// Unsplash stands in until students upload their own — the cards link to the
// real listings, so the wheel is a way into the site, not a slideshow.
//
// TODO(photos): once uploads exist (Week 2), build this list from the four
// newest listings instead of hard-coding it.
const photo = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`;

const FEATURED: WorksWheelItem[] = [
  {
    title: "Navigli, Milan",
    image: photo("photo-1522708323590-d24dbb6b0267"),
    href: "/listings/l-milan-1",
  },
  {
    title: "Belleville, Paris",
    image: photo("photo-1493809842364-78817add7ffb"),
    href: "/listings/l-paris-1",
  },
  {
    title: "Malasaña, Madrid",
    image: photo("photo-1502672260266-1c1ef2d93688"),
    href: "/listings/l-madrid-1",
  },
  {
    title: "Le Panier, Marseille",
    image: photo("photo-1560448204-e02f11c3d0e2"),
    href: "/listings/l-marseille-1",
  },
];

export default function FeaturedWheel() {
  return (
    <WorksWheel
      items={FEATURED}
      label="Open now"
      action="See the place"
      className="h-full bg-transparent text-white"
    />
  );
}
