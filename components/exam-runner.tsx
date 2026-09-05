"use client";

import { AlarmClock, ArrowLeft, ArrowRight, CheckCircle2, Flag, Play, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { questionBank, type Certification, type Question } from "@/lib/questions";

type ExamMode = "setup" | "active" | "results";

function sampleQuestions(certification: "MIXED" | Certification, length: number, seed: number) {
  const source = questionBank.filter((question) => certification === "MIXED" || question.certification === certification);
  const start = seed % source.length;
  return Array.from({ length: Math.min(length, source.length) }, (_, index) => source[(start + index * 23) % source.length]);
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export function ExamRunner() {
  const [mode, setMode] = useState<ExamMode>("setup");
  const [certification, setCertification] = useState<"MIXED" | Certification>("CCNA");
  const [length, setLength] = useState(50);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<number[]>([]);
  const [index, setIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const finishExam = useCallback(() => {
    setMode("results");
    try {
      const correct = questions.filter((question, questionIndex) => answers[questionIndex] === question.answer).length;
      const saved = JSON.parse(localStorage.getItem("gnl-stats") || "{}") as { answered?: number; correct?: number };
      localStorage.setItem(
        "gnl-stats",
        JSON.stringify({ answered: (saved.answered || 0) + questions.length, correct: (saved.correct || 0) + correct }),
      );
    } catch {
      // Results remain available without local storage.
    }
  }, [answers, questions]);

  useEffect(() => {
    if (mode !== "active") return;
    const timer = window.setTimeout(() => {
      if (seconds <= 1) {
        setSeconds(0);
        finishExam();
      } else {
        setSeconds((value) => value - 1);
      }
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [finishExam, mode, seconds]);

  function startExam() {
    const next = sampleQuestions(certification, length, Date.now());
    setQuestions(next);
    setAnswers({});
    setFlagged([]);
    setIndex(0);
    setSeconds(next.length * 72);
    setMode("active");
  }

  const result = useMemo(() => {
    const correct = questions.filter((question, questionIndex) => answers[questionIndex] === question.answer).length;
    const domains = Array.from(new Set(questions.map((question) => question.domain))).map((domain) => {
      const items = questions.map((question, questionIndex) => ({ question, questionIndex })).filter((item) => item.question.domain === domain);
      return {
        domain,
        total: items.length,
        correct: items.filter((item) => answers[item.questionIndex] === item.question.answer).length,
      };
    });
    return { correct, percent: questions.length ? Math.round((correct / questions.length) * 100) : 0, domains };
  }, [answers, questions]);

  if (mode === "setup") {
    return (
      <section className="network-card mx-auto max-w-3xl rounded-2xl p-5 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Exam track</span>
            <Select value={certification} onValueChange={(value) => setCertification(value as typeof certification)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="CCNA">CCNA</SelectItem>
                <SelectItem value="ENCOR">CCNP ENCOR</SelectItem>
                <SelectItem value="MIXED">Mixed progression</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Exam length</span>
            <Select value={String(length)} onValueChange={(value) => setLength(Number(value))}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="20">20-question checkpoint</SelectItem>
                <SelectItem value="50">50-question practice exam</SelectItem>
                <SelectItem value="100">100-question full simulation</SelectItem>
              </SelectContent>
            </Select>
          </label>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            [String(length), "questions"],
            [formatTime(length * 72), "time limit"],
            ["70%", "practice target"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-xl border bg-background/40 p-4 text-center">
              <p className="font-mono text-2xl font-bold text-primary">{value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm leading-6 text-muted-foreground">
          Questions follow the selected blueprint weighting. You can move backward, flag items, and submit at any time.
          Explanations appear only after the exam ends.
        </p>
        <Button size="lg" className="mt-6 w-full" onClick={startExam}><Play /> Start exam</Button>
      </section>
    );
  }

  if (mode === "results") {
    return (
      <div className="grid gap-5 xl:grid-cols-[.7fr_1.3fr]">
        <section className="network-card rounded-2xl p-6 text-center">
          <CheckCircle2 className={`mx-auto size-12 ${result.percent >= 70 ? "text-emerald-400" : "text-amber-400"}`} />
          <p className="mt-5 font-mono text-6xl font-bold">{result.percent}%</p>
          <h2 className="mt-3 text-xl font-semibold">{result.correct} of {questions.length} correct</h2>
          <p className="mt-2 text-muted-foreground">{result.percent >= 70 ? "Practice target reached." : "Review the weakest domains and try again."}</p>
          <Button className="mt-6 w-full" onClick={() => setMode("setup")}><RotateCcw /> Build another exam</Button>
        </section>
        <section className="network-card rounded-2xl p-5 sm:p-6">
          <h2 className="text-xl font-semibold">Domain breakdown</h2>
          <div className="mt-5 grid gap-4">
            {result.domains.map((item) => {
              const percent = Math.round((item.correct / item.total) * 100);
              return (
                <div key={item.domain}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span>{item.domain}</span>
                    <span className="font-mono text-muted-foreground">{item.correct}/{item.total} · {percent}%</span>
                  </div>
                  <Progress value={percent} />
                </div>
              );
            })}
          </div>
        </section>
        <section className="network-card rounded-2xl p-5 sm:p-6 xl:col-span-2">
          <h2 className="text-xl font-semibold">Answer review</h2>
          <div className="mt-5 grid gap-4">
            {questions.map((question, questionIndex) => {
              const isCorrect = answers[questionIndex] === question.answer;
              return (
                <details key={question.id} className="rounded-xl border bg-background/35 p-4">
                  <summary className="cursor-pointer list-none font-medium">
                    <span className={`mr-3 inline-grid size-7 place-items-center rounded-full font-mono text-xs ${isCorrect ? "bg-emerald-400/15 text-emerald-400" : "bg-destructive/15 text-destructive"}`}>
                      {questionIndex + 1}
                    </span>
                    {question.prompt}
                  </summary>
                  <div className="mt-4 border-t pt-4 text-sm leading-6">
                    <p><span className="text-muted-foreground">Your answer:</span> {answers[questionIndex] === undefined ? "Not answered" : question.choices[answers[questionIndex]]}</p>
                    <p className="mt-1"><span className="text-muted-foreground">Correct answer:</span> {question.choices[question.answer]}</p>
                    <p className="mt-3 text-muted-foreground">{question.explanation}</p>
                  </div>
                </details>
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  const question = questions[index];
  const answered = Object.keys(answers).length;
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_270px]">
      <section className="network-card min-w-0 rounded-2xl p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-primary/35 bg-primary/10 px-2.5 py-1 font-mono text-xs text-primary">{question.certification}</span>
          <span className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground">{question.domain}</span>
          <span className="ml-auto flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-sm"><AlarmClock className="size-4 text-primary" />{formatTime(seconds)}</span>
        </div>
        <Progress value={((index + 1) / questions.length) * 100} className="mt-4 h-1.5" />
        <p className="mt-8 font-mono text-xs text-muted-foreground">Question {index + 1} · {question.id}</p>
        <h2 className="mt-3 text-xl font-semibold leading-8 sm:text-2xl">{question.prompt}</h2>
        <RadioGroup
          className="mt-7"
          value={answers[index] === undefined ? "" : String(answers[index])}
          onValueChange={(value) => setAnswers((current) => ({ ...current, [index]: Number(value) }))}
        >
          {question.choices.map((choice, choiceIndex) => (
            <label key={choice} className="flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition hover:border-primary/60 hover:bg-primary/5">
              <RadioGroupItem value={String(choiceIndex)} className="mt-0.5" />
              <span className="leading-6">{choice}</span>
            </label>
          ))}
        </RadioGroup>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t pt-5">
          <Button variant="outline" onClick={() => setIndex((value) => Math.max(0, value - 1))} disabled={index === 0}><ArrowLeft /> Previous</Button>
          <Button variant={flagged.includes(index) ? "secondary" : "ghost"} onClick={() => setFlagged((items) => items.includes(index) ? items.filter((item) => item !== index) : [...items, index])}><Flag /> {flagged.includes(index) ? "Flagged" : "Flag"}</Button>
          {index + 1 < questions.length ? (
            <Button onClick={() => setIndex((value) => value + 1)}>Next <ArrowRight /></Button>
          ) : (
            <Button onClick={finishExam}>Submit exam <CheckCircle2 /></Button>
          )}
        </div>
      </section>

      <aside className="network-card h-fit rounded-2xl p-5 xl:sticky xl:top-20">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Answered</span>
          <span className="font-mono">{answered}/{questions.length}</span>
        </div>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {questions.map((_, questionIndex) => (
            <button
              type="button"
              key={questionIndex}
              onClick={() => setIndex(questionIndex)}
              aria-label={`Go to question ${questionIndex + 1}`}
              className={`grid aspect-square place-items-center rounded-md border font-mono text-xs transition ${
                questionIndex === index
                  ? "border-primary bg-primary text-primary-foreground"
                  : answers[questionIndex] !== undefined
                    ? "border-emerald-400/45 bg-emerald-400/10 text-emerald-300"
                    : flagged.includes(questionIndex)
                      ? "border-amber-400/45 bg-amber-400/10 text-amber-300"
                      : "bg-background/40 hover:border-primary/50"
              }`}
            >
              {questionIndex + 1}
            </button>
          ))}
        </div>
        <Button variant="outline" className="mt-5 w-full" onClick={finishExam}>Submit now</Button>
      </aside>
    </div>
  );
}
