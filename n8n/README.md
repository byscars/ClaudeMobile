# n8n Workflow — UGC Pipeline

Import `ugc-pipeline.workflow.json` into n8n to run the full ClaudeMobile pipeline via webhook.

---

## Setup (3 steps)

### 1. Add Anthropic API credential

In n8n: **Credentials → New → Header Auth**

- Name: `Anthropic API Key`
- Header Name: `x-api-key`
- Header Value: `your_anthropic_api_key_here`

### 2. Import the workflow

**Workflows → Import from file** → select `ugc-pipeline.workflow.json`

### 3. Activate

Toggle the workflow to **Active**. Copy the webhook URL shown on the trigger node.

---

## Usage

Send a POST request to your webhook URL:

```bash
curl -X POST https://your-n8n-instance.com/webhook/ugc-pipeline \
  -H "Content-Type: application/json" \
  -d '{
    "product": "AthleteX whey protein",
    "audience": "Men 22-35, gym regulars, skeptical of supplement hype",
    "job": "30s TikTok UGC ad, talking to camera, casual gym setting",
    "formula": "testimonial",
    "variants": 3,
    "voiceRef": "Direct, slightly tired of BS, sounds like a real gym friend",
    "constraints": "No price mentions. Under 120 words.",
    "successCriteria": "Hook lands in first sentence. Has one specific timeframe or result."
  }'
```

### Required fields
| Field | Description |
|-------|-------------|
| `product` | Product or service name |
| `audience` | Ultra-specific audience description |

### Optional fields
| Field | Default | Description |
|-------|---------|-------------|
| `job` | Auto-generated | Exact deliverable + specs |
| `formula` | `testimonial` | One of: `testimonial`, `problem-solution`, `product-review`, `grwm`, `comparison` |
| `variants` | `3` | Number of script variants (1–5) |
| `voiceRef` | — | Tone/style reference |
| `constraints` | — | Hard limits (platform, length, no-go topics) |
| `successCriteria` | — | What good looks like |

---

## Response

The webhook returns a JSON object with everything you need:

```json
{
  "meta": {
    "timestamp": "2026-03-05T14-30",
    "product": "AthleteX whey protein",
    "formula": "testimonial",
    "folderName": "2026-03-05T14-30-athletex-whey-protein"
  },
  "brief": { ... },
  "selectedScript": {
    "text": "Okay so I've been going to the gym for...",
    "score": 83,
    "passed": true,
    "variantNumber": 2
  },
  "allScripts": [
    { "index": 1, "script": "...", "quality": { "score": 67, "passed": true } },
    { "index": 2, "script": "...", "quality": { "score": 83, "passed": true } },
    { "index": 3, "script": "...", "quality": { "score": 50, "passed": false } }
  ],
  "assets": {
    "imagePrompt": "...",
    "videoPrompt": "...",
    "voiceScript": "...",
    "elevenLabsNotes": "..."
  }
}
```

---

## Extending the workflow

**Save to Google Drive:** Add a Google Drive node after "Parse Pipeline Assets" to write each asset as a file into a dated folder.

**Save to Notion:** Add a Notion node to create a new page per pipeline run with all assets as blocks.

**Trigger from a form:** Replace the Webhook node with an n8n Form trigger to generate content from a simple web form — no curl needed.

**Auto-post to Slack:** Add a Slack node to drop the script + image prompt into a `#content-ready` channel for review.

---

## Cost estimate

Each full pipeline run = 2 Claude API calls:
- Script generation: ~800–1200 input tokens + ~800 output tokens
- Asset generation: ~600 input tokens + ~700 output tokens

Roughly **$0.01–0.02 per run** with `claude-sonnet-4-6`.
