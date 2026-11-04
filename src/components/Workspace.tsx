"use client";

import Editor, { type OnMount } from "@monaco-editor/react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import DifficultyBadge from "./DifficultyBadge";
import type { Language, Problem, TestCase } from "@/lib/problems/types";
import { clearCode, loadCode, recordSubmission, saveCode, useProgress, type Verdict } from "@/lib/progress";
import { onPythonReady, runCode, warmUp, type RunOutcome } from "@/lib/runner";

const LANGS: { id: Language; label: string }[] = [
  { id: "python", label: "Python 3" },
  { id: "javascript", label: "JavaScript" },
];
const LANG_KEY = "freecode:lang";

type LeftTab = "description" | "submissions" | "solution";
type BottomTab = "testcase" | "result";

interface RunState {
  mode: "run" | "submit";
  outcome: RunOutcome;
  tests: TestCase[];
}

function paramNames(problem: Problem): string[] {
  const m = problem.starter.javascript.match(/function\s+\w+\s*\(([^)]*)\)/);
  return m ? m[1].split(",").map((s) => s.trim()).filter(Boolean) : [];
}

const show = (v: unknown) => JSON.stringify(v);

function verdictOf(outcome: RunOutcome): Verdict {
  if (outcome.kind === "timeout") return "Time Limit Exceeded";
  if (outcome.kind === "compile-error") return "Runtime Error";
  if (outcome.results.some((r) => r.error)) return "Runtime Error";
  return outcome.results.every((r) => r.passed) ? "Accepted" : "Wrong Answer";
}

