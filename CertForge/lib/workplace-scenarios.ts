import { ccnpTicketCatalog } from "./ccnp-ticket-catalog";

export type TicketDifficulty =
  | "Junior Network Engineer"
  | "Network Engineer"
  | "Senior Network Engineer"
  | "Advanced Enterprise Engineer"
  | "Expert / Multi-Failure Production Incident";

export type WorkplaceScenario = {
  id: number;
  ticketNumber: string;
  difficulty: TicketDifficulty;
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
  multiFailure: boolean;
};

type Playbook = {
  topology: string;
  investigate: [string, string, string, string, string];
  commands: string[];
  verify: string[];
  mechanism: string;
};

const companies = [
  "Northstar Regional Bank — redundant Catalyst campus, dual Internet edges, centralized AAA and monitoring.",
  "Mercury Health Systems — 24×7 hospital network with clinical VLANs, wireless mobility and strict change control.",
  "Prairie Logistics — warehouses with scanners, voice, industrial endpoints and SD-WAN branches.",
  "Apex Manufacturing — multi-site plant network with campus switching, OT segmentation and redundant WAN.",
  "Cobalt Insurance — hybrid-work enterprise with two data centers, VPN users and SaaS dependencies.",
  "Summit University — large campus with faculty, labs, voice and controller-based wireless.",
  "Redwood Retail Group — headquarters plus branches using Catalyst, SD-WAN, centralized DNS/DHCP and security.",
  "Orion Financial Services — regulated dual-ISP enterprise with BGP, FHRP, TACACS+ and OOB management.",
  "Harbor County Government — civic WAN connecting offices and data centers with routed campus blocks.",
  "BlueRiver Energy — distributed enterprise with ruggedized access, fiber, VPN and segmented operations.",
  "Vector Media — high-bandwidth campus with QoS, large file movement and redundant core switching.",
  "Evergreen Legal — security-focused firm with wired 802.1X, wireless, VPN and centralized identity.",
  "Pioneer BioTech — dual-stack research campus with segmented labs and high-throughput data paths.",
  "Metro Transit Authority — operations WAN with depots, branch routers, wireless and telemetry.",
  "Atlas E-Commerce — 24×7 multihomed edge with BGP, NAT and aggressive availability targets.",
  "Silverline Hotels — remote properties using SD-WAN, guest/corporate segmentation and wireless.",
  "Granite Construction — temporary and permanent sites connected through VPN/SD-WAN and Catalyst infrastructure.",
  "Horizon Aerospace — controlled engineering environment with strict segmentation and audited automation.",
  "Crescent Call Centers — latency-sensitive voice operations with QoS, AAA and multiple carriers.",
  "Beacon Public Cloud Services — enterprise operations team managing campus, APIs and model-driven telemetry."
];

const sites = ["HQ", "Building A", "Building B", "Data Center 1", "Data Center 2", "Branch East", "Branch West", "Warehouse", "Operations Center", "DR Site"];

const switching: Playbook = {
  topology: "Endpoint → Catalyst access → 802.1Q/LACP uplink → multilayer distribution SVI → enterprise core.",
  investigate: [
    "Confirm the endpoint/port, expected data/voice VLAN and exact failed flow.",
    "Verify VLAN existence plus access/trunk/native-VLAN state on every switch in the path.",
    "Inspect STP state, EtherChannel membership and MAC learning before changing Layer 3.",
    "Check the SVI/FHRP/default-gateway state and compare with a working VLAN.",
    "Review the most recent change and capture pre-change operational evidence for rollback."
  ],
  commands: ["show vlan brief", "show interfaces trunk", "show interfaces switchport", "show spanning-tree", "show etherchannel summary", "show mac address-table dynamic"],
  verify: ["show interfaces trunk", "show spanning-tree", "show mac address-table dynamic"],
  mechanism: "Layer-2 forwarding depends on consistent VLAN identity, loop-free topology and compatible logical/physical interface state at every hop."
};

