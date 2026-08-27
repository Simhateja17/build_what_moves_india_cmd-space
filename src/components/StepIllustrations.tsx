/* ------------------------------------------------------------------
   The ten steps of filing an RTI online, drawn.

   These are mockups, not icons: each one shows the actual screen the
   citizen will be looking at, with its real labels — "User ID / Email
   ID", "Select State", "Net Banking" — rather than grey placeholder
   bars. That is the whole point of a guide like this. Somebody who has
   read it should recognise the page when they get there.

   Everything is built from four reusable shells — laptop, phone,
   clipboard, envelope — so the ten read as one set. Colours come from
   the site's own tokens.
------------------------------------------------------------------- */

const NAVY = "#2d578f";
const BLUE = "#4778bd";
const BLUE_DEEP = "#3564a4";
const PALE = "#dceaff";
const FIELD_BG = "#edf4ff";
const GREEN = "#138808";
const GREEN_CARD = "#1f9d4d";
const GREY = "#8b99ae";
const PAPER = "#ffffff";
const LEAF = "#7ea8dd";

const VB = { viewBox: "0 0 200 160", xmlns: "http://www.w3.org/2000/svg" };
type ArtProps = { className?: string };

/* ---- Shells ------------------------------------------------------ */

/** Laptop. Screen area is x 26–174, y 12–104. */
function Laptop({ children }: { children: React.ReactNode }) {
  return (
    <g>
      <rect x="22" y="8" width="156" height="100" rx="7" fill={PAPER} stroke={NAVY} strokeWidth="2.8" />
      {children}
      <path d="M10 112 H190 L183 124 H17 Z" fill={NAVY} />
      <rect x="6" y="124" width="188" height="5" rx="2.5" fill={PALE} />
    </g>
  );
}

/** Phone, with the side buttons the reference shows. Screen x 68–132. */
function Phone({ children }: { children: React.ReactNode }) {
  return (
    <g>
      <rect x="59" y="6" width="82" height="140" rx="12" fill={PAPER} stroke={NAVY} strokeWidth="2.8" />
      <rect x="56" y="40" width="4" height="14" rx="2" fill={NAVY} />
      <rect x="56" y="60" width="4" height="20" rx="2" fill={NAVY} />
      <rect x="140" y="48" width="4" height="24" rx="2" fill={NAVY} />
      <rect x="88" y="13" width="24" height="3.5" rx="1.75" fill={PALE} />
      {children}
    </g>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <g>
      <circle cx="176" cy="22" r="19" fill={FIELD_BG} />
      {children}
    </g>
  );
}

function Tick({ cx, cy, r = 13 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={GREEN} />
      <path
        d={`M${cx - r * 0.42} ${cy} L${cx - r * 0.08} ${cy + r * 0.36} L${cx + r * 0.46} ${cy - r * 0.34}`}
        stroke={PAPER}
        strokeWidth={r * 0.3}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </g>
  );
}

/** An input with its real placeholder text, as the portal shows it. */
function Input({
  x, y, w, h = 13, label, value,
}: { x: number; y: number; w: number; h?: number; label: string; value?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="3" fill={PAPER} stroke={PALE} strokeWidth="1.8" />
      <text x={x + 4.5} y={y + h / 2 + 2.2} fontSize="6" fill={value ? NAVY : GREY} fontWeight={value ? 600 : 400}>
        {label}
      </text>
    </g>
  );
}

