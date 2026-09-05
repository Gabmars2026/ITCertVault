import Link from "next/link";
import { Cable, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="network-card mx-auto max-w-2xl rounded-2xl p-8 text-center sm:p-12">
      <Cable className="mx-auto size-10 text-primary" />
      <p className="eyebrow mt-5">404 / Route not found</p>
      <h1 className="mt-2 text-3xl font-bold">No matching route in the table.</h1>
      <p className="mt-3 text-muted-foreground">Return to the command center and choose a known destination.</p>
      <Button className="mt-6" asChild><Link href="/"><Home /> Command center</Link></Button>
    </div>
  );
}
