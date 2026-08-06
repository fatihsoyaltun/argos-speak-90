import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal",
};

export default function JournalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
