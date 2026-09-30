import Image from "next/image";
import type { City } from "@/lib/types";

/**
 * Each campus's landmark in its campus colour: Duomo, Puerta de Alcalá,
 * Jet d'Eau, Eiffel Tower, Notre-Dame de la Garde. The artwork lives in
 * public/campuses/ (generated with Gemini, cut out as transparent PNGs).
 */
export default function CampusIcon({
  city,
  size,
  className,
}: {
  city: City;
  size: number;
  className?: string;
}) {
  return (
    <Image
      src={`/campuses/${city.toLowerCase()}.png`}
      alt=""
      aria-hidden
      width={size}
      height={size}
      className={className}
    />
  );
}
