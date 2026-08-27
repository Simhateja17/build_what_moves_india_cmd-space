export function PrivacyIllustration({ className = "w-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" className={className} aria-hidden="true">
      <circle cx="210" cy="150" r="132" fill="var(--navy-50)" />

      <circle cx="78" cy="66" r="4" fill="var(--green-600)" opacity="0.55" />
      <circle cx="60" cy="98" r="3" fill="var(--saffron-400)" opacity="0.6" />
      <circle cx="330" cy="90" r="3.5" fill="var(--navy-700)" opacity="0.4" />

      <defs>
        <clipPath id="privacyCardClip">
          <rect x="95" y="55" width="170" height="190" rx="16" />
        </clipPath>
      </defs>

      <rect
        x="95"
        y="55"
        width="170"
        height="190"
        rx="16"
        fill="var(--surface)"
        stroke="var(--line)"
        strokeWidth="1.5"
      />
      <g clipPath="url(#privacyCardClip)">
        <rect x="95" y="55" width="170" height="40" fill="var(--navy-800)" />
        <rect x="108" y="68" width="110" height="12" rx="6" fill="var(--navy-700)" />
      </g>

      <circle cx="123" cy="116" r="16" fill="var(--canvas)" stroke="var(--line)" strokeWidth="1.5" />
      <rect x="147" y="108" width="88" height="8" rx="4" fill="var(--line)" />
      <rect x="147" y="122" width="58" height="6" rx="3" fill="var(--line-2)" />

      <line x1="110" y1="145" x2="250" y2="145" stroke="var(--line-2)" strokeWidth="1.5" />

      <rect x="110" y="156" width="140" height="8" rx="4" fill="var(--line)" />
      <rect x="110" y="172" width="108" height="8" rx="4" fill="var(--line-2)" />

      <rect x="110" y="196" width="84" height="12" rx="6" fill="var(--saffron-400)" />

      <rect x="110" y="220" width="16" height="16" rx="4" fill="none" stroke="var(--muted)" strokeWidth="1.5" />
      <rect x="132" y="220" width="16" height="16" rx="4" fill="none" stroke="var(--muted)" strokeWidth="1.5" />
      <rect x="154" y="220" width="16" height="16" rx="4" fill="none" stroke="var(--muted)" strokeWidth="1.5" />

      <circle cx="272" cy="222" r="42" fill="var(--saffron-50)" stroke="var(--saffron-400)" strokeWidth="2" />
      <path
        d="M 258 216 a 14 14 0 0 1 28 0 v 8 h -28 z"
        fill="none"
        stroke="var(--navy-800)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <rect x="253" y="222" width="38" height="30" rx="7" fill="var(--navy-800)" />
      <circle cx="272" cy="234" r="3.2" fill="var(--saffron-50)" />
      <rect x="270" y="234" width="4" height="9" fill="var(--saffron-50)" />
    </svg>
  );
}
