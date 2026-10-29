"use client";

import { useCallback, useRef, type RefObject } from "react";
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  registerGsap,
  MEDIA,
  VOYAGE_LENGTH,
} from "@/lib/motion";
import { chapters, type ChapterId } from "@/lib/story";

registerGsap();

/**
 * Story beats on one scrubbed timeline (time units are arbitrary; scroll
 * distance maps onto the whole). `at` starts a chapter for the dial,
 * `view` is where a chapter jump lands so its words are on screen.
 */
const BEATS: Record<ChapterId, { at: number; view: number }> = {
  forgotten: { at: 0, view: 0 },
  wave: { at: 2.2, view: 3.25 },
  reveal: { at: 4.4, view: 6.3 },
  enter: { at: 7.0, view: 8.9 },
  realm: { at: 9.4, view: 10.5 },
  horizon: { at: 11.0, view: 12.4 },
};

/** Painting coordinates the camera pushes toward. */
const FOCUS = {
  horizon: { wide: "58.6% 26%", portrait: "60.8% 28.3%" },
  temple: { wide: "51.5% 17%", portrait: "54.7% 37.6%" },
};

/** The crest painting's silhouette, as fractions of its own box. */
const CREST = { peak: { x: 0.37, y: 0.057 }, lip: 0.72 };

