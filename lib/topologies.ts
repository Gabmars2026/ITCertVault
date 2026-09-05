export type TopologyNodeType = "router" | "switch" | "endpoint" | "server" | "cloud" | "controller";

export type TopologyNode = {
  id: string;
  label: string;
  detail: string;
  type: TopologyNodeType;
  x: number;
  y: number;
};

export type TopologyLink = {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
};

export type Topology = {
  id: string;
  level: "CCNA" | "ENCOR";
  title: string;
  objective: string;
  nodes: TopologyNode[];
  links: TopologyLink[];
  tasks: string[];
  verify: string[];
};

export const topologies: Topology[] = [
  {
    id: "vlan-trunk",
    level: "CCNA",
    title: "VLAN trunk and access edge",
    objective: "Follow two broadcast domains across an 802.1Q trunk.",
    nodes: [
      { id: "pc10", label: "PC-A · VLAN 10", detail: "10.10.10.11/24", type: "endpoint", x: 90, y: 115 },
      { id: "sw1", label: "SW1 · Access", detail: "Root primary", type: "switch", x: 285, y: 115 },
      { id: "sw2", label: "SW2 · Access", detail: "802.1Q trunk", type: "switch", x: 510, y: 115 },
      { id: "pc20", label: "PC-B · VLAN 20", detail: "10.20.20.22/24", type: "endpoint", x: 705, y: 115 },
      { id: "pc10b", label: "PC-C · VLAN 10", detail: "10.10.10.33/24", type: "endpoint", x: 285, y: 310 },
      { id: "pc20b", label: "PC-D · VLAN 20", detail: "10.20.20.44/24", type: "endpoint", x: 510, y: 310 },
    ],
    links: [
      { from: "pc10", to: "sw1", label: "access 10" }, { from: "sw1", to: "sw2", label: "trunk 10,20" },
      { from: "sw2", to: "pc20", label: "access 20" }, { from: "sw1", to: "pc10b", label: "access 10" },
      { from: "sw2", to: "pc20b", label: "access 20" },
    ],
    tasks: ["Create VLANs 10 and 20 on both switches.", "Allow only VLANs 10 and 20 on the trunk.", "Predict which endpoint pings work without a router."],
    verify: ["show interfaces trunk", "show vlan brief", "show spanning-tree vlan 10"],
  },
  {
    id: "router-stick",
    level: "CCNA",
    title: "Router-on-a-stick",
    objective: "Route between user and voice VLANs with subinterfaces.",
    nodes: [
      { id: "users", label: "Users · VLAN 10", detail: "192.168.10.0/24", type: "endpoint", x: 95, y: 300 },
      { id: "phones", label: "Voice · VLAN 20", detail: "192.168.20.0/24", type: "endpoint", x: 300, y: 300 },
      { id: "access", label: "SW1 · Access", detail: "Gi1/0/48 trunk", type: "switch", x: 200, y: 150 },
      { id: "r1", label: "R1 · Gateway", detail: "G0/0.10 + G0/0.20", type: "router", x: 485, y: 150 },
      { id: "dns", label: "DNS / App", detail: "172.16.1.10/24", type: "server", x: 705, y: 150 },
    ],
    links: [
      { from: "users", to: "access", label: "VLAN 10" }, { from: "phones", to: "access", label: "VLAN 20" },
      { from: "access", to: "r1", label: "802.1Q" }, { from: "r1", to: "dns", label: "routed" },
    ],
    tasks: ["Create dot1Q subinterfaces and gateway IPs.", "Keep the native VLAN explicit on both ends.", "Verify traffic from each VLAN to the server."],
    verify: ["show ip interface brief", "show interfaces trunk", "show ip route connected"],
  },
  {
    id: "multilayer",
    level: "CCNA",
    title: "Multilayer campus gateway",
    objective: "Use SVIs and a routed uplink at the distribution layer.",
    nodes: [
      { id: "a1", label: "ACC1", detail: "Users VLAN 10", type: "switch", x: 110, y: 300 },
      { id: "a2", label: "ACC2", detail: "Servers VLAN 30", type: "switch", x: 330, y: 300 },
      { id: "d1", label: "DIST1 · L3", detail: "SVIs 10, 20, 30", type: "switch", x: 220, y: 135 },
      { id: "edge", label: "EDGE1", detail: "Default route", type: "router", x: 510, y: 135 },
      { id: "internet", label: "ISP", detail: "203.0.113.0/30", type: "cloud", x: 705, y: 135 },
    ],
    links: [
      { from: "a1", to: "d1", label: "trunk" }, { from: "a2", to: "d1", label: "trunk" },
      { from: "d1", to: "edge", label: "10.255.0.0/30" }, { from: "edge", to: "internet", label: "default" },
    ],
    tasks: ["Enable IP routing and create the SVIs.", "Convert the uplink to a routed port.", "Install and test a default route."],
    verify: ["show ip interface brief | include Vlan", "show ip route", "show interfaces switchport"],
  },
  {
    id: "ospf-triangle",
    level: "CCNA",
    title: "OSPF path selection",
    objective: "Form adjacencies and predict the lowest-cost route.",
    nodes: [
      { id: "r1", label: "R1 · DR", detail: "RID 1.1.1.1", type: "router", x: 400, y: 80 },
      { id: "r2", label: "R2", detail: "RID 2.2.2.2", type: "router", x: 190, y: 300 },
      { id: "r3", label: "R3", detail: "RID 3.3.3.3", type: "router", x: 610, y: 300 },
      { id: "lan1", label: "LAN A", detail: "10.1.0.0/24", type: "endpoint", x: 75, y: 300 },
      { id: "lan2", label: "LAN B", detail: "10.3.0.0/24", type: "endpoint", x: 725, y: 300 },
    ],
    links: [
      { from: "r1", to: "r2", label: "cost 10" }, { from: "r1", to: "r3", label: "cost 10" },
      { from: "r2", to: "r3", label: "cost 30" }, { from: "r2", to: "lan1" }, { from: "r3", to: "lan2" },
    ],
    tasks: ["Place all routed links in area 0.", "Predict R2's path to LAN B.", "Break one adjacency and document the fallback."],
    verify: ["show ip ospf neighbor", "show ip ospf interface brief", "show ip route ospf"],
  },
  {
    id: "redundant-campus",
    level: "ENCOR",
    title: "Redundant campus core",
    objective: "Combine LACP, spanning tree, and HSRP without conflicting roles.",
    nodes: [
      { id: "access", label: "ACC1", detail: "Dual-homed access", type: "switch", x: 400, y: 310 },
      { id: "dist1", label: "DIST1", detail: "HSRP active · STP root", type: "switch", x: 220, y: 120 },
      { id: "dist2", label: "DIST2", detail: "HSRP standby", type: "switch", x: 580, y: 120 },
      { id: "core", label: "CORE1", detail: "Routed core", type: "router", x: 400, y: 55 },
      { id: "users", label: "Users", detail: "VIP 10.10.10.1", type: "endpoint", x: 400, y: 395 },
    ],
    links: [
      { from: "dist1", to: "dist2", label: "Po10" }, { from: "dist1", to: "access", label: "Po11" },
      { from: "dist2", to: "access", label: "Po12" }, { from: "dist1", to: "core", label: "L3" },
      { from: "dist2", to: "core", label: "L3" }, { from: "access", to: "users" },
    ],
    tasks: ["Align the HSRP active gateway with the STP root.", "Bundle member links with LACP active mode.", "Test one distribution-switch failure."],
    verify: ["show standby brief", "show etherchannel summary", "show spanning-tree root"],
  },
  {
    id: "multi-area",
    level: "ENCOR",
    title: "Multi-area OSPF enterprise",
    objective: "Control reachability and summarization across ABRs.",
    nodes: [
      { id: "area10", label: "Area 10", detail: "10.10.0.0/16", type: "cloud", x: 75, y: 210 },
      { id: "abr1", label: "ABR1", detail: "Areas 0 / 10", type: "router", x: 245, y: 210 },
      { id: "backbone", label: "Area 0", detail: "Backbone", type: "cloud", x: 400, y: 80 },
      { id: "abr2", label: "ABR2", detail: "Areas 0 / 20", type: "router", x: 555, y: 210 },
      { id: "area20", label: "Area 20", detail: "10.20.0.0/16", type: "cloud", x: 725, y: 210 },
      { id: "asbr", label: "ASBR", detail: "Default originate", type: "router", x: 400, y: 340 },
    ],
    links: [
      { from: "area10", to: "abr1" }, { from: "abr1", to: "backbone", label: "area 0" },
      { from: "backbone", to: "abr2", label: "area 0" }, { from: "abr2", to: "area20" },
      { from: "backbone", to: "asbr", label: "external" },
    ],
    tasks: ["Advertise summarized routes at each ABR.", "Originate a controlled default from the ASBR.", "Compare inter-area and external LSAs."],
    verify: ["show ip ospf database summary", "show ip ospf border-routers", "show ip route ospf"],
  },
  {
    id: "sdwan-branch",
    level: "ENCOR",
    title: "SD-WAN branch overlay",
    objective: "Separate orchestration, management, control, and data-plane roles.",
    nodes: [
      { id: "branch", label: "Branch edge", detail: "WAN Edge", type: "router", x: 90, y: 300 },
      { id: "internet", label: "Underlay", detail: "Internet / MPLS", type: "cloud", x: 300, y: 300 },
      { id: "hq", label: "HQ edge", detail: "WAN Edge", type: "router", x: 515, y: 300 },
      { id: "manager", label: "SD-WAN Manager", detail: "Management plane", type: "controller", x: 270, y: 90 },
      { id: "control", label: "SD-WAN Controller", detail: "Control plane", type: "controller", x: 530, y: 90 },
      { id: "apps", label: "HQ apps", detail: "10.50.0.0/16", type: "server", x: 715, y: 300 },
    ],
    links: [
      { from: "branch", to: "internet", label: "underlay" }, { from: "internet", to: "hq", label: "underlay" },
      { from: "branch", to: "hq", label: "IPsec overlay", dashed: true }, { from: "hq", to: "apps" },
      { from: "manager", to: "branch", label: "manage", dashed: true }, { from: "control", to: "branch", label: "OMP", dashed: true },
      { from: "manager", to: "hq", dashed: true }, { from: "control", to: "hq", dashed: true },
    ],
    tasks: ["Identify the role of each controller connection.", "Trace one application packet through underlay and overlay.", "Choose verification evidence for a control-plane failure."],
    verify: ["show sdwan control connections", "show sdwan omp routes", "show sdwan bfd sessions"],
  },
  {
    id: "vxlan-fabric",
    level: "ENCOR",
    title: "VXLAN leaf-spine fabric",
    objective: "Trace an endpoint through an IP underlay and VXLAN overlay.",
    nodes: [
      { id: "sp1", label: "Spine 1", detail: "IP underlay", type: "switch", x: 265, y: 85 },
      { id: "sp2", label: "Spine 2", detail: "IP underlay", type: "switch", x: 535, y: 85 },
      { id: "leaf1", label: "Leaf 1 · VTEP", detail: "VNI 10100", type: "switch", x: 150, y: 265 },
      { id: "leaf2", label: "Leaf 2 · VTEP", detail: "VNI 10100", type: "switch", x: 650, y: 265 },
      { id: "host1", label: "Host A", detail: "Tenant blue", type: "server", x: 150, y: 385 },
      { id: "host2", label: "Host B", detail: "Tenant blue", type: "server", x: 650, y: 385 },
      { id: "control", label: "Control service", detail: "EVPN / LISP concept", type: "controller", x: 400, y: 265 },
    ],
    links: [
      { from: "sp1", to: "leaf1" }, { from: "sp1", to: "leaf2" }, { from: "sp2", to: "leaf1" },
      { from: "sp2", to: "leaf2" }, { from: "leaf1", to: "host1" }, { from: "leaf2", to: "host2" },
      { from: "leaf1", to: "leaf2", label: "VXLAN", dashed: true }, { from: "control", to: "leaf1", dashed: true },
      { from: "control", to: "leaf2", dashed: true },
    ],
    tasks: ["Distinguish the routed underlay from the tenant overlay.", "Identify the VTEP encapsulation points.", "Explain how endpoint reachability is learned."],
    verify: ["show nve peers", "show nve vni", "show l2route evpn mac all"],
  },
];
