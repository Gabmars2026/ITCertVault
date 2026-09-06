import { ccnaTicketCatalog } from "./ccna-ticket-catalog";

export type CcnaTicketDifficulty =
  | "Network Support / Help Desk"
  | "Junior Network Technician"
  | "Junior Network Engineer"
  | "Advanced CCNA Troubleshooting";

export type CcnaWorkplaceScenario = {
  id: number;
  ticketNumber: string;
  difficulty: CcnaTicketDifficulty;
  domain: string;
  title: string;
  companyEnvironment: string;
  topology: string;
  complaint: string;
  symptoms: string[];
  cliOutput: string;
  whatChanged: string;
  clues: string[];
  investigateFirst: string[];
  commandsToRun: string[];
  diagnosisPrompt: string;
  rootCause: string;
  troubleshootingProcess: string[];
  fixCommands: string[];
  verificationCommands: string[];
  expectedOutput: string;
  whyItHappened: string;
  prevention: string[];
  productionTicketNotes: string[];
};

type Playbook = {
  topology: string;
  investigate: [string, string, string, string, string];
  commands: string[];
  verify: string[];
  mechanism: string;
};

const companies = [
  "Northstar Dental Group — two-building small enterprise using Catalyst access switches, centralized DHCP/DNS and a routed WAN edge.",
  "Prairie Logistics — warehouse users, scanners, IP phones and branch connectivity with a small network operations team.",
  "Summit Community College — classroom and staff VLANs, wireless access points and a collapsed-core campus design.",
  "Redwood Retail — headquarters plus small stores with Cisco switching, Wi-Fi, DHCP, NAT and secure remote management.",
  "Mercury Health Clinic — clinical workstations, phones, printers and segmented wired/wireless networks with strict uptime needs.",
  "Atlas Accounting — office campus with voice/data access ports, centralized services and an Internet edge router.",
  "Cobalt Manufacturing — plant and office networks using copper/fiber access, VLAN segmentation and routed site links.",
  "Harbor County Services — municipal offices connected through static/OSPF routing and centralized management services.",
  "Vector Media — creative office with high-bandwidth workstations, Wi-Fi, server VLANs and Internet services.",
  "Evergreen Legal — security-focused small enterprise with AAA, SSH-only administration and layered access controls.",
  "Metro Transit Depot — operational workstations, cameras, phones and a redundant but compact campus network.",
  "Pioneer Labs — dual-stack IPv4/IPv6 lab and office network with virtualized servers and network automation pilots.",
  "Silverline Hotels — guest/corporate wireless, small branch routers and centralized DNS/DHCP services.",
  "Granite Construction — branch offices with VPN connectivity, IP phones, printers and cloud-managed infrastructure.",
  "Beacon Services — distributed offices using controller/cloud management, APIs and basic infrastructure-as-code workflows."
];

const sites = ["HQ", "Building A", "Building B", "Branch East", "Branch West", "Warehouse", "Training Center", "Clinic", "Operations Office", "Remote Site"];

const physical: Playbook = {
  topology: "Endpoint → patch cable / copper or fiber link → Catalyst access interface → upstream switch/router.",
  investigate: [
    "Confirm the exact endpoint, switch port, link state and whether the failure is constant or intermittent.",
    "Check speed/duplex, CRC/FCS/input errors, link flaps, transceiver state and PoE before changing VLAN or routing configuration.",
    "Compare both ends of the physical link and test with one known-good cable, optic or port at a time.",
    "Check recent desk moves, patch-panel work, power changes and environmental conditions.",
    "Clear counters only after recording the before-state, then verify whether errors return under normal load."
  ],
  commands: ["show interfaces", "show interfaces status", "show interfaces counters errors", "show logging | include LINK|LINEPROTO|SFP|GBIC|ILPOWER", "show power inline", "show interfaces transceiver detail"],
  verify: ["show interfaces status", "show interfaces counters errors", "show logging | last 50"],
  mechanism: "A physical Ethernet fault can leave link state up while corrupting frames, negotiating the wrong speed/duplex, losing optical power or exhausting PoE capacity."
};

