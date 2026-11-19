/**
 * GRUZLI / PRODUCT JOURNEY
 * One persistent 3D product scene. Scroll moves the camera around real app screens.
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
  const feed = root.querySelector('[data-journey-screen="feed"]');
  const profile = root.querySelector('[data-journey-screen="profile"]');
  const dispatchPanel = root.querySelector(".journey-dispatch-panel");
  const floating = gsap.utils.toArray("[data-journey-float]", root);
  const progress = root.querySelector(".journey-progress-fill");
  const counter = root.querySelector(".journey-counter-current");
  if (!stage || !camera || !phone || copies.length !== 5) return () => {};

  const media = gsap.matchMedia();
  const scope = gsap.context(() => {
    gsap.set(copies, { autoAlpha: 0, y: 22 });
    gsap.set(copies[0], { autoAlpha: 1, y: 0 });
    gsap.set(profile, { autoAlpha: 0 });
    gsap.set(dispatchPanel, { autoAlpha: 0, x: 70, rotateY: -18 });
    gsap.set(floating, { autoAlpha: 0, y: 12 });
    gsap.set(progress, { scaleX: 0, transformOrigin: "left center" });

    media.add(
      {
        reduce: "(prefers-reduced-motion: reduce)",
        compact: "(max-width: 760px)",
        desktop: "(min-width: 761px)",
      },
      (context) => {
        if (context.conditions.reduce) {
          gsap.set(copies, { autoAlpha: 1, y: 0, clearProps: "transform" });
          gsap.set(feed, { autoAlpha: 1, clearProps: "transform" });
          gsap.set(profile, { autoAlpha: 0, clearProps: "transform" });
          gsap.set(dispatchPanel, { autoAlpha: 0 });
          gsap.set(progress, { scaleX: 1 });
          return undefined;
        }
        const compact = context.conditions.compact;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            scrub: compact ? 0.55 : 0.8,
            invalidateOnRefresh: true,
          },
        });
        const showCopy = (index, at) => {
          if (index > 0) tl.to(copies[index - 1], { autoAlpha: 0, y: -18, duration: 0.16 }, at);
          tl.to(copies[index], { autoAlpha: 1, y: 0, duration: 0.22, ease: "power3.out" }, at + 0.08);
          if (counter) tl.set(counter, { textContent: "0" + (index + 1) }, at + 0.08);
          tl.to(progress, { scaleX: (index + 1) / 5, duration: 0.3 }, at);
        };

        // 01 — establish the product in space.
        tl.fromTo(camera,
          { x: compact ? "0vw" : "4vw", y: compact ? "3vh" : "0vh", rotationY: -7, rotationX: 3 },
          { x: compact ? "0vw" : "-1vw", y: "0vh", rotationY: 5, rotationX: 0, duration: 0.85 }, 0);
        tl.fromTo(phone,
          { x: compact ? "0vw" : "10vw", y: "4vh", scale: compact ? 0.72 : 0.82, rotationY: -22, rotationZ: -7 },
          { x: compact ? "0vw" : "4vw", y: "0vh", scale: compact ? 0.78 : 0.9, rotationY: -13, rotationZ: -3, duration: 0.85 }, 0);
        tl.to(floating.slice(0, 2), { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.25 }, 0.45);

        // 02 — camera approaches the real feed screen.
        showCopy(1, 1);
        tl.to(camera, { x: compact ? "0vw" : "-5vw", z: 90, rotationY: 13, rotationX: -2, duration: 0.9 }, 1);
        tl.to(phone, { x: compact ? "0vw" : "-3vw", y: "1vh", scale: compact ? 0.9 : 1.12, rotationY: 8, rotationZ: 1, duration: 0.9 }, 1);
        tl.to(floating.slice(0, 2), { x: compact ? 0 : -24, y: -12, duration: 0.6 }, 1);

        // 03 — orbit reveals the dispatcher workflow beside the mobile app.
        showCopy(2, 2);
        tl.to(camera, { x: compact ? "0vw" : "4vw", z: 20, rotationY: -15, rotationX: 4, duration: 0.9 }, 2);
        tl.to(phone, { x: compact ? "0vw" : "13vw", y: "1vh", scale: compact ? 0.68 : 0.76, rotationY: 27, rotationZ: 5, duration: 0.9 }, 2);
        tl.to(dispatchPanel, { autoAlpha: 1, x: 0, rotateY: 0, duration: 0.55, ease: "power3.out" }, 2.2);
        tl.to(floating.slice(2), { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.3 }, 2.35);

        // 04 — return to the worker profile and order history.
        showCopy(3, 3);
        tl.to(camera, { x: compact ? "0vw" : "-3vw", z: 110, rotationY: 8, rotationX: -3, duration: 0.9 }, 3);
        tl.to(phone, { x: compact ? "0vw" : "-8vw", y: "0vh", scale: compact ? 0.84 : 1.02, rotationY: -10, rotationZ: -2, duration: 0.9 }, 3);
        tl.to(feed, { autoAlpha: 0, duration: 0.18 }, 3.12);
        tl.to(profile, { autoAlpha: 1, duration: 0.24 }, 3.22);
        tl.to(dispatchPanel, { autoAlpha: 0.45, x: 34, rotateY: -10, duration: 0.35 }, 3.15);

        // 05 — pull back to show one connected product.
        showCopy(4, 4);
        tl.to(camera, { x: "0vw", z: 0, rotationY: 0, rotationX: 0, duration: 0.9 }, 4);
        tl.to(phone, { x: "0vw", y: "0vh", scale: compact ? 0.76 : 0.86, rotationY: 0, rotationZ: 0, duration: 0.9 }, 4);
        tl.to(dispatchPanel, { autoAlpha: 0.8, x: 0, rotateY: 0, duration: 0.55 }, 4.2);
        tl.to(floating, { y: 0, duration: 0.3 }, 4.25);
        tl.to(progress, { scaleX: 1, duration: 0.25 }, 4.7);
        return () => tl.scrollTrigger && tl.scrollTrigger.kill();
      },
    );
  }, root);

  const refresh = () => ScrollTrigger.refresh();
  document.fonts?.ready?.then(refresh);
  window.addEventListener("load", refresh, { once: true });
  return () => {
    window.removeEventListener("load", refresh);
    media.revert();
    scope.revert();
  };
}
