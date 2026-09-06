"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BookOpenCheck,
  BookOpenText,
  Boxes,
  Braces,
  ChevronRight,
  CircleUserRound,
  FileQuestion,
  GraduationCap,
  GripVertical,
  Network,
  SunMoon,
  TimerReset,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const navItems = [
  { href: "/", label: "Command Center", icon: Activity },
  { href: "/learn", label: "Learning Path", icon: GraduationCap },
  { href: "/books", label: "Books", icon: BookOpenText },
  { href: "/ccna-tickets", label: "CCNA Tickets", icon: BookOpenCheck, badge: "200" },
  { href: "/scenarios", label: "CCNP Tickets", icon: BookOpenCheck, badge: "200" },
  { href: "/practice", label: "Question Bank", icon: FileQuestion, badge: "600" },
  { href: "/exam", label: "Practice Exams", icon: TimerReset },
  { href: "/drag-drop", label: "Drag & Drop", icon: GripVertical },
  { href: "/scripts", label: "Config Scripts", icon: Braces },
  { href: "/topologies", label: "Topologies", icon: Boxes },
  { href: "/about", label: "About Gianni", icon: CircleUserRound },
];

function ThemeToggle() {
  function toggleTheme() {
    const nextDark = document.documentElement.classList.contains("light");
    document.documentElement.classList.toggle("dark", nextDark);
    document.documentElement.classList.toggle("light", !nextDark);
    localStorage.setItem("gnl-theme", nextDark ? "dark" : "light");
  }

  return (
    <Button
      type="button"
      variant="ghost"
      className="w-full justify-start"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
    >
      <SunMoon />
      <span>Toggle theme</span>
    </Button>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const current = navItems.find((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
  );

  return (
    <SidebarProvider defaultOpen>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader className="border-b border-sidebar-border p-3">
          <Link href="/" className="flex items-center gap-3 overflow-hidden rounded-lg p-1">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-primary/40 bg-primary/10 text-primary">
              <Network className="size-5" />
            </span>
            <span className="min-w-0 group-data-[collapsible=icon]:hidden">
              <span className="block truncate font-semibold tracking-tight">Gianni Network Lab</span>
              <span className="block truncate font-mono text-[11px] text-muted-foreground">CCNA → ENCOR → ENTERPRISE</span>
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Study workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                  if (item.href === "/books") return (
                    <Collapsible key={item.href} asChild defaultOpen={pathname.startsWith("/books")} className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton isActive={active} tooltip="Books">
                            <BookOpenText /><span>Books</span><ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {[{ href: "/books/ccna", label: "CCNA Book" }, { href: "/books/encor", label: "CCNP ENCOR" }, { href: "/books/ccnp-enterprise", label: "CCNP Enterprise" }].map((book) => (
                              <SidebarMenuSubItem key={book.href}><SidebarMenuSubButton asChild isActive={pathname.startsWith(book.href)}><Link href={book.href}><span>{book.label}</span></Link></SidebarMenuSubButton></SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                        <Link href={item.href}>
                          <Icon />
                          <span>{item.label}</span>
                          {item.badge ? (
                            <span className="ml-auto rounded bg-primary/15 px-1.5 py-0.5 font-mono text-[10px] text-primary group-data-[collapsible=icon]:hidden">
                              {item.badge}
                            </span>
                          ) : null}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border">
          <ThemeToggle />
          <div className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
            <BookOpenCheck className="size-3.5 text-primary" />
            Original study questions
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="min-w-0 bg-transparent">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-background/88 px-4 backdrop-blur-xl sm:px-6">
          <SidebarTrigger className="-ml-1" />
          <div className="h-5 w-px bg-border" />
          <p className="min-w-0 truncate text-sm font-medium">{current?.label ?? "Gianni Network Lab"}</p>
          <div className="ml-auto flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1.5 font-mono text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.8)]" />
            Lab online
          </div>
        </header>
        <div className="mx-auto w-full max-w-[1480px] p-4 sm:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
