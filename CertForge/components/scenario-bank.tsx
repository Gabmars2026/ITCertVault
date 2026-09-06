"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Search, TerminalSquare } from "lucide-react";
import { workplaceScenarios, scenarioDomains } from "@/lib/workplace-scenarios";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ScenarioBank() {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const results = useMemo(() => workplaceScenarios.filter((item) => {
    const matchesQuery = `${item.title} ${item.ticket} ${item.domain}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (domain === "All" || item.domain === domain) && (difficulty === "All" || item.difficulty === difficulty);
  }), [query, domain, difficulty]);

  return <div className="space-y-5">
    <section className="network-card rounded-2xl p-5 sm:p-7">
      <p className="eyebrow">200 original workplace incidents</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">CCNA Scenario Lab</h1>
      <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">Practice the way network technicians work: read the ticket, evaluate evidence, name the root cause, and plan a safe change. Solutions remain hidden until you choose to reveal them.</p>
    </section>
    <div className="network-card grid gap-3 rounded-2xl p-4 md:grid-cols-[1fr_220px_180px]">
      <label className="relative"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search scenarios..." /></label>
      <Select value={domain} onValueChange={setDomain}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{scenarioDomains.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
      <Select value={difficulty} onValueChange={setDifficulty}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["All", "Basic", "Intermediate", "Advanced"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
    </div>
    <p className="font-mono text-xs text-muted-foreground">Showing {results.length} of 200 scenarios</p>
    <div className="grid gap-4 xl:grid-cols-2">
      {results.map((item) => <article key={item.id} className="network-card rounded-2xl p-5">
        <div className="flex flex-wrap items-center gap-2"><Badge variant="outline">CCNA-{String(item.id).padStart(3, "0")}</Badge><Badge variant="secondary">{item.domain}</Badge><Badge className="ml-auto">{item.difficulty}</Badge></div>
        <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.ticket}</p>
        <div className="mt-4 rounded-xl border bg-background/40 p-4"><p className="font-mono text-xs text-primary">AVAILABLE EVIDENCE</p><ul className="mt-2 space-y-2">{item.evidence.map((line) => <li key={line} className="flex gap-2 text-sm"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" />{line}</li>)}</ul></div>
        <p className="mt-4 text-sm font-medium leading-6">{item.question}</p>
        <Accordion type="single" collapsible className="mt-3"><AccordionItem value="answer" className="rounded-xl border px-4"><AccordionTrigger className="text-primary">Reveal answer and verification</AccordionTrigger><AccordionContent><p className="leading-7">{item.answer}</p><div className="mt-4 flex items-start gap-2 rounded-lg bg-muted/40 p-3 font-mono text-xs leading-6"><TerminalSquare className="mt-1 size-4 shrink-0 text-primary" /><span>{item.commands.join("  ·  ")}</span></div></AccordionContent></AccordionItem></Accordion>
      </article>)}
    </div>
  </div>;
}
