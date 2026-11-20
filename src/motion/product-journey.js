/**
 * GRUZLI / CINEMATIC PRODUCT JOURNEY
 * A scroll-driven camera orbit through seven product chapters.
 */
import { gsap, ScrollTrigger } from "./core.js";
import "./product-journey.css";

export function initProductJourney() {
  const root = document.querySelector("#product-journey");
  if (!root) return () => {};
  const stage = root.querySelector(".journey-stage");
  const camera = root.querySelector(".journey-camera");
  const phone = root.querySelector(".journey-phone");
  const copies = gsap.utils.toArray("[data-journey-copy]", root);
  const screens = ["feed", "client", "order", "profile"].map((name) => root.querySelector(`[data-journey-screen="${name}"]`));
  const dispatchPanel = root.querySelector(".journey-dispatch-panel");
  const floating = gsap.utils.toArray("[data-journey-float]", root);
  const progress = root.querySelector(".journey-progress-fill");
  const counter = root.querySelector(".journey-counter-current");
  const starfield = root.querySelector(".journey-starfield");
  if (!stage || !camera || !phone || copies.length !== 7 || screens.some((screen) => !screen)) return () => {};

  // Deterministic particles: no random work or continuous animation outside the scroll timeline.
  if (starfield && !starfield.children.length) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 46; i += 1) {
      const spark = document.createElement("i");
      spark.className = "journey-spark";
      spark.style.setProperty("--x", `${(i * 37) % 100}%`);
      spark.style.setProperty("--y", `${(i * 61 + 13) % 100}%`);
      spark.style.setProperty("--delay", `${(i % 9) * -0.17}s`);
      spark.style.setProperty("--size", `${i % 5 === 0 ? 3 : 1 + (i % 2)}px`);
      fragment.appendChild(spark);
    }
    starfield.appendChild(fragment);
  }
  const sparks = starfield ? gsap.utils.toArray(".journey-spark", starfield) : [];
  const media = gsap.matchMedia();
  const scope = gsap.context(() => {
    gsap.set(copies, { autoAlpha: 0, y: 28, filter: "blur(8px)" });
    gsap.set(copies[0], { autoAlpha: 1, y: 0, filter: "blur(0px)" });
    gsap.set(screens, { autoAlpha: 0 });
    gsap.set(screens[0], { autoAlpha: 1 });
    gsap.set(dispatchPanel, { autoAlpha: 0, x: 90, rotateY: -24, scale: 0.94 });
    gsap.set(floating, { autoAlpha: 0, y: 18, rotateZ: -2 });
    gsap.set(progress, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(sparks, { autoAlpha: 0.16, scale: 0.65, x: 0, y: 0 });

    media.add(
      { reduce: "(prefers-reduced-motion: reduce)", compact: "(max-width: 760px)" },
      (context) => {
        if (context.conditions.reduce) {
          gsap.set(copies, { autoAlpha: 1, y: 0, filter: "blur(0px)", clearProps: "transform" });
          gsap.set(screens, { autoAlpha: 0 });
          gsap.set(screens[0], { autoAlpha: 1 });
          gsap.set(progress, { scaleX: 1 });
          return undefined;
        }
        const compact = context.conditions.compact;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: compact ? 0.5 : 0.75, invalidateOnRefresh: true },
        });
        const showChapter = (index, at) => {
          if (index > 0) tl.to(copies[index - 1], { autoAlpha: 0, y: -24, filter: "blur(7px)", duration: 0.13 }, at);
          tl.to(copies[index], { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.24, ease: "power3.out" }, at + 0.06);
          if (counter) tl.set(counter, { textContent: String(index + 1).padStart(2, "0") }, at + 0.06);
          tl.to(progress, { scaleX: (index + 1) / 7, duration: 0.28 }, at);
        };
        const revealScreen = (active, at) => {
          screens.forEach((screen, i) => {
            if (i !== active) tl.to(screen, { autoAlpha: 0, duration: 0.12 }, at);
          });
          tl.to(screens[active], { autoAlpha: 1, duration: 0.2 }, at + 0.08);
        };
        const cameraMove = (vars, at, duration = 0.86) => tl.to(camera, { ...vars, duration, ease: "power2.inOut" }, at);
        const phoneMove = (vars, at, duration = 0.86) => tl.to(phone, { ...vars, duration, ease: "power2.inOut" }, at);
        const sparkBurst = (at, strength = 1) => {
          tl.to(sparks, { autoAlpha: 0.88, scale: 1.3, x: (i) => ((i % 2 ? 1 : -1) * (24 + (i % 7) * 9) * strength), y: (i) => -((i % 6) * 8 + 12) * strength, stagger: { each: 0.006, from: "random" }, duration: 0.22 }, at);
          tl.to(sparks, { autoAlpha: 0.18, scale: 0.7, x: 0, y: 0, duration: 0.5 }, at + 0.22);
        };

        // 01 — the device emerges from a dark product space.
        cameraMove({ x: compact ? "0vw" : "3vw", y: "1vh", rotationY: -9, rotationX: 4 }, 0, 0.9);
        phoneMove({ x: compact ? "0vw" : "8vw", y: "4vh", scale: compact ? 0.72 : 0.8, rotationY: -25, rotationZ: -7 }, 0, 0.9);
        tl.to(floating.slice(0, 2), { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.28 }, 0.42);
        sparkBurst(0.38, 0.7);

        // 02 — orbit into the worker feed.
        showChapter(1, 1); revealScreen(0, 1);
        cameraMove({ x: compact ? "0vw" : "-4vw", z: 120, rotationY: 15, rotationX: -3 }, 1);
        phoneMove({ x: compact ? "0vw" : "-3vw", y: "0vh", scale: compact ? 0.91 : 1.12, rotationY: 9, rotationZ: 1 }, 1);
        sparkBurst(1.25, 1.1);

        // 03 — turn the device to the client request list.
        showChapter(2, 2); revealScreen(1, 2);
        cameraMove({ x: compact ? "0vw" : "5vw", z: 55, rotationY: -18, rotationX: 2 }, 2);
        phoneMove({ x: compact ? "0vw" : "7vw", y: "1vh", scale: compact ? 0.86 : 0.98, rotationY: -14, rotationZ: 4 }, 2);
        sparkBurst(2.22, 0.9);

        // 04 — push into order detail; the card becomes the focal point.
        showChapter(3, 3); revealScreen(2, 3);
        cameraMove({ x: compact ? "0vw" : "-5vw", z: 160, rotationY: 11, rotationX: -2 }, 3);
        phoneMove({ x: compact ? "0vw" : "-4vw", y: "0vh", scale: compact ? 0.96 : 1.2, rotationY: 5, rotationZ: -1 }, 3);
        sparkBurst(3.18, 1.25);

        // 05 — a wider orbit reveals the dispatcher workflow.
        showChapter(4, 4);
        cameraMove({ x: compact ? "0vw" : "4vw", z: 20, rotationY: -17, rotationX: 5 }, 4);
        phoneMove({ x: compact ? "0vw" : "14vw", y: "1vh", scale: compact ? 0.67 : 0.75, rotationY: 28, rotationZ: 6 }, 4);
        tl.to(dispatchPanel, { autoAlpha: 1, x: 0, rotateY: 0, scale: 1, duration: 0.58, ease: "power3.out" }, 4.18);
        tl.to(floating.slice(2), { autoAlpha: 1, y: 0, stagger: 0.07, duration: 0.3 }, 4.28);
        sparkBurst(4.3, 1.1);

        // 06 — rotate back to the worker profile and order history.
        showChapter(5, 5); revealScreen(3, 5);
        cameraMove({ x: compact ? "0vw" : "-3vw", z: 125, rotationY: 8, rotationX: -3 }, 5);
        phoneMove({ x: compact ? "0vw" : "-8vw", y: "0vh", scale: compact ? 0.88 : 1.04, rotationY: -10, rotationZ: -2 }, 5);
        tl.to(dispatchPanel, { autoAlpha: 0.36, x: 34, rotateY: -12, duration: 0.32 }, 5.12);
        sparkBurst(5.28, 0.8);

        // 07 — pull back to the complete connected system.
        showChapter(6, 6); revealScreen(1, 6);
        cameraMove({ x: "0vw", y: "0vh", z: 0, rotationY: 0, rotationX: 0 }, 6);
        phoneMove({ x: "0vw", y: "0vh", scale: compact ? 0.75 : 0.86, rotationY: 0, rotationZ: 0 }, 6);
        tl.to(dispatchPanel, { autoAlpha: 0.82, x: 0, rotateY: 0, duration: 0.5 }, 6.18);
        tl.to(floating, { y: 0, duration: 0.28 }, 6.2);
        sparkBurst(6.25, 0.7);
        tl.to(progress, { scaleX: 1, duration: 0.25 }, 6.72);
        return () => tl.scrollTrigger && tl.scrollTrigger.kill();
      },
    );
  }, root);
  const refresh = () => ScrollTrigger.refresh();
  document.fonts?.ready?.then(refresh);
  window.addEventListener("load", refresh, { once: true });
  return () => { window.removeEventListener("load", refresh); media.revert(); scope.revert(); };
}
