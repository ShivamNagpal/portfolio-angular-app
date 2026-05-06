# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Angular 18 portfolio website for ShivamNagpal.dev with Tailwind CSS and Angular Material. Hosted on Cloudflare. Uses **Static Site Generation (SSG)**: every route in `routes.txt` (generated at build time from `routes.base.txt` + content) is pre-rendered into a real `index.html` (output under `dist/portfolio-angular-app/browser/<route>/index.html`) for SEO, then hydrated client-side. The codebase also includes Express SSR support (`server.ts`), but production deploys serve the static pre-rendered output, not the SSR server.

## Commands

- `npm start` — Dev server at localhost:4200
- `npm run build` — Full build (registers git hooks, runs prettier check, then `ng build`)
- `npm test` — Run tests headless (Karma + Jasmine, ChromeHeadless, no watch)
- `npm run test-browser` — Run tests in interactive Chrome
- `npx ng test --include='**/home/*.spec.ts'` — Run a single component's tests
- `npm run prettier` — Auto-format all files
- `npm run serve:ssr:portfolio-angular-app` — Serve the SSR build from `dist/`

## Architecture

**Module structure:** Root `AppModule` declares only `AppComponent`. All page components (Home, NavBar, Contact, Videos, Blogs) are **standalone components** imported directly.

**Routing:** Defined in `app-routing.module.ts` — `/` (Home), `/about`, `/code`, `/blogs`, `/blogs/:slug`, `/videos`, `/contact`. **All routes are lazy-loaded** via `loadComponent` so each page is its own JS chunk. Static routes carry `data: { title, description }` for SEO.

**SSG / Pre-rendering:** `angular.json` configures `prerender: { routesFile: "routes.txt" }`. Both `routes.txt` and `src/sitemap.xml` are **generated at build time** from committed base files plus `blogs.jsonl`:

- `scripts/build-routes.js` → `routes.txt` from `routes.base.txt` + non-draft blog slugs
- `scripts/build-sitemap.js` → `src/sitemap.xml` from `sitemap.base.xml` + non-draft blog entries (lastmod = `publishedDate`)

Both outputs are gitignored. At build time, every listed route in `routes.txt` is rendered to a static HTML file (visible in `dist/portfolio-angular-app/browser/<route>/index.html`); build log says `Prerendered N static routes`. **When adding a new static route, add it to `app-routing.module.ts`, `routes.base.txt`, and `sitemap.base.xml`** — otherwise the route works at runtime but isn't pre-rendered or indexed, hurting SEO. Blog detail entries pick up automatically from `blogs.jsonl`.

**SSR (unused in prod):** `server.ts` runs an Express server using Angular's `CommonEngine`. The SSR module is `app.module.server.ts`. Production hosting on Cloudflare uses the pre-rendered static output, not this server.

**Styling:** Global theme in `src/styles.scss` combines Angular Material (Azure/Blue palette) with Tailwind CSS. Components use Tailwind utility classes extensively. Custom `primary` color defined via CSS variable in `tailwind.config.js`.

**Responsive design:** All pages must work on both desktop and mobile. Use Tailwind responsive breakpoints (`sm:`, `md:`, `lg:`, `xl:`) — never build desktop-only layouts.

## Commit Message Format

Enforced by git hook (`.githooks/commit-msg`):

```
<type>: #<issue-id> | <description>
```

Types: `feature`, `fix`, `build`, `refactor`, `performance`, `docs`, `test`, `style`, `setup`

Example: `feature: #14 | Initial project setup`

## CI

GitHub Actions (`.github/workflows/build_pr.yml`) runs on PRs to `staging`/`production`: `npm ci` → `npm test` → `npm run build`. Node 20.

## Key Details

