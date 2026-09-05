import { TopologyLab } from "@/components/topology-lab";

export default function TopologiesPage() {
  return (
    <div className="space-y-6">
      <section className="network-card rounded-2xl p-5 sm:p-7">
        <p className="eyebrow">Visual packet-path labs</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Eight topologies. One question: where does the packet go?</h1>
        <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
          Select a diagram, inspect each node, complete the configuration tasks, and prove the result with the listed show commands.
        </p>
      </section>
      <TopologyLab />
    </div>
  );
}
