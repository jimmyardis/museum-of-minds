# ATLAS.md

> This file is maintained by Claude Code and read by Atlas (your AI Chief of Staff).
> You don't need to edit it manually — Claude Code updates it at the end of each work session.

## Meta

| Field | Value |
|-------|-------|
| **Project** | Museum of Minds |
| **One-liner** | Immersive AI chatbot museum with 80 persona pages, debate platform, and hall-based navigation |
| **Status** | shipping |
| **Last Active** | 2026-08-21 |
| **Stall Threshold** | 7 days |
| **Repo** | https://github.com/jimmyardis/museum-of-minds |
| **Stack** | Static HTML/JS (GitHub Pages), FastAPI + Railway API, Pinecone (voyage-3-large, 2048-dim), Voyage AI, ElevenLabs TTS, ChromaDB |

## Current State

**Milton Friedman build held 2026-08-21 on a copyright finding — no files created, nothing shipped.** He is the first Counting House candidate whose entire body of work is in copyright, so he cannot meet the platform's "Powered by His Own Words" standard. See the session log for the full source audit. Roster unchanged: 80 live persona pages.

**William Moultrie unpublished 2026-08-08 — 79 live persona pages, Republic Room now 25 cards.** His page, widget, and portrait were archived to `/home/wner/museum-archive/william-moultrie-2026-08-07/` (with RESTORE.md) and removed from the site along with every inbound reference. He remains registered on museum-api and his Pinecone vectors are intact, so republication is a file-restore with no re-ingest.

**Museum otherwise fully operational (as of 2026-07-07).** Sprint 3 batch shipped: Abigail Adams, Christopher Gadsden, John Rutledge, Roger Sherman (Republic Room, now 26 cards) and the Articles of Confederation (Founding Documents hall, now 4 document personas) — full pages with hand-drafted hero SVGs, self-hosted WebP portraits, widgets on the multi-tenant API, ~15k new Pinecone vectors, all five chatbots verified grounded in production. Sherlock chat repaired: its dedicated Railway service had been silently deleted; page repointed to the multi-tenant API. Full platform audit run same session — PLATFORM_STATUS.md roster/hall counts corrected against reality.

## Next Action

Pick the next persona from a candidate whose primary works are public domain (pre-1930 publication) — the Friedman hold showed the pipeline has no path for in-copyright figures. Otherwise resume feature work: Tracks 2–4 completed 2026-07-07 (decommission, auto-snapshot, bot supervision). Next: feature work — candidates: link /sherlock/ from a hall or homepage nav (snapshot flags it as orphaned), Sherlock voice finalization, Federalist Phase 6 (filterable indexes), or the next persona sprint.

## Blockers

- Sherlock Holmes voice: `TBD_AFTER_AUDITION`, `enabled: false` — test clips exist at `~/.tmp/holmes_george.mp3` and `holmes_daniel.mp3`. User needs to listen and pick.
- Frederick Law Olmsted: voice_id not set in persona.json — needs audition before TTS.

## Open Questions

- **Does the museum want a policy for in-copyright figures at all?** Friedman, Keynes-era successors, and most 20th-century thinkers are blocked by the same wall. Options are a "tradition corpus + authored dossier" tier (visibly different trust label), licensed text, or a hard pre-1930 cutoff. Unresolved — this gates every modern persona, not just Friedman.
- Teacher dashboard / classroom passcode system — scoped and discussed, not yet built. Prioritize relative to Federalist Phase 2?
- AI literacy "How It Works" page — scoped and designed, not yet built. Prioritize?
- Portrait cards for Federalist/Anti-Federalist now use polished inline SVGs — could upgrade to period document scans if found.

## Session Log

<!-- Append-only. Most recent session on top. Claude Code adds an entry at the end of each work session. -->

### 2026-08-21 — Milton Friedman create cycle: HELD (no build)

