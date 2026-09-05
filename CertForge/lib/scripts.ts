export type ScriptLesson = {
  id: string;
  title: string;
  certification: "CCNA" | "ENCOR";
  level: "Basic" | "Intermediate" | "Advanced" | "Full build";
  category: string;
  purpose: string;
  code: string;
  verify: string[];
  notes: string[];
  full?: boolean;
};

export const scriptLessons: ScriptLesson[] = [
  {
    id: "device-baseline", title: "Device identity and safe baseline", certification: "CCNA", level: "Basic", category: "Foundations",
    purpose: "Set identity, stop accidental DNS lookups, protect privileged mode, and preserve readable logs.",
    code: `enable
configure terminal
hostname SW1
no ip domain-lookup
enable secret Use-A-Unique-Secret
service password-encryption
service timestamps log datetime msec
banner motd # Authorized access only #
end
copy running-config startup-config`,
    verify: ["show running-config | include hostname|enable secret|domain-lookup", "show startup-config"],
    notes: ["Use an approved secrets process in production; never reuse the sample value.", "Save only after verifying the intended change."],
  },
  {
    id: "interface-ip", title: "Configure a routed interface", certification: "CCNA", level: "Basic", category: "Layer 3",
    purpose: "Turn a physical interface into a routed link and assign IPv4 addressing.",
    code: `configure terminal
interface GigabitEthernet0/1
 description Link to R2
 no switchport
 ip address 10.0.12.1 255.255.255.252
 no shutdown
end`,
    verify: ["show ip interface brief", "show interfaces GigabitEthernet0/1", "ping 10.0.12.2"],
    notes: ["The no switchport command applies to multilayer-switch interfaces.", "A /30 provides two usable IPv4 addresses."],
  },
  {
    id: "vlan-create", title: "Create and name VLANs", certification: "CCNA", level: "Basic", category: "Switching",
    purpose: "Create separate Layer 2 broadcast domains with meaningful names.",
    code: `configure terminal
vlan 10
 name USERS
vlan 20
 name VOICE
vlan 99
 name MANAGEMENT
end`,
    verify: ["show vlan brief", "show vlan id 10"],
    notes: ["Keep VLAN names consistent across the campus.", "Creating a VLAN does not automatically place ports into it."],
  },
  {
    id: "access-port", title: "Assign an access port", certification: "CCNA", level: "Basic", category: "Switching",
    purpose: "Place an endpoint port into one VLAN and document its use.",
    code: `configure terminal
interface GigabitEthernet1/0/10
 description Finance workstation
 switchport mode access
 switchport access vlan 10
 spanning-tree portfast
 spanning-tree bpduguard enable
 no shutdown
end`,
    verify: ["show interfaces GigabitEthernet1/0/10 switchport", "show spanning-tree interface GigabitEthernet1/0/10 detail"],
    notes: ["Use PortFast only on edge ports.", "BPDU Guard protects the edge if another switch is connected."],
  },
  {
    id: "dot1q-trunk", title: "Build an 802.1Q trunk", certification: "CCNA", level: "Basic", category: "Switching",
    purpose: "Carry an explicit list of VLANs between switches with a dedicated native VLAN.",
    code: `configure terminal
interface GigabitEthernet1/0/48
 description Trunk to DIST1
 switchport mode trunk
 switchport trunk native vlan 999
 switchport trunk allowed vlan 10,20,99,999
 switchport nonegotiate
 no shutdown
end`,
    verify: ["show interfaces trunk", "show interfaces GigabitEthernet1/0/48 switchport"],
    notes: ["Both ends must agree on native and allowed VLANs.", "An unused native VLAN limits accidental untagged user traffic."],
  },
  {
    id: "lacp-channel", title: "Bundle links with LACP", certification: "CCNA", level: "Intermediate", category: "Switching",
    purpose: "Create a standards-based Layer 2 EtherChannel with two member links.",
    code: `configure terminal
interface range GigabitEthernet1/0/47-48
 description LACP members to DIST1
 switchport mode trunk
 switchport trunk allowed vlan 10,20,99
 channel-group 1 mode active
 no shutdown
interface Port-channel1
 description LACP trunk to DIST1
 switchport mode trunk
 switchport trunk allowed vlan 10,20,99
end`,
    verify: ["show etherchannel summary", "show interfaces port-channel1", "show lacp neighbor"],
    notes: ["Member speed, duplex, trunking, and allowed VLAN settings must be compatible.", "Configure shared policy on the port channel and keep members consistent."],
  },
  {
    id: "stp-root", title: "Set deterministic STP roots", certification: "CCNA", level: "Intermediate", category: "Switching",
    purpose: "Make DIST1 primary for one VLAN group and secondary for another.",
    code: `configure terminal
spanning-tree mode rapid-pvst
spanning-tree vlan 10,30 root primary
spanning-tree vlan 20,40 root secondary
end`,
    verify: ["show spanning-tree root", "show spanning-tree vlan 10"],
    notes: ["Align the active first-hop gateway with the STP root where practical.", "Root primary adjusts priority relative to the current topology."],
  },
  {
    id: "svi-routing", title: "Route between VLANs with SVIs", certification: "CCNA", level: "Intermediate", category: "Layer 3",
    purpose: "Enable inter-VLAN routing on a multilayer switch.",
    code: `configure terminal
ip routing
interface Vlan10
 description Users gateway
 ip address 10.10.10.1 255.255.255.0
 no shutdown
interface Vlan20
 description Voice gateway
 ip address 10.10.20.1 255.255.255.0
 no shutdown
end`,
    verify: ["show ip interface brief | include Vlan", "show ip route connected", "ping 10.10.20.1 source Vlan10"],
    notes: ["An SVI is operational only when its VLAN exists and at least one associated Layer 2 port is active.", "Endpoints still need the matching default gateway."],
  },
  {
    id: "router-stick", title: "Router-on-a-stick subinterfaces", certification: "CCNA", level: "Intermediate", category: "Layer 3",
    purpose: "Route between VLANs over one tagged router link.",
    code: `configure terminal
interface GigabitEthernet0/0
 no shutdown
interface GigabitEthernet0/0.10
 encapsulation dot1Q 10
 ip address 10.10.10.1 255.255.255.0
interface GigabitEthernet0/0.20
 encapsulation dot1Q 20
 ip address 10.10.20.1 255.255.255.0
interface GigabitEthernet0/0.99
 encapsulation dot1Q 99 native
 ip address 10.10.99.1 255.255.255.0
end`,
    verify: ["show ip interface brief", "show interfaces GigabitEthernet0/0.10", "show ip route connected"],
    notes: ["The switch-facing port must be a matching 802.1Q trunk.", "Only one subinterface can be native on the physical link."],
  },
  {
    id: "static-routes", title: "Primary and floating static routes", certification: "CCNA", level: "Intermediate", category: "Routing",
    purpose: "Create a normal default route and a higher-distance backup.",
    code: `configure terminal
ip route 0.0.0.0 0.0.0.0 198.51.100.1
ip route 0.0.0.0 0.0.0.0 203.0.113.1 200
end`,
    verify: ["show ip route static", "show ip route 0.0.0.0", "traceroute 8.8.8.8"],
    notes: ["The backup route enters the routing table only when the preferred route is unavailable.", "Tracking may be needed when the next hop stays reachable but service beyond it fails."],
  },
  {
    id: "ospf-single", title: "Single-area OSPF", certification: "CCNA", level: "Intermediate", category: "Routing",
    purpose: "Advertise internal networks in area 0 with a stable router ID.",
    code: `configure terminal
router ospf 10
 router-id 1.1.1.1
 passive-interface default
 no passive-interface GigabitEthernet0/1
 network 10.0.12.0 0.0.0.3 area 0
 network 10.10.10.0 0.0.0.255 area 0
end
clear ip ospf process`,
    verify: ["show ip ospf neighbor", "show ip ospf interface brief", "show ip route ospf"],
    notes: ["Use clear ip ospf process only during an approved change window.", "Passive interfaces advertise their networks without forming neighbors."],
  },
  {
    id: "hsrp-gateway", title: "Resilient gateway with HSRP", certification: "ENCOR", level: "Intermediate", category: "High availability",
    purpose: "Give VLAN 10 a virtual gateway and make this device active when healthy.",
    code: `configure terminal
interface Vlan10
 ip address 10.10.10.2 255.255.255.0
 standby version 2
 standby 10 ip 10.10.10.1
 standby 10 priority 110
 standby 10 preempt
 standby 10 track GigabitEthernet1/0/48 20
end`,
    verify: ["show standby brief", "show standby vlan 10"],
    notes: ["The peer uses a different real address and usually a lower priority.", "Tracking lowers priority when the monitored upstream path fails."],
  },
  {
    id: "dhcp-pool", title: "IOS DHCP pool", certification: "CCNA", level: "Intermediate", category: "IP services",
    purpose: "Lease user addresses while reserving gateway and infrastructure space.",
    code: `configure terminal
ip dhcp excluded-address 10.10.10.1 10.10.10.30
ip dhcp pool USERS
 network 10.10.10.0 255.255.255.0
 default-router 10.10.10.1
 dns-server 10.10.99.10 1.1.1.1
 domain-name lab.example
 lease 7
end`,
    verify: ["show ip dhcp binding", "show ip dhcp pool", "show ip dhcp conflict"],
    notes: ["Use ip helper-address on the client gateway when the DHCP server is remote.", "Reserve infrastructure addresses before clients begin leasing."],
  },
  {
    id: "nat-overload", title: "PAT internet edge", certification: "CCNA", level: "Intermediate", category: "IP services",
    purpose: "Translate many inside addresses to one WAN interface address.",
    code: `configure terminal
access-list 10 permit 10.10.0.0 0.0.255.255
interface GigabitEthernet0/0
 description Inside
 ip nat inside
interface GigabitEthernet0/1
 description ISP
 ip nat outside
ip nat inside source list 10 interface GigabitEthernet0/1 overload
end`,
    verify: ["show ip nat translations", "show ip nat statistics", "debug ip nat"],
    notes: ["Use debug carefully on production systems.", "The ACL identifies translatable source addresses; it is not applied to an interface here."],
  },
  {
    id: "extended-acl", title: "Named extended ACL", certification: "CCNA", level: "Intermediate", category: "Security",
    purpose: "Permit HTTPS to one server, deny other access to that server, and allow remaining traffic.",
    code: `configure terminal
ip access-list extended USERS-IN
 remark Allow HTTPS to application server
 permit tcp 10.10.10.0 0.0.0.255 host 10.20.20.50 eq 443
 deny ip 10.10.10.0 0.0.0.255 host 10.20.20.50 log
 permit ip 10.10.10.0 0.0.0.255 any
interface Vlan10
 ip access-group USERS-IN in
end`,
    verify: ["show ip access-lists USERS-IN", "show ip interface Vlan10"],
    notes: ["ACLs have an implicit deny at the end.", "Place specific entries before broader entries and verify hit counters."],
  },
  {
    id: "ssh-management", title: "Secure SSH management", certification: "CCNA", level: "Intermediate", category: "Security",
    purpose: "Enable local SSH access and restrict VTY connections to a management subnet.",
    code: `configure terminal
ip domain-name lab.example
username netadmin privilege 15 secret Use-A-Unique-Secret
crypto key generate rsa modulus 2048
ip ssh version 2
ip access-list standard MGMT-SOURCES
 permit 10.10.99.0 0.0.0.255
line vty 0 15
 login local
 transport input ssh
 access-class MGMT-SOURCES in
 exec-timeout 10 0
end`,
    verify: ["show ssh", "show users", "show access-lists MGMT-SOURCES"],
    notes: ["Replace the sample secret and follow your organization's key-size policy.", "Confirm an active management session before closing your existing connection."],
  },
  {
    id: "ntp-logging", title: "NTP and remote logging", certification: "CCNA", level: "Intermediate", category: "Assurance",
    purpose: "Synchronize timestamps and send actionable messages to a collector.",
    code: `configure terminal
clock timezone CST -6 0
ntp server 10.10.99.20 prefer
logging host 10.10.99.30
logging trap warnings
logging source-interface Loopback0
service timestamps log datetime msec localtime show-timezone
end`,
    verify: ["show ntp associations", "show clock detail", "show logging"],
    notes: ["Use UTC where organizational standards require it.", "A stable source interface makes collector policy and correlation easier."],
  },
  {
    id: "ipv6-dual", title: "Dual-stack interface and route", certification: "CCNA", level: "Intermediate", category: "IPv6",
    purpose: "Enable IPv6 routing, assign global/link-local addressing, and add a default route.",
    code: `configure terminal
ipv6 unicast-routing
interface GigabitEthernet0/1
 ipv6 address 2001:DB8:12::1/64
 ipv6 address FE80::1 link-local
 no shutdown
ipv6 route ::/0 2001:DB8:12::2
end`,
    verify: ["show ipv6 interface brief", "show ipv6 route", "ping ipv6 2001:DB8:12::2"],
    notes: ["2001:DB8::/32 is reserved for documentation.", "The next-hop link-local form also requires an exit interface."],
  },
  {
    id: "dhcp-snoop-dai", title: "DHCP Snooping and DAI", certification: "ENCOR", level: "Advanced", category: "Security",
    purpose: "Build trusted DHCP bindings and validate ARP messages on user VLANs.",
    code: `configure terminal
ip dhcp snooping
ip dhcp snooping vlan 10,20
ip arp inspection vlan 10,20
interface Port-channel1
 description Uplink toward trusted DHCP server
 ip dhcp snooping trust
 ip arp inspection trust
interface range GigabitEthernet1/0/1-46
 ip dhcp snooping limit rate 15
end`,
    verify: ["show ip dhcp snooping", "show ip dhcp snooping binding", "show ip arp inspection"],
    notes: ["Trust only paths toward legitimate DHCP servers.", "DAI depends on valid bindings unless static ARP ACLs are designed."],
  },
  {
    id: "port-security", title: "Sticky port security", certification: "CCNA", level: "Intermediate", category: "Security",
    purpose: "Learn one allowed MAC address and restrict violations without immediately shutting the port.",
    code: `configure terminal
interface GigabitEthernet1/0/12
 switchport mode access
 switchport access vlan 10
 switchport port-security
 switchport port-security maximum 1
 switchport port-security mac-address sticky
 switchport port-security violation restrict
end`,
    verify: ["show port-security interface GigabitEthernet1/0/12", "show port-security address"],
    notes: ["Sticky entries appear in running configuration and must be saved if they should survive reload.", "Choose protect, restrict, or shutdown based on policy."],
  },
  {
    id: "span-capture", title: "Local SPAN capture", certification: "ENCOR", level: "Advanced", category: "Assurance",
    purpose: "Mirror a source interface to a local packet analyzer.",
    code: `configure terminal
monitor session 1 source interface GigabitEthernet1/0/10 both
monitor session 1 destination interface GigabitEthernet1/0/24
end`,
    verify: ["show monitor session 1"],
    notes: ["The destination port is dedicated to mirrored traffic while the session is active.", "Capture only within your authorization and data-handling policy."],
  },
  {
    id: "ipsla-track", title: "IP SLA with tracked routing", certification: "ENCOR", level: "Advanced", category: "Assurance",
    purpose: "Withdraw a preferred default route when an upstream probe fails.",
    code: `configure terminal
ip sla 10
 icmp-echo 198.51.100.1 source-interface GigabitEthernet0/1
 frequency 5
ip sla schedule 10 life forever start-time now
track 10 ip sla 10 reachability
ip route 0.0.0.0 0.0.0.0 198.51.100.1 track 10
ip route 0.0.0.0 0.0.0.0 203.0.113.1 200
end`,
    verify: ["show ip sla statistics", "show track 10", "show ip route 0.0.0.0"],
    notes: ["Probe a target that represents meaningful upstream reachability.", "Tune frequency and timers to avoid unstable route changes."],
  },
  {
    id: "policy-route", title: "Policy-based routing", certification: "ENCOR", level: "Advanced", category: "Routing",
    purpose: "Send selected guest traffic to an alternate next hop.",
    code: `configure terminal
ip access-list extended GUEST-WEB
 permit tcp 10.50.0.0 0.0.255.255 any eq 80
 permit tcp 10.50.0.0 0.0.255.255 any eq 443
route-map GUEST-PBR permit 10
 match ip address GUEST-WEB
 set ip next-hop verify-availability 203.0.113.1 1 track 20
interface Vlan50
 ip policy route-map GUEST-PBR
end`,
    verify: ["show route-map GUEST-PBR", "show ip policy", "show track 20"],
    notes: ["Traffic not matched by the route map follows normal destination routing.", "Verify next-hop tracking before relying on PBR for resiliency."],
  },
  {
    id: "ebgp-edge", title: "Basic eBGP edge peering", certification: "ENCOR", level: "Advanced", category: "Routing",
    purpose: "Establish an external BGP adjacency and advertise one owned prefix.",
    code: `configure terminal
ip route 203.0.113.0 255.255.255.0 Null0
router bgp 65010
 bgp log-neighbor-changes
 neighbor 198.51.100.2 remote-as 65020
 address-family ipv4
  network 203.0.113.0 mask 255.255.255.0
  neighbor 198.51.100.2 activate
 exit-address-family
end`,
    verify: ["show ip bgp summary", "show ip bgp", "show ip route bgp"],
    notes: ["The network statement requires an exact matching route in the local routing table.", "Apply explicit inbound and outbound policy before production peering."],
  },
  {
    id: "flex-netflow", title: "Flexible NetFlow monitor", certification: "ENCOR", level: "Advanced", category: "Assurance",
    purpose: "Collect conversation metadata and export it to a flow collector.",
    code: `configure terminal
flow record IPV4-TRAFFIC
 match ipv4 source address
 match ipv4 destination address
 match transport source-port
 match transport destination-port
 collect counter bytes long
 collect counter packets long
flow exporter FLOW-COLLECTOR
 destination 10.10.99.40
 transport udp 2055
flow monitor CAMPUS-MONITOR
 record IPV4-TRAFFIC
 exporter FLOW-COLLECTOR
interface GigabitEthernet0/1
 ip flow monitor CAMPUS-MONITOR input
end`,
    verify: ["show flow monitor CAMPUS-MONITOR cache", "show flow exporter FLOW-COLLECTOR statistics"],
    notes: ["Select keys and collectors that answer an operational question.", "Flow records contain metadata, not full packet payloads."],
  },
  {
    id: "eem-capture", title: "EEM interface-down capture", certification: "ENCOR", level: "Advanced", category: "Automation",
    purpose: "Capture targeted diagnostics when an uplink line protocol goes down.",
    code: `configure terminal
event manager applet CAPTURE-UPLINK-DOWN
 event syslog pattern "Interface GigabitEthernet0/1, changed state to down"
 action 1.0 cli command "enable"
 action 2.0 cli command "show clock | append bootflash:uplink-events.txt"
 action 3.0 cli command "show interfaces GigabitEthernet0/1 | append bootflash:uplink-events.txt"
 action 4.0 syslog msg "EEM captured uplink diagnostics"
end`,
    verify: ["show event manager policy registered", "show event manager history events"],
    notes: ["Test pattern matching on the target IOS XE release.", "Keep applets bounded so an event cannot consume excessive device resources."],
  },
  {
    id: "restconf-enable", title: "Enable RESTCONF safely", certification: "ENCOR", level: "Advanced", category: "Automation",
    purpose: "Expose model-driven HTTPS management with local AAA for a lab.",
    code: `configure terminal
aaa new-model
username apiadmin privilege 15 secret Use-A-Unique-Secret
ip http secure-server
restconf
netconf-yang
end`,
    verify: ["show platform software yang-management process", "show netconf-yang sessions", "show ip http server status"],
    notes: ["Use centralized identity, scoped privilege, trusted certificates, and management-plane filtering in production.", "Never expose management APIs directly to an untrusted network."],
  },
  {
    id: "full-access-switch", title: "Full secure access-switch baseline", certification: "CCNA", level: "Full build", category: "Campus", full: true,
    purpose: "Combine management, VLAN, trunk, access-edge, STP, security, NTP, logging, and SSH building blocks.",
    code: `enable
configure terminal
hostname ACCESS1
no ip domain-lookup
service password-encryption
service timestamps log datetime msec
enable secret Use-A-Unique-Secret
!
vlan 10
 name USERS
vlan 20
 name VOICE
vlan 99
 name MANAGEMENT
vlan 999
 name NATIVE-BLACKHOLE
!
spanning-tree mode rapid-pvst
spanning-tree portfast edge default
spanning-tree portfast edge bpduguard default
!
interface range GigabitEthernet1/0/1-20
 description User access ports
 switchport mode access
 switchport access vlan 10
 spanning-tree portfast
 spanning-tree bpduguard enable
 switchport port-security
 switchport port-security maximum 1
 switchport port-security mac-address sticky
 switchport port-security violation restrict
 no shutdown
!
interface range GigabitEthernet1/0/47-48
 description LACP uplinks to DIST1
 switchport mode trunk
 switchport trunk native vlan 999
 switchport trunk allowed vlan 10,20,99,999
 channel-group 1 mode active
 no shutdown
!
interface Port-channel1
 description LACP trunk to DIST1
 switchport mode trunk
 switchport trunk native vlan 999
 switchport trunk allowed vlan 10,20,99,999
!
interface Vlan99
 description Management SVI
 ip address 10.10.99.11 255.255.255.0
 no shutdown
ip default-gateway 10.10.99.1
!
ip domain-name lab.example
username netadmin privilege 15 secret Use-A-Unique-Secret
crypto key generate rsa modulus 2048
ip ssh version 2
ip access-list standard MGMT-SOURCES
 permit 10.10.99.0 0.0.0.255
line vty 0 15
 login local
 transport input ssh
 access-class MGMT-SOURCES in
 exec-timeout 10 0
!
ntp server 10.10.99.20
logging host 10.10.99.30
logging trap warnings
end
copy running-config startup-config`,
    verify: ["show interfaces trunk", "show etherchannel summary", "show spanning-tree root", "show port-security", "show ip interface brief", "show logging"],
    notes: ["Paste in sections and verify after each section.", "Replace all sample secrets and addresses before use."],
  },
  {
    id: "full-distribution", title: "Full multilayer distribution switch", certification: "ENCOR", level: "Full build", category: "Campus", full: true,
    purpose: "Provide SVIs, HSRP, deterministic STP, routed core connectivity, and OSPF advertisement.",
    code: `enable
configure terminal
hostname DIST1
ip routing
!
vlan 10
 name USERS
vlan 20
 name VOICE
vlan 99
 name MANAGEMENT
!
spanning-tree mode rapid-pvst
spanning-tree vlan 10,99 root primary
spanning-tree vlan 20 root secondary
!
interface Vlan10
 description Users gateway
 ip address 10.10.10.2 255.255.255.0
 standby version 2
 standby 10 ip 10.10.10.1
 standby 10 priority 110
 standby 10 preempt
 no shutdown
interface Vlan20
 description Voice gateway
 ip address 10.10.20.3 255.255.255.0
 standby version 2
 standby 20 ip 10.10.20.1
 standby 20 priority 90
 standby 20 preempt
 no shutdown
interface Vlan99
 description Management gateway
 ip address 10.10.99.2 255.255.255.0
 standby version 2
 standby 99 ip 10.10.99.1
 standby 99 priority 110
 standby 99 preempt
 no shutdown
!
interface GigabitEthernet1/0/1
 description Routed core link
 no switchport
 ip address 10.0.1.2 255.255.255.252
 no shutdown
!
router ospf 10
 router-id 1.1.1.1
 passive-interface default
 no passive-interface GigabitEthernet1/0/1
 network 10.0.1.0 0.0.0.3 area 0
 network 10.10.10.0 0.0.0.255 area 0
 network 10.10.20.0 0.0.0.255 area 0
 network 10.10.99.0 0.0.0.255 area 0
end
copy running-config startup-config`,
    verify: ["show standby brief", "show spanning-tree root", "show ip ospf neighbor", "show ip route ospf", "show ip interface brief"],
    notes: ["Configure the peer with complementary HSRP priorities and STP roots.", "Use routed point-to-point links toward the core to limit Layer 2 failure domains."],
  },
  {
    id: "full-branch", title: "Full router-on-a-stick branch", certification: "CCNA", level: "Full build", category: "Branch", full: true,
    purpose: "Combine inter-VLAN routing, DHCP relay, ACL policy, OSPF, SSH, and logging for a small branch.",
    code: `enable
configure terminal
hostname BRANCH1
no ip domain-lookup
service timestamps log datetime msec
!
interface GigabitEthernet0/0
 description 802.1Q trunk to ACCESS1
 no shutdown
interface GigabitEthernet0/0.10
 encapsulation dot1Q 10
 ip address 10.20.10.1 255.255.255.0
 ip helper-address 10.10.99.10
 ip access-group USERS-IN in
interface GigabitEthernet0/0.20
 encapsulation dot1Q 20
 ip address 10.20.20.1 255.255.255.0
 ip helper-address 10.10.99.10
!
interface GigabitEthernet0/1
 description WAN to HQ
 ip address 10.0.20.2 255.255.255.252
 no shutdown
!
ip access-list extended USERS-IN
 permit udp any eq bootpc any eq bootps
 permit tcp 10.20.10.0 0.0.0.255 host 10.10.50.20 eq 443
 deny ip 10.20.10.0 0.0.0.255 10.10.0.0 0.0.255.255 log
 permit ip 10.20.10.0 0.0.0.255 any
!
router ospf 10
 router-id 2.2.2.2
 passive-interface default
 no passive-interface GigabitEthernet0/1
 network 10.0.20.0 0.0.0.3 area 0
 network 10.20.10.0 0.0.0.255 area 0
 network 10.20.20.0 0.0.0.255 area 0
!
ip domain-name lab.example
username netadmin privilege 15 secret Use-A-Unique-Secret
crypto key generate rsa modulus 2048
ip ssh version 2
line vty 0 4
 login local
 transport input ssh
!
ntp server 10.10.99.20
logging host 10.10.99.30
end
copy running-config startup-config`,
    verify: ["show ip interface brief", "show ip ospf neighbor", "show ip route", "show ip access-lists USERS-IN", "show logging"],
    notes: ["Confirm DHCP and allowed application flows before enforcing the ACL.", "Use a dedicated management ACL for SSH in production."],
  },
  {
    id: "full-internet-edge", title: "Full small-office internet edge", certification: "CCNA", level: "Full build", category: "Edge", full: true,
    purpose: "Provide LAN addressing, DHCP, PAT, a default route, secure management, and basic WAN validation.",
    code: `enable
configure terminal
hostname EDGE1
no ip domain-lookup
!
interface GigabitEthernet0/0
 description Inside LAN
 ip address 10.30.10.1 255.255.255.0
 ip nat inside
 no shutdown
interface GigabitEthernet0/1
 description ISP handoff
 ip address 198.51.100.10 255.255.255.252
 ip nat outside
 no shutdown
!
ip dhcp excluded-address 10.30.10.1 10.30.10.30
ip dhcp pool OFFICE
 network 10.30.10.0 255.255.255.0
 default-router 10.30.10.1
 dns-server 1.1.1.1 8.8.8.8
!
ip access-list standard NAT-SOURCES
 permit 10.30.10.0 0.0.0.255
ip nat inside source list NAT-SOURCES interface GigabitEthernet0/1 overload
ip route 0.0.0.0 0.0.0.0 198.51.100.9
!
ip domain-name lab.example
username netadmin privilege 15 secret Use-A-Unique-Secret
crypto key generate rsa modulus 2048
ip ssh version 2
line vty 0 4
 login local
 transport input ssh
end
copy running-config startup-config`,
    verify: ["show ip interface brief", "show ip dhcp binding", "show ip nat statistics", "show ip route 0.0.0.0", "show ssh"],
    notes: ["Documentation addresses will not reach the real internet.", "A production edge also needs explicit firewall and management-plane policy."],
  },
  {
    id: "full-ospf-core", title: "Full multi-area OSPF core", certification: "ENCOR", level: "Full build", category: "Routing", full: true,
    purpose: "Build an area-border router with authentication, passive interfaces, and summarization.",
    code: `enable
configure terminal
hostname ABR1
interface Loopback0
 ip address 1.1.1.1 255.255.255.255
interface GigabitEthernet0/0
 description Area 0 core link
 ip address 10.0.0.1 255.255.255.252
 ip ospf authentication message-digest
 ip ospf message-digest-key 1 md5 Use-A-Unique-Key
 no shutdown
interface GigabitEthernet0/1
 description Area 10 distribution link
 ip address 10.0.10.1 255.255.255.252
 ip ospf authentication message-digest
 ip ospf message-digest-key 1 md5 Use-A-Unique-Key
 no shutdown
router ospf 10
 router-id 1.1.1.1
 passive-interface default
 no passive-interface GigabitEthernet0/0
 no passive-interface GigabitEthernet0/1
 area 10 range 10.10.0.0 255.255.0.0
 network 1.1.1.1 0.0.0.0 area 0
 network 10.0.0.0 0.0.0.3 area 0
 network 10.0.10.0 0.0.0.3 area 10
end`,
    verify: ["show ip ospf neighbor", "show ip ospf database", "show ip route ospf", "show ip protocols"],
    notes: ["MD5 syntax varies on newer security standards; use the platform-approved authentication method.", "Summaries originate only when component routes exist in the area."],
  },
  {
    id: "full-dual-stack", title: "Full dual-stack routed edge", certification: "ENCOR", level: "Full build", category: "IPv6", full: true,
    purpose: "Combine IPv4/IPv6 addressing, OSPFv2, OSPFv3, loopbacks, and tracked default routing.",
    code: `enable
configure terminal
hostname DUAL-EDGE1
ipv6 unicast-routing
interface Loopback0
 ip address 10.255.1.1 255.255.255.255
 ipv6 address 2001:DB8:FFFF::1/128
interface GigabitEthernet0/0
 description Core transit
 ip address 10.0.12.1 255.255.255.252
 ipv6 address 2001:DB8:12::1/64
 ospfv3 10 ipv6 area 0
 no shutdown
interface GigabitEthernet0/1
 description ISP transit
 ip address 198.51.100.2 255.255.255.252
 ipv6 address 2001:DB8:100::2/64
 no shutdown
router ospf 10
 router-id 10.255.1.1
 network 10.0.12.0 0.0.0.3 area 0
router ospfv3 10
 router-id 10.255.1.1
 address-family ipv6 unicast
 exit-address-family
ip route 0.0.0.0 0.0.0.0 198.51.100.1
ipv6 route ::/0 2001:DB8:100::1
end`,
    verify: ["show ip route", "show ipv6 route", "show ip ospf neighbor", "show ospfv3 neighbor", "show ipv6 interface brief"],
    notes: ["OSPFv3 configuration style varies by IOS XE release.", "Validate both protocol families independently."],
  },
  {
    id: "full-assurance", title: "Full assurance and telemetry baseline", certification: "ENCOR", level: "Full build", category: "Assurance", full: true,
    purpose: "Combine precise timestamps, logging, SNMPv3, Flexible NetFlow, IP SLA, and event capture.",
    code: `enable
configure terminal
service timestamps log datetime msec localtime show-timezone
ntp server 10.10.99.20 prefer
logging host 10.10.99.30
logging trap warnings
logging source-interface Loopback0
!
snmp-server view NMS iso included
snmp-server group NMS-GROUP v3 priv read NMS
snmp-server user nmsuser NMS-GROUP v3 auth sha Use-A-Unique-Auth priv aes 128 Use-A-Unique-Priv
snmp-server host 10.10.99.31 version 3 priv nmsuser
!
flow record IPV4-FLOW
 match ipv4 source address
 match ipv4 destination address
 match ip protocol
 match transport source-port
 match transport destination-port
 collect counter bytes long
 collect counter packets long
flow exporter NMS-EXPORT
 destination 10.10.99.40
 source Loopback0
 transport udp 2055
flow monitor CAMPUS-FLOW
 record IPV4-FLOW
 exporter NMS-EXPORT
 cache timeout active 60
interface GigabitEthernet0/1
 ip flow monitor CAMPUS-FLOW input
!
ip sla 10
 icmp-echo 10.0.0.1 source-interface Loopback0
 frequency 10
ip sla schedule 10 life forever start-time now
end`,
    verify: ["show ntp associations", "show logging", "show snmp user", "show flow monitor CAMPUS-FLOW cache", "show ip sla statistics"],
    notes: ["Replace sample secrets and restrict collectors with management-plane policy.", "Collect only the telemetry needed for defined operational outcomes."],
  },
  {
    id: "full-automation-ready", title: "Full automation-ready IOS XE baseline", certification: "ENCOR", level: "Full build", category: "Automation", full: true,
    purpose: "Prepare a lab device for secure SSH, NETCONF, RESTCONF, AAA, logging, and consistent source identity.",
    code: `enable
configure terminal
hostname AUTO1
ip domain-name lab.example
aaa new-model
username apiadmin privilege 15 secret Use-A-Unique-Secret
crypto key generate rsa modulus 2048
ip ssh version 2
ip http secure-server
no ip http server
restconf
netconf-yang
interface Loopback0
 description Stable management identity
 ip address 10.255.10.1 255.255.255.255
logging host 10.10.99.30
logging source-interface Loopback0
ntp server 10.10.99.20
line vty 0 15
 login local
 transport input ssh
 exec-timeout 10 0
end
copy running-config startup-config`,
    verify: ["show ssh", "show ip http server status", "show netconf-yang sessions", "show platform software yang-management process", "show logging"],
    notes: ["Use trusted certificates and centralized identity in production.", "Limit API and SSH access to approved management networks."],
  },
];

export const buildingBlocks = scriptLessons.filter((lesson) => !lesson.full);
export const fullBuilds = scriptLessons.filter((lesson) => lesson.full);
