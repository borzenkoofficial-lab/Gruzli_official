import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../src/card-system.css", import.meta.url), "utf8");

const rule = (selector) => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(escaped + "\\s*\\{([^}]*)\\}", "s"));
  assert.ok(match, `Missing card-system rule: ${selector}`);
  return match[1];
};

assert.match(html, /href="\\/src\\/card-system\\.css"/, "Homepage must load the canonical card system");
assert.doesNotMatch(html, /href="\\/src\\/(?:human-editorial|motion-direction)\\.css"/, "Legacy competing card layers must not be loaded");
assert.match(html, /src="\\/src\\/motion-direction\\.js"/, "The authored motion controller must remain enabled");
assert.match(css, /--card-vessel-radius:/, "Shared vessel geometry token is required");
assert.match(css, /--card-vessel-line:/, "Shared border token is required");

assert.match(rule(".hero-entry-card"), /border-radius:/, "Hero entry cards need explicit vessel geometry");
assert.match(rule(".story-triad"), /grid-template-columns:\\s*repeat\\(2,\\s*minmax\\(0,\\s*1fr\\)\\)/, "Two story roles must occupy exactly two columns");
assert.match(rule(".story-statuses"), /grid-template-columns:\\s*repeat\\(4,\\s*minmax\\(0,\\s*1fr\\)\\)/, "Four statuses must be independent items");
assert.match(rule(".contrast-panel"), /grid-template-columns:/, "Comparison layout must define its own columns");
assert.match(rule(".contrast-switch"), /grid-template-columns:\\s*repeat\\(2,\\s*minmax\\(0,\\s*1fr\\)\\)/, "Two comparison tabs must not leave an empty third column");
assert.match(rule(".workflow-track"), /grid-template-columns:\\s*repeat\\(2,\\s*minmax\\(0,\\s*1fr\\)\\)/, "Workflow must reflect its two actual roles");
assert.match(rule(".features-grid"), /grid-template-columns:/, "Feature cards need an intentional grid");
assert.match(rule(".workflow-card"), /background:/, "Workflow card surface must be explicit");
assert.match(rule(".workflow-card"), /color:\\s*#fff/i, "Workflow card text must have a defined contrast base");

for (const selector of [".story-triad>div:before", ".contrast-card:before", ".workflow-card:before", ".feature-card:before", ".download-roles>a:before"]) {
  assert.doesNotMatch(css, new RegExp(selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `Decorative stripe pseudo-element is forbidden: ${selector}`);
}

assert.match(css, /:focus-visible/, "Cards and controls need visible keyboard focus");
assert.match(css, /prefers-reduced-motion:\\s*reduce/, "Motion must respect reduced-motion preferences");
assert.match(css, /@media\\s*\\(max-width:\\s*760px\\)/, "Mobile card layout rules are required");

console.log("Homepage card-system contract: PASS");
