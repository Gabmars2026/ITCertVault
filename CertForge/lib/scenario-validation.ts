import { difficultyCounts, workplaceScenarios } from "./workplace-scenarios";

function requireBuild(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`CCNP scenario validation failed: ${message}`);
}

function validateCcnpScenarioBank() {
  requireBuild(workplaceScenarios.length === 200, `expected 200 tickets, got ${workplaceScenarios.length}`);
  requireBuild(new Set(workplaceScenarios.map((item) => item.id)).size === 200, "ticket IDs are not unique");
  requireBuild(new Set(workplaceScenarios.map((item) => item.ticketNumber)).size === 200, "ticket numbers are not unique");
  requireBuild(new Set(workplaceScenarios.map((item) => item.title)).size === 200, "ticket titles are not unique");
  requireBuild(new Set(workplaceScenarios.map((item) => item.rootCause)).size === 200, "root causes are not unique");

  requireBuild(difficultyCounts["Junior Network Engineer"] === 40, "Junior tier must contain 40 tickets");
  requireBuild(difficultyCounts["Network Engineer"] === 50, "Network Engineer tier must contain 50 tickets");
  requireBuild(difficultyCounts["Senior Network Engineer"] === 50, "Senior tier must contain 50 tickets");
  requireBuild(difficultyCounts["Advanced Enterprise Engineer"] === 40, "Advanced tier must contain 40 tickets");
  requireBuild(difficultyCounts["Expert / Multi-Failure Production Incident"] === 20, "Expert tier must contain 20 tickets");

  requireBuild(workplaceScenarios.slice(0, 40).every((item) => item.difficulty === "Junior Network Engineer"), "tickets 001-040 must be Junior");
  requireBuild(workplaceScenarios.slice(40, 90).every((item) => item.difficulty === "Network Engineer"), "tickets 041-090 must be Network Engineer");
  requireBuild(workplaceScenarios.slice(90, 140).every((item) => item.difficulty === "Senior Network Engineer"), "tickets 091-140 must be Senior");
  requireBuild(workplaceScenarios.slice(140, 180).every((item) => item.difficulty === "Advanced Enterprise Engineer"), "tickets 141-180 must be Advanced");
  requireBuild(workplaceScenarios.slice(180).every((item) => item.difficulty === "Expert / Multi-Failure Production Incident" && item.multiFailure), "tickets 181-200 must be multi-failure Expert incidents");

  for (const item of workplaceScenarios) {
    requireBuild(item.investigateFirst.length === 5, `${item.ticketNumber} must contain exactly five first investigations`);
    requireBuild(item.commandsToRun.length >= 5, `${item.ticketNumber} needs at least five evidence commands`);
    requireBuild(item.symptoms.length >= 4, `${item.ticketNumber} needs symptom/scope evidence`);
    requireBuild(item.troubleshootingProcess.length >= 7, `${item.ticketNumber} troubleshooting process is incomplete`);
    requireBuild(item.verificationCommands.length >= 3, `${item.ticketNumber} verification plan is incomplete`);
    requireBuild(item.prevention.length >= 3, `${item.ticketNumber} prevention section is incomplete`);
    requireBuild(item.productionTicketNotes.length >= 6, `${item.ticketNumber} production documentation section is incomplete`);
    requireBuild(item.cliOutput.trim().length > 25, `${item.ticketNumber} CLI evidence is too short`);
    requireBuild(item.rootCause.trim().length > 30, `${item.ticketNumber} root cause is too short`);
  }

  return Object.freeze({
    tickets: workplaceScenarios.length,
    uniqueTitles: 200,
    uniqueRootCauses: 200,
    expertMultiFailure: 20,
    difficultyCounts: Object.freeze({ ...difficultyCounts })
  });
}

export const scenarioValidation = validateCcnpScenarioBank();
