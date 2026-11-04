"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { dailyProblem } from "@/lib/problems";

export default function DailyPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace(`/problems/${dailyProblem().slug}`);
  }, [router]);
  return <main className="p-10 text-muted">Opening today&apos;s problem…</main>;
}
