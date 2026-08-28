"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { suggestedTopics } from "@/lib/assistant/match";
import { TOPICS, TOPIC_BY_ID } from "@/lib/assistant/topics";
import { ProblemTopic } from "@/lib/assistant/types";
import { Assistant } from "@/lib/assistant/state";
import { AssistantShell } from "./AssistantShell";
import { BottomSheet } from "./BottomSheet";
import { ExampleList } from "./ExampleDraftSheet";

const TOPIC_HELP: Record<string, string> = {
  "road-damage": "Repairs, tenders, contractors and inspection reports",
  sewage: "Complaints, cleaning schedules and work orders",
  "water-supply": "Supply logs, tanker bills and quality reports",
  "govt-school": "Teacher vacancies, grants, meals and inspections",
  "govt-hospital": "Staff, medicines, equipment and patient services",
  "street-light": "Repair logs, contracts and complaint action",
  garbage: "Collection routes, staff rosters and contractor payments",
  "ration-pds": "Card status, shop stock, allotment and complaints",
  "social-pension": "Application status, eligibility and payment records",
  "govt-pension": "File movement, objections and reasons recorded for delay",
  electricity: "Outage logs, billing records and service standards",
  mgnrega: "Muster rolls, job cards, wages and work records",
  railways: "Refunds, recruitment, facilities and complaint records",
  passport: "Police verification, file movement, status and reasons for delay",
  "other-records": "Police, land, housing, exams, permits, taxes or another public record",
};

const GROUPS = [
  {
    title: "Your neighbourhood",
    ids: ["road-damage", "sewage", "water-supply", "street-light", "garbage"],
  },
  {
    title: "Public services",
    ids: ["govt-school", "govt-hospital", "electricity", "railways", "passport"],
  },
  {
    title: "Benefits and livelihoods",
    ids: ["ration-pds", "social-pension", "govt-pension", "mgnrega"],
  },
  { title: "Everything else", ids: ["other-records"] },
] as const;

export function ProblemStep({ assistant }: { assistant: Assistant }) {
  const { state, dispatch, goNext } = assistant;
  const [sheet, setSheet] = useState<"topics" | "examples" | null>(null);
  const [topicQuery, setTopicQuery] = useState("");

  const suggestions = useMemo(
    () => suggestedTopics(state.rawProblem, 6),
    [state.rawProblem],
  );
  const topic = state.topicId ? TOPIC_BY_ID[state.topicId] : undefined;
  const hasDescription = state.rawProblem.trim().length >= 8;

  function choose(id: string) {
    dispatch({ type: "topic", id });
    setSheet(null);
  }

  return (
    <AssistantShell
      step="problem"
      title="What do you need information about?"
      subtitle="Tell us what happened in your own words. We’ll turn it into a request for records and help identify the public authority that is likely to hold them."
      primaryLabel="Continue to location"
      onPrimary={goNext}
      primaryDisabled={!topic || (topic.id === "other-records" && !hasDescription)}
      primaryHint={
        !topic
          ? "Choose the closest topic to continue"
          : topic.id === "other-records" && !hasDescription
            ? "Briefly describe the government record you need"
            : undefined
      }
      secondary={
        <Link
          href="/file-request"
          className="text-[13px] font-semibold text-navy-700 underline underline-offset-4"
        >
          I already know the Central Government authority
        </Link>
      }
    >
      <div className="grid gap-3 rounded-2xl border border-navy-600/20 bg-navy-50 p-4 sm:grid-cols-2 sm:p-5">
        <FitNote
          good
          title="RTI can uncover records"
          text="Status, file notes, spending, contracts, rules, inspection reports and action taken."
        />
        <FitNote
          title="RTI does not fix the problem directly"
          text="It cannot order a repair, settle a private dispute or replace an emergency or grievance service."
        />
      </div>

      <div>
        <div className="flex items-end justify-between gap-4">
          <label htmlFor="problem" className="field-label">
            Describe the issue
          </label>
          <span className="text-xs text-muted">Any Indian language is okay</span>
        </div>
        <textarea
          id="problem"
          rows={5}
          value={state.rawProblem}
          onChange={(e) => dispatch({ type: "problem", text: e.target.value })}
          placeholder="Example: My passport police verification has been pending for five months. I want to know when the report was received and why my application is on hold."
          className="field-input min-h-36 resize-y px-4 py-3.5 leading-6"
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs leading-relaxed text-muted">
            Do not include Aadhaar, bank details, passwords or medical records here.
          </p>
          <button
            type="button"
            onClick={() => setSheet("examples")}
            className="text-xs font-semibold text-navy-700 underline underline-offset-4"
          >
            See an example
          </button>
        </div>
      </div>

      <section aria-labelledby="topic-heading">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
              {hasDescription ? "Closest matches" : "Common topics"}
            </p>
            <h2 id="topic-heading" className="mt-1 text-lg font-bold text-ink">
              Choose what best describes your request
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setSheet("topics")}
            className="hidden shrink-0 text-[13px] font-semibold text-navy-700 underline underline-offset-4 sm:block"
          >
            Browse all {TOPICS.length}
          </button>
        </div>

        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {suggestions.map((item, index) => (
            <TopicCard
              key={item.id}
              topic={item}
              selected={item.id === state.topicId}
              suggested={hasDescription && index === 0}
              onChoose={() => choose(item.id)}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setSheet("topics")}
          className="mt-3 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-navy-700 sm:hidden"
        >
          Browse all {TOPICS.length} topics
        </button>
      </section>

      {topic ? (
        <div className="flex items-start gap-3 rounded-2xl border border-govgreen-600/25 bg-govgreen-50 p-4" role="status">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-govgreen-600 text-xs font-bold text-white">
            ✓
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-govgreen-700/75">
              Selected topic
            </p>
            <p className="mt-0.5 font-semibold text-govgreen-700">{topic.label}</p>
            <p className="mt-0.5 text-[13px] leading-relaxed text-govgreen-700/80">
              {TOPIC_HELP[topic.id]}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSheet("topics")}
            className="shrink-0 text-[13px] font-semibold text-govgreen-700 underline underline-offset-4"
          >
            Change
          </button>
        </div>
      ) : null}

      <BottomSheet
        open={sheet === "topics"}
        title="Find your topic"
        onClose={() => setSheet(null)}
      >
        <label htmlFor="topic-search" className="sr-only">Search topics</label>
        <input
          id="topic-search"
          value={topicQuery}
          onChange={(e) => setTopicQuery(e.target.value)}
          placeholder="Search road, pension, police, land…"
          className="field-input mt-0"
        />
        <div className="mt-5 space-y-6">
          {GROUPS.map((group) => {
            const items = group.ids
              .map((id) => TOPIC_BY_ID[id])
              .filter((item): item is ProblemTopic => Boolean(item))
              .filter((item) => topicMatches(item, topicQuery));
            if (items.length === 0) return null;
            return (
              <section key={group.title}>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                  {group.title}
                </h3>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {items.map((item) => (
                    <TopicCard
                      key={item.id}
                      topic={item}
                      selected={item.id === state.topicId}
                      onChoose={() => choose(item.id)}
                    />
                  ))}
                </div>
              </section>
            );
          })}
          {topicQuery.trim() && !TOPICS.some((item) => topicMatches(item, topicQuery)) ? (
            <section className="rounded-2xl border border-line bg-canvas p-4">
              <h3 className="text-sm font-bold text-ink">No exact topic found</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">
                That does not mean RTI cannot help. Start with the general government-record path and tailor the records on the next screens.
              </p>
              <div className="mt-3">
                <TopicCard
                  topic={TOPIC_BY_ID["other-records"]}
                  selected={state.topicId === "other-records"}
                  onChoose={() => choose("other-records")}
                />
              </div>
            </section>
          ) : null}
        </div>
      </BottomSheet>

      <BottomSheet
        open={sheet === "examples"}
        title="Example requests"
        onClose={() => setSheet(null)}
      >
        <ExampleList />
      </BottomSheet>
    </AssistantShell>
  );
}

