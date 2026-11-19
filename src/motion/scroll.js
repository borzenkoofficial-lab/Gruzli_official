/**
 * GRUZLI / SCROLL MOTION
 * Small, one-shot reveals. No scroll blur, pinning or continuous mobile work.
 */
import { gsap, ScrollTrigger } from "./core.js";

export function initScrollMotion() {
  const targets = gsap.utils.toArray(".reveal");
  if (!targets.length) return () => {};

  const media = gsap.matchMedia();
  media.add("(prefers-reduced-motion: no-preference)", () => {
    const scope = gsap.context(() => {
      gsap.set(targets, {
        autoAlpha: 0,
        y: 22,
        force3D: true,
      });

      ScrollTrigger.batch(targets, {
        start: "top 88%",
        once: true,
        interval: 0.12,
        batchMax: 4,
        onEnter(batch) {
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.68,
            stagger: 0.075,
            ease: "power3.out",
            overwrite: "auto",
            clearProps: "transform,willChange",
          });
        },
      });
    });

    // Recalculate after the web font has settled; SplitText handles its own re-splitting.
    document.fonts?.ready?.then(() => ScrollTrigger.refresh());
    return () => scope.revert();
  });

  // The four order statuses form a single semantic sequence; reveal them as a group.
  const statusCards = gsap.utils.toArray(".story-statuses .vessel-card");
  if (statusCards.length) {
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const statusScope = gsap.context(() => {
        gsap.set(statusCards, { autoAlpha: 0, y: 12, force3D: true });
        ScrollTrigger.create({
          trigger: statusCards[0].parentElement,
          start: "top 86%",
          once: true,
          onEnter: () => gsap.to(statusCards, {
            autoAlpha: 1,
            y: 0,
            duration: 0.52,
            stagger: 0.09,
            ease: "power3.out",
            overwrite: "auto",
            clearProps: "transform,willChange",
          }),
        });
      });
      return () => statusScope.revert();
    });
  }

  return () => media.revert();
}
