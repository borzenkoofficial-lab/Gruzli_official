/**
 * GRUZLI / CARD MICRO-INTERACTIONS
 * Restrained pointer hover and press feedback. No layout animation or permanent loops.
 */
import { gsap } from "./core.js";

export function initCardInteractions() {
  const media = gsap.matchMedia();

  media.add("(prefers-reduced-motion: no-preference)", () => {
    const cleanups = [];
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const cards = gsap.utils.toArray(".hero-entry-card, .contrast-card, .workflow-card, .feature-card, .download-roles > a");

    cards.forEach((card) => {
      const onEnter = () => gsap.to(card, {
        y: -3,
        duration: 0.22,
        ease: "power2.out",
        overwrite: "auto",
        force3D: true,
      });
      const onLeave = () => gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "power3.out",
        overwrite: "auto",
        force3D: true,
      });
      const onDown = () => gsap.to(card, {
        scale: 0.988,
        duration: 0.12,
        ease: "power2.out",
        overwrite: "auto",
      });
      const onUp = () => gsap.to(card, {
        scale: 1,
        duration: 0.26,
        ease: "back.out(2)",
        overwrite: "auto",
      });

      if (finePointer) {
        card.addEventListener("pointerenter", onEnter);
        card.addEventListener("pointerleave", onLeave);
        cleanups.push(() => {
          card.removeEventListener("pointerenter", onEnter);
          card.removeEventListener("pointerleave", onLeave);
        });
      }

      if (card.matches("a, button, [role='button']")) {
        card.addEventListener("pointerdown", onDown);
        card.addEventListener("pointerup", onUp);
        card.addEventListener("pointercancel", onUp);
        cleanups.push(() => {
          card.removeEventListener("pointerdown", onDown);
          card.removeEventListener("pointerup", onUp);
          card.removeEventListener("pointercancel", onUp);
        });
      }
    });

    return () => {
      cleanups.reverse().forEach((cleanup) => cleanup());
      gsap.killTweensOf(cards);
    };
  });

  return () => media.revert();
}
