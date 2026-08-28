"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TaskBar } from "@/components/mobile/AppBar";
import { ActionBar, PrimaryButton } from "@/components/mobile/ActionBar";
import { useDraft } from "@/lib/draft";
import {
  AUTHORITIES,
  Authority,
  COMMON_IDS,
  getAuthority,
  searchAuthorities,
} from "@/lib/authorities";

/* ------------------------------------------------------------------
   Step 1 of 5 — who should answer.

   Replaces "Select Ministry/Department/Apex body" followed by "Select
   Public Authority": two dependent native selects which, on Android,
   open as scroll wheels of several hundred unfamiliar names.

   Search comes first and matches on plain-language topics, so "train"
   finds Railways and "pension" finds DoPPW. The choice is then
   confirmed in words the citizen recognises — because picking the
   wrong office is the one mistake here that costs money.
------------------------------------------------------------------- */

export default function AuthorityStep() {
  const router = useRouter();
  const { draft, set, markDone } = useDraft();
  const [query, setQuery] = useState("");

  const chosen = getAuthority(draft.authorityId);
  const results = useMemo(() => searchAuthorities(query), [query]);
  const common = COMMON_IDS.map((id) => getAuthority(id)).filter(
    (a): a is Authority => Boolean(a),
  );

  function choose(a: Authority) {
    set({ authorityId: a.id });
    setQuery("");
  }

  return (
    <>
      <TaskBar step={1} total={5} onBack={() => router.push("/file-request")} />

      <div className="m-col m-page--action pt-5">
        <h1 className="m-h1">Who should answer your question?</h1>
        <p className="m-body mt-2">
          Search for the office, or pick a common one below.
        </p>

        <label className="mt-4 block">
          <span className="sr-only">Search for a government office</span>
          <input
            type="search"
            className="m-field"
            placeholder="e.g. railways, pension, post office"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
            enterKeyHint="search"
          />
        </label>

        {/* --- Searching ------------------------------------------- */}
        {query.trim().length >= 2 && (
          <div className="mt-4">
            {results.length > 0 ? (
              <>
                <p className="m-eyebrow">
                  {results.length} {results.length === 1 ? "office" : "offices"} found
                </p>
                <div className="mt-2 flex flex-col gap-2">
                  {results.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => choose(a)}
                      className="m-card flex items-center gap-3 text-left"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block text-[17px] font-semibold leading-snug text-ink">
                          {a.short}
                        </span>
                        <span className="m-fine mt-0.5 block">{a.office}</span>
                      </span>
                      {a.level === "state" && (
                        <span className="shrink-0 rounded-full bg-saffron-50 px-2 py-0.5 text-[12px] font-semibold text-saffron-600">
                          State
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="m-note m-note--warn">
                No office matches &ldquo;{query.trim()}&rdquo;. Try a simpler
                word — &ldquo;pension&rdquo; rather than &ldquo;EPS 95
                arrears&rdquo;.
              </div>
            )}
          </div>
        )}

        {/* --- The confirmation card ------------------------------- */}
        {query.trim().length < 2 && chosen && (
          <div className="mt-5 flex flex-col gap-3">
            <div className="m-card m-card--stripe">
              <p className="m-eyebrow">Your RTI will go to</p>
              <p className="m-h3 mt-1.5 leading-snug">{chosen.office}</p>
              <p className="m-small">{chosen.ministry}</p>
              <p className="m-small mt-2.5">
                <span className="font-semibold text-ink">They handle:</span>{" "}
                {chosen.handles}.
              </p>
              {/* The only place these two words appear, and the sentence
                  around them explains what they are. */}
              <p className="m-fine mt-2">
                The Nodal Officer will pass it to the CPIO who must answer you.
              </p>
            </div>

            {chosen.level === "state" && (
              <div className="m-note m-note--warn">
                <p className="font-semibold">
                  This looks like a state government office.
                </p>
                <p className="mt-1">
                  This portal can only send RTIs to central ministries. If you
                  send it here it will be returned, and the ₹10 is not refunded.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => set({ authorityId: "" })}
              className="m-tap w-full justify-center text-[15px] font-semibold text-navy-800 underline"
            >
              Not right? Choose a different office
            </button>
          </div>
        )}

        {/* --- Nothing chosen yet ---------------------------------- */}
        {query.trim().length < 2 && !chosen && (
          <div className="mt-5">
            <p className="m-eyebrow">Most asked</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {common.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => choose(a)}
                  className="m-chip"
                >
                  {a.short}
                </button>
              ))}
            </div>

            <details className="m-card mt-4">
              <summary className="m-tap w-full cursor-pointer justify-start text-[17px] font-semibold text-ink">
                Not sure which office?
              </summary>
              <p className="m-small mt-2">
                Think about who <em>keeps the paper</em> you want. A pension
                order is kept by the pension department, a train refund by the
                railways, a job card by the MGNREGA cell. If two offices could
                hold it, pick either — if it is the wrong one they must transfer
                it, and we will follow the new number for you.
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {AUTHORITIES.filter((a) => !COMMON_IDS.includes(a.id)).map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => choose(a)}
                    className="m-tap w-full justify-start text-left text-[15px] font-medium text-navy-800"
                  >
                    {a.short} — <span className="text-ink-2">{a.handles}</span>
                  </button>
                ))}
              </div>
            </details>
          </div>
        )}
      </div>

      <ActionBar>
        <PrimaryButton
          disabled={!chosen}
          disabledReason="Choose the office that should answer you."
          onClick={() => {
            markDone("authority");
            router.push("/file-request/question");
          }}
        >
          {chosen ? "Yes, continue" : "Continue"}
        </PrimaryButton>
      </ActionBar>
    </>
  );
}
