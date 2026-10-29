export function ScrollIndicator() {
  return (
    <div
      className="scroll-cue pointer-events-none absolute inset-x-0 bottom-[4.5svh] z-20"
      aria-hidden
    >
      <div className="title-sub flex flex-col items-center gap-3">
        <span className="sea-shadow font-sans text-[0.6875rem] font-medium tracking-[0.4em] text-ivory/80 uppercase">
          Scroll to sail
        </span>
        <span className="relative h-10 w-px overflow-hidden bg-ivory/15">
          <span className="tide-line absolute inset-0 bg-gold" />
        </span>
      </div>
    </div>
  );
}
