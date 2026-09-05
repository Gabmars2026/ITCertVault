"use client";

import { CheckCircle2, GripVertical, RotateCcw, XCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { dragExercises } from "@/lib/drag-exercises";

export function DragDropLab() {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const exercise = dragExercises[exerciseIndex];

  function place(targetId: string, itemId: string) {
    setPlacements((current) => {
      const next = Object.fromEntries(Object.entries(current).filter(([, value]) => value !== itemId));
      next[targetId] = itemId;
      return next;
    });
    setSelectedItem(null);
    setChecked(false);
  }

  function reset() {
    setPlacements({});
    setSelectedItem(null);
    setChecked(false);
  }

  function changeExercise(index: number) {
    setExerciseIndex(index);
    setPlacements({});
    setSelectedItem(null);
    setChecked(false);
  }

  const used = new Set(Object.values(placements));
  const correctCount = exercise.targets.filter((target) => placements[target.id] === target.answer).length;

  return (
    <div className="grid gap-5 xl:grid-cols-[270px_1fr]">
      <aside className="network-card h-fit rounded-2xl p-3 xl:sticky xl:top-20">
        <p className="px-2 py-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">12 exercises</p>
        <div className="grid gap-1">
          {dragExercises.map((item, index) => (
            <button
              type="button"
              key={item.id}
              onClick={() => changeExercise(index)}
              className={`rounded-lg px-3 py-2.5 text-left text-sm transition ${index === exerciseIndex ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
            >
              <span className="block font-medium">{item.title}</span>
              <span className={`mt-0.5 block font-mono text-[10px] ${index === exerciseIndex ? "text-primary-foreground/75" : "text-muted-foreground"}`}>{item.certification}</span>
            </button>
          ))}
        </div>
      </aside>

      <section className="network-card min-w-0 rounded-2xl p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="eyebrow">{exercise.certification} performance task</p>
            <h2 className="mt-2 text-2xl font-semibold">{exercise.title}</h2>
            <p className="mt-2 leading-7 text-muted-foreground">{exercise.instruction}</p>
          </div>
          <span className="rounded-full border px-3 py-1 font-mono text-xs text-muted-foreground">{exerciseIndex + 1} / {dragExercises.length}</span>
        </div>
        <Progress value={(Object.keys(placements).length / exercise.targets.length) * 100} className="mt-5 h-1.5" />

        <div className="mt-7 grid gap-6 lg:grid-cols-[.72fr_1.28fr]">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Drag these items</h3>
            <div className="mt-3 grid gap-2">
              {[...exercise.items].reverse().map((item) => (
                <button
                  type="button"
                  draggable={!used.has(item.id)}
                  key={item.id}
                  onDragStart={(event) => event.dataTransfer.setData("text/plain", item.id)}
                  onClick={() => !used.has(item.id) && setSelectedItem(selectedItem === item.id ? null : item.id)}
                  disabled={used.has(item.id)}
                  className={`flex min-h-12 items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                    used.has(item.id)
                      ? "border-transparent bg-muted/40 text-muted-foreground opacity-45"
                      : selectedItem === item.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "cursor-grab bg-background/45 hover:border-primary/60"
                  }`}
                >
                  <GripVertical className="size-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">On a phone, tap an item and then tap its destination.</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Drop beside the correct target</h3>
            <div className="mt-3 grid gap-2">
              {exercise.targets.map((target) => {
                const itemId = placements[target.id];
                const item = exercise.items.find((candidate) => candidate.id === itemId);
                const isCorrect = checked && itemId === target.answer;
                const isWrong = checked && itemId !== undefined && itemId !== target.answer;
                return (
                  <button
                    type="button"
                    key={target.id}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      const dragged = event.dataTransfer.getData("text/plain");
                      if (dragged) place(target.id, dragged);
                    }}
                    onClick={() => {
                      if (selectedItem) place(target.id, selectedItem);
                      else if (itemId) setPlacements((current) => Object.fromEntries(Object.entries(current).filter(([key]) => key !== target.id)));
                    }}
                    className={`grid min-h-16 grid-cols-[1fr_auto] items-center gap-3 rounded-xl border p-3 text-left transition ${
                      isCorrect ? "border-emerald-400/65 bg-emerald-400/10" : isWrong ? "border-destructive/65 bg-destructive/10" : "bg-background/45 hover:border-primary/55"
                    }`}
                  >
                    <span>
                      <span className="block text-xs text-muted-foreground">{target.label}</span>
                      <span className={`mt-1 block font-medium ${item ? "text-foreground" : "text-muted-foreground/60"}`}>{item?.label ?? "Drop item here"}</span>
                    </span>
                    {isCorrect ? <CheckCircle2 className="size-5 text-emerald-400" /> : isWrong ? <XCircle className="size-5 text-destructive" /> : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {checked ? (
          <div className={`mt-6 rounded-xl border p-4 ${correctCount === exercise.targets.length ? "border-emerald-400/45 bg-emerald-400/8" : "border-amber-400/45 bg-amber-400/8"}`}>
            <p className="font-semibold">{correctCount} of {exercise.targets.length} correct</p>
            <p className="mt-2 leading-6 text-muted-foreground">{exercise.explanation}</p>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap justify-between gap-3 border-t pt-5">
          <Button variant="outline" onClick={reset}><RotateCcw /> Reset</Button>
          <div className="flex gap-2">
            <Button onClick={() => setChecked(true)} disabled={Object.keys(placements).length !== exercise.targets.length}><CheckCircle2 /> Check work</Button>
            <Button variant="secondary" onClick={() => changeExercise((exerciseIndex + 1) % dragExercises.length)}>Next lab</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
