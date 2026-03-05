# Action Plan — Do This Tonight

Everything is set up. Follow these steps in order.

---

## Step 1 — Get Your API Key (5 min)

1. Go to **console.anthropic.com**
2. Sign in or create account
3. Click **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-...`)

---

## Step 2 — Connect the Key (2 min)

In your terminal, from the `ClaudeMobile/` folder:

```bash
cp .env.example .env
```

Open `.env` and replace `your_key_here` with your actual key:

```
ANTHROPIC_API_KEY=sk-ant-YOUR_KEY_HERE
```

---

## Step 3 — Sign Up for the Campaigns (10 min)

### Cantina (RPM campaigns — get paid per view)
1. Go to **affiliatenetwork.com**
2. Apply to all 3 Cantina campaigns:
   - **AI Video Pranks** — $1.50 RPM, 1K min views (start here)
   - **Iceberg Theories** — $1.25 RPM, 2K min views ($12.5K untouched budget)
   - **AI UGC with CTA** — $0.75 RPM, 1.5K min views (proven, 52% paid)
3. Note your posting link/tracking URL from each campaign

### ElevenLabs (affiliate — recurring commissions)
- Your link is already saved: **try.elevenlabs.io/12s2misr4rnk**
- Add this to your bio on TikTok, Instagram, YouTube
- 25% recurring commission every month someone keeps paying

---

## Step 4 — Generate Your Content (10 min per campaign)

Run these one at a time. Each generates a full production folder.

```bash
# Best RPM first — AI Video Pranks
npm run dev -- pipeline --brief briefs/cantina-ai-pranks.json

# Untouched budget — Iceberg Theories
npm run dev -- pipeline --brief briefs/cantina-iceberg.json

# Proven payer — AI UGC with CTA
npm run dev -- pipeline --brief briefs/cantina-ugc-cta.json

# ElevenLabs affiliate content
npm run dev -- pipeline --brief briefs/elevenlabs-affiliate.json
```

Each run creates a folder in `output/pipelines/` with:
- `01-script.md` — your filming script (best variant auto-selected)
- `02-image-prompt.txt` — paste into Flux/Nano Banana for thumbnail
- `03-video-prompt.txt` — paste into VEO/Kling for B-roll
- `04-voice-script.txt` — paste into ElevenLabs for VO
- `05-elevenlabs-notes.txt` — voice settings for ElevenLabs

---

## Step 5 — Film and Post

For each campaign:

1. Read `01-script.md` — pick the variant that feels most natural to say
2. Film on your phone, casual setting, one take is fine
3. Use `04-voice-script.txt` in ElevenLabs if you want AI VO instead of your voice
4. Post to **TikTok + Instagram Reels + YouTube Shorts** (same video, 3x the reach)
5. Add your Cantina tracking link in caption/bio
6. Add ElevenLabs affiliate link (`try.elevenlabs.io/12s2misr4rnk`) in bio

---

## Step 6 — Track What Works

After 48 hours, check which post hit the min view threshold first.
Double down on that campaign format — run the pipeline again with a new angle.

---

## Revenue Stack Summary

| Source | How You Get Paid | Timeline |
|---|---|---|
| Cantina AI Video Pranks | $1.50 per 1K views | After 1K views per post |
| Cantina Iceberg Theories | $1.25 per 1K views | After 2K views per post |
| Cantina AI UGC with CTA | $0.75 per 1K views | After 1.5K views per post |
| ElevenLabs affiliate | 25% recurring monthly | When someone signs up via your link |

---

## Quick Reference — Useful Commands

```bash
# See all generated output folders
ls output/pipelines/

# Re-run any pipeline
npm run dev -- pipeline --brief briefs/<name>.json

# Build (only needed if you edit source code)
npm run build
```

---

*Generated 2026-03-05*
