import Image from "next/image";

/* ------------------------------------------------------------------
   The Right to Information mark.

   Two forms, one identity:

   RtiLogo  — the supplied lockup, used verbatim as a raster wherever
              there is room for the wordmark. Nothing is redrawn, so
              the logo is always exactly the logo.

   RtiMark  — the figure alone, redrawn as monochrome SVG for the navy
              bars and any small placement. The supplied artwork is
              blue on white; on a navy bar that reads as a smudge, so
              small placements take a single-colour mark that inherits
              currentColor instead.
------------------------------------------------------------------- */

/** The brand blue, sampled from the supplied artwork. */
export const RTI_BLUE = "#3d6cb2";

export function RtiLogo({
  width = 200,
  priority = false,
  className,
}: {
  width?: number;
  priority?: boolean;
  className?: string;
}) {
  // Intrinsic size is 834 × 534; height follows to keep the ratio exact.
  const height = Math.round((width * 534) / 834);
  return (
    <Image
      src="/rti-logo.png"
      alt="Right to Information"
      width={width}
      height={height}
      priority={priority}
      className={className}
    />
  );
}

export function RtiMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="70 75 190 402"
      className={className}
      role="img"
      aria-label="Right to Information"
      fill="none"
    >
      {/* The citizen */}
      <circle cx="146" cy="138" r="59" fill="currentColor" />
      {/* Shoulders and torso, cut away where the document sits */}
      <path d="M78 210 H218 V252 H118 V470 H78 Z" fill="currentColor" />
      {/* The document, corner turned up */}
      <path
        d="M118 252 H248 V412 L190 470 H118 Z"
        fill="#fff"
        stroke="currentColor"
        strokeWidth="13"
        strokeLinejoin="round"
      />
      <path
        d="M190 470 V412 H248"
        stroke="currentColor"
        strokeWidth="13"
        strokeLinejoin="round"
      />
      {/* Lines of the record being asked for */}
      {[278, 300, 322, 344, 366, 388].map((y) => (
        <rect key={y} x="140" y={y} width="86" height="10" fill="currentColor" />
      ))}
    </svg>
  );
}
