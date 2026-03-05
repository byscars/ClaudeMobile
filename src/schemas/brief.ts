import { z } from "zod";

export const BriefSchema = z.object({
  // Who the content is for
  audience: z.string().min(1, "Audience is required"),

  // Product/service being promoted
  product: z.string().min(1, "Product is required"),

  // What to produce and its specs
  job: z.string().min(1, "Job description is required"),

  // UGC formula to use
  formula: z
    .enum([
      "testimonial",
      "problem-solution",
      "product-review",
      "grwm",
      "comparison",
    ])
    .default("testimonial"),

  // Voice/tone reference (describe or link)
  voiceRef: z.string().optional(),

  // Hard constraints (things to avoid, max length, platform, etc.)
  constraints: z.string().optional(),

  // What good looks like
  successCriteria: z.string().optional(),

  // Number of script variants to generate
  variants: z.number().int().min(1).max(5).default(3),
});

export type Brief = z.infer<typeof BriefSchema>;

export const FORMULA_GUIDES: Record<Brief["formula"], string> = {
  testimonial:
    'Open with "I was skeptical but…". Personal story arc. Specific before/after detail. Casual language, imperfect grammar ok.',
  "problem-solution":
    "Lead with the pain point in first sentence. Agitate it briefly. Introduce product as the fix. Show result.",
  "product-review":
    "Unboxing feel. What you liked. One small honest complaint (builds trust). Net positive verdict.",
  grwm: "Routine-style narration. Product woven into daily habit. Conversational, slice-of-life tone.",
  comparison:
    "Was using X before. Tried this. Here's the difference. Specific contrast points.",
};
