import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Review",
};

export default function ReviewLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
