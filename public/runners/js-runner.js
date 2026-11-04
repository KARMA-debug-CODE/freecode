/* Runs user JavaScript inside a dedicated worker. */
importScripts("/runners/compare.js");

function fmt(v) {
  try {
    return typeof v === "string" ? v : JSON.stringify(v);
  } catch {
    return String(v);
  }
}

self.onmessage = (e) => {
  const { code, entry, tests, compare } = e.data;
  const results = [];
  let logs = [];
  const fakeConsole = {
    log: (...a) => logs.push(a.map(fmt).join(" ")),
    error: (...a) => logs.push(a.map(fmt).join(" ")),
    warn: (...a) => logs.push(a.map(fmt).join(" ")),
    info: (...a) => logs.push(a.map(fmt).join(" ")),
  };

  let fn;
  try {
    fn = new Function("console", `${code}\n;return typeof ${entry} === "function" ? ${entry} : undefined;`)(fakeConsole);
    if (typeof fn !== "function") throw new Error(`Function "${entry}" is not defined.`);
  } catch (err) {
    self.postMessage({ type: "error", error: String(err && err.stack ? err.message : err) });
    return;
  }

  for (const t of tests) {
    logs = [];
    const args = JSON.parse(JSON.stringify(t.args));
    const start = performance.now();
    try {
      const actual = fn(...args);
      const ms = performance.now() - start;
      const normalized = actual === undefined ? null : JSON.parse(JSON.stringify(actual));
      results.push({ passed: isEqual(normalized, t.expected, compare), actual: normalized, ms, stdout: logs.join("\n") });
    } catch (err) {
      results.push({ passed: false, error: String(err && err.message ? err.message : err), ms: performance.now() - start, stdout: logs.join("\n") });
    }
  }
  self.postMessage({ type: "done", results });
};
