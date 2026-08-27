"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SEED_CASES } from "./mock-data";
import { AppealState } from "./derive";
import { RtiCase } from "./types";

interface StoreState {
  ready: boolean;
  isAuthenticated: boolean;
  citizenName: string;
  login: (name?: string) => void;
  logout: () => void;

  cases: RtiCase[];
  getCase: (id: string) => RtiCase | undefined;
  addCase: (c: RtiCase) => void;

  /** Per-case position of the demo time machine. */
  dayOf: (id: string) => number;
  setDay: (id: string, day: number) => void;

  appealOf: (id: string) => AppealState;
  fileAppeal: (id: string, ground: string, onDay: number) => void;
}

const StoreContext = createContext<StoreState | null>(null);

const AUTH_KEY = "rti_saral_auth";
const NAME_KEY = "rti_saral_name";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [citizenName, setCitizenName] = useState("Ananya Sharma");
  const [cases, setCases] = useState<RtiCase[]>(SEED_CASES);
  const [days, setDays] = useState<Record<string, number>>(() =>
    Object.fromEntries(SEED_CASES.map((c) => [c.id, c.startDay])),
  );
  const [appeals, setAppeals] = useState<Record<string, AppealState>>({});

  // localStorage is only read after mount so the server and first client
  // render agree — otherwise every guarded page flashes.
  useEffect(() => {
    try {
      setIsAuthenticated(window.localStorage.getItem(AUTH_KEY) === "1");
      const stored = window.localStorage.getItem(NAME_KEY);
      if (stored) setCitizenName(stored);
    } catch {
      /* private mode — stay signed out */
    }
    setReady(true);
  }, []);

  const login = useCallback((name?: string) => {
    try {
      window.localStorage.setItem(AUTH_KEY, "1");
      if (name) window.localStorage.setItem(NAME_KEY, name);
    } catch {
      /* ignore */
    }
    if (name) setCitizenName(name);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    try {
      window.localStorage.removeItem(AUTH_KEY);
    } catch {
      /* ignore */
    }
    setIsAuthenticated(false);
  }, []);

  const getCase = useCallback(
    (id: string) => cases.find((c) => c.id === id),
    [cases],
  );

  const addCase = useCallback((c: RtiCase) => {
    setCases((prev) => [c, ...prev]);
    setDays((prev) => ({ ...prev, [c.id]: c.startDay }));
  }, []);

  const dayOf = useCallback(
    (id: string) => days[id] ?? getCase(id)?.startDay ?? 0,
    [days, getCase],
  );

  const setDay = useCallback((id: string, day: number) => {
    setDays((prev) => ({ ...prev, [id]: day }));
  }, []);

  const appealOf = useCallback(
    (id: string) => appeals[id] ?? {},
    [appeals],
  );

  const fileAppeal = useCallback(
    (id: string, ground: string, onDay: number) => {
      setAppeals((prev) => ({ ...prev, [id]: { filedOnDay: onDay, ground } }));
    },
    [],
  );

  const value = useMemo(
    () => ({
      ready,
      isAuthenticated,
      citizenName,
      login,
      logout,
      cases,
      getCase,
      addCase,
      dayOf,
      setDay,
      appealOf,
      fileAppeal,
    }),
    [
      ready,
      isAuthenticated,
      citizenName,
      login,
      logout,
      cases,
      getCase,
      addCase,
      dayOf,
      setDay,
      appealOf,
      fileAppeal,
    ],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