function topicMatches(topic: ProblemTopic, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return `${topic.label} ${TOPIC_HELP[topic.id]} ${topic.aliases.join(" ")}`
    .toLowerCase()
    .includes(q);
}

function FitNote({ good = false, title, text }: { good?: boolean; title: string; text: string }) {
  return (
    <div className="flex gap-3">
      <span
        aria-hidden
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          good ? "bg-govgreen-600 text-white" : "bg-white text-muted ring-1 ring-line"
        }`}
      >
        {good ? "✓" : "×"}
      </span>
      <div>
        <p className="text-sm font-bold text-ink">{title}</p>
        <p className="mt-0.5 text-[13px] leading-5 text-ink-2">{text}</p>
      </div>
    </div>
  );
}

function TopicCard({
  topic,
  selected,
  suggested = false,
  onChoose,
}: {
  topic: ProblemTopic;
  selected: boolean;
  suggested?: boolean;
  onChoose: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChoose}
      aria-pressed={selected}
      className={`group flex min-h-[84px] items-start gap-3 rounded-2xl border p-3.5 text-left transition ${
        selected
          ? "border-navy-600 bg-navy-50 shadow-[0_0_0_1px_rgba(71,120,189,0.12)]"
          : "border-line bg-white hover:border-navy-600/50 hover:shadow-[var(--shadow-panel)]"
      }`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-canvas text-xl" aria-hidden>
        {topic.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className={`text-sm font-bold ${selected ? "text-navy-800" : "text-ink"}`}>
            {topic.label}
          </span>
          {suggested ? (
            <span className="rounded-full bg-navy-800 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
              Suggested
            </span>
          ) : null}
        </span>
        <span className="mt-1 block text-xs leading-[1.45] text-muted">{TOPIC_HELP[topic.id]}</span>
      </span>
      <span
        aria-hidden
        className={`mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${
          selected ? "border-navy-700 bg-navy-700 text-white" : "border-line text-transparent"
        }`}
      >
        ✓
      </span>
    </button>
  );
}
