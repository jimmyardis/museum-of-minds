# Museum of Minds — Design System & Readability Standards

The aesthetic and readability standards for the Museum of Minds website, codified after the Phase 1 + Phase 2 readability passes touched every page on the site. Load this file before generating or editing any HTML/CSS for museumofminds.com.

This is the repo-resident version of the Museum of Minds Readability Standards. Same content as the platform skill of the same name, distributed here for Claude Code consumption.

## 1. The aesthetic identity (TO PRESERVE)

- **Typefaces:** Cormorant Garamond for display, EB Garamond for body, Cinzel for small-caps labels, JetBrains Mono for monospace metadata (used sparingly). All via Google Fonts.
- **Palette:**
  - Parchment cream background: `#F5EFE0`
  - Charcoal body text: `#1c1917`
  - Ink-soft secondary annotations: `#3a3431` (NOT for body)
  - Brass accent: `#B89040` (post-readability-pass; previously `#C4A84C` — now retired)
  - Deep mahogany: `#3A2A1E`
- **Feel:** editorial museum-catalog. Generous whitespace, refined typography, restraint over decoration.
- **Exceptions:** Some figure pages have intentionally distinct palettes that preserve their architectural identity. Notable:
  - Jefferson: aged-parchment (`--cream: #F2EBD0`, `--parchment: #E8DEB8`, `--ink: #2C1F0E`)
  - Sherlock: Victorian mahogany (`--void: #0A090C`, `--amber: #C49A3C`, `--brass: #8B7035`, `--ivory: #EDE8D8`)
  - These are intentional. Do NOT harmonize without explicit instruction.

## 2. The eight readability rules

1. **Body text font-size: 18px minimum.** Use `1.125rem`. Anything ≤14px should be raised.
2. **Font weight: 400 minimum on body.** Never weight 300 on readable content. Use 500–600 for emphasis (not lighter color).
3. **WCAG AA contrast minimum.** 4.5:1 for normal text, 3:1 for large (24px+ or 19px+ bold). The new brass `#B89040` on cream `#F5EFE0` passes at 4.6:1. Charcoal `#1c1917` on cream passes at ~16:1.
4. **Line height: 1.6 minimum for body**, 1.2–1.3 for headlines.
5. **Italic forbidden on body paragraphs and instructional prose.** Italic preserved (and required) on titles of works (book/essay titles in corpus lists), pull quotes, captions, and citations.
6. **Small-caps Cinzel labels: 0.58–0.72rem minimum.** Anything 0.38–0.52rem is too small. Reduce letter-spacing proportionally on larger labels to prevent overcompression.
7. **Opacity floor 0.88 on text.** Never use 0.6–0.75 on text. Decorative SVG/ornamental elements (oversized quotation glyphs, diamond separators, background textures) are exempt.
8. **No `--cream-dim` for body text.** Use `--cream` to maintain contrast. The dim variant was a contrast-failure pattern; remove on sight.

## 3. Forbidden patterns (CSS examples)

### Persona bio text

```css
/* WRONG — too small, weight too light, color too washed, italic on body */
.placard-bio {
  font-size: 0.95rem;
  font-weight: 300;
  color: var(--text-dim);
  font-style: italic;
}

/* RIGHT */
.placard-bio {
  font-size: 1.05rem;       /* ~17px */
  font-weight: 400;
  color: var(--text);
  font-style: normal;
}
```

### Corpus item (list of works)

```css
/* WRONG — too small, weight too light, opacity too low */
.corpus-item {
  font-size: 0.82rem;
  font-weight: 300;
  opacity: 0.65;
  font-style: italic;       /* italic IS correct here — titles of works */
}

/* RIGHT */
.corpus-item {
  font-size: 1rem;          /* 16px floor for list items */
  font-weight: 400;
  opacity: 0.88;
  font-style: italic;       /* preserved per typographic convention */
}
```

### Small-caps section label

```css
/* WRONG — overcompressed, low opacity, too small */
.exhibit-tag {
  font-size: 0.46rem;
  letter-spacing: 0.18em;
  opacity: 0.55;
}

/* RIGHT */
.exhibit-tag {
  font-size: 0.58rem;       /* ~9.3px */
  letter-spacing: 0.12em;
  opacity: 0.88;
}
```

### Hall nameplate description

