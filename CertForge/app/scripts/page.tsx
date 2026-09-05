import type { Metadata } from "next";
import { ScriptLibrary } from "@/components/script-library";

export const metadata: Metadata = {
  title: "Cisco IOS Configuration Library",
  description: "Learn Cisco IOS configuration in small annotated blocks, then study complete CCNA and ENCOR builds.",
};

export default function ScriptsPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Configure / verify / troubleshoot</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Small commands first. Full networks next.</h1>
        <p className="mt-3 max-w-4xl leading-7 text-muted-foreground">
          Start with focused building blocks and read the verification commands after every change. Once each piece makes
          sense, switch to the full configurations to see how routing, switching, security, assurance, and management fit together.
        </p>
      </header>
      <ScriptLibrary />
    </div>
  );
}
