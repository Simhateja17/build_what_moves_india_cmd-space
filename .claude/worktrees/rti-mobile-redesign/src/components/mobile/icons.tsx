/* Line icons at a single weight. Drawn rather than imported so the whole
   set is three shapes and nothing is fetched over a slow connection. */

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function HomeIcon({ className }: { className?: string }) {
  return (
    <svg {...base} className={className} aria-hidden>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V20h13V9.5" />
      <path d="M9.5 20v-6h5v6" />
    </svg>
  );
}

export function FileIcon({ className }: { className?: string }) {
  return (
    <svg {...base} className={className} aria-hidden>
      <path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8z" />
      <path d="M14 3v5h5" />
      <path d="M8.5 13h7M8.5 17h4" />
    </svg>
  );
}

export function HelpIcon({ className }: { className?: string }) {
  return (
    <svg {...base} className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.6 2.6 0 0 1 5 1c0 1.7-2.5 2-2.5 3.5" />
      <path d="M12 17.4h.01" />
    </svg>
  );
}

export function BackIcon({ className }: { className?: string }) {
  return (
    <svg {...base} className={className} aria-hidden>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

export function CopyIcon({ className }: { className?: string }) {
  return (
    <svg {...base} className={className} aria-hidden>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M15 5.5A1.5 1.5 0 0 0 13.5 4h-8A1.5 1.5 0 0 0 4 5.5v8A1.5 1.5 0 0 0 5.5 15" />
    </svg>
  );
}

export function TickIcon({ className }: { className?: string }) {
  return (
    <svg {...base} className={className} aria-hidden>
      <path d="M4.5 12.5l5 5 10-11" />
    </svg>
  );
}
