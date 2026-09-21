import Link from "next/link";
import type { City } from "@/lib/types";

type ContactCardProps = {
  ownerName: string;
  ownerEmail: string;
  city: City;
  disabled: boolean;
};

export default function ContactCard({
  ownerName,
  ownerEmail,
  city,
  disabled,
}: ContactCardProps) {
  const firstName = ownerName.split(" ")[0];
  const subject = encodeURIComponent(`StudentSwap: your apartment in ${city}`);
  const mailto = `mailto:${ownerEmail}?subject=${subject}`;

  return (
    <div className="rounded-xl border border-neutral-200 p-5 shadow-sm">
      <p className="text-sm text-neutral-500">Posted by</p>
      <p className="text-lg font-semibold text-neutral-900">{ownerName}</p>

      {disabled ? (
        <button type="button" disabled className="mt-4 w-full cursor-not-allowed rounded-lg bg-neutral-200 px-4 py-2.5 text-center text-sm font-medium text-neutral-400">
          No longer available
        </button>
      ) : (
        <a href={mailto} className="mt-4 block w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-neutral-700">
          Contact {firstName}
        </a>
      )}

      <Link href="/" className="mt-3 block text-center text-sm text-neutral-500 hover:text-neutral-800">
        ← Back to listings
      </Link>
    </div>
  );
}
