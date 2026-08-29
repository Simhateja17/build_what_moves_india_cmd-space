"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";

/**
 * The portal's guidelines, before the form — as on the official site, where
 * "Submit Request" opens the twenty-one points and the form only appears
 * once they are accepted.
 *
 * This guards the filing routes themselves rather than the links into them.
 * Gating the links meant every new entry point had to remember to do it, and
 * several did not: the dashboard's "Get assistance", the home page hero, the
 * mobile nav and any typed URL all arrived at the form directly. A route
 * cannot be reached without passing through its own layout, so this holds
 * wherever the citizen came from.
 *
 * Acceptance is stored, so it asks once and never again.
 */
export function GuidelinesGate({ children }: { children: React.ReactNode }) {
  const { ready, prefs } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const accepted = prefs.acceptedGuidelines;
  // Carry the query along, so a link that arrives with state on it comes
  // back to the same place rather than to a bare route.
  const query = params.toString();
  const back = query ? `${pathname}?${query}` : pathname;

  useEffect(() => {
    if (ready && !accepted) {
      router.replace(`/guidelines?next=${encodeURIComponent(back)}`);
    }
  }, [ready, accepted, back, router]);

  // Nothing renders behind the redirect: a flash of the form before the
  // guidelines replace it would defeat the point of showing them first.
  if (!ready || !accepted) return null;
  return <>{children}</>;
}
