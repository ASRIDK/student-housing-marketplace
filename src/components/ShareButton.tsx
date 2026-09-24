"use client";

import { useState } from "react";

/** Copies the page URL so you can send a place to a friend. */
export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="rounded-full px-3 py-1.5 text-sm font-medium text-navy underline underline-offset-4 transition hover:bg-mist"
    >
      {copied ? "Link copied" : "Share"}
    </button>
  );
}
