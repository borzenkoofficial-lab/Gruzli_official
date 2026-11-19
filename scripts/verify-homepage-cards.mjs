import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../src/card-system.css", import.meta.url), "utf8");

const rule = (selector) => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(escaped + "\\s*\\{([^}]*)\\}", "s"));
  assert.ok(match, `Missing card-system rule: ${selector}`);
  return match[1].replace(/\\s+/g, "");
};

assert.ok(html.includes('href="/src/card-system.css"'), "Homepage must load the canonical card system");
assert.ok(!html.includes('href="/src/human-editorial.css"'), "Legacy editorial card layer must not be loaded");
assert.ok(!html.includes('href="/src/motion-direction.css"'), "Legacy motion/card layer must not be loaded");
assert.ok(html.includes('src="/src/motion-direction.js"'), "The authored motion controller must remain enabled");
assert.ok(css.includes("--card-vessel-radius:"), "Shared vessel geometry token is required");
assert.ok(css.includes("--card-vessel-line:"), "Shared border token is required");

assert.ok(rule(".hero-entry-card").includes("border-radius:"), "Hero entry cards need explicit vessel geometry");
assert.ok(rule(".story-triad").includes("grid-template-columns:repeat(2,minmax(0,1fr))"), "Two story roles must occupy exactly two columns");
assert.ok(rule(".story-statuses").includes("grid-template-columns:repeat(4,minmax(0,1fr))"), "Four statuses must be independent items");
assert.ok(rule(".contrast-panel").includes("grid-template-columns:"), "Comparison layout must define its own columns");
assert.ok(rule(".contrast-switch").includes("grid-template-columns:repeat(2,minmax(0,1fr))"), "Two comparison tabs must not leave an empty third column");
assert.ok(rule(".workflow-track").includes("grid-template-columns:repeat(2,minmax(0,1fr))"), "Workflow must reflect its two actual roles");
assert.ok(rule(".features-grid").includes("grid-template-columns:"), "Feature cards need an intentional grid");
assert.ok(rule(".workflow-card").includes("background:"), "Workflow card surface must be explicit");
assert.ok(rule(".workflow-card").includes("color:#fff"), "Workflow card text must have a defined contrast base");

for (const selector of [".story-triad>div:before", ".contrast-card:before", ".workflow-card:before", ".feature-card:before", ".download-roles>a:before"]) {
  assert.ok(!css.includes(selector), `Decorative stripe pseudo-element is forbidden: ${selector}`);
}

assert.ok(css.includes(":focus-visible"), "Cards and controls need visible keyboard focus");
assert.ok(css.includes("prefers-reduced-motion:reduce"), "Motion must respect reduced-motion preferences");
assert.ok(css.includes("@media(max-width:760px)"), "Mobile card layout rules are required");

console.log("Homepage card-system contract: PASS");
