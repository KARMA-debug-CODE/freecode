/* Runs user Python inside a worker using Pyodide (CPython compiled to WebAssembly). */
importScripts("/runners/compare.js");
importScripts("https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.js");

let pyodideReady = loadPyodide();

const HARNESS = `
import json, sys, io, time, traceback

def __fc_run(code, entry, tests_json):
    ns = {}
    exec(compile(code, "solution.py", "exec"), ns)
    if "Solution" in ns:
        target = getattr(ns["Solution"](), entry, None)
    else:
        target = ns.get(entry)
    if target is None:
        raise NameError(f'Method "{entry}" not found. Keep the class Solution and the method name.')
    out = []
    for t in json.loads(tests_json):
        buf = io.StringIO()
        old = sys.stdout
        sys.stdout = buf
        start = time.perf_counter()
        try:
            actual = target(*t["args"])
            ms = (time.perf_counter() - start) * 1000
            out.append({"ok": True, "actual": actual, "ms": ms, "stdout": buf.getvalue()})
        except Exception as e:
            ms = (time.perf_counter() - start) * 1000
            tb = traceback.format_exc().splitlines()
            out.append({"ok": False, "error": tb[-1] if tb else str(e), "ms": ms, "stdout": buf.getvalue()})
        finally:
            sys.stdout = old
    return json.dumps(out)
`;

self.onmessage = async (e) => {
  const { code, entry, tests, compare } = e.data;
  try {
    const pyodide = await pyodideReady;
    pyodide.runPython(HARNESS);
    const run = pyodide.globals.get("__fc_run");
    let raw;
    try {
      raw = run(code, entry, JSON.stringify(tests));
    } finally {
      run.destroy();
    }
    const out = JSON.parse(raw);
    const results = out.map((r, i) =>
      r.ok
        ? { passed: isEqual(r.actual, tests[i].expected, compare), actual: r.actual, ms: r.ms, stdout: r.stdout.replace(/\n$/, "") }
        : { passed: false, error: r.error, ms: r.ms, stdout: r.stdout.replace(/\n$/, "") }
    );
    self.postMessage({ type: "done", results });
  } catch (err) {
    const msg = String(err && err.message ? err.message : err);
    const lines = msg.trim().split("\n");
    self.postMessage({ type: "error", error: lines.slice(-3).join("\n") });
  }
};

self.postMessage({ type: "loading" });
pyodideReady.then(() => self.postMessage({ type: "ready" })).catch((err) => self.postMessage({ type: "error", error: "Failed to load Python runtime: " + err }));
