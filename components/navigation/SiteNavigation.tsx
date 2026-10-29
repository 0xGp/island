import { ElysiumCoin } from "@/components/cinematic/ElysiumCoin";
import { siteConfig } from "@/lib/site-config";

export function SiteNavigation() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(to_bottom,rgb(4_16_28/0.55),transparent)]"
      />
      <nav
        aria-label="Primary"
        className="pointer-events-auto relative flex h-[var(--nav-h)] items-center justify-between px-5 sm:px-[4vw]"
      >
        <a href="#top" className="group flex items-center gap-3" aria-label={`${siteConfig.name}, ${siteConfig.ticker}: back to the start`}>
          <ElysiumCoin
            id="nav-coin"
            variant="mark"
            className="size-11 -m-1.5 transition-transform duration-700 ease-[var(--ease-tide)] group-hover:rotate-[24deg]"
          />
          <span className="sea-shadow font-display text-[1rem] tracking-[0.32em] text-ivory">
            {siteConfig.ticker}
          </span>
        </a>

        <a
          href="#reverse"
          className="sea-shadow font-sans text-[0.6875rem] font-semibold tracking-[0.3em] text-ivory/85 uppercase decoration-gold/70 transition-colors hover:text-gold hover:underline"
        >
          Official links
        </a>
      </nav>
    </header>
  );
}