const layer2: Playbook = {
  topology: "Endpoint → access VLAN / secure edge port → 802.1Q trunk or EtherChannel → STP root/distribution → default gateway.",
  investigate: [
    "Identify the endpoint MAC, switch port and expected access/voice VLAN before changing anything.",
    "Verify the VLAN exists locally and is carried on every required trunk in the path.",
    "Inspect MAC learning, STP state/protections and EtherChannel membership for the affected VLAN.",
    "Compare the failing port/uplink with a known-good port or peer switch.",
    "Review the most recent switch template, trunk, security or cabling change and preserve pre-change evidence."
  ],
  commands: ["show vlan brief", "show interfaces switchport", "show interfaces trunk", "show mac address-table dynamic", "show spanning-tree", "show etherchannel summary", "show port-security interface"],
  verify: ["show vlan brief", "show interfaces trunk", "show spanning-tree", "show mac address-table dynamic"],
  mechanism: "Layer 2 service depends on consistent VLAN classification, MAC learning, loop-free STP forwarding and compatible trunk/EtherChannel state at each hop."
};

const routing: Playbook = {
  topology: "Client or LAN gateway → routed interface / static route / OSPF → routing table → next hop → remote subnet.",
  investigate: [
    "Verify source IP, mask, gateway and direct next-hop reachability first.",
    "Inspect the exact route for the destination and compare longest-prefix match, administrative distance and next-hop resolution.",
    "For OSPF, check interface participation, area, passive state, timers, router ID and neighbor state before resetting the process.",
    "Trace forward and return paths separately; a correct forward route does not prove the reply can return.",
    "Compare routing state with the change record and a working prefix/site."
  ],
  commands: ["show ip interface brief", "show ip route", "show ip route <destination>", "show ip protocols", "show ip ospf neighbor", "show ip ospf interface brief", "traceroute <destination>"],
  verify: ["show ip route", "show ip ospf neighbor", "traceroute <destination>"],
  mechanism: "IP forwarding requires correct addressing, a usable route selected by longest-prefix match/administrative distance, a reachable next hop and a valid return path."
};

const ipv6: Playbook = {
  topology: "IPv6 endpoint → Neighbor Discovery / RA → IPv6 SVI/router → IPv6 route table → remote dual-stack service.",
  investigate: [
    "Verify the host IPv6 address, prefix length, link-local address and learned default router.",
    "Check Router Advertisements, Neighbor Discovery and whether IPv6 routing is enabled on the gateway.",
    "Confirm the intended /64 and compare configured/advertised prefixes with IPAM.",
    "Inspect IPv6 neighbors and the exact route/next hop, including exit interface when link-local next hops are used.",
    "Test DNS AAAA resolution separately from raw IPv6 reachability."
  ],
  commands: ["show ipv6 interface brief", "show ipv6 interface", "show ipv6 neighbors", "show ipv6 route", "ping ipv6 <destination>", "traceroute ipv6 <destination>"],
  verify: ["show ipv6 interface", "show ipv6 neighbors", "show ipv6 route"],
  mechanism: "IPv6 depends on correct prefixing, Router Advertisements/Neighbor Discovery, unique addressing and a valid IPv6 forwarding path; IPv4 success does not prove IPv6 health."
};

const services: Playbook = {
  topology: "Client subnet → SVI/router relay or ACL → DHCP/DNS/NAT service → application or Internet destination.",
  investigate: [
    "Capture the client's actual IP address, mask, gateway and DNS settings before changing the network.",
    "Prove raw IP reachability before treating the problem as DNS or an application outage.",
    "Check DHCP relay/pool state, DNS records, NAT roles/translations and ACL hit counters at the correct boundary.",
    "Compare the affected subnet/service with a known-good client VLAN or server record.",
    "Verify both the request path and the reply/return path using the actual protocol and port."
  ],
  commands: ["show ip interface brief", "show ip route", "show ip dhcp binding", "show ip dhcp pool", "show access-lists", "show ip nat statistics", "show ip nat translations"],
  verify: ["show ip dhcp binding", "show access-lists", "show ip nat translations", "show ip route"],
  mechanism: "A client can have working Layer 2 and routing while still failing because DHCP options, DNS data, NAT classification, ACL direction/order or application transport is wrong."
};

const wireless: Playbook = {
  topology: "Wireless client → AP → WLAN/SSID policy → wired VLAN/uplink → DHCP/DNS/AAA/controller → application.",
  investigate: [
    "Separate SSID visibility, RF association, authentication, DHCP, DNS and application reachability into individual checkpoints.",
    "Check client RSSI/SNR/retries and confirm which AP/radio the client is actually using.",
    "Verify the WLAN-to-VLAN/policy mapping and the matching wired switch path.",
    "Check AP management/controller reachability and AAA transport independently of RF signal strength.",
    "Compare one failing client/AP with a nearby working client/AP before changing channels or power."
  ],
  commands: ["show wireless client summary", "show ap summary", "show wlan summary", "show interfaces trunk", "show aaa servers", "show logging | include CAPWAP|RADIUS|AUTH"],
  verify: ["show wireless client summary", "show ap summary", "show wlan summary", "show interfaces trunk"],
  mechanism: "Wireless service is a chain of RF, association, authentication, segmentation, addressing and application dependencies; a strong signal alone does not mean the network path is correct."
};

