import type { City } from "@/lib/types";

const CITY_STYLES: Record<City, { bg: string; text: string }> = {
  Milan: { bg: "var(--city-milan)", text: "#111827" },
  Madrid: { bg: "var(--city-madrid)", text: "#ffffff" },
  Geneva: { bg: "var(--city-geneva)", text: "#ffffff" },
  Paris: { bg: "var(--city-paris)", text: "#111827" },
  Marseille: { bg: "var(--city-marseille)", text: "#111827" },
};

export default function CityBadge({ city }: { city: City }) {
  const style = CITY_STYLES[city];

  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {city}
    </span>
  );
}
