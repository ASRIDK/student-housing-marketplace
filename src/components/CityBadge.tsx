import type { City } from "@/lib/types";

/**
 * Each campus has one colour, defined in globals.css. Dark text on the
 * light hues, white on the dark ones, so every badge stays readable.
 */
const CITY_STYLES: Record<City, { background: string; color: string }> = {
  Milan: { background: "var(--city-milan)", color: "#2b2100" },
  Madrid: { background: "var(--city-madrid)", color: "#ffffff" },
  Geneva: { background: "var(--city-geneva)", color: "#04283a" },
  Paris: { background: "var(--city-paris)", color: "#ffffff" },
  Marseille: { background: "var(--city-marseille)", color: "#ffffff" },
};

export default function CityBadge({ city }: { city: City }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
      style={CITY_STYLES[city]}
    >
      {city}
    </span>
  );
}