const routing: Playbook = {
  topology: "Branch/campus routed interface → IGP/BGP control plane → RIB/CEF → enterprise core/WAN → remote prefix.",
  investigate: [
    "Prove direct IP reachability and inspect the exact neighbor/adjacency state.",
    "Compare routing protocol parameters on both peers instead of resetting the process first.",
    "Trace the affected prefix through protocol database/topology, RIB and CEF/FIB.",
    "Verify next-hop resolution and return path as separate checkpoints.",
    "Inspect filtering, summarization, redistribution, metrics and the change timeline."
  ],
  commands: ["show ip route", "show ip cef", "show ip protocols", "show logging | include OSPF|EIGRP|BGP|DUAL", "traceroute 8.8.8.8"],
  verify: ["show ip route", "show ip cef", "traceroute 8.8.8.8"],
  mechanism: "A healthy adjacency is only one state. A usable path also needs correct policy, route installation, next-hop resolution, forwarding and a return path."
};

const services: Playbook = {
  topology: "Client VLAN → routed gateway/relay/security edge → DHCP/DNS/NAT/application or Internet service.",
  investigate: [
    "Verify the client's address, prefix, gateway and DNS actually in use.",
    "Prove raw IP reachability before blaming name resolution or the application.",
    "Trace relay/NAT/ACL policy and inspect state plus hit counters.",
    "Test from the gateway/source VRF to separate endpoint and network causes.",
    "Compare the affected scope, record or policy with a known-good VLAN/site."
  ],
  commands: ["show ip interface brief", "show ip route", "show access-lists", "show ip nat statistics", "show ip nat translations", "show ip dhcp binding"],
  verify: ["show ip route", "show access-lists", "show ip nat translations"],
  mechanism: "Addressing and application services are dependency chains; routing can be healthy while relay, policy, translation or name resolution is wrong."
};

const security: Playbook = {
  topology: "User/admin endpoint → access/security policy → routed boundary → identity/management/service systems.",
  investigate: [
    "Identify the exact security control processing the failed flow or session.",
    "Check policy order, direction, source identity/address and counters.",
    "Verify AAA/RADIUS/TACACS, time and certificate dependencies separately from transport.",
    "Prove Layer-2/Layer-3 reachability independently of authorization.",
    "Choose a least-risk test that proves policy rejection versus transport failure."
  ],
  commands: ["show access-lists", "show ip interface", "show aaa servers", "show authentication sessions", "show logging | include AAA|AUTH|DROP|DENY"],
  verify: ["show access-lists", "show aaa servers", "show logging | last 50"],
  mechanism: "Security controls are ordered stateful decisions. Correct diagnosis separates reachability, identity, authorization and enforcement before relaxing policy."
};

const qos: Playbook = {
  topology: "Application/voice endpoint → campus trust boundary → egress QoS/shaper → carrier → remote site.",
  investigate: [
    "Measure congestion, drops, latency/jitter and actual/provider bandwidth.",
    "Verify packet markings at the intended trust boundary.",
    "Check class-map hits plus service-policy interface and direction.",
    "Compare parent shaping rate with carrier CIR and child class allocations.",
    "Generate representative mixed traffic and watch live class counters."
  ],
  commands: ["show policy-map interface", "show class-map", "show policy-map", "show interfaces | include rate|drop", "show running-config | section policy-map"],
  verify: ["show policy-map interface", "show interfaces | include rate|drop", "show class-map"],
  mechanism: "QoS only acts when traffic is classified at the correct point and congestion occurs on the controlled egress resource."
};

