# ATLAS.md

> This file is maintained by Claude Code and read by Atlas (your AI Chief of Staff).
> You don't need to edit it manually — Claude Code updates it at the end of each work session.

## Meta

| Field | Value |
|-------|-------|
| **Project** | Museum of Minds |
| **One-liner** | Immersive AI chatbot museum with 53 historical figures, debate platform, and hall-based navigation |
| **Status** | shipping |
| **Last Active** | 2026-05-27 |
| **Stall Threshold** | 7 days |
| **Repo** | https://github.com/jimmyardis/museum-of-minds |
| **Stack** | Static HTML/JS (GitHub Pages), FastAPI + Railway API, Pinecone (voyage-3-large, 2048-dim), Voyage AI, ElevenLabs TTS, ChromaDB |

## Current State

53 personas + 2 document collections live. Federalist/Anti-Federalist build through Phase 7: 85 individual Federalist paper pages, 32 Anti-Federalist paper pages, a cross-collection Debate View (4 topic pairs), and 8 SC USG-aligned Topic Cluster pages at `/federalist-papers/topics/`. Educator mode live on multi-tenant API with SC/AP standards alignment. SC Curriculum Alignment Brief at `/educator/alignment/`.

## Next Action

Phase 8: Educator portal paper-level integration — assignment generator (`/educator/assign`) and compare-papers endpoint to let teachers pull two papers side-by-side with discussion questions.

## Blockers

- Sherlock Holmes voice: `TBD_AFTER_AUDITION`, `enabled: false` — test clips exist at `~/.tmp/holmes_george.mp3` and `holmes_daniel.mp3`. User needs to listen and pick.
- Frederick Law Olmsted: voice_id not set in persona.json — needs audition before TTS.

## Open Questions

- Teacher dashboard / classroom passcode system — scoped and discussed, not yet built. Prioritize relative to Federalist Phase 2?
- AI literacy "How It Works" page — scoped and designed, not yet built. Prioritize?
- Anti-Federalist Papers portrait card image: currently uses inline SVG. Worth finding a real period document scan?

## Session Log

<!-- Append-only. Most recent session on top. Claude Code adds an entry at the end of each work session. -->

### 2026-05-27 (session 2)

- **Phase 2 complete**: 8 canonical paper pages live (F10, F51, F70, F78, F84, Brutus 1, Federal Farmer 1, Cato 4) via `build_paper_pages.py`
- **Phase 3 complete**: Debate View at `/federalist-papers/debate/` — 4 cross-collection topic pairs, moderator steering, thinking blocks, max 5 exchanges; links added to both collection indexes
- **Lincoln voice resolved**: `persona.json` already had `pNInz6obpgDQGcFmaJgB` (Adam), `enabled: true` — stale memory updated
- **Phase 4–5 complete**: All 117 paper pages generated (`build_paper_pages.py --all-papers`) — sealed all 106 dead 404 links in both collection indexes
- **Phase 7 complete**: 8 Topic Cluster pages live at `/federalist-papers/topics/` (faction, executive-power, judiciary, federalism, checks-balances, bill-of-rights, standing-armies, legislature) + topics overview index. SC USG standards badges per cluster. Nav "⊞ Topic Clusters" links added to both collection indexes. Committed `6c93d3c`, pushed to GitHub Pages.
- **PLATFORM_STATUS.md updated**: Phases 2–5, 7 marked ✅

### 2026-05-27 (session 1)

- **Phase 0 complete** (recap from prior session): 85 Federalist Papers parsed into `personas/federalist-papers/papers/` (85 .txt + manifest.json); 32 Anti-Federalist Papers sourced (Avalon Project — Brutus, Cato, Federal Farmer, Centinel, Agrippa, Plainman); Spinoza contamination fixed (99 bad vectors deleted, correct papers ingested via `ingest_papers.py`); 1,102 Federalist + 442 Anti-Federalist vectors in Pinecone; persona.json files created for both collections; `build_collection_pages.py` generator script written
- **Phase 1 complete**: `museumofminds.com/federalist-papers/` (85 papers, author/topic/AP/SC filter bar, curated reading paths, inline chat) and `museumofminds.com/anti-federalist-papers/` (32 essays, filter bar, editorial notes about retroactive label, inline chat) both live
- **Founding Documents hall updated**: portrait-grid cards added for both collections; Federalist Papers doc-card promoted from coming-soon to live; Anti-Federalist Papers live doc-card added (crimson/newsprint theme)
- **Educator mode deployed to live API** (commit `6398e21`): `educator_mode: bool` on ChatRequest → injects `_EDUCATOR_PROMPT_OVERLAY` (mandates verbatim primary-source quotation, inline attribution, no contemporary political commentary); `standards_alignment: List[str]` on ChatResponse returns up to 8 SC/AP codes; `_PERSONA_STANDARDS` covers all 53 personas; `_TOPIC_STANDARDS` adds keyword-triggered codes at query time; pushed to origin and Railway redeployed
- **Standards tags** for 15 Sprint 1/2 personas added (Adams, Locke, Patrick Henry, Mason, Jay, Montesquieu, Bill of Rights, Declaration, Federalist Papers, Anti-Federalist Papers, and more)
- **LexRich 5 outreach**: audited site against all 5 Melony links (SC CCRS, US History alignment, SC USG alignment, AP US History CED, AP Gov CED) — confirmed coverage; drafted follow-up email with persona links and feature highlights
- **PLATFORM_STATUS.md updated**: Phase 1 ✅, totals 53/53

