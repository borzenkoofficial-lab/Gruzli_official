/**
 * GRUZLI / HERO MOTION
 * One controlled entrance sequence, responsive typography and restrained depth.
 */
import { gsap, ScrollTrigger, SplitText } from "./core.js";

export function initHeroMotion() {
  const hero = document.querySelector(".hero");
  if (!hero) return () => {};

  const media = gsap.matchMedia();

  media.add(
    {
      reduce: "(prefers-reduced-motion: reduce)",
      desktop: "(min-width: 901px)",
      finePointer: "(hover: hover) and (pointer: fine)",
    },
    (context) => {
      if (context.conditions.reduce) return undefined;

      let split;
      let removePointerMotion = () => {};
      const title = hero.querySelector("h1");
      const eyebrow = hero.querySelector(".hero-eyebrow");
      const projectType = hero.querySelector(".hero-project-type");
      const lead = hero.querySelector(".hero-lead");
      const release = hero.querySelector(".hero-release");
      const choices = hero.querySelectorAll(".hero-entry-card");
      const meta = hero.querySelector(".hero-meta");
      const visual = hero.querySelector(".hero-visual");
      const phones = hero.querySelectorAll(".hero-phone");
      const visualLabel = hero.querySelector(".hero-visual-label");

      const scope = gsap.context(() => {
        // Split by words, not individual glyphs: better kerning and less DOM on mobile.
        if (title) {
          split = SplitText.create(title, {
            type: "lines,words",
            mask: "lines",
            linesClass: "hero-line++",
            wordsClass: "hero-word++",
            autoSplit: true,
            onSplit(self) {
              return gsap.from(self.words, {
                yPercent: 112,
                autoAlpha: 0,
                duration: 0.88,
                stagger: 0.065,
                delay: 0.16,
                ease: "power4.out",
                force3D: true,
                overwrite: "auto",
              });
            },
          });
        }

        // Supporting elements follow the headline instead of competing with it.
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        if (eyebrow) intro.from(eyebrow, { y: 14, autoAlpha: 0, duration: 0.52 }, 0);
        if (projectType) intro.from(projectType, { y: 12, autoAlpha: 0, duration: 0.52 }, 0.08);
        if (lead) intro.from(lead, { y: 18, autoAlpha: 0, duration: 0.68 }, 0.62);
        if (release) intro.from(release, { y: 16, autoAlpha: 0, duration: 0.62 }, 0.82);
        if (choices.length) intro.from(choices, {
          y: 22,
          autoAlpha: 0,
          duration: 0.72,
          stagger: 0.12,
          ease: "power3.out",
          force3D: true,
        }, 0.98);
        if (meta) intro.from(meta, { y: 12, autoAlpha: 0, duration: 0.48 }, 1.28);

        if (phones.length) {
          gsap.from(phones, {
            y: 34,
            scale: 0.965,
            autoAlpha: 0,
            duration: 1.05,
            stagger: 0.14,
            delay: 0.34,
            ease: "power3.out",
            force3D: true,
            clearProps: "willChange",
          });
        }
        if (visualLabel) {
          gsap.from(visualLabel, {
            y: 10,
            autoAlpha: 0,
            duration: 0.6,
            delay: 0.82,
            ease: "power2.out",
          });
        }

        // Ambient background movement is intentionally slow and low amplitude.
        const glow = hero.querySelector(".hero-glow-one");
        if (glow && context.conditions.desktop) {
          gsap.to(glow, {
            x: 14,
            y: 12,
            scale: 1.035,
            duration: 12,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }

        // Scroll depth is desktop-only; no blur, pinning or mobile scrub.
        if (visual && context.conditions.desktop) {
          gsap.to(visual, {
            y: 28,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: 0.65,
              invalidateOnRefresh: true,
            },
          });
        }

        // Pointer parallax is capped to a few pixels and only enabled on precise pointers.
        if (visual && context.conditions.finePointer) {
          const front = visual.querySelector(".hero-phone-main");
          const back = visual.querySelector(".hero-phone-back");
          const frontX = front ? gsap.quickTo(front, "x", { duration: 0.7, ease: "power3.out" }) : null;
          const frontY = front ? gsap.quickTo(front, "y", { duration: 0.7, ease: "power3.out" }) : null;
          const backX = back ? gsap.quickTo(back, "x", { duration: 0.85, ease: "power3.out" }) : null;
          const backY = back ? gsap.quickTo(back, "y", { duration: 0.85, ease: "power3.out" }) : null;

          const onPointerMove = (event) => {
            const rect = visual.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
            const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
            frontX?.(x * 7);
            frontY?.(y * 5);
            backX?.(x * -4);
            backY?.(y * -3);
          };
          const onPointerLeave = () => {
            frontX?.(0);
            frontY?.(0);
            backX?.(0);
            backY?.(0);
          };

          visual.addEventListener("pointermove", onPointerMove, { passive: true });
          visual.addEventListener("pointerleave", onPointerLeave, { passive: true });
          removePointerMotion = () => {
            visual.removeEventListener("pointermove", onPointerMove);
            visual.removeEventListener("pointerleave", onPointerLeave);
          };
        }
      }, hero);

      return () => {
        removePointerMotion();
        split?.revert();
        scope.revert();
      };
    },
  );

  return () => media.revert();
}
