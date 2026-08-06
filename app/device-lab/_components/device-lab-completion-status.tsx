"use client";

import { useEffect, useState } from "react";
import type { DeviceSlug } from "@/lib/device-lab";
import { getDeviceLabPractice } from "@/lib/device-lab/local-practice";

export function DeviceLabCompletionStatus({
  deviceSlug,
  moduleIds,
}: {
  deviceSlug: DeviceSlug;
  moduleIds: readonly string[];
}) {
  const [completedCount, setCompletedCount] = useState<number | null>(null);
  const serializedModuleIds = JSON.stringify(moduleIds);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      const stableModuleIds = JSON.parse(serializedModuleIds) as string[];
      const count = stableModuleIds.reduce((total, moduleId) => {
        const { practice } = getDeviceLabPractice(deviceSlug, moduleId);
        return total + (practice.completedAt ? 1 : 0);
      }, 0);

      setCompletedCount(count);
    }, 0);

    return () => window.clearTimeout(loadTimer);
  }, [deviceSlug, serializedModuleIds]);

  const label =
    completedCount === null
      ? "Yerel durum yükleniyor"
      : completedCount === moduleIds.length
        ? "Yerel tamamlandı"
        : `${completedCount}/${moduleIds.length} tamamlandı`;

  return (
    <span className="inline-flex min-h-8 items-center rounded-full border border-moss/30 bg-sage px-3 py-1.5 text-xs font-black leading-none text-moss">
      {label}
    </span>
  );
}
