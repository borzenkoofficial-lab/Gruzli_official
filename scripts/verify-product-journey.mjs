import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const motion = readFileSync("src/motion/product-journey.js", "utf8");
const css = readFileSync("src/motion/product-journey.css", "utf8");
const runtime = readFileSync("src/motion/index.js", "utf8");

assert.match(html, /id="product-journey"/, "The continuous product journey section must exist");
assert.equal((html.match(/data-journey-copy="/g) || []).length, 7, "The journey must contain seven narrative beats");
assert.match(html, /gruzli-new-feed\.webp/, "Use the real GRUZLI feed screen");
assert.match(html, /gruzli-new-profile\.webp/, "Use the real GRUZLI profile screen");
assert.match(html, /data-journey-screen="client"/, "Include the client requests screen");
assert.match(html, /data-journey-screen="order"/, "Include the detailed order screen");
assert.match(motion, /ScrollTrigger/, "The journey must be scroll-driven");
assert.match(motion, /scrub:/, "Scroll position must control the camera timeline");
assert.match(motion, /prefers-reduced-motion/, "Reduced-motion preference must be handled");
assert.match(motion, /journey-spark/, "Scroll-linked particles must be initialized");
assert.match(motion, /initProductJourney/, "The journey initializer must be exported");
assert.match(runtime, /initProductJourney\(\)/, "The motion runtime must initialize the journey");
assert.match(css, /\.journey-stage\s*\{[^}]*position:sticky/s, "The 3D stage must remain continuous while scrolling");
assert.match(css, /@media\(prefers-reduced-motion:reduce\)/, "The layout must have a reduced-motion fallback");
console.log("Product journey contract: 11 checks passed");