- Components use `takeUntilDestroyed()` pattern for RxJS subscription cleanup
- `NgOptimizedImage` used for performance-critical images
- Pre-rendering routes must be kept in sync across `routes.base.txt` (static), `app-routing.module.ts`, and `sitemap.base.xml`. Blog detail entries in both the generated `routes.txt` and `src/sitemap.xml` come from `blogs.jsonl` automatically.
- **Content data** is split into two shapes:
  - **Paginated types** (`blogs`, `videos`, `projects`): source of truth is `src/assets/data/<type>.jsonl` (one JSON object per line, committed). `scripts/build-data-pages.js` runs at build time, sorts/filters each type, and emits per-page JSON files plus a manifest under `src/assets/data/<type>/page-N.json` and `src/assets/data/<type>/index.json`. Generated files are gitignored. Editing content = editing the JSONL.
  - **Flat types** (`companies`, `talks`, `skills`, `social-links`): committed JSON arrays at `src/assets/data/<type>.json`. Loaded as a single fetch.
- **DataService** (`src/app/shared/services/data.service.ts`) exposes per-type observables:
  - Paginated: `<type>Manifest$`, `get<Type>Page(n)`, `findBlogBySlug(slug)` (uses manifest's `keys[]` to resolve which page contains a slug)
  - Flat: `companies$`, `talks$`, `skills$`, `socialLinks$`
  - All cached via `shareReplay({ bufferSize: 1, refCount: false })`; per-page fetches memoised in a `Map`
- **HTTP transfer cache** (auto-enabled via `provideClientHydration()`) embeds the SSG-time fetch responses into pre-rendered HTML, so client hydration is instant — no double fetch, no flash. With pagination, only the rendered page (not the full data set) is embedded.
- **Tag filtering** is shared across Code/Videos/Blogs via `src/app/shared/components/tag-filter/` (multi-select dropdown) and `src/app/shared/utils/tag-filter.ts` (`filterAndSortByTags`, `uniqueTags`). Filter applies to the **currently-loaded page only** — not the full set across pages. Acknowledged trade-off of static pagination.
- **Pagination URL**: paginated listing routes accept `?page=N` query param (omit for page 1). No new route entries needed; pages 2+ rely on SPA fallback (not pre-rendered).
- **Test fixtures** + a `STUB_DATA_SERVICE` (covers manifest, page getters, and `findBlogBySlug`) are in `src/app/data/test-fixtures.ts`.
- **Blog posts**: Markdown body in `src/assets/blogs/<slug>.md`, metadata in `src/assets/data/blogs.jsonl` (rendered via `ngx-markdown`). Publishing a new post:
  1. Append a JSON line to `src/assets/data/blogs.jsonl`
  2. Write `src/assets/blogs/<slug>.md`
  3. `npm run build` (or `npm run build-data && npm run build-routes && npm run build-sitemap`) regenerates pages, manifest, `routes.txt`, and `src/sitemap.xml` — the new `/blogs/<slug>` is picked up everywhere automatically
- **Validation**: `scripts/validate-blogs.js` runs before the page fan-out and `ng build`. It enforces: every non-draft blog slug has a matching `.md`; no orphan `.md` files; no duplicate slugs/ids in any JSONL. Posts with `"draft": true` are excluded from listings and from the generated `routes.txt`, and don't need a `.md` file.

## SEO

- **Per-route metadata**: each static route in `app-routing.module.ts` carries `data: { title, description }`. `AppComponent` listens for `NavigationEnd` and feeds `SeoService` (`src/app/shared/services/seo.service.ts`).
- **Dynamic routes** (e.g. `/blogs/:slug`) set their metadata in their own component on `ngOnInit` using `SeoService.setMeta(...)`.
- **JSON-LD structured data**: a single `<script id="json-ld" type="application/ld+json">` element in `src/index.html` is populated via `SeoService.setStructuredData(...)`. Currently set on `/` (Person) and `/blogs/:slug` (BlogPosting). Other routes call `setStructuredData(null)` to clear it.
- **Default OG image**: `src/assets/og-image.png` (1200×630 PNG, branded). Wired into `index.html` and the SeoService default. **The PNG must exist** for shared-link previews to render — provide it manually.
