type CoinProps = {
  /** Unique per instance; scopes gradient, mask and path ids. */
  id: string;
  variant?: "obverse" | "mark" | "reverse";
  className?: string;
  title?: string;
};

/** Painted struck-gold faces; the relief, field ring and rim are in the art. */
const FACE = {
  obverse: "/images/coin/obverse.webp",
  mark: "/images/coin/mark.webp",
  reverse: "/images/coin/reverse.webp",
} as const;

export function ElysiumCoin({
  id,
  variant = "obverse",
  className,
  title,
}: CoinProps) {
  const glow = `${id}-glow`;
  const light = `${id}-light`;
  const reveal = `${id}-reveal`;
  const top = `${id}-arc-top`;
  const bottom = `${id}-arc-bottom`;
  const isMark = variant === "mark";
  const isReverse = variant === "reverse";

  return (
    <svg
      viewBox="-140 -140 280 280"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      overflow="visible"
    >
      <defs>
        <radialGradient id={glow} r="50%">
          <stop offset="30%" stopColor="#ffe3a0" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#f2c770" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#d9b77a" stopOpacity="0" />
        </radialGradient>
        {/* The struck metal is revealed by light spreading from the sun's centre. */}
        <radialGradient id={light}>
          <stop offset="45%" stopColor="#fff" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>
        <mask id={reveal} maskUnits="userSpaceOnUse" x="-140" y="-140" width="280" height="280">
          <circle className="coin-reveal" r="220" fill={`url(#${light})`} />
        </mask>
        {/* Legends sit in each face's plain field: inside the obverse's raised
            ring, and out toward the rim on the reverse, clear of the relief. */}
        <path
          id={top}
          d={isReverse ? "M -73.75 25.4 A 78 78 0 1 1 73.75 25.4" : "M -66 23 A 70 70 0 1 1 66 23"}
          fill="none"
        />
        <path id={bottom} d="M -73.06 -37.2 A 82 82 0 1 0 73.06 -37.2" fill="none" />
      </defs>

      {!isMark && !isReverse && (
        <>
          <circle className="coin-glow" r="138" fill={`url(#${glow})`} />
          <circle className="coin-sun" r="96" fill="#ffd978" />
        </>
      )}

      <g className="coin-face">
        {/* Masked as one group so the soft reveal edge never shows the darker metal through the heat. */}
        <g mask={`url(#${reveal})`}>
          <image
            href={FACE[variant]}
            x="-96"
            y="-96"
            width="192"
            height="192"
            preserveAspectRatio="xMidYMid slice"
          />
          {/* Sun-hot metal that cools as it is struck; invisible outside the scene. */}
          <circle className="coin-heat" r="96" fill="#ffd978" opacity="0" />
        </g>
        <circle
          className="coin-rim"
          r="95"
          fill="none"
          stroke="#fff0c4"
          strokeOpacity="0.55"
          strokeWidth="1.2"
          pathLength={1}
          strokeDasharray="1"
        />

        {!isMark && (
          <g
            className="coin-legend"
            fill="#4f3712"
            fillOpacity="0.88"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <text fontSize="12.5" letterSpacing="2.8" textAnchor="middle">
              <textPath href={`#${top}`} startOffset="50%">
                {isReverse ? "THE ETERNAL HORIZON" : "ISLAND OF THE BLESSED"}
              </textPath>
            </text>
            {isReverse ? (
              <text fontSize="13" letterSpacing="4" textAnchor="middle">
                <textPath href={`#${bottom}`} startOffset="50%">
                  OFFICIAL · LINKS · ONLY
                </textPath>
              </text>
            ) : (
              <text y="58" fontSize="12.5" letterSpacing="4.5" textAnchor="middle">
                ELYSIUM
              </text>
            )}
          </g>
        )}
      </g>
    </svg>
  );
}
