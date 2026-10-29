"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { Plate, art } from "./Plate";
import { ElysiumCoin } from "./ElysiumCoin";
import { ChapterDial } from "./ChapterDial";
import { ScrollIndicator } from "./ScrollIndicator";
import { useCinematicTimeline } from "@/hooks/useCinematicTimeline";
import { chapters, islandFeatures, sunInTemple, type ChapterId } from "@/lib/story";
import { siteConfig } from "@/lib/site-config";

const hidden = "invisible opacity-0";

function chapter(id: ChapterId) {
  return chapters.find((c) => c.id === id)!;
}

function ChapterCopy({ id, className = "" }: { id: ChapterId; className?: string }) {
  const c = chapter(id);
  return (
    <div
      data-copy={id}
      className={`absolute z-20 ${hidden} left-6 right-6 bottom-[19svh] sm:left-[6vw] sm:right-auto sm:bottom-[13svh] sm:max-w-[34rem] ${className}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-x-[30%] -inset-y-[45%] -z-10 bg-[radial-gradient(closest-side,rgb(4_16_28/0.72),transparent)]"
      />
      <h2 className="sea-shadow font-display text-[clamp(1.75rem,3.4vw,3.1rem)] leading-[1.05] tracking-[0.04em] text-ivory uppercase text-balance">
        {c.title}
      </h2>
      {c.lines.map((line) => (
        <p
          key={line}
          className="sea-shadow mt-4 font-story text-[1.0625rem] leading-relaxed text-ivory/90 sm:text-[1.1875rem] prose-measure"
        >
          {line}
        </p>
      ))}
    </div>
  );
}

const TITLE = "Island of the Blessed";

export function CinematicExperience() {
  const root = useRef<HTMLElement>(null);
  const { jumpTo } = useCinematicTimeline(root);
  const enter = chapter("enter");
  const horizon = chapter("horizon");

  return (
    <section
      ref={root}
      id="voyage"
      aria-label="The voyage to the Island of the Blessed"
      className="cinema relative"
    >
      <div className="stage relative h-svh w-full overflow-hidden bg-midnight">
        {/* I · horizon, with a faster foreground sea */}
        <div className="l-horizon plate-frame">
          <Plate
            wide={art.horizon}
            tall={art.horizonTall}
            eager
            alt="A distant island of white cliffs and temples on the horizon, ringed by curling waves under a golden sky."
            className="cam-horizon will-change-transform"
          />
        </div>
        <div
          className="l-fgsea plate-frame"
          style={{ maskImage: "linear-gradient(to top, #000 0%, #000 28%, transparent 50%)" }}
          aria-hidden
        >
          <Plate wide={art.horizon} tall={art.horizonTall} alt="" className="cam-fgsea origin-bottom" />
        </div>

        <div className="l-clouds screen-layer absolute inset-0" aria-hidden>
          <div className="drift absolute -left-[12%] -top-[16%] w-[72%] opacity-55">
            <Image {...art.clouds} alt="" sizes="72vw" className="cloud-a h-auto w-full" />
          </div>
          <div className="drift absolute -right-[18%] top-0 w-[60%] opacity-40">
            <Image {...art.clouds} alt="" sizes="60vw" className="cloud-b h-auto w-full -scale-x-100" />
          </div>
        </div>

        {/* III–IV · the island turns, then the camera flies to the temple */}
        <div
          className={`cam-island plate-frame ${hidden} bg-[radial-gradient(ellipse_at_50%_40%,#1d4470,#071a2b_75%)]`}
        >
          <div className="iso-tilt absolute inset-0">
            <div className="iso-sea absolute inset-0" aria-hidden>
              <Plate wide={art.isoSea} tall={art.isoSeaTall} alt="" />
            </div>
            <div className="iso-land absolute inset-0">
              <Plate
                wide={art.isoIsland}
                tall={art.isoIslandTall}
                alt="The island seen from above: marble cliffs, green hills, waterfalls into turquoise coves, and a temple on the highest plateau."
              >
                <div aria-hidden className="iso-shade sun-shade absolute -inset-[15%] bg-midnight-deep/60" />
                {islandFeatures.map((f) => (
                  <span
                    key={f.id}
                    data-tall-anchor={f.tall}
                    className="pin -translate-x-1/2 -translate-y-full"
                    style={{ "--x": f.x, "--y": f.y, "--xt": f.xt, "--yt": f.yt } as CSSProperties}
                  >
                    <span className={`feature feature-stack flex flex-col items-center ${hidden}`}>
                      <span className="label-shadow relative isolate whitespace-nowrap font-display text-[0.875rem] tracking-[0.2em] text-ivory uppercase sm:text-[1rem]">
                        <span
                          aria-hidden
                          className="absolute -inset-x-10 -inset-y-4 -z-10 bg-[radial-gradient(closest-side,rgb(4_16_28/0.8),rgb(4_16_28/0.7)_55%,transparent)]"
                        />
                        {f.label}
                      </span>
                      <span className="mt-2 h-7 w-px bg-gradient-to-b from-gold/0 to-gold" />
                      <span className="size-2.5 translate-y-1/2 rounded-full border border-ivory/80 bg-gold shadow-[0_2px_8px_rgb(4_16_28/0.6)]" />
                    </span>
                  </span>
                ))}
              </Plate>
            </div>
            <div className="iso-clouds screen-layer absolute inset-0" aria-hidden>
              <div className="absolute -left-[30%] top-[4%] w-[95%] sm:-left-[8%] sm:-top-[10%] sm:w-[70%]">
                <Image {...art.clouds} alt="" sizes="(max-aspect-ratio: 4/5) 95vw, 70vw" className="iso-cloud-a h-auto w-full" />
              </div>
              <div className="absolute -right-[30%] top-[46%] w-[95%] sm:-right-[10%] sm:top-[30%] sm:w-[66%]">
                <Image {...art.clouds} alt="" sizes="(max-aspect-ratio: 4/5) 95vw, 66vw" className="iso-cloud-b h-auto w-full -scale-x-100" />
              </div>
            </div>
            <div className="l-approach absolute inset-0 invisible opacity-0">
              <Plate
                wide={art.approach}
                tall={art.approachTall}
                alt="The sun rising behind the island's central temple."
              />
            </div>
          </div>
        </div>

        {/* IV–V · the temple, and the sun struck into the ELYSIUM coin */}
        <div className={`l-temple plate-frame ${hidden} bg-[#2f445f]`}>
          <Plate
            wide={art.temple}
            tall={art.templeTall}
            alt="The central temple on its plateau, the sun standing directly behind it."
            className="cam-temple"
          >
            <div
              aria-hidden
              className="absolute inset-x-0 -top-[30%] h-[40%] bg-[linear-gradient(to_bottom,#2f445f_75%,transparent)]"
            />
            <div
              className="pin roofline -translate-x-1/2 -translate-y-1/2"
              style={
                {
                  "--x": sunInTemple.wide.x,
                  "--y": sunInTemple.wide.y,
                  "--xt": sunInTemple.tall.x,
                  "--yt": sunInTemple.tall.y,
                } as CSSProperties
              }
            >
              <div className="coin">
                <ElysiumCoin
                  id="realm-coin"
                  className="coin-size block"
                  title="The ELYSIUM coin: a temple struck in gold, inscribed Island of the Blessed"
                />
              </div>
            </div>
          </Plate>
          <div className="temple-dusk absolute inset-0 bg-midnight-deep" aria-hidden />
        </div>

        {/* VI · the eternal horizon */}
        <div className={`l-eternal plate-frame ${hidden} bg-midnight`}>
          <Plate
            wide={art.eternal}
            alt="The whole island at dusk, the sun setting behind it over a calm sea."
            className="cam-eternal"
            floatOnPortrait
          />
        </div>

        {/* atmosphere and the great wave */}
        <div className={`l-mist plate-frame screen-layer ${hidden}`} aria-hidden>
          <Plate wide={art.clouds} alt="" />
        </div>

        <div className="l-wave absolute inset-0 overflow-hidden" aria-hidden>
          <div className={`wave-crest absolute bottom-0 left-0 ${hidden}`}>
            <Image {...art.waveCrest} alt="" sizes="max(130vw, 215svh)" className="h-full w-full" />
          </div>
          <div className={`foam-a absolute inset-y-0 left-0 w-[80%] ${hidden} screen-layer`}>
            <div className="plate-frame foam-feather">
              <Plate wide={art.foam} alt="" />
            </div>
          </div>
          <div className={`foam-b absolute inset-y-0 right-0 w-[75%] ${hidden} screen-layer -scale-x-100`}>
            <div className="plate-frame foam-feather">
              <Plate wide={art.foam} alt="" />
            </div>
          </div>
        </div>

        <div
          className={`veil absolute inset-0 ${hidden} bg-[radial-gradient(ellipse_at_50%_30%,#fbf3e4,#e9dccb_45%,#b7b6d6)]`}
          aria-hidden
        />
        <div className={`shade absolute inset-0 bg-midnight-deep ${hidden}`} aria-hidden />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-[linear-gradient(to_top,rgb(4_16_28/0.55),transparent)]"
          aria-hidden
        />

        {/* opening frame */}
        <div className="opening absolute inset-x-0 bottom-[17svh] z-20 px-6 text-center sm:bottom-[15svh]">
          <h1
            aria-label={TITLE}
            className="sea-shadow mx-auto max-w-[14ch] font-display text-[clamp(2.75rem,7.6vw,6rem)] leading-[0.98] tracking-[0.05em] text-ivory uppercase sm:max-w-none"
          >
            {TITLE.split(" ").map((word, w, words) => (
              <span key={w} className="inline-block whitespace-nowrap" aria-hidden>
                {word.split("").map((ch, i) => (
                  <span
                    key={i}
                    className="title-glyph inline-block"
                    style={{ "--i": words.slice(0, w).join("").length + i } as CSSProperties}
                  >
                    {ch}
                  </span>
                ))}
                {w < words.length - 1 ? "\u00a0" : null}
              </span>
            ))}
          </h1>
          <p className="title-sub sea-shadow mt-5 font-sans text-[0.75rem] font-medium tracking-[0.42em] text-gold uppercase sm:text-[0.8125rem]">
            {siteConfig.tagline}
          </p>
        </div>

        <ScrollIndicator />

        {/* chapter words */}
        <ChapterCopy id="forgotten" />
        <ChapterCopy id="wave" />
        <ChapterCopy id="reveal" />

        <div
          data-copy="enter"
          className={`absolute inset-x-0 top-1/2 z-20 -translate-y-1/2 px-6 text-center ${hidden}`}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -inset-y-1/2 -z-10 bg-[radial-gradient(closest-side,rgb(4_16_28/0.6),transparent)]"
          />
          <h2 className="sea-shadow mx-auto max-w-[16ch] font-display text-[clamp(2.4rem,6.4vw,6rem)] leading-[1] tracking-[0.03em] text-ivory uppercase text-balance">
            {enter.title}
          </h2>
          <p className="sea-shadow mx-auto mt-6 max-w-[36ch] font-story text-[1.0625rem] leading-relaxed text-ivory/90 sm:text-[1.1875rem] text-pretty">
            {enter.lines[0]}
          </p>
        </div>

        <ChapterCopy id="realm" />

        <div
          data-copy="horizon"
          className={`absolute inset-x-0 top-[15svh] z-20 px-6 text-center ${hidden}`}
        >
          <h2 className="sea-shadow font-display text-[clamp(2rem,4.6vw,4rem)] leading-[1.05] tracking-[0.04em] text-ivory uppercase text-balance">
            {horizon.title}
          </h2>
          <p className="sea-shadow mt-4 font-story text-[1.125rem] text-ivory/90 sm:text-[1.25rem]">
            {horizon.lines[0]}
          </p>
          <a
            href="#reverse"
            className="group mt-8 inline-flex items-center gap-3 font-sans text-[0.75rem] font-semibold tracking-[0.32em] text-gold uppercase"
          >
            Turn the coin
            <ArrowDown
              aria-hidden
              className="size-4 transition-transform duration-500 ease-[var(--ease-tide)] group-hover:translate-y-1"
              strokeWidth={1.5}
            />
          </a>
        </div>

        <ChapterDial onJump={jumpTo} />
      </div>
    </section>
  );
}
