"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/lib/phase-one-content";

const practiceRoutes = new Set([
  "/practice",
  "/listen",
  "/words",
  "/speak",
  "/review",
  "/journal",
]);

function isNavigationItemActive(pathname: string, href: string) {
  if (href === "/today") {
    return pathname === "/" || pathname === "/today";
  }

  if (href === "/practice") {
    return practiceRoutes.has(pathname);
  }

  if (href === "/device-lab") {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  if (href === "/settings") {
    return pathname === href || pathname === "/pilot";
  }

  return pathname === href;
}

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Ana navigasyon"
      className="bottom-navigation fixed inset-x-0 bottom-0 z-30 border-t border-border-subtle bg-surface/95 pt-3 shadow-[0_-18px_42px_rgb(23_32_26_/_0.12)] backdrop-blur-xl"
    >
      <div className="mx-auto max-w-[var(--content-measure)]">
        <div className="grid grid-cols-5 gap-1 rounded-[1.4rem] bg-canvas p-1.5">
          {navigationItems.map((item) => {
            const isActive = isNavigationItemActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-13 min-w-0 items-center justify-center rounded-[1rem] border px-1 py-2 text-center text-xs font-black leading-[1.15] tracking-[-0.02em] outline-none transition active:scale-[0.98] focus-visible:ring-[3px] focus-visible:ring-clay focus-visible:ring-offset-1 focus-visible:ring-offset-surface motion-reduce:transition-none motion-reduce:active:scale-100 sm:px-2 ${
                  isActive
                    ? "border-moss bg-accent-soft text-text-primary shadow-soft visited:text-text-primary"
                    : "border-border-subtle bg-surface text-text-secondary visited:text-text-secondary hover:border-moss hover:bg-linen hover:text-text-primary active:bg-[#e6dac8] active:text-text-primary"
                }`}
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
