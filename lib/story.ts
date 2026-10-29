export type ChapterId =
  | "forgotten"
  | "wave"
  | "reveal"
  | "enter"
  | "realm"
  | "horizon";

export type Chapter = {
  id: ChapterId;
  numeral: string;
  title: string;
  lines: string[];
};

export const chapters: Chapter[] = [
  {
    id: "forgotten",
    numeral: "I",
    title: "The Forgotten World",
    lines: [
      "The old poets set it at the edge of the world, past the last of the charts.",
      "Few believed it. Fewer went looking.",
    ],
  },
  {
    id: "wave",
    numeral: "II",
    title: "The Great Wave",
    lines: [
      "The sea does not give the island away. It guards it with a wall of water taller than any temple.",
      "Hold your course.",
    ],
  },
  {
    id: "reveal",
    numeral: "III",
    title: "The Island Turns",
    lines: [
      "White marble cliffs. Hills that never brown. Water falling into still, green coves.",
    ],
  },
  {
    id: "enter",
    numeral: "IV",
    title: "The world beyond this world.",
    lines: [
      "Through the mist, over the cliffs, toward the temple at the island\u2019s heart. Here the light arrives first and leaves last.",
    ],
  },
  {
    id: "realm",
    numeral: "V",
    title: "The Blessed Realm",
    lines: [
      "The sun stands behind the temple, and the island strikes its mark.",
    ],
  },
  {
    id: "horizon",
    numeral: "VI",
    title: "The Eternal Horizon",
    lines: ["The light lowers. The island remains."],
  },
];

/** Features revealed in Chapter III, as positions inside each painting. */
export const islandFeatures = [
  { id: "cascades", label: "The Cascades", x: "29%", y: "45%", xt: "25.5%", yt: "52.5%", tall: "start" },
  { id: "temple", label: "The Central Temple", x: "51.5%", y: "15%", xt: "54%", yt: "35.5%", tall: "center" },
  { id: "cliffs", label: "Marble Cliffs", x: "64%", y: "50%", xt: "71%", yt: "45%", tall: "end" },
  { id: "coves", label: "Still Coves", x: "54%", y: "86%", xt: "52%", yt: "64%", tall: "hidden" },
] as const;

/** Where the sun sits in the close temple paintings (measured from the art). */
export const sunInTemple = {
  wide: { x: "50.2%", y: "11.6%", d: "9.6%" },
  tall: { x: "50.3%", y: "29.9%", d: "24.4%" },
};
