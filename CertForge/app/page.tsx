import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Braces,
  CheckCircle2,
  Clock3,
  FileQuestion,
  GripVertical,
  Network,
  Route,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ccnaDomains = [
  ["Network Fundamentals", "20%"],
  ["Network Access", "20%"],
  ["IP Connectivity", "25%"],
  ["IP Services", "10%"],
  ["Security Fundamentals", "15%"],
  ["Automation", "10%"],
];

const encorDomains = [
  ["Architecture", "15%"],
  ["Virtualization", "10%"],
  ["Infrastructure", "30%"],
  ["Network Assurance", "10%"],
  ["Security", "20%"],
  ["Automation", "15%"],
];

export default function Home() {
  return (
    <div className="space-y-7">
      <section className="network-card relative overflow-hidden rounded-2xl p-5 sm:p-7">
        <div className="trace-line absolute inset-x-0 top-0 h-px" />
        <div className="grid gap-6 xl:grid-cols-[1.35fr_.65fr] xl:items-end">
          <div>
            <p className="eyebrow">Gianni Majorenos / Network engineering workspace</p>
            <h1 className="mt-3 max-w-4xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Learn the packet path. Build the config. Prove the fix.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
              A practical path from CCNA fundamentals to CCNP ENCOR: short lessons, reusable Cisco IOS
              building blocks, full configurations, topology drills, and original practice exams.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/practice">
                  Start a practice drill <ArrowRight />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/scripts">
                  Open config library <Braces />
                </Link>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["600", "original questions", FileQuestion],
              ["12", "exam domains", BookOpenCheck],
              ["12", "drag-and-drop labs", GripVertical],
              ["8", "topology labs", Network],
            ].map(([value, label, Icon]) => (
              <div key={String(label)} className="rounded-xl border bg-background/45 p-4">
                <Icon className="size-4 text-primary" />
                <p className="mt-3 font-mono text-2xl font-bold">{String(value)}</p>
                <p className="mt-1 text-sm text-muted-foreground">{String(label)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            icon: Route,
            label: "01 / Understand",
            title: "Build the mental model",
            text: "Move from frames and subnets to routing, enterprise architecture, wireless, security, and automation.",
            href: "/learn",
          },
          {
            icon: Braces,
            label: "02 / Configure",
            title: "Practice one command at a time",
            text: "Study small, annotated IOS examples first, then assemble them into complete campus and branch configurations.",
            href: "/scripts",
          },
          {
            icon: ShieldCheck,
            label: "03 / Verify",
            title: "Test and troubleshoot",
            text: "Use filtered drills, timed exams, drag-and-drop tasks, and topology scenarios with answer explanations.",
            href: "/exam",
          },
        ].map((item) => (
          <article key={item.title} className="network-card rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <item.icon className="size-5 text-primary" />
              <span className="font-mono text-xs text-muted-foreground">{item.label}</span>
            </div>
            <h2 className="mt-5 text-xl font-semibold">{item.title}</h2>
            <p className="mt-3 min-h-20 text-sm leading-6 text-muted-foreground">{item.text}</p>
            <Link href={item.href} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Open module <ArrowRight className="size-4" />
            </Link>
          </article>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        {[
          {
            label: "200-301 CCNA v1.1",
            title: "Associate foundation",
            note: "Current exam through February 2, 2027",
            domains: ccnaDomains,
          },
          {
            label: "350-401 ENCOR v1.1",
            title: "Enterprise core",
            note: "Architecture through automation",
            domains: encorDomains,
          },
        ].map((track) => (
          <article key={track.label} className="network-card rounded-2xl p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="eyebrow">{track.label}</p>
                <h2 className="mt-2 text-2xl font-semibold">{track.title}</h2>
              </div>
              <span className="rounded-full border px-3 py-1 font-mono text-xs text-muted-foreground">{track.note}</span>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {track.domains.map(([domain, weight]) => (
                <div key={domain} className="flex items-center justify-between rounded-lg border bg-background/35 px-3 py-2.5">
                  <span className="text-sm">{domain}</span>
                  <span className="font-mono text-xs text-primary">{weight}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="network-card rounded-2xl p-5 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div>
            <p className="eyebrow">Recommended session / 45 minutes</p>
            <h2 className="mt-2 text-2xl font-semibold">A repeatable study loop</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Learn one concept, configure it, verify it, then explain the failure mode. That sequence turns
              memorized commands into interview-ready troubleshooting skills.
            </p>
          </div>
          <ol className="grid gap-3 sm:grid-cols-4">
            {[
              ["10 min", "Learn", "Read one focused objective."],
              ["15 min", "Configure", "Type the small command set."],
              ["10 min", "Verify", "Read show-command output."],
              ["10 min", "Test", "Answer and review five items."],
            ].map(([time, title, text], index) => (
              <li key={title} className="rounded-xl border bg-background/35 p-4">
                <div className="flex items-center justify-between">
                  <CheckCircle2 className="size-4 text-emerald-400" />
                  <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
                </div>
                <p className="mt-4 font-semibold">{title}</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-primary">
                  <Clock3 className="size-3" /> {time}
                </p>
                <p className="mt-2 text-sm leading-5 text-muted-foreground">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <p className="pb-2 text-center text-xs leading-5 text-muted-foreground">
        Independent study resource. All practice items are original and are not copied from Cisco exams.
      </p>
    </div>
  );
}
