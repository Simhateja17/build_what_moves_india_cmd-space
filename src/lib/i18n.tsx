"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

/* ------------------------------------------------------------------
   Language.

   An access portal that only speaks English excludes most of the people
   it exists for. s.6(1) of the RTI Act itself lets a request be made in
   Hindi or the official language of the area — so the portal insisting
   on English is not just unkind, it is narrower than the statute.

   This covers the shell a citizen navigates by: the navigation, the five
   status words, the deadline lines, list and filter chrome. It does not
   yet cover long-form content (FAQ answers, the assistant's guidance,
   the legal notes), which stays in English and is flagged as such.
   Translating the vocabulary first is possible only because there is now
   exactly one copy of it.
------------------------------------------------------------------- */

export type Locale = "en" | "hi";

export const LOCALES: Array<{ id: Locale; label: string; short: string }> = [
  { id: "en", label: "English", short: "EN" },
  { id: "hi", label: "हिन्दी", short: "हि" },
];

type Dict = Record<string, string>;

const EN: Dict = {
  "nav.home": "Home",
  "nav.requests": "My requests",
  "nav.file": "File a request",
  "nav.help": "Help",

  "stage.filed": "Filed",
  "stage.with_department": "With the department",
  "stage.needs_you": "Action needed",
  "stage.answered": "Answered",
  "stage.closed": "Closed",
  "stage.in_appeal": "In appeal",

  "filter.all": "All",
  "filter.appeal": "In appeal",

  "list.title": "My requests",
  "list.search": "Search by number, department, or subject",
  "list.appNo": "Application no.",
  "list.department": "Department",
  "list.status": "Status",
  "list.deadline": "Deadline",
  "list.lastUpdated": "Last updated",
  "list.view": "View",
  "list.filed": "Filed",

  "lang.label": "Language",
  "lang.partial": "Navigation and statuses are in Hindi. Detailed guidance is still in English.",
};

const HI: Dict = {
  "nav.home": "मुख्य पृष्ठ",
  "nav.requests": "मेरे आवेदन",
  "nav.file": "नया आवेदन",
  "nav.help": "सहायता",

  "stage.filed": "दायर किया गया",
  "stage.with_department": "विभाग के पास",
  "stage.needs_you": "आपकी कार्रवाई ज़रूरी",
  "stage.answered": "उत्तर मिला",
  "stage.closed": "बंद",
  "stage.in_appeal": "अपील में",

  "filter.all": "सभी",
  "filter.appeal": "अपील में",

  "list.title": "मेरे आवेदन",
  "list.search": "संख्या, विभाग या विषय से खोजें",
  "list.appNo": "आवेदन संख्या",
  "list.department": "विभाग",
  "list.status": "स्थिति",
  "list.deadline": "समय-सीमा",
  "list.lastUpdated": "अंतिम अपडेट",
  "list.view": "देखें",
  "list.filed": "दायर",

  "lang.label": "भाषा",
  "lang.partial": "नेविगेशन और स्थिति हिन्दी में हैं। विस्तृत मार्गदर्शन अभी अंग्रेज़ी में है।",
};

const DICTS: Record<Locale, Dict> = { en: EN, hi: HI };

const LOCALE_KEY = "rti_saral_locale";

interface LocaleState {
  locale: Locale;
  setLocale: (next: Locale) => void;
  /** Translate a key, falling back to English and then to the key itself. */
  t: (key: string, fallback?: string) => string;
}

const LocaleContext = createContext<LocaleState | null>(null);

/* The chosen locale is browser state, not React state, so it is read
   through useSyncExternalStore: that gives a stable server snapshot
   ("en") and the real value on the client without a setState-in-effect
   and without a hydration mismatch. */

let current: Locale = "en";
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Locale {
  try {
    const saved = window.localStorage.getItem(LOCALE_KEY);
    if (saved === "hi" || saved === "en") current = saved;
  } catch {
    /* private mode — whatever is in memory stands */
  }
  return current;
}

/** The server has no browser storage, so it always renders English. */
function getServerSnapshot(): Locale {
  return "en";
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Keep the document language honest, so screen readers and the browser's
  // own translation offer behave correctly.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    current = next;
    try {
      window.localStorage.setItem(LOCALE_KEY, next);
    } catch {
      /* not persisted, still applied for this session */
    }
    listeners.forEach((listener) => listener());
  }, []);

  const t = useCallback(
    (key: string, fallback?: string) =>
      DICTS[locale][key] ?? EN[key] ?? fallback ?? key,
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleState {
  const ctx = useContext(LocaleContext);
  // Usable outside the provider so a stray component never crashes the page.
  if (!ctx) {
    return {
      locale: "en",
      setLocale: () => {},
      t: (key, fallback) => EN[key] ?? fallback ?? key,
    };
  }
  return ctx;
}
