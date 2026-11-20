/**
 * GRUZLI Motion Runtime
 * Each motion module is isolated: a failure in one effect must never block page scrolling or other modules.
 */
import { prefersReducedMotion } from "./core.js";
import { initHeroMotion } from "./hero.js";
import { initScrollMotion } from "./scroll.js";
import { initCardInteractions } from "./interactions.js";
import { initProductJourney } from "./product-journey.js";

const root = document.documentElement;
const syncMotionPreference = () => {
  const reduced = prefersReducedMotion.matches;
  root.classList.toggle("motion-ready", !reduced);
  root.classList.toggle("motion-reduced", reduced);
};

syncMotionPreference();
prefersReducedMotion.addEventListener("change", syncMotionPreference);

const cleanups = [];
const safelyInit = (name, init) => {
  try {
    const cleanup = init();
    if (typeof cleanup === "function") cleanups.push(cleanup);
  } catch (error) {
    // Preserve native scrolling and the rest of the page if a visual module fails.
    console.error(`[GRUZLI motion] ${name} failed; continuing without this effect.`, error);
    if (name === "product journey") {
      const journey = document.querySelector("#product-journey");
      journey?.classList.add("journey-fallback");
      journey?.querySelectorAll(".journey-copy").forEach((item, index) => {
        item.style.opacity = index === 0 ? "1" : "0";
        item.style.visibility = index === 0 ? "visible" : "hidden";
      });
      const feed = journey?.querySelector('[data-journey-screen="feed"]');
      if (feed) { feed.style.opacity = "1"; feed.style.visibility = "visible"; }
    }
  }
};

// Start the main presentation first; unrelated reveal effects cannot prevent it from mounting.
safelyInit("product journey", initProductJourney);
safelyInit("hero", initHeroMotion);
safelyInit("scroll reveals", initScrollMotion);
safelyInit("card interactions", initCardInteractions);

let disposed = false;
const dispose = () => {
  if (disposed) return;
  disposed = true;
  prefersReducedMotion.removeEventListener("change", syncMotionPreference);
  cleanups.reverse().forEach((cleanup) => {
    try { cleanup(); } catch (error) { console.error("[GRUZLI motion] cleanup failed.", error); }
  });
};

window.addEventListener("pagehide", dispose, { once: true });
