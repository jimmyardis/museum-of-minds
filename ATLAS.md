# ATLAS.md

> This file is maintained by Claude Code and read by Atlas (your AI Chief of Staff).
> You don't need to edit it manually — Claude Code updates it at the end of each work session.

## Meta

| Field | Value |
|-------|-------|
| **Project** | Museum of Minds |
| **One-liner** | Immersive AI chatbot museum with 78 historical figures, debate platform, and hall-based navigation |
| **Status** | shipping |
| **Last Active** | 2026-05-30 |
| **Stall Threshold** | 7 days |
| **Repo** | https://github.com/jimmyardis/museum-of-minds |
| **Stack** | Static HTML/JS (GitHub Pages), FastAPI + Railway API, Pinecone (voyage-3-large, 2048-dim), Voyage AI, ElevenLabs TTS, ChromaDB |

## Current State

**25-persona expansion complete (2026-05-30).** Museum now has 78 total personas deployed. 25 new figures added across all halls: Republic Room (Burke, Tocqueville, Rousseau, Roosevelt, Voltaire), Press Room (Twain, Emerson, Thoreau, Wells, Stowe), Counting House (Mill, Ricardo, Bastiat, George, Veblen), Trailblazers (Washington, Stanton, Truth, Nightingale, Wollstonecraft), Observatory (Galileo, Descartes, Babbage, Curie, Tesla). Pinecone index ~145,000 vectors. All pages committed and live on GitHub Pages. Known thin corpora: Sojourner Truth (23v), Tesla (101v), Marie Curie (discourse-only). 20 personas have 3D KG sections from prior work.

## Next Action

Prioritize enriching thin new corpora: Sojourner Truth (more speech transcripts), Tesla (more articles), Marie Curie (find accessible English primary texts). Also: Sherlock Holmes voice still unfinalized.

## Blockers

- Sherlock Holmes voice: `TBD_AFTER_AUDITION`, `enabled: false` — test clips exist at `~/.tmp/holmes_george.mp3` and `holmes_daniel.mp3`. User needs to listen and pick.
- Frederick Law Olmsted: voice_id not set in persona.json — needs audition before TTS.

## Open Questions

- Teacher dashboard / classroom passcode system — scoped and discussed, not yet built. Prioritize relative to Federalist Phase 2?
- AI literacy "How It Works" page — scoped and designed, not yet built. Prioritize?
- Portrait cards for Federalist/Anti-Federalist now use polished inline SVGs — could upgrade to period document scans if found.

## Session Log

<!-- Append-only. Most recent session on top. Claude Code adds an entry at the end of each work session. -->

### 2026-05-30 — 25-persona expansion complete

- **25 new personas built end-to-end in a single session** (corpus download → clean → embed → HTML page → widget → hall card → commit → push):
  - Republic Room: Edmund Burke, Jean-Jacques Rousseau, Alexis de Tocqueville, Theodore Roosevelt, Voltaire
  - Press Room: Mark Twain, Ralph Waldo Emerson, Henry David Thoreau, Ida B. Wells, Harriet Beecher Stowe
  - Counting House: John Stuart Mill, David Ricardo, Frédéric Bastiat, Henry George, Thorstein Veblen
  - Trailblazers: Booker T. Washington, Elizabeth Cady Stanton, Sojourner Truth, Florence Nightingale, Mary Wollstonecraft
  - Observatory: Galileo Galilei, René Descartes, Charles Babbage, Marie Curie, Nikola Tesla
- **All 25 personas have**: persona.json + sources.json + corpus/discourse cleaned + Pinecone vectors + HTML page + widget + hall card
- **Museum total: 78 personas** deployed on museumofminds.com
- **Pinecone total: ~145,000 vectors** (+37,000 from this session)
- **Known thin corpora**: Sojourner Truth (23 vectors — only Narrative), Tesla (101v — thin), Marie Curie (discourse-only, primary texts access-restricted on Archive.org)
- Both repos (jane-jacobs-bot configs + museum-of-minds pages) pushed to GitHub

