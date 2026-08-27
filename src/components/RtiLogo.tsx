import Image from "next/image";

export function RtiLogo({
  className = "w-[132px] sm:w-[150px]",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/rti-original-logo.png"
      width={834}
      height={534}
      alt="Right to Information"
      className={`h-auto object-contain ${className}`}
      priority={priority}
    />
  );
}
