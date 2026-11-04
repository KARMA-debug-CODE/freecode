"use client";

import { useSyncExternalStore } from "react";
import type { Language } from "./problems/types";

export type Verdict = "Accepted" | "Wrong Answer" | "Runtime Error" | "Time Limit Exceeded";

export interface Submission {
  slug: string;
  language: Language;
  verdict: Verdict;
  passed: number;
  total: number;
  ms: number;
  at: number;
  code: string;
}

export interface ProgressState {
  solved: Record<string, number>;
  attempted: Record<string, number>;
  submissions: Submission[];
  activeDays: string[];
}

const KEY = "freecode:progress:v1";
const EMPTY: ProgressState = { solved: {}, attempted: {}, submissions: [], activeDays: [] };
const listeners = new Set<() => void>();
let cache: ProgressState | null = null;

export function dayKey(d = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function read(): ProgressState {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache!;
}

function write(next: ProgressState) {
  cache = next;
  localStorage.setItem(KEY, JSON.stringify(next));
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useProgress(): ProgressState {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function recordSubmission(sub: Submission) {
  const s = read();
  const today = dayKey(new Date(sub.at));
  const next: ProgressState = {
    solved: sub.verdict === "Accepted" && !s.solved[sub.slug] ? { ...s.solved, [sub.slug]: sub.at } : s.solved,
    attempted: { ...s.attempted, [sub.slug]: sub.at },
    submissions: [sub, ...s.submissions].slice(0, 500),
    activeDays: sub.verdict === "Accepted" && !s.activeDays.includes(today) ? [...s.activeDays, today] : s.activeDays,
  };
  write(next);
}

export function resetProgress() {
  write(EMPTY);
}

/** Consecutive days with at least one accepted submission, ending today (or yesterday if today has none yet). */
export function currentStreak(activeDays: string[], now = new Date()): number {
  const set = new Set(activeDays);
  const d = new Date(now);
  if (!set.has(dayKey(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(dayKey(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function longestStreak(activeDays: string[]): number {
  const days = [...activeDays].sort();
  let best = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const k of days) {
    const [y, m, d] = k.split("-").map(Number);
    const cur = new Date(y, m - 1, d);
    run = prev && Math.round((cur.getTime() - prev.getTime()) / 86400000) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = cur;
  }
  return best;
}

const codeKey = (slug: string, lang: Language) => `freecode:code:${slug}:${lang}`;

export function loadCode(slug: string, lang: Language): string | null {
  try {
    return localStorage.getItem(codeKey(slug, lang));
  } catch {
    return null;
  }
}

export function saveCode(slug: string, lang: Language, code: string) {
  try {
    localStorage.setItem(codeKey(slug, lang), code);
  } catch {}
}

export function clearCode(slug: string, lang: Language) {
  try {
    localStorage.removeItem(codeKey(slug, lang));
  } catch {}
}
