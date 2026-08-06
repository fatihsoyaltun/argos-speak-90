import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İlerleme",
};

export default function StatsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
