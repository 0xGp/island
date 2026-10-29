# Island of the Blessed · ELYSIUM

A scroll-driven mythological film: the visitor sails from the open sea, through the
Great Wave, watches the island turn into view, enters toward the temple, sees the sun
struck into the ELYSIUM coin, and lands on the coin's reverse, where only verified links live.

Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4, GSAP 3 + ScrollTrigger via `@gsap/react`.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Project facts

All project facts live in `lib/site-config.ts`. The footer currently shows only the ticker and
the disclaimer; the contract, socials and trading rows were removed. `socials`, `contractAddress`,
`chain` and `tradingLinks` stay in the config, unverified (`null` or empty), for when those rows
come back.

Never add supply, liquidity, market cap, holder counts, listings, audits, partnerships or
return language.

## Storyline → code

| Chapter | Beat (timeline time) | What moves |
| --- | --- | --- |
| I · The Forgotten World | 0 – 2 | Camera pushes into the horizon plate; the foreground sea moves faster; clouds drift. |
| II · The Great Wave | 2.2 – 4.8 | A cut-out wave crest rises out of the foreground sea and rolls left to right across the horizon, which stays in view. It hides the island's lower half while the temple stays visible, then breaks and sinks. Foam rides the lip and sprays on the break. The camera then pushes into the island and dissolves to the view from above. |
| III · The Island Turns | 4.3 – 6.8 | Three depths settle at different rates: the sea plate, the island cut-out (with its feature pins), and screen-blended clouds that part. A shadow with a moving sunlit hole walks across the island, then the feature labels appear. |
| IV · Enter Elysium | 6.7 – 9.4 | Camera flies into the temple approach, mist rises, a sunlit veil hides the cut to the close temple. |
| V · The Blessed Realm | 9.4 – 10.9 | The coin swells over the painted sun. Its struck metal is revealed by light spreading from the centre, then the rim draws on and the legend lands. The roof stays in front, via a CSS `clip-path` traced to the painting. |
| VI · The Eternal Horizon | 11 – 12.7 | The coin sets behind the roof, the dusk plate pulls back, "Turn the coin" leads to the footer. |

The footer (`#reverse`) is the coin's reverse: ticker, contract status, socials and trading links, plus the disclaimer.

## Animation architecture

- `hooks/useCinematicTimeline.ts` builds **one** GSAP timeline, scrubbed by a pinned
  ScrollTrigger (`pin: .stage`, `scrub: 0.8`). Each chapter has a `*-view` label that the chapter
  dial uses to jump. The scroll length is 7 viewport heights on wide screens and 5.5 on portrait.
- Everything is created inside `gsap.matchMedia()` and only under
  `(prefers-reduced-motion: no-preference)`. Resizes and preference changes revert and rebuild
  the timeline, and `invalidateOnRefresh` re-measures, so scrolling backwards replays every
  beat in reverse.
- The dial (numeral, title, progress arc) updates from the timeline's own `onUpdate`, not the
  ScrollTrigger, so it never runs ahead of the scrubbed picture.
- GSAP only animates inner elements. Positioning wrappers keep their CSS `translate`, because
  GSAP folds a `-50%` translate into `xPercent`/`yPercent`, and a tween would then overwrite it.
- The opening title uses CSS keyframes, so it plays before hydration.

### Plates and art direction

`components/cinematic/Plate.tsx` renders each painting in a "cover box" that keeps the
painting's aspect ratio. The box is sized with container-query units, so a pin positioned with
`%` stays on the same painted spot at any viewport size. Portrait screens (`max-aspect-ratio: 4/5`)
get separate 9:16 paintings through `<picture>`/`getImageProps`, plus their own pin
coordinates (`xt`/`yt` in `lib/story.ts`). Mobile is art-directed rather than cropped.

### Reduced motion and no-JS

`components/sections/Storybook.tsx` is a still-frame version of all six chapters. It is shown
under `prefers-reduced-motion: reduce`, and without JavaScript through a `<noscript>` style
override. It uses the same plates, words, feature pins, and a static struck coin.

## Assets

The painted plates in `public/images/` are AI-generated. Each file carries its prompt or
origin in its JPEG comment, or in a `.json` sidecar for WebP; check with
`impeccable embed-prompt --scan public/images`. Prompts are also kept in `.impeccable/prompts/`.
`clouds-black` and `foam-black` are screen-blended layers whose blacks were crushed so they
leave no visible rectangle.

## Known trade-offs

- The plates are 1280×720 (720×1280 on portrait). They are soft on large or high-density
  screens. Regenerating them at 2–3× is the first upgrade.
- The coin faces are 512px painted rasters (`public/images/coin/`). An SVG layer on top carries the
  rim stroke, the legend, and the radial "light" mask that reveals the metal during the strike.
  If the coin is shown much larger than about 250 CSS px, regenerate the faces at 1024px.
- The wave crest is placed in pixels from its painted silhouette (`CREST` in
  `hooks/useCinematicTimeline.ts`, `.story-crest` in `app/globals.css`). If you replace
  `wave-crest.webp`, re-measure the peak and the lip.
- The cut-outs (`wave-crest.webp`, `iso-island*.webp`) and the sea plates are rebuilt by
  `node .impeccable/cutouts.mjs` from the generated sources. The island matte is tied to
  `island-isometric*.jpg`, so regenerate it whenever those paintings change. The script rewrites
  `iso-sea*.jpg`, which drops their embedded prompts, so re-run `embed-prompt` with the files in
  `.impeccable/prompts/` afterwards.
- The roofline clip for the coin is traced to the current temple paintings. If you replace
  `temple-close*.jpg`, re-trace the `.roofline` polygons in `app/globals.css` and the sun
  positions in `lib/story.ts`.
