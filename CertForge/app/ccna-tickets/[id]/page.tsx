import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, ClipboardCheck, Eye, Lightbulb, Network, SearchCode, TerminalSquare, TriangleAlert } from "lucide-react";
import { ccnaWorkplaceScenarios, getCcnaScenario } from "@/lib/ccna-workplace-scenarios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function generateStaticParams() {
  return ccnaWorkplaceScenarios.map((item) => ({ id: String(item.id).padStart(3, "0") }));
}

export default async function CcnaTicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  const ticket = Number.isInteger(id) ? getCcnaScenario(id) : undefined;
  if (!ticket) notFound();

  const sectionClass = "network-card rounded-2xl p-5 sm:p-7";
  const labelClass = "font-mono text-[11px] uppercase tracking-[0.18em] text-primary";

  return <article className="mx-auto max-w-6xl space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><Button asChild variant="outline"><Link href="/ccna-tickets"><ArrowLeft />Back to 200 CCNA tickets</Link></Button><div className="flex flex-wrap gap-2"><Badge>{ticket.ticketNumber}</Badge><Badge variant="outline">{ticket.difficulty}</Badge><Badge variant="secondary">{ticket.domain}</Badge></div></div>

    <header className={`${sectionClass} border-primary/25`}>
      <p className={labelClass}>CCNA real-world workplace incident</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">{ticket.title}</h1>
      <p className="mt-4 max-w-4xl text-base leading-7 text-muted-foreground">Treat this like a production support ticket. Work sections 01–10 and write your diagnosis before opening Show Answer. The solution is closed by default even when a ticket is opened directly.</p>
    </header>

    <section className={sectionClass}><p className={labelClass}>01 · Company environment</p><p className="mt-3 leading-7 text-muted-foreground">{ticket.companyEnvironment}</p></section>

    <section className={sectionClass}><p className={labelClass}>02 · Topology involved</p><div className="mt-3 flex items-start gap-3 rounded-xl border bg-background/35 p-4"><Network className="mt-1 size-5 shrink-0 text-primary" /><p className="leading-7 text-muted-foreground">{ticket.topology}</p></div></section>

    <section className={sectionClass}><p className={labelClass}>03 · User / customer complaint</p><p className="mt-3 text-lg font-medium leading-8">{ticket.complaint}</p></section>

    <section className={sectionClass}><p className={labelClass}>04 · Symptoms and scope</p><ul className="mt-4 space-y-3">{ticket.symptoms.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground"><TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-400" />{item}</li>)}</ul></section>

    <section className={sectionClass}><p className={labelClass}>05 · Cisco CLI / evidence captured before repair</p><pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-5 text-xs leading-6 text-slate-100"><code>{ticket.cliOutput}</code></pre></section>

    <section className={sectionClass}><p className={labelClass}>06 · What changed before the problem?</p><p className="mt-3 leading-7 text-muted-foreground">{ticket.whatChanged}</p></section>

    <section className={sectionClass}><p className={labelClass}>07 · Troubleshooting clues</p><ul className="mt-4 space-y-3">{ticket.clues.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground"><Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />{item}</li>)}</ul></section>

    <section className={sectionClass}><p className={labelClass}>08 · Five things to investigate first</p><ol className="mt-4 space-y-3">{ticket.investigateFirst.map((item, index) => <li key={item} className="flex gap-3"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 font-mono text-xs text-primary">{index + 1}</span><span className="pt-0.5 text-sm leading-6 text-muted-foreground">{item}</span></li>)}</ol></section>

    <section className={sectionClass}><p className={labelClass}>09 · Commands to run next</p><div className="mt-4 rounded-xl bg-slate-950 p-5"><div className="mb-3 flex items-center gap-2 font-mono text-xs text-cyan-300"><TerminalSquare className="size-4" />Evidence plan</div><pre className="overflow-x-auto text-xs leading-6 text-slate-100"><code>{ticket.commandsToRun.join("\n")}</code></pre></div></section>

    <section className={sectionClass}><p className={labelClass}>10 · Your diagnosis — write before revealing</p><p className="mt-3 text-sm leading-6 text-muted-foreground">{ticket.diagnosisPrompt}</p><textarea aria-label="Your diagnosis" className="mt-4 min-h-44 w-full rounded-xl border bg-background/50 p-4 text-sm outline-none focus:ring-2 focus:ring-primary/40" placeholder="Failed layer/domain:\nLikely root cause:\nEvidence #1:\nEvidence #2:\nNext test:\nSafest repair / rollback:\nVerification:" /></section>

    <details className="network-card group rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.03]">
      <summary className="flex cursor-pointer list-none items-center gap-3 p-5 font-semibold sm:p-7"><Eye className="size-5 text-emerald-400" /><span>11 · Show Answer</span><span className="ml-auto font-mono text-xs text-muted-foreground group-open:hidden">CLOSED</span><span className="ml-auto hidden font-mono text-xs text-emerald-400 group-open:inline">OPEN</span></summary>
      <div className="space-y-5 border-t p-5 sm:p-7">
        <section><p className={labelClass}>12 · Root cause</p><p className="mt-3 text-lg font-semibold leading-8">{ticket.rootCause}</p></section>

        <section className="border-t pt-5"><p className={labelClass}>13 · Detailed troubleshooting process</p><ol className="mt-4 space-y-3">{ticket.troubleshootingProcess.map((item, index) => <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground"><span className="font-mono text-primary">{String(index + 1).padStart(2, "0")}</span>{item}</li>)}</ol></section>

        <section className="border-t pt-5"><p className={labelClass}>14 · Exact fix commands / corrective action</p><pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-5 text-xs leading-6 text-slate-100"><code>{ticket.fixCommands.join("\n")}</code></pre></section>

        <section className="border-t pt-5"><p className={labelClass}>15 · Verification commands</p><pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-5 text-xs leading-6 text-slate-100"><code>{ticket.verificationCommands.join("\n")}</code></pre></section>

        <section className="border-t pt-5"><p className={labelClass}>16 · Expected output after repair</p><p className="mt-3 leading-7 text-muted-foreground">{ticket.expectedOutput}</p></section>

        <section className="border-t pt-5"><p className={labelClass}>17 · Why the problem happened</p><p className="mt-3 leading-7 text-muted-foreground">{ticket.whyItHappened}</p></section>

        <section className="border-t pt-5"><p className={labelClass}>18 · How to prevent it next time</p><ul className="mt-4 space-y-3">{ticket.prevention.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" />{item}</li>)}</ul></section>

        <section className="border-t pt-5"><p className={labelClass}>19 · What to document in the production ticket</p><ul className="mt-4 space-y-3">{ticket.productionTicketNotes.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground"><ClipboardCheck className="mt-0.5 size-4 shrink-0 text-primary" />{item}</li>)}</ul></section>

        <section className="border-t pt-5"><p className={labelClass}>20 · Closure checklist</p><div className="mt-4 grid gap-3 sm:grid-cols-2"><p className="rounded-xl border bg-background/35 p-4 text-sm leading-6">✓ The user's original problem works repeatedly.</p><p className="rounded-xl border bg-background/35 p-4 text-sm leading-6">✓ Relevant interface, VLAN, route, security or service state matches the design.</p><p className="rounded-xl border bg-background/35 p-4 text-sm leading-6">✓ Error/drop/violation counters are stable after the fix.</p><p className="rounded-xl border bg-background/35 p-4 text-sm leading-6">✓ Monitoring, documentation and saved/source-of-truth state reflect the repair.</p></div></section>
      </div>
    </details>

    <nav className="flex flex-wrap justify-between gap-3 py-2">
      <Button asChild variant="outline" disabled={ticket.id === 1}><Link href={`/ccna-tickets/${String(Math.max(1, ticket.id - 1)).padStart(3, "0")}`}><ArrowLeft />Previous ticket</Link></Button>
      <Button asChild variant="outline"><Link href="/ccna-tickets"><SearchCode />Search all CCNA tickets</Link></Button>
      <Button asChild variant="outline" disabled={ticket.id === 200}><Link href={`/ccna-tickets/${String(Math.min(200, ticket.id + 1)).padStart(3, "0")}`}>Next ticket</Link></Button>
    </nav>
  </article>;
}
