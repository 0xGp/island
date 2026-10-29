import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { Plate, art } from "@/components/cinematic/Plate";
import { ElysiumCoin } from "@/components/cinematic/ElysiumCoin";
import { chapters, islandFeatures, sunInTemple, type ChapterId } from "@/lib/story";
import { siteConfig } from "@/lib/site-config";

/**
 * The same voyage as still frames, for reduced-motion visitors and
 * browsers without JavaScript. Each chapter is one composed frame.
 */
function Frame({
  id,
  plate,
  children,
  align = "bottom",
}: {
  id: ChapterId | "opening";
  plate: ReactNode;
  children: ReactNode;
  align?: "bottom" | "center" | "top";
}) {
  const place =
    align === "center"
      ? "items-center justify-center text-center"
      : align === "top"
        ? "items-start justify-center pt-[16svh] text-center"
        : "items-end pb-[14svh]";
  return (
    <section
      aria-labelledby={`story-${id}`}
      className={`relative flex h-svh min-h-[34rem] overflow-hidden px-6 sm:px-[6vw] ${place}`}
    >
      <div className="plate-frame" aria-hidden={false}>
        {plate}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgb(4_16_28/0.7),transparent_55%)]" />
      <div className="relative z-10">{children}</div>
    </section>
  );
}

function Words({ id }: { id: ChapterId }) {
  const c = chapters.find((ch) => ch.id === id)!;
  return (
    <>
      <h2
        id={`story-${id}`}
        className="sea-shadow font-display text-[clamp(1.75rem,3.6vw,3.25rem)] leading-[1.05] tracking-[0.04em] text-ivory uppercase text-balance"
      >
        {c.title}
      </h2>
      {c.lines.map((l) => (
        <p key={l} className="sea-shadow mt-4 font-story text-[1.125rem] leading-relaxed text-ivory/90 prose-measure">
          {l}
        </p>
      ))}
    </>
  );
}

export function Storybook() {
  return (
    <div className="storybook">
      <Frame
        id="opening"
        align="bottom"
        plate={
          <Plate
            wide={art.horizon}
            tall={art.horizonTall}
            alt="A distant island of white cliffs and temples on the horizon, ringed by curling waves under a golden sky."
          />
        }
      >
        <div className="w-full text-center">
          <h1
            id="story-opening"
            className="sea-shadow font-display text-[clamp(2.75rem,7.6vw,6rem)] leading-[0.98] tracking-[0.05em] text-ivory uppercase"
          >
            {siteConfig.name}
          </h1>
          <p className="sea-shadow mt-5 font-sans text-[0.8125rem] font-medium tracking-[0.42em] text-gold uppercase">
            {siteConfig.tagline}
          </p>
        </div>
      </Frame>

      <Frame
        id="forgotten"
        plate={<Plate wide={art.horizon} tall={art.horizonTall} alt="" />}
      >
        <Words id="forgotten" />
      </Frame>

      <Frame
        id="wave"
        plate={
          <>
            <Plate
              wide={art.horizon}
              tall={art.horizonTall}
              alt="A monumental wave curling across the horizon, hiding the lower half of the distant island."
            />
            <div className="wave-crest story-crest absolute">
              <Image {...art.waveCrest} alt="" sizes="max(130vw, 215svh)" className="h-full w-full" />
            </div>
          </>
        }
      >
        <Words id="wave" />
      </Frame>

      <Frame
        id="reveal"
        plate={
          <Plate
            wide={art.iso}
            tall={art.isoTall}
            alt="The island seen from above: marble cliffs, green hills, waterfalls into turquoise coves, and a temple on the highest plateau."
          >
            {islandFeatures.map((f) => (
              <span
                key={f.id}
                className="pin flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
                style={{ "--x": f.x, "--y": f.y, "--xt": f.xt, "--yt": f.yt } as CSSProperties}
              >
                <span className="size-3 rounded-full border border-gold bg-gold/25" />
                <span className="sea-shadow whitespace-nowrap font-display text-[0.8125rem] tracking-[0.18em] text-ivory uppercase">
                  {f.label}
                </span>
              </span>
            ))}
          </Plate>
        }
      >
        <Words id="reveal" />
      </Frame>

      <Frame
        id="enter"
        align="center"
        plate={<Plate wide={art.approach} tall={art.approachTall} alt="The sun behind the island's central temple." />}
      >
        <Words id="enter" />
      </Frame>

      <Frame
        id="realm"
        plate={
          <Plate
            wide={art.temple}
            tall={art.templeTall}
            alt="The central temple, the sun behind it struck as the gold ELYSIUM coin."
          >
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
              <div className="coin-risen">
                <ElysiumCoin id="story-coin" className="coin-size block" />
              </div>
            </div>
          </Plate>
        }
      >
        <Words id="realm" />
      </Frame>

      <Frame
        id="horizon"
        align="top"
        plate={<Plate wide={art.eternal} alt="The whole island at dusk, the sun setting behind it over a calm sea." floatOnPortrait />}
      >
        <Words id="horizon" />
      </Frame>
    </div>
  );
}
