import type { Metadata } from "next";
import { ScenarioBank } from "@/components/scenario-bank";

export const metadata: Metadata = { title: "200 CCNA Workplace Scenarios" };

export default function ScenariosPage() { return <ScenarioBank />; }
