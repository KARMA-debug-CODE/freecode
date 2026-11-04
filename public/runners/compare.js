/* Shared comparison helpers for the runner workers. */
function canonical(v) {
  if (Array.isArray(v)) return "[" + v.map(canonical).join(",") + "]";
  if (v && typeof v === "object") {
    return "{" + Object.keys(v).sort().map((k) => JSON.stringify(k) + ":" + canonical(v[k])).join(",") + "}";
  }
  if (typeof v === "number" && !Number.isInteger(v)) return String(Math.round(v * 1e5) / 1e5);
  return JSON.stringify(v === undefined ? null : v);
}

function normalize(v, mode) {
  if (mode === "unordered" && Array.isArray(v)) {
    return v.map(canonical).sort().join("|");
  }
  if (mode === "nested-unordered" && Array.isArray(v)) {
    return v
      .map((inner) => (Array.isArray(inner) ? inner.map(canonical).sort().join(",") : canonical(inner)))
      .sort()
      .join("|");
  }
  return canonical(v);
}

function isEqual(actual, expected, mode) {
  return normalize(actual, mode) === normalize(expected, mode);
}
