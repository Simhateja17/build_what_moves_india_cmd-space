"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { t } = useLocale();
  const { ready, isAuthenticated } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (ready && !isAuthenticated) router.replace("/login");
  }, [ready, isAuthenticated, router]);

  if (!ready) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <p className="text-sm text-muted">{t("Loading your requests…")}</p>
      </div>
    );
  }
  if (!isAuthenticated) return null;
  return <>{children}</>;
}
