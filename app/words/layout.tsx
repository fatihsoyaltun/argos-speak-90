import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Words",
};

export default function WordsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
