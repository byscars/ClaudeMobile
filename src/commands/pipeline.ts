import chalk from "chalk";
import ora from "ora";
import fs from "fs";
import { BriefSchema, type Brief } from "../schemas/brief.js";
import { generateScripts, generatePipelineAssets } from "../lib/claude.js";
import { scoreScript, formatQualityReport } from "../lib/quality.js";
import { savePipeline, loadBrief } from "../lib/files.js";

export async function pipelineCommand(options: {
  product?: string;
  audience?: string;
  job?: string;
  formula?: string;
  brief?: string;
  script?: string;
}): Promise<void> {
  let brief: Brief;
  let winningScript: string;

  if (options.brief) {
    const raw = loadBrief(options.brief);
    const result = BriefSchema.safeParse(raw);
    if (!result.success) {
      console.error(chalk.red("Invalid brief:"), result.error.format());
      process.exit(1);
    }
    brief = result.data;
  } else {
    const result = BriefSchema.safeParse({
      product: options.product,
      audience: options.audience,
      job: options.job ?? `UGC ad script for ${options.product}`,
      formula: options.formula ?? "testimonial",
      variants: 3,
    });

    if (!result.success) {
      console.error(chalk.red("Missing required fields:"), result.error.format());
      console.error(chalk.yellow("Required: --product, --audience  (or --brief <file>)"));
      process.exit(1);
    }
    brief = result.data;
  }

  console.log(chalk.bold("\nClaudeMobile — Full Pipeline"));
  console.log(chalk.gray(`Product: ${brief.product} · Formula: ${brief.formula}\n`));

  // Step 1: Script (or load provided)
  if (options.script) {
    winningScript = fs.readFileSync(options.script, "utf-8");
    console.log(chalk.green("✓ Loaded script from file"));
  } else {
    const scriptSpinner = ora("Step 1/2 — Generating & scoring scripts...").start();
    let scripts: string[];

    try {
      scripts = await generateScripts(brief);
      scriptSpinner.succeed(`Generated ${scripts.length} scripts`);
    } catch (err) {
      scriptSpinner.fail("Script generation failed");
      console.error(chalk.red(String(err)));
      process.exit(1);
    }

    const scores = scripts.map((s) => scoreScript(s));
    const bestIdx = scores.reduce(
      (best, s, i) => (s.score > (scores[best]?.score ?? 0) ? i : best),
      0
    );

    winningScript = scripts[bestIdx] ?? scripts[0] ?? "";
    const bestScore = scores[bestIdx];

    console.log(chalk.gray(`Best script: #${bestIdx + 1} (${bestScore?.score ?? 0}/100)`));
    if (bestScore) console.log(formatQualityReport(bestScore));
    console.log("\n" + chalk.bold("Selected script:"));
    console.log(winningScript);
  }

  // Step 2: Generate pipeline assets
  const assetSpinner = ora("\nStep 2/2 — Generating pipeline assets...").start();
  let assets: Awaited<ReturnType<typeof generatePipelineAssets>>;

  try {
    assets = await generatePipelineAssets(brief, winningScript);
    assetSpinner.succeed("Pipeline assets ready");
  } catch (err) {
    assetSpinner.fail("Asset generation failed");
    console.error(chalk.red(String(err)));
    process.exit(1);
  }

  // Print assets
  console.log(chalk.bold("\n── Image Prompt (Nano Banana / Flux) ──"));
  console.log(assets.imagePrompt);

  console.log(chalk.bold("\n── Video Prompt (VEO / Kling) ──"));
  console.log(assets.videoPrompt);

  console.log(chalk.bold("\n── Voice Script (ElevenLabs) ──"));
  console.log(assets.voiceScript);

  console.log(chalk.bold("\n── ElevenLabs Notes ──"));
  console.log(assets.elevenLabsNotes);

  // Save to disk
  const pipelineDir = savePipeline(brief, winningScript, assets);

  console.log(chalk.green(`\n✓ Pipeline saved → ${pipelineDir}`));
  console.log(chalk.gray("Each file is ready to paste directly into the relevant tool."));
  console.log(chalk.gray("See README.md in the pipeline folder for next steps."));
}