export function useCinematicTimeline(root: RefObject<HTMLElement | null>) {
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MEDIA, (ctx) => {
        const { motion, portrait } = ctx.conditions as {
          motion: boolean;
          portrait: boolean;
        };
        if (!motion) return;

        const q = gsap.utils.selector(root);
        const stage = q(".stage")[0] as HTMLElement;
        const arc = q(".dial-arc")[0] as unknown as SVGCircleElement | undefined;
        const numeral = q(".dial-numeral")[0] as HTMLElement | undefined;
        const dialTitle = q(".dial-title")[0] as HTMLElement | undefined;
        const dots = q("[data-dial-dot]") as HTMLElement[];
        const length = portrait ? VOYAGE_LENGTH.portrait : VOYAGE_LENGTH.wide;
        let current: ChapterId | null = null;

        const markChapter = (time: number) => {
          let id: ChapterId = "forgotten";
          for (const c of chapters) if (time >= BEATS[c.id].at - 0.01) id = c.id;
          if (id === current) return;
          current = id;
          const chapter = chapters.find((c) => c.id === id)!;
          if (numeral) numeral.textContent = chapter.numeral;
          if (dialTitle) dialTitle.textContent = chapter.title.replace(/\.$/, "");
          dots.forEach((d) => {
            const on = d.dataset.dialDot === id;
            d.toggleAttribute("data-active", on);
            if (on) d.setAttribute("aria-current", "step");
            else d.removeAttribute("aria-current");
          });
        };

        gsap.set(q(".cam-horizon"), { transformOrigin: portrait ? FOCUS.horizon.portrait : FOCUS.horizon.wide });
        gsap.set(q(".cam-island"), { transformOrigin: portrait ? FOCUS.temple.portrait : FOCUS.temple.wide });
        gsap.set(q(".coin"), { transformOrigin: "50% 84%" });
        gsap.set(q(".coin-face, .coin-sun, .coin-glow, .coin-legend"), { autoAlpha: 0 });
        gsap.set(q(".coin-reveal"), { attr: { r: 18 } });
        gsap.set(q(".coin-heat"), { opacity: 1 });
        gsap.set(q(".coin-rim"), { strokeDashoffset: 1 });
        gsap.set(q(".iso-tilt"), { transformPerspective: 1400, transformOrigin: "50% 60%" });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${window.innerHeight * length}`,
            pin: stage,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
          onUpdate: () => {
            if (arc) arc.style.strokeDashoffset = String(1 - tl.progress());
            markChapter(tl.time());
          },
        });
        tlRef.current = tl;

        const copyIn = (id: ChapterId, at: number) =>
          tl.fromTo(
            q(`[data-copy="${id}"]`),
            { autoAlpha: 0, y: 28 },
            { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
            at,
          );
        const copyOut = (id: ChapterId, at: number) =>
          tl.to(
            q(`[data-copy="${id}"]`),
            { autoAlpha: 0, y: -20, duration: 0.4, ease: "power1.in" },
            at,
          );

        for (const c of chapters) {
          tl.addLabel(c.id, BEATS[c.id].at);
          tl.addLabel(`${c.id}-view`, BEATS[c.id].view);
        }

        /* I · The Forgotten World — the camera advances on the horizon. */
        tl.to(q(".scroll-cue"), { autoAlpha: 0, duration: 0.3 }, 0)
          .to(q(".opening"), { autoAlpha: 0, y: -48, duration: 0.9, ease: "power1.in" }, 0.15)
          .to(q(".cam-horizon"), { scale: 1.3, duration: 2.6, ease: "power1.inOut" }, 0)
          .to(q(".cam-fgsea"), { scale: 1.55, yPercent: 9, duration: 2.6, ease: "power1.in" }, 0)
          .to(q(".cloud-a"), { xPercent: -9, duration: 3.6 }, 0)
          .to(q(".cloud-b"), { xPercent: 7, duration: 3.6 }, 0)
          .to(q(".l-clouds"), { autoAlpha: 0, duration: 0.5 }, 3.2);
        copyIn("forgotten", 0.9);
        copyOut("forgotten", 1.9);

        /* II · The Great Wave — the crest rises out of the foreground sea,
           rolls across the horizon over the island's lower half, and breaks. */
        const crest = q(".wave-crest")[0] as HTMLElement;
        const crestX = (peakAt: number) => () => peakAt * window.innerWidth - CREST.peak.x * crest.offsetWidth;
        const crestY = (peakTop: number) => () =>
          (peakTop - 1) * window.innerHeight + (1 - CREST.peak.y) * crest.offsetHeight;
        const islandX = portrait ? 0.61 : 0.586;

        // Lighter on portrait, where the crest fills the frame and the shade turns its spray grey.
        tl.to(q(".shade"), { autoAlpha: portrait ? 0.15 : 0.35, duration: 0.8 }, 2.0)
          .to(q(".cam-horizon"), { scale: 1.42, duration: 0.9, ease: "power2.in" }, 2.6)
          .set(q(".wave-crest"), { autoAlpha: 1 }, 2.2)
          .fromTo(
            q(".wave-crest"),
            { x: () => -0.05 * window.innerWidth - CREST.lip * crest.offsetWidth, y: crestY(1.02) },
            { x: crestX(islandX), duration: 1.1, ease: "power1.out" },
            2.2,
          )
          .to(q(".wave-crest"), { y: crestY(portrait ? 0.3 : 0.28), duration: 1.1, ease: "power2.out" }, 2.2)
          .to(q(".wave-crest"), { x: crestX(1.3), duration: 1.0, ease: "power1.in" }, 3.3)
          .to(q(".wave-crest"), { y: crestY(1.1), duration: 0.8, ease: "power2.in" }, 3.5)
          .set(q(".wave-crest"), { autoAlpha: 0 }, 4.35)
          .to(q(".shade"), { autoAlpha: portrait ? 0.2 : 0.5, duration: 0.4 }, 2.9)
          .to(q(".shade"), { autoAlpha: 0, duration: 0.6 }, 3.6)
          .fromTo(q(".foam-a"), { xPercent: -70, autoAlpha: 0 }, { xPercent: 30, autoAlpha: 0.9, duration: 1.1, ease: "power2.out" }, 2.5)
          .to(q(".foam-a"), { autoAlpha: 0, duration: 0.5 }, 3.5)
          .fromTo(q(".foam-b"), { xPercent: -40, autoAlpha: 0 }, { xPercent: 60, duration: 1.0, ease: "power2.out" }, 3.6)
          .to(q(".foam-b"), { autoAlpha: 0.8, duration: 0.3 }, 3.6)
          .to(q(".foam-b"), { autoAlpha: 0, duration: 0.4 }, 4.3)
          // Push into the island and dissolve to the view from above.
          .to(q(".cam-horizon"), { scale: 2.6, duration: 0.7, ease: "power2.in" }, 4.0)
          .to(q(".cam-fgsea"), { scale: 2.2, yPercent: 30, duration: 0.7, ease: "power2.in" }, 4.0)
          .fromTo(q(".cam-island"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: "power1.inOut" }, 4.3)
          .set(q(".l-horizon, .l-fgsea"), { autoAlpha: 0 }, 4.8);
        copyIn("wave", 2.7);
        copyOut("wave", 3.9);

        /* III · The island settles into view in depth — sea, land and cloud
           at different rates — and sunlight walks across it. */
        tl.fromTo(
          q(".iso-tilt"),
          { rotateX: 14, rotateZ: -2, scale: 0.94 },
          { rotateX: 0, rotateZ: 0, scale: 1, duration: 2.0, ease: "power2.out" },
          4.3,
        )
          .fromTo(q(".iso-sea"), { scale: 1.36 }, { scale: 1, duration: 2.0, ease: "power2.out" }, 4.3)
          .fromTo(q(".iso-land"), { scale: 0.86, yPercent: 7 }, { scale: 1, yPercent: 0, duration: 2.0, ease: "power2.out" }, 4.3)
          .fromTo(
            q(".iso-cloud-a"),
            { xPercent: 24, yPercent: 10, autoAlpha: 0.95 },
            { xPercent: -30, yPercent: -10, autoAlpha: 0.35, duration: 2.2, ease: "power2.out" },
            4.3,
          )
          .fromTo(
            q(".iso-cloud-b"),
            { xPercent: -24, yPercent: -6, autoAlpha: 0.9 },
            { xPercent: 32, yPercent: 10, autoAlpha: 0.3, duration: 2.2, ease: "power2.out" },
            4.3,
          )
          .to(q(".iso-tilt"), { scale: 1.04, duration: 0.8, ease: "none" }, 6.0)
          .fromTo(
            q(".iso-shade"),
            { "--lr": "0%", "--lx": "28%", "--ly": "44%" },
            { "--lr": "110%", "--lx": "51%", "--ly": "35%", duration: 2.1, ease: "power1.inOut" },
            4.7,
          )
          .fromTo(
            q(".feature"),
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.32, ease: "power2.out" },
            5.1,
          )
          .to(q(".feature"), { autoAlpha: 0, duration: 0.3 }, 6.6);
        copyIn("reveal", 5.0);
        copyOut("reveal", 6.6);

        /* IV · Enter Elysium — the sun rises behind the temple, mist, arrival. */
        tl.to(q(".l-approach"), { autoAlpha: 1, duration: 0.6 }, 6.7)
          .to(q(".cam-island"), { scale: 2.1, duration: 1.6, ease: "power2.in" }, 6.8)
          .fromTo(q(".l-mist"), { autoAlpha: 0, scale: 1.1 }, { autoAlpha: 0.95, scale: 1.8, duration: 0.9, ease: "power1.in" }, 7.4)
          .to(q(".veil"), { autoAlpha: 0.92, duration: 0.4, ease: "power2.in" }, 7.85)
          .to(q(".veil"), { autoAlpha: 0, duration: 0.7, ease: "power2.out" }, 8.3)
          .set(q(".l-temple"), { autoAlpha: 1 }, 8.25)
          .set(q(".cam-island"), { autoAlpha: 0 }, 8.3)
          .to(q(".l-mist"), { autoAlpha: 0, scale: 2.6, duration: 0.9, ease: "power1.out" }, 8.3)
          .fromTo(
            q(".cam-temple"),
            { scale: 1.24, yPercent: portrait ? 0 : 12 },
            { scale: 1.06, yPercent: portrait ? 0 : 10, duration: 1.4, ease: "power2.out" },
            8.25,
          )
          .fromTo(q(".temple-dusk"), { autoAlpha: 0.55 }, { autoAlpha: 0, duration: 1.1 }, 8.3);
        copyIn("enter", 8.5);
        copyOut("enter", 9.35);

        /* V · The Blessed Realm — the sun is struck into the ELYSIUM coin. */
        tl.to(
          q(".cam-temple"),
          { xPercent: portrait ? -1.5 : -2.5, yPercent: portrait ? 0 : 21, duration: 1.6, ease: "sine.inOut" },
          9.4,
        )
          .to(q(".coin-sun"), { autoAlpha: 1, duration: 0.25 }, 9.4)
          .fromTo(q(".coin-glow"), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1.15, duration: 0.8 }, 9.4)
          // The coin swells over the painted sun, kept behind the roof by the CSS roofline clip.
          .to(q(".coin"), { scale: portrait ? 1.12 : 1.3, yPercent: portrait ? -2 : 8, duration: 1, ease: "power2.inOut" }, 9.5)
          .to(q(".coin-face"), { autoAlpha: 1, duration: 0.05 }, 9.6)
          .to(q(".coin-reveal"), { attr: { r: 220 }, duration: 0.55, ease: "power2.in" }, 9.6)
          .to(q(".coin-heat"), { opacity: 0, duration: 0.45, ease: "power1.in" }, 9.75)
          .to(q(".coin-sun"), { autoAlpha: 0, duration: 0.2 }, 10.05)
          .to(q(".coin-rim"), { strokeDashoffset: 0, duration: 0.5 }, 9.75)
          .to(q(".coin-glow"), { scale: 1.4, duration: 0.15, ease: "power2.out" }, 10.0)
          .to(q(".coin-glow"), { scale: 1.1, autoAlpha: 0.75, duration: 0.4, ease: "power2.inOut" }, 10.15)
          .to(q(".coin-legend"), { autoAlpha: 1, duration: 0.4 }, 10.0);
        copyIn("realm", 10.0);
        copyOut("realm", 10.9);

        /* VI · The Eternal Horizon — pull back to the last frame. */
        tl.to(q(".coin"), { autoAlpha: 0, scale: 0.7, yPercent: 30, duration: 0.6 }, 10.95)
          .to(q(".l-eternal"), { autoAlpha: 1, duration: 0.8 }, 11.0)
          .fromTo(q(".cam-eternal"), { scale: 1.22 }, { scale: 1, duration: 1.4, ease: "power2.out" }, 11.0);
        copyIn("horizon", 11.6);
        tl.to({}, { duration: 0.6 }, 12.1);

        /* Ambient life, independent of scroll. */
        gsap.to(q(".drift"), {
          x: "+=2.5%",
          duration: 14,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          stagger: 3,
        });

        markChapter(0);
        document.fonts?.ready.then(() => ScrollTrigger.refresh());

        return () => {
          tlRef.current = null;
        };
      });
    },
    { scope: root },
  );

  const jumpTo = useCallback((id: ChapterId) => {
    const st = tlRef.current?.scrollTrigger;
    if (!st) return;
    window.scrollTo({ top: st.labelToScroll(`${id}-view`), behavior: "smooth" });
  }, []);

  return { jumpTo };
}
