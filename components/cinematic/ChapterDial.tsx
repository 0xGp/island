"use client";

import { chapters, type ChapterId } from "@/lib/story";

const RADIUS = 34;

export function ChapterDial({ onJump }: { onJump: (id: ChapterId) => void }) {
  return (
    <nav
      aria-label="Chapters"
      className="absolute right-[4vw] bottom-[4.5svh] z-30 flex items-center gap-4"
    >
      <span
        className="dial-title hidden font-sans text-[0.6875rem] font-medium tracking-[0.32em] text-ivory/85 uppercase sm:block sea-shadow"
        aria-hidden
      >
        {chapters[0].title}
      </span>

      <div className="relative size-[5.5rem] shrink-0">
        <svg viewBox="-44 -44 88 88" className="absolute inset-0 size-full" aria-hidden>
          <circle r={RADIUS} fill="rgb(4 16 28 / 0.45)" />
          <circle r={RADIUS} fill="none" stroke="rgb(244 235 221 / 0.22)" strokeWidth="1" />
          <circle
            className="dial-arc"
            r={RADIUS}
            fill="none"
            stroke="var(--color-gold)"
            strokeWidth="1.6"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset="1"
            transform="rotate(-90)"
          />
        </svg>
        <span
          className="dial-numeral absolute inset-0 grid place-items-center font-display text-[1.375rem] leading-none text-ivory"
          aria-hidden
        >
          I
        </span>

        <ol>
          {chapters.map((c, i) => {
            const a = (i / chapters.length) * Math.PI * 2 - Math.PI / 2;
            const x = 50 + Math.cos(a) * (RADIUS / 88) * 100;
            const y = 50 + Math.sin(a) * (RADIUS / 88) * 100;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  data-dial-dot={c.id}
                  onClick={() => onJump(c.id)}
                  aria-label={`Chapter ${c.numeral}: ${c.title.replace(/\.$/, "")}`}
                  title={c.title.replace(/\.$/, "")}
                  className="group absolute grid size-6 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <span className="size-[7px] rounded-full border border-gold/80 bg-midnight transition-[background-color,scale] duration-300 ease-[var(--ease-tide)] group-hover:scale-125 group-hover:bg-gold/60 group-data-[active]:bg-gold" />
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
