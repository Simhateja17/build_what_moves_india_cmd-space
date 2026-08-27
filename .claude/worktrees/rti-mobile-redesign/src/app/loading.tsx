/* Skeletons in the shape of the content that is coming, never a lone
   spinner on an empty page. The top bar and tab bar are part of the
   static shell, so only the content area ever waits. */

export default function Loading() {
  return (
    <div className="m-shell m-col m-page pt-6" aria-busy>
      <div className="m-skel h-7 w-3/4" />
      <div className="m-skel mt-3 h-4 w-1/2" />
      <div className="mt-6 flex flex-col gap-3">
        <div className="m-card m-card--stripe flex flex-col gap-2.5">
          <div className="m-skel h-4 w-24" />
          <div className="m-skel h-4 w-full" />
          <div className="m-skel h-4 w-2/3" />
        </div>
        <div className="m-card m-card--stripe flex flex-col gap-2.5">
          <div className="m-skel h-4 w-24" />
          <div className="m-skel h-4 w-full" />
          <div className="m-skel h-4 w-1/2" />
        </div>
      </div>
      <p className="m-fine mt-5 text-center">Loading…</p>
    </div>
  );
}
