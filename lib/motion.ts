"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
}

/** Shared with the CSS art-direction breakpoint in globals.css. */
export const PORTRAIT_QUERY = "(max-aspect-ratio: 4/5)";

export const MEDIA = {
  motion: "(prefers-reduced-motion: no-preference)",
  portrait: PORTRAIT_QUERY,
} as const;

/** Length of the pinned voyage, in viewport heights. */
export const VOYAGE_LENGTH = { wide: 7, portrait: 5.5 } as const;

export { gsap, ScrollTrigger, useGSAP };
