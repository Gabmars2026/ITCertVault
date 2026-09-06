import type { Metadata } from "next";
import { ScenarioBank } from "@/components/scenario-bank";
import { scenarioValidation } from "@/lib/scenario-validation";

export const metadata: Metadata = {
  title: "200 CCNP Enterprise Workplace Troubleshooting Tickets",
  description: "Two hundred original production-style CCNP Enterprise incidents with hidden answers, Cisco CLI evidence, diagnosis prompts, repair commands and verification steps."
};

export default function ScenariosPage() {
  if (scenarioValidation.tickets !== 200) throw new Error("CCNP scenario validation did not complete");
  return <ScenarioBank />;
}
