"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SEED_APPEALS, SEED_CASES, SEED_READ_RESPONSES } from "./mock-data";
import { AppealState } from "./derive";
import {
  PaymentDraft,
  PaymentRecord,
  PaymentState,
  RTI_FEE_INR,
  caseFromDraft,
  makeBankRef,
  makePaymentRef,
  makeRegistrationNumber,
  seedPayments,
} from "./payment";
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

  /** Responses the citizen has opened — drives "review it" clearing. */
  readResponses: string[];
  markResponseRead: (caseId: string) => void;
  readNotifications: string[];
  markNotificationsRead: (ids: string[]) => void;

  payments: PaymentRecord[];
  getPayment: (ref: string) => PaymentRecord | undefined;
  /** Begin a payment attempt and return its reference. */
  startPayment: (draft: PaymentDraft, method: string) => string;
  setPaymentMethod: (ref: string, method: string) => void;
  /** Move a payment to a new state, recording the money trail as it goes. */
  advancePayment: (ref: string, state: PaymentState) => void;
  /** Turn a paid payment into a registered case. Returns the new case id. */
  completeRegistration: (ref: string) => string | undefined;
}

const StoreContext = createContext<StoreState | null>(null);

const AUTH_KEY = "rti_saral_auth";
const NAME_KEY = "rti_saral_name";
// A citizen whose payment is stuck will close the tab and come back hours
// later to check on it. If the record did not survive that, the whole
// Check Payment Status idea would be a lie — so payments and the cases
// they create outlive the session.
const PAYMENTS_KEY = "rti_saral_payments";
const CASES_KEY = "rti_saral_cases";
// What has been seen. Without these, "mark all as read" would come
// undone on the next page load and the badge would cry wolf forever.
const READ_RESP_KEY = "rti_saral_read_responses";
const READ_NOTIF_KEY = "rti_saral_read_notifications";
// An appeal is a legal act. Losing it on a page reload would be the
// worst kind of lie this portal could tell.
const APPEALS_KEY = "rti_saral_appeals";
const DAYS_KEY = "rti_saral_days";