const wireless: Playbook = {
  topology: "Wireless client → Catalyst AP/9800 → WLAN policy → wired access/distribution → AAA/DHCP/DNS/application.",
  investigate: [
    "Separate RF association, authentication, authorization, DHCP, DNS and application reachability.",
    "Inspect RSSI/SNR, retries, channel utilization and roam/auth timestamps.",
    "Verify WLAN → policy profile → VLAN/VN and the wired path.",
    "Check RADIUS/ISE reachability, certificates and synchronized time.",
    "Compare one failing AP/client with a nearby known-good AP/client."
  ],
  commands: ["show wireless client summary", "show wireless client mac-address <client> detail", "show ap summary", "show wlan summary", "show aaa servers"],
  verify: ["show wireless client summary", "show ap summary", "show wlan summary"],
  mechanism: "Successful association is not full service; RF, identity, segmentation, addressing and policy form separate stages."
};

const operations: Playbook = {
  topology: "IOS XE device → management VRF/network → NTP/SNMP/syslog/telemetry/assurance systems.",
  investigate: [
    "Confirm management-plane routing/VRF and source interface.",
    "Check synchronized time before correlating logs or certificates.",
    "Inspect protocol-specific counters/state instead of using ping alone.",
    "Compare collector-side identity, ACL and credentials with device configuration.",
    "Preserve evidence before clearing counters, sessions or caches."
  ],
  commands: ["show clock detail", "show ntp associations", "show ntp status", "show logging", "show snmp", "show ip route"],
  verify: ["show ntp status", "show logging", "show snmp"],
  mechanism: "Assurance tools require correct source identity, routing context, credentials/model and trustworthy time before their data can be trusted."
};

const automation: Playbook = {
  topology: "Source of truth/Python/controller API → Catalyst Center or IOS XE management plane → production devices.",
  investigate: [
    "Capture the request/response, status, schema/task ID and exact target scope.",
    "Never treat failed or unknown retrieval as empty/compliant state.",
    "Diff intended, before and running state before retrying or rolling back.",
    "Check pagination, asynchronous tasks, rate limits, idempotency and concurrency.",
    "Canary/read-only verify before changing additional production devices."
  ],
  commands: ["show running-config", "show archive config differences nvram:startup-config system:running-config", "show logging | last 50", "show interfaces status", "show users"],
  verify: ["show running-config", "show archive config differences nvram:startup-config system:running-config", "show logging | last 50"],
  mechanism: "Safe automation distinguishes retrieval, intent, change execution and verification, and it fails closed when state is unknown."
};

const hardware: Playbook = {
  topology: "Endpoint/upstream → cable/fiber/optic/PoE interface → Catalyst forwarding hardware → redundant path.",
  investigate: [
    "Check interface state and error deltas before changing Layer-3 configuration.",
    "Inspect transceiver light, FEC, speed/duplex and peer counters.",
    "Swap one suspect cable/optic/port at a time with known-good hardware.",
    "Check power, PoE, temperature and platform logs.",
    "Record counters, repair Layer 1, then prove counters stay stable under load."
  ],
  commands: ["show interfaces", "show interfaces counters errors", "show interfaces transceiver detail", "show inventory", "show environment all", "show logging | include LINK|GBIC|SFP|UDLD|ILPOWER"],
  verify: ["show interfaces counters errors", "show interfaces transceiver detail", "show environment all"],
  mechanism: "Physical degradation can leave link state up while corrupting frames, reducing optical margin, exhausting power or creating intermittent loss."
};

const design: Playbook = {
  topology: "Enterprise access/distribution/core or dual-WAN design with explicit Layer-2/Layer-3 and failure-domain boundaries.",
  investigate: [
    "State the business service and measurable availability/capacity requirement.",
    "Draw every device, link, provider and power failure domain involved.",
    "Identify Layer-2, Layer-3, gateway and policy boundaries.",
    "Test normal path, one failure at a time and remaining capacity after failure.",
    "Compare the current implementation with the documented intended architecture."
  ],
  commands: ["show cdp neighbors detail", "show lldp neighbors detail", "show spanning-tree root", "show standby brief", "show ip route", "show interfaces | include rate|drop"],
  verify: ["show ip route", "show standby brief", "show spanning-tree root"],
  mechanism: "Redundancy only protects a service when the alternate path is independent, converges predictably and has enough capacity."
};

