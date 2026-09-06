import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pratik",
};

export default function PracticeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
