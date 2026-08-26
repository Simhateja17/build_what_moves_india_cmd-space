"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { SEED_REQUESTS } from "./mock-data";
import { RtiRequest } from "./types";

interface StoreState {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  requests: RtiRequest[];
  getRequest: (id: string) => RtiRequest | undefined;
  addRequest: (req: RtiRequest) => void;
}

const StoreContext = createContext<StoreState | null>(null);

const AUTH_KEY = "rti_demo_authenticated";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(AUTH_KEY) === "1";
  });
  const [requests, setRequests] = useState<RtiRequest[]>(SEED_REQUESTS);

  const login = useCallback(() => {
    window.localStorage.setItem(AUTH_KEY, "1");
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  }, []);

  const getRequest = useCallback(
    (id: string) => requests.find((r) => r.id === id),
    [requests],
  );

  const addRequest = useCallback((req: RtiRequest) => {
    setRequests((prev) => [req, ...prev]);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout,
      requests,
      getRequest,
      addRequest,
    }),
    [isAuthenticated, login, logout, requests, getRequest, addRequest],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
