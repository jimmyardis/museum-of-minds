# Museum of Minds — Feature Tree
**Last updated:** 2026-05-07  
**Purpose:** Living reference of all site pages, features, and components. Update this file whenever a feature is added, removed, or changed.

---

## Site Architecture

**Domain:** museumofminds.com (Cloudflare Pages → GitHub: jimmyardis/museum-of-minds)  
**Backend API:** museum-api-production-8ce6.up.railway.app (Railway, service: jimmyardis/jane-jacobs-bot)  
**RAG index:** Pinecone `museum-of-minds`, 69,848 vectors, voyage-3-large 2048-dim  
**Voice:** ElevenLabs (paid plan, pre-made voices only — no library clones)

---

## Home Page (`/`)

- Museum entry hall layout
- Navigation links to each hall
- No chatbox

---

## Halls (6 total)

### Republic Room (`/halls/republic-room/`)
Portrait grid of 8 figures, each linking to their persona page:
- Alexander Hamilton · Thomas Jefferson · James Madison · George Washington
- Abraham Lincoln · John Taylor of Caroline · Thomas Paine

### Observatory (`/halls/observatory/`)
Portrait grid of 7 figures:
- Albert Einstein · Charles Darwin · Isaac Newton · Alan Turing
- Ada Lovelace · Werner Heisenberg · Carl Jung

### Counting House (`/halls/counting-house/`)
Portrait grid of 4 figures:
- Adam Smith · Friedrich Hayek · John Maynard Keynes · Karl Marx

### Press Room (`/halls/press-room/`)
Portrait grid of 4 figures:
- H.L. Mencken · Jane Jacobs · W.E.B. Du Bois · George Orwell

### Trailblazers (`/halls/trailblazers/`)
Portrait grid of 4 figures:
- Amelia Earhart · Frederick Douglass · Harriet Tubman · Helen Keller

### Founding Documents (separate hall)
- The Constitution (`/constitution/`) — document persona, not a historical figure

---

## Persona Pages (30 total)

### Status per persona

| Persona | Hall | Chatbox | Voice ID | Voice Active | Corpus Stats |
|---|---|---|---|---|---|
| Alexander Hamilton | republic-room | ✓ | Harry (SOYHLrjzK2X1ezoPC6cr) | ✓ | ✓ |
| Thomas Jefferson | republic-room | ✓ | Arnold (VR6AewLTigWG4xSOukaG) | ✓ | ✓ |
| James Madison | republic-room | ✓ | George (JBFqnCBsd6RMkjVDRZzb) | ✓ | ✓ |
| George Washington | republic-room | ✓ | Daniel (onwK4e9ZLuTAKqWW03F9) | ✓ | ✓ |
| Abraham Lincoln | republic-room | ✓ | Adam (pNInz6obpgDQGcFmaJgB) | ✓ | ✓ |
| John Taylor of Caroline | republic-room | ✓ | Arnold (VR6AewLTigWG4xSOukaG) | ✓ | ✓ |
| Thomas Paine | republic-room | ✓ | Bill (pqHfZKP75CvOlQylNhV4) | ✓ | ✓ |
| Albert Einstein | observatory | ✓ | TBD | ✗ | ✓ |
| Charles Darwin | observatory | ✓ | TBD | ✗ | ✓ |
| Isaac Newton | observatory | ✓ | TBD | ✗ | ✓ |
| Alan Turing | observatory | ✓ | TBD | ✗ | ✓ |
| Ada Lovelace | observatory | ✓ | Sarah (EXAVITQu4vr4xnSDxMaL) | ✓ | ✓ |
| Werner Heisenberg | observatory | ✓ | TBD | ✗ | ✓ |
| Carl Jung | observatory | ✓ | Antoni (ErXwobaYiN019PkySvjV) | ✓ | ✓ |
| Adam Smith | counting-house | ✓ | Liam (TX3LPaxmHKxFdv7VOQHJ) | ✓ | ✓ |
| Friedrich Hayek | counting-house | ✓ | Antoni (ErXwobaYiN019PkySvjV) | ✓ | ✓ |
| John Maynard Keynes | counting-house | ✓ | TBD | ✗ | ✓ |
| Karl Marx | counting-house | ✓ | TBD | ✗ | ✓ |
| H.L. Mencken | press-room | ✓ | Charlie (IKne3meq5aSn9XLyUdCD) | ✓ | ✓ |
| Jane Jacobs | press-room | ✓ | Sarah (EXAVITQu4vr4xnSDxMaL) | ✓ | ✓ |
| W.E.B. Du Bois | press-room | ✓ | TBD | ✗ | ✓ |
| George Orwell | press-room | ✓ | TBD | ✗ | ✓ |
| Amelia Earhart | trailblazers | ✓ | TBD | ✗ | ✓ |
| Frederick Douglass | trailblazers | ✓ | TBD | ✗ | ✓ |
| Harriet Tubman | trailblazers | ✓ | TBD | ✗ | ✓ |
| Helen Keller | trailblazers | ✓ | Sarah (EXAVITQu4vr4xnSDxMaL) | ✓ | ✓ |
| The Constitution | founding-docs | ✓ | TBD | ✗ | ✓ |
| Sherlock Holmes | library | ✗ (pending) | TBD | ✗ | ✓ |
| Susan B. Anthony | (none yet) | ✓ | TBD | ✗ | ✓ |

