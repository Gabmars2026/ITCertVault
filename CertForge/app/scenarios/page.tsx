import type { Metadata } from "next";
import { ScenarioBank } from "@/components/scenario-bank";

export const metadata: Metadata = {
  title: "200 CCNP Enterprise Workplace Troubleshooting Tickets",
  description: "Two hundred original production-style CCNP Enterprise incidents with hidden answers, Cisco CLI evidence, diagnosis prompts, repair commands and verification steps."
};

export default function ScenariosPage() {
  return <ScenarioBank />;
}
