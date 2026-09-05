import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpenCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Mail,
  Network,
  Route,
  ServerCog,
  ShieldCheck,
  TerminalSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const credentials = [
  "Cisco CCNA",
  "Cisco CCNP ENCOR exam",
  "CompTIA A+",
  "CompTIA Security+",
  "Microsoft AZ-900",
  "ITIL 4 Foundation",
  "CompTIA Project+",
];

const capabilities = [
  { icon: Route, title: "Routing & switching", text: "IPv4/IPv6, VLANs, STP, EtherChannel, OSPF, static routing, NAT, ACLs, and first-hop redundancy." },
  { icon: ShieldCheck, title: "Secure operations", text: "Device hardening, access control, Layer 2 protections, SSH, monitoring, and evidence-led troubleshooting." },
  { icon: ServerCog, title: "Infrastructure support", text: "Hands-on support across network devices, servers, endpoints, data-center workflows, tickets, and change documentation." },
  { icon: TerminalSquare, title: "Automation mindset", text: "Reusable IOS templates, structured validation, JSON/API concepts, and repeatable operational checks." },
];

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <section className="network-card relative overflow-hidden rounded-2xl p-5 sm:p-7">
        <div className="trace-line absolute inset-x-0 top-0 h-px" />
        <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="eyebrow">Gianni Majorenos / Network Engineer</p>
            <h1 className="mt-3 max-w-4xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Network operations grounded in clean fundamentals.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
              I bring infrastructure-support discipline into network engineering: document the state, isolate the
              fault, make the smallest safe change, and verify the result. This lab is both my study platform and a
              working demonstration of that approach.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <a href="mailto:majorenosg365@outlook.com"><Mail /> Contact Gianni</a>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/topologies">View topology work <ArrowRight /></Link>
              </Button>
            </div>
          </div>
          <div className="grid size-36 shrink-0 place-items-center rounded-3xl border border-primary/30 bg-primary/5 sm:size-44">
            <div className="text-center">
              <Network className="mx-auto size-12 text-primary" />
              <p className="mt-3 font-mono text-sm font-semibold">GM / NETOPS</p>
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">BUILD · VERIFY · IMPROVE</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {capabilities.map((item) => (
          <article key={item.title} className="network-card rounded-2xl p-5">
            <item.icon className="size-5 text-primary" />
            <h2 className="mt-4 font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
        <article className="network-card rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Award className="size-5 text-primary" />
            <h2 className="text-xl font-semibold">Credentials</h2>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {credentials.map((credential) => <Badge key={credential} variant="secondary" className="px-3 py-1.5">{credential}</Badge>)}
          </div>
          <p className="mt-5 text-sm leading-6 text-muted-foreground">
            Precise status matters: ENCOR is the enterprise core exam and earns the Cisco Certified Specialist –
            Enterprise Core credential; it is also the core-exam requirement toward CCNP Enterprise.
          </p>
        </article>

        <article className="network-card rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <BriefcaseBusiness className="size-5 text-primary" />
            <h2 className="text-xl font-semibold">What I bring to a network team</h2>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              "A methodical incident and ticketing workflow",
              "Clear diagrams, runbooks, and change records",
              "Hands-on Cisco IOS configuration practice",
              "A security-first approach to access and management",
              "Verification before and after every change",
              "Calm escalation with useful technical evidence",
            ].map((item) => (
              <div key={item} className="flex gap-2 rounded-xl border bg-background/35 p-3 text-sm leading-6">
                <CheckCircle2 className="mt-1 size-4 shrink-0 text-emerald-400" />{item}
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="network-card rounded-2xl p-5 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="flex items-center gap-2"><BookOpenCheck className="size-5 text-primary" /><p className="eyebrow">Portfolio in practice</p></div>
            <h2 className="mt-2 text-2xl font-semibold">This site shows the work, not just the keywords.</h2>
            <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
              The question bank, configuration library, drag-and-drop exercises, and topology labs turn the skills on
              a resume into artifacts a hiring manager or teammate can explore.
            </p>
          </div>
          <Button size="lg" asChild><Link href="/scripts">Explore configurations <ArrowRight /></Link></Button>
        </div>
      </section>
    </div>
  );
}
