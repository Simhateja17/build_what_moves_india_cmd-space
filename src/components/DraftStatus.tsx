"use client";

import { useEffect, useState } from "react";

/**
 * Tells the citizen their half-finished request is safe.
 *
 * This matters most for exactly the people this portal is meant to reach:
 * a shared phone, a patchy connection, a form filled in over two sittings.
 * Without a visible "saved" state the rational thing to do is not start.
 *
 * `token` is the serialised draft. It changes whenever the draft changes,
 * which re-keys the label and replays its animation — so the flash needs
 * no state and no effect of its own.
 */
export function DraftStatus({ token }: { token: string }) {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const sync = () => setOnline(window.navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  return (
    <p
      aria-live="polite"
      className={`mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${
        online
          ? "border-line bg-white/70 text-ink-2"
          : "border-saffron-400/50 bg-saffron-50 text-saffron-600"
      }`}
    >
      <span
        key={token}
        aria-hidden
        className={`animate-pop h-1.5 w-1.5 rounded-full ${online ? "bg-govgreen-600" : "bg-saffron-500"}`}
      />
      {online
        ? "Saved on this device"
        : "Offline — your answers are saved on this device"}
    </p>
  );
}
