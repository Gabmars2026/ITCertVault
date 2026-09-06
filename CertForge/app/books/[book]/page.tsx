import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookMarked, Clock3, Target } from "lucide-react";
import { books, getBook } from "@/lib/books";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function generateStaticParams() { return books.map((book) => ({ book: book.slug })); }

export default async function BookPage({ params }: { params: Promise<{ book: string }> }) {
  const { book: slug } = await params; const book = getBook(slug); if (!book) notFound();
  return <div className="space-y-6">
    <section className="network-card rounded-2xl p-6 sm:p-8"><div className="flex items-center gap-3"><BookMarked className="size-7 text-primary" /><p className="eyebrow">Digital field book</p></div><h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight sm:text-5xl">{book.title}</h1><p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">{book.subtitle}</p><div className="mt-6 flex flex-wrap gap-2"><Badge>{book.chapters.length} chapters</Badge><Badge variant="outline">{book.chapters.length} guided study hours</Badge><Badge variant="outline">{book.audience}</Badge></div><Button asChild className="mt-6"><Link href={`/books/${book.slug}/${book.chapters[0].slug}`}>Begin chapter 1 <ArrowRight /></Link></Button></section>
    <section><div className="mb-4 flex items-end justify-between"><div><p className="eyebrow">Table of contents</p><h2 className="mt-2 text-2xl font-bold">Build the skill in order</h2></div></div><div className="grid gap-4 lg:grid-cols-2">{book.chapters.map((chapter, index) => <Link key={chapter.slug} href={`/books/${book.slug}/${chapter.slug}`} className="network-card group rounded-2xl p-5 transition hover:border-primary/50"><div className="flex items-start gap-4"><span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 font-mono text-sm text-primary">{String(index + 1).padStart(2, "0")}</span><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold group-hover:text-primary">{chapter.title}</h3><Badge variant="outline">{chapter.level}</Badge></div><p className="mt-2 text-sm leading-6 text-muted-foreground">{chapter.summary}</p><div className="mt-3 flex gap-4 text-xs text-muted-foreground"><span className="flex items-center gap-1"><Clock3 className="size-3.5" />60-minute session</span><span className="flex items-center gap-1"><Target className="size-3.5" />{chapter.objectives.length} objectives</span></div></div></div></Link>)}</div></section>
  </div>;
}
