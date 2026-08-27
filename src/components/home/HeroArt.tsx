/* ------------------------------------------------------------------
   Artwork for the landing banner's second and third slides.

   Drawn on the light panel, so everything is built from the same
   tokens the rest of the page uses — surface and line for paper,
   navy for ink, saffron and green for the two things the eye should
   actually land on.
------------------------------------------------------------------- */

/**
 * A citizen filing a request: the form open on her laptop, the RTI
 * document she is working from floating behind it.
 *
 * Drawn in the site's own navy rather than the brighter blue of the
 * reference — the banner already carries navy in the headline, the
 * buttons and the dots, and a second unrelated blue three inches away
 * reads as a mistake. The greens, the warm desk and the skin tone are
 * the only colours here that are not tokens.
 *
 * Stacking order matters and is the thing most likely to break if this
 * is edited: ground, then the document, then the seated figure, then
 * the desk across her waist, then what stands on the desk, then the
 * laptop, and her arm last of all so it rests on the keys.
 */
export function AssistantArt({ className = "w-full" }: { className?: string }) {
  const skin = "#e9b48f";
  const hair = "#282d3c";
  const desk = "#e7d5bb";
  const deskEdge = "#d8c3a4";
  const paper = "#fdfcfa";
  const font = "var(--font-geist-sans), system-ui, sans-serif";

  return (
    <svg viewBox="0 0 400 300" className={className} aria-hidden="true">
      {/* ground */}
      <path
        d="M46 60 C92 22 178 26 232 54 C288 84 330 62 358 104 C386 146 364 212 312 238 C244 272 136 268 82 240 C22 208 12 96 46 60 Z"
        fill="var(--navy-50)"
      />
      <circle cx="286" cy="104" r="70" fill="var(--navy-50)" opacity="0.7" />

      {/* fronds, just clearing her shoulder */}
      <g fill="var(--navy-50)">
        <path d="M368 84 C390 102 396 136 382 164 C366 138 360 108 368 84 Z" />
        <path d="M386 132 C398 156 394 188 378 206 C372 178 376 150 386 132 Z" />
      </g>

      {/* the RTI document, behind her */}
      <g>
        <rect
          x="226"
          y="28"
          width="106"
          height="92"
          rx="8"
          fill={paper}
          stroke="var(--line)"
          strokeWidth="1.5"
        />
        <text
          x="242"
          y="60"
          fontFamily={font}
          fontSize="21"
          fontWeight="700"
          fill="var(--navy-800)"
        >
          RTI
        </text>
        <rect x="242" y="72" width="62" height="6" rx="3" fill="var(--line)" />
        <rect x="242" y="86" width="52" height="6" rx="3" fill="var(--line)" />
        <rect x="242" y="100" width="58" height="6" rx="3" fill="var(--line)" />
        <circle cx="332" cy="62" r="16" fill="var(--navy-700)" />
        <circle cx="332" cy="54" r="2.4" fill="#fff" />
        <rect x="330" y="59.5" width="4.2" height="13" rx="2.1" fill="#fff" />
      </g>

      {/* chair back — rounded, and low enough that only its shoulders show */}
      <path
        d="M236 262 L236 214 Q236 196 262 194 L338 194 Q364 196 364 214 L364 262 Z"
        fill="#7b8494"
        opacity="0.28"
      />

      {/* the citizen, seen from behind.
          Her face is the skin ellipse showing past the edge of the hair
          one — offsetting the two by a few units leaves exactly the
          crescent of cheek you see from this angle, with no seam and no
          stray strands to go wrong. */}
      <path
        d="M322 132 C346 134 360 156 358 184 C356 210 342 226 330 220 C319 214 326 194 322 176 C318 158 314 140 322 132 Z"
        fill={hair}
      />
      <rect x="290" y="172" width="21" height="28" rx="8" fill={skin} />
      <ellipse cx="291" cy="160" rx="25" ry="28" fill={skin} />
      <ellipse cx="304" cy="148" rx="32" ry="34" fill={hair} />
      <rect
        x="322"
        y="152"
        width="15"
        height="9"
        rx="4.5"
        fill="var(--navy-700)"
        transform="rotate(26 329 156)"
      />
      <path
        d="M252 254 C252 214 272 195 300 195 C330 195 352 215 352 254 Z"
        fill="var(--navy-600)"
      />

      {/* desk, crossing in front of her */}
      <rect x="4" y="250" width="360" height="10" rx="2" fill={desk} />
      <rect x="4" y="260" width="360" height="6" rx="1" fill={deskEdge} />

      {/* plant */}
      <g>
        <path d="M27 214 C19 194 22 172 34 162 C42 179 40 200 32 214 Z" fill="var(--green-600)" />
        <path d="M37 214 C49 200 55 180 51 164 C38 175 32 196 34 214 Z" fill="var(--green-700)" />
        <path d="M18 216 C10 206 7 192 11 180 C20 188 23 204 23 216 Z" fill="var(--green-600)" opacity="0.7" />
        <path
          d="M8 214 H48 L43 250 H13 Z"
          fill={paper}
          stroke="var(--line)"
          strokeWidth="1.5"
        />
      </g>

      {/* books, clear of the laptop */}
      <rect x="56" y="238" width="38" height="6" rx="2" fill="var(--navy-800)" />
      <rect x="52" y="244" width="42" height="6" rx="2" fill="var(--navy-600)" />

      {/* laptop */}
      <g>
        <rect x="118" y="110" width="132" height="120" rx="9" fill="var(--navy-800)" />
        <rect x="125" y="117" width="118" height="99" rx="4" fill={paper} />
        <circle cx="136" cy="128" r="4" fill="var(--navy-600)" />
        <rect x="144" y="126" width="30" height="4" rx="2" fill="var(--line)" />
        {/* textLength pins the headline inside the bezel; without it the
            string spills over the laptop's right edge at this size. */}
        <text
          x="135"
          y="151"
          fontFamily={font}
          fontSize="8.5"
          fontWeight="700"
          fill="var(--navy-800)"
          textLength="99"
          lengthAdjust="spacingAndGlyphs"
        >
          Submit Your RTI Request
        </text>
        <rect x="135" y="161" width="99" height="6" rx="3" fill="var(--line)" />
        <rect x="135" y="173" width="84" height="6" rx="3" fill="var(--line)" />
        <rect x="135" y="185" width="94" height="6" rx="3" fill="var(--line)" />
        <rect x="135" y="197" width="46" height="10" rx="5" fill="var(--navy-700)" />
        <path d="M112 232 H260 L268 250 H104 Z" fill="var(--navy-700)" />
        <rect x="168" y="238" width="32" height="3.5" rx="1.75" fill="var(--navy-800)" opacity="0.55" />
      </g>

      {/* mug, in front of the laptop */}
      <g>
        <rect
          x="106"
          y="238"
          width="22"
          height="18"
          rx="4"
          fill={paper}
          stroke="var(--line)"
          strokeWidth="1.5"
        />
        <path
          d="M128 243 C136 243 136 251 128 251"
          fill="none"
          stroke="var(--line)"
          strokeWidth="2.5"
        />
      </g>

      {/* her arm, resting on the keys */}
      <path
        d="M266 210 C248 213 228 222 214 232 C207 237 210 246 219 243 C236 237 254 233 270 233 Z"
        fill="var(--navy-600)"
      />
      <ellipse cx="214" cy="237" rx="11" ry="7" fill={skin} transform="rotate(-12 214 237)" />

      {/* two dots to keep the corners alive */}
      <circle cx="350" cy="34" r="6" fill="var(--saffron-400)" opacity="0.85" />
      <circle cx="72" cy="128" r="4.5" fill="var(--green-600)" opacity="0.45" />
    </svg>
  );
}

