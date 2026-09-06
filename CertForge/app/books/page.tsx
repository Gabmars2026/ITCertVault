import Link from "next/link";
import { ArrowRight, BookOpenText, Clock3, Layers3 } from "lucide-react";
import { books } from "@/lib/books";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function BooksPage() {
  return <div className="space-y-6">
    <section className="network-card rounded-2xl p-6 sm:p-8"><p className="eyebrow">Gianni Network Library</p><h1 className="mt-3 max-w-4xl text-3xl font-bold tracking-tight sm:text-5xl">Three guided books. One path from first packet to enterprise engineering.</h1><p className="mt-4 max-w-3xl leading-7 text-muted-foreground">Original explanations, command-focused labs, hidden review answers, and a one-hour study structure for every chapter.</p></section>
    <div className="grid gap-5 lg:grid-cols-3">{books.map((book) => <article key={book.slug} className="network-card flex flex-col rounded-2xl p-6"><div className="grid size-12 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary"><BookOpenText /></div><Badge variant="outline" className="mt-5 w-fit">{book.audience}</Badge><h2 className="mt-3 text-2xl font-bold">{book.title}</h2><p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">{book.subtitle}</p><div className="mt-5 flex gap-4 border-y py-4 text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><Layers3 className="size-4 text-primary" />{book.chapters.length} chapters</span><span className="flex items-center gap-1.5"><Clock3 className="size-4 text-primary" />60 min each</span></div><Button asChild className="mt-5"><Link href={`/books/${book.slug}`}>Open book <ArrowRight /></Link></Button></article>)}</div>
    <section className="rounded-2xl border border-primary/20 bg-primary/5 p-5"><p className="font-semibold">How the one-hour chapters work</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Plan roughly 25 minutes for the deep read, 20 minutes for the guided lab, 10 minutes for recall and command interpretation, and 5 minutes for the review. Learners who are brand new should pause, repeat examples, and allow extra lab time.</p></section>
  </div>;
}
