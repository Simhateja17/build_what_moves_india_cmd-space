"use client";

import { usePathname } from "next/navigation";

export function RouteMotion({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="route-motion flex min-h-screen flex-1 flex-col">
      {children}
    </div>
  );
}
