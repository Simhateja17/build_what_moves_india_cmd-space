import Image from "next/image";

// Lockups cut from the same official artwork:
//   full  — the mark beside its own two-line wordmark, as the logo is drawn
//   mark  — the glyph on its own, for anywhere the words are already present
// Each has a white knockout for dark surfaces. All but `original` have the
// background removed and the surrounding padding trimmed off, so a caller
// sizes the ink itself rather than the whitespace around it.
const VARIANTS = {
  original: { src: "/rti-original-logo.png", width: 834, height: 534 },
  full: { src: "/rti-logo.png", width: 640, height: 398 },
  white: { src: "/rti-logo-white.png", width: 640, height: 398 },
  mark: { src: "/rti-mark.png", width: 170, height: 398 },
  "mark-white": { src: "/rti-mark-white.png", width: 170, height: 398 },
} as const;

export function RtiLogo({
  className = "w-[132px] sm:w-[150px]",
  priority = false,
  variant = "original",
}: {
  className?: string;
  priority?: boolean;
  variant?: keyof typeof VARIANTS;
}) {
  const { src, width, height } = VARIANTS[variant];
  return (
    <Image
      src={src}
      width={width}
      height={height}
      alt="Right to Information"
      className={`object-contain ${className}`}
      priority={priority}
    />
  );
}
