export type Certification = "CCNA" | "ENCOR";
export type Difficulty = "Basic" | "Intermediate" | "Advanced";

export type Question = {
  id: string;
  certification: Certification;
  domain: string;
  difficulty: Difficulty;
  prompt: string;
  choices: string[];
  answer: number;
  explanation: string;
  objective: string;
};

type Fact = {
  term: string;
  purpose: string;
  scenario: string;
  verify?: string;
};

type Domain = {
  certification: Certification;
  code: string;
  name: string;
  weight: number;
  count: number;
  facts: Fact[];
};

export const domains: Domain[] = [
  {
    certification: "CCNA",
    code: "NF",
    name: "Network Fundamentals",
    weight: 20,
    count: 72,
    facts: [
      { term: "Router", purpose: "forwards packets between different IP networks by consulting a routing table", scenario: "A packet must leave its local subnet for a remote network.", verify: "show ip route" },
      { term: "Layer 2 switch", purpose: "forwards Ethernet frames by learning source MAC addresses and consulting a MAC address table", scenario: "Two hosts in the same VLAN exchange frames through an access switch.", verify: "show mac address-table" },
      { term: "Layer 3 switch", purpose: "combines high-speed Ethernet switching with IP routing between VLANs", scenario: "A campus distribution device must route between user VLANs.", verify: "show ip route" },
      { term: "Next-generation firewall", purpose: "enforces stateful and application-aware security policy between trust zones", scenario: "Traffic must be inspected by application and user context before it reaches the internet." },
      { term: "Access point", purpose: "bridges wireless client traffic into a wired network over a WLAN", scenario: "A laptop associates to an SSID and needs access to the campus LAN." },
      { term: "Wireless LAN controller", purpose: "centralizes access-point control, WLAN policy, security, and radio management", scenario: "Dozens of lightweight access points need consistent SSIDs and roaming policy." },
      { term: "TCP", purpose: "provides connection-oriented delivery with sequencing, acknowledgments, and retransmission", scenario: "An application values reliable ordered delivery over minimal overhead." },
      { term: "UDP", purpose: "provides connectionless delivery with low overhead and no built-in retransmission", scenario: "Real-time voice traffic prioritizes timeliness over retransmitting late data." },
      { term: "ARP", purpose: "resolves an IPv4 address to a local Ethernet MAC address", scenario: "A host knows a local IPv4 destination but needs the Layer 2 destination address.", verify: "show ip arp" },
      { term: "ICMP", purpose: "carries network control and diagnostic messages such as echo and unreachable notifications", scenario: "An engineer tests reachability and receives a destination-unreachable response.", verify: "ping 192.0.2.1" },
      { term: "IPv6 link-local address", purpose: "supports communication on the local link and normally uses the FE80::/10 range", scenario: "OSPFv3 neighbors communicate on one segment without relying on global unicast addresses.", verify: "show ipv6 interface brief" },
      { term: "VRF", purpose: "creates a separate routing table on the same physical device", scenario: "Two tenants require overlapping IP space without sharing routes.", verify: "show vrf" },
    ],
  },
  {
    certification: "CCNA",
    code: "NA",
    name: "Network Access",
    weight: 20,
    count: 72,
    facts: [
      { term: "VLAN", purpose: "creates a separate Layer 2 broadcast domain on switched infrastructure", scenario: "Finance and guest devices must be logically separated on the same switches.", verify: "show vlan brief" },
      { term: "802.1Q trunk", purpose: "carries traffic for multiple VLANs by tagging Ethernet frames", scenario: "Two switches must extend several VLANs over one physical link.", verify: "show interfaces trunk" },
      { term: "Access port", purpose: "places untagged endpoint traffic into one assigned VLAN", scenario: "A user workstation connects to a switch and belongs only to VLAN 20.", verify: "show interfaces switchport" },
      { term: "Native VLAN", purpose: "identifies the VLAN whose frames are untagged on an 802.1Q trunk by default", scenario: "A trunk reports a native VLAN mismatch between neighboring switches.", verify: "show interfaces trunk" },
      { term: "CDP", purpose: "discovers directly connected Cisco devices and advertises platform and port details", scenario: "An engineer needs the Cisco neighbor name and remote interface.", verify: "show cdp neighbors detail" },
      { term: "LLDP", purpose: "provides vendor-neutral Layer 2 neighbor discovery", scenario: "A Cisco switch must discover a directly connected non-Cisco device.", verify: "show lldp neighbors detail" },
      { term: "EtherChannel", purpose: "bundles compatible physical links into one logical link for bandwidth and redundancy", scenario: "Parallel switch links should forward together without being blocked individually.", verify: "show etherchannel summary" },
      { term: "LACP", purpose: "dynamically negotiates an EtherChannel using the open IEEE standard", scenario: "Two multivendor switches must negotiate a standards-based port channel.", verify: "show etherchannel summary" },
      { term: "STP root bridge", purpose: "acts as the reference point for shortest-path calculations in a spanning tree", scenario: "A deterministic Layer 2 design needs the distribution switch to become the topology root.", verify: "show spanning-tree root" },
      { term: "PortFast", purpose: "moves an edge access port rapidly to forwarding while retaining STP protections", scenario: "A workstation port should avoid the normal listening and learning delay.", verify: "show spanning-tree interface detail" },
      { term: "BPDU Guard", purpose: "err-disables an edge port if it receives a spanning-tree BPDU", scenario: "An access port must shut down if someone connects an unauthorized switch.", verify: "show spanning-tree inconsistentports" },
      { term: "WPA2 Enterprise", purpose: "uses centralized 802.1X authentication instead of a shared personal key", scenario: "Corporate Wi-Fi users must authenticate with individual enterprise credentials." },
    ],
  },
  {
    certification: "CCNA",
    code: "IPC",
    name: "IP Connectivity",
    weight: 25,
    count: 90,
    facts: [
      { term: "Longest-prefix match", purpose: "selects the most specific matching route for a destination address", scenario: "The table contains /8, /16, and /24 matches for the same destination.", verify: "show ip route 10.10.10.25" },
      { term: "Administrative distance", purpose: "ranks route-source trust when different protocols know the same prefix", scenario: "A router learns one prefix from OSPF and from a static route.", verify: "show ip route" },
      { term: "Routing metric", purpose: "selects a preferred path among routes learned by the same routing protocol", scenario: "OSPF has two intra-area paths to one prefix with different accumulated cost.", verify: "show ip route" },
      { term: "Default static route", purpose: "matches destinations that have no more-specific entry in the routing table", scenario: "A branch sends all unknown destinations toward its ISP.", verify: "show running-config | include ip route" },
      { term: "Floating static route", purpose: "acts as a backup by using an administrative distance higher than the primary route", scenario: "A static path should appear only after the dynamic route disappears.", verify: "show ip route" },
      { term: "OSPF neighbor adjacency", purpose: "allows OSPF routers to exchange link-state information after compatible parameters are verified", scenario: "Two routers share a subnet but are not exchanging OSPF routes.", verify: "show ip ospf neighbor" },
      { term: "OSPF DR", purpose: "reduces full-mesh adjacency requirements on a multiaccess segment", scenario: "Several OSPF routers share one Ethernet broadcast network.", verify: "show ip ospf interface" },
      { term: "Wildcard mask", purpose: "identifies which IPv4 address bits an IOS ACL or OSPF network statement should ignore", scenario: "An OSPF network command must match the 192.0.2.0/24 subnet.", verify: "show running-config | section router ospf" },
      { term: "Recursive route lookup", purpose: "resolves a next-hop IP address to an exit interface through another route", scenario: "A static route names only a next-hop address rather than an outgoing interface.", verify: "show ip route" },
      { term: "HSRP", purpose: "provides a resilient default gateway through an active and standby router with a virtual IP", scenario: "Hosts need one gateway address that survives a distribution-switch failure.", verify: "show standby brief" },
      { term: "Router-on-a-stick", purpose: "routes between VLANs through tagged subinterfaces on one physical router interface", scenario: "A small site needs inter-VLAN routing without a multilayer switch.", verify: "show ip interface brief" },
      { term: "IPv6 default route", purpose: "uses ::/0 to forward unknown IPv6 destinations toward an upstream router", scenario: "A branch needs one catch-all route for external IPv6 networks.", verify: "show ipv6 route" },
    ],
  },
  {
    certification: "CCNA",
    code: "IPS",
    name: "IP Services",
    weight: 10,
    count: 36,
    facts: [
      { term: "DHCP relay", purpose: "forwards client broadcast requests to a DHCP server on another subnet", scenario: "Clients and the DHCP server are separated by a router.", verify: "show running-config | include helper-address" },
      { term: "DNS", purpose: "resolves names to IP addresses and can also provide reverse lookups", scenario: "A user can reach a server by IP address but not by hostname.", verify: "show hosts" },
      { term: "Static NAT", purpose: "creates a fixed one-to-one mapping between inside-local and inside-global addresses", scenario: "An internal server must always use the same public address.", verify: "show ip nat translations" },
      { term: "PAT", purpose: "lets many inside hosts share one public address by tracking transport-layer ports", scenario: "Hundreds of office clients browse the internet through one public IPv4 address.", verify: "show ip nat statistics" },
      { term: "NTP", purpose: "synchronizes device clocks so logs and security events share consistent timestamps", scenario: "Router and switch logs disagree about when an outage began.", verify: "show clock" },
      { term: "SNMP", purpose: "allows a management system to poll metrics and receive event notifications from devices", scenario: "Operations staff need centralized interface utilization monitoring.", verify: "show snmp" },
      { term: "Syslog", purpose: "sends severity-classified device messages to a logging destination", scenario: "An operations team needs searchable records of link and configuration events.", verify: "show logging" },
      { term: "SSH", purpose: "provides encrypted remote command-line administration", scenario: "Telnet must be replaced with a secure management protocol.", verify: "show ssh" },
      { term: "QoS classification", purpose: "identifies traffic so later policies can mark, queue, police, or shape it", scenario: "Voice packets must be recognized before receiving priority treatment.", verify: "show policy-map interface" },
      { term: "TFTP", purpose: "transfers files with minimal overhead but without built-in encryption or authentication", scenario: "A lab switch copies a configuration to a simple local file server.", verify: "show file systems" },
    ],
  },
  {
    certification: "CCNA",
    code: "SEC",
    name: "Security Fundamentals",
    weight: 15,
    count: 54,
    facts: [
      { term: "Least privilege", purpose: "grants only the access required to perform an authorized task", scenario: "A help-desk account should reset passwords but not modify routing policy." },
      { term: "Standard ACL", purpose: "filters IPv4 traffic primarily by source address", scenario: "Management access should be permitted only from one administrator subnet.", verify: "show access-lists" },
      { term: "Extended ACL", purpose: "filters IPv4 traffic by protocol, source, destination, and port information", scenario: "Only HTTPS from one subnet to a specific server should be allowed.", verify: "show ip access-lists" },
      { term: "Port security", purpose: "limits or learns allowed source MAC addresses on a switch access port", scenario: "A wall jack should accept only the assigned workstation.", verify: "show port-security interface" },
      { term: "DHCP snooping", purpose: "blocks untrusted DHCP server messages and builds an IP-to-MAC binding database", scenario: "A rogue DHCP server is giving clients an attacker-controlled gateway.", verify: "show ip dhcp snooping" },
      { term: "Dynamic ARP Inspection", purpose: "validates ARP messages against trusted bindings to reduce ARP spoofing", scenario: "An attacker sends forged ARP replies on an access VLAN.", verify: "show ip arp inspection" },
      { term: "AAA", purpose: "separates authentication, authorization, and accounting for administrative access", scenario: "Network logins need central identity checks, command control, and audit records.", verify: "show aaa servers" },
      { term: "802.1X", purpose: "controls port-based network access through a supplicant, authenticator, and authentication server", scenario: "A switch port should require user or device identity before granting LAN access.", verify: "show authentication sessions" },
      { term: "IPsec VPN", purpose: "protects IP traffic with authentication, integrity, and encryption across an untrusted network", scenario: "Two branches need confidential site-to-site communication over the internet.", verify: "show crypto ipsec sa" },
      { term: "WPA3", purpose: "improves WLAN protection and uses stronger modern authentication than legacy wireless security", scenario: "A new wireless deployment must avoid obsolete WEP and WPA security." },
      { term: "Device hardening", purpose: "reduces attack surface by disabling unused services, securing management, and applying policy", scenario: "A new router must be prepared before it is placed on a production network." },
      { term: "Security awareness", purpose: "reduces human risk by teaching users to recognize and report threats", scenario: "Employees repeatedly receive convincing credential-phishing messages." },
    ],
  },
  {
    certification: "CCNA",
    code: "AUTO",
    name: "Automation and Programmability",
    weight: 10,
    count: 36,
    facts: [
      { term: "REST API", purpose: "exposes resources through stateless HTTP requests using predictable methods and representations", scenario: "A script retrieves network inventory from a controller over HTTPS." },
      { term: "HTTP GET", purpose: "retrieves a resource without intending to change it", scenario: "An automation client reads the current list of network devices." },
      { term: "HTTP POST", purpose: "submits a new resource or action to an API endpoint", scenario: "A client creates a new site object in a controller." },
      { term: "HTTP PATCH", purpose: "applies a partial modification to an existing resource", scenario: "Only one property of a device record needs to change." },
      { term: "JSON", purpose: "represents structured data with objects, arrays, names, and values", scenario: "An API response must be parsed into nested key-value data." },
      { term: "Controller-based networking", purpose: "centralizes policy and exposes programmable management across many devices", scenario: "The same intent must be applied consistently to hundreds of switches." },
      { term: "Underlay", purpose: "provides the physical IP reachability that carries an overlay network", scenario: "Fabric tunnel endpoints cannot communicate because the routed foundation is broken." },
      { term: "Overlay", purpose: "creates logical connectivity on top of an underlying transport network", scenario: "Virtual segments must span the routed fabric independently of physical topology." },
      { term: "Northbound API", purpose: "connects a controller to applications and business automation systems", scenario: "A service portal requests a new network policy from the controller." },
      { term: "Southbound API", purpose: "connects a controller to the network devices it manages", scenario: "A controller programs forwarding behavior on infrastructure nodes." },
      { term: "Ansible", purpose: "automates repeatable configuration through declarative playbooks and device modules", scenario: "The same NTP and logging configuration must be applied to many routers." },
      { term: "Terraform", purpose: "manages infrastructure as code through desired-state configuration and providers", scenario: "A team wants version-controlled, repeatable infrastructure provisioning." },
    ],
  },
  {
    certification: "ENCOR",
    code: "ARCH",
    name: "Architecture",
    weight: 15,
    count: 36,
    facts: [
      { term: "Two-tier campus", purpose: "combines core and distribution functions in a collapsed core above the access layer", scenario: "A medium campus needs redundancy without a separate dedicated core tier." },
      { term: "Three-tier campus", purpose: "separates access, distribution, and core roles for scalable modular design", scenario: "A large campus requires independent policy, aggregation, and high-speed backbone layers." },
      { term: "Spine-leaf fabric", purpose: "provides predictable low-hop east-west connectivity with every leaf linked to every spine", scenario: "A data center must support consistent latency between server racks." },
      { term: "First-hop redundancy", purpose: "maintains default-gateway availability through a shared virtual gateway", scenario: "End hosts must retain gateway service after one distribution node fails.", verify: "show standby brief" },
      { term: "Stateful switchover", purpose: "preserves control-plane state while a redundant supervisor takes over", scenario: "A chassis supervisor failure should minimize protocol reconvergence." },
      { term: "Cisco SD-WAN", purpose: "uses centralized policy and secure overlays to control WAN edge connectivity", scenario: "Branches need application-aware path selection across multiple transports." },
      { term: "Cisco SD-Access", purpose: "applies identity-based policy and segmentation across an automated campus fabric", scenario: "Campus access policy must follow users across the fabric." },
      { term: "Cloud network design", purpose: "accounts for shared responsibility, elastic services, connectivity, and failure domains", scenario: "An enterprise extends applications from on-premises infrastructure into public cloud." },
      { term: "QoS trust boundary", purpose: "defines where traffic markings begin to be accepted or rewritten", scenario: "The network must decide whether to trust DSCP markings from an attached endpoint." },
      { term: "CEF", purpose: "forwards packets using the FIB and adjacency table instead of process-switching each packet", scenario: "A router needs scalable hardware-assisted Layer 3 forwarding.", verify: "show ip cef" },
    ],
  },
  {
    certification: "ENCOR",
    code: "VIRT",
    name: "Virtualization",
    weight: 10,
    count: 24,
    facts: [
      { term: "Hypervisor", purpose: "abstracts physical compute resources so multiple virtual machines can run on one host", scenario: "Several isolated network appliances share one physical server." },
      { term: "Virtual machine", purpose: "runs a complete guest operating system with virtualized hardware", scenario: "A network service needs strong OS isolation and its own kernel." },
      { term: "Container", purpose: "packages an application and dependencies while sharing the host operating-system kernel", scenario: "An automation service needs fast, lightweight, portable deployment." },
      { term: "VRF", purpose: "maintains independent Layer 3 routing and forwarding tables on one device", scenario: "Overlapping customer prefixes must coexist without route leakage.", verify: "show vrf" },
      { term: "GRE", purpose: "encapsulates multiple Layer 3 protocols inside IP but does not encrypt them by itself", scenario: "A tunnel must carry routing protocol traffic across an IP network.", verify: "show interfaces tunnel" },
      { term: "IPsec", purpose: "adds confidentiality, integrity, and peer authentication to IP traffic", scenario: "GRE tunnel traffic must be protected across the public internet.", verify: "show crypto ipsec sa" },
      { term: "LISP", purpose: "separates endpoint identity from routing location through endpoint IDs and routing locators", scenario: "A fabric control plane maps host identity to its current edge location." },
      { term: "VXLAN", purpose: "encapsulates Layer 2 segments over a Layer 3 underlay using a 24-bit segment identifier", scenario: "A fabric needs far more logical segments than traditional VLAN IDs provide." },
      { term: "VTEP", purpose: "originates and terminates VXLAN encapsulation at the edge of a VXLAN fabric", scenario: "An endpoint frame enters a VXLAN overlay from an access-facing interface." },
      { term: "Network virtualization", purpose: "decouples logical network services and topology from physical infrastructure", scenario: "Multiple isolated logical networks share the same switching and routing hardware." },
    ],
  },
  {
    certification: "ENCOR",
    code: "INFRA",
    name: "Infrastructure",
    weight: 30,
    count: 72,
    facts: [
      { term: "RSTP", purpose: "accelerates Layer 2 convergence by using rapid port roles and proposal-agreement behavior", scenario: "A campus needs faster spanning-tree recovery than classic 802.1D.", verify: "show spanning-tree" },
      { term: "MST", purpose: "maps many VLANs to a smaller number of spanning-tree instances", scenario: "Hundreds of VLANs need scalable spanning-tree control and load sharing.", verify: "show spanning-tree mst" },
      { term: "Root Guard", purpose: "prevents a port from accepting a superior BPDU that would change the intended root", scenario: "An access-layer switch must never become the spanning-tree root.", verify: "show spanning-tree inconsistentports" },
      { term: "BPDU Guard", purpose: "protects edge ports by err-disabling them when BPDUs appear", scenario: "A user-facing PortFast port receives a BPDU from an unauthorized switch.", verify: "show errdisable recovery" },
      { term: "LACP EtherChannel", purpose: "negotiates a logical bundle and requires compatible member-link settings", scenario: "Four physical links should operate as one resilient standards-based port channel.", verify: "show etherchannel summary" },
      { term: "EIGRP", purpose: "uses the DUAL algorithm and a composite metric to select loop-free paths", scenario: "A route may have a successor and feasible successor based on reported distance.", verify: "show ip eigrp topology" },
      { term: "OSPF", purpose: "uses link-state advertisements and SPF calculations to build shortest paths", scenario: "Routers in an area need a consistent link-state database.", verify: "show ip ospf database" },
      { term: "OSPF stub area", purpose: "reduces external route information while retaining reachability through default routing", scenario: "A branch area should minimize external LSAs.", verify: "show ip ospf" },
      { term: "eBGP", purpose: "exchanges routing information between different autonomous systems", scenario: "An enterprise edge peers with an ISP using another AS number.", verify: "show ip bgp summary" },
      { term: "Policy-based routing", purpose: "forwards selected traffic according to policy instead of only the destination routing table", scenario: "Guest web traffic must use a different next hop than corporate traffic.", verify: "show route-map" },
      { term: "HSRP", purpose: "elects active and standby gateways that share a virtual IP and MAC address", scenario: "A VLAN requires gateway redundancy and deterministic active ownership.", verify: "show standby brief" },
      { term: "PIM", purpose: "builds multicast distribution trees between Layer 3 devices", scenario: "Multicast streams must travel through a routed enterprise network.", verify: "show ip pim neighbor" },
      { term: "IGMP", purpose: "lets IPv4 hosts signal multicast group membership to local routers", scenario: "A receiver joins a multicast application group on its LAN.", verify: "show ip igmp groups" },
      { term: "Wireless segmentation", purpose: "uses policy constructs such as profiles and tags to separate WLAN clients and services", scenario: "Employee, voice, and guest wireless clients need distinct policy treatment." },
    ],
  },
  {
    certification: "ENCOR",
    code: "ASSURE",
    name: "Network Assurance",
    weight: 10,
    count: 24,
    facts: [
      { term: "NTP", purpose: "synchronizes network-device clocks to a time hierarchy measured by stratum", scenario: "Correlating logs requires consistent timestamps across routers and switches.", verify: "show ntp associations" },
      { term: "PTP", purpose: "provides highly precise time synchronization for delay-sensitive environments", scenario: "Industrial and media systems require sub-millisecond clock alignment.", verify: "show ptp clock" },
      { term: "SNMP", purpose: "exposes managed objects for polling and sends notifications to a management platform", scenario: "A monitoring tool collects interface counters and receives traps.", verify: "show snmp" },
      { term: "Flexible NetFlow", purpose: "records selected flow keys and counters through custom records, monitors, and exporters", scenario: "Operations needs visibility into who is communicating, over which ports, and for how long.", verify: "show flow monitor" },
      { term: "SPAN", purpose: "copies local switch traffic to a local analyzer port", scenario: "A packet capture appliance is connected to the same switch as the source interface.", verify: "show monitor session" },
      { term: "RSPAN", purpose: "carries mirrored traffic across a dedicated Layer 2 VLAN to a remote switch", scenario: "The analyzer is on another switch in the same Layer 2 domain.", verify: "show monitor session" },
      { term: "ERSPAN", purpose: "encapsulates mirrored traffic in GRE so the analyzer can be reached across Layer 3", scenario: "Packet copies must cross a routed network to a remote collector.", verify: "show monitor session erspan-source" },
      { term: "IP SLA", purpose: "generates synthetic probes to measure reachability, delay, jitter, or service response", scenario: "A router must continuously measure WAN path latency.", verify: "show ip sla statistics" },
      { term: "Catalyst Center Assurance", purpose: "correlates telemetry and health data to identify client and network issues", scenario: "An operator wants a centralized view of site, device, and client health." },
      { term: "Traceroute", purpose: "reveals the Layer 3 hop path by eliciting time-exceeded responses", scenario: "Reachability works, but the engineer needs to identify where the path changes.", verify: "traceroute 192.0.2.10" },
    ],
  },
  {
    certification: "ENCOR",
    code: "ESEC",
    name: "Security",
    weight: 20,
    count: 48,
    facts: [
      { term: "AAA", purpose: "centralizes identity verification, permitted actions, and audit records", scenario: "Administrator access must be authenticated, authorized, and logged.", verify: "show aaa servers" },
      { term: "TACACS+", purpose: "separates AAA functions and can authorize individual device-administration commands", scenario: "Network administrators need granular command authorization from a central server.", verify: "show tacacs" },
      { term: "RADIUS", purpose: "commonly centralizes user network-access authentication and combines authorization with authentication", scenario: "Wireless and wired 802.1X users authenticate against a central service.", verify: "show radius statistics" },
      { term: "Control Plane Policing", purpose: "rate-limits selected traffic destined to a network device control plane", scenario: "Routing and management processes need protection from excessive punted packets.", verify: "show policy-map control-plane" },
      { term: "uRPF", purpose: "checks whether a packet source is reachable through an expected interface to reduce spoofing", scenario: "An edge router should reject packets with implausible source addresses.", verify: "show ip interface" },
      { term: "Infrastructure ACL", purpose: "restricts traffic sent to infrastructure addresses while permitting required control and management flows", scenario: "Users should not directly access router loopbacks or transit interfaces.", verify: "show ip access-lists" },
      { term: "802.1X", purpose: "uses a supplicant, authenticator, and authentication server for port-based access control", scenario: "Identity must be validated before a switch port or WLAN grants access.", verify: "show authentication sessions" },
      { term: "EAPOL", purpose: "carries EAP authentication exchanges between a supplicant and LAN authenticator", scenario: "A wired endpoint begins an 802.1X authentication exchange." },
      { term: "TrustSec SGT", purpose: "classifies traffic with scalable group identity so policy can be independent of IP addressing", scenario: "Security policy must follow user or device groups across the campus." },
      { term: "MACsec", purpose: "provides hop-by-hop Layer 2 encryption and integrity on Ethernet links", scenario: "Traffic between adjacent infrastructure devices requires link-layer protection.", verify: "show macsec summary" },
      { term: "Secure API authentication", purpose: "protects automation interfaces with verified identity, least privilege, and encrypted transport", scenario: "A script calls a production controller without embedding an unrestricted password." },
      { term: "Wireless enterprise security", purpose: "uses 802.1X, strong encryption, and centralized policy for managed WLAN access", scenario: "Corporate Wi-Fi must provide per-user authentication and protected over-the-air traffic." },
    ],
  },
  {
    certification: "ENCOR",
    code: "EAUTO",
    name: "Automation",
    weight: 15,
    count: 36,
    facts: [
      { term: "Python", purpose: "provides general-purpose logic, data handling, and libraries for network automation", scenario: "A script parses device facts and conditionally generates a report." },
      { term: "JSON", purpose: "encodes structured objects and arrays commonly exchanged by REST APIs", scenario: "A controller returns nested device inventory data." },
      { term: "YANG", purpose: "models configuration and operational data in a vendor-neutral hierarchical schema", scenario: "An engineer needs to understand the allowed structure of model-driven data." },
      { term: "NETCONF", purpose: "uses structured RPC operations, typically over SSH, to manipulate modeled configuration datastores", scenario: "An automation client edits candidate configuration with transactional operations.", verify: "show netconf-yang sessions" },
      { term: "RESTCONF", purpose: "exposes YANG-modeled data through REST-like HTTP operations", scenario: "A client manages modeled interface data with HTTPS and JSON." },
      { term: "EEM", purpose: "runs event-driven actions directly on an IOS device when defined conditions occur", scenario: "A router should automatically capture diagnostics when an interface goes down.", verify: "show event manager policy registered" },
      { term: "Ansible", purpose: "uses agentless playbooks and modules to apply repeatable network state", scenario: "Operations must configure NTP on fifty IOS XE devices from one workflow." },
      { term: "Terraform", purpose: "declares desired infrastructure state and tracks managed resources through providers", scenario: "A team provisions repeatable network and cloud resources from version-controlled files." },
      { term: "API token", purpose: "grants scoped programmatic access without sending a user password on every request", scenario: "A CI job authenticates to a controller with limited privileges and rotation." },
      { term: "Idempotence", purpose: "allows repeated automation runs to converge on the same desired state without unnecessary changes", scenario: "Running a configuration playbook twice should not create duplicate objects." },
      { term: "CI/CD", purpose: "automates validation and controlled delivery of versioned network changes", scenario: "A configuration change must pass tests and review before deployment." },
      { term: "Model-driven telemetry", purpose: "streams structured operational data from devices to subscribed collectors", scenario: "A monitoring platform needs continuous high-frequency state updates." },
    ],
  },
];

