import assert from "node:assert/strict";
import test from "node:test";
import { dragExercises } from "../lib/drag-exercises.ts";
import { questionBank } from "../lib/questions.ts";
import { buildingBlocks, fullBuilds } from "../lib/scripts.ts";
import { topologies } from "../lib/topologies.ts";
import { books } from "../lib/books.ts";
import { workplaceScenarios } from "../lib/workplace-scenarios.ts";

test("question bank contains 600 unique, answerable items", () => {
  assert.equal(questionBank.length, 600);
  assert.equal(new Set(questionBank.map((question) => question.id)).size, 600);
  assert.equal(new Set(questionBank.map((question) => question.prompt)).size, 600);
  assert.equal(questionBank.filter((question) => question.certification === "CCNA").length, 360);
  assert.equal(questionBank.filter((question) => question.certification === "ENCOR").length, 240);

  for (const question of questionBank) {
    assert.equal(question.choices.length, 4, `${question.id} should have four choices`);
    assert.ok(question.answer >= 0 && question.answer < question.choices.length, `${question.id} needs a valid answer`);
    assert.ok(question.explanation.length > 20, `${question.id} needs a useful explanation`);
  }
});

test("drag-and-drop targets reference valid draggable items", () => {
  assert.equal(dragExercises.length, 12);
  for (const exercise of dragExercises) {
    const itemIds = new Set(exercise.items.map((item) => item.id));
    for (const target of exercise.targets) assert.ok(itemIds.has(target.answer), `${exercise.id}/${target.id} has an invalid answer`);
  }
});

test("topology links reference real nodes", () => {
  assert.equal(topologies.length, 8);
  for (const topology of topologies) {
    const nodeIds = new Set(topology.nodes.map((node) => node.id));
    for (const link of topology.links) {
      assert.ok(nodeIds.has(link.from), `${topology.id} has an invalid source node`);
      assert.ok(nodeIds.has(link.to), `${topology.id} has an invalid destination node`);
    }
  }
});

test("script library progresses from snippets to complete builds", () => {
  assert.ok(buildingBlocks.length >= 20);
  assert.ok(fullBuilds.length >= 8);
  assert.ok(buildingBlocks.every((lesson) => !lesson.full));
  assert.ok(fullBuilds.every((lesson) => lesson.full));
  assert.ok([...buildingBlocks, ...fullBuilds].every((lesson) => lesson.code && lesson.verify.length));
});

test("library includes three structured networking books", () => {
  assert.deepEqual(books.map((book) => book.slug), ["ccna", "encor", "ccnp-enterprise"]);
  assert.ok(books.every((book) => book.chapters.length >= 8));
  assert.ok(books.flatMap((book) => book.chapters).every((item) => item.sections.length >= 2 && item.lab.steps.length >= 5 && item.review.length >= 3));
});

test("workplace scenario bank contains 200 answerable incidents", () => {
  assert.equal(workplaceScenarios.length, 200);
  assert.equal(new Set(workplaceScenarios.map((item) => item.id)).size, 200);
  assert.ok(workplaceScenarios.every((item) => item.evidence.length >= 4 && item.answer.length > 100));
});
