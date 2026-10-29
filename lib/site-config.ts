/**
 * Verified project facts only. Anything `null` renders as an explicit
 * placeholder; never fill these with guesses.
 */
export const siteConfig = {
  name: "Island of the Blessed",
  ticker: "ELYSIUM",
  tagline: "A world beyond the horizon.",
  description:
    "Island of the Blessed (ELYSIUM). A voyage across the open sea to a paradise beyond the horizon.",

  socials: [
    { label: "X", href: null as string | null },
    { label: "Telegram", href: null as string | null },
  ],

  /** Set only after deployment and verification. */
  contractAddress: null as string | null,
  chain: null as string | null,

  tradingLinks: [] as { label: string; href: string }[],
} as const;
