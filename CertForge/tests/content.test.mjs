import assert from "node:assert/strict";
import test from "node:test";
import { dragExercises } from "../lib/drag-exercises.ts";
import { questionBank } from "../lib/questions.ts";
import { buildingBlocks, fullBuilds } from "../lib/scripts.ts";
import { topologies } from "../lib/topologies.ts";
import { books } from "../lib/books.ts";
import { ccnpTicketCatalog } from "../lib/ccnp-ticket-catalog.ts";
import { difficultyCounts, workplaceScenarios } from "../lib/workplace-scenarios.ts";

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

test("CCNP catalog contains 200 distinct production incident definitions", () => {
  assert.equal(ccnpTicketCatalog.length, 200);
  assert.equal(new Set(ccnpTicketCatalog.map((item) => item.title)).size, 200);
  assert.equal(new Set(ccnpTicketCatalog.map((item) => item.rootCause)).size, 200);
  assert.ok(ccnpTicketCatalog.every((item) => item.domain && item.change && item.complaint && item.evidence && item.fix));
});

test("CCNP workplace scenarios use the exact five requested difficulty ranges", () => {
  assert.equal(workplaceScenarios.length, 200);
  assert.equal(difficultyCounts["Junior Network Engineer"], 40);
  assert.equal(difficultyCounts["Network Engineer"], 50);
  assert.equal(difficultyCounts["Senior Network Engineer"], 50);
  assert.equal(difficultyCounts["Advanced Enterprise Engineer"], 40);
  assert.equal(difficultyCounts["Expert / Multi-Failure Production Incident"], 20);
  assert.ok(workplaceScenarios.slice(0, 40).every((item) => item.difficulty === "Junior Network Engineer"));
  assert.ok(workplaceScenarios.slice(40, 90).every((item) => item.difficulty === "Network Engineer"));
  assert.ok(workplaceScenarios.slice(90, 140).every((item) => item.difficulty === "Senior Network Engineer"));
  assert.ok(workplaceScenarios.slice(140, 180).every((item) => item.difficulty === "Advanced Enterprise Engineer"));
  assert.ok(workplaceScenarios.slice(180).every((item) => item.difficulty === "Expert / Multi-Failure Production Incident" && item.multiFailure));
});

test("every CCNP ticket contains all investigation and hidden-resolution content", () => {
  const ids = new Set();
  const roots = new Set();
  for (const item of workplaceScenarios) {
    assert.ok(!ids.has(item.id), `${item.ticketNumber} duplicate id`); ids.add(item.id);
    assert.ok(!roots.has(item.rootCause), `${item.ticketNumber} duplicate root cause`); roots.add(item.rootCause);
    assert.match(item.ticketNumber, /^CCNP-\d{3}$/);
    assert.ok(item.companyEnvironment.length > 40);
    assert.ok(item.topology.length > 40);
    assert.ok(item.complaint.length > 30);
    assert.ok(item.symptoms.length >= 4);
    assert.ok(item.cliOutput.length > 25);
    assert.ok(item.whatChanged.length > 20);
    assert.ok(item.clues.length >= 3);
    assert.equal(item.investigateFirst.length, 5);
    assert.ok(item.commandsToRun.length >= 5);
    assert.ok(item.diagnosisPrompt.length > 80);
    assert.ok(item.rootCause.length > 30);
    assert.ok(item.troubleshootingProcess.length >= 7);
    assert.ok(item.fixCommands.length >= 1);
    assert.ok(item.verificationCommands.length >= 3);
    assert.ok(item.expectedOutput.length > 120);
    assert.ok(item.whyItHappened.length > 80);
    assert.ok(item.prevention.length >= 3);
    assert.ok(item.productionTicketNotes.length >= 6);
  }
});

test("ticket domains cover the requested enterprise technology families", () => {
  const domains = workplaceScenarios.map((item) => item.domain).join(" | ");
  for (const required of [
    "VLAN", "STP", "EtherChannel", "Inter-VLAN", "OSPF", "EIGRP", "BGP", "redistribution",
    "HSRP", "ACL", "NAT", "DHCP", "IPv4", "QoS", "wireless", "VPN", "security", "AAA",
    "SNMP", "SD-WAN", "Catalyst Center", "APIs", "Campus", "Performance", "Configuration"
  ]) assert.ok(domains.toLowerCase().includes(required.toLowerCase()), `missing domain family ${required}`);
});
