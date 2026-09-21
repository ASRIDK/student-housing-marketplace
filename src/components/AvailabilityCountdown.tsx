type Props = {
  availableFrom: string;
};

export default function AvailabilityCountdown({ availableFrom }: Props) {
  const target = new Date(availableFrom);
  if (isNaN(target.getTime())) return null;

  const msPerDay = 1000 * 60 * 60 * 24;
  const days = Math.ceil((target.getTime() - Date.now()) / msPerDay);

  let label: string;
  if (days > 1) label = `Available in ${days} days`;
  else if (days === 1) label = "Available tomorrow";
  else if (days === 0) label = "Available today";
  else label = "Available now";

  return (
    <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
      {label}
    </span>
  );
}