/** A select, with the caret the reference draws. */
function Select({ x, y, w, label }: { x: number; y: number; w: number; label: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height="13" rx="3" fill={PAPER} stroke={PALE} strokeWidth="1.8" />
      <text x={x + 4.5} y={y + 8.6} fontSize="6" fill={GREY}>
        {label}
      </text>
      <path d={`M${x + w - 10} ${y + 5.5} l3 3.5 l3 -3.5`} stroke={BLUE} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

function Btn({ x, y, w, h = 14, label }: { x: number; y: number; w: number; h?: number; label: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="3" fill={BLUE} />
      <text x={x + w / 2} y={y + h / 2 + 2.4} textAnchor="middle" fontSize="6.5" fontWeight="700" fill={PAPER}>
        {label}
      </text>
    </g>
  );
}

/** The potted plant that stands beside the laptop on the reference sheet. */
function Plant({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M8 2 C-2 8 -1 22 8 24 C14 18 14 8 8 2" fill={GREEN} opacity="0.75" />
      <path d="M10 6 C20 10 20 24 11 26 C6 20 6 11 10 6" fill={LEAF} />
      <path d="M2 26 H20 L17 42 H5 Z" fill={GREY} opacity="0.55" />
    </g>
  );
}

/* ---- 1. Go to the portal ----------------------------------------- */
export function Step1Art({ className }: ArtProps) {
  return (
    <svg {...VB} className={className} aria-hidden>
      {/* Behind the laptop, so only the leaves clear its right edge —
          the laptop screen is opaque and would otherwise cover it. */}
      <Plant x={168} y={62} />
      <Laptop>
        <circle cx="46" cy="34" r="9" fill={NAVY} />
        <circle cx="46" cy="34" r="5" fill={PAPER} />
        <text x="62" y="32" fontSize="11" fontWeight="700" fill={NAVY}>RTI ONLINE</text>
        <text x="62" y="42" fontSize="5" fill={GREY}>An Initiative of Department of</text>
        <text x="62" y="50" fontSize="5" fill={GREY}>Personnel &amp; Training, GOI</text>
        <Btn x={46} y={66} w={106} h={17} label="www.rtionline.gov.in" />
      </Laptop>
      <Badge>
        <circle cx="176" cy="22" r="10.5" fill="none" stroke={BLUE} strokeWidth="2.4" />
        <path d="M165.5 22 H186.5 M176 11.5 C180 16 180 28 176 32.5 C172 28 172 16 176 11.5" stroke={BLUE} strokeWidth="2.4" fill="none" />
      </Badge>
    </svg>
  );
}

/* ---- 2. Register ------------------------------------------------- */
export function Step2Art({ className }: ArtProps) {
  return (
    <svg {...VB} className={className} aria-hidden>
      <Phone>
        <text x="100" y="30" textAnchor="middle" fontSize="7.5" fontWeight="700" fill={NAVY}>
          Create an Account
        </text>
        <circle cx="100" cy="48" r="11" fill={FIELD_BG} />
        <circle cx="100" cy="44.5" r="4" fill={GREY} />
        <path d="M93 54.5 C94.5 50 105.5 50 107 54.5 Z" fill={GREY} />
        <Input x={68} y={66} w={64} label="Name" />
        <Input x={68} y={82} w={64} label="Email ID" />
        <Input x={68} y={98} w={64} label="Mobile Number" />
        <Input x={68} y={114} w={64} label="Password" />
        <Btn x={68} y={131} w={64} h={12} label="Register" />
      </Phone>
      {/* Leaf flourish, bottom right, as on the reference */}
      <path d="M150 118 C168 108 182 118 178 136 C164 142 150 132 150 118" fill={LEAF} opacity="0.5" />
      <Badge>
        <path d="M176 11 L188 16 V25 C188 31 182 35 176 36 C170 35 164 31 164 25 V16 Z" fill={GREEN} />
        <path d="M170.5 23.5 L174.5 27.5 L182 19" stroke={PAPER} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </Badge>
    </svg>
  );
}

/* ---- 3. Login ---------------------------------------------------- */
export function Step3Art({ className }: ArtProps) {
  return (
    <svg {...VB} className={className} aria-hidden>
      <Plant x={168} y={62} />
      <Laptop>
        <text x="100" y="30" textAnchor="middle" fontSize="9" fontWeight="700" fill={NAVY}>Login</text>
        <Input x={44} y={38} w={112} label="User ID / Email ID" />
        <Input x={44} y={56} w={112} label="Password" />
        <Btn x={44} y={74} w={112} label="Login" />
        <text x="100" y="99" textAnchor="middle" fontSize="5.5" fill={BLUE}>Forgot Password?</text>
      </Laptop>
      <Badge>
        <rect x="168" y="21" width="16" height="13" rx="3" fill={BLUE} />
        <path d="M171 21 V17.5 A5 5 0 0 1 181 17.5 V21" stroke={BLUE} strokeWidth="2.6" fill="none" />
      </Badge>
    </svg>
  );
}

/* ---- 4. Select public authority ---------------------------------- */
export function Step4Art({ className }: ArtProps) {
  return (
    <svg {...VB} className={className} aria-hidden>
      <Laptop>
        <text x="34" y="26" fontSize="7.5" fontWeight="700" fill={NAVY}>Select Public Authority</text>
        <text x="34" y="42" fontSize="6" fill={NAVY}>State</text>
        <Select x={82} y={33} w={82} label="Select State" />
        <text x="34" y="60" fontSize="6" fill={NAVY}>Department</text>
        <Select x={82} y={51} w={82} label="Select Department" />
        <text x="34" y="78" fontSize="6" fill={NAVY}>Public Authority</text>
        <Select x={82} y={69} w={82} label="Select Public Authority" />
        <Btn x={82} y={87} w={44} h={13} label="Continue" />
      </Laptop>
      <Badge>
        <path d="M166 20 L176 13 L186 20 Z" fill={BLUE} />
        <rect x="168" y="21" width="3.5" height="9" fill={BLUE} />
        <rect x="174.5" y="21" width="3.5" height="9" fill={BLUE} />
        <rect x="181" y="21" width="3.5" height="9" fill={BLUE} />
        <rect x="166" y="31" width="20" height="3" rx="1.5" fill={BLUE} />
      </Badge>
    </svg>
  );
}

/* ---- 5. Fill the form -------------------------------------------- */
const FORM_ROWS = [
  "Personal Details",
  "Contact Details",
  "Information Requested",
  "Details of Information",
  "Mode of Receipt",
];

export function Step5Art({ className }: ArtProps) {
  return (
    <svg {...VB} className={className} aria-hidden>
      <rect x="34" y="14" width="116" height="134" rx="8" fill={PAPER} stroke={NAVY} strokeWidth="2.8" />
      <rect x="78" y="6" width="30" height="15" rx="5" fill={NAVY} />
      <circle cx="93" cy="13.5" r="3.5" fill={PAPER} />
      <text x="48" y="42" fontSize="7.5" fontWeight="700" fill={NAVY}>RTI Application Form</text>
      {FORM_ROWS.map((label, i) => {
        const y = 56 + i * 17;
        return (
          <g key={label}>
            <rect x="48" y={y} width="9" height="9" rx="2" fill={GREEN} />
            <path d={`M50.5 ${y + 4.5} l2 2 l4 -4.5`} stroke={PAPER} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <text x="62" y={y + 7.5} fontSize="6" fill={NAVY}>{label}</text>
          </g>
        );
      })}
      <g transform="rotate(26 162 76)">
        <rect x="156" y="34" width="12" height="66" rx="3" fill={BLUE} />
        <path d="M156 100 L168 100 L162 116 Z" fill={NAVY} />
        <rect x="156" y="34" width="12" height="9" rx="3" fill={BLUE_DEEP} />
      </g>
    </svg>
  );
}

/* ---- 6. Pay the fee ---------------------------------------------- */
const MODES = ["Net Banking", "UPI", "Debit/Credit Card", "Wallet"];

export function Step6Art({ className }: ArtProps) {
  return (
    <svg {...VB} className={className} aria-hidden>
      <g transform="translate(-22 0)">
        <Phone>
          <text x="100" y="30" textAnchor="middle" fontSize="7.5" fontWeight="700" fill={NAVY}>Payment</text>
          <text x="100" y="42" textAnchor="middle" fontSize="5.5" fill={GREY}>Application Fee</text>
          <text x="100" y="58" textAnchor="middle" fontSize="15" fontWeight="700" fill={GREEN}>₹10</text>
          <text x="70" y="72" fontSize="5.5" fontWeight="600" fill={NAVY}>Select Payment Mode</text>
          {MODES.map((m, i) => {
            const y = 80 + i * 13;
            return (
              <g key={m}>
                <circle cx="73" cy={y + 3} r="3" fill="none" stroke={i === 1 ? BLUE : GREY} strokeWidth="1.5" />
                {i === 1 && <circle cx="73" cy={y + 3} r="1.5" fill={BLUE} />}
                <text x="81" y={y + 5} fontSize="5.5" fill={NAVY}>{m}</text>
              </g>
            );
          })}
          <Btn x={68} y={131} w={64} h={12} label="Pay Now" />
        </Phone>
      </g>
      <g transform="rotate(-14 148 66)">
        <rect x="116" y="42" width="66" height="43" rx="6" fill={GREEN_CARD} />
        <rect x="116" y="53" width="66" height="9" fill={NAVY} opacity="0.35" />
        <rect x="123" y="68" width="22" height="8" rx="2" fill={PAPER} opacity="0.85" />
      </g>
      <Tick cx={150} cy={110} r={15} />
    </svg>
  );
}

/* ---- 7. Submit --------------------------------------------------- */
export function Step7Art({ className }: ArtProps) {
  return (
    <svg {...VB} className={className} aria-hidden>
      <Laptop>
        <Tick cx={100} cy={30} r={12} />
        <text x="100" y="54" textAnchor="middle" fontSize="7.5" fontWeight="700" fill={NAVY}>Application Submitted</text>
        <text x="100" y="64" textAnchor="middle" fontSize="7.5" fontWeight="700" fill={NAVY}>Successfully!</text>
        <text x="100" y="76" textAnchor="middle" fontSize="5.5" fill={GREY}>Your RTI Application Number is</text>
        <text x="100" y="86" textAnchor="middle" fontSize="6.5" fontWeight="700" fill={NAVY}>MORTH/R/E/26/01193</text>
        <Btn x={86} y={91} w={28} h={12} label="OK" />
      </Laptop>
    </svg>
  );
}

/* ---- 8. Acknowledgement ------------------------------------------ */
export function Step8Art({ className }: ArtProps) {
  return (
    <svg {...VB} className={className} aria-hidden>
      <rect x="58" y="20" width="84" height="58" rx="4" fill={PAPER} stroke={PALE} strokeWidth="1.8" />
      {[32, 43, 54, 65].map((y) => (
        <rect key={y} x="68" y={y} width={y === 65 ? 38 : 64} height="5" rx="2.5" fill={PALE} />
      ))}
      <path d="M34 64 H166 V130 A5 5 0 0 1 161 135 H39 A5 5 0 0 1 34 130 Z" fill={BLUE} />
      <path d="M34 64 L100 110 L166 64" fill={BLUE_DEEP} />
      <path d="M34 135 L100 89 L166 135 Z" fill={BLUE} />
      <Tick cx={146} cy={104} r={16} />
      <Badge>
        <path d="M176 11 A9.5 9.5 0 0 1 185.5 20.5 V27 L189 31 H163 L166.5 27 V20.5 A9.5 9.5 0 0 1 176 11" fill={BLUE} />
        <path d="M172.2 33 A3.9 3.9 0 0 0 179.8 33" stroke={BLUE} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      </Badge>
    </svg>
  );
}

/* ---- 9. Track ---------------------------------------------------- */
export function Step9Art({ className }: ArtProps) {
  return (
    <svg {...VB} className={className} aria-hidden>
      <Laptop>
        <text x="100" y="26" textAnchor="middle" fontSize="7.5" fontWeight="700" fill={NAVY}>Track RTI Application</text>
        <Input x={40} y={32} w={120} label="Enter Application Number" />
        <Input x={40} y={49} w={120} label="MORTH/R/E/26/01193" value />
        <Btn x={78} y={67} w={44} h={13} label="Track" />
        <line x1="48" y1="90" x2="152" y2="90" stroke={PALE} strokeWidth="3" strokeLinecap="round" />
        <line x1="48" y1="90" x2="100" y2="90" stroke={GREEN} strokeWidth="3" strokeLinecap="round" />
        <circle cx="48" cy="90" r="5.5" fill={GREEN} />
        <circle cx="100" cy="90" r="5.5" fill={GREEN} />
        <circle cx="152" cy="90" r="5.5" fill={PALE} />
        <text x="48" y="102" textAnchor="middle" fontSize="5" fill={GREY}>Received</text>
        <text x="100" y="102" textAnchor="middle" fontSize="5" fill={GREY}>In Progress</text>
        <text x="152" y="102" textAnchor="middle" fontSize="5" fill={GREY}>Disposed</text>
      </Laptop>
      <Badge>
        <path d="M164 22 C169 15 183 15 188 22 C183 29 169 29 164 22 Z" fill="none" stroke={BLUE} strokeWidth="2.4" />
        <circle cx="176" cy="22" r="4" fill={BLUE} />
      </Badge>
    </svg>
  );
}

/* ---- 10. Receive, or appeal -------------------------------------- */
export function Step10Art({ className }: ArtProps) {
  return (
    <svg {...VB} className={className} aria-hidden>
      <path d="M36 14 H108 L140 46 V138 A5 5 0 0 1 135 143 H41 A5 5 0 0 1 36 138 Z" fill={PAPER} stroke={NAVY} strokeWidth="2.8" />
      <path d="M108 14 V46 H140" fill={PALE} stroke={NAVY} strokeWidth="2.8" strokeLinejoin="round" />
      {[62, 76, 90, 104].map((y) => (
        <rect key={y} x="52" y={y} width={y === 104 ? 44 : 72} height="6" rx="3" fill={PALE} />
      ))}
      <Tick cx={118} cy={118} r={18} />
      <Badge>
        <path d="M176 11 V34 M167 34 H185" stroke={BLUE} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M165 18 H187" stroke={BLUE} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M165 18 L161 27 H169 Z" fill={BLUE} />
        <path d="M187 18 L183 27 H191 Z" fill={BLUE} />
        <circle cx="176" cy="18" r="2.8" fill={BLUE} />
      </Badge>
    </svg>
  );
}

export const STEP_ART = [
  Step1Art, Step2Art, Step3Art, Step4Art, Step5Art,
  Step6Art, Step7Art, Step8Art, Step9Art, Step10Art,
];
