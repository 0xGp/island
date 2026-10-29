"use client";

import { useState } from "react";
import { ArrowUp, Check, Copy } from "lucide-react";
import { ElysiumCoin } from "@/components/cinematic/ElysiumCoin";
import { siteConfig } from "@/lib/site-config";

function ContractAddress({ address }: { address: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(address);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.setTimeout(() => setState("idle"), 2400);
  }

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <code className="break-all font-sans text-[0.9375rem] tabular-nums text-ivory">{address}</code>
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-2 font-sans text-[0.6875rem] font-semibold tracking-[0.28em] text-gold uppercase hover:text-ivory"
      >
        {state === "copied" ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden strokeWidth={1.5} />}
        {state === "copied" ? "Copied" : state === "failed" ? "Copy failed. Select the address instead" : "Copy address"}
      </button>
      <span className="sr-only" aria-live="polite">
        {state === "copied" ? "Contract address copied" : ""}
      </span>
    </div>
  );
}

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
  const { socials, contractAddress, tradingLinks, ticker, name } = siteConfig;

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
            Every coin has two faces. This side carries what is real: only the links listed
            here belong to {name}.
          </p>

          <dl className="mt-12 border-b border-ivory/12">
            <Row term="Ticker">
              <span className="font-display tracking-[0.24em] text-ivory">{ticker}</span>
            </Row>
            <Row term="Contract">
              {contractAddress ? (
                <ContractAddress address={contractAddress} />
              ) : (
                <>
                  Not deployed yet. The verified address will be published here, and only here.
                  Treat any address you cannot find on this page as false.
                </>
              )}
            </Row>
            <Row term="Socials">
              <ul className="flex flex-wrap gap-x-8 gap-y-2">
                {socials.map((s) => (
                  <li key={s.label}>
                    {s.href ? (
                      <a href={s.href} rel="noopener noreferrer" target="_blank" className="text-ivory underline decoration-gold/60 hover:text-gold">
                        {s.label}
                      </a>
                    ) : (
                      <span className="text-ivory/60">
                        {s.label} <span className="text-ivory/45">· to be announced</span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </Row>
            <Row term="Trading">
              {tradingLinks.length ? (
                <ul className="flex flex-wrap gap-x-8 gap-y-2">
                  {tradingLinks.map((t) => (
                    <li key={t.href}>
                      <a href={t.href} rel="noopener noreferrer" target="_blank" className="underline decoration-gold/60 hover:text-gold">
                        {t.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                "No trading links yet. None will be shared anywhere before they appear here."
              )}
            </Row>
          </dl>

          <p className="mt-8 max-w-[60ch] font-sans text-[0.8125rem] leading-relaxed text-ivory/60">
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
