import fs from "fs";
import path from "path";
import { type Brief } from "../schemas/brief.js";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 40);
}

export function timestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, "-").slice(0, 16);
}

export function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

export function saveScripts(
  brief: Brief,
  scripts: string[],
  scores: Array<{ score: number; passed: boolean }>
): string {
  const dir = path.resolve("output/scripts");
  ensureDir(dir);

  const slug = slugify(brief.product);
  const ts = timestamp();
  const filename = `${ts}-${slug}-${brief.formula}.md`;
  const filepath = path.join(dir, filename);

  const lines = [
    `# Scripts: ${brief.product}`,
    `**Date:** ${new Date().toLocaleDateString()}`,
    `**Formula:** ${brief.formula}`,
    `**Audience:** ${brief.audience}`,
    `**Job:** ${brief.job}`,
    "",
    "---",
    "",
  ];

  scripts.forEach((script, i) => {
    const score = scores[i];
    const status = score ? `${score.passed ? "PASS" : "FAIL"} (${score.score}/100)` : "unscored";
    lines.push(`## Script ${i + 1} — ${status}`, "", script, "", "---", "");
  });

  fs.writeFileSync(filepath, lines.join("\n"), "utf-8");
  return filepath;
}

export function savePipeline(
  brief: Brief,
  script: string,
  assets: {
    imagePrompt: string;
    videoPrompt: string;
    voiceScript: string;
    elevenLabsNotes: string;
  }
): string {
  const dir = path.resolve("output/pipelines");
  ensureDir(dir);

  const slug = slugify(brief.product);
  const ts = timestamp();
  const pipelineDir = path.join(dir, `${ts}-${slug}`);
  ensureDir(pipelineDir);

  // Save each asset as its own file for easy copy-paste into tools
  fs.writeFileSync(path.join(pipelineDir, "01-script.md"), script, "utf-8");
  fs.writeFileSync(path.join(pipelineDir, "02-image-prompt.txt"), assets.imagePrompt, "utf-8");
  fs.writeFileSync(path.join(pipelineDir, "03-video-prompt.txt"), assets.videoPrompt, "utf-8");
  fs.writeFileSync(path.join(pipelineDir, "04-voice-script.txt"), assets.voiceScript, "utf-8");
  fs.writeFileSync(path.join(pipelineDir, "05-elevenlabs-notes.txt"), assets.elevenLabsNotes, "utf-8");

  // Save brief for re-running or reference
  fs.writeFileSync(
    path.join(pipelineDir, "brief.json"),
    JSON.stringify(brief, null, 2),
    "utf-8"
  );

  // Save a summary README
  const summary = [
    `# Pipeline: ${brief.product}`,
    `**Date:** ${new Date().toLocaleDateString()}`,
    "",
    "## Files",
    "| File | Purpose | Paste into |",
    "|------|---------|------------|",
    "| 01-script.md | Final UGC script | Review/edit |",
    "| 02-image-prompt.txt | Character + scene | Nano Banana / Flux |",
    "| 03-video-prompt.txt | Director prompt | VEO / Kling / Sora |",
    "| 04-voice-script.txt | TTS-formatted script | ElevenLabs |",
    "| 05-elevenlabs-notes.txt | Voice style guide | ElevenLabs settings |",
    "",
    "## Pipeline Steps",
    "1. Generate image in **Nano Banana** using `02-image-prompt.txt`",
    "2. Animate best still in **VEO** or **Kling** using `03-video-prompt.txt`",
    "3. Generate voiceover in **ElevenLabs** using `04-voice-script.txt` + notes",
    "4. Enhance audio in **Adobe Podcast**",
    "5. Upscale video in **Topaz Video AI**",
    "6. Edit in **CapCut**: fast cuts, captions, music",
    "7. Run against quality checklist before publishing",
  ].join("\n");

  fs.writeFileSync(path.join(pipelineDir, "README.md"), summary, "utf-8");

  return pipelineDir;
}

export function loadBrief(filepath: string): unknown {
  const raw = fs.readFileSync(filepath, "utf-8");
  return JSON.parse(raw);
}
