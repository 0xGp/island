"use client";

import Image from "next/image";
import { ArrowUp } from "lucide-react";
import { ElysiumCoin } from "@/components/cinematic/ElysiumCoin";
import { siteConfig } from "@/lib/site-config";
import { elysiumMyth } from "@/lib/story";

function Row({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 border-t border-ivory/12 py-6 sm:grid-cols-[10rem_1fr] sm:gap-8">
      <dt className="pt-1 font-sans text-[0.6875rem] font-semibold tracking-[0.3em] text-gold uppercase">
        {term}
      </dt>
      <dd className="font-story text-[1.0625rem] leading-relaxed text-ivory/90">{children}</dd>
    </div>
  );
}

export function SiteFooter() {
  const { ticker, name } = siteConfig;

  function backToHorizon() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <footer
      id="reverse"
      aria-labelledby="reverse-title"
      className="relative overflow-hidden bg-[linear-gradient(var(--color-midnight),var(--color-midnight-deep)_38%)] px-6 pt-[16svh] pb-10 sm:px-[6vw]"
    >
      <div className="mx-auto grid max-w-6xl items-start gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="relative mx-auto w-[min(78vw,26rem)] lg:sticky lg:top-[18svh]">
          <ElysiumCoin
            id="reverse-coin"
            variant="reverse"
            className="w-full"
            title="The reverse of the ELYSIUM coin: the sun on the horizon, inscribed The Eternal Horizon"
          />
        </div>

        <div>
          <h2
            id="reverse-title"
            className="font-display text-[clamp(2.25rem,4.4vw,3.75rem)] leading-[1.02] tracking-[0.04em] text-ivory uppercase"
          >
            The reverse
          </h2>
          <p className="mt-5 max-w-[46ch] font-story text-[1.1875rem] leading-relaxed text-ivory/85 text-pretty">
            Every coin has two faces. This side carries what is real.
          </p>

          <dl className="mt-12 border-b border-ivory/12">
            <Row term="Ticker">
              <span className="font-display tracking-[0.24em] text-ivory">{ticker}</span>
            </Row>
          </dl>

          <section aria-labelledby="myth-title" className="mt-16">
            <h3
              id="myth-title"
              className="font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.1] tracking-[0.04em] text-ivory uppercase"
            >
              The myth
            </h3>
            <p className="mt-4 max-w-[52ch] font-story text-[1.0625rem] leading-relaxed text-ivory/85 text-pretty">
              The island is not our invention. The ancient Greeks wrote of it as Elysium.
            </p>
            <dl className="mt-8 border-b border-ivory/12">
              {elysiumMyth.facts.map((f) => (
                <Row key={f.term} term={f.term}>
                  {f.value}
                </Row>
              ))}
            </dl>
            <figure className="mt-10 max-w-[26rem]">
              <Image
                src="/images/myth/elysium-summary.webp"
                width={1024}
                height={934}
                sizes="(min-width: 1024px) 26rem, 90vw"
                alt="Elysium summary table. The Realm of Elysium. Qualities: Paradise of the Blessed Dead. Location: River Oceanus or Hades. Other names: Islands of the Blessed, the White Island."
                className="h-auto w-full border border-ivory/12"
              />
              <figcaption className="mt-3 font-sans text-[0.75rem] tracking-[0.12em] text-ivory/60">
                Elysium at a glance: its qualities, location and other names.
              </figcaption>
            </figure>
            <figure className="mt-10 border-l border-gold/60 pl-6">
              <blockquote className="max-w-[52ch] font-story text-[1.1875rem] leading-relaxed text-ivory/90 italic text-pretty">
                “{elysiumMyth.quote.text}”
              </blockquote>
              <figcaption className="mt-3 font-sans text-[0.75rem] tracking-[0.12em] text-ivory/60">
                {elysiumMyth.quote.cite}
              </figcaption>
            </figure>
            <p className="mt-8 font-sans text-[0.8125rem] text-ivory/70">
              Source:{" "}
              <a
                href={elysiumMyth.source.href}
                rel="noopener noreferrer"
                target="_blank"
                className="text-ivory underline decoration-gold/60 underline-offset-[0.3em] hover:text-gold"
              >
                {elysiumMyth.source.label}
              </a>
            </p>
          </section>

          <p className="mt-12 max-w-[60ch] font-sans text-[0.8125rem] leading-relaxed text-ivory/60">
            {ticker} is a meme coin inspired by myth. It carries no promise of value, utility or return.
          </p>

          <button
            type="button"
            onClick={backToHorizon}
            className="group mt-14 inline-flex items-center gap-3 font-sans text-[0.75rem] font-semibold tracking-[0.32em] text-gold uppercase hover:text-ivory"
          >
            <ArrowUp
              aria-hidden
              strokeWidth={1.5}
              className="size-4 transition-transform duration-500 ease-[var(--ease-tide)] group-hover:-translate-y-1"
            />
            Sail back to the horizon
          </button>
        </div>
      </div>

      <p className="mx-auto mt-[12svh] max-w-6xl border-t border-ivory/10 pt-6 font-sans text-[0.75rem] tracking-[0.12em] text-ivory/45">
        {name} · {ticker}
      </p>
    </footer>
  );
}
