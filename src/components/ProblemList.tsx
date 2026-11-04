"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import DifficultyBadge from "./DifficultyBadge";
import { allTags, dailyProblem, problems } from "@/lib/problems";
import type { Difficulty } from "@/lib/problems/types";
import { currentStreak, useProgress } from "@/lib/progress";

type Status = "all" | "solved" | "attempted" | "todo";
const noop = () => () => {};

export default function ProblemList() {
  const progress = useProgress();
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [status, setStatus] = useState<Status>("all");
  const [tag, setTag] = useState<string>("all");
  const daily = useSyncExternalStore(noop, () => dailyProblem(), () => null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return problems.filter((p) => {
      if (q && !p.title.toLowerCase().includes(q) && !String(p.id).startsWith(q)) return false;
      if (difficulty !== "all" && p.difficulty !== difficulty) return false;
      if (tag !== "all" && !p.tags.includes(tag)) return false;
      const solved = !!progress.solved[p.slug];
      const attempted = !!progress.attempted[p.slug];
      if (status === "solved" && !solved) return false;
      if (status === "attempted" && (solved || !attempted)) return false;
      if (status === "todo" && (solved || attempted)) return false;
      return true;
    });
  }, [query, difficulty, status, tag, progress]);

  const counts = (d: Difficulty) => {
    const all = problems.filter((p) => p.difficulty === d);
    return { done: all.filter((p) => progress.solved[p.slug]).length, total: all.length };
  };

  const streak = currentStreak(progress.activeDays);

  return (
    <div className="flex flex-col gap-6">
      <section className="grid md:grid-cols-[1fr_320px] gap-4">
        <div className="bg-panel rounded-xl p-5 border border-line">
          <div className="text-xs uppercase tracking-wider text-brand font-semibold">Problem of the day</div>
          {daily ? (
            <>
              <Link href={`/problems/${daily.slug}`} className="block mt-2 text-xl font-semibold hover:text-brand">
                {daily.id}. {daily.title}
              </Link>
              <div className="mt-2 flex items-center gap-3">
                <DifficultyBadge d={daily.difficulty} pill />
                {progress.solved[daily.slug] && <span className="text-easy text-sm">&#10003; Solved</span>}
              </div>
              <p className="text-muted text-sm mt-3">
                {streak > 0
                  ? `You're on a ${streak}-day streak. Keep it going!`
                  : "Solve any problem today to start a streak."}
              </p>
            </>
          ) : (
            <div className="h-20" />
          )}
        </div>
        <div className="bg-panel rounded-xl p-5 border border-line flex flex-col gap-3">
          <div className="text-sm text-muted">Solved</div>
          {(["Easy", "Medium", "Hard"] as Difficulty[]).map((d) => {
            const c = counts(d);
            return (
              <div key={d} className="text-sm">
                <div className="flex justify-between">
                  <DifficultyBadge d={d} />
                  <span className="tabular-nums">
                    {c.done}
                    <span className="text-muted">/{c.total}</span>
                  </span>
                </div>
                <div className="h-1.5 bg-panel-2 rounded mt-1 overflow-hidden">
                  <div
                    className={`h-full ${d === "Easy" ? "bg-easy" : d === "Medium" ? "bg-medium" : "bg-hard"}`}
                    style={{ width: `${(c.done / c.total) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="flex flex-wrap gap-2 items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search problems"
          className="bg-panel border border-line rounded-lg px-3 py-1.5 text-sm w-60 outline-none focus:border-brand"
        />
        <Select value={difficulty} onChange={(v) => setDifficulty(v as Difficulty | "all")} options={["all", "Easy", "Medium", "Hard"]} label="Difficulty" />
        <Select value={status} onChange={(v) => setStatus(v as Status)} options={["all", "todo", "attempted", "solved"]} label="Status" />
        <Select value={tag} onChange={setTag} options={["all", ...allTags]} label="Tag" />
        <span className="text-muted text-sm ml-auto">{rows.length} problems</span>
      </section>

      <section className="bg-panel rounded-xl border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-muted text-left border-b border-line">
            <tr>
              <th className="py-2.5 px-4 w-16 font-normal">Status</th>
              <th className="py-2.5 px-2 font-normal">Title</th>
              <th className="py-2.5 px-2 font-normal hidden md:table-cell">Tags</th>
              <th className="py-2.5 px-4 w-28 font-normal">Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p, i) => (
              <tr key={p.slug} className={i % 2 ? "bg-panel-2/40" : ""}>
                <td className="py-2.5 px-4">
                  {progress.solved[p.slug] ? (
                    <span className="text-easy" title="Solved">&#10003;</span>
                  ) : progress.attempted[p.slug] ? (
                    <span className="text-medium" title="Attempted">&#9679;</span>
                  ) : null}
                </td>
                <td className="py-2.5 px-2">
                  <Link href={`/problems/${p.slug}`} className="hover:text-brand">
                    {p.id}. {p.title}
                  </Link>
                </td>
                <td className="py-2.5 px-2 hidden md:table-cell">
                  <div className="flex gap-1 flex-wrap">
                    {p.tags.slice(0, 3).map((t) => (
                      <span key={t} className="text-xs text-muted bg-panel-2 rounded px-1.5 py-0.5">
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-2.5 px-4">
                  <DifficultyBadge d={p.difficulty} />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="py-10 text-center text-muted">
                  No problems match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function Select({ value, onChange, options, label }: { value: string; onChange: (v: string) => void; options: string[]; label: string }) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-panel border border-line rounded-lg px-3 py-1.5 text-sm outline-none focus:border-brand capitalize"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o === "all" ? `${label}: all` : o}
        </option>
      ))}
    </select>
  );
}