const security: Playbook = {
  topology: "Endpoint/admin → secure access port / ACL / AAA policy → routed or management boundary → approved service.",
  investigate: [
    "Prove basic Layer-1/Layer-2/Layer-3 reachability before changing security policy.",
    "Identify the exact control enforcing the decision: ACL, port security, DHCP snooping, DAI, RA Guard, AAA or VTY policy.",
    "Inspect direction, sequence/order, source identity, counters and trusted/untrusted interface roles.",
    "For AAA, test server reachability, source address, shared secret/time and local fallback independently.",
    "Use the narrowest reversible fix and never disable a protection globally merely to make the symptom disappear."
  ],
  commands: ["show access-lists", "show port-security", "show ip dhcp snooping", "show ip arp inspection", "show aaa servers", "show authentication sessions", "show logging | include AUTH|SECURE|DHCP_SNOOPING|ARP"],
  verify: ["show access-lists", "show port-security", "show aaa servers", "show logging | last 50"],
  mechanism: "Security controls are ordered policy decisions; correct troubleshooting separates transport from authorization and uses counters/state to prove which control rejected the flow."
};

const operations: Playbook = {
  topology: "Network device → secure management interface/VRF → SSH/AAA/NTP/SNMP/syslog/controller or cloud management platform.",
  investigate: [
    "Verify the device management IP, routing context and source interface used by the management service.",
    "Check SSH/AAA prerequisites and synchronized time before changing credentials.",
    "Inspect protocol-specific configuration/counters instead of using ping as the only test.",
    "Confirm collector/controller inventory still references the current management address and approved credentials.",
    "Preserve a working console/local fallback session before modifying remote management authentication."
  ],
  commands: ["show ip ssh", "show users", "show aaa servers", "show ntp status", "show ntp associations", "show logging", "show snmp", "show ip route"],
  verify: ["show ip ssh", "show ntp status", "show logging", "show aaa servers"],
  mechanism: "Management systems depend on correct source identity, routing context, secure authentication, synchronized time and accurate inventory; a reachable device can still be operationally unmanaged."
};

const automation: Playbook = {
  topology: "Source of truth / script / Ansible / Terraform / REST client → controller or network API → managed device → verification loop.",
  investigate: [
    "Capture the exact HTTP method, URL, status code, response body, schema and target scope before retrying.",
    "Treat 4xx/5xx/authentication/retrieval failures as failures, never as empty or compliant state.",
    "Check JSON key names, pagination, token lifetime and asynchronous task IDs against the documented API.",
    "Use dry-run/read-only/canary scope before applying changes broadly.",
    "Compare intended state, before state and verified after state; do not trust a script's success message alone."
  ],
  commands: ["show running-config", "show logging | last 50", "show interfaces status", "show ip interface brief", "show users"],
  verify: ["show running-config", "show logging | last 50", "show interfaces status"],
  mechanism: "Safe automation distinguishes data retrieval, intended state, write execution and post-change verification, and it fails closed when scope or state is unknown."
};

const architecture: Playbook = {
  topology: "Access / distribution / WAN / controller or cloud-managed architecture with explicit management, VLAN, routing and failure-domain boundaries.",
  investigate: [
    "Draw the actual device/link/service path and identify any shared physical, power or upstream failure domain.",
    "Separate data-plane, control/management-plane and service dependencies.",
    "Verify VLAN/trunk/routing/VRF context at each architectural boundary.",
    "Test the supposed alternate path or controller reachability instead of assuming redundancy exists because two links are visible.",
    "Compare the deployed topology with the intended design/source of truth before making a local workaround permanent."
  ],
  commands: ["show cdp neighbors detail", "show lldp neighbors detail", "show interfaces trunk", "show ip route", "show ip route vrf Mgmt-vrf", "show spanning-tree root", "show ip interface brief"],
  verify: ["show cdp neighbors detail", "show ip route", "show interfaces trunk", "show spanning-tree root"],
  mechanism: "A network is only redundant or manageable when alternate paths are independent, the correct routing/VRF context exists and controller/management inventory matches the deployed device."
};

