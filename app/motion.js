/**
 * GRUZLI / APP GUIDE MOTION
 * Kinetic title, scroll reveals and state-change transitions for the installation guide.
 */
import { gsap, ScrollTrigger, SplitText } from "../src/motion/core.js";

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
const mm = gsap.matchMedia();

mm.add(
  {
    reduce: "(prefers-reduced-motion: reduce)",
    desktop: "(min-width: 901px)",
  },
  (context) => {
    if (context.conditions.reduce) return undefined;
    let split;
    const scope = gsap.context(() => {
      const hero = document.querySelector(".app-hero");
      const title = hero?.querySelector("h1");
      if (title) {
        split = SplitText.create(title, {
          type: "lines,words",
          mask: "lines",
          linesClass: "app-hero-line++",
          wordsClass: "app-hero-word++",
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.words, {
              yPercent: 108,
              autoAlpha: 0,
              duration: 0.82,
              stagger: 0.055,
              ease: "power4.out",
              force3D: true,
            });
          },
        });
      }

      const eyebrow = hero?.querySelector(".eyebrow");
      const copy = hero?.querySelector(".hero-copy > p");
      const action = hero?.querySelector(".hero-button");
      const meta = hero?.querySelector(".hero-meta");
      const art = hero?.querySelectorAll(".art-phone");
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (eyebrow) intro.from(eyebrow, { y: 12, autoAlpha: 0, duration: 0.5 }, 0);
      if (copy) intro.from(copy, { y: 16, autoAlpha: 0, duration: 0.6 }, 0.55);
      if (action) intro.from(action, { y: 12, autoAlpha: 0, duration: 0.48 }, 0.78);
      if (meta) intro.from(meta, { y: 10, autoAlpha: 0, duration: 0.42 }, 0.95);
      if (art?.length) gsap.from(art, {
        y: 28, scale: 0.97, autoAlpha: 0, duration: 0.9,
        stagger: 0.12, delay: 0.28, ease: "power3.out", force3D: true,
      });

      const sections = gsap.utils.toArray(".guide-section, .desktop-section, .access-section");
      if (sections.length) {
        gsap.set(sections, { autoAlpha: 0, y: 22, force3D: true });
        ScrollTrigger.batch(sections, {
          start: "top 88%",
          once: true,
          interval: 0.12,
          batchMax: 3,
          onEnter(batch) {
            gsap.to(batch, {
              autoAlpha: 1, y: 0, duration: 0.66, stagger: 0.08,
              ease: "power3.out", overwrite: "auto",
              clearProps: "transform,willChange",
            });
          },
        });
      }
    });

    return () => {
      split?.revert();
      scope.revert();
    };
  },
);

const animateTargets = (targets, distance = 8) => {
  if (reduce.matches) return;
  gsap.fromTo(targets,
    { autoAlpha: 0, y: distance },
    {
      autoAlpha: 1, y: 0, duration: 0.36, stagger: 0.035,
      ease: "power3.out", force3D: true, overwrite: "auto",
      clearProps: "transform,opacity,visibility",
    },
  );
};

// Existing application handlers update the DOM first; this delegated listener animates
// only the changed panel, leaving tab semantics and business logic untouched.
document.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;

  if (target.closest(".device-tab")) {
    animateTargets([
      document.querySelector("#panel-eyebrow"),
      document.querySelector("#panel-title"),
      document.querySelector("#panel-intro"),
      document.querySelector("#step-list"),
      document.querySelector("#guide-actions"),
      document.querySelector(".guide-visual"),
    ].filter(Boolean), 9);
    return;
  }

  if (target.closest(".guide-step, .step-dots button, #prev-step, #next-step")) {
    animateTargets([
      document.querySelector("#instruction-callout"),
      document.querySelector("#phone-guide-overlay"),
      document.querySelector("#visual-label"),
      document.querySelector(".phone-screen img"),
    ].filter((node) => node && !node.hidden), 6);
  }
});

window.addEventListener("pagehide", () => mm.revert(), { once: true });
