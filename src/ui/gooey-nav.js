const SETTINGS = {
  particleCount: 15,
  spread: 56,
  animationTime: 600,
  timeVariance: 300,
  gooeyness: 0.5,
  wobble: 0.5,
};

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function ensureFilter() {
  if (document.querySelector("#gooey-nav-filter")) return;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("class", "gooey-filter-defs");
  svg.innerHTML = '<filter id="gooey-nav-filter"><feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur"/><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 19 -8" result="gooey"/><feComposite in="SourceGraphic" in2="gooey" operator="atop"/></filter>';
  document.body.append(svg);
}

function initOneNav(nav) {
  const links = [...nav.querySelectorAll(":scope > a")].filter((link) => !link.classList.contains("nav-cta") && !link.classList.contains("header-action"));
  if (!links.length) return () => {};

  nav.classList.add("gooey-nav");
  nav.dataset.theme = "dark";
  const visual = document.createElement("span");
  visual.className = "gooey-nav-visual";
  visual.setAttribute("aria-hidden", "true");
  const indicator = document.createElement("span");
  indicator.className = "gooey-nav-indicator";
  visual.append(indicator);
  nav.prepend(visual);

  const particles = [];
  let active = links.findIndex((link) => link.getAttribute("aria-current") === "location" || link.classList.contains("is-active"));
  if (active < 0) active = 0;
  let resizeFrame = 0;

  const paint = (index, burst = false) => {
    const link = links[index];
    if (!link) return;
    active = index;
    const left = link.offsetLeft;
    const top = link.offsetTop;
    indicator.style.width = link.offsetWidth + "px";
    indicator.style.height = link.offsetHeight + "px";
    indicator.style.transform = `translate3d(${left}px,${top}px,0)`;
    links.forEach((item, itemIndex) => {
      item.classList.toggle("gooey-active", itemIndex === index);
      if (itemIndex === index) item.setAttribute("aria-current", "location");
      else if (item.getAttribute("aria-current") === "location") item.removeAttribute("aria-current");
    });
    if (burst && !reducedMotion()) emitParticles(link);
  };

  const emitParticles = (link) => {
    const rect = link.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    const originX = rect.left - navRect.left + rect.width / 2;
    const originY = rect.top - navRect.top + rect.height / 2;
    const count = SETTINGS.particleCount;
    for (let i = 0; i < count; i += 1) {
      const particle = document.createElement("i");
      particle.className = "gooey-nav-particle";
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
      const distance = SETTINGS.spread * (0.45 + Math.random() * 0.55);
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance * 0.58;
      const duration = SETTINGS.animationTime + Math.random() * SETTINGS.timeVariance;
      particle.style.setProperty("--px", originX + "px");
      particle.style.setProperty("--py", originY + "px");
      particle.style.setProperty("--dx", dx + "px");
      particle.style.setProperty("--dy", dy + "px");
      particle.style.setProperty("--duration", duration + "ms");
      particle.style.setProperty("--size", (2 + Math.random() * 3) + "px");
      visual.append(particle);
      particle.addEventListener("animationend", () => particle.remove(), { once: true });
    }
  };

  links.forEach((link, index) => {
    link.addEventListener("mouseenter", () => paint(index));
    link.addEventListener("focus", () => paint(index));
    link.addEventListener("click", () => paint(index, true));
  });

  const onResize = () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => paint(active));
  };
  window.addEventListener("resize", onResize, { passive: true });
  paint(active);

  return () => {
    cancelAnimationFrame(resizeFrame);
    window.removeEventListener("resize", onResize);
    visual.remove();
    nav.classList.remove("gooey-nav");
    links.forEach((link) => link.classList.remove("gooey-active"));
  };
}

function initButtons() {
  const selectors = [
    ".button", ".nav-cta", ".hero-mosaic-action", ".header-action",
    ".hero-button", ".primary-button", ".footer-cta", ".capability-link",
    ".contrast-link", ".back-link"
  ].join(",");
  const controls = [...document.querySelectorAll(selectors)];
  controls.forEach((control) => {
    control.classList.add("gooey-button");
    if (control.tagName === "BUTTON" || control.getAttribute("role") === "button") {
      control.addEventListener("pointerdown", () => control.classList.add("is-pressed"));
      ["pointerup", "pointercancel", "pointerleave", "blur"].forEach((eventName) => {
        control.addEventListener(eventName, () => control.classList.remove("is-pressed"));
      });
    }
  });
}

export function initGooeyUI() {
  ensureFilter();
  const cleanups = [...document.querySelectorAll(".nav-links, .header-nav")].map(initOneNav).filter(Boolean);
  initButtons();
  return () => cleanups.reverse().forEach((cleanup) => cleanup());
}