function playbookFor(domain: string): Playbook {
  if (/Physical/i.test(domain)) return physical;
  if (/IPv6/i.test(domain)) return ipv6;
  if (/Wireless/i.test(domain)) return wireless;
  if (/VLAN|trunk|STP|EtherChannel|Switching|MAC|ARP/i.test(domain)) return layer2;
  if (/OSPF|Static routes|default routes|path selection|IPv4 addressing|subnetting/i.test(domain)) return routing;
  if (/DHCP|DNS|NAT|PAT|access control|QoS|VPN|transport/i.test(domain)) return services;
  if (/Layer 2 security|AAA|TACACS|RADIUS/i.test(domain)) return security;
  if (/Device management|SSH|NTP|syslog|SNMP/i.test(domain)) return operations;
  if (/Automation|API|JSON|configuration management/i.test(domain)) return automation;
  if (/architecture|controller|VRF|operational design/i.test(domain)) return architecture;
  return routing;
}

function difficultyFor(id: number): CcnaTicketDifficulty {
  if (id <= 50) return "Network Support / Help Desk";
  if (id <= 100) return "Junior Network Technician";
  if (id <= 150) return "Junior Network Engineer";
  return "Advanced CCNA Troubleshooting";
}

function splitCommands(block: string): string[] {
  return block.split("\n").map((line) => line.trimEnd()).filter(Boolean);
}

export const ccnaWorkplaceScenarios: CcnaWorkplaceScenario[] = ccnaTicketCatalog.map((base, index) => {
  const id = index + 1;
  const pb = playbookFor(base.domain);
  const site = sites[index % sites.length];
  const difficulty = difficultyFor(id);
  const ticketNumber = `CCNA-${String(id).padStart(3, "0")}`;
  const fixCommands = splitCommands(base.fix);
  const verificationCommands = Array.from(new Set([...pb.verify, ...pb.commands.slice(0, 2)])).slice(0, 6);
  const commandsToRun = Array.from(new Set([...pb.commands, ...verificationCommands]));

  return {
    id,
    ticketNumber,
    difficulty,
    domain: base.domain,
    title: base.title,
    companyEnvironment: `${companies[index % companies.length]} Incident location: ${site}. Treat the ticket as production: capture evidence before changes, protect management access and verify the user's original transaction before closure.`,
    topology: `${pb.topology} ${ticketNumber} is scoped to the ${site} path and the devices/services shown in the evidence.`,
    complaint: base.complaint,
    symptoms: [
      base.complaint,
      `The issue began after: ${base.change}`,
      `At least one nearby comparison user, VLAN, path or service is still working, so scope the failure before assuming a site-wide outage.`,
      "Do not clear counters, reload devices, remove ACLs or disable security protections until the current evidence is recorded."
    ],
    cliOutput: base.evidence,
    whatChanged: base.change,
    clues: [
      "Start with what still works; that usually tells you which layer or dependency is not the primary fault.",
      "Configured state is not proof of operational state. Use counters, tables and neighbor/forwarding output.",
      "Test the original source-to-destination transaction using the real protocol, address family, VLAN and port number.",
      "Prefer the smallest reversible change that corrects the proven fault instead of restarting unrelated services."
    ],
    investigateFirst: pb.investigate,
    commandsToRun,
    diagnosisPrompt: `Before opening Show Answer, write your ${ticketNumber} diagnosis: failed layer/domain, likely root cause, two supporting facts from the evidence, your next non-disruptive test, the safest repair, a rollback trigger and how you will prove the user problem is solved.`,
    rootCause: base.rootCause,
    troubleshootingProcess: [
      `Confirm scope at ${site}: affected user/device, source IP/MAC/VLAN, destination and exact failing application or protocol.`,
      `Run a working comparison and collect ${commandsToRun.slice(0, 3).join(", ")} before making changes.`,
      "Walk the path from the lowest relevant layer upward and stop at the first state that differs from the known-good design.",
      `Correlate that failed state with the recent change: ${base.change}`,
      `Prove the root cause with operational evidence: ${base.rootCause}`,
      "Apply the smallest approved corrective action while preserving console/management access and a rollback path.",
      `Run ${verificationCommands.join(", ")} and repeat the user's exact failed transaction several times.`,
      "Check one adjacent service/path so the repair did not create a new outage, then update monitoring/source-of-truth and close the production ticket."
    ],
    fixCommands,
    verificationCommands,
    expectedOutput: `The failing condition in the captured evidence is no longer present. ${verificationCommands[0]} and ${verificationCommands[1] ?? verificationCommands[0]} show the intended healthy state, the original user transaction succeeds repeatedly, relevant error/drop/violation counters stop increasing, and a nearby comparison service remains healthy.`,
    whyItHappened: `${pb.mechanism} In this ticket the specific production fault was: ${base.rootCause}`,
    prevention: [
      "Update the switch/router/controller template or source-of-truth so the corrected state is used during future moves, replacements and deployments.",
      "Add a pre-change and post-change check that directly detects this failure mode before the maintenance ticket is closed.",
      "Monitor the relevant interface/protocol/service counters and document the expected healthy baseline for junior engineers.",
      "Keep addressing, VLAN, management, AAA and cabling records current so troubleshooting starts from accurate inventory."
    ],
    productionTicketNotes: [
      `Impact and scope: ${base.complaint}`,
      `Recent change or trigger: ${base.change}`,
      `Confirmed root cause: ${base.rootCause}`,
      `Corrective action: ${fixCommands.join(" ; ")}`,
      `Verification: ${verificationCommands.join(" ; ")} plus the original user/application test.`,
      "Attach before/after CLI or client output, timestamps, affected device/interface/VLAN/subnet IDs, change reference and any monitoring screenshots/counters.",
      "Record prevention owner/follow-up if template, IPAM, documentation, cabling or monitoring needs correction."
    ]
  };
});

