"use client";

import { BottomNav } from "./BottomNav";
import { useDashboard } from "@/lib/use-dashboard";

/** Thin wrapper so the layout can stay a server component. */
export function AppBottomNav() {
  const { unreadNotifications } = useDashboard();
  return <BottomNav alerts={unreadNotifications} />;
}
