"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useDashboard } from "@/lib/use-dashboard";
import { FILTERS, FilterId, matchesFilter, matchesQuery } from "@/lib/dashboard";
import { RtiCard } from "@/components/dashboard/RtiCard";
import { AppealsList } from "@/components/dashboard/AppealsList";

export default function MyRtisPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading your RTIs…</p>}>
      <MyRtis />
    </Suspense>
  );
}

function MyRtis() {
  const params = useSearchParams();
  const initial = (params.get("filter") as FilterId) ?? "all";

  const { views, actionCaseIds } = useDashboard();
  const [filter, setFilter] = useState<FilterId>(
    FILTERS.some((f) => f.id === initial) ? initial : "all",
  );
  const [query, setQuery] = useState("");

  const results = views.filter(
    (v) => matchesFilter(v, filter, actionCaseIds) && matchesQuery(v, query),
  );

  const count = (id: FilterId) =>
    views.filter((v) => matchesFilter(v, id, actionCaseIds)).length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
            My RTIs
          </h1>
          <p className="mt-1 text-[15px] text-ink-2">
            {views.length} request{views.length === 1 ? "" : "s"} in total
          </p>
        </div>
        <Link
          href="/start-rti"
          className="rounded-xl bg-navy-800 px-5 py-3 text-[14px] font-bold text-white transition hover:bg-navy-700"
        >
          + File a new RTI
        </Link>
      </div>

      {/* Search */}
      <div className="mt-5">
        <label htmlFor="q" className="sr-only">
          Search your RTIs
        </label>
        <div className="relative">
          <span
            aria-hidden
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
              <path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <input
            id="q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by subject, department or number"
            className="field-input mt-0 w-full pl-10"
          />
        </div>
      </div>

      {/* Filters — horizontally scrollable on a phone rather than wrapping
          into three rows that push the list off screen. */}
      <div className="-mx-4 mt-3 overflow-x-auto px-4 pb-1">
        <div className="flex gap-2">
          {FILTERS.map((f) => {
            const n = count(f.id);
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={active}
                className={`shrink-0 rounded-full border px-3.5 py-2 text-[13px] font-semibold transition ${
                  active
                    ? "border-navy-800 bg-navy-800 text-white"
                    : "border-line bg-surface text-ink-2 hover:border-navy-600/50"
                }`}
              >
                {f.label}
                <span className={active ? "ml-1.5 text-white/70" : "ml-1.5 text-muted"}>
                  {n}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      <div className="mt-5">
        {results.length === 0 ? (
          <div className="gov-card p-8 text-center">
            <p className="font-semibold text-ink">Nothing matches</p>
            <p className="mx-auto mt-1.5 max-w-sm text-sm text-ink-2">
              {query
                ? `No RTI matches “${query}” in this filter.`
                : "No RTIs in this category yet."}
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
              className="mt-4 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-navy-800"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {results.map((v) => (
              <RtiCard key={v.c.id} v={v} />
            ))}
          </div>
        )}
      </div>

      {/* Appeals, kept attached to their originals */}
      {filter === "appeal" || filter === "all" ? (
        <section className="mt-9">
          <h2 className="mb-3 text-lg font-bold tracking-tight text-navy-900">
            Appeals
          </h2>
          <AppealsList views={views} />
        </section>
      ) : null}
    </div>
  );
}
