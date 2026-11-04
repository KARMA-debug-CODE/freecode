/**
 * Checks every problem: runs the reference solutions (JavaScript in-process, Python via python3)
 * against all tests using the same comparison logic as the browser runners.
 * Usage: npm run verify
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { problems } from "../src/lib/problems";

const ctx: { isEqual?: (a: unknown, b: unknown, mode?: string) => boolean } = {};
vm.createContext(ctx);
vm.runInContext(readFileSync(path.join(__dirname, "../public/runners/compare.js"), "utf8") + "\nthis.isEqual = isEqual;", ctx);
const isEqual = ctx.isEqual!;

const PY_HARNESS = `
import json, sys
data = json.load(sys.stdin)
out = []
for p in data:
    ns = {}
    exec(p["code"], ns)
    target = getattr(ns["Solution"](), p["entry"])
    res = []
    for t in p["tests"]:
        try:
            res.append({"ok": True, "actual": target(*t["args"])})
        except Exception as e:
            res.append({"ok": False, "error": repr(e)})
    out.append(res)
print(json.dumps(out))
`;

let failures = 0;
const fail = (msg: string) => {
  failures++;
  console.error("FAIL " + msg);
};

const ids = new Set<number>();
const slugs = new Set<string>();
for (const p of problems) {
  if (ids.has(p.id)) fail(`duplicate id ${p.id}`);
  if (slugs.has(p.slug)) fail(`duplicate slug ${p.slug}`);
  ids.add(p.id);
  slugs.add(p.slug);
  if (p.sampleCount < 1 || p.sampleCount > p.tests.length) fail(`${p.slug}: bad sampleCount`);
  if (p.examples.length === 0) fail(`${p.slug}: no examples`);

  const fn = new Function(`${p.solution.javascript}\n;return ${p.entry.javascript};`)();
  p.tests.forEach((t, i) => {
    const actual = JSON.parse(JSON.stringify(fn(...JSON.parse(JSON.stringify(t.args)))));
    if (!isEqual(actual, t.expected, p.compare)) fail(`${p.slug} [js] test ${i}: got ${JSON.stringify(actual)}`);
  });
}

const pyOut = JSON.parse(
  execFileSync("python3", ["-c", PY_HARNESS], {
    input: JSON.stringify(problems.map((p) => ({ code: p.solution.python, entry: p.entry.python, tests: p.tests }))),
  }).toString()
);
problems.forEach((p, pi) => {
  pyOut[pi].forEach((r: { ok: boolean; actual?: unknown; error?: string }, i: number) => {
    if (!r.ok) fail(`${p.slug} [py] test ${i}: ${r.error}`);
    else if (!isEqual(r.actual, p.tests[i].expected, p.compare)) fail(`${p.slug} [py] test ${i}: got ${JSON.stringify(r.actual)}`);
  });
});

const total = problems.reduce((n, p) => n + p.tests.length, 0);
console.log(`${problems.length} problems, ${total} tests x 2 languages, ${failures} failures`);
process.exit(failures ? 1 : 0);
