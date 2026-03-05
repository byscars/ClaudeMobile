# BloxburgRants + ClaudeMobile — Conversation Summary

**Date:** 2026-03-05

---

## 1. Profile Review (YouTube + TikTok)

### Accounts
- **YouTube:** BloxburgRants (@BloxburgRants) — 4 subscribers, 4 videos
- **TikTok:** @bloxburgrants1 — 8 followers, 217 likes

### Content
Roblox/Bloxburg-style observation/rant videos with text overlays over gameplay footage.

Examples:
- "Never answer unknown calls late at night"
- "Never trust a situation that feels slightly too convenient"
- "Never fall for someone who only exists after midnight"
- "I don't think I was ever supposed to notice this"

### Current Stats
- TikTok views per video: 830 – 1,379 (strong for 8 followers)
- YouTube Shorts: up to 1K views

---

## 2. Profile Changes Recommended

### TikTok
- Add a bio (currently blank) — even 8 words describing the content helps
- Remove the Lemon8 link — wasted space at this stage
- No affiliate links yet — too early, wrong audience

### YouTube
- Replace "professional yapper :P" with something that describes the content
- Example: *"bloxburg observations nobody talks about"*

---

## 3. Affiliate Strategy Decision

### Products in pipeline
- **Cantina AI**
- **ElevenLabs**

### Verdict
These products are aimed at **adult creators and marketers**. BloxburgRants has a **Roblox/gaming audience (likely younger)**. Pushing affiliate links here is a mismatch — it won't convert and could hurt the account.

### Two paths forward
1. **Keep BloxburgRants as-is** — grow organically, monetize later via YouTube Partner Program or gaming brand deals
2. **Start a separate account** — face-cam UGC content aimed at adult creators, run the Cantina AI / ElevenLabs affiliate angle there

---

## 4. ClaudeMobile Project

A CLI tool for AI-driven UGC ad production.

### What it does
1. Generates human-sounding UGC scripts via Claude API
2. Auto-scores scripts against a quality checklist (0–100, pass threshold: 67)
3. Generates all downstream production assets in one shot

### Output per pipeline run
```
output/pipelines/<timestamp>-<product>/
├── README.md               # Next steps + tool mapping
├── brief.json              # Input brief
├── 01-script.md            # Final UGC script
├── 02-image-prompt.txt     # → Nano Banana / Flux
├── 03-video-prompt.txt     # → VEO / Kling / Sora
├── 04-voice-script.txt     # → ElevenLabs
└── 05-elevenlabs-notes.txt # → ElevenLabs voice settings
```

### Tech stack
- Node.js (ESM), TypeScript, Commander.js
- Anthropic SDK (`claude-sonnet-4-6`)
- Zod v4, chalk, ora

### Quality scoring checks
| Check | Criteria |
|-------|----------|
| Length | 60–150 words |
| No hype language | No "game-changer", "revolutionary", emoji spam |
| No corporate speak | No "leverage", "utilize", "synergy" |
| Specific details | Numbers, timeframes, concrete results |
| Strong hook | First sentence ≤ 18 words |
| Conversational tone | Contains contractions (I'm, don't, it's) |

---

## 5. Key Takeaways

- BloxburgRants has good early traction — 1K+ views with almost no followers is a positive signal
- Don't force affiliate marketing onto a gaming account — audience mismatch kills conversion
- ClaudeMobile pipeline is built for adult creator/marketer UGC content
- Separate the two efforts: gaming brand vs. creator tools affiliate brand
