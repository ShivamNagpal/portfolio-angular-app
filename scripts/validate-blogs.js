#!/usr/bin/env node
/**
 * Validates content data:
 *   1. Every non-draft blog entry in src/assets/data/blogs.jsonl has a matching
 *      src/assets/blogs/<slug>.md file (and vice versa: no orphans).
 *   2. videos.jsonl and projects.jsonl are well-formed JSONL with unique ids.
 *
 * Run automatically as part of `npm run build` (see build.sh) before the
 * page fan-out, so we never emit pages from invalid data.
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const BLOGS_JSONL = path.join(ROOT, "src/assets/data/blogs.jsonl");
const VIDEOS_JSONL = path.join(ROOT, "src/assets/data/videos.jsonl");
const PROJECTS_JSONL = path.join(ROOT, "src/assets/data/projects.jsonl");
const BLOGS_DIR = path.join(ROOT, "src/assets/blogs");

function readJsonl(file) {
  let raw;
  try {
    raw = fs.readFileSync(file, "utf8");
  } catch (err) {
    throw new Error(`Cannot read ${file}: ${err.message}`);
  }
  const items = [];
  const lines = raw.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    try {
      items.push(JSON.parse(line));
    } catch (err) {
      throw new Error(`${file}:${i + 1} not valid JSON: ${err.message}`);
    }
  }
  return items;
}

function listMarkdownFiles() {
  if (!fs.existsSync(BLOGS_DIR)) return new Set();
  return new Set(
    fs
      .readdirSync(BLOGS_DIR)
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, "")),
  );
}

function validateBlogs(errors) {
  let posts;
  try {
    posts = readJsonl(BLOGS_JSONL);
  } catch (err) {
    errors.push(err.message);
    return { visible: 0, total: 0, mdCount: 0 };
  }

  const markdownSlugs = listMarkdownFiles();
  const jsonlSlugs = new Set();

  for (const post of posts) {
    if (!post || typeof post.slug !== "string") {
      errors.push(
        `blogs.jsonl: entry missing string "slug": ${JSON.stringify(post)}`,
      );
      continue;
    }
    if (jsonlSlugs.has(post.slug)) {
      errors.push(`blogs.jsonl: duplicate slug "${post.slug}"`);
    }
    jsonlSlugs.add(post.slug);

    if (post.draft === true) continue;
    if (!markdownSlugs.has(post.slug)) {
      errors.push(
        `Post "${post.slug}" in blogs.jsonl has no matching src/assets/blogs/${post.slug}.md`,
      );
    }
  }

  for (const slug of markdownSlugs) {
    if (!jsonlSlugs.has(slug)) {
      errors.push(
        `Orphan markdown file src/assets/blogs/${slug}.md has no entry in blogs.jsonl`,
      );
    }
  }

  return {
    visible: posts.filter((p) => p.draft !== true).length,
    total: posts.length,
    mdCount: markdownSlugs.size,
  };
}

function validateIdJsonl(file, label, errors) {
  let items;
  try {
    items = readJsonl(file);
  } catch (err) {
    errors.push(err.message);
    return 0;
  }
  const seen = new Set();
  for (const item of items) {
    if (!item || typeof item.id !== "string") {
      errors.push(
        `${label}: entry missing string "id": ${JSON.stringify(item)}`,
      );
      continue;
    }
    if (seen.has(item.id)) {
      errors.push(`${label}: duplicate id "${item.id}"`);
    }
    seen.add(item.id);
  }
  return items.length;
}

function main() {
  const errors = [];
  const blogStats = validateBlogs(errors);
  const videoCount = validateIdJsonl(VIDEOS_JSONL, "videos.jsonl", errors);
  const projectCount = validateIdJsonl(
    PROJECTS_JSONL,
    "projects.jsonl",
    errors,
  );

  if (errors.length > 0) {
    console.error("✘ Content validation failed:");
    for (const err of errors) console.error(`  - ${err}`);
    process.exit(1);
  }

  console.log(
    `✓ Blogs valid (${blogStats.visible} published, ${blogStats.total - blogStats.visible} draft, ${blogStats.mdCount} markdown file(s))`,
  );
  console.log(`✓ Videos valid (${videoCount} entries)`);
  console.log(`✓ Projects valid (${projectCount} entries)`);
}

main();
