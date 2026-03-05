import chalk from "chalk";
import ora from "ora";
import { BriefSchema, type Brief } from "../schemas/brief.js";
import { generateScripts } from "../lib/claude.js";
import { scoreScript, formatQualityReport } from "../lib/quality.js";
import { saveScripts } from "../lib/files.js";
import { loadBrief } from "../lib/files.js";

export async function scriptCommand(options: {
  product?: string;
  audience?: string;
  job?: string;
  formula?: string;
  variants?: string;
  brief?: string;
}): Promise<void> {
  let brief: Brief;

  if (options.brief) {
    const raw = loadBrief(options.brief);
    const result = BriefSchema.safeParse(raw);
    if (!result.success) {
      console.error(chalk.red("Invalid brief file:"), result.error.format());
      process.exit(1);
    }
    brief = result.data;
  } else {
    const result = BriefSchema.safeParse({
      product: options.product,
      audience: options.audience,
      job: options.job ?? `UGC ad script for ${options.product}`,
      formula: options.formula ?? "testimonial",
      variants: options.variants ? parseInt(options.variants) : 3,
    });

    if (!result.success) {
      console.error(chalk.red("Missing required fields:"), result.error.format());
      console.error(chalk.yellow("Required: --product, --audience"));
      process.exit(1);
    }
    brief = result.data;
  }

  console.log(chalk.bold("\nClaudeMobile — Script Generator"));
  console.log(chalk.gray(`Product: ${brief.product}`));
  console.log(chalk.gray(`Formula: ${brief.formula} · ${brief.variants} variants\n`));

  const spinner = ora("Generating scripts...").start();

  let scripts: string[];
  try {
    scripts = await generateScripts(brief);
    spinner.succeed(`Generated ${scripts.length} script(s)`);
  } catch (err) {
    spinner.fail("Script generation failed");
    console.error(chalk.red(String(err)));
    process.exit(1);
  }

  const scores = scripts.map((s) => scoreScript(s));

  // Print each script with its quality report
  scripts.forEach((script, i) => {
    const score = scores[i]!;
    const header = score.passed
      ? chalk.green(`\n── Script ${i + 1} ──────────────────────────`)
      : chalk.yellow(`\n── Script ${i + 1} ──────────────────────────`);

    console.log(header);
    console.log(script);
    console.log("\n" + formatQualityReport(score));
  });

  // Save to disk
  const saved = saveScripts(brief, scripts, scores);
  console.log(chalk.gray(`\nSaved → ${saved}`));

  // Highlight winner
  const best = scores.reduce((bestIdx, s, i) =>
    s.score > (scores[bestIdx]?.score ?? 0) ? i : bestIdx, 0);

  console.log(
    chalk.bold(`\nBest script: #${best + 1} (${scores[best]?.score ?? 0}/100)`)
  );
  console.log(
    chalk.cyan("Run with --run flag to generate full pipeline assets for the best script.")
  );
}
