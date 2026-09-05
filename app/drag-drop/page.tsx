import type { Metadata } from "next";
import { DragDropLab } from "@/components/drag-drop-lab";

export const metadata: Metadata = {
  title: "Drag-and-Drop Labs",
  description: "Practice CCNA and CCNP ENCOR matching and ordering tasks with 12 interactive exercises.",
};

export default function DragDropPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Interactive performance practice</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Build the answer, not just the memory</h1>
        <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
          Match technologies to behaviors and place protocol events in order. Every task supports mouse,
          touch, and keyboard-friendly tap-to-place controls.
        </p>
      </header>
      <DragDropLab />
    </div>
  );
}
