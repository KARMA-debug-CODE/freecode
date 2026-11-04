import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Workspace from "@/components/Workspace";
import { getProblem, problems } from "@/lib/problems";

export function generateStaticParams() {
  return problems.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProblem((await params).slug);
  return { title: p ? `${p.id}. ${p.title} – FreeCode` : "FreeCode" };
}

export default async function ProblemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const problem = getProblem(slug);
  if (!problem) notFound();
  const idx = problems.findIndex((p) => p.slug === slug);
  const prev = problems[idx - 1]?.slug ?? null;
  const next = problems[idx + 1]?.slug ?? null;
  return <Workspace problem={problem} prevSlug={prev} nextSlug={next} />;
}