/** Cases the citizen created, as opposed to the three seeded stories. */
function isUserCase(c: RtiCase): boolean {
  return c.id.startsWith("new-");
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [citizenName, setCitizenName] = useState("Ananya Sharma");
  const [cases, setCases] = useState<RtiCase[]>(SEED_CASES);
  const [days, setDays] = useState<Record<string, number>>(() =>
    Object.fromEntries(SEED_CASES.map((c) => [c.id, c.startDay])),
  );
  const [appeals, setAppeals] = useState<Record<string, AppealState>>(SEED_APPEALS);
  const [payments, setPayments] = useState<PaymentRecord[]>(seedPayments);
  const [readResponses, setReadResponses] = useState<string[]>(SEED_READ_RESPONSES);
  const [readNotifications, setReadNotifications] = useState<string[]>([]);

  // localStorage is only read after mount so the server and first client
  // render agree — otherwise every guarded page flashes.
  useEffect(() => {
    try {
      setIsAuthenticated(window.localStorage.getItem(AUTH_KEY) === "1");
      const stored = window.localStorage.getItem(NAME_KEY);
      if (stored) setCitizenName(stored);

      const savedPayments = window.localStorage.getItem(PAYMENTS_KEY);
      if (savedPayments) setPayments(JSON.parse(savedPayments));

      const savedRead = window.localStorage.getItem(READ_RESP_KEY);
      if (savedRead) setReadResponses(JSON.parse(savedRead));

      const savedSeen = window.localStorage.getItem(READ_NOTIF_KEY);
      if (savedSeen) setReadNotifications(JSON.parse(savedSeen));

      const savedAppeals = window.localStorage.getItem(APPEALS_KEY);
      if (savedAppeals) setAppeals(JSON.parse(savedAppeals));

      const savedDays = window.localStorage.getItem(DAYS_KEY);
      if (savedDays) setDays((prev) => ({ ...prev, ...JSON.parse(savedDays) }));

      const savedCases = window.localStorage.getItem(CASES_KEY);
      if (savedCases) {
        const extra: RtiCase[] = JSON.parse(savedCases);
        if (extra.length) {
          setCases([...extra, ...SEED_CASES]);
          setDays((prev) => ({
            ...Object.fromEntries(extra.map((c) => [c.id, c.startDay])),
            ...prev,
          }));
        }
      }
    } catch {
      /* private mode, or corrupt state — carry on with a clean session */
    }
    setReady(true);
  }, []);

  // Mirror to storage once the first read is done, so an empty initial
  // state never overwrites what was saved.
  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
      window.localStorage.setItem(
        CASES_KEY,
        JSON.stringify(cases.filter(isUserCase)),
      );
      window.localStorage.setItem(READ_RESP_KEY, JSON.stringify(readResponses));
      window.localStorage.setItem(
        READ_NOTIF_KEY,
        JSON.stringify(readNotifications),
      );
      window.localStorage.setItem(APPEALS_KEY, JSON.stringify(appeals));
      window.localStorage.setItem(DAYS_KEY, JSON.stringify(days));
    } catch {
      /* storage full or blocked — the session still works in memory */
    }
  }, [
    ready,
    payments,
    cases,
    readResponses,
    readNotifications,
    appeals,
    days,
  ]);

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
      const number = `FA${Math.floor(Math.random() * 9000) + 1000}`;
      setAppeals((prev) => ({
        ...prev,
        [id]: { filedOnDay: onDay, ground, number },
      }));
    },
    [],
  );

  const markResponseRead = useCallback((caseId: string) => {
    setReadResponses((prev) =>
      prev.includes(caseId) ? prev : [...prev, caseId],
    );
  }, []);

  const markNotificationsRead = useCallback((ids: string[]) => {
    setReadNotifications((prev) => [...new Set([...prev, ...ids])]);
  }, []);

  const getPayment = useCallback(
    (ref: string) => payments.find((p) => p.ref === ref),
    [payments],
  );

  // Created in the "payment" state: the citizen is on the pay screen but
  // has not yet authorised anything, so no money has moved.
  const startPayment = useCallback((draft: PaymentDraft, method: string) => {
    const ref = makePaymentRef();
    setPayments((prev) => [
      {
        ref,
        state: "payment",
        amountInr: draft.isBpl ? 0 : RTI_FEE_INR,
        method,
        startedAt: Date.now(),
        draft,
      },
      ...prev,
    ]);
    return ref;
  }, []);

  const setPaymentMethod = useCallback((ref: string, method: string) => {
    setPayments((prev) =>
      prev.map((p) => (p.ref === ref ? { ...p, method } : p)),
    );
  }, []);

  const advancePayment = useCallback((ref: string, state: PaymentState) => {
    setPayments((prev) =>
      prev.map((p) => {
        if (p.ref !== ref) return p;
        const next: PaymentRecord = { ...p, state };
        // A bank reference and a settlement time only exist once the bank
        // has actually confirmed the debit — never invent them earlier.
        if (
          (state === "paid" || state === "pending_registration") &&
          !p.bankRef
        ) {
          next.bankRef = makeBankRef();
          next.settledAt = Date.now();
        }
        return next;
      }),
    );
  }, []);

  const completeRegistration = useCallback(
    (ref: string) => {
      const payment = payments.find((p) => p.ref === ref);
      if (!payment || payment.registrationNumber) return payment?.caseId;

      const id = `new-${Date.now()}`;
      const registrationNumber = makeRegistrationNumber(payment.draft.ministry);
      const newCase = caseFromDraft(payment.draft, id, registrationNumber);

      setCases((prev) => [newCase, ...prev]);
      setDays((prev) => ({ ...prev, [id]: newCase.startDay }));
      setPayments((prev) =>
        prev.map((p) =>
          p.ref === ref
            ? { ...p, state: "registered", caseId: id, registrationNumber }
            : p,
        ),
      );
      return id;
    },
    [payments],
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
      readResponses,
      markResponseRead,
      readNotifications,
      markNotificationsRead,
      payments,
      getPayment,
      startPayment,
      setPaymentMethod,
      advancePayment,
      completeRegistration,
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
      readResponses,
      markResponseRead,
      readNotifications,
      markNotificationsRead,
      payments,
      getPayment,
      startPayment,
      setPaymentMethod,
      advancePayment,
      completeRegistration,
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
