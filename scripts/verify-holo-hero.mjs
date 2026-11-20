import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const mosaic = readFileSync("src/motion/holo-mosaic.js", "utf8");
const heroMotion = readFileSync("src/motion/hero.js", "utf8");
const runtime = readFileSync("src/motion/index.js", "utf8");
const css = readFileSync("src/styles.css", "utf8");

const heroStart = html.indexOf('<section class="hero hero--mosaic"');
const journeyStart = html.indexOf('<section class="product-journey"', heroStart);
assert.ok(heroStart >= 0 && journeyStart > heroStart, "The clean HoloMosaic hero must precede the product journey");
const hero = html.slice(heroStart, journeyStart);
assert.match(hero, /id="holo-mosaic"/, "The hero must contain the HoloMosaic canvas");
assert.match(hero, /Работа\.<br><em>Собранная вместе\.<\/em>/, "The new hero headline must be present");
assert.match(hero, /href="#roles"/, "Dispatcher entry point must remain available");
assert.match(hero, /href="\/app\/"/, "Worker app entry point must remain available");
assert.doesNotMatch(hero, /hero-phone|hero-release|hero-visual|hero-grid/, "Legacy phone mockups and launch date must be removed");
for (const setting of ["#120f17", "#e8ebf1", "scatter", "tilt", "ripple", "glitter", "sheen", "grain", "flipOnClick"]) {
  assert.ok(mosaic.includes(setting), `HoloMosaic configuration must include ${setting}`);
}
assert.match(mosaic, /pointermove/, "Mosaic must respond to pointer movement");
assert.match(mosaic, /pointerdown|click/, "Mosaic must support click interaction");
assert.match(mosaic, /prefers-reduced-motion/, "Mosaic must respect reduced motion");
assert.match(heroMotion, /hero--mosaic/, "Hero motion must target the new hero");
assert.match(runtime, /safelyInit\("HoloMosaic", initHoloMosaic\)/, "HoloMosaic must be initialized independently");
assert.match(css, /\.hero\.hero--mosaic/, "New hero layout styles must exist");
assert.match(css, /\.holo-mosaic-canvas/, "Mosaic canvas must fill the hero");
console.log("HoloMosaic hero contract: 15 checks passed");