```css
/* WRONG — well below 18px body floor */
.nameplate-desc {
  font-size: 0.88rem;       /* 14px */
  font-style: italic;
}

/* RIGHT */
.nameplate-desc {
  font-size: 1.125rem;      /* 18px */
  font-style: normal;
  line-height: 1.5;
}
```

### SVG annotation labels

```html
<!-- WRONG -->
<text x="100" y="200" font-size="8">Column shaft</text>

<!-- RIGHT (architectural diagram labels) -->
<text x="100" y="200" font-size="11">Column shaft</text>

<!-- Floor-plan chamber labels: 12px -->
<text x="100" y="200" font-size="12">Senate Chamber</text>
```

## 4. Required patterns for persona pages

The canonical post-readability persona page is `alexander-hamilton/index.html`. Mirror its structure. Specific class rules:

- `.placard-bio` (or equivalent persona bio container): `1.05rem`, weight 400, color `--text` (NOT `--text-dim`), `font-style: normal`
- `.placard-tagline` / `.persona-tagline`: italic preserved (functions as tagline/pull quote), weight ≥400
- `.exhibit-tag`, `.panel-caption`, `.domain-tag`, `.footer-text`: size ≥0.58rem, opacity ≥0.88
- `.corpus-item` / `.corpus-list li`: size 1rem, weight 400, opacity 0.88, **italic preserved** (titles of works)
- `.chatbot-intro p`: 1.125rem, weight 400, color `--text`, no italic
- `.featured-quote p`, `.pull-quote blockquote`: italic preserved, weight 400, color `--text`
- SVG architectural annotations: 11px minimum (main labels); 12px for floor-plan chamber labels
- Decorative SVG elements (oversized quotation marks, decorative glyphs, ornamental dividers): exempt from readability rules; preserve original opacity

## 5. Required patterns for hall pages

The five hall pages (`halls/republic-room`, `halls/counting-house`, `halls/observatory`, `halls/press-room`, `halls/trailblazers`) share a consistent pattern. Specific class rules:

- `.nameplate-desc`: `1.125rem` (18px), normal style, line-height 1.5+
- `.nameplate-dates`: ≥0.60rem
- `.hall-desc`: `clamp(1.05rem, 1vw + 0.5rem, 1.2rem)`
- `.collection-note p`: weight 400, normal style
- `.card-image::before` (portrait door gradient): identical CSS across all halls (`linear-gradient(transparent, rgba(0,0,0,0.7))` at 50% height — visual variation across cards is photographic, not CSS)

## 6. The color palette (locked tokens)

```css
:root {
  --brass: #B89040;       /* accent — links, rules, label color; passes 4.6:1 on cream */
  --gold: #B89040;        /* synonym in some legacy variables — same value */
  --cream: #F5EFE0;       /* main page background */
  --paper: #FBF7EE;       /* slightly lighter for inset surfaces */
  --charcoal: #1c1917;    /* primary body text */
  --ink: #1c1917;         /* alias for charcoal */
  --ink-soft: #3a3431;    /* secondary annotations only — NOT for body */
  --mahogany: #3A2A1E;    /* deep wood accent, occasional borders */
  --gold-glow: #E8C97A;   /* warm pulse, very low opacity uses only */
}
```

**Retired values:**
- `#C4A84C` — old brass, removed in Phase 1.5 (fails contrast as body text on cream). If you see this, replace with `#B89040`.
- `--cream-dim` — removed in Phase 1 (fails contrast on body). Use `--cream` instead.

## 7. Decision framework — when in doubt

1. **Is this text body or decorative?**
   - Body = follow rules 1–8 strictly
   - Decorative (architectural annotations, ornamental glyphs, atmosphere) = preserve original treatment

2. **Is this an aesthetic accent or readable content?**
   - Accent (rule, dividing line, label color) = brass OK
   - Readable content = charcoal `--text` or equivalent

3. **Is the user expected to read this?**
   - Yes = 18px floor applies
   - No (scale reference for a diagram, compass-rose orientation, atmospheric text) = smaller is fine

4. **Italic decision:**
   - Body paragraph = upright (normal)
   - Pull quote, caption, citation, title of work in a list = italic preserved
   - Instructional / prompt text = upright

5. **When in doubt about a custom palette token** (Heisenberg `--quantum-gold`, Jefferson `--cream`, Sherlock `--amber`, etc.):
   - If contrast passes WCAG AA and the token is unique to one figure's intentional identity = preserve
   - If contrast fails = adjust to nearest compliant value within the figure's palette family
   - Never harmonize to the universal token without explicit instruction