export default function Workspace({ problem, prevSlug, nextSlug }: { problem: Problem; prevSlug: string | null; nextSlug: string | null }) {
  const [lang, setLang] = useState<Language>("python");
  const [code, setCode] = useState<string>(problem.starter.python);
  const [leftTab, setLeftTab] = useState<LeftTab>("description");
  const [bottomTab, setBottomTab] = useState<BottomTab>("testcase");
  const [caseIdx, setCaseIdx] = useState(0);
  const [running, setRunning] = useState<null | "run" | "submit">(null);
  const [run, setRun] = useState<RunState | null>(null);
  const [pyReady, setPyReady] = useState(false);
  const [leftWidth, setLeftWidth] = useState(45);
  const [showSolution, setShowSolution] = useState(false);
  const [openHints, setOpenHints] = useState<Record<number, boolean>>({});
  const progress = useProgress();
  const runRef = useRef<(mode: "run" | "submit") => void>(() => {});

  useEffect(() => {
    const saved = (localStorage.getItem(LANG_KEY) as Language | null) ?? "python";
    setLang(saved);
    setCode(loadCode(problem.slug, saved) ?? problem.starter[saved]);
    setRun(null);
    setCaseIdx(0);
    setShowSolution(false);
    setOpenHints({});
    setLeftTab("description");
    setBottomTab("testcase");
  }, [problem]);

  useEffect(() => {
    warmUp("python");
    return onPythonReady(setPyReady);
  }, []);

  const changeLang = (l: Language) => {
    localStorage.setItem(LANG_KEY, l);
    setLang(l);
    setCode(loadCode(problem.slug, l) ?? problem.starter[l]);
  };

  const onChange = (v: string | undefined) => {
    const next = v ?? "";
    setCode(next);
    saveCode(problem.slug, lang, next);
  };

  const reset = () => {
    if (!confirm("Reset your code to the starter template?")) return;
    clearCode(problem.slug, lang);
    setCode(problem.starter[lang]);
  };

  const execute = useCallback(
    async (mode: "run" | "submit") => {
      if (running) return;
      setRunning(mode);
      setBottomTab("result");
      const tests = mode === "run" ? problem.tests.slice(0, problem.sampleCount) : problem.tests;
      const outcome = await runCode(lang, code, problem.entry[lang], tests, problem.compare);
      setRun({ mode, outcome, tests });
      if (outcome.kind === "results") {
        const firstFail = outcome.results.findIndex((r) => !r.passed);
        setCaseIdx(firstFail >= 0 ? firstFail : 0);
      }
      if (mode === "submit") {
        const passed = outcome.kind === "results" ? outcome.results.filter((r) => r.passed).length : 0;
        const ms = outcome.kind === "results" ? outcome.results.reduce((a, r) => a + r.ms, 0) : 0;
        recordSubmission({ slug: problem.slug, language: lang, verdict: verdictOf(outcome), passed, total: tests.length, ms, at: Date.now(), code });
      }
      setRunning(null);
    },
    [running, problem, lang, code]
  );
  runRef.current = execute;

  const onMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => runRef.current("run"));
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => runRef.current("submit"));
  };

  const startDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    const onMove = (ev: MouseEvent) => setLeftWidth(Math.min(75, Math.max(25, (ev.clientX / window.innerWidth) * 100)));
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const names = paramNames(problem);
  const mySubs = progress.submissions.filter((s) => s.slug === problem.slug);
  const waitingForPython = lang === "python" && !pyReady;

  return (
    <div className="flex-1 flex flex-col lg:flex-row min-h-0 lg:h-[calc(100vh-3rem)] lg:flex-none p-2 gap-0">
      {/* Left panel */}
      <section className="bg-panel rounded-lg border border-line flex flex-col min-h-0 lg:h-full h-[50vh]" style={{ flexBasis: `${leftWidth}%` }}>
        <div className="flex items-center gap-1 px-2 h-10 border-b border-line text-sm shrink-0">
          {(["description", "submissions", "solution"] as LeftTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setLeftTab(t)}
              className={`px-3 py-1 rounded capitalize ${leftTab === t ? "bg-panel-2 text-white" : "text-muted hover:text-white"}`}
            >
              {t}
            </button>
          ))}
          <div className="ml-auto flex gap-1">
            <NavBtn slug={prevSlug} label="&#8249;" title="Previous problem" />
            <NavBtn slug={nextSlug} label="&#8250;" title="Next problem" />
          </div>
        </div>
        <div className="overflow-y-auto p-5 min-h-0 flex-1">
          {leftTab === "description" && (
            <article>
              <h1 className="text-2xl font-semibold">
                {problem.id}. {problem.title}
              </h1>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <DifficultyBadge d={problem.difficulty} pill />
                {progress.solved[problem.slug] && <span className="text-easy text-xs">&#10003; Solved</span>}
                {problem.tags.map((t) => (
                  <span key={t} className="text-xs text-muted bg-panel-2 rounded-full px-2.5 py-0.5">
                    {t}
                  </span>
                ))}
              </div>
              <div className="prose-fc mt-4 text-[15px]">
                <ReactMarkdown>{problem.description}</ReactMarkdown>
              </div>
              {problem.examples.map((ex, i) => (
                <div key={i} className="mt-5">
                  <div className="font-semibold text-sm">Example {i + 1}:</div>
                  <div className="mt-2 border-l-2 border-line pl-4 font-mono text-[13px] space-y-1">
                    <div>
                      <span className="text-muted">Input: </span>
                      {ex.input}
                    </div>
                    <div>
                      <span className="text-muted">Output: </span>
                      {ex.output}
                    </div>
                    {ex.explanation && (
                      <div className="font-sans text-sm prose-fc">
                        <span className="text-muted">Explanation: </span>
                        <ReactMarkdown components={{ p: ({ children }) => <span>{children}</span> }}>{ex.explanation}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div className="mt-6">
                <div className="font-semibold text-sm">Constraints:</div>
                <ul className="list-disc pl-6 mt-2 text-sm space-y-1">
                  {problem.constraints.map((c) => (
                    <li key={c}>
                      <code className="font-mono text-[13px] bg-panel-2 rounded px-1">{c}</code>
                    </li>
                  ))}
                </ul>
              </div>
              {problem.hints && problem.hints.length > 0 && (
                <div className="mt-6 border-t border-line">
                  {problem.hints.map((h, i) => (
                    <div key={i} className="border-b border-line">
                      <button onClick={() => setOpenHints((o) => ({ ...o, [i]: !o[i] }))} className="w-full text-left py-3 text-sm flex justify-between">
                        <span>Hint {i + 1}</span>
                        <span className="text-muted">{openHints[i] ? "−" : "+"}</span>
                      </button>
                      {openHints[i] && <div className="pb-3 text-sm text-muted">{h}</div>}
                    </div>
                  ))}
                </div>
              )}
            </article>
          )}
          {leftTab === "submissions" && (
            <div className="text-sm">
              {mySubs.length === 0 ? (
                <p className="text-muted">No submissions yet. Press Submit to run your code against every test.</p>
              ) : (
                <table className="w-full">
                  <thead className="text-muted text-left">
                    <tr>
                      <th className="py-2 font-normal">Status</th>
                      <th className="py-2 font-normal">Language</th>
                      <th className="py-2 font-normal">Tests</th>
                      <th className="py-2 font-normal">When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mySubs.map((s) => (
                      <tr key={s.at} className="border-t border-line">
                        <td className={`py-2 ${s.verdict === "Accepted" ? "text-easy" : "text-hard"}`}>
                          <button
                            className="hover:underline"
                            title="Load this code into the editor"
                            onClick={() => {
                              changeLang(s.language);
                              setCode(s.code);
                              saveCode(problem.slug, s.language, s.code);
                            }}
                          >
                            {s.verdict}
                          </button>
                        </td>
                        <td className="py-2">{LANGS.find((l) => l.id === s.language)?.label}</td>
                        <td className="py-2 tabular-nums">
                          {s.passed}/{s.total}
                        </td>
                        <td className="py-2 text-muted">{new Date(s.at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
          {leftTab === "solution" && (
            <div>
              {!showSolution ? (
                <div className="text-center py-10">
                  <p className="text-muted text-sm mb-4">Try solving it yourself first. Looking at the answer too early takes away most of the learning.</p>
                  <button onClick={() => setShowSolution(true)} className="bg-panel-2 hover:bg-line px-4 py-2 rounded-md text-sm">
                    Show reference solution
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {LANGS.map((l) => (
                    <div key={l.id}>
                      <div className="text-sm font-semibold mb-2">{l.label}</div>
                      <pre className="bg-[#1e1e1e] border border-line rounded-md p-4 text-[13px] font-mono overflow-x-auto">{problem.solution[l.id]}</pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <div onMouseDown={startDrag} className="hidden lg:block w-2 cursor-col-resize hover:bg-brand/40 rounded shrink-0" />

      {/* Right panel */}
      <section className="flex-1 flex flex-col gap-2 min-h-0 min-w-0 mt-2 lg:mt-0">
        <div className="bg-panel rounded-lg border border-line flex flex-col min-h-0 h-[60vh] lg:h-auto lg:flex-[3]">
          <div className="flex items-center gap-2 px-2 h-10 border-b border-line shrink-0">
            <select
              aria-label="Language"
              value={lang}
              onChange={(e) => changeLang(e.target.value as Language)}
              className="bg-panel-2 rounded px-2 py-1 text-sm outline-none"
            >
              {LANGS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
            {waitingForPython && <span className="text-xs text-muted">Loading Python runtime…</span>}
            <div className="ml-auto flex items-center gap-2">
              <button onClick={reset} className="text-muted hover:text-white text-sm px-2" title="Reset to starter code">
                Reset
              </button>
              <button
                onClick={() => execute("run")}
                disabled={!!running}
                title="Run sample tests (Ctrl+Enter)"
                className="bg-panel-2 hover:bg-line disabled:opacity-50 px-4 py-1 rounded text-sm"
              >
                {running === "run" ? "Running…" : "Run"}
              </button>
              <button
                onClick={() => execute("submit")}
                disabled={!!running}
                title="Submit against all tests (Ctrl+Shift+Enter)"
                className="bg-easy/90 hover:bg-easy text-white disabled:opacity-50 px-4 py-1 rounded text-sm font-medium"
              >
                {running === "submit" ? "Judging…" : "Submit"}
              </button>
            </div>
          </div>
          <div className="flex-1 min-h-[240px]">
            <Editor
              key={`${problem.slug}:${lang}`}
              language={lang}
              theme="vs-dark"
              value={code}
              onChange={onChange}
              onMount={onMount}
              options={{ fontSize: 14, minimap: { enabled: false }, scrollBeyondLastLine: false, tabSize: lang === "python" ? 4 : 2, automaticLayout: true }}
            />
          </div>
        </div>

        <div className="bg-panel rounded-lg border border-line flex flex-col min-h-0 h-[45vh] lg:h-auto lg:flex-[2]">
          <div className="flex items-center gap-1 px-2 h-10 border-b border-line text-sm shrink-0">
            {(["testcase", "result"] as BottomTab[]).map((t) => (
              <button
                key={t}
                onClick={() => setBottomTab(t)}
                className={`px-3 py-1 rounded ${bottomTab === t ? "bg-panel-2 text-white" : "text-muted hover:text-white"}`}
              >
                {t === "testcase" ? "Testcase" : "Test Result"}
              </button>
            ))}
          </div>
          <div className="overflow-y-auto p-4 min-h-0 flex-1 text-sm">
            {bottomTab === "testcase" && (
              <CaseView tests={problem.tests.slice(0, problem.sampleCount)} names={names} idx={Math.min(caseIdx, problem.sampleCount - 1)} setIdx={setCaseIdx} />
            )}
            {bottomTab === "result" && <ResultView run={run} running={running} names={names} idx={caseIdx} setIdx={setCaseIdx} waitingForPython={waitingForPython} />}
          </div>
        </div>
      </section>
    </div>
  );
}

function NavBtn({ slug, label, title }: { slug: string | null; label: string; title: string }) {
  const cls = "w-7 h-7 flex items-center justify-center rounded text-lg";
  if (!slug) return <span className={`${cls} text-line`} dangerouslySetInnerHTML={{ __html: label }} />;
  return <Link href={`/problems/${slug}`} title={title} className={`${cls} text-muted hover:text-white hover:bg-panel-2`} dangerouslySetInnerHTML={{ __html: label }} />;
}

function CaseTabs({ n, idx, setIdx, status }: { n: number; idx: number; setIdx: (i: number) => void; status?: boolean[] }) {
  return (
    <div className="flex gap-2 flex-wrap mb-3">
      {Array.from({ length: n }, (_, i) => (
        <button key={i} onClick={() => setIdx(i)} className={`px-3 py-1 rounded text-sm flex items-center gap-1.5 ${idx === i ? "bg-panel-2 text-white" : "text-muted hover:bg-panel-2/60"}`}>
          {status && <span className={`w-1.5 h-1.5 rounded-full ${status[i] ? "bg-easy" : "bg-hard"}`} />}
          Case {i + 1}
        </button>
      ))}
    </div>
  );
}

function Field({ label, value, tone }: { label: string; value: string; tone?: "ok" | "bad" }) {
  return (
    <div className="mb-3">
      <div className="text-xs text-muted mb-1">{label}</div>
      <pre className={`bg-panel-2 rounded-md px-3 py-2 font-mono text-[13px] whitespace-pre-wrap break-all max-h-60 overflow-auto ${tone === "bad" ? "text-hard" : tone === "ok" ? "text-easy" : ""}`}>{value}</pre>
    </div>
  );
}

function CaseView({ tests, names, idx, setIdx }: { tests: TestCase[]; names: string[]; idx: number; setIdx: (i: number) => void }) {
  const t = tests[idx];
  return (
    <div>
      <CaseTabs n={tests.length} idx={idx} setIdx={setIdx} />
      {t.args.map((a, i) => (
        <Field key={i} label={`${names[i] ?? `arg${i + 1}`} =`} value={show(a)} />
      ))}
    </div>
  );
}

function ResultView({
  run,
  running,
  names,
  idx,
  setIdx,
  waitingForPython,
}: {
  run: RunState | null;
  running: null | "run" | "submit";
  names: string[];
  idx: number;
  setIdx: (i: number) => void;
  waitingForPython: boolean;
}) {
  if (running) return <div className="text-muted">{waitingForPython ? "Loading the Python runtime (first run only)…" : "Running your code…"}</div>;
  if (!run) return <div className="text-muted">Run your code to see results here.</div>;
  const { outcome, tests, mode } = run;
  if (outcome.kind === "timeout")
    return (
      <div>
        <h3 className="text-hard text-lg font-semibold">Time Limit Exceeded</h3>
        <p className="text-muted mt-2">Your code ran too long. Look for an infinite loop or a slow algorithm.</p>
      </div>
    );
  if (outcome.kind === "compile-error")
    return (
      <div>
        <h3 className="text-hard text-lg font-semibold">Error</h3>
        <pre className="mt-3 bg-hard/10 text-hard rounded-md p-3 font-mono text-[13px] whitespace-pre-wrap">{outcome.error}</pre>
      </div>
    );

  const results = outcome.results;
  const verdict = verdictOf(outcome);
  const passed = results.filter((r) => r.passed).length;
  const totalMs = results.reduce((a, r) => a + r.ms, 0);

  // On submit, show only the first failing case (hidden tests stay mostly hidden).
  const visible = mode === "submit" ? (verdict === "Accepted" ? [] : [results.findIndex((r) => !r.passed)]) : results.map((_, i) => i);
  const cur = mode === "submit" ? visible[0] : Math.min(idx, results.length - 1);
  const r = cur !== undefined ? results[cur] : undefined;
  const t = cur !== undefined ? tests[cur] : undefined;

  return (
    <div>
      <div className="flex items-baseline gap-3 mb-3">
        <h3 className={`text-lg font-semibold ${verdict === "Accepted" ? "text-easy" : "text-hard"}`}>{verdict}</h3>
        <span className="text-muted text-xs">
          {passed}/{results.length} tests passed · {totalMs.toFixed(1)} ms
        </span>
      </div>
      {mode === "run" && <CaseTabs n={results.length} idx={cur!} setIdx={setIdx} status={results.map((x) => x.passed)} />}
      {mode === "submit" && verdict === "Accepted" && <p className="text-muted">All tests passed. Great work! It&apos;s saved to your progress.</p>}
      {r && t && (
        <div>
          {mode === "submit" && <div className="text-xs text-muted mb-2">Failed on test {cur! + 1}:</div>}
          {t.args.map((a, i) => (
            <Field key={i} label={`${names[i] ?? `arg${i + 1}`} =`} value={show(a)} />
          ))}
          {r.error ? <Field label="Error" value={r.error} tone="bad" /> : <Field label="Output" value={show(r.actual)} tone={r.passed ? undefined : "bad"} />}
          <Field label="Expected" value={show(t.expected)} tone="ok" />
          {r.stdout && <Field label="Stdout" value={r.stdout} />}
        </div>
      )}
    </div>
  );
}
