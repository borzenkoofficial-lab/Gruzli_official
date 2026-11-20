import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const html=readFileSync("index.html","utf8");
const css=readFileSync("src/ui/cinematic-chapters.css","utf8");
const js=readFileSync("src/ui/chapter-atmosphere.js","utf8");
for(const id of ["about","contrast","roles","workflow","signature","screens","download","faq"]) {
  assert.match(html,new RegExp('<section class="[^"]*cinematic-chapter[^"]*" id="'+id+'"'));
}
assert.match(html,/<section class="[^"]*features-section[^"]*cinematic-chapter/);
assert.match(css,/radial-gradient/);
assert.match(css,/chapter-spark-rise/);
assert.match(css,/prefers-reduced-motion/);
assert.match(js,/IntersectionObserver/);
assert.match(js,/prefers-reduced-motion/);
assert.match(js,/chapter-sparkfield/);
console.log("Cinematic chapter contract: 15 checks passed");