### 2026-05-29 (session 2)

- **Batch 2 + 3 KG builds complete** (15 new personas across two sessions):
  - Batch 2: Washington (824n/741e), Marx (490n/380e), Hayek (712n/506e), Mencken (959n/618e), Lovelace (686n/506e), Jay (862n/837e), Montesquieu (554n/557e), Taylor (504n/433e), Holmes (653n/618e), Keller (216n/189e — short due to mid-pipeline credit exhaustion)
  - Batch 3: Lincoln (491n/523e), Franklin (865n/811e), Mason (651n/642e), Douglass (410n/378e), Darwin (616n/598e)
- **Jefferson Phase 5 refreshed** with `--force` (1,215n/1,374e — was stale from prior session)
- **`kg_bootstrap.py`** extended to 20 personas with full seed graphs for all Batch 2+3 figures
- **15 persona pages updated** with 3D KG sections via Phase 5 auto-injection; committed to museum-of-minds
- **Both repos pushed** to GitHub; Railway museum-api redeployed
- **KG build paused** at 20 figures by user request — Helen Keller Phase 4 re-run flagged as future task

### 2026-05-29 (session 1)

- **Batch 1 KG builds complete**: James Madison (1,266 nodes / 1,326 edges), Thomas Paine (737 / 782), Adam Smith (729 / 621) — all phases 0–5 done
- **Hamilton KG page section added**: Hamilton's page now has 3D KG section (1,134 nodes); also fixed stale git index that had trapped Phase 4 result at 691 nodes
- **kg_add_page_section.py** built: auto-injects themed KG CSS + HTML + 3D force-graph script into any persona page. Themes defined for Jefferson, Hamilton, Madison, Paine, Smith + generic dark fallback
- **build_kg_chain.sh** built: sequential pipeline runner (Phases 1–5) with phase-skip logic
- **kg_bootstrap.py** extended: full seed graphs for Madison, Paine, Smith added to `SUPPORTED_PERSONAS`
- **Batch 2 goal set**: Washington, Marx, Hayek, Mencken, Lovelace — picked for cross-link density (Washington), domain diversity (Mencken/Lovelace), and completing the economic thought triangle (Marx + Hayek)
- All three persona pages (madison, paine, smith) have KG sections committed and pushed; Railway redeployed

### 2026-05-28 (session 2)

- **Founding Documents portrait card images fixed**: Federalist Papers card was using a broken Wikimedia URL; Anti-Federalist Papers SVG was too small for the 3/4 aspect card frame. Both replaced with styled inline SVGs at proper dimensions (150×195). Committed `a188164`, pushed to `museum-of-minds`.
- **Federalist/Anti-Federalist chatbots fixed**: API was returning "Persona not found" because Railway `redeploy` reuses the same Docker image (doesn't pull latest GitHub). Required `serviceInstanceDeployV2(commitSha=...)` via Railway GraphQL API to trigger a fresh build from the latest commit (`cc1a5ce`). Both chatbots now respond correctly (tested).
- Both chatbots verified working: Federalist Papers returns Publius voice; Anti-Federalist returns Brutus voice.
- `alexander-hamilton/index.html` has uncommitted KG section CSS from a prior session — needs commit before next push.

### 2026-05-28 (session 1)

- **Bill of Rights removed from Republic Room**: portrait card stripped from `halls/republic-room/index.html` — it lives in Founding Documents hall now
- **Federalist/Anti-Federalist chatbot fixed**: root cause was both `persona.json` files using old flat schema — `PersonaManager` requires nested `metadata`, `corpus`, `persona`, and `widget.ui.header_title` fields; without them every chat request returned 404 and left a blank box. Both files rewritten to full schema and committed to `jane-jacobs-bot` repo (`836a8bd`)
- **Chatbot blank-square guard added**: both collection pages now show a readable error message instead of a blank box if the API returns empty/error
- Railway `museum-api` redeploy triggered to pick up persona.json fixes
- Both repos pushed to GitHub

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
