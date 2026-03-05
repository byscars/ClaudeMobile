# CLAUDE.md — ClaudeMobile

This file provides context and instructions for AI assistants working in this repository.

---

## Project Overview

**ClaudeMobile** is a CLI tool for AI-driven UGC (user-generated content) ad production. It automates the highest-leverage parts of the content pipeline:

1. Generating human-sounding UGC scripts via Claude API
2. Auto-scoring scripts against a quality checklist
3. Generating all downstream production assets (image prompt, video prompt, VO script, ElevenLabs notes) in one shot

The output is a ready-to-use production folder for each ad — every file formatted to paste directly into the relevant tool (Nano Banana, VEO/Kling, ElevenLabs, etc).

---

## Repository Structure

```
ClaudeMobile/
├── src/
│   ├── index.ts               # CLI entry point (Commander.js)
│   ├── commands/
│   │   ├── script.ts          # `cm script` command
│   │   └── pipeline.ts        # `cm pipeline` command
│   ├── lib/
│   │   ├── claude.ts          # Anthropic API calls (script gen + asset gen)
│   │   ├── quality.ts         # Quality checklist scorer
│   │   └── files.ts           # File I/O, output folder management
│   └── schemas/
│       └── brief.ts           # Zod schema for Brief + UGC formula guides
├── briefs/                    # JSON brief files (saved inputs)
│   └── example-protein.json
├── output/                    # Generated content (gitignored)
│   ├── scripts/               # Markdown files with scored script variants
│   └── pipelines/             # Per-ad folders with all production assets
├── dist/                      # Compiled JS (gitignored)
├── .env.example               # Required env vars template
├── .gitignore
├── package.json
├── tsconfig.json
└── CLAUDE.md
```

---

## Tech Stack

- **Runtime:** Node.js (ESM)
- **Language:** TypeScript (strict mode, `verbatimModuleSyntax`)
- **CLI framework:** Commander.js
- **AI:** Anthropic SDK (`claude-sonnet-4-6`)
- **Validation:** Zod v4
- **UX:** chalk (colors), ora (spinners)
- **Build:** `tsc` — outputs to `dist/`

---

## Development Setup

### Prerequisites

- Node.js 20+
- An Anthropic API key

### Install

```bash
npm install
```

### Environment

```bash
cp .env.example .env
# Add your ANTHROPIC_API_KEY
```

### Build

```bash
npm run build        # compile TypeScript → dist/
```

### Run (dev mode, no build needed)

```bash
npm run dev -- script --product "Product" --audience "Audience"
npm run dev -- pipeline --brief briefs/example-protein.json
```

---

## Common Commands

| Task | Command |
|------|---------|
| Build | `npm run build` |
| Dev run | `npm run dev -- <command> [options]` |
| Generate scripts | `cm script --product "X" --audience "Y" --variants 3` |
| Full pipeline | `cm pipeline --product "X" --audience "Y"` |
| Pipeline from brief file | `cm pipeline --brief briefs/my-product.json` |
| Pipeline with existing script | `cm pipeline --brief briefs/foo.json --script path/to/script.md` |

---

## Brief Schema

Briefs are the core input. They can be passed inline via flags or as a JSON file (`--brief`).

```ts
{
  product: string            // Required. Product or service name.
  audience: string           // Required. Ultra-specific audience description.
  job: string                // Required. Exact deliverable + specs.
  formula: enum              // "testimonial" | "problem-solution" | "product-review" | "grwm" | "comparison"
  variants: number           // 1–5. Default 3.
  voiceRef?: string          // Optional. Tone/style reference.
  constraints?: string       // Optional. Hard limits (length, platform, no-go topics).
  successCriteria?: string   // Optional. What good looks like.
}
```

---

## UGC Formulas

| Formula | When to use |
|---------|-------------|
| `testimonial` | Personal story with before/after. Best for supplements, services, lifestyle products. |
| `problem-solution` | Lead with pain, introduce fix. Best for productivity tools, health products. |
| `product-review` | Unboxing feel + small honest complaint. Builds trust. Best for physical products. |
| `grwm` | Routine integration. Best for beauty, wellness, daily-use products. |
| `comparison` | Was using X, switched to this. Best for competitive markets. |

---

## Output Structure

Every `pipeline` run creates a timestamped folder under `output/pipelines/`:

```
output/pipelines/2026-03-05T14-30-athletex-whey-protein/
├── README.md                # Next steps + tool mapping
├── brief.json               # Input brief (for re-running)
├── 01-script.md             # Final selected UGC script
├── 02-image-prompt.txt      # → Nano Banana / Flux
├── 03-video-prompt.txt      # → VEO / Kling / Sora
├── 04-voice-script.txt      # → ElevenLabs
└── 05-elevenlabs-notes.txt  # → ElevenLabs voice settings
```

`output/` is gitignored. Generated content stays local.

---

## Quality Scoring

Scripts are auto-scored 0–100 against 6 checks. Pass threshold: 67 (4/6 checks).

| Check | Criteria |
|-------|----------|
| Length | 60–150 words |
| No hype language | No 🔥🚀💯, "game-changer", "revolutionary", etc. |
| No corporate speak | No "leverage", "utilize", "synergy", etc. |
| Specific details | Contains numbers, timeframes, or concrete results |
| Strong hook | First sentence ≤ 18 words |
| Conversational tone | Contains contractions (I'm, don't, it's, etc.) |

The highest-scoring variant is automatically selected for pipeline asset generation.

---

## Code Conventions

- All imports of types use `import type` or `import { type X }` (required by `verbatimModuleSyntax`)
- ESM throughout — use `.js` extensions in imports even for `.ts` source files
- No comments unless logic is non-obvious
- Minimal error handling — validate at entry points (CLI args, brief files), trust internal code
- Do not add features beyond what was directly requested

---

## AI Assistant Instructions

1. **Read before editing.** Always read a file before modifying it.
2. **Minimal changes.** Only change what was explicitly requested.
3. **No speculative improvements.** Don't refactor or add comments to untouched code.
4. **Run `npm run build` after changes** to verify TypeScript compiles cleanly.
5. **Develop on correct branch.** Check `git branch` first. Use `claude/<description>-<session-id>`.
6. **Commit clearly.** Imperative mood, explain why not what.
7. **Push with** `git push -u origin <branch-name>`.
8. **Update this file** when significant architectural changes are made.

---

## Git Workflow

- Feature branches: `feature/<description>`
- AI branches: `claude/<description>-<session-id>`
- Never force-push to `main`
- Never skip pre-commit hooks

---

## Roadmap / Future Work

- [ ] n8n workflow templates for fully automated pipeline triggering
- [ ] ElevenLabs API integration (auto-generate VO, return audio file)
- [ ] Batch mode: process multiple briefs from a directory
- [ ] Character profile manager (store/reuse Nano Banana reference sheets)
- [ ] `cm schedule` command for cron-driven daily content generation
- [ ] Webhook support for receiving briefs from external tools

---

*Last updated: 2026-03-05*
