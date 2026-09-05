export type DragExercise = {
  id: string;
  certification: "CCNA" | "ENCOR";
  title: string;
  instruction: string;
  items: { id: string; label: string }[];
  targets: { id: string; label: string; answer: string }[];
  explanation: string;
};

export const dragExercises: DragExercise[] = [
  {
    id: "osi-stack",
    certification: "CCNA",
    title: "Build the OSI stack",
    instruction: "Place each layer from Layer 7 at the top to Layer 1 at the bottom.",
    items: [
      ["physical", "Physical"], ["data-link", "Data Link"], ["network", "Network"],
      ["transport", "Transport"], ["session", "Session"], ["presentation", "Presentation"], ["application", "Application"],
    ].map(([id, label]) => ({ id, label })),
    targets: [
      ["l7", "Layer 7", "application"], ["l6", "Layer 6", "presentation"], ["l5", "Layer 5", "session"],
      ["l4", "Layer 4", "transport"], ["l3", "Layer 3", "network"], ["l2", "Layer 2", "data-link"], ["l1", "Layer 1", "physical"],
    ].map(([id, label, answer]) => ({ id, label, answer })),
    explanation: "The OSI model descends Application, Presentation, Session, Transport, Network, Data Link, and Physical.",
  },
  {
    id: "encapsulation",
    certification: "CCNA",
    title: "Encapsulate user data",
    instruction: "Order the protocol data units as traffic moves down the stack toward the wire.",
    items: [
      ["data", "Data"], ["segment", "TCP segment"], ["packet", "IP packet"], ["frame", "Ethernet frame"], ["bits", "Bits"],
    ].map(([id, label]) => ({ id, label })),
    targets: [
      ["s1", "1. Application payload", "data"], ["s2", "2. Transport", "segment"], ["s3", "3. Network", "packet"],
      ["s4", "4. Data Link", "frame"], ["s5", "5. Physical", "bits"],
    ].map(([id, label, answer]) => ({ id, label, answer })),
    explanation: "TCP adds a segment header, IP creates a packet, Ethernet creates a frame, and the physical layer transmits bits.",
  },
  {
    id: "show-commands",
    certification: "CCNA",
    title: "Match the verification command",
    instruction: "Drop the best Cisco IOS show command beside each troubleshooting goal.",
    items: [
      ["route", "show ip route"], ["vlan", "show vlan brief"], ["trunk", "show interfaces trunk"],
      ["mac", "show mac address-table"], ["ospf", "show ip ospf neighbor"],
    ].map(([id, label]) => ({ id, label })),
    targets: [
      ["t1", "Inspect the IPv4 routing table", "route"], ["t2", "Confirm access VLAN membership", "vlan"],
      ["t3", "Verify allowed and native VLANs", "trunk"], ["t4", "Find learned Layer 2 addresses", "mac"],
      ["t5", "Check OSPF adjacency state", "ospf"],
    ].map(([id, label, answer]) => ({ id, label, answer })),
    explanation: "A disciplined workflow uses the most specific show command before changing configuration.",
  },
  {
    id: "dhcp-dora",
    certification: "CCNA",
    title: "Sequence DHCP DORA",
    instruction: "Place the four client-server messages in their normal order.",
    items: [["discover", "Discover"], ["offer", "Offer"], ["request", "Request"], ["ack", "Acknowledgment"]].map(([id, label]) => ({ id, label })),
    targets: [["d1", "Step 1", "discover"], ["d2", "Step 2", "offer"], ["d3", "Step 3", "request"], ["d4", "Step 4", "ack"]].map(([id, label, answer]) => ({ id, label, answer })),
    explanation: "The client discovers, a server offers, the client requests, and the chosen server acknowledges the lease.",
  },
  {
    id: "ipv4-ranges",
    certification: "CCNA",
    title: "Match private IPv4 space",
    instruction: "Match each private block to its prefix.",
    items: [["ten", "10.0.0.0"], ["one-seven-two", "172.16.0.0"], ["one-nine-two", "192.168.0.0"]].map(([id, label]) => ({ id, label })),
    targets: [["p1", "/8 private block", "ten"], ["p2", "/12 private block", "one-seven-two"], ["p3", "/16 private block", "one-nine-two"]].map(([id, label, answer]) => ({ id, label, answer })),
    explanation: "RFC 1918 private space is 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16.",
  },
  {
    id: "stp-roles",
    certification: "CCNA",
    title: "Assign spanning-tree roles",
    instruction: "Match each port role to the forwarding decision it represents.",
    items: [["root", "Root port"], ["designated", "Designated port"], ["alternate", "Alternate port"], ["edge", "Edge/PortFast port"]].map(([id, label]) => ({ id, label })),
    targets: [
      ["r1", "Best path toward the root bridge", "root"], ["r2", "Best forwarding port on a segment", "designated"],
      ["r3", "Backup path currently discarding", "alternate"], ["r4", "Endpoint-facing port that transitions rapidly", "edge"],
    ].map(([id, label, answer]) => ({ id, label, answer })),
    explanation: "RSTP roles describe each port's relationship to the root and its forwarding responsibility.",
  },
  {
    id: "ospf-states",
    certification: "ENCOR",
    title: "Order OSPF neighbor states",
    instruction: "Sequence the major states from first contact to a fully synchronized adjacency.",
    items: [["down", "Down"], ["init", "Init"], ["two-way", "2-Way"], ["exstart", "ExStart"], ["exchange", "Exchange"], ["loading", "Loading"], ["full", "Full"]].map(([id, label]) => ({ id, label })),
    targets: [["o1", "1", "down"], ["o2", "2", "init"], ["o3", "3", "two-way"], ["o4", "4", "exstart"], ["o5", "5", "exchange"], ["o6", "6", "loading"], ["o7", "7", "full"]].map(([id, label, answer]) => ({ id, label, answer })),
    explanation: "After 2-Way, routers that form a full adjacency negotiate master/slave, exchange summaries, request LSAs, and reach Full.",
  },
  {
    id: "cef-tables",
    certification: "ENCOR",
    title: "Map switching tables",
    instruction: "Match each control or forwarding structure to its job.",
    items: [["rib", "RIB"], ["fib", "FIB"], ["adj", "Adjacency table"], ["cam", "CAM"], ["tcam", "TCAM"]].map(([id, label]) => ({ id, label })),
    targets: [
      ["c1", "Control-plane routing information", "rib"], ["c2", "CEF prefix forwarding lookup", "fib"],
      ["c3", "Layer 2 rewrite information", "adj"], ["c4", "Exact-match MAC forwarding", "cam"],
      ["c5", "Ternary policy/prefix lookup", "tcam"],
    ].map(([id, label, answer]) => ({ id, label, answer })),
    explanation: "The RIB feeds the FIB, adjacency data supplies rewrite details, and switch hardware uses CAM/TCAM for fast lookups.",
  },
  {
    id: "sdwan-planes",
    certification: "ENCOR",
    title: "Place SD-WAN components",
    instruction: "Match each Cisco SD-WAN component to its primary plane or function.",
    items: [["manager", "SD-WAN Manager"], ["controller", "SD-WAN Controller"], ["validator", "SD-WAN Validator"], ["edge", "WAN Edge"]].map(([id, label]) => ({ id, label })),
    targets: [["w1", "Management and orchestration interface", "manager"], ["w2", "Central control and route policy", "controller"], ["w3", "Initial authentication and orchestration", "validator"], ["w4", "Branch data-plane forwarding", "edge"]].map(([id, label, answer]) => ({ id, label, answer })),
    explanation: "Cisco's current names replace the older vManage, vSmart, and vBond labels while retaining their core roles.",
  },
  {
    id: "vxlan-lisp",
    certification: "ENCOR",
    title: "Build the fabric mapping",
    instruction: "Match each fabric term to its function.",
    items: [["vxlan", "VXLAN"], ["vtep", "VTEP"], ["lisp", "LISP"], ["vni", "VNI"]].map(([id, label]) => ({ id, label })),
    targets: [["v1", "Data-plane encapsulation", "vxlan"], ["v2", "Encapsulation endpoint", "vtep"], ["v3", "Endpoint-to-location control mapping", "lisp"], ["v4", "24-bit overlay segment identifier", "vni"]].map(([id, label, answer]) => ({ id, label, answer })),
    explanation: "In a fabric, LISP can supply location mapping while VXLAN/VTEPs carry segmented data-plane traffic identified by VNIs.",
  },
  {
    id: "assurance-tools",
    certification: "ENCOR",
    title: "Choose an assurance tool",
    instruction: "Match the observability goal to the best tool.",
    items: [["netflow", "Flexible NetFlow"], ["ipsla", "IP SLA"], ["erspan", "ERSPAN"], ["snmp", "SNMP"], ["ptp", "PTP"]].map(([id, label]) => ({ id, label })),
    targets: [["a1", "Summarize conversations and byte counts", "netflow"], ["a2", "Generate synthetic service probes", "ipsla"], ["a3", "Mirror packets across Layer 3", "erspan"], ["a4", "Poll managed object counters", "snmp"], ["a5", "Provide highly precise clock sync", "ptp"]].map(([id, label, answer]) => ({ id, label, answer })),
    explanation: "Assurance combines flow records, active probes, packet capture, device metrics, and precise time where required.",
  },
  {
    id: "model-driven",
    certification: "ENCOR",
    title: "Match automation technologies",
    instruction: "Drop each technology beside the role it plays in model-driven automation.",
    items: [["yang", "YANG"], ["netconf", "NETCONF"], ["restconf", "RESTCONF"], ["json", "JSON"], ["ansible", "Ansible"]].map(([id, label]) => ({ id, label })),
    targets: [["m1", "Define the data model", "yang"], ["m2", "Structured RPC over SSH", "netconf"], ["m3", "HTTP access to modeled data", "restconf"], ["m4", "Encode objects and arrays", "json"], ["m5", "Apply repeatable playbooks", "ansible"]].map(([id, label, answer]) => ({ id, label, answer })),
    explanation: "YANG defines structure; NETCONF and RESTCONF transport modeled operations; JSON encodes data; Ansible orchestrates repeatable work.",
  },
];