function rotate<T>(values: T[], amount: number): T[] {
  const shift = ((amount % values.length) + values.length) % values.length;
  return [...values.slice(shift), ...values.slice(0, shift)];
}

function difficultyFor(certification: Certification, index: number): Difficulty {
  const bucket = index % 10;
  if (certification === "CCNA") {
    return bucket < 4 ? "Basic" : bucket < 8 ? "Intermediate" : "Advanced";
  }
  return bucket < 2 ? "Basic" : bucket < 6 ? "Intermediate" : "Advanced";
}

function buildChoices(correct: string, distractors: string[], seed: number) {
  const unique = Array.from(new Set([correct, ...distractors.filter((item) => item !== correct)])).slice(0, 4);
  const fallbackChoices = rotate(
    ["show running-config", "show interfaces status", "show logging", "show ip protocols", "show inventory"],
    seed,
  );
  for (const fallback of fallbackChoices) {
    if (unique.length === 4) break;
    if (!unique.includes(fallback)) unique.push(fallback);
  }
  const choices = rotate(unique, seed % 4);
  return { choices, answer: choices.indexOf(correct) };
}

function questionFor(domain: Domain, index: number): Question {
  const factIndex = index % domain.facts.length;
  const variant = Math.floor(index / domain.facts.length) % 12;
  const fact = domain.facts[factIndex];
  const others = [1, 2, 3].map((offset) => domain.facts[(factIndex + offset + variant) % domain.facts.length]);
  let prompt: string;
  let correct: string;
  let distractors: string[];

  if (variant === 0) {
    prompt = `Within ${domain.name}, which statement best describes ${fact.term}?`;
    correct = fact.purpose;
    distractors = others.map((item) => item.purpose);
  } else if (variant === 1) {
    prompt = `${fact.scenario} Which ${domain.certification} technology or concept is the best match?`;
    correct = fact.term;
    distractors = others.map((item) => item.term);
  } else if (variant === 2) {
    prompt = `During a ${domain.name} design review, an engineer sees ${fact.term}. What is its primary role?`;
    correct = fact.purpose;
    distractors = others.map((item) => item.purpose);
  } else if (variant === 3) {
    prompt = `Which ${domain.name} technology is most directly associated with this behavior: ${fact.purpose}?`;
    correct = fact.term;
    distractors = others.map((item) => item.term);
  } else if (variant === 4 && fact.verify) {
    const commandFacts = domain.facts.filter((item) => item.verify && item.verify !== fact.verify);
    prompt = `Within ${domain.name}, which Cisco IOS command is most useful when verifying ${fact.term}?`;
    correct = fact.verify;
    distractors = rotate(commandFacts, factIndex).slice(0, 3).map((item) => item.verify as string);
  } else if (variant === 5) {
    prompt = `A ${domain.name} troubleshooting ticket says: “${fact.scenario}” What should the engineer examine first?`;
    correct = fact.term;
    distractors = others.map((item) => item.term);
  } else if (variant === 6) {
    prompt = `Which term-to-function pairing correctly addresses this need: ${fact.scenario}?`;
    correct = `${fact.term} — ${fact.purpose}`;
    distractors = others.map((item, offset) => `${item.term} — ${others[(offset + 1) % others.length].purpose}`);
  } else if (variant === 7) {
    prompt = `An engineer must explain ${fact.term} during a ${domain.name} review. Which explanation is technically accurate?`;
    correct = fact.purpose;
    distractors = others.map((item) => item.purpose);
  } else if (variant === 8) {
    prompt = `A change in ${domain.name} depends on ${fact.term}. Which outcome should the implementation plan expect?`;
    correct = fact.purpose;
    distractors = others.map((item) => item.purpose);
  } else if (variant === 9) {
    prompt = `Which ${domain.name} concept would an engineer select to accomplish this goal: ${fact.purpose}?`;
    correct = fact.term;
    distractors = others.map((item) => item.term);
  } else if (variant === 10) {
    prompt = `A runbook for ${domain.name} mentions ${fact.term}. Which definition should the engineer include?`;
    correct = fact.purpose;
    distractors = others.map((item) => item.purpose);
  } else if (fact.verify) {
    const commandFacts = domain.facts.filter((item) => item.verify && item.verify !== fact.verify);
    prompt = `After changing ${fact.term}, which command gives the most relevant ${domain.name} verification evidence?`;
    correct = fact.verify;
    distractors = rotate(commandFacts, factIndex + 2).slice(0, 3).map((item) => item.verify as string);
  } else {
    prompt = `Which ${domain.certification} term completes this ${domain.name} runbook statement: it ${fact.purpose}?`;
    correct = fact.term;
    distractors = others.map((item) => item.term);
  }

  const { choices, answer } = buildChoices(correct, distractors, index * 3 + variant + factIndex);
  const verifyNote = fact.verify ? ` A useful verification command is “${fact.verify}”.` : "";

  return {
    id: `${domain.certification}-${domain.code}-${String(index + 1).padStart(3, "0")}`,
    certification: domain.certification,
    domain: domain.name,
    difficulty: difficultyFor(domain.certification, index),
    prompt,
    choices,
    answer,
    explanation: `${fact.term} ${fact.purpose}.${verifyNote}`,
    objective: `${domain.certification} ${domain.code}`,
  };
}

export const questionBank: Question[] = domains.flatMap((domain) =>
  Array.from({ length: domain.count }, (_, index) => questionFor(domain, index)),
);

if (questionBank.length !== 600) {
  throw new Error(`Question bank must contain exactly 600 items; found ${questionBank.length}.`);
}

export function questionsFor(certification: "ALL" | Certification, domain = "ALL") {
  return questionBank.filter(
    (question) =>
      (certification === "ALL" || question.certification === certification) &&
      (domain === "ALL" || question.domain === domain),
  );
}
