"use client";

import { useState } from "react";
import { CheckCircle2, MousePointer2, Network, SearchCheck, Server, Waypoints } from "lucide-react";
import { topologies, type TopologyNodeType } from "@/lib/topologies";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const typeStyles: Record<TopologyNodeType, { fill: string; stroke: string }> = {
  router: { fill: "#10283a", stroke: "#34d6ff" },
  switch: { fill: "#132b25", stroke: "#62f5a6" },
  endpoint: { fill: "#252137", stroke: "#aa8cff" },
  server: { fill: "#302718", stroke: "#f5cc61" },
  cloud: { fill: "#1c2530", stroke: "#91a7b8" },
  controller: { fill: "#301d2a", stroke: "#ff7aa2" },
};

function NodeIcon({ type }: { type: TopologyNodeType }) {
  if (type === "server" || type === "endpoint") return <Server className="size-5 text-primary" />;
  if (type === "router" || type === "cloud") return <Waypoints className="size-5 text-primary" />;
  return <Network className="size-5 text-primary" />;
}

export function TopologyLab() {
  const [selectedId, setSelectedId] = useState(topologies[0].id);
  const topology = topologies.find((item) => item.id === selectedId) ?? topologies[0];
  const [selectedNodeId, setSelectedNodeId] = useState(topology.nodes[0].id);
  const selectedNode = topology.nodes.find((node) => node.id === selectedNodeId) ?? topology.nodes[0];
  const nodeMap = new Map(topology.nodes.map((node) => [node.id, node]));

  function selectTopology(id: string) {
    const next = topologies.find((item) => item.id === id) ?? topologies[0];
    setSelectedId(id);
    setSelectedNodeId(next.nodes[0].id);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="network-card h-fit rounded-2xl p-3">
        <p className="px-2 py-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">Lab index</p>
        <div className="space-y-1">
          {topologies.map((item, index) => (
            <Button
              key={item.id}
              type="button"
              variant={item.id === topology.id ? "secondary" : "ghost"}
              className="h-auto w-full justify-start gap-3 px-3 py-3 text-left"
              onClick={() => selectTopology(item.id)}
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-md border font-mono text-xs text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">{item.title}</span>
                <span className="block text-xs text-muted-foreground">{item.level}</span>
              </span>
            </Button>
          ))}
        </div>
      </aside>

      <div className="min-w-0 space-y-5">
        <section className="network-card overflow-hidden rounded-2xl">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b p-5">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-primary">{topology.level}</Badge>
                <span className="font-mono text-xs text-muted-foreground">TOPOLOGY {String(topologies.indexOf(topology) + 1).padStart(2, "0")}</span>
              </div>
              <h2 className="mt-3 text-2xl font-semibold">{topology.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{topology.objective}</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MousePointer2 className="size-4 text-primary" /> Select a node
            </div>
          </div>

          <div className="overflow-x-auto bg-[#050a10] p-3 sm:p-5">
            <svg viewBox="0 0 800 450" className="min-w-[680px]" role="img" aria-label={`${topology.title} interactive network diagram`}>
              <defs>
                <pattern id="topology-grid" width="25" height="25" patternUnits="userSpaceOnUse">
                  <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#193044" strokeWidth="0.7" opacity="0.55" />
                </pattern>
              </defs>
              <rect width="800" height="450" rx="14" fill="url(#topology-grid)" />
              {topology.links.map((link, index) => {
                const from = nodeMap.get(link.from)!;
                const to = nodeMap.get(link.to)!;
                const midX = (from.x + to.x) / 2;
                const midY = (from.y + to.y) / 2;
                return (
                  <g key={`${link.from}-${link.to}-${index}`}>
                    <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={link.dashed ? "#aa8cff" : "#48657a"} strokeWidth="3" strokeDasharray={link.dashed ? "8 7" : undefined} />
                    {link.label ? (
                      <g>
                        <rect x={midX - 42} y={midY - 11} width="84" height="21" rx="10" fill="#07101a" stroke="#274154" />
                        <text x={midX} y={midY + 4} textAnchor="middle" fill="#9ab4c7" fontSize="10" fontFamily="monospace">{link.label}</text>
                      </g>
                    ) : null}
                  </g>
                );
              })}
              {topology.nodes.map((node) => {
                const style = typeStyles[node.type];
                const active = node.id === selectedNode.id;
                return (
                  <g
                    key={node.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`${node.label}: ${node.detail}`}
                    onClick={() => setSelectedNodeId(node.id)}
                    onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setSelectedNodeId(node.id); }}
                    className="cursor-pointer outline-none"
                  >
                    <rect x={node.x - 66} y={node.y - 29} width="132" height="58" rx="10" fill={style.fill} stroke={active ? "#ffffff" : style.stroke} strokeWidth={active ? 3 : 2} />
                    <circle cx={node.x - 48} cy={node.y} r="6" fill={style.stroke} />
                    <text x={node.x - 35} y={node.y - 4} fill="#edf7ff" fontSize="12" fontWeight="600">{node.label}</text>
                    <text x={node.x - 35} y={node.y + 13} fill="#91a7b8" fontSize="9.5" fontFamily="monospace">{node.detail}</text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="grid gap-3 border-t p-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="flex items-center gap-3">
              <NodeIcon type={selectedNode.type} />
              <div>
                <p className="text-sm font-semibold">{selectedNode.label}</p>
                <p className="font-mono text-xs text-muted-foreground">{selectedNode.type} · {selectedNode.detail}</p>
              </div>
            </div>
            <Badge variant="secondary">{topology.nodes.length} nodes · {topology.links.length} links</Badge>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-2">
          <section className="network-card rounded-2xl p-5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-emerald-400" />
              <h3 className="font-semibold">Lab tasks</h3>
            </div>
            <ol className="mt-4 space-y-3">
              {topology.tasks.map((task, index) => (
                <li key={task} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                  <span className="font-mono text-xs text-primary">0{index + 1}</span>{task}
                </li>
              ))}
            </ol>
          </section>
          <section className="network-card rounded-2xl p-5">
            <div className="flex items-center gap-2">
              <SearchCheck className="size-5 text-primary" />
              <h3 className="font-semibold">Verification commands</h3>
            </div>
            <div className="mt-4 space-y-2">
              {topology.verify.map((command) => (
                <code key={command} className="block rounded-lg border bg-background/45 px-3 py-2.5 text-xs text-primary">{command}</code>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
