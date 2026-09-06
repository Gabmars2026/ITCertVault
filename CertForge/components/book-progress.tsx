"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function BookProgress({ bookSlug, chapterSlug, chapters }: { bookSlug: string; chapterSlug: string; chapters: { slug: string; title: string }[] }) {
  const router = useRouter();
  const index = chapters.findIndex((item) => item.slug === chapterSlug);
  const storageKey = `gnl-book-${bookSlug}`;
  const [complete, setComplete] = useState<string[]>([]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setComplete(JSON.parse(localStorage.getItem(storageKey) ?? "[]")));
    return () => cancelAnimationFrame(frame);
  }, [storageKey]);
  function toggle() {
    const next = complete.includes(chapterSlug) ? complete.filter((item) => item !== chapterSlug) : [...complete, chapterSlug];
    setComplete(next); localStorage.setItem(storageKey, JSON.stringify(next));
  }
  return <div className="network-card sticky top-20 z-10 rounded-2xl p-3 shadow-xl shadow-background/40">
    <div className="grid gap-3 lg:grid-cols-[auto_1fr_auto] lg:items-center">
      <div className="flex gap-2"><Button variant="outline" size="icon" disabled={index === 0} onClick={() => router.push(`/books/${bookSlug}/${chapters[index - 1]?.slug}`)} aria-label="Previous chapter"><ChevronLeft /></Button><Button variant="outline" size="icon" disabled={index === chapters.length - 1} onClick={() => router.push(`/books/${bookSlug}/${chapters[index + 1]?.slug}`)} aria-label="Next chapter"><ChevronRight /></Button></div>
      <Select value={chapterSlug} onValueChange={(value) => router.push(`/books/${bookSlug}/${value}`)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{chapters.map((item, position) => <SelectItem key={item.slug} value={item.slug}>Chapter {position + 1}: {item.title}</SelectItem>)}</SelectContent></Select>
      <Button variant={complete.includes(chapterSlug) ? "secondary" : "default"} onClick={toggle}><Check />{complete.includes(chapterSlug) ? "Completed" : "Mark complete"}</Button>
    </div>
    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all" style={{ width: `${(complete.length / chapters.length) * 100}%` }} /></div>
  </div>;
}
