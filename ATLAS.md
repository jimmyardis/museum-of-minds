# ATLAS.md

> This file is maintained by Claude Code and read by Atlas (your AI Chief of Staff).
> You don't need to edit it manually — Claude Code updates it at the end of each work session.

## Meta

| Field | Value |
|-------|-------|
| **Project** | Museum of Minds |
| **One-liner** | Immersive AI chatbot museum with 51 historical figures, debate platform, and hall-based navigation |
| **Status** | shipping |
| **Last Active** | 2026-05-25 |
| **Stall Threshold** | 7 days |
| **Repo** | https://github.com/jimmyardis/museum-of-minds |
| **Stack** | Static HTML/JS (GitHub Pages), FastAPI + Railway API, Pinecone (voyage-3-large, 2048-dim), Voyage AI, ElevenLabs TTS, ChromaDB |

## Current State

51 personas live across republic-room, observatory, press-room, trailblazers, counting-house, library, and founding-documents. Sprint 2 complete: George Mason, John Jay, Montesquieu, and Bill of Rights deployed with pages, widgets, hall cards, and correct multi-tenant API URL. Pinecone index `museum-of-minds` holds ~106,000 vectors. Sprint 1 chatbots repaired (Railway redeployed with new persona.json commits).

## Next Action

Re-audition and replace Lincoln's voice (currently conflicts with Hayek — both use Josh `TxGEqnHWrfWFTfGW9XjX`) before enabling Lincoln TTS in the widget.

## Blockers

- Lincoln voice conflict with Hayek (same ElevenLabs voice ID — needs re-audition before Lincoln TTS goes live)
- No founding-documents hall page yet (Bill of Rights placed in republic-room as stopgap)

## Open Questions

- Which persona should be built next (KG 3D/VR phase — 3d-force-graph integration on persona pages)?
- Dorkstation and urban-productivity are local-only pipelines — should they feed museum context?

## Session Log

<!-- Append-only. Most recent session on top. Claude Code adds an entry at the end of each work session. -->

### 2026-05-25

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
