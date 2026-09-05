import type { Metadata } from "next";
import { ExamRunner } from "@/components/exam-runner";

export const metadata: Metadata = {
  title: "Timed Practice Exams",
  description: "Build timed CCNA and CCNP ENCOR practice exams with scoring, domain analysis, and answer review.",
};

export default function ExamPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Timed simulation / blueprint-weighted</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Practice under exam conditions</h1>
        <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
          Choose a focused checkpoint or a 100-question simulation. Navigate freely, flag uncertain items,
          then review your score by domain with every answer explained.
        </p>
      </header>
      <ExamRunner />
    </div>
  );
}
