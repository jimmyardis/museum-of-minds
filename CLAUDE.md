# Museum of Minds — Project Instructions for Claude Code

Museum of Minds (museumofminds.com) is an AI-powered educational platform where users have substantive conversations with historical figures grounded in primary-source RAG. The platform hosts 28+ historical figures across five thematic halls, plus the Constitution (Founding Documents pattern) and Sherlock (Museum of Fiction) pages.

This file is the canonical project-instruction document for Claude Code working on this repository. Read it fully before generating or editing any code.

## Critical: load the design system before any design work

**Before generating or editing any HTML/CSS, read and apply `DESIGN_SYSTEM.md` in this repo root.** It contains the Museum of Minds Readability Standards — the eight readability rules, color palette tokens, forbidden patterns, required patterns, and decision framework established by the Phase 1 + Phase 2 readability passes.

Do not skip loading the design system. The recent readability work touched every page on the site to bring it into compliance; new work that doesn't follow these standards will create inconsistency.

## Repository structure

- `index.html` — museum main page (root)
- `halls/` — five thematic hall pages (`republic-room`, `counting-house`, `observatory`, `press-room`, `trailblazers`)
- `[figure-name]/index.html` — one directory per historical figure (kebab-case naming: `alan-turing`, `frederick-douglass`, etc.)
- `constitution/index.html` — Founding Documents pattern (document-as-speaker)
- `sherlock/index.html` — Museum of Fiction (Victorian aesthetic, distinct from museum default)
- `personas/` — persona configuration data (do not modify without explicit instruction)
- `favicon.svg`, `CNAME`, `FEATURES.md` — repo metadata

## Workflow

- **Branch naming:** `feature/[short-description]` (e.g., `feature/readability-pass`, `feature/sherlock-launch`)
- **PRs target `main`** with descriptive titles and per-file change summaries
- **Author info for commits:** `Jimmy Ardis <jimmy@museumofminds.com>`
- **Merge strategy:** squash merge (cleaner main branch history)

## Strict scope rules for design changes

When making design or readability changes, follow these rules unless explicitly overridden:

**You MAY change:**
- `font-size` (CSS or inline)
- `color`
- `font-weight` (raise only — 300 → 400, 400 → 500)
- `opacity` (raise only)
- `letter-spacing` (reduce only, on overcompressed small labels)
- `line-height` (raise from cramped values)
- `font-style` (italic → normal on body text only; preserve italic on titles of works, pull quotes, captions, citations)

**You MAY NOT change without explicit instruction:**
- Anything in `.json` files
- Anything in `.js` files
- Anything in `.py` files
- HTML structure: divs, layouts, classes, tag names
- Images, image paths, image positioning
- SVG element structure (only `font-size` on SVG text is OK)
- Background colors (unless required for text legibility)
- Animations, transitions, scripts, behavior of any kind
- The aesthetic identity (Caslon serif, parchment palette, brass accents)

If a problem can't be fixed within these rules, flag it for human review rather than expanding scope.

## Portrait image URL rule — CRITICAL

**Wikipedia thumbnail URLs break on external sites (HTTP 400).** Always use direct Commons URLs:
- ✅ `https://upload.wikimedia.org/wikipedia/commons/A/AB/filename.jpg`
- ❌ `https://upload.wikimedia.org/wikipedia/commons/thumb/A/AB/filename.jpg/500px-filename.jpg`
- ❌ `.tif` files (not browser-renderable) — find a `.jpg` or `.png` alternative
- ❌ `wikipedia/en/thumb/...` — use `wikipedia/en/A/AB/filename.jpg` instead

Also check `data-portrait-url` attributes on widget `<script>` tags — these have the same URL and fail the same way.

Run `grep -rl '/thumb/' . --include="*.html"` before committing to verify no violations.

## Known content routing bugs

~~Three persona files had wrong content — RESOLVED 2026-05-30~~: alan-turing (`AT–1912`), albert-einstein (`AE–1879`), amelia-earhart (`AE–1897`) all now contain correct figures. No routing bugs remain as of this date.

## Persona naming conventions

- Directory names use kebab-case: `alan-turing`, not `alanturing` or `Alan_Turing`
- Persona JSON `id` matches directory name exactly
- The slug field also matches: `alan-turing`

## The canonical persona-page template

After the Phase 1 + Phase 2 readability passes, **`alexander-hamilton/index.html` is the canonical example of a fully-compliant persona page.** When generating a new persona page, mirror its structure and apply the standards in `DESIGN_SYSTEM.md`.

## Verification before commit

Before committing any HTML/CSS work, verify:

1. Body text size ≥18px (`1.125rem`)
2. Body weight ≥400
3. WCAG AA contrast on all primary text
4. No italic body paragraphs (italic preserved on titles of works, pull quotes, citations)
5. No `#C4A84C` (old brass) — only `#B89040` (new brass)
6. No `--cream-dim` references on body text — use `--cream` instead
7. New persona pages mirror the `alexander-hamilton/index.html` template
8. Accession ID in the file matches the directory name
9. **No `/thumb/` or `.tif` portrait URLs** — run `grep -rl '/thumb/' . --include="*.html"` to verify zero violations

For the full verification checklist and decision framework, see `DESIGN_SYSTEM.md`.
