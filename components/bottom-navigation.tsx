"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/lib/phase-one-content";

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-foreground/10 bg-[#fffdf8]/95 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-18px_42px_rgb(23_32_26_/_0.12)] backdrop-blur-xl">
      <div className="mx-auto max-w-3xl overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max min-w-full gap-2 rounded-[1.4rem] bg-[#f7f2ea] p-1.5">
          {navigationItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (pathname === "/" && item.href === "/today");

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className="flex min-h-11 min-w-[4.75rem] shrink-0 items-center justify-center rounded-[1rem] border px-3 py-2.5 text-center text-sm font-bold leading-none outline-none transition active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#8f4f38] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffdf8]"
                style={{
                  backgroundColor: isActive ? "#dce8d8" : "#fffdf8",
                  borderColor: isActive ? "#33493a" : "rgba(23, 32, 26, 0.1)",
                  color: isActive ? "#17201a" : "#3f493f",
                  boxShadow: isActive
                    ? "0 10px 24px rgba(23, 32, 26, 0.12)"
                    : "none",
                }}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
