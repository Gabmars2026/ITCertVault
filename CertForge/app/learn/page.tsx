import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Braces,
  CheckCircle2,
  ExternalLink,
  FlaskConical,
  SearchCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ccnaDomains = [
  {
    domain: "1.0 Network Fundamentals",
    weight: "20%",
    topics: ["Network devices, cabling, and topologies", "IPv4 subnetting and private ranges", "IPv6 addressing, TCP, UDP, and wireless principles"],
    lab: "Address a dual-stack LAN and prove end-to-end reachability.",
  },
  {
    domain: "2.0 Network Access",
    weight: "20%",
    topics: ["VLANs, access ports, trunks, and CDP/LLDP", "EtherChannel and Rapid PVST+", "Wireless architectures, AP modes, and secure WLAN access"],
    lab: "Build two VLANs across an LACP trunk and verify STP roles.",
  },
  {
    domain: "3.0 IP Connectivity",
    weight: "25%",
    topics: ["Routing-table decisions and administrative distance", "Static, default, and floating routes", "Single-area OSPFv2 and first-hop redundancy"],
    lab: "Trace the best path, then repair a broken OSPF adjacency.",
  },
  {
    domain: "4.0 IP Services",
    weight: "10%",
    topics: ["NAT, DHCP, DNS, NTP, SNMP, and syslog", "QoS forwarding behavior", "Secure remote access with SSH"],
    lab: "Configure DHCP and PAT, then verify translations and leases.",
  },
  {
    domain: "5.0 Security Fundamentals",
    weight: "15%",
    topics: ["Threats, hardening, and identity concepts", "ACLs, Layer 2 protections, and port security", "AAA, 802.1X, VPN, and WLAN security"],
    lab: "Harden an access switch without blocking approved users.",
  },
  {
    domain: "6.0 Automation & Programmability",
    weight: "10%",
    topics: ["Controller-based networking and overlays", "REST APIs, JSON, and configuration management", "Automation and AI-assisted operations concepts"],
    lab: "Read JSON interface data and map it to an IOS verification command.",
  },
];

const encorDomains = [
  {
    domain: "1.0 Architecture",
    weight: "15%",
    topics: ["Enterprise design principles and resiliency", "WLAN, SD-WAN, and SD-Access design", "QoS, hardware, and software switching mechanisms"],
    lab: "Choose a resilient campus design and defend each boundary.",
  },
  {
    domain: "2.0 Virtualization",
    weight: "10%",
    topics: ["Device, data-path, and network virtualization", "VRF, GRE, IPsec, LISP, and VXLAN", "Control and data-plane separation"],
    lab: "Trace tenant traffic through an overlay and underlay.",
  },
  {
    domain: "3.0 Infrastructure",
    weight: "30%",
    topics: ["Advanced Layer 2 and wireless", "OSPF, EIGRP, BGP, route policy, and redundancy", "Multicast, QoS, and network services"],
    lab: "Troubleshoot a campus path from access port to routed core.",
  },
  {
    domain: "4.0 Network Assurance",
    weight: "10%",
    topics: ["Flexible NetFlow, SPAN, IPSLA, and telemetry", "Cisco Catalyst Center assurance concepts", "Structured troubleshooting and root-cause isolation"],
    lab: "Use evidence from four tools to isolate one faulty hop.",
  },
  {
    domain: "5.0 Security",
    weight: "20%",
    topics: ["Device access control and infrastructure security", "TrustSec, MACsec, and segmentation", "Control-plane and REST API security"],
    lab: "Apply least privilege across management, control, and data planes.",
  },
  {
    domain: "6.0 Automation",
    weight: "15%",
    topics: ["Python, JSON, YANG, NETCONF, and RESTCONF", "EEM, orchestration, and APIs", "Interpret automation scripts and data structures"],
    lab: "Turn a manual validation checklist into a repeatable workflow.",
  },
];