- **Requested**: full create cycle on Milton Friedman. **Outcome**: stopped before Stage 1 by user decision. No `personas/milton-friedman/` dir, no page, no vectors, no deploy — nothing to roll back.
- **Blocking finding — the corpus does not exist in the public domain.** Friedman (1912–2006) is the first Counting House candidate with zero public-domain primary works. Verified directly against the Archive.org advancedsearch/metadata APIs and Gutenberg search (not from memory):
  - *Capitalism and Freedom*, *A Monetary History of the United States*, *Essays in Positive Economics*, *A Theory of the Consumption Function*, *The Great Contraction*, *Monetary Trends* — all on Archive.org with `access-restricted-item: true` (DRM lending only, no extractable text).
  - *Free to Choose* (1980 PBS, all 10 episodes) and the "Milton Friedman Speaks" lectures are present as **video with no subtitle/transcript files** — nothing for the pipeline to harvest.
  - Gutenberg has no Friedman texts at all.
  - A handful of unrestricted uploads of *Capitalism and Freedom* exist — **pirated copies of an in-copyright book; deliberately excluded.**
  - The only legitimately downloadable Friedman primary text is *Roofs or Ceilings?* (Friedman & Stigler, FEE 1946, identifier `1946-roofs-or-ceilings`, 39 KB, explicit reprint permission, heavy OCR noise) — roughly 25 chunks against the 200-vector minimum in PERSONA.md Step 3.
- **Options put to the user**: (1) Hayek-precedent tradition corpus (Fisher, Hume, Marshall, Thornton, Mises) + a hand-authored context dossier; (2) tradition corpus alone; (3) hold. **Decision: hold.**
- **Rationale**: a Nobel monetarist who cannot quote himself fails the museum's "Powered by His Own Words" premise. The Hayek precedent works because Hayek's *tradition* is his argument; Friedman's contribution is specific empirical claims (the k-percent rule, the 1929–33 monetary contraction thesis, the natural rate) that a 1911 quantity-theory corpus would misrepresent rather than approximate. An empty slot beats a persona that sounds like a generic monetarist wearing his name.
- **Not attempted**: no config was authored, so nothing needs deleting if this is revisited. Reviving him requires licensed text or a new trust tier — see Open Questions.
- Side effect: ran `execution/platform_snapshot.py` at session start (per the 2026-08-08 note that it was stale). It corrected the Moultrie drift — republic-room 26→25 cards, 81→80 pages — and now flags `william-moultrie` as "on the API but has no site page," which is the intended post-unpublish state. `PLATFORM_STATUS.md` is modified and uncommitted in the jane-jacobs-bot repo.

### 2026-08-08

- **Archived and unpublished the William Moultrie persona page.** Archive at `/home/wner/museum-archive/william-moultrie-2026-08-07/` — 22 files, 48 MB, all sha256-verified: page + widget JS/CSS + portrait, the inbound-reference snippets, the full `personas/william-moultrie/` source corpus, and a `RESTORE.md` with republication steps.
- Verified fidelity before removing: the live-served `index.html`, widget JS, and widget CSS were fetched from museumofminds.com and diffed against the repo copies — byte-identical.
- Takedown (commit `4a5a0cd`) removed the page dir, the portrait, the republic-room card + its `.card-wm` rule, the homepage figure chip, two FEATURES.md rows, and three `educator/alignment/` curriculum rows that had named him as a chattable figure. Live-verified: page 404, portrait 404, zero references on the homepage, republic-room, and educator pages.
- **Decision:** unpublish the page only, leaving the persona registered on museum-api with its ~39 Pinecone vectors intact. Rationale — republication then costs nothing but a file restore; deregistering would have forced a paid re-ingest to bring him back.
- **Left deliberately:** dead `.card-moultrie` CSS rules in counting-house, trailblazers, press-room, and observatory. They are unused copy-paste boilerplate in halls he was never in, unrelated to this takedown.
- **Left for review:** two educator-alignment rows now read "Chat with Hamilton and Washington on Revolution" and "Chat with Jefferson and Hamilton on SC's role in independence"; a third dropped "(Moultrie)" as the colonial-SC example. Gadsden or Rutledge would be the natural SC substitutes, but that is an editorial call, so his name was only removed, not replaced.
- Note: `PLATFORM_STATUS.md` still lists him — accurate for the backend (he is still a registered persona), but its hall roster and page counts are now stale. Re-run `python execution/platform_snapshot.py` to refresh.

### 2026-07-07 — Platform audit + Sprint 3 completion + Sherlock fix

