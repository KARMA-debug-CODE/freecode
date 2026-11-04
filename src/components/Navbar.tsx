"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { currentStreak, useProgress } from "@/lib/progress";

const links = [
  { href: "/", label: "Problems" },
  { href: "/daily", label: "Daily" },
  { href: "/progress", label: "Progress" },
];

export default function Navbar() {
  const pathname = usePathname();
  const progress = useProgress();
  const streak = currentStreak(progress.activeDays);

  return (
    <header className="h-12 shrink-0 border-b border-line bg-panel flex items-center px-4 gap-6">
      <Link href="/" className="font-bold text-lg tracking-tight">
        <span className="text-brand">Free</span>Code
      </Link>
      <nav className="flex gap-1 text-sm">
        {links.map((l) => {
          const active = l.href === "/" ? pathname === "/" || pathname.startsWith("/problems") : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded-md ${active ? "bg-panel-2 text-white" : "text-muted hover:text-white"}`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="ml-auto flex items-center gap-4 text-sm">
        <span title="Daily streak" className="flex items-center gap-1">
          <span className={streak > 0 ? "text-brand" : "text-muted"}>&#9733;</span>
          <span className="tabular-nums">{streak}</span>
          <span className="text-muted hidden sm:inline">day streak</span>
        </span>
        <span className="text-muted tabular-nums">{Object.keys(progress.solved).length} solved</span>
      </div>
    </header>
  );
}
