"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search, ShieldCheck } from "lucide-react";
import { difficultyCounts, scenarioDifficulties, scenarioDomains, workplaceScenarios } from "@/lib/workplace-scenarios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ScenarioBank() {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("All");
  const [difficulty, setDifficulty] = useState("All");

  const results = useMemo(() => workplaceScenarios.filter((item) => {
    const haystack = `${item.ticketNumber} ${item.title} ${item.complaint} ${item.domain} ${item.companyEnvironment}`.toLowerCase();
    const matchesQuery = haystack.includes(query.trim().toLowerCase());
    return matchesQuery && (domain === "All" || item.domain === domain) && (difficulty === "All" || item.difficulty === difficulty);
  }), [query, domain, difficulty]);

  return <div className="space-y-5">
    <section className="network-card rounded-2xl p-5 sm:p-8">
      <div className="flex flex-wrap items-center gap-2"><Badge>CCNP ENTERPRISE</Badge><Badge variant="outline">200 production tickets</Badge><Badge variant="outline">answers hidden by default</Badge></div>
      <h1 className="mt-4 max-w-5xl text-3xl font-bold tracking-tight sm:text-5xl">Enterprise Workplace Troubleshooting Ticket Lab</h1>
      <p className="mt-4 max-w-4xl text-base leading-7 text-muted-foreground sm:text-lg">Work the incident like a production network engineer. Each ticket gives you environment, topology, symptoms, Cisco CLI evidence, change context, investigation priorities and commands. Write your diagnosis before you open <strong className="text-foreground">Show Answer</strong>.</p>
      <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {Object.entries(difficultyCounts).map(([label, count]) => <div key={label} className="rounded-xl border bg-background/35 p-3"><p className="font-mono text-lg font-bold text-primary">{count}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{label}</p></div>)}
      </div>
    </section>

    <section className="network-card grid gap-3 rounded-2xl p-4 lg:grid-cols-[minmax(0,1fr)_260px_300px]">
      <label className="relative"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search ticket, root topic, symptom, site..." /></label>
      <Select value={domain} onValueChange={setDomain}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{scenarioDomains.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
      <Select value={difficulty} onValueChange={setDifficulty}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{scenarioDifficulties.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
    </section>

    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="font-mono text-xs text-muted-foreground">Showing {results.length} of 200 distinct CCNP Enterprise incidents</p>
      <p className="flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4 text-emerald-400" /> No answer text appears on this browser page.</p>
    </div>

    {results.length ? <div className="grid gap-4 xl:grid-cols-2">
      {results.map((item) => <article key={item.id} className="network-card flex min-h-[270px] flex-col rounded-2xl p-5">
        <div className="flex flex-wrap items-center gap-2"><Badge variant="outline">{item.ticketNumber}</Badge><Badge variant="secondary">{item.domain}</Badge>{item.multiFailure ? <Badge>Multi-failure</Badge> : null}</div>
        <h2 className="mt-4 text-xl font-semibold leading-7">{item.title}</h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{item.complaint}</p>
        <div className="mt-4 rounded-xl border bg-background/35 p-3 text-xs leading-5 text-muted-foreground"><span className="font-semibold text-foreground">Difficulty:</span> {item.difficulty}</div>
        <Button asChild className="mt-auto pt-0" variant="outline"><Link href={`/scenarios/${String(item.id).padStart(3, "0")}`}>Open production ticket <ArrowRight /></Link></Button>
      </article>)}
    </div> : <div className="network-card rounded-2xl p-8 text-center text-muted-foreground">No tickets match these filters.</div>}
  </div>;
}
