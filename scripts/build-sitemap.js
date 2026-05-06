#!/usr/bin/env node
/**
 * Generates src/sitemap.xml by injecting blog detail <url> entries into
 * sitemap.base.xml (static URLs, hand-maintained). Blog entries are derived
 * from src/assets/data/blogs.jsonl with drafts excluded; lastmod uses each
 * post's publishedDate.
 *
 * Output:
 *   src/sitemap.xml   -- bundled into the build via angular.json assets
 *
 * Run automatically as part of `npm run build` (see build.sh).
 * Run on demand with `npm run build-sitemap`.
 */

const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline");

const ROOT = path.resolve(__dirname, "..");
const BASE_FILE = path.join(ROOT, "sitemap.base.xml");
const BLOGS_JSONL = path.join(ROOT, "src/assets/data/blogs.jsonl");
const OUT_FILE = path.join(ROOT, "src/sitemap.xml");
const SITE_ORIGIN = "https://shivamnagpal.dev";
const BLOG_PRIORITY = "0.70";

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

function toLastmod(publishedDate) {
  // Accept "YYYY-MM-DD" and emit ISO-ish "YYYY-MM-DDT00:00:00+00:00" to match
  // the existing static entries' format.
  if (!publishedDate)
    return new Date().toISOString().replace(/\.\d+Z$/, "+00:00");
  return `${publishedDate}T00:00:00+00:00`;
}

function blogUrlBlock(blog) {
  return [
    "  <url>",
    `    <loc>${SITE_ORIGIN}/blogs/${blog.slug}/</loc>`,
    `    <lastmod>${toLastmod(blog.publishedDate)}</lastmod>`,
    `    <priority>${BLOG_PRIORITY}</priority>`,
    "  </url>",
  ].join("\n");
}

async function main() {
  if (!fs.existsSync(BASE_FILE)) {
    throw new Error(`Base sitemap not found: ${BASE_FILE}`);
  }
  const base = fs.readFileSync(BASE_FILE, "utf8");
  const closeTag = "</urlset>";
  const closeIdx = base.lastIndexOf(closeTag);
  if (closeIdx === -1) {
    throw new Error(`${BASE_FILE} is missing </urlset>`);
  }

  const blogs = await readJsonl(BLOGS_JSONL);
  const published = blogs.filter((b) => b.draft !== true);
  const blocks = published.map(blogUrlBlock).join("\n");

  const head = base.slice(0, closeIdx).replace(/\s*$/, "");
  const tail = base.slice(closeIdx);
  const out = blocks ? `${head}\n${blocks}\n${tail}` : `${head}\n${tail}`;

  fs.writeFileSync(OUT_FILE, out, "utf8");
  console.log(`✓ src/sitemap.xml: base + ${published.length} blog entry(ies)`);
}

main().catch((err) => {
  console.error(`✘ ${err.message}`);
  process.exit(1);
});
