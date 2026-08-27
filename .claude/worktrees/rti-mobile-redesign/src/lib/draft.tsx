"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* ------------------------------------------------------------------
   The filing draft.

   The portal's request form is one page of about twenty-three fields.
   Here it is five routed steps, so the draft has to live outside any
   one screen — and it has to survive the browser being killed, because
   on a phone that is a normal event, not an edge case. Every change is
   mirrored to localStorage on a short debounce.
------------------------------------------------------------------- */

export const CHAR_LIMIT = 3000;
export const RTI_FEE_INR = 10;

export interface Draft {
  /** Which of the five steps have been completed at least once. */
  done: string[];
  authorityId: string;
  question: string;
  attachmentName?: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  pincode: string;
  state: string;
  /** Optional group — collapsed on step 3 because none of it changes the outcome. */
  phone: string;
  gender: string;
  area: string;
  education: string;
  isBpl: boolean;
  bplCardNo: string;
  bplYear: string;
  bplIssuer: string;
  bplProofName?: string;
}

export const EMPTY_DRAFT: Draft = {
  done: [],
  authorityId: "",
  question: "",
  // Pre-filled from the signed-in profile. A citizen should not retype
  // what the portal already knows about them.
  name: "Ananya Sharma",
  email: "ananya.sharma@example.in",
  mobile: "98765 43210",
  address: "",
  pincode: "",
  state: "",
  phone: "",
  gender: "",
  area: "",
  education: "",
  isBpl: false,
  bplCardNo: "",
  bplYear: "",
  bplIssuer: "",
};

const KEY = "rti_saral_draft";

interface DraftState {
  ready: boolean;
  draft: Draft;
  set: (patch: Partial<Draft>) => void;
  markDone: (step: string) => void;
  clear: () => void;
  /** True once the citizen has typed anything worth keeping. */
  hasContent: boolean;
}

const DraftContext = createContext<DraftState | null>(null);

export function DraftProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [ready, setReady] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Read after mount only, so the server and first client render agree —
  // reading storage during render would produce different HTML on the
  // two sides and blow up hydration. The lint rule below is about
  // derived state; this is a one-shot read of an external store, which
  // has nowhere else to go in a client component.
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem(KEY);
    } catch {
      /* private mode — carry on with a clean draft */
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft((prev) => {
      if (!saved) return prev;
      try {
        return { ...EMPTY_DRAFT, ...JSON.parse(saved) };
      } catch {
        return prev; // corrupt state: start clean rather than crash
      }
    });
    setReady(true);
  }, []);

  // Debounced so a fast typist does not write to storage on every key,
  // but short enough that killing the tab mid-sentence costs a word.
  useEffect(() => {
    if (!ready) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      try {
        window.localStorage.setItem(KEY, JSON.stringify(draft));
      } catch {
        /* storage blocked — the session still works in memory */
      }
    }, 400);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [ready, draft]);

  const set = useCallback((patch: Partial<Draft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const markDone = useCallback((step: string) => {
    setDraft((prev) =>
      prev.done.includes(step) ? prev : { ...prev, done: [...prev.done, step] },
    );
  }, []);

  const clear = useCallback(() => {
    setDraft(EMPTY_DRAFT);
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const hasContent = draft.question.trim().length > 0 || draft.authorityId !== "";

  const value = useMemo(
    () => ({ ready, draft, set, markDone, clear, hasContent }),
    [ready, draft, set, markDone, clear, hasContent],
  );

  return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>;
}

export function useDraft() {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error("useDraft must be used inside DraftProvider");
  return ctx;
}

/* ---- Validation ---------------------------------------------------
   Errors say what is wrong, why it matters, and what to type instead.
   They are checked per step, so a citizen is never shown a summary of
   twelve failures from a form they cannot see.
------------------------------------------------------------------- */

export function authorityError(d: Draft): string | null {
  if (!d.authorityId) return "Choose the office that should answer you.";
  return null;
}

export function questionError(d: Draft): string | null {
  const q = d.question.trim();
  if (q.length === 0) return "Write your question before you continue.";
  if (q.length < 15)
    return "Write at least a sentence, so the officer knows what to look for.";
  if (q.length > CHAR_LIMIT)
    return `You have reached ${CHAR_LIMIT} characters. Put the rest in a PDF and attach it.`;
  return null;
}

export function detailsErrors(d: Draft): Record<string, string> {
  const e: Record<string, string> = {};
  if (!d.name.trim()) e.name = "Your name is needed — the law requires it on the RTI.";
  if (!d.email.trim()) e.email = "We need an email to send your RTI number to.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim()))
    e.email = "This email is missing the part after @. Example: name@gmail.com";
  if (!d.address.trim())
    e.address = "Add your address. The officer may need to post you papers.";
  if (d.pincode && !/^\d{6}$/.test(d.pincode)) e.pincode = "A pincode is 6 digits.";
  return e;
}

export function feeError(d: Draft): string | null {
  if (!d.isBpl) return null;
  if (!d.bplProofName)
    return "Add a photo of your BPL card. Without it the office cannot waive the fee.";
  return null;
}
