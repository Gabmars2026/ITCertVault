"use client";

import { Check, ChevronRight, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { domains, questionBank, type Certification, type Difficulty, type Question } from "@/lib/questions";

type CertFilter = "ALL" | Certification;
type DifficultyFilter = "ALL" | Difficulty;

function orderedSample(source: Question[], length: number, seed: number) {
  if (!source.length) return [];
  const start = seed % source.length;
  return Array.from({ length: Math.min(length, source.length) }, (_, index) => source[(start + index * 17) % source.length]);
}

function recordAnswer(correct: boolean) {
  try {
    const saved = JSON.parse(localStorage.getItem("gnl-stats") || "{}") as { answered?: number; correct?: number };
    localStorage.setItem(
      "gnl-stats",
      JSON.stringify({ answered: (saved.answered || 0) + 1, correct: (saved.correct || 0) + (correct ? 1 : 0) }),
    );
  } catch {
    // The practice engine remains fully usable when storage is unavailable.
  }
}

export function PracticeEngine() {
  const [certification, setCertification] = useState<CertFilter>("ALL");
  const [domain, setDomain] = useState("ALL");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("ALL");
  const [length, setLength] = useState(20);
  const [seed, setSeed] = useState(0);
  const [session, setSession] = useState(() => orderedSample(questionBank, 20, 0));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const domainOptions = useMemo(
    () =>
      domains
        .filter((item) => certification === "ALL" || item.certification === certification)
        .map((item) => item.name)
        .filter((value, itemIndex, all) => all.indexOf(value) === itemIndex),
    [certification],
  );

  const available = useMemo(
    () =>
      questionBank.filter(
        (question) =>
          (certification === "ALL" || question.certification === certification) &&
          (domain === "ALL" || question.domain === domain) &&
          (difficulty === "ALL" || question.difficulty === difficulty),
      ),
    [certification, domain, difficulty],
  );

  const question = session[index];

  function newDrill() {
    const nextSeed = seed + 29;
    setSession(orderedSample(available, length, nextSeed));
    setSeed(nextSeed);
    setIndex(0);
    setSelected("");
    setSubmitted(false);
    setScore(0);
  }

  function checkAnswer() {
    if (!question || selected === "") return;
    const correct = Number(selected) === question.answer;
    setSubmitted(true);
    if (correct) setScore((value) => value + 1);
    recordAnswer(correct);
  }

  function nextQuestion() {
    if (index + 1 >= session.length) {
      newDrill();
      return;
    }
    setIndex((value) => value + 1);
    setSelected("");
    setSubmitted(false);
  }

  const answeredCount = index + (submitted ? 1 : 0);
  const correct = question && submitted && Number(selected) === question.answer;

  return (
    <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
      <aside className="network-card h-fit rounded-2xl p-5 xl:sticky xl:top-20">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-primary" />
          <h2 className="font-semibold">Build a drill</h2>
        </div>
        <div className="mt-5 grid gap-4">
          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Certification</span>
            <Select
              value={certification}
              onValueChange={(value) => {
                setCertification(value as CertFilter);
                setDomain("ALL");
              }}
            >
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">CCNA + ENCOR</SelectItem>
                <SelectItem value="CCNA">CCNA only</SelectItem>
                <SelectItem value="ENCOR">ENCOR only</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Domain</span>
            <Select value={domain} onValueChange={setDomain}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All domains</SelectItem>
                {domainOptions.map((item) => <SelectItem value={item} key={item}>{item}</SelectItem>)}
              </SelectContent>
            </Select>
          </label>
          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Difficulty</span>
            <Select value={difficulty} onValueChange={(value) => setDifficulty(value as DifficultyFilter)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All levels</SelectItem>
                <SelectItem value="Basic">Basic</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Questions</span>
            <Select value={String(length)} onValueChange={(value) => setLength(Number(value))}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[10, 20, 25, 50, 100].map((item) => <SelectItem key={item} value={String(item)}>{item} questions</SelectItem>)}
              </SelectContent>
            </Select>
          </label>
          <div className="rounded-xl border bg-background/35 p-3 text-sm">
            <span className="font-mono text-xl font-bold text-primary">{available.length}</span>
            <span className="ml-2 text-muted-foreground">matching questions</span>
          </div>
          <Button onClick={newDrill}><RotateCcw /> New filtered drill</Button>
        </div>
      </aside>

      <section className="network-card min-w-0 rounded-2xl p-5 sm:p-7">
        {question ? (
          <>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full border border-primary/35 bg-primary/10 px-2.5 py-1 font-mono text-primary">{question.certification}</span>
              <span className="rounded-full border px-2.5 py-1 text-muted-foreground">{question.domain}</span>
              <span className="rounded-full border px-2.5 py-1 text-muted-foreground">{question.difficulty}</span>
              <span className="ml-auto font-mono text-muted-foreground">{index + 1} / {session.length}</span>
            </div>
            <Progress value={((index + 1) / session.length) * 100} className="mt-4 h-1.5" />
            <p className="mt-8 font-mono text-xs text-muted-foreground">{question.id} · {question.objective}</p>
            <h2 className="mt-3 max-w-4xl text-xl font-semibold leading-8 sm:text-2xl">{question.prompt}</h2>

            <RadioGroup
              value={selected}
              onValueChange={setSelected}
              disabled={submitted}
              className="mt-7"
              aria-label="Answer choices"
            >
              {question.choices.map((choice, choiceIndex) => {
                const isAnswer = choiceIndex === question.answer;
                const isSelected = selected === String(choiceIndex);
                const stateClass = submitted
                  ? isAnswer
                    ? "border-emerald-400/70 bg-emerald-400/10"
                    : isSelected
                      ? "border-destructive/70 bg-destructive/10"
                      : "opacity-65"
                  : "hover:border-primary/60 hover:bg-primary/5";
                return (
                  <label key={choice} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${stateClass}`}>
                    <RadioGroupItem value={String(choiceIndex)} className="mt-0.5" />
                    <span className="leading-6">{choice}</span>
                    {submitted && isAnswer ? <Check className="ml-auto size-5 shrink-0 text-emerald-400" /> : null}
                    {submitted && isSelected && !isAnswer ? <X className="ml-auto size-5 shrink-0 text-destructive" /> : null}
                  </label>
                );
              })}
            </RadioGroup>

            {submitted ? (
              <div className={`mt-6 rounded-xl border p-5 ${correct ? "border-emerald-400/40 bg-emerald-400/8" : "border-amber-400/40 bg-amber-400/8"}`}>
                <p className="font-semibold">{correct ? "Correct" : "Review this objective"}</p>
                <p className="mt-2 leading-7 text-muted-foreground">{question.explanation}</p>
              </div>
            ) : null}

            <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t pt-5">
              <p className="text-sm text-muted-foreground">
                Score: <span className="font-mono font-bold text-foreground">{score}/{answeredCount}</span>
              </p>
              {!submitted ? (
                <Button onClick={checkAnswer} disabled={selected === ""}>Check answer <Check /></Button>
              ) : (
                <Button onClick={nextQuestion}>
                  {index + 1 === session.length ? "Start another drill" : "Next question"} <ChevronRight />
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="grid min-h-96 place-items-center text-center">
            <div>
              <h2 className="text-xl font-semibold">No questions match these filters</h2>
              <p className="mt-2 text-muted-foreground">Choose a broader domain or difficulty.</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
