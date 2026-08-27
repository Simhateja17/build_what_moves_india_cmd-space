"use client";

import { useEffect, useRef, useState } from "react";
import { Banner } from "./Primitives";

/* ------------------------------------------------------------------
   Losing signal is normal on a phone, not an exceptional case. Nothing
   is hidden and nothing blocks: cached content stays on screen behind
   a strip that says how fresh it is, and a green line confirms
   recovery and then gets out of the way.
------------------------------------------------------------------- */

type State = "online" | "offline" | "recovered";

export function OfflineBanner() {
  // Starts "online" so the server and first client render agree; the
  // subscription below corrects it if the device is actually offline.
  const [state, setState] = useState<State>("online");
  const wasOffline = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const goOffline = () => {
      wasOffline.current = true;
      if (timer.current) clearTimeout(timer.current);
      setState("offline");
    };

    const goOnline = () => {
      if (!wasOffline.current) {
        setState("online");
        return;
      }
      wasOffline.current = false;
      setState("recovered");
      timer.current = setTimeout(() => setState("online"), 3000);
    };

    // navigator.onLine is only readable on the client, so the initial
    // correction rides the same subscription rather than a second effect.
    if (!navigator.onLine) goOffline();

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  if (state === "offline") {
    return (
      <Banner
        tone="warn"
        action={
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="m-tap shrink-0 rounded-lg px-2 text-[15px] font-semibold underline"
          >
            Try again
          </button>
        }
      >
        No internet. Showing what we saved.
      </Banner>
    );
  }

  if (state === "recovered") {
    return <Banner tone="good">Back online. Everything is up to date.</Banner>;
  }

  return null;
}