---

## Persona Page Layout (standard)

Each persona page at `museumofminds.com/<slug>/` contains:

### Above the fold
- Hero portrait image (Wikimedia Commons direct URL, no `/thumb/`)
- Name, birth–death years
- Tagline (from persona.json `metadata.tagline`)
- Short biography paragraph (from persona.json `metadata.description`)

### Corpus Stats Block (`#jj-corpus-stats`)
- Coverage bar (■ segments, percentage)
- Badge: Comprehensive / Substantial / Partial / Selective
- Works count: "N of M key primary works · X passages + Y discourse"
- Missing note (if applicable)

### Chatbox Widget (all active personas)
See **Chatbox Features** section below.

---

## Chatbox Features (all 29 active persona pages)

Widget JS/CSS served from: `museumofminds.com/<slug>/widget/<slug>-widget.(js|css)`  
API: `museum-api-production-8ce6.up.railway.app`

### Trigger
- Fixed bottom-right button (4-square grid icon)
- Branded with persona primary color

### Chat Window
Three size modes (persisted to localStorage):
- **Compact** (default): 400×620px
- **Medium**: 580×760px  
- **Full**: 100vw × 100vh, no border
- **Mobile** (≤480px): full-width bottom sheet, `max-height: calc(100dvh - 60px)`, snaps to bottom, rounded top corners

### Header
- Persona name, tagline, 1-line description
- **Download button**: exports conversation as styled PDF (disabled until first response)
- **Settings gear** (⚙): opens/closes settings panel below header
- **Size toggle**: cycles compact → medium → full
- **Close button** (×)

### Settings Panel (opened via gear)
Three independent segmented-button controls:
- **Historical**: Modern (default) | Historical — historical mode cuts awareness at death year
- **Length**: Brief | Standard (default) — brief = 2–4 sentences; standard = full response
- **Reading level**: General (default) | Middle School — middle school simplifies vocabulary, keeps voice intact
- All three values sent with every chat request to the API

### Messages Area
- Conversation starters (clickable prompts, hide after first use)
- User messages (right-aligned)
- Assistant messages with typewriter effect
- Per-message: confidence badge (●●● High / ●●○ Medium / ●○○ Low)
- Per-message: sources toggle (§ N sources → expandable panel showing title + year + own/discourse tag)

### Input Area
- **Voice button** (speaker icon): toggles ElevenLabs TTS on/off; active state highlighted
- **Text input**: Enter to send, Shift+Enter for newline
- **Educator tools toggle** (open-book icon): opens/closes educator panel
- **Send button**

