# ATLAS.md

> This file is maintained by Claude Code and read by Atlas (your AI Chief of Staff).
> You don't need to edit it manually — Claude Code updates it at the end of each work session.

## Meta

| Field | Value |
|-------|-------|
| **Project** | Museum of Minds |
| **One-liner** | Immersive AI chatbot museum with 51 historical figures, debate platform, and hall-based navigation |
| **Status** | shipping |
| **Last Active** | 2026-05-26 |
| **Stall Threshold** | 7 days |
| **Repo** | https://github.com/jimmyardis/museum-of-minds |
| **Stack** | Static HTML/JS (GitHub Pages), FastAPI + Railway API, Pinecone (voyage-3-large, 2048-dim), Voyage AI, ElevenLabs TTS, ChromaDB |

## Current State

51 personas live. SC Curriculum Alignment Brief published at `museumofminds.com/educator/alignment/` — full USHC/USG/AP/legislative mandates/AI Framework coverage. Founding Documents hall portrait images fixed (Constitution + Declaration were 400-erroring due to bad Wikimedia hashes; corrected). Constitution persona page now has document photo in hero panel. Comprehensive Federalist/Anti-Federalist Papers build spec written at `/home/wner/FEDERALIST_BUILD_SPEC.md` — 9-phase full-vision build covering 170+ paper pages, collection chatbots, Debate View, Topic Clusters, and educator integration. Anti-Federalist corpus confirmed broken (Spinoza text ingested in error); fix is Phase 0 of the spec.

## Next Action

Execute FEDERALIST_BUILD_SPEC.md Phase 0: write the Federalist Papers parser, source the correct Anti-Federalist Papers text, fix bad Pinecone vectors, and build the per-paper ingest pipeline. This is the prerequisite for all visible build work.

## Blockers

- Anti-Federalist corpus is wrong (Spinoza text in Pinecone under Constitution discourse) — must fix before any Anti-Fed pages
- Lincoln voice conflict with Hayek (same ElevenLabs voice ID `TxGEqnHWrfWFTfGW9XjX`) — needs re-audition before Lincoln TTS

## Open Questions

- Which Anti-Federalist edition to use? Spec recommends Avalon Project / public domain (Storing collection is copyrighted). Confirm with user before Phase 0B.
- Teacher dashboard / classroom passcode system — scoped and discussed, not yet built. Prioritize relative to Federalist build?
- AI literacy "How It Works" page — scoped and designed in conversation, not yet built. Prioritize?

## Session Log

<!-- Append-only. Most recent session on top. Claude Code adds an entry at the end of each work session. -->

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
