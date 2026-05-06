#!/usr/bin/env node
/**
 * Generates routes.txt for Angular's prerender step by combining the static
 * routes in routes.base.txt with dynamic blog detail routes derived from
 * src/assets/data/blogs.jsonl (drafts excluded).
 *
 * Output:
 *   routes.txt   -- consumed by `prerender.routesFile` in angular.json
 *
 * Run automatically as part of `npm run build` (see build.sh).
 * Run on demand with `npm run build-routes`.
 */

const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline");

const ROOT = path.resolve(__dirname, "..");
const BASE_FILE = path.join(ROOT, "routes.base.txt");
const BLOGS_JSONL = path.join(ROOT, "src/assets/data/blogs.jsonl");
const OUT_FILE = path.join(ROOT, "routes.txt");

async function readJsonl(file) {
  const items = [];
  if (!fs.existsSync(file)) {
    throw new Error(`Source file not found: ${file}`);
  }
  const stream = fs.createReadStream(file, { encoding: "utf8" });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
  let lineNum = 0;
  for await (const raw of rl) {
    lineNum++;
    const line = raw.trim();
    if (!line) continue;
    try {
      items.push(JSON.parse(line));
    } catch (err) {
      throw new Error(`${file}:${lineNum} not valid JSON: ${err.message}`);
    }
  }
  return items;
}

function readBaseRoutes() {
  if (!fs.existsSync(BASE_FILE)) {
    throw new Error(`Base routes file not found: ${BASE_FILE}`);
  }
  return fs
    .readFileSync(BASE_FILE, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

async function main() {
  const base = readBaseRoutes();
  const blogs = await readJsonl(BLOGS_JSONL);
  const blogRoutes = blogs
    .filter((b) => b.draft !== true)
    .map((b) => `/blogs/${b.slug}`);

  const all = [...base, ...blogRoutes];
  fs.writeFileSync(OUT_FILE, all.join("\n") + "\n", "utf8");

  console.log(
    `✓ routes.txt: ${all.length} route(s) (${base.length} static + ${blogRoutes.length} blog)`,
  );
}

main().catch((err) => {
  console.error(`✘ ${err.message}`);
  process.exit(1);
});
