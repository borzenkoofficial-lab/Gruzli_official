/**
 * GRUZLI / HOLOMOSAIC HERO ENTRANCE
 * Keep the new hero intentionally quiet: typography enters once, mosaic owns the visual field.
 */
import { gsap } from "./core.js";

export function initHeroMotion() {
  const hero = document.querySelector(".hero--mosaic");
  if (!hero) return () => {};
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const content = hero.querySelector(".hero-mosaic-content");
  const top = hero.querySelector(".hero-mosaic-topline");
  const footer = hero.querySelector(".hero-mosaic-footer");
  const actions = hero.querySelectorAll(".hero-mosaic-action");
  if (reduce) {
    gsap.set([content, top, footer, ...actions].filter(Boolean), { autoAlpha: 1, y: 0, clearProps: "all" });
    return () => {};
  }
  const scope = gsap.context(() => {
    gsap.from(top, { y: -12, autoAlpha: 0, duration: 0.7, ease: "power3.out" });
    gsap.from(content, { y: 24, autoAlpha: 0, duration: 1.05, delay: 0.12, ease: "power3.out" });
    gsap.from(actions, { y: 14, autoAlpha: 0, duration: 0.65, stagger: 0.1, delay: 0.56, ease: "power3.out" });
    gsap.from(footer, { y: 8, autoAlpha: 0, duration: 0.7, delay: 0.62, ease: "power2.out" });
  }, hero);
  return () => scope.revert();
}
