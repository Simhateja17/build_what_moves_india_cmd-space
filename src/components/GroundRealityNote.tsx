export function GroundRealityNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1.5 flex items-start gap-1.5 text-sm text-slate-500">
      <span aria-hidden className="mt-0.5 text-indigo-400">
        ↳
      </span>
      <span>{children}</span>
    </p>
  );
}
