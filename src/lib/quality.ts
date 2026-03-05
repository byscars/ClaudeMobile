export interface QualityResult {
  passed: boolean;
  score: number; // 0–100
  checks: CheckResult[];
}

interface CheckResult {
  name: string;
  passed: boolean;
  note?: string;
}

const HYPE_PATTERNS = [
  /🔥|🚀|💯|⚡|✨|🎯|💪/g,
  /game.?changer/i,
  /revolutionary/i,
  /transform your life/i,
  /\bOMG\b/i,
  /\bAMAZING\b/i,
  /limited time offer/i,
  /act now/i,
  /don't miss out/i,
];

const CORPORATE_PATTERNS = [
  /leverage/i,
  /utilize/i,
  /synergy/i,
  /cutting.?edge/i,
  /best.?in.?class/i,
  /industry.?leading/i,
  /empower/i,
  /holistic approach/i,
];

const SPECIFIC_INDICATORS = [
  /\d+\s*(days?|weeks?|months?|lbs?|pounds?|percent|%|hours?|minutes?)/i,
  /\$\d+/,
  /before and after/i,
  /used to|used it for/i,
  /first time|second week/i,
];

export function scoreScript(script: string): QualityResult {
  const checks: CheckResult[] = [];

  // 1. Length check (75–130 words)
  const wordCount = script.split(/\s+/).filter(Boolean).length;
  const lengthOk = wordCount >= 60 && wordCount <= 150;
  checks.push({
    name: "Length (60–150 words)",
    passed: lengthOk,
    note: `${wordCount} words`,
  });

  // 2. No hype language
  const hypeMatches = HYPE_PATTERNS.flatMap((p) => script.match(p) ?? []);
  const noHype = hypeMatches.length === 0;
  checks.push({
    name: "No hype language",
    passed: noHype,
    note: hypeMatches.length > 0 ? `Found: ${hypeMatches.join(", ")}` : undefined,
  });

  // 3. No corporate speak
  const corpMatches = CORPORATE_PATTERNS.flatMap((p) => script.match(p) ?? []);
  const noCorp = corpMatches.length === 0;
  checks.push({
    name: "No corporate language",
    passed: noCorp,
    note: corpMatches.length > 0 ? `Found: ${corpMatches.join(", ")}` : undefined,
  });

  // 4. Contains specific details
  const hasSpecifics = SPECIFIC_INDICATORS.some((p) => p.test(script));
  checks.push({
    name: "Contains specific details",
    passed: hasSpecifics,
    note: hasSpecifics ? undefined : "Add numbers, timeframes, or concrete results",
  });

  // 5. Has a hook (first sentence short and punchy < 15 words)
  const firstSentence = script.split(/[.!?\n]/)[0] ?? "";
  const firstWordCount = firstSentence.split(/\s+/).filter(Boolean).length;
  const hasHook = firstWordCount > 0 && firstWordCount <= 18;
  checks.push({
    name: "Strong hook (first sentence ≤ 18 words)",
    passed: hasHook,
    note: `First sentence: ${firstWordCount} words`,
  });

  // 6. Conversational tone (contractions present)
  const hasContractions = /\b(i'm|i've|i'd|can't|don't|it's|that's|you're|didn't|wouldn't)\b/i.test(script);
  checks.push({
    name: "Conversational tone (contractions)",
    passed: hasContractions,
    note: hasContractions ? undefined : "Script sounds too formal — add contractions",
  });

  const passedCount = checks.filter((c) => c.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);
  const passed = score >= 67; // Must pass at least 4/6 checks

  return { passed, score, checks };
}

export function formatQualityReport(result: QualityResult): string {
  const statusIcon = result.passed ? "✓" : "✗";
  const lines = [
    `Quality: ${statusIcon} ${result.score}/100${result.passed ? " (PASS)" : " (FAIL)"}`,
  ];

  for (const check of result.checks) {
    const icon = check.passed ? "  ✓" : "  ✗";
    const note = check.note ? ` — ${check.note}` : "";
    lines.push(`${icon} ${check.name}${note}`);
  }

  return lines.join("\n");
}
