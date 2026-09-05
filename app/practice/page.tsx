import type { Metadata } from "next";
import { PracticeEngine } from "@/components/practice-engine";

export const metadata: Metadata = {
  title: "600-Question Practice Bank",
  description: "Filter and answer 600 original CCNA and CCNP ENCOR practice questions with explanations.",
};

export default function PracticePage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Question bank / 600 original items</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Practice one objective at a time</h1>
        <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
          Filter by certification, official domain, and difficulty. Answers stay hidden until you commit,
          then each item explains the underlying behavior and useful verification command.
        </p>
      </header>
      <PracticeEngine />
    </div>
  );
}
