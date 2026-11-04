"use client";

import type { CompareMode, Language, TestCase } from "./problems/types";

export interface TestResult {
  passed: boolean;
  actual?: unknown;
  error?: string;
  ms: number;
  stdout: string;
}

export type RunOutcome =
  | { kind: "results"; results: TestResult[] }
  | { kind: "compile-error"; error: string }
  | { kind: "timeout" };

const TIME_LIMIT_MS: Record<Language, number> = { javascript: 4000, python: 8000 };
const workers: Partial<Record<Language, Worker>> = {};
const pyStatus = { ready: false, listeners: new Set<(ready: boolean) => void>() };

function clip(s: string, max = 10_000): string {
  return s.length > max ? s.slice(0, max) + "\n… (" + (s.length - max) + " more characters truncated)" : s;
}

function createWorker(lang: Language): Worker {
  const w = new Worker(lang === "python" ? "/runners/py-runner.js" : "/runners/js-runner.js");
  if (lang === "python") {
    pyStatus.ready = false;
    w.addEventListener("message", (e) => {
      if (e.data?.type === "ready") {
        pyStatus.ready = true;
        pyStatus.listeners.forEach((l) => l(true));
      }
    });
  }
  return w;
}

function getWorker(lang: Language): Worker {
  return (workers[lang] ??= createWorker(lang));
}

/** Start downloading the Python runtime early so the first run is fast. */
export function warmUp(lang: Language) {
  getWorker(lang);
}

export function onPythonReady(cb: (ready: boolean) => void): () => void {
  pyStatus.listeners.add(cb);
  cb(pyStatus.ready);
  return () => pyStatus.listeners.delete(cb);
}

export function runCode(
  lang: Language,
  code: string,
  entry: string,
  tests: TestCase[],
  compare: CompareMode = "exact"
): Promise<RunOutcome> {
  const worker = getWorker(lang);
  return new Promise((resolve) => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const startTimer = () => {
      timer = setTimeout(() => {
        worker.removeEventListener("message", onMessage);
        worker.terminate();
        delete workers[lang];
        if (lang === "python") warmUp("python");
        resolve({ kind: "timeout" });
      }, TIME_LIMIT_MS[lang]);
    };
    const onMessage = (e: MessageEvent) => {
      const msg = e.data;
      if (msg.type === "done") {
        clearTimeout(timer);
        worker.removeEventListener("message", onMessage);
        resolve({
          kind: "results",
          results: msg.results.map((result: TestResult) => ({
            ...result,
            stdout: clip(result.stdout),
            error: result.error === undefined ? undefined : clip(result.error),
          })),
        });
      } else if (msg.type === "error") {
        clearTimeout(timer);
        worker.removeEventListener("message", onMessage);
        resolve({ kind: "compile-error", error: clip(msg.error) });
      } else if (msg.type === "ready" && lang === "python" && timer === undefined) {
        startTimer();
      }
    };
    worker.addEventListener("message", onMessage);
    worker.postMessage({ code, entry, tests, compare });
    // Python's time limit starts only once the runtime has finished loading.
    if (lang === "javascript" || pyStatus.ready) startTimer();
  });
}