function playbookFor(domain: string): Playbook {
  if (/VLAN|STP|RSTP|MST|EtherChannel|Inter-VLAN|multilayer/i.test(domain)) return switching;
  if (/OSPF|EIGRP|BGP|redistribution/i.test(domain)) return routing;
  if (/DHCP|DNS|NAT|IPv4|IPv6|VPN/i.test(domain)) return services;
  if (/AAA|security/i.test(domain)) return security;
  if (/QoS/i.test(domain)) return qos;
  if (/wireless/i.test(domain)) return wireless;
  if (/SNMP|Syslog|NTP|assurance/i.test(domain)) return operations;
  if (/SD-WAN|Catalyst Center|APIs|Python|automation/i.test(domain)) return automation;
  if (/Performance|hardware/i.test(domain)) return hardware;
  if (/Campus|WAN design/i.test(domain)) return design;
  return routing;
}

const expertSecondary = [
  { fault: "NTP is also unsynchronized, making syslog chronology misleading.", evidence: "CORE# show ntp status\nClock is unsynchronized, stratum 16", fix: "ntp server 10.250.10.10 prefer" },
  { fault: "The backup uplink is additionally missing one required VLAN from its allowed list.", evidence: "CORE# show interfaces trunk\nBackup uplink allowed list omits production VLAN", fix: "interface <backup-uplink>\n switchport trunk allowed vlan add <required-vlan>" },
  { fault: "A stale emergency static route masks the intended dynamic route during partial recovery.", evidence: "CORE# show ip route <affected-prefix>\nS <prefix> [1/0] via legacy next-hop", fix: "! Restore the intended dynamic route, then remove the emergency static route" },
  { fault: "One LACP member is also suspended by an interface-parameter mismatch.", evidence: "show etherchannel summary\nPo10(SU) ... Gi1/0/48(s)", fix: "! Correct the mismatched member configuration and rejoin it to the bundle" },
  { fault: "The monitoring source ACL also omits the newly migrated NMS address.", evidence: "show access-lists NMS-SOURCES\n<new NMS address absent>", fix: "! Add only the approved new NMS source to the management ACL" },
  { fault: "The failover path has an MTU 100 bytes lower than the primary path.", evidence: "ping <remote> size 1400 df-bit\n.....", fix: "! Align path/tunnel MTU or MSS and permit required PMTUD messages" },
  { fault: "HSRP/VRRP tracking also watches the wrong upstream object.", evidence: "show track 10\nTracked interface remains Up although the service path is failed", fix: "! Point FHRP tracking to the actual upstream/service dependency" },
  { fault: "A recent ACL change additionally blocks the protocol needed for recovery.", evidence: "show access-lists CHANGE-IN\nDeny counter for the affected control/application flow is increasing", fix: "! Insert the narrow approved permit before the broader deny" },
  { fault: "The secondary path is present but has insufficient QoS/shaping for the failover load.", evidence: "show policy-map interface\nclass-default drops increase rapidly on backup circuit", fix: "! Apply the validated backup-link shaper/QoS policy and capacity plan" },
  { fault: "The controller's intended configuration is stale and would re-push the failed state after a CLI-only repair.", evidence: "Controller compliance: Out-of-sync; intended template still contains failed configuration", fix: "! Reconcile the fix into source of truth/controller before re-enabling enforcement" },
  { fault: "A duplicate IPv4 address is intermittently changing ARP resolution on the same service path.", evidence: "show ip arp <gateway>\nMAC address alternates between two endpoints", fix: "! Remove/readdress the duplicate IP and clear only the affected stale ARP entry" },
  { fault: "The return path additionally resolves through the backup edge because of an incorrect BGP local-preference policy.", evidence: "show bgp ipv4 unicast <prefix>\nBest path uses backup edge with higher local preference", fix: "! Correct the bounded BGP policy and soft-refresh the affected neighbor/address family" },
  { fault: "One data-center DNS record still resolves the service to the retired server.", evidence: "nslookup service.corp.example\nAddress: retired server IP", fix: "! Correct the authoritative DNS record/TTL and validate resolution from affected clients" },
  { fault: "The DR management VRF has no route to the active AAA server.", evidence: "show ip route vrf Mgmt-vrf <AAA-IP>\n% Network not in table", fix: "! Restore the approved management-VRF route to AAA before relying on centralized login" },
  { fault: "A PoE power-budget shortage is rebooting one AP, creating a second intermittent symptom during the incident.", evidence: "show power inline\nRemaining power near zero; ILPOWER disconnect logs present", fix: "! Restore adequate/redundant PoE budget or rebalance powered endpoints" },
  { fault: "A route redistribution tag collision additionally filters one legitimate prefix family.", evidence: "show route-map REDIST\nDeny tag sequence shows matches for legitimate routes", fix: "! Assign a unique tag and correct loop-prevention policy for the affected source" },
  { fault: "The backup configuration was never saved and would revert the repair after a reload.", evidence: "show archive config differences nvram:startup-config system:running-config\nUnsaved repair lines present", fix: "copy running-config startup-config" },
  { fault: "The API workflow is also ignoring pagination, so the remediation scope is incomplete.", evidence: "HTTP response contains next cursor while script processed one page", fix: "# Follow server pagination/cursor until complete before evaluating or changing state" },
  { fault: "A marginal optic on the alternate path adds CRC errors only under load.", evidence: "show interfaces transceiver detail\nRx power at low warning threshold; CRC counter increasing", fix: "! Replace/repair the marginal optic/fiber and prove counters remain stable" },
  { fault: "A scheduled rollback reload is still armed after service restoration.", evidence: "show reload\nReload scheduled in less than one hour", fix: "reload cancel" }
];

