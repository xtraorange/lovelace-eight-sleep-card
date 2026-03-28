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

const output = sources
  .map((file) => readFileSync(resolve(srcDir, file), "utf8").trimEnd())
  .join("\n\n");

mkdirSync(distDir, { recursive: true });
writeFileSync(outFile, `${output}\n`, "utf8");

console.log(`Built ${outFile}`);
