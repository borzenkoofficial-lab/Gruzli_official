/* GRUZLI / restrained hero scroll motion */
(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  const hero = document.querySelector(".hero");
  const heroInner = document.querySelector(".hero-inner");
  const heroVisual = document.querySelector(".hero-visual");
  if (!hero) return;

  let frame = 0;
  const update = () => {
    frame = 0;
    const height = Math.max(1, hero.offsetHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / height));

    if (heroInner) {
      heroInner.style.opacity = String(Math.max(.22, 1 - progress * .92));
      heroInner.style.transform = `translate3d(0,${progress * -24}px,0)`;
    }
    if (heroVisual) {
      heroVisual.style.opacity = String(Math.max(.25, 1 - progress * .72));
      heroVisual.style.transform = `translate3d(0,${progress * 30}px,0) scale(${1 - progress * .035})`;
    }
  };

  const onScroll = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
})();
