"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { ready, isAuthenticated } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (ready && !isAuthenticated) router.replace("/login");
  }, [ready, isAuthenticated, router]);

  if (!ready) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <p className="text-sm text-muted">Loading your requests…</p>
      </div>
    );
  }
  if (!isAuthenticated) return null;
  return <>{children}</>;
}
