export function RecordsIllustration({ className = "w-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" className={className} aria-hidden="true">
      <circle cx="200" cy="150" r="132" fill="var(--navy-50)" />

      <circle cx="320" cy="70" r="4" fill="var(--green-600)" opacity="0.5" />
      <circle cx="70" cy="200" r="3.5" fill="var(--saffron-400)" opacity="0.6" />

      <g transform="rotate(-8 150 150)">
        <rect x="120" y="86" width="92" height="120" rx="8" fill="var(--surface)" stroke="var(--line)" strokeWidth="1.5" />
        <rect x="134" y="102" width="64" height="8" rx="4" fill="var(--line)" />
        <rect x="134" y="116" width="52" height="6" rx="3" fill="var(--line-2)" />
        <rect x="134" y="130" width="60" height="6" rx="3" fill="var(--line-2)" />
      </g>

      <g transform="rotate(7 250 150)">
        <rect x="214" y="92" width="92" height="120" rx="8" fill="var(--surface)" stroke="var(--line)" strokeWidth="1.5" />
        <rect x="228" y="108" width="64" height="8" rx="4" fill="var(--line)" />
        <rect x="228" y="122" width="40" height="6" rx="3" fill="var(--line-2)" />
        <rect x="228" y="136" width="52" height="6" rx="3" fill="var(--line-2)" />
      </g>

      <path
        d="M104 152 h58 l10,-12 h58 a8,8 0 0 1 8,8 v96 a10,10 0 0 1 -10,10 h-124 a10,10 0 0 1 -10,-10 v-84 a8,8 0 0 1 8,-8 Z"
        fill="var(--navy-800)"
      />
      <path
        d="M92 172 h216 a8,8 0 0 1 8,8 v70 a10,10 0 0 1 -10,10 h-212 a10,10 0 0 1 -10,-10 v-70 a8,8 0 0 1 8,-8 Z"
        fill="var(--navy-600)"
      />

      <circle cx="284" cy="212" r="42" fill="var(--saffron-50)" stroke="var(--saffron-400)" strokeWidth="2" />
      <circle cx="278" cy="203" r="13" fill="none" stroke="var(--navy-800)" strokeWidth="5" />
      <line x1="288" y1="213" x2="300" y2="225" stroke="var(--navy-800)" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}