export const ccnaScenarioDomains = ["All", ...Array.from(new Set(ccnaWorkplaceScenarios.map((item) => item.domain)))];
export const ccnaScenarioDifficulties = ["All", "Network Support / Help Desk", "Junior Network Technician", "Junior Network Engineer", "Advanced CCNA Troubleshooting"];

export function getCcnaScenario(id: number) {
  return ccnaWorkplaceScenarios.find((item) => item.id === id);
}

export const ccnaDifficultyCounts = ccnaWorkplaceScenarios.reduce<Record<string, number>>((counts, item) => {
  counts[item.difficulty] = (counts[item.difficulty] ?? 0) + 1;
  return counts;
}, {});

function requireCcna(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`CCNA ticket validation failed: ${message}`);
}

requireCcna(ccnaWorkplaceScenarios.length === 200, `expected 200 tickets, got ${ccnaWorkplaceScenarios.length}`);
requireCcna(new Set(ccnaWorkplaceScenarios.map((item) => item.id)).size === 200, "ticket IDs are not unique");
requireCcna(new Set(ccnaWorkplaceScenarios.map((item) => item.ticketNumber)).size === 200, "ticket numbers are not unique");
requireCcna(new Set(ccnaWorkplaceScenarios.map((item) => item.title)).size === 200, "ticket titles are not unique");
requireCcna(new Set(ccnaWorkplaceScenarios.map((item) => item.rootCause)).size === 200, "root causes are not unique");
requireCcna(ccnaDifficultyCounts["Network Support / Help Desk"] === 50, "tickets 001-050 must be support tier");
requireCcna(ccnaDifficultyCounts["Junior Network Technician"] === 50, "tickets 051-100 must be technician tier");
requireCcna(ccnaDifficultyCounts["Junior Network Engineer"] === 50, "tickets 101-150 must be junior engineer tier");
requireCcna(ccnaDifficultyCounts["Advanced CCNA Troubleshooting"] === 50, "tickets 151-200 must be advanced CCNA tier");
for (const item of ccnaWorkplaceScenarios) {
  requireCcna(item.investigateFirst.length === 5, `${item.ticketNumber} must have exactly five first investigations`);
  requireCcna(item.commandsToRun.length >= 5, `${item.ticketNumber} needs at least five evidence commands`);
  requireCcna(item.symptoms.length >= 4, `${item.ticketNumber} symptoms are incomplete`);
  requireCcna(item.troubleshootingProcess.length >= 8, `${item.ticketNumber} troubleshooting process is incomplete`);
  requireCcna(item.verificationCommands.length >= 3, `${item.ticketNumber} verification is incomplete`);
  requireCcna(item.productionTicketNotes.length >= 7, `${item.ticketNumber} documentation section is incomplete`);
  requireCcna(item.cliOutput.trim().length > 25, `${item.ticketNumber} evidence is too short`);
}
