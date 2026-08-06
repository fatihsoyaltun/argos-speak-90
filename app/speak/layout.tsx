import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Speak",
};

export default function SpeakLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
