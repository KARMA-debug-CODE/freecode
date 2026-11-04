import type { Difficulty } from "@/lib/problems/types";

const color: Record<Difficulty, string> = {
  Easy: "text-easy",
  Medium: "text-medium",
  Hard: "text-hard",
};

export default function DifficultyBadge({ d, pill = false }: { d: Difficulty; pill?: boolean }) {
  if (pill) return <span className={`${color[d]} bg-panel-2 rounded-full px-2.5 py-0.5 text-xs font-medium`}>{d}</span>;
  return <span className={`${color[d]} text-sm`}>{d}</span>;
}