/**
 * The three governments, with one of them lit.
 *
 * This is the finder's whole argument in a picture: the same problem
 * belongs to a different tier depending on one detail, and sending it
 * to the wrong one costs the citizen the fee and the weeks.
 */
export function RoutingArt({ className = "w-full" }: { className?: string }) {
  const rows = [
    { y: 72, label: "Central", accent: "var(--navy-600)", lit: false },
    { y: 130, label: "State", accent: "var(--saffron-400)", lit: true },
    { y: 188, label: "Local", accent: "var(--green-600)", lit: false },
  ];

  return (
    <svg viewBox="0 0 400 300" className={className} aria-hidden="true">
      <circle cx="200" cy="150" r="132" fill="var(--navy-50)" />

      {/* the problem, and the line that finds its tier */}
      <circle cx="52" cy="150" r="11" fill="var(--navy-800)" />
      <path
        d="M52 150 H92 V150 a8 8 0 0 1 8 -8 h16"
        stroke="var(--saffron-400)"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />

      {rows.map((r) => (
        <g key={r.label}>
          <rect
            x="120"
            y={r.y}
            width="196"
            height="44"
            rx="12"
            fill="var(--surface)"
            stroke={r.lit ? "var(--saffron-400)" : "var(--line)"}
            strokeWidth={r.lit ? 2.5 : 1.5}
          />
          <circle cx="146" cy={r.y + 22} r="7" fill={r.accent} opacity={r.lit ? 1 : 0.45} />
          <rect
            x="164"
            y={r.y + 17}
            width={r.lit ? 104 : 82}
            height="9"
            rx="4.5"
            fill={r.lit ? "var(--navy-800)" : "var(--line)"}
          />
        </g>
      ))}

      {/* the warning that the lit one is not this portal */}
      <g transform="translate(316 152)">
        <circle r="19" fill="var(--saffron-400)" />
        <path d="M0 -9 v9" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
        <circle cy="7" r="2" fill="#fff" />
      </g>
    </svg>
  );
}