function difficultyFor(id: number): TicketDifficulty {
  if (id <= 40) return "Junior Network Engineer";
  if (id <= 90) return "Network Engineer";
  if (id <= 140) return "Senior Network Engineer";
  if (id <= 180) return "Advanced Enterprise Engineer";
  return "Expert / Multi-Failure Production Incident";
}

function splitCommands(block: string): string[] {
  return block.split("\n").map((line) => line.trimEnd()).filter(Boolean);
}

export const workplaceScenarios: WorkplaceScenario[] = ccnpTicketCatalog.map((base, index) => {
  const id = index + 1;
  const difficulty = difficultyFor(id);
  const pb = playbookFor(base.domain);
  const site = sites[index % sites.length];
  const expert = id > 180 ? expertSecondary[id - 181] : null;
  const rootCause = expert ? `${base.rootCause} SECONDARY FAILURE: ${expert.fault}` : base.rootCause;
  const cliOutput = expert ? `${base.evidence}\n\n--- SECOND FAILURE EVIDENCE ---\n${expert.evidence}` : base.evidence;
  const fixCommands = [...splitCommands(base.fix), ...(expert ? splitCommands(expert.fix) : [])];
  const ticketNumber = `CCNP-${String(id).padStart(3, "0")}`;
  const symptoms = [
    base.complaint,
    `The incident began after: ${base.change}`,
    `Scope is currently limited to ${site}; at least one comparison path or service remains healthy.`,
    difficulty === "Expert / Multi-Failure Production Incident"
      ? "More than one independent fault is present. Do not stop after the first symptom improves."
      : "The change window is active; preserve before-state evidence and keep a rollback path."
  ];
  const clues = [
    "Use the failure boundary: identify what still works before collecting more commands.",
    "Configured state is not proof; verify operational state, counters and forwarding behavior.",
    "Correlate the symptom with the change timeline, but do not assume the most recent change is automatically the cause.",
    ...(expert ? ["A second fault remains after the first repair; re-run the original tests and the redundancy/adjacent-service checks."] : [])
  ];
  const troubleshootingProcess = [
    `Define the failed transaction at ${site}: source, destination, protocol/application and start time.`,
    `Run a working comparison and use ${pb.commands.slice(0, 3).join(", ")} to establish the first failed layer/state.`,
    "Capture before-state CLI, counters, timestamps and controller/AAA evidence before clearing or restarting anything.",
    `Prove the primary cause: ${base.rootCause}`,
    ...(expert ? [`After the primary repair, continue because the expert incident also contains: ${expert.fault}`] : []),
    "Apply the smallest reversible correction, keeping management access and a defined rollback.",
    "Verify the original user flow, the control plane, the data/forwarding plane, an adjacent service and the redundancy path.",
    "Document root cause, corrective action, validation evidence and a prevention owner."
  ];
  const verificationCommands = Array.from(new Set([...pb.verify, ...pb.commands.slice(0, 2)]));

  return {
    id,
    ticketNumber,
    difficulty,
    domain: base.domain,
    title: base.title,
    companyEnvironment: `${companies[index % companies.length]} Incident location: ${site}. Production evidence, rollback and change safety are required.`,
    topology: `${pb.topology} ${ticketNumber} is scoped to the ${site} segment and its upstream dependencies.`,
    complaint: base.complaint,
    symptoms,
    cliOutput,
    whatChanged: base.change,
    clues,
    investigateFirst: pb.investigate,
    commandsToRun: Array.from(new Set([...pb.commands, ...verificationCommands])),
    diagnosisPrompt: `Before opening Show Answer, write your ${ticketNumber} diagnosis: fault domain, most likely root cause, two supporting CLI facts, next non-disruptive test, repair, rollback trigger and post-change validation.`,
    rootCause,
    troubleshootingProcess,
    fixCommands,
    verificationCommands,
    expectedOutput: `The failed condition shown in the evidence is gone. ${verificationCommands[0]} and ${verificationCommands[1] ?? verificationCommands[0]} show the intended healthy state; the original user transaction succeeds repeatedly; no new error/drop/flap counters appear; and the surviving/redundant path still works.${expert ? " Both independent faults are cleared." : ""}`,
    whyItHappened: `${pb.mechanism} In this incident, the triggering condition was: ${base.rootCause}`,
    prevention: [
      "Update the golden template/source of truth so the repair survives future provisioning or replacement.",
      "Add a pre/post validation check that directly detects this failure mode before the change is closed.",
      "Trend the relevant counters/state and alert on meaningful change, not just absolute totals.",
      ...(expert ? ["Add an integrated failover test that verifies secondary dependencies after the first fault is repaired."] : [])
    ],
    productionTicketNotes: [
      `Impact/scope: ${base.complaint}`,
      `Trigger/change: ${base.change}`,
      `Root cause: ${rootCause}`,
      `Corrective action: ${fixCommands.join(" ; ")}`,
      `Validation: ${verificationCommands.join(" ; ")} plus the original user flow and redundancy/adjacent-service test.`,
      "Attach before/after CLI, timestamps, affected device/interface/VLAN/prefix IDs, change/rollback reference, monitoring evidence and prevention owner."
    ],
    multiFailure: Boolean(expert)
  };
});

export const scenarioDomains = ["All", ...Array.from(new Set(workplaceScenarios.map((item) => item.domain)))];
export const scenarioDifficulties = [
  "All",
  "Junior Network Engineer",
  "Network Engineer",
  "Senior Network Engineer",
  "Advanced Enterprise Engineer",
  "Expert / Multi-Failure Production Incident"
];

export function getScenario(id: number) {
  return workplaceScenarios.find((item) => item.id === id);
}

export const difficultyCounts = workplaceScenarios.reduce<Record<string, number>>((counts, item) => {
  counts[item.difficulty] = (counts[item.difficulty] ?? 0) + 1;
  return counts;
}, {});