## 8. Verification checklist (before commit)

- [ ] Body text ≥18px (`1.125rem`)
- [ ] Body weight ≥400
- [ ] All color pairings pass WCAG AA contrast
- [ ] Line height ≥1.6 on body
- [ ] No italic body paragraphs
- [ ] Italic preserved on titles of works, pull quotes, captions
- [ ] Small-caps labels ≥0.58rem
- [ ] Opacity ≥0.88 on text (decorative elements exempt)
- [ ] No `#C4A84C` references (use `#B89040`)
- [ ] No `--cream-dim` references on body text (use `--cream`)
- [ ] Brass used only for accents, large headings, or labels (not body)
- [ ] SVG annotation text ≥11px (architectural diagrams) or ≥12px (floor-plan chamber labels)
- [ ] New persona pages mirror `alexander-hamilton/index.html` structure
- [ ] Accession ID in the file matches the directory name (guards against the content routing bug pattern)

## 9. Aesthetic-preservation rules

**The readability standards exist to make the editorial museum-catalog aesthetic LEGIBLE, not to REPLACE it.**

The Caslon serif identity, parchment palette, brass accents, italic pull quotes, hand-set typography, generous whitespace — all of these stay. The standards prevent specific failure modes (illegibly small text, low-contrast color combinations, overuse of italic on body). They are NOT a license to switch to sans-serif, change the palette to white-on-black, or modernize the visual language.

Future work should treat the aesthetic as load-bearing and find ways to achieve the readability goals WITHIN the established design language.

## 10. Strict scope rules for design changes

When applying these standards or making related changes, follow these scope rules unless explicitly overridden:

**You MAY change:**
- `font-size` (CSS or inline)
- `color`
- `font-weight` (raise only — 300 → 400, 400 → 500 for labels)
- `opacity` (raise only)
- `letter-spacing` (reduce only on overcompressed small labels)
- `line-height` (raise from cramped values)
- `font-style` (italic → normal on body text only)

**You MAY NOT change without explicit instruction:**
- Anything in `.json` files
- Anything in `.js` files
- Anything in `.py` files
- HTML structure: divs, layouts, classes, tag names
- Images, image paths, image positioning
- SVG element structure (only `font-size` on SVG text)
- Background colors (unless required for text legibility)
- Animations, transitions, scripts, behavior
- The aesthetic identity

If a readability problem can't be fixed within these rules, flag it for human review rather than expanding scope.

## 11. Phase 1 + Phase 2 application examples

Concrete before/after CSS snippets from the actual readability passes:

**`.nameplate-desc` (hall pages)**
```css
/* Before */
.nameplate-desc { font-size: 0.76rem; font-style: italic; font-weight: 300; }
/* After Phase 1 (intermediate) */
.nameplate-desc { font-size: 0.88rem; font-style: normal; font-weight: 400; }
/* After Phase 1.5 (final) */
.nameplate-desc { font-size: 1.125rem; font-style: normal; font-weight: 400; }
```

**`.corpus-item` (persona pages)**
```css
/* Before */
.corpus-item { font-size: 0.82rem; opacity: 0.65; font-weight: 300; font-style: italic; }
/* After */
.corpus-item { font-size: 1rem; opacity: 0.88; font-weight: 400; font-style: italic; /* preserved per typographic convention */ }
```

**Brass token global update**
```css
/* Before */
:root { --brass: #C4A84C; /* fails 4.5:1 on cream */ }
/* After */
:root { --brass: #B89040; /* passes 4.6:1 on cream */ }
```

**SVG architectural annotations**
```html
<!-- Before -->
<text font-size="8">Facade</text>
<text font-size="10">Senate Chamber</text>
<!-- After -->
<text font-size="11">Facade</text>
<text font-size="12">Senate Chamber</text>
```

**Footer opacity**
```css
/* Before */
.footer-name { opacity: 0.5; }
.footer-dates { opacity: 0.35; }
.footer-center { opacity: 0.35; }
/* After */
.footer-name { opacity: 0.88; }
.footer-dates { opacity: 0.88; }
.footer-center { opacity: 0.88; }
```

---

**End of standards.** Apply these rules before generating, editing, or reviewing any Museum of Minds page.
