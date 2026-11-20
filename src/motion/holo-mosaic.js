/**
 * GRUZLI HoloMosaic — native Canvas implementation.
 * Adapts the supplied HoloMosaic parameter set to this Vite/vanilla-JS project.
 */
export function initHoloMosaic() {
  const canvas = document.querySelector("#holo-mosaic");
  const host = canvas?.parentElement;
  if (!canvas || !host) return () => {};

  const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
  if (!ctx) return () => {};

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const config = {
    color: "#120f17",
    metalColor: "#e8ebf1",
    tileSize: 1,
    gap: 0.08,
    scatter: 0.3,
    tilt: 0.35,
    saturation: 0.1,
    intensity: 1.25,
    ripple: 0.6,
    glitter: 0.85,
    sheen: 0.8,
    grain: 0.08,
    speed: 0.5,
    intro: true,
    mouseInteraction: true,
    flipOnClick: true,
  };

  const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: false };
  const started = performance.now();
  let width = 0, height = 0, dpr = 1, columns = 0, rows = 0;
  let raf = 0, lastFrame = 0, clickPulse = 0, disposed = false;
  let tiles = [];
  const random = (seed) => {
    const n = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
    return n - Math.floor(n);
  };

  const resize = () => {
    const rect = host.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const tile = Math.max(20, Math.min(34, Math.round(width / 43)));
    const step = tile * (1 + config.gap);
    columns = Math.ceil(width / step) + 2;
    rows = Math.ceil(height / step) + 2;
    tiles = Array.from({ length: columns * rows }, (_, i) => ({
      seed: random(i + 1),
      phase: random(i + 91) * Math.PI * 2,
      depth: random(i + 171),
      flip: 0,
      flipTarget: 0,
      sparkle: random(i + 251),
    }));
    draw(performance.now(), true);
  };

  const draw = (now, force = false) => {
    if (disposed || (!force && now - lastFrame < 30)) return;
    lastFrame = now;
    const elapsed = (now - started) / 1000;
    const intro = config.intro ? Math.min(1, elapsed / 1.9) : 1;
    const easeIntro = 1 - Math.pow(1 - intro, 3);
    pointer.x += (pointer.tx - pointer.x) * 0.055;
    pointer.y += (pointer.ty - pointer.y) * 0.055;

    ctx.fillStyle = config.color;
    ctx.fillRect(0, 0, width, height);
    const tile = Math.max(20, Math.min(34, Math.round(width / 43)));
    const gap = tile * config.gap;
    const step = tile + gap;
    const offsetX = (width - (columns - 2) * step) / 2 - step;
    const offsetY = (height - (rows - 2) * step) / 2 - step;
    const mx = pointer.x * width;
    const my = pointer.y * height;
    const rippleX = pointer.active ? mx : width * 0.54;
    const rippleY = pointer.active ? my : height * 0.44;
    const pulse = clickPulse > 0 ? clickPulse : 0;

    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < columns; x += 1) {
        const index = y * columns + x;
        const item = tiles[index];
        const px = offsetX + x * step;
        const py = offsetY + y * step;
        const nx = px / width;
        const ny = py / height;
        const dx = px + tile / 2 - rippleX;
        const dy = py + tile / 2 - rippleY;
        const dist = Math.hypot(dx, dy);
        const wave = Math.sin(dist * 0.025 - elapsed * 2.4 * config.speed + item.phase);
        const radial = pointer.active ? Math.max(0, 1 - dist / Math.max(width, height) * 1.35) : 0;
        const ambient = Math.sin(nx * 5.4 + elapsed * 0.32) * Math.cos(ny * 4.8 - elapsed * 0.25);
        const center = Math.max(0, 1 - Math.hypot((nx - 0.52) * 1.05, (ny - 0.49) * 1.28));
        const shimmer = Math.pow(Math.max(0, Math.sin(elapsed * 2.3 + item.phase * 3.2 + item.seed * 8)), 18);
        const glitter = shimmer * config.glitter * (item.sparkle > 0.76 ? 1 : 0.12);
        const scatterX = (item.seed - 0.5) * tile * config.scatter * (1 - easeIntro);
        const scatterY = (item.depth - 0.5) * tile * config.scatter * (1 - easeIntro);
        const waveLift = (wave * 0.5 + radial * config.ripple + center * 0.35) * config.intensity;
        const brightness = Math.max(0, Math.min(1, 0.12 + center * 0.54 + waveLift * 0.2 + glitter * 0.6 + ambient * 0.08));
        const hue = (item.seed * 360 + elapsed * 8 + radial * 35) % 360;
        const metal = 185 + brightness * 55;
        const alpha = Math.max(0.12, Math.min(0.96, 0.24 + brightness * 0.7));
        const flip = item.flip + (item.flipTarget - item.flip) * 0.16;
        item.flip = flip;
        const squeeze = Math.max(0.08, Math.abs(Math.cos(flip)));
        const drawX = px + scatterX;
        const drawY = py + scatterY + (wave * 2.2 + radial * 5) * easeIntro;
        const inset = gap * 0.5;
        const size = tile - gap;
        const w = size * squeeze;

        ctx.save();
        ctx.translate(drawX + tile / 2, drawY + tile / 2);
        ctx.rotate((ambient * config.tilt + (pointer.x - 0.5) * config.tilt * radial) * 0.12);
        ctx.translate(-tile / 2, -tile / 2);
        const gradient = ctx.createLinearGradient(0, 0, size, size);
        gradient.addColorStop(0, `hsla(${hue}, ${Math.round(config.saturation * 100)}%, ${Math.round(metal + 8)}%, ${alpha})`);
        gradient.addColorStop(0.42, `rgba(205, 211, 224, ${0.08 + brightness * 0.42})`);
        gradient.addColorStop(1, `hsla(${(hue + 26) % 360}, ${Math.round(config.saturation * 100)}%, ${Math.round(18 + brightness * 40)}%, ${alpha})`);
        ctx.fillStyle = gradient;
        ctx.fillRect((size - w) / 2, inset, w, size);
        ctx.strokeStyle = `rgba(255,255,255,${0.035 + brightness * 0.16})`;
        ctx.lineWidth = 0.65;
        ctx.strokeRect((size - w) / 2 + 0.35, inset + 0.35, Math.max(0, w - 0.7), size - 0.7);

        if (config.sheen > 0 && brightness > 0.2) {
          const sheen = ctx.createLinearGradient(0, 0, size, size);
          sheen.addColorStop(0, "rgba(255,255,255,0)");
          sheen.addColorStop(0.44, `rgba(255,255,255,${config.sheen * brightness * 0.18})`);
          sheen.addColorStop(0.55, "rgba(255,255,255,0)");
          sheen.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = sheen;
          ctx.fillRect((size - w) / 2, inset, w, size);
        }
        if (glitter > 0.35) {
          ctx.fillStyle = `rgba(255,255,255,${glitter * 0.9})`;
          ctx.fillRect(size * 0.5, size * 0.5, 1.2 + glitter * 1.4, 1.2 + glitter * 1.4);
        }
        ctx.restore();
      }
    }

    // Fine film grain is deliberately subtle and sampled sparsely for performance.
    if (config.grain > 0) {
      ctx.globalAlpha = config.grain * 0.16;
      ctx.fillStyle = "#fff";
      for (let i = 0; i < 120; i += 1) {
        const x = random(Math.floor(now / 45) + i * 17) * width;
        const y = random(Math.floor(now / 45) + i * 31) * height;
        ctx.fillRect(x, y, 1, 1);
      }
      ctx.globalAlpha = 1;
    }
    if (clickPulse > 0) clickPulse = Math.max(0, clickPulse - 0.025);
  };

  const loop = (now) => {
    draw(now);
    if (!disposed) raf = requestAnimationFrame(loop);
  };
  const onPointerMove = (event) => {
    if (!config.mouseInteraction) return;
    const rect = canvas.getBoundingClientRect();
    pointer.tx = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    pointer.ty = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
    pointer.active = true;
  };
  const onPointerLeave = () => { pointer.active = false; pointer.tx = 0.5; pointer.ty = 0.5; };
  const onClick = (event) => {
    if (!config.flipOnClick) return;
    const rect = canvas.getBoundingClientRect();
    const cx = (event.clientX - rect.left) / rect.width;
    const cy = (event.clientY - rect.top) / rect.height;
    const col = Math.round(cx * (columns - 1));
    const row = Math.round(cy * (rows - 1));
    for (let y = Math.max(0, row - 2); y <= Math.min(rows - 1, row + 2); y += 1) {
      for (let x = Math.max(0, col - 2); x <= Math.min(columns - 1, col + 2); x += 1) {
        const item = tiles[y * columns + x];
        if (item) item.flipTarget += Math.PI;
      }
    }
    clickPulse = 1;
  };
  const onMotionChange = () => { if (reduceMotion.matches) draw(performance.now(), true); };

  const observer = new ResizeObserver(resize);
  observer.observe(host);
  canvas.addEventListener("pointermove", onPointerMove, { passive: true });
  canvas.addEventListener("pointerleave", onPointerLeave, { passive: true });
  canvas.addEventListener("click", onClick);
  reduceMotion.addEventListener("change", onMotionChange);
  resize();
  if (!reduceMotion.matches) raf = requestAnimationFrame(loop);

  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    observer.disconnect();
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerleave", onPointerLeave);
    canvas.removeEventListener("click", onClick);
    reduceMotion.removeEventListener("change", onMotionChange);
  };
}
