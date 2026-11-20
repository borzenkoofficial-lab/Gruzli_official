/**
 * GRUZLI Motion Foundation
 * Central GSAP registration and shared motion preferences.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };
export const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