function Curriculum({ items }: { items: typeof ccnaDomains }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {items.map((item) => (
        <article key={item.domain} className="network-card rounded-2xl p-5">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-lg font-semibold">{item.domain}</h2>
            <Badge variant="outline" className="shrink-0 font-mono text-primary">
              {item.weight}
            </Badge>
          </div>
          <ul className="mt-4 space-y-2">
            {item.topics.map((topic) => (
              <li key={topic} className="flex gap-2 text-sm leading-6 text-muted-foreground">
                <CheckCircle2 className="mt-1 size-4 shrink-0 text-emerald-400" />
                {topic}
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-xl border bg-background/40 p-3 text-sm">
            <span className="font-mono text-xs text-primary">LAB OUTCOME</span>
            <p className="mt-1.5 leading-6">{item.lab}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function LearnPage() {
  const stages = [
    { icon: BookOpenCheck, number: "01", title: "Learn", text: "Build a clean mental model for one exam objective." },
    { icon: Braces, number: "02", title: "Configure", text: "Type a focused IOS building block and annotate it." },
    { icon: SearchCheck, number: "03", title: "Verify", text: "Use show commands to prove the intended state." },
    { icon: FlaskConical, number: "04", title: "Troubleshoot", text: "Break one variable, form a hypothesis, and restore service." },
  ];

  return (
    <div className="space-y-6">
      <section className="network-card rounded-2xl p-5 sm:p-7">
        <p className="eyebrow">Blueprint-driven curriculum</p>
        <div className="mt-3 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">From packet fundamentals to enterprise core</h1>
            <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
              Follow the official domain structure, but learn each objective as an operational skill: explain it,
              configure it, verify it, and troubleshoot it.
            </p>
          </div>
          <Button asChild>
            <Link href="/practice">Practice this material <ArrowRight /></Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stages.map((stage) => (
          <article key={stage.title} className="network-card rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <stage.icon className="size-5 text-primary" />
              <span className="font-mono text-xs text-muted-foreground">{stage.number}</span>
            </div>
            <h2 className="mt-4 font-semibold">{stage.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{stage.text}</p>
          </article>
        ))}
      </section>

      <Tabs defaultValue="ccna" className="gap-5">
        <TabsList className="h-auto w-full justify-start rounded-xl border bg-card p-1 sm:w-fit">
          <TabsTrigger value="ccna" className="px-4 py-2.5">200-301 CCNA v1.1</TabsTrigger>
          <TabsTrigger value="encor" className="px-4 py-2.5">350-401 ENCOR v1.1</TabsTrigger>
        </TabsList>
        <TabsContent value="ccna">
          <div className="mb-4 rounded-xl border border-primary/25 bg-primary/5 p-4 text-sm leading-6 text-muted-foreground">
            <strong className="text-foreground">Current-version note:</strong> CCNA v1.1 remains active through
            February 2, 2027. Cisco lists CCNA v2.0 beginning February 3, 2027; this lab clearly labels its v1.1 content.
          </div>
          <Curriculum items={ccnaDomains} />
        </TabsContent>
        <TabsContent value="encor"><Curriculum items={encorDomains} /></TabsContent>
      </Tabs>

      <section className="network-card rounded-2xl p-5 sm:p-6">
        <p className="eyebrow">Authoritative references</p>
        <h2 className="mt-2 text-xl font-semibold">Keep the study map tied to Cisco</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <a href="https://www.cisco.com/site/us/en/learn/training-certifications/certifications/enterprise/ccna/index.html" target="_blank" rel="noreferrer">
              CCNA exam page <ExternalLink />
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://learningcontent.cisco.com/documents/marketing/exam-topics/200-301-CCNA-v1.1.pdf" target="_blank" rel="noreferrer">
              CCNA v1.1 topics <ExternalLink />
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://www.cisco.com/site/us/en/learn/training-certifications/exams/encor.html" target="_blank" rel="noreferrer">
              ENCOR exam page <ExternalLink />
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
