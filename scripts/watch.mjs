import { watch } from "node:fs";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const srcDir = resolve(root, "src");
const distDir = resolve(root, "dist");
const outFile = resolve(distDir, "eight-sleep-card.js");

const sources = [
  "config.js",
  "utils.js",
  "styles.js",
  "templates.js",
  "card.js",
  "editor.js",
  "registry.js",
];

function build() {
  const output = sources
    .map((file) => readFileSync(resolve(srcDir, file), "utf8").trimEnd())
    .join("\n\n");

  mkdirSync(distDir, { recursive: true });
  writeFileSync(outFile, `${output}\n`, "utf8");
  console.log(`[watch] rebuilt ${outFile} @ ${new Date().toLocaleTimeString()}`);
}

let timer = null;
function scheduleBuild() {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    timer = null;
    try {
      build();
    } catch (err) {
      console.error("[watch] build failed:", err?.message || err);
    }
  }, 75);
}

build();
console.log(`[watch] watching ${srcDir}`);

watch(srcDir, { recursive: true }, (eventType, filename) => {
  if (!filename || !filename.endsWith(".js")) return;
  console.log(`[watch] ${eventType}: ${filename}`);
  scheduleBuild();
});