- **Full platform audit** (4 parallel audits: site repo, backend/pipeline repo, orchestration harness, stray dirs + live service checks). Key finds: Sherlock's dedicated Railway service deleted (chat silently broken); 5 Sprint 3 personas live on API with zero Pinecone vectors (hollow chatbots); PLATFORM_STATUS.md stale in both directions (/batch exists but documented as missing, hall counts wrong, Sprint 3 marked "planned"); museum-orchestration never ran a job and duplicates (rather than calls) the execution/ pipeline — recommendation: retire.
- **Sherlock fixed**: `sherlock/index.html` repointed from dead `sherlock-holmes-production-5185` to multi-tenant API `/persona/sherlock-holmes/chat`. Verified live in production.
- **Sprint 3 root cause**: generated sources.json files contained hallucinated Archive.org identifiers → downloads all failed silently. Identifiers corrected against archive.org metadata API (9 fixes + Abigail Vol. 2 added).
- **5 personas built end-to-end**: corpus download → clean → voyage-3-large embed (+14,957 vectors, index now 161,402) → trust scores → self-hosted WebP portraits (all 5 visually verified) → full pages via 5 parallel builder agents (george-mason/bill-of-rights templates) → hall cards (republic-room ×4 + founding-documents portrait grid + documents wing) → local playwright render check → pushed, GitHub Pages live, all 5 chatbots verified grounded (5 sources, high confidence).
- **Gadsden factual fix**: system prompt falsely claimed he was a 1787 Philadelphia Convention delegate; corrected to SC ratifying convention 1788 (page copy was already right). Verified in production — he now denies attending Philadelphia.
- **Backend repo**: cleaned corpora committed (~30MB), museum-api auto-deployed via webhook (build SUCCESS).
- Left for next session: Track 2 decommission list, Track 3 auto-generated status doc, Track 4 bot supervision + smoke test.
### 2026-05-30 (session 2) — Portrait URL 2nd pass + process documentation

- **Root-cause investigation**: previous portrait fix covered only the 25 new personas. 32 additional broken `/thumb/` URLs remained in observatory, republic-room, trailblazers, press-room, founding-documents halls + 9 older persona pages (FDR, Cleveland, George Mason, Montesquieu, Helen Keller, James Baldwin, Carl Jung, John Adams, John Locke, Patrick Henry, Bill of Rights, Declaration, Constitution) + main index.html.
- **Portrait URL fixes (32 more)**: all `/thumb/` → direct Commons URLs. Special cases: Carl Jung (TIF → `Carl_Jung_Photo.jpg` alt), Banneker (TIF mural → `BenjaminBanneker.jpg` alt), Charles Drew (en/thumb → direct en URL). Also fixed `data-portrait-url` in widget `<script>` tags for john-locke, carl-jung, john-adams.
- **Bill of Rights card removed from press-room**: was linking correctly to /bill-of-rights/ but using a photo of Bill Adair (a journalist) as the portrait image — clearly a copy-paste accident. Bill of Rights is correctly in founding-documents hall.
- **Railway API confirmed healthy**: deployed 16:17 UTC, all new personas returning HTTP 200 for config and chat. No 404s in recent HTTP logs.
- **"P0 stub pages" resolved**: confirmed all 10 alleged stubs have full SVG heroes, bio sections, chatbot widgets, pullquotes, and corpus lists. PLATFORM_STATUS.md P0 entry was outdated — removed.
- **CLAUDE.md updated**: added portrait URL rule as step 9 in pre-commit checklist; cleared outdated routing bug entries (turing/einstein/earhart all confirmed correct as of today).
- **PLATFORM_STATUS.md updated**: removed P0 section, updated press-room roster (12 personas), added CRITICAL portrait URL rule documentation.

### 2026-05-30 — 25-persona expansion debug + portrait fix session

- **Root-cause audit** of overnight /goal run: all 25 chatbots returned 404 because Railway API was not redeployed after persona.json push (no webhook). All 25 Pinecone embeddings confirmed present (100+ vectors each). Portrait cards all blank because Wikipedia thumbnail URL format (`440px-`) returns HTTP 400 — only direct Commons URLs work.
- **Railway API redeployed** using minimal-upload method (3MB package from temp dir vs. 1GB from /home/wner). API now serves 76 personas. All 25 new chatbots verified responding.
- **52 portrait URL fixes** across 31 files (5 hall pages + 26 persona pages). Committed and pushed to museum-of-minds.
- **Sojourner Truth corpus expanded**: was 11 chunks (1850 Narrative only). Added 1875 expanded edition (Archive.org `narrativeofsojou7231gilb`): 304 total corpus vectors after re-embed.
- **PERSONA.md updated** with 6-step Deployment Pipeline section (portrait URL rule, page quality standard, Pinecone vector thresholds, Railway deploy procedure, chatbot spot-check, commit procedure). Post-mortem failure table included.
- **PLATFORM_STATUS.md updated**: vector count, P0 stub-page bug tracker for 10 thin pages.
- **Stray files cleaned**: removed accidental `museum-of-minds/personas/alexis-de-tocqueville/` and `john-stuart-mill/` corpus directories (wrong repo).

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
