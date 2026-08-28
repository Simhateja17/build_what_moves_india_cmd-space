export function Emblem({ className = "h-9 w-9" }: { className?: string }) {
  // A stylised chakra mark. Deliberately not the State Emblem — this is a
  // redesign concept, not an official Government of India property.
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="currentColor" opacity="0.08" />
      <circle
        cx="24"
        cy="24"
        r="15"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="24" cy="24" r="3.2" fill="currentColor" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * Math.PI * 2) / 12;
        return (
          <line
            key={i}
            x1={24 + Math.cos(a) * 4}
            y1={24 + Math.sin(a) * 4}
            x2={24 + Math.cos(a) * 15}
            y2={24 + Math.sin(a) * 15}
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}
