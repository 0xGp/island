import { getImageProps } from "next/image";
import type { CSSProperties, ReactNode } from "react";

type Art = { src: string; width: number; height: number };

type PlateProps = {
  wide: Art;
  /** Portrait painting for tall screens (art-directed, not a crop). */
  tall?: Art;
  alt: string;
  eager?: boolean;
  className?: string;
  imgClassName?: string;
  style?: CSSProperties;
  /** Wide painting shown whole on tall screens, floating in its own sky. */
  floatOnPortrait?: boolean;
  /** Horizontal focus (0–1) used when a wide painting is cropped on tall screens. */
  portraitFocusX?: number;
  children?: ReactNode;
};

const PORTRAIT_MEDIA = "(max-aspect-ratio: 4/5)";

export function Plate({
  wide,
  tall,
  alt,
  eager = false,
  className = "",
  imgClassName = "",
  style,
  floatOnPortrait,
  portraitFocusX,
  children,
}: PlateProps) {
  const common = {
    alt,
    sizes: "100vw",
    quality: 85,
    ...(eager
      ? { loading: "eager" as const, fetchPriority: "high" as const }
      : {}),
  };
  const { props: wideProps } = getImageProps({ ...common, ...wide });
  const tallSrcSet = tall
    ? getImageProps({ ...common, ...tall }).props.srcSet
    : undefined;

  const plateStyle = {
    ...style,
    ...(portraitFocusX !== undefined
      ? ({ "--pfx": portraitFocusX } as CSSProperties)
      : {}),
  };

  return (
    <div
      className={`plate ${className}`}
      data-tall={tall ? "" : undefined}
      data-float-portrait={floatOnPortrait ? "" : undefined}
      data-portrait-fx={portraitFocusX !== undefined ? "" : undefined}
      style={plateStyle}
    >
      <picture>
        {tallSrcSet ? (
          <source media={PORTRAIT_MEDIA} srcSet={tallSrcSet} sizes="100vw" />
        ) : null}
        {/* eslint-disable-next-line jsx-a11y/alt-text -- alt is in wideProps */}
        <img {...wideProps} className={imgClassName} draggable={false} />
      </picture>
      {children}
    </div>
  );
}

export const art = {
  horizon: { src: "/images/ocean/hero-horizon.jpg", width: 1280, height: 720 },
  horizonTall: { src: "/images/ocean/hero-horizon-portrait.jpg", width: 720, height: 1280 },
  waveCrest: { src: "/images/ocean/wave-crest.webp", width: 1280, height: 720 },
  iso: { src: "/images/island/island-isometric.jpg", width: 1280, height: 720 },
  isoTall: { src: "/images/island/island-isometric-portrait.jpg", width: 720, height: 1280 },
  isoSea: { src: "/images/island/iso-sea.jpg", width: 1280, height: 720 },
  isoSeaTall: { src: "/images/island/iso-sea-portrait.jpg", width: 720, height: 1280 },
  isoIsland: { src: "/images/island/iso-island.webp", width: 1280, height: 720 },
  isoIslandTall: { src: "/images/island/iso-island-portrait.webp", width: 720, height: 1280 },
  approach: { src: "/images/island/temple-approach.jpg", width: 1280, height: 720 },
  approachTall: { src: "/images/island/temple-approach-portrait.jpg", width: 720, height: 1280 },
  temple: { src: "/images/island/temple-close.jpg", width: 1280, height: 720 },
  templeTall: { src: "/images/island/temple-close-portrait.jpg", width: 720, height: 1280 },
  eternal: { src: "/images/island/eternal-horizon.jpg", width: 1280, height: 720 },
  clouds: { src: "/images/atmosphere/clouds-black.jpg", width: 1280, height: 720 },
  foam: { src: "/images/atmosphere/foam-black.jpg", width: 1280, height: 720 },
} satisfies Record<string, Art>;
