/**
 * GRUZLI Motion Runtime
 * Loaded independently from application interactions to keep responsibilities clear.
 */
import { prefersReducedMotion } from "./core.js";
import { initHeroMotion } from "./hero.js";
import { initScrollMotion } from "./scroll.js";

if (prefersReducedMotion.matches) {
  document.documentElement.classList.add("motion-reduced");
} else {
  document.documentElement.classList.add("motion-ready");

  const cleanups = [initHeroMotion(), initScrollMotion()];
  let disposed = false;

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    cleanups.reverse().forEach((cleanup) => cleanup?.());
  };

  window.addEventListener("pagehide", dispose, { once: true });
}
