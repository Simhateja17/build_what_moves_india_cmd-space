/**
 * The single most useful thing the assistant teaches.
 *
 * Citizens ask "why has nothing been done?", which an officer can
 * lawfully refuse — no file contains "the reason for negligence". The
 * same grievance, written as a list of records that do exist, has to
 * be answered. This card shows the two side by side.
 */
export function AskVsAskCard() {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-ink-2">
        RTI gets you records an office already holds — copies, figures,
        names, dates. It does not require an officer to explain
        themselves. The same complaint, written two ways:
      </p>

      <div className="rounded-xl border border-govred-700/25 bg-govred-50 p-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-govred-700">
          ✗ Likely to be refused
        </p>
        <p className="mt-2 text-sm italic leading-relaxed text-ink">
          &ldquo;Why has our road not been repaired for 6 months? Who is
          responsible for this negligence?&rdquo;
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-2">
          Asks for an opinion and a judgement. No file contains &ldquo;the
          reason for negligence&rdquo;, so the officer can honestly reply
          that no such record exists.
        </p>
      </div>

      <div className="rounded-xl border border-govgreen-600/30 bg-govgreen-50 p-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-govgreen-700">
          ✓ Has to be answered
        </p>
        <p className="mt-2 text-sm italic leading-relaxed text-ink">
          &ldquo;Copies of all complaints received, inspection reports and
          file notings relating to the repair of Ganesh Nagar 3rd Cross
          Road between 01/03/2026 and 27/08/2026, and the name and
          designation of the officer responsible for its maintenance.&rdquo;
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-2">
          Names documents that exist, a period, and a post. Each item is
          either produced, or its absence is itself the answer.
        </p>
      </div>
    </div>
  );
}
