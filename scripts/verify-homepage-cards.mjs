import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../src/card-system.css", import.meta.url), "utf8");
const mobileCss = readFileSync(new URL("../src/mobile-polish.css", import.meta.url), "utf8");

const rule = (selector) => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(escaped + "\\s*\\{([^}]*)\\}", "s"));
  assert.ok(match, `Missing card-system rule: ${selector}`);
  return match[1];
};

assert.ok(html.includes('href="/src/card-system.css"'), "Homepage must load the canonical card system");
assert.ok(!html.includes('href="/src/human-editorial.css"'), "Legacy editorial card layer must not be loaded");
assert.ok(!html.includes('href="/src/motion-direction.css"'), "Legacy motion/card layer must not be loaded");
assert.ok(!html.includes('href="/src/site-polish.css"'), "Legacy finishing layer must not be loaded");
assert.ok(html.includes('src="/src/motion-direction.js"'), "The authored motion controller must remain enabled");
for (const legacySelector of [".hero-entry-card", ".story-triad", ".story-statuses", ".contrast-card", ".workflow-card", ".feature-card", ".role-tab", ".role-panel", ".screen-card", ".faq-item"]) {
  assert.ok(!mobileCss.includes(legacySelector), `Mobile layout file must not redefine card component: ${legacySelector}`);
}
assert.equal((html.match(/class="feature-card vessel-card vessel-card--feature reveal"/g)||[]).length, 6, "All six feature cards must use the vessel component");
assert.equal((html.match(/class="workflow-card vessel-card vessel-card--process reveal"/g)||[]).length, 2, "Both role process cards must use the vessel component");
assert.equal((html.match(/class="vessel-card vessel-card--status"/g)||[]).length, 4, "All four order statuses must use the vessel component");
assert.equal((html.match(/class="vessel-card vessel-card--role"/g)||[]).length, 2, "Both story roles must use the vessel component");
assert.equal((html.match(/class="contrast-card vessel-card vessel-card--contrast/g)||[]).length, 2, "Both comparison cards must use the vessel component");

assert.ok(css.includes("--card-vessel-radius:"), "Shared vessel geometry token is required");
assert.ok(css.includes("--card-vessel-line:"), "Shared border token is required");
assert.ok(rule(".vessel-card--hero").includes("border-radius:"), "Hero entry cards need explicit vessel geometry");
assert.ok(rule(".story-triad").includes("grid-template-columns:repeat(2,minmax(0,1fr))"), "Two story roles must occupy exactly two columns");
assert.ok(rule(".story-statuses").includes("grid-template-columns:repeat(4,minmax(0,1fr))"), "Four statuses must be independent items");
assert.ok(rule(".contrast-panel").includes("grid-template-columns:"), "Comparison layout must define its own columns");
assert.ok(rule(".contrast-switch").includes("grid-template-columns:repeat(2,minmax(0,1fr))"), "Two comparison tabs must not leave an empty third column");
assert.ok(rule(".workflow-track").includes("grid-template-columns:repeat(2,minmax(0,1fr))"), "Workflow must reflect its two actual roles");
assert.ok(rule(".features-grid").includes("grid-template-columns:repeat(12,minmax(0,1fr))"), "Feature cards must use the asymmetrical 12-column grid");
assert.ok(rule(".workflow-card").includes("background:#25282b"), "Workflow card surface must remain dark");
assert.ok(rule(".workflow-card").includes("color:#fff"), "Workflow card text must have a defined contrast base");
assert.ok(css.includes(".workflow-card:before,.workflow-card:after") && css.includes("content:none!important;display:none!important}"), "Old card glow pseudo-elements must be disabled");
assert.ok(css.includes(".feature-card:before,.feature-card:after"), "Old feature ring pseudo-elements must be disabled");

assert.ok(css.includes(":focus-visible"), "Cards and controls need visible keyboard focus");
assert.ok(css.includes("prefers-reduced-motion:reduce"), "Motion must respect reduced-motion preferences");
assert.ok(css.includes("@media(max-width:760px)"), "Mobile card layout rules are required");
console.log("Homepage card-system contract: PASS");
