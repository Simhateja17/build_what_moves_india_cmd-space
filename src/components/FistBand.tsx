import Image from "next/image";

/* ------------------------------------------------------------------
   The raised fists, as the footer's own ground.

   The crowd is masked rather than covered. An earlier version faded it
   out under a panel of flat colour, which left a hard horizontal seam
   wherever that panel's top edge failed to match the gradient behind
   it. A mask fades the image's own alpha instead, so there is no edge
   to mismatch — the crowd simply stops existing towards the top.

   The artwork is 1506 × 147, built from the supplied crop with its
   middle third mirrored so the joins fall between hands and the eye
   never catches a repeat.
------------------------------------------------------------------- */

const FADE = "linear-gradient(to top, #000 0%, #000 34%, rgba(0,0,0,0.35) 72%, transparent 100%)";

export function FistBand({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-[150px] select-none sm:h-[190px] lg:h-[230px] ${className ?? ""}`}
      style={{ WebkitMaskImage: FADE, maskImage: FADE }}
    >
      <Image
        src="/rti-fists-wide.png"
        alt=""
        fill
        sizes="100vw"
        // Anchored to the bottom so the arms run off the foot of the
        // footer; on a narrow screen the sides crop, showing fewer
        // hands at full size rather than all of them too small to read.
        className="object-cover object-bottom opacity-[0.22] mix-blend-screen"
      />
    </div>
  );
}
