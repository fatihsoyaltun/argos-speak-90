import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bugün",
};

export default function TodayLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
