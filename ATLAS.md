# ATLAS.md

> This file is maintained by Claude Code and read by Atlas (your AI Chief of Staff).
> You don't need to edit it manually — Claude Code updates it at the end of each work session.

## Meta

| Field | Value |
|-------|-------|
| **Project** | Museum of Minds |
| **One-liner** | Immersive AI chatbot museum with 42 historical figures, debate platform, and hall-based navigation |
| **Status** | shipping |
| **Last Active** | 2026-05-23 |
| **Stall Threshold** | 7 days |
| **Repo** | https://github.com/jimmyardis/museum-of-minds |
| **Stack** | Static HTML/JS (GitHub Pages), FastAPI + Railway API, Pinecone (voyage-3-large, 2048-dim), Voyage AI, ElevenLabs TTS, ChromaDB |

## Current State

42 personas live across 4 halls (observatory, press-room, republic-room, trailblazers) plus library and founding-documents. Pinecone index `museum-of-minds` holds ~80,882 vectors. Educator mode flag added to widget; all persona pages, hall cards, and debate platform are fully wired to Railway API. The Constitution persona (Founding Documents) and Sherlock Holmes (fiction) are the two newest hall types.

## Next Action

Re-audition and replace Lincoln's voice (currently conflicts with Hayek — both use Josh `TxGEqnHWrfWFTfGW9XjX`) before enabling Lincoln TTS in the widget.

## Blockers

- Lincoln voice conflict with Hayek (same ElevenLabs voice ID — needs re-audition before Lincoln TTS goes live)

## Open Questions

- Which persona should be built next (KG 3D/VR phase — 3d-force-graph integration on persona pages)?
- Dorkstation and urban-productivity are local-only pipelines — should they feed museum context?

## Session Log

<!-- Append-only. Most recent session on top. Claude Code adds an entry at the end of each work session. -->

### 2026-05-23

- Created ATLAS.md for project tracking
- No code changes this session — file placement only
