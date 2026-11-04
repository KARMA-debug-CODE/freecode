"use client";

import Link from "next/link";
import { problems } from "@/lib/problems";
import { currentStreak, dayKey, longestStreak, resetProgress, useProgress } from "@/lib/progress";

const WEEKS = 20;

export default function ProgressView() {
  const progress = useProgress();
  const solvedCount = Object.keys(progress.solved).length;
  const accepted = progress.submissions.filter((s) => s.verdict === "Accepted").length;
  const rate = progress.submissions.length ? Math.round((accepted / progress.submissions.length) * 100) : 0;

  const perDay = new Map<string, number>();
  for (const s of progress.submissions) if (s.verdict === "Accepted") perDay.set(dayKey(new Date(s.at)), (perDay.get(dayKey(new Date(s.at))) ?? 0) + 1);

  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay() - (WEEKS - 1) * 7);
  const weeks: Date[][] = [];
  for (let w = 0; w < WEEKS; w++) {
    const col: Date[] = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(start);
      day.setDate(start.getDate() + w * 7 + d);
      col.push(day);
    }
    weeks.push(col);
  }

  const shade = (n: number) => (n === 0 ? "bg-panel-2" : n === 1 ? "bg-easy/40" : n <= 3 ? "bg-easy/70" : "bg-easy");
  const bySlug = new Map(problems.map((p) => [p.slug, p]));

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Solved" value={`${solvedCount} / ${problems.length}`} />
        <Stat label="Current streak" value={plural(currentStreak(progress.activeDays), "day")} accent />
        <Stat label="Longest streak" value={plural(longestStreak(progress.activeDays), "day")} />
        <Stat label="Acceptance rate" value={`${rate}%`} />
      </div>

      <section className="bg-panel border border-line rounded-xl p-5">
        <h2 className="font-semibold mb-4">Activity (last {WEEKS} weeks)</h2>
        <div className="flex gap-1 overflow-x-auto">
          {weeks.map((col, i) => (
            <div key={i} className="flex flex-col gap-1">
              {col.map((d) => {
                const k = dayKey(d);
                const n = perDay.get(k) ?? 0;
                return <div key={k} title={`${k}: ${n} accepted`} className={`w-3.5 h-3.5 rounded-sm ${d > today ? "opacity-0" : shade(n)}`} />;
              })}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-panel border border-line rounded-xl p-5">
        <h2 className="font-semibold mb-3">Recent submissions</h2>
        {progress.submissions.length === 0 ? (
          <p className="text-muted text-sm">
            Nothing yet. <Link href="/daily" className="text-brand hover:underline">Try today&apos;s problem</Link>.
          </p>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {progress.submissions.slice(0, 25).map((s) => {
                const p = bySlug.get(s.slug);
                return (
                  <tr key={s.at} className="border-t border-line">
                    <td className="py-2">
                      <Link href={`/problems/${s.slug}`} className="hover:text-brand">
                        {p ? `${p.id}. ${p.title}` : s.slug}
                      </Link>
                    </td>
                    <td className={`py-2 ${s.verdict === "Accepted" ? "text-easy" : "text-hard"}`}>{s.verdict}</td>
                    <td className="py-2 text-muted">{s.language === "python" ? "Python 3" : "JavaScript"}</td>
                    <td className="py-2 text-muted text-right">{new Date(s.at).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      <div className="text-right">
        <button
          onClick={() => confirm("Delete all progress stored in this browser?") && resetProgress()}
          className="text-xs text-muted hover:text-hard"
        >
          Reset progress
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-panel border border-line rounded-xl p-4">
      <div className="text-xs text-muted">{label}</div>
      <div className={`text-2xl font-semibold mt-1 ${accent ? "text-brand" : ""}`}>{value}</div>
    </div>
  );
}

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}
