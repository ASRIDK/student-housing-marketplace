type Props = {
  availableFrom: string;
};

/**
 * How soon you could move in. Rendered on the server, so it is computed
 * once per request — no hydration mismatch.
 */
export default function AvailabilityCountdown({ availableFrom }: Props) {
  const target = new Date(availableFrom);
  if (Number.isNaN(target.getTime())) return null;

  const msPerDay = 1000 * 60 * 60 * 24;
  const days = Math.ceil((target.getTime() - Date.now()) / msPerDay);

  let label: string;
  if (days > 31) label = `Free in about ${Math.round(days / 30)} months`;
  else if (days > 1) label = `Free in ${days} days`;
  else if (days === 1) label = "Free tomorrow";
  else if (days === 0) label = "Free today";
  else label = "Free now";

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-mist px-3 py-1 text-sm font-medium text-navy">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-positive" />
      {label}
    </span>
  );
}
