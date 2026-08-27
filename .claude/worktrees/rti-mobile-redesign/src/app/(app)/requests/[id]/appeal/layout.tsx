"use client";

import { createContext, useContext, useMemo, useState } from "react";

/* The appeal is three routed steps sharing one letter, so Back is a
   real browser Back and each step is its own history entry. */

interface AppealDraft {
  ground: string;
  letter: string;
  /** Set once the citizen edits the letter, so regenerating stops. */
  edited: boolean;
}

interface AppealState {
  draft: AppealDraft;
  set: (patch: Partial<AppealDraft>) => void;
}

const Ctx = createContext<AppealState | null>(null);

export default function AppealLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [draft, setDraft] = useState<AppealDraft>({
    ground: "",
    letter: "",
    edited: false,
  });

  const value = useMemo(
    () => ({
      draft,
      set: (patch: Partial<AppealDraft>) =>
        setDraft((prev) => ({ ...prev, ...patch })),
    }),
    [draft],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppealDraft() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppealDraft must be used inside AppealLayout");
  return ctx;
}
