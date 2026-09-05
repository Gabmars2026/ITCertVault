"use client";

import { Check, Clipboard, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buildingBlocks, fullBuilds, type ScriptLesson } from "@/lib/scripts";

function CodeViewer({ lesson }: { lesson: ScriptLesson }) {
  const [copied, setCopied] = useState(false);
  async function copyCode() {
    await navigator.clipboard.writeText(lesson.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }
  return (
    <article className="network-card min-w-0 rounded-2xl p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-primary/35 bg-primary/10 px-2.5 py-1 font-mono text-primary">{lesson.certification}</span>
            <span className="rounded-full border px-2.5 py-1 text-muted-foreground">{lesson.level}</span>
            <span className="rounded-full border px-2.5 py-1 text-muted-foreground">{lesson.category}</span>
          </div>
          <h2 className="mt-4 text-2xl font-semibold">{lesson.title}</h2>
          <p className="mt-2 max-w-3xl leading-7 text-muted-foreground">{lesson.purpose}</p>
        </div>
        <Button variant="outline" onClick={copyCode}>{copied ? <Check /> : <Clipboard />}{copied ? "Copied" : "Copy config"}</Button>
      </div>
      <pre className="code-panel scrollbar-thin mt-6 max-h-[620px] overflow-auto rounded-xl p-4 text-[13px] leading-6 sm:p-5"><code>{lesson.code}</code></pre>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-background/35 p-4">
          <h3 className="font-semibold">Verify</h3>
          <div className="mt-3 grid gap-2">
            {lesson.verify.map((command) => <code key={command} className="rounded-md bg-black/25 px-3 py-2 font-mono text-sm text-primary">{command}</code>)}
          </div>
        </div>
        <div className="rounded-xl border bg-background/35 p-4">
          <h3 className="font-semibold">Engineer notes</h3>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-muted-foreground">
            {lesson.notes.map((note) => <li key={note} className="flex gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />{note}</li>)}
          </ul>
        </div>
      </div>
    </article>
  );
}

function Catalog({ lessons, selected, onSelect }: { lessons: ScriptLesson[]; selected: ScriptLesson; onSelect: (lesson: ScriptLesson) => void }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return lessons.filter((lesson) => !needle || `${lesson.title} ${lesson.category} ${lesson.certification} ${lesson.purpose}`.toLowerCase().includes(needle));
  }, [lessons, query]);
  return (
    <div className="grid gap-5 xl:grid-cols-[300px_1fr]">
      <aside className="network-card h-fit rounded-2xl p-3 xl:sticky xl:top-20">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search configs" className="pl-9" />
        </div>
        <div className="scrollbar-thin mt-3 grid max-h-[68vh] gap-1 overflow-auto pr-1">
          {filtered.map((lesson, index) => (
            <button
              type="button"
              key={lesson.id}
              onClick={() => onSelect(lesson)}
              className={`rounded-lg px-3 py-3 text-left transition ${lesson.id === selected.id ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
            >
              <span className="block text-sm font-medium">{lesson.title}</span>
              <span className={`mt-1 block font-mono text-[10px] ${lesson.id === selected.id ? "text-primary-foreground/75" : "text-muted-foreground"}`}>{String(index + 1).padStart(2, "0")} · {lesson.certification} · {lesson.level}</span>
            </button>
          ))}
        </div>
      </aside>
      <CodeViewer lesson={selected} />
    </div>
  );
}

export function ScriptLibrary() {
  const [block, setBlock] = useState(buildingBlocks[0]);
  const [full, setFull] = useState(fullBuilds[0]);
  return (
    <Tabs defaultValue="blocks">
      <TabsList className="mb-4 h-auto flex-wrap" variant="line">
        <TabsTrigger value="blocks" className="px-4 py-2.5">Building blocks ({buildingBlocks.length})</TabsTrigger>
        <TabsTrigger value="full" className="px-4 py-2.5">Full configurations ({fullBuilds.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="blocks"><Catalog lessons={buildingBlocks} selected={block} onSelect={setBlock} /></TabsContent>
      <TabsContent value="full"><Catalog lessons={fullBuilds} selected={full} onSelect={setFull} /></TabsContent>
    </Tabs>
  );
}
