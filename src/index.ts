#!/usr/bin/env node
import "dotenv/config";
import { Command } from "commander";
import chalk from "chalk";
import { scriptCommand } from "./commands/script.js";
import { pipelineCommand } from "./commands/pipeline.js";

const program = new Command();

program
  .name("cm")
  .description("ClaudeMobile — AI UGC content production CLI")
  .version("1.0.0");

program
  .command("script")
  .description("Generate UGC scripts from a brief")
  .option("-p, --product <product>", "Product or service name")
  .option("-a, --audience <audience>", "Target audience description")
  .option("-j, --job <job>", "Job/deliverable description")
  .option(
    "-f, --formula <formula>",
    "UGC formula: testimonial | problem-solution | product-review | grwm | comparison",
    "testimonial"
  )
  .option("-v, --variants <number>", "Number of script variants to generate", "3")
  .option("-b, --brief <file>", "Load brief from JSON file")
  .action(scriptCommand);

program
  .command("pipeline")
  .description("Run full pipeline: script + image/video/VO prompts")
  .option("-p, --product <product>", "Product or service name")
  .option("-a, --audience <audience>", "Target audience description")
  .option("-j, --job <job>", "Job/deliverable description")
  .option(
    "-f, --formula <formula>",
    "UGC formula: testimonial | problem-solution | product-review | grwm | comparison",
    "testimonial"
  )
  .option("-b, --brief <file>", "Load brief from JSON file")
  .option("-s, --script <file>", "Use existing script file instead of generating")
  .action(pipelineCommand);

program.on("--help", () => {
  console.log("");
  console.log(chalk.bold("Examples:"));
  console.log("");
  console.log("  # Generate 3 testimonial scripts");
  console.log(
    '  $ cm script --product "AthleteX protein" --audience "gym bros 22-35" --variants 3'
  );
  console.log("");
  console.log("  # Full pipeline from a brief file");
  console.log("  $ cm pipeline --brief briefs/my-product.json");
  console.log("");
  console.log("  # Full pipeline inline");
  console.log(
    '  $ cm pipeline --product "SkincareX serum" --audience "women 28-45 skincare enthusiasts" --formula product-review'
  );
  console.log("");
  console.log(chalk.bold("Brief JSON format:"));
  console.log(
    JSON.stringify(
      {
        product: "Your product name",
        audience: "Ultra-specific audience description",
        job: "30s UGC testimonial for TikTok",
        formula: "testimonial",
        variants: 3,
        voiceRef: "Casual, Gen Z, sounds like a real person texting",
        constraints: "No price mentions. Under 120 words.",
        successCriteria: "Hook lands in first sentence. Contains one specific detail.",
      },
      null,
      2
    )
  );
});

program.parse(process.argv);
