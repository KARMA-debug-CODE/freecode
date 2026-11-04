import { easyProblems } from "./easy";
import { hardProblems } from "./hard";
import { mediumProblems } from "./medium";
import type { Problem } from "./types";

export * from "./types";

export const problems: Problem[] = [...easyProblems, ...mediumProblems, ...hardProblems].sort((a, b) => a.id - b.id);

export function getProblem(slug: string): Problem | undefined {
  return problems.find((p) => p.slug === slug);
}

export const allTags: string[] = Array.from(new Set(problems.flatMap((p) => p.tags))).sort();

/** Deterministic "problem of the day" based on the local calendar date. */
export function dailyProblem(date = new Date()): Problem {
  const key = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  let h = key;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = (h ^ (h >>> 16)) >>> 0;
  return problems[h % problems.length];
}
