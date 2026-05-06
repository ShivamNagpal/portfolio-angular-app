#!/usr/bin/env node
/**
 * Reads JSONL source files (blogs, videos, projects), filters/sorts each, and
 * emits paginated JSON pages + a manifest under src/assets/data/<type>/.
 *
 * Output:
 *   src/assets/data/<type>/page-N.json   -- T[]
 *   src/assets/data/<type>/index.json    -- { pageSize, totalItems, totalPages, keys }
 *
 * Run automatically as part of `npm run build` (see build.sh).
 * Run on demand with `npm run build-data`.
 */

const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline");

const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "src/assets/data");

const TYPES = [
  {
    name: "blogs",
    key: "slug",
    pageSize: 10,
    filter: (p) => p.draft !== true,
    sort: (a, b) =>
      (b.publishedDate ?? "").localeCompare(a.publishedDate ?? ""),
  },
  {
    name: "videos",
    key: "id",
    pageSize: 12,
    filter: () => true,
    sort: () => 0, // stable, JSONL order preserved
  },
  {
    name: "projects",
    key: "id",
    pageSize: 12,
    filter: () => true,
    sort: (a, b) => Number(b.featured ?? false) - Number(a.featured ?? false),
  },
];

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

function chunk(arr, size) {
  const pages = [];
  for (let i = 0; i < arr.length; i += size) {
    pages.push(arr.slice(i, i + size));
  }
  return pages.length > 0 ? pages : [[]];
}

function rmIfExists(p) {
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true, force: true });
  }
}

async function buildType(type) {
  const src = path.join(DATA_DIR, `${type.name}.jsonl`);
  const outDir = path.join(DATA_DIR, type.name);

  const all = await readJsonl(src);
  const filtered = all.filter(type.filter);
  const sorted = [...filtered].sort(type.sort);
  const pages = chunk(sorted, type.pageSize);

  rmIfExists(outDir);
  fs.mkdirSync(outDir, { recursive: true });

  pages.forEach((page, i) => {
    const file = path.join(outDir, `page-${i + 1}.json`);
    fs.writeFileSync(file, JSON.stringify(page, null, 2) + "\n", "utf8");
  });

  const manifest = {
    pageSize: type.pageSize,
    totalItems: sorted.length,
    totalPages: pages.length,
    keys: sorted.map((item) => item[type.key]),
  };
  fs.writeFileSync(
    path.join(outDir, "index.json"),
    JSON.stringify(manifest, null, 2) + "\n",
    "utf8",
  );

  return { name: type.name, items: sorted.length, pages: pages.length };
}

async function main() {
  const results = [];
  for (const type of TYPES) {
    try {
      results.push(await buildType(type));
    } catch (err) {
      console.error(`✘ ${type.name}: ${err.message}`);
      process.exit(1);
    }
  }
  for (const r of results) {
    console.log(`✓ ${r.name}: ${r.items} item(s) across ${r.pages} page(s)`);
  }
}

main();