### 2026-05-26

- Published SC Curriculum Alignment Brief at `/educator/alignment/index.html` — all SC USHC/USG/Grade 8 standards tables, 4 SC legislative mandates, SC AI Framework, SC Graduate Profile, Bill 5253 compliance, full AP Gov alignment (9 foundational docs, 14 SCOTUS cases), Federalist Papers AP vs SC comparison, print/PDF button
- Added "View SC Curriculum Alignment Brief" link to educator portal hero band
- Fixed founding documents hall portrait cards: Constitution URL had wrong Wikimedia hash (f/f0 → 6/6c); Declaration URL needed 500px (was 440px, 400-erroring)
- Added document photo to Constitution persona page hero panel (was SVG-only; now has `doc-photo-frame` with sepia-filtered document scan)
- Fixed Declaration portrait on its own page + in main index Hall VI portal card
- Discovered: Anti-Federalist corpus file (`ANTI_Anti_Federalist_Papers_1787.txt`) is Spinoza text, not Anti-Federalist Papers — bad ingest from earlier session
- Confirmed: Federalist Papers corpus (`FED_Federalist_Papers_1788.txt`) is clean, all 85 papers, parseable header format documented
- Wrote comprehensive Federalist/Anti-Federalist build spec at `/home/wner/FEDERALIST_BUILD_SPEC.md` — 9 phases, full architecture, file structure, cross-reference network, educator integration, API changes
- Decisions made and locked: four-tier persona stack, author-based Anti-Fed slugs, Federalist navy aesthetic vs Anti-Fed broadside aesthetic, collection-level Pinecone filter (`{"collection":"federalist"}`), multi-tenant API handles all 170+ papers with no new Railway services

### 2026-05-25 (session 2)

- Created Founding Documents hall page (`halls/founding-documents/`): 3 live docs (Constitution, Declaration, Bill of Rights) + 5 coming soon
- Added Founding Documents as 6th portal on main index.html; grid changed from repeat(5,1fr) to repeat(3,1fr) for 2×3 layout
- Fixed portrait pipeline determinism: persona.json `portrait_url` is now authoritative; `find_portrait.py` added HTTP 200 verification before accepting any Wikimedia URL
- Moved Bill of Rights hall designation from `republic-room*` to `founding-documents` in PLATFORM_STATUS.md
- All commits pushed to `jimmyardis/museum-of-minds` and `jimmyardis/jane-jacobs-bot`

### 2026-05-25 (session 1)

- Completed Sprint 2 deploy: George Mason, John Jay, Montesquieu, Bill of Rights pages live
- Fixed widget API URLs: per-persona placeholder Railway URLs → multi-tenant `museum-api-production-8ce6.up.railway.app`
- Fixed John Jay deploy (SHA conflict from concurrent deploy runs — pulled, committed manually)
- Added widget files for montesquieu (missing), john-jay CSS (missing), bill-of-rights (full set)
- Added all 4 Sprint 2 portrait cards to republic-room hall lobby
- Bill of Rights placed in republic-room (no founding-documents hall exists yet)
- Sprint 1 chatbots repaired: Railway redeployed with up-to-date persona.json commits (3 sequential redeploys)
- Updated PLATFORM_STATUS.md: Sprint 2 ✅ COMPLETE, totals updated to 51 personas/pages/widgets
- Note: CLAUDE.md in this repo has stale routing bug entries for Turing/Einstein/Earhart (user confirmed those pages correct)

### 2026-05-23

- Created ATLAS.md for project tracking
- No code changes this session — file placement only
