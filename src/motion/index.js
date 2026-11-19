/**
 * GRUZLI Motion Runtime
 * Loaded independently from application interactions to keep responsibilities clear.
 */
import { prefersReducedMotion } from "./core.js";
import { initHeroMotion } from "./hero.js";
import { initScrollMotion } from "./scroll.js";

const root = document.documentElement;
const syncMotionPreference = () => {
  const reduced = prefersReducedMotion.matches;
  root.classList.toggle("motion-ready", !reduced);
  root.classList.toggle("motion-reduced", reduced);
};

// GSAP matchMedia instances also react to this preference change and revert their work.
syncMotionPreference();
prefersReducedMotion.addEventListener("change", syncMotionPreference);

const cleanups = [initHeroMotion(), initScrollMotion()];
let disposed = false;

const dispose = () => {
  if (disposed) return;
  disposed = true;
  prefersReducedMotion.removeEventListener("change", syncMotionPreference);
  cleanups.reverse().forEach((cleanup) => cleanup?.());
};

window.addEventListener("pagehide", dispose, { once: true });
