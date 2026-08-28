"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { fillPlaces } from "@/lib/assistant/authorities";
import { composeDraft, selectedAsks } from "@/lib/assistant/draft";
import { AuthorityResult } from "@/lib/assistant/match";
import { Assistant } from "@/lib/assistant/state";
import { TOPIC_BY_ID } from "@/lib/assistant/topics";
import { AssistantHandoff, HANDOFF_KEY } from "@/lib/assistant/types";
import { AssistantShell } from "./AssistantShell";
import { BottomSheet } from "./BottomSheet";
import { GovLevelBadge } from "./GovLevelBadge";
import { StateFilingSheet } from "./StateFilingSheet";

/**
 * The handoff splits by level, and that split is the point.
 *
 * A central match walks into the existing form with the three fields a
 * first-time filer cannot fill on their own already chosen. A state or
 * local match gets no route into that form at all — sending it there
 * would produce exactly the returned application this whole feature
 * exists to prevent.
 */
export function ReviewStep({
  assistant,
  result,
}: {
  assistant: Assistant;
  result: AuthorityResult;
}) {
  const { state, dispatch, goBack } = assistant;
  const { citizenName } = useStore();
  const router = useRouter();
  const [sheet, setSheet] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const topic = state.topicId ? TOPIC_BY_ID[state.topicId] : undefined;
  const place = { city: state.city, state: state.stateName };
  const authority = result.primary;
  const central = authority.level === "central";

  const portalText = useMemo(
    () =>
      state.editedDraft ??
      composeDraft(
        state,
        authority,
        {
          name: citizenName,
          address: [state.city, state.stateName].filter(Boolean).join(", "),
        },
        "portal",
      ),
    [state, authority, citizenName],
  );

  const asks = selectedAsks(state, topic?.asks ?? []);
  const period = state.answers.period
    ? { "6m": "The last 6 months", "1y": "The last year", "3y": "The last 3 years" }[
        state.answers.period
      ] ?? state.answers.period
    : "Not specified";

  function continueToForm() {
    const handoff: AssistantHandoff = {
      ministry: authority.ministry ?? "",
      office: authority.office ?? "",
      question: portalText,
      authorityName: fillPlaces(authority.name, place),
    };
    try {
      window.sessionStorage.setItem(HANDOFF_KEY, JSON.stringify(handoff));
    } catch {
      /* private mode — the form simply opens empty */
    }
    router.push("/file-request");
  }

  function download() {
    const blob = new Blob([portalText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rti-request.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AssistantShell
      step="review"
      title="Review before submission"
      onBack={goBack}
      primaryLabel={
        central
          ? "Continue to the form"
          : `How to file this in ${state.stateName || "your state"}`
      }
      primaryTone={central ? "navy" : "amber"}
      onPrimary={central ? continueToForm : () => setSheet(true)}
    >
      <div className="gov-card divide-y divide-line-2">
        <Row label="Addressed to" onEdit={() => dispatch({ type: "go", step: "authority" })}>
          <span className="block">{fillPlaces(authority.name, place)}</span>
          <span className="block text-[13px] text-muted">
            {fillPlaces(authority.wing, place)}
          </span>
          <GovLevelBadge level={authority.level} className="mt-2" />
        </Row>
        <Row label="Information sought" onEdit={() => dispatch({ type: "go", step: "asks" })}>
          <span className="block">
            {asks.length} thing{asks.length === 1 ? "" : "s"}
          </span>
          <ol className="mt-1.5 list-decimal space-y-1 pl-4 text-[13px] font-normal leading-relaxed text-ink-2">
            {asks.map((a, i) => (
              <li key={i}>{a.replace(/\[\[|\]\]/g, "")}</li>
            ))}
          </ol>
        </Row>
        <Row label="Period covered" onEdit={() => dispatch({ type: "go", step: "asks" })}>
          {period}
        </Row>
      </div>

      <div
        className={`rounded-xl border px-4 py-3.5 ${
          central
            ? "border-govgreen-600/30 bg-govgreen-50"
            : "border-saffron-400/50 bg-saffron-50"
        }`}
      >
        <p
          className={`text-[11px] font-bold uppercase tracking-wider ${
            central ? "text-govgreen-700/80" : "text-saffron-600/90"
          }`}
        >
          Filing route
        </p>
        <p
          className={`mt-1.5 text-sm leading-relaxed ${
            central ? "text-govgreen-700" : "text-saffron-600"
          }`}
        >
          {central ? (
            <>
              {fillPlaces(authority.name, place)} is a Central Government
              office, and this application may be filed here. The draft will
              be carried into the form; only the remaining details need to
              be added.
            </>
          ) : (
            <>
              This is a {state.stateName || "state"} matter and is not filed
              through this portal. The draft is ready for use and may be
              submitted to the {authority.pioTitle}, or filed on the
              state&apos;s RTI portal.
            </>
          )}
        </p>
      </div>

      {!central ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(portalText);
                setToast("Copied to clipboard.");
              } catch {
                setToast("Could not copy automatically. Use Save as a file instead.");
              }
            }}
            className="btn-secondary flex-1 text-sm"
          >
            ⧉ Copy the request
          </button>
          <button
            type="button"
            onClick={download}
            className="btn-secondary flex-1 text-sm"
          >
            ⤓ Save as a file
          </button>
        </div>
      ) : null}

      {toast ? (
        <p
          role="status"
          className="rounded-lg border border-govgreen-600/30 bg-govgreen-50 px-3.5 py-2.5 text-[13px] text-govgreen-700"
        >
          {toast}
        </p>
      ) : null}

      <BottomSheet
        open={sheet}
        title={`Filing in ${state.stateName || "your state"}`}
        onClose={() => setSheet(false)}
      >
        <StateFilingSheet
          authority={authority}
          stateName={state.stateName}
          city={state.city}
        />
      </BottomSheet>
    </AssistantShell>
  );
}

function Row({
  label,
  children,
  onEdit,
}: {
  label: string;
  children: React.ReactNode;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3.5">
      <div className="min-w-0">
        <dt className="text-[11px] font-bold uppercase tracking-wider text-muted">
          {label}
        </dt>
        <dd className="mt-1 text-sm font-medium text-ink">{children}</dd>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="shrink-0 text-[13px] font-medium text-navy-700 hover:underline"
      >
        Edit
      </button>
    </div>
  );
}