### Educator Panel
- Grade level selector: Middle School / High School (default) / College
- **Lesson Plan** button: generates grade-appropriate lesson plan
- **Discussion Questions** button: generates discussion questions
- Generates via `/educator/lesson-plan` and `/educator/discussion-questions` endpoints
- Output appears as assistant message; PDF export enabled

---

## Backend API (`museum-api-production-8ce6.up.railway.app`)

**Source:** `jimmyardis/jane-jacobs-bot` → `execution/api_server_multitenant.py`  
**Deployed via:** Railway manual trigger (no GitHub webhook — deploy with `serviceInstanceDeployV2`)

### Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/personas` | List all available persona IDs |
| POST | `/persona/{id}/chat` | RAG chat, returns text response |
| POST | `/persona/{id}/chat/voice` | RAG chat + ElevenLabs TTS audio (base64) |
| POST | `/debate` | Two-persona debate exchange |
| POST | `/debate/voice` | Debate with audio for both figures |
| POST | `/educator/lesson-plan` | Grade-appropriate lesson plan |
| POST | `/educator/discussion-questions` | Discussion questions for topic/grade |
| GET | `/health` | Service health + Pinecone connection |
| GET | `/health/voice` | ElevenLabs connectivity test |

### Chat Request Parameters (`POST /persona/{id}/chat`)
```json
{
  "message": "string",
  "conversation_id": "string | null",
  "mode": "modern | historical",
  "length": "brief | conversational | detailed",
  "reading_level": "general | middle_school"
}
```

### RAG Pipeline
- **Embeddings:** Voyage AI `voyage-3-large`, 2048 dims, `input_type="query"` for retrieval
- **Vector store:** Pinecone `museum-of-minds` index, `museum-of-minds-vfyxzen.svc.aped-4627-b74a.pinecone.io`
- **Filter syntax:** `{"persona_id": "<id>"}` (not `$eq` — SDK v8 issue)
- **Retrieval:** corpus chunks (own words) + discourse chunks (critical discourse about persona's ideas)
- **Generation:** Claude claude-sonnet-4-6 via Anthropic API
- **Voice:** ElevenLabs `eleven_multilingual_v2`, pre-made voices only (library voices require paid+ and are IP-flagged on Railway)

### Persona Config (loaded from GitHub at request time)
- `jimmyardis/jane-jacobs-bot/personas/<id>/persona.json`
- Fields used: `id`, `hall`, `metadata.*`, `persona.system_prompt_template`, `voice.*`, `trust_score.*`, `corpus.*`

---

## Debate Site (`/debate-site/`)

- Standalone debate arena HTML
- Two-figure split panel
- Typewriter effect per exchange
- Moderator input (steer the debate)
- Transcript view
- PDF export of full transcript
- Voice for both participants (if enabled)

---

## Known Gaps / Not Yet Wired

- **Sherlock Holmes** (`/sherlock/`): corpus stats present, chatbox not yet active (voice TBD, `enabled: false`)
- **Susan B. Anthony** (`/susan-b-anthony/`): page and chatbox exist, not added to any hall yet
- **11 personas with voice TBD**: Einstein, Darwin, Newton, Turing, Heisenberg, Keynes, Marx, Du Bois, Orwell, Earhart, Douglass, Tubman, Constitution (need ElevenLabs voice auditions)
- **`length: "conversational"`**: API supports it; widget settings panel only exposes Brief/Standard (conversational omitted intentionally as intermediate)
- **Personas/ subdirectory**: `museum-of-minds/personas/` contains older widget copies — not used by live pages, not updated

---

## Update Protocol

When adding or changing a feature, update this file with:
1. The feature name and where it appears
2. Which pages/components are affected
3. Whether it requires a Railway redeploy (API change) or is frontend-only (Cloudflare Pages auto-deploys on push)
