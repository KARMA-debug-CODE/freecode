export type Difficulty = "Easy" | "Medium" | "Hard";
export type Language = "python" | "javascript";

/**
 * How a returned value is compared with the expected value.
 * - exact: deep equality
 * - unordered: top-level array order does not matter
 * - nested-unordered: order ignored at both levels (e.g. list of groups)
 */
export type CompareMode = "exact" | "unordered" | "nested-unordered";

export interface TestCase {
  args: unknown[];
  expected: unknown;
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  id: number;
  slug: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  description: string;
  examples: Example[];
  constraints: string[];
  hints?: string[];
  entry: Record<Language, string>;
  starter: Record<Language, string>;
  solution: Record<Language, string>;
  compare?: CompareMode;
  /** The first `sampleCount` tests are visible and used by "Run". All tests are used by "Submit". */
  sampleCount: number;
  tests: TestCase[];
}
