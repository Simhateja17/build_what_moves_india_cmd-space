"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CaseList } from "@/components/CaseList";
import {
  FILTERS,
  FilterId,
  caseRows,
  matchesFilter,
  matchesQuery,
} from "@/lib/dashboard";
import { useDashboard } from "@/lib/use-dashboard";
import { useLocale } from "@/lib/i18n";

/** Past this many requests, a date range starts earning its screen space. */
const DATE_FILTER_THRESHOLD = 20;

export default function MyRtisPage() {
  return (
    <Suspense
      fallback={<p className="text-sm text-muted">Loading your requests…</p>}
    >
      <MyRequests />
    </Suspense>
  );
}

function MyRequests() {
  const params = useSearchParams();
  const { views, actionCaseIds } = useDashboard();
  const { t, locale } = useLocale();

  // Read straight from the URL rather than seeding useState once. The old
  // page copied the param into state in an initialiser, so arriving here
  // from a different filter link client-side left the wrong chip selected.
  const requested = params.get("filter");
  const fromUrl = FILTERS.some((f) => f.id === requested)
    ? (requested as FilterId)
    : "all";

  const [override, setOverride] = useState<FilterId | null>(null);
  const [query, setQuery] = useState("");
  const filter = override ?? fromUrl;

  const rows = useMemo(
    () => caseRows(views, actionCaseIds),
    [views, actionCaseIds],
  );

  const searched = useMemo(
    () => rows.filter((r) => matchesQuery(r.view, query)),
    [rows, query],
  );

  const visible = searched.filter((r) =>
    matchesFilter(r.view, filter, actionCaseIds.has(r.view.c.id)),
  );

  // Counts run over the searched set, not the whole set. A chip reading
  // "Answered (3)" above an empty table is how the old page looked when a
  // search was active, and it made the search feel broken.
  const countFor = (id: FilterId) =>
    id === "all"
      ? searched.length
      : searched.filter((r) =>
          matchesFilter(r.view, id, actionCaseIds.has(r.view.c.id)),
        ).length;

  const needsYou = countFor("needs_you");
  const filtering = filter !== "all" || query.trim().length > 0;

  const clear = () => {
    setOverride("all");
    setQuery("");
  };

  return (
    <div className="mx-auto w-full max-w-[1240px]">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-[28px]">
            {t("list.title")}
          </h1>
          <p className="mt-1.5 text-sm text-ink-2 sm:text-[15px]">
            {needsYou > 0
              ? `${needsYou} of your ${rows.length} request${rows.length === 1 ? "" : "s"} require${needsYou === 1 ? "s" : ""} your attention.`
              : `All ${rows.length} of your request${rows.length === 1 ? " is" : "s are"} with the government. No action is required from you.`}
          </p>
        </div>
        <Link
          href="/start-rti"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-navy-900 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-navy-700 sm:px-7"
        >
          <span aria-hidden className="text-xl font-light leading-none">
            +
          </span>
          File a request
        </Link>
      </header>

      <section className="mt-7 overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-panel)]">
        <div className="border-b border-line-2 p-4 sm:p-5">
          <label className="relative block max-w-md">
            <span className="sr-only">Search your requests</span>
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
              <SearchIcon />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("list.search")}
              className="h-11 w-full rounded-xl border border-line bg-white pl-11 pr-3 text-sm text-ink shadow-sm outline-none transition placeholder:text-muted focus:border-navy-600 focus:ring-4 focus:ring-navy-50"
            />
          </label>

          {/* Chips only. The old bar carried a Status dropdown that duplicated
              these, two date inputs, and a "Filters" button that did nothing
              at all until a filter was already set. */}
          <div
            className="mt-4 flex flex-wrap gap-2"
            role="group"
            aria-label={t("Filter by status")}
          >
            {FILTERS.map((item) => {
              const active = filter === item.id;
              const count = countFor(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setOverride(item.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-navy-700 text-white"
                      : count === 0
                        ? "text-muted hover:bg-canvas"
                        : "text-ink-2 hover:bg-canvas hover:text-ink"
                  }`}
                >
                  {item.id === "all"
                    ? t("filter.all")
                    : item.id === "appeal"
                      ? t("filter.appeal")
                      : t(`stage.${item.id}`, item.label)}{" "}
                  <span className={active ? "text-white/70" : "text-muted"}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {rows.length > DATE_FILTER_THRESHOLD ? (
            <p className="mt-3 text-xs text-muted">
              Searching covers the number, department, and subject of every
              request.
            </p>
          ) : null}
        </div>

        {visible.length ? (
          <CaseList rows={visible} />
        ) : (
          <div className="px-5 py-16 text-center">
            <p className="font-semibold text-ink">
              {filtering ? "No matching requests" : "No requests yet"}
            </p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-ink-2">
              {filtering
                ? "No request is currently in this state."
                : "Once you file your first RTI application, it will appear here with its response deadline tracked."}
            </p>
            {filtering ? (
              <button
                type="button"
                onClick={clear}
                className="mt-4 text-sm font-bold text-navy-700 hover:underline"
              >
                Show all requests
              </button>
            ) : (
              <Link
                href="/start-rti"
                className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-navy-900 px-5 text-sm font-bold text-white"
              >
                File your first request
              </Link>
            )}
          </div>
        )}

        {visible.length ? (
          <footer className="border-t border-line-2 px-4 py-3.5 text-xs text-muted sm:px-5">
            Showing {visible.length} of {rows.length} request
            {rows.length === 1 ? "" : "s"}
          </footer>
        ) : null}
      </section>

      {locale !== "en" ? (
        <p className="mt-4 text-xs text-muted">{t("lang.partial")}</p>
      ) : null}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className="size-5">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
