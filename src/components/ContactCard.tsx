import type { City, Currency } from "@/lib/types";
import { formatAmount, formatWindow } from "@/lib/format";

type ContactCardProps = {
  ownerName: string;
  ownerEmail: string;
  city: City;
  rent: number;
  currency: Currency;
  availableFrom: string;
  availableUntil: string | null;
  disabled: boolean;
};

/** The initials avatar stands in until students can upload a photo. */
function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <span
      aria-hidden
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-mist text-sm font-bold text-navy"
    >
      {initials}
    </span>
  );
}

/**
 * The decision panel: rent, dates, and the one action on the page. It
 * sticks to the viewport on desktop so the contact button is always in
 * reach while you read the description.
 */
export default function ContactCard({
  ownerName,
  ownerEmail,
  city,
  rent,
  currency,
  availableFrom,
  availableUntil,
  disabled,
}: ContactCardProps) {
  const firstName = ownerName.split(" ")[0];
  const subject = encodeURIComponent(`StudentSwap — your apartment in ${city}`);
  const body = encodeURIComponent(
    `Hi ${firstName},\n\nI saw your apartment on StudentSwap and I'd like to take it over. Is it still available?\n\nThanks!`,
  );
  const mailto = `mailto:${ownerEmail}?subject=${subject}&body=${body}`;

  return (
    <div className="rounded-3xl border border-line bg-surface p-6 shadow-sm lg:sticky lg:top-24">
      <p className="text-2xl font-extrabold text-navy">
        {formatAmount(rent, currency)}
        <span className="text-base font-normal text-slate"> / month</span>
      </p>

      <dl className="mt-5 space-y-3 border-t border-line pt-5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-slate">Handover</dt>
          <dd className="text-right font-medium text-navy">
            {formatWindow(availableFrom, availableUntil)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate">Campus</dt>
          <dd className="font-medium text-navy">{city}</dd>
        </div>
      </dl>

      <div className="mt-5 flex items-center gap-3 border-t border-line pt-5">
        <Avatar name={ownerName} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-navy">{ownerName}</p>
          <p className="text-sm text-slate">Currently lives here</p>
        </div>
      </div>

      {disabled ? (
        <p className="mt-5 rounded-full bg-mist px-4 py-3 text-center text-sm font-medium text-slate">
          Already taken by another student
        </p>
      ) : (
        <>
          <a
            href={mailto}
            className="mt-5 block rounded-full bg-navy px-4 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-navy-700"
          >
            Email {firstName}
          </a>
          <p className="mt-3 text-center text-xs text-slate">
            Opens your mail app. StudentSwap never handles money.
          </p>
        </>
      )}
    </div>
  );
}
