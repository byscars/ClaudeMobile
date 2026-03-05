import Anthropic from "@anthropic-ai/sdk";
import { type Brief, FORMULA_GUIDES } from "../schemas/brief.js";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are an expert UGC (user-generated content) scriptwriter specializing in high-converting short-form ad scripts for social media.

IDENTITY: You write scripts that sound like real people talking — not polished brand copy.

RULES:
- Sound human. Imperfect grammar is fine. No corporate language.
- Be specific. Vague claims kill conversion. Use numbers, sensory details, lived-in moments.
- Emotional hook in the first 3 seconds. If the hook fails, nothing else matters.
- No hype emojis in scripts (🔥🚀💯). They signal "ad" immediately.
- Keep it conversational — like texting a friend about something that actually worked.
- Each script should feel distinct. Don't just rephrase the same script.

CONSTRAINTS:
- Target length: 30–45 seconds when read aloud (roughly 75–120 words)
- Include natural pauses with [pause] or line breaks
- Mark any visual direction in (parentheses)
- End with a soft CTA that doesn't sound salesy

OUTPUT FORMAT:
Return ONLY the scripts, numbered, no preamble or explanation.`;

export async function generateScripts(brief: Brief): Promise<string[]> {
  const formulaGuide = FORMULA_GUIDES[brief.formula];

  const userPrompt = `## Brief

**Audience:** ${brief.audience}
**Product:** ${brief.product}
**Job:** ${brief.job}
**Formula:** ${brief.formula} — ${formulaGuide}
${brief.voiceRef ? `**Voice/tone reference:** ${brief.voiceRef}` : ""}
${brief.constraints ? `**Constraints:** ${brief.constraints}` : ""}
${brief.successCriteria ? `**Success criteria:** ${brief.successCriteria}` : ""}

Write ${brief.variants} distinct UGC scripts using the ${brief.formula} formula. Each should feel like it comes from a different real person.`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text =
    message.content[0]?.type === "text" ? message.content[0].text : "";

  return parseScripts(text, brief.variants);
}

function parseScripts(raw: string, count: number): string[] {
  // Split on numbered markers: "1.", "2.", "Script 1:", etc.
  const parts = raw
    .split(/\n(?=(?:Script\s*)?\d+[.):]\s)/i)
    .map((s) => s.trim())
    .filter(Boolean);

  if (parts.length >= count) return parts.slice(0, count);

  // Fallback: double newline separation
  const fallback = raw.split(/\n{2,}/).filter((s) => s.trim().length > 20);
  if (fallback.length >= count) return fallback.slice(0, count);

  return [raw];
}

export async function generatePipelineAssets(
  brief: Brief,
  script: string
): Promise<{
  imagePrompt: string;
  videoPrompt: string;
  voiceScript: string;
  elevenLabsNotes: string;
}> {
  const prompt = `You are a creative director converting a UGC ad script into production assets.

Given this script:
---
${script}
---

Product: ${brief.product}
Audience: ${brief.audience}

Generate all four assets. Use these exact headers:

## IMAGE PROMPT (Nano Banana / Flux)
[Detailed character + scene prompt. Include: subject description, outfit, setting, lighting, mood, camera angle. Style: photorealistic, social media native, not stock-photo perfect.]

## VIDEO PROMPT (VEO / Kling)
[Director-style prompt only. Include: shot type, camera movement, lighting condition, pacing/energy, depth of field. Do NOT describe story or narrative. Max 3 sentences.]

## VOICE SCRIPT (ElevenLabs)
[The script formatted for TTS. Use punctuation to control pacing: commas for short pauses, line breaks for longer ones, em dashes for breath. Remove visual stage directions.]

## ELEVENLABS NOTES
[Voice style guidance: pace (slow/medium/fast), tone (warm/direct/excited/casual), any section-specific adjustments.]`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    message.content[0]?.type === "text" ? message.content[0].text : "";

  return parsePipelineAssets(text);
}

function parsePipelineAssets(raw: string) {
  const extract = (header: string, nextHeader?: string): string => {
    const start = raw.indexOf(`## ${header}`);
    if (start === -1) return "";
    const contentStart = raw.indexOf("\n", start) + 1;
    const end = nextHeader ? raw.indexOf(`## ${nextHeader}`) : raw.length;
    return raw.slice(contentStart, end === -1 ? raw.length : end).trim();
  };

  return {
    imagePrompt: extract("IMAGE PROMPT (Nano Banana / Flux)", "VIDEO PROMPT"),
    videoPrompt: extract("VIDEO PROMPT (VEO / Kling)", "VOICE SCRIPT"),
    voiceScript: extract("VOICE SCRIPT (ElevenLabs)", "ELEVENLABS NOTES"),
    elevenLabsNotes: extract("ELEVENLABS NOTES"),
  };
}
