import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Gianni Network Lab",
    template: "%s | Gianni Network Lab",
  },
  description:
    "A hands-on CCNA and CCNP ENCOR study platform with 600 original practice questions, Cisco IOS configuration examples, drag-and-drop drills, and network topologies.",
  keywords: [
    "CCNA practice test",
    "CCNP ENCOR",
    "Cisco IOS scripts",
    "network engineering labs",
    "Gianni Majorenos",
  ],
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

const themeScript = `
  try {
    const saved = localStorage.getItem('gnl-theme');
    const theme = saved || 'dark';
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
  } catch (_) {}
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
