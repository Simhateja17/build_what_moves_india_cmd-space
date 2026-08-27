"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CaseView } from "@/lib/dashboard";
import { useDashboard } from "@/lib/use-dashboard";
import { addDays, formatDate } from "@/lib/dates";

type HistoryStatus = "under-process" | "response-received" | "disposed" | "action-required" | "closed";
const HISTORY_TABS: { id: "all" | HistoryStatus; label: string }[] = [
  { id: "all", label: "All" }, { id: "under-process", label: "Under Process" },
  { id: "response-received", label: "Response Received" }, { id: "disposed", label: "Disposed" },
  { id: "action-required", label: "Action Required" }, { id: "closed", label: "Closed" },
];
const STATUS_STYLES: Record<HistoryStatus, string> = {
  "under-process": "bg-blue-50 text-blue-700", "response-received": "bg-green-50 text-green-700",
  disposed: "bg-violet-50 text-violet-700", "action-required": "bg-orange-50 text-orange-700",
  closed: "bg-slate-100 text-slate-600",
};
const STATUS_LABELS: Record<HistoryStatus, string> = {
  "under-process": "Under Process", "response-received": "Response Received", disposed: "Disposed",
  "action-required": "Action Required", closed: "Closed",
};
const PAGE_SIZE = 10;

function historyStatus(v: CaseView, actionCaseIds: Set<string>): HistoryStatus {
  if (v.d.canFileFirstAppeal || v.d.canFileSecondAppeal) return "action-required";
  if (v.d.appealFiled || !v.d.hasReply) return "under-process";
  if (!v.responseRead) return "response-received";
  if (v.c.replyDay !== undefined && v.day - v.c.replyDay >= 10) return "closed";
  if (actionCaseIds.has(v.c.id)) return "action-required";
  return "disposed";
}

function lastUpdated(v: CaseView): Date {
  const latestDay = v.d.events.reduce((latest, event) => Math.max(latest, event.day), 0);
  return addDays(v.c.submittedOn, latestDay);
}

function SearchIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5"><circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" /><path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}
function FilterIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5"><path d="M4 6h16l-6.2 7.1v4.5l-3.6 1.7v-6.2L4 6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>;
}
function StatusPill({ status }: { status: HistoryStatus }) {
  return <span className={`inline-flex whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold ${STATUS_STYLES[status]}`}>{STATUS_LABELS[status]}</span>;
}

export default function MyRtisPage() {
  return <Suspense fallback={<p className="text-sm text-muted">Loading your applications…</p>}><ApplicationHistory /></Suspense>;
}

function ApplicationHistory() {
  const params = useSearchParams();
  const { views, actionCaseIds } = useDashboard();
  const requestedFilter = params.get("filter");
  const initialTab = requestedFilter === "appeal" ? "action-required" : requestedFilter === "active" ? "under-process" : "all";
  const [tab, setTab] = useState<"all" | HistoryStatus>(initialTab);
  const [status, setStatus] = useState<"all" | HistoryStatus>("all");
  const [query, setQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

  const rows = useMemo(() => views
    .map((view) => ({ view, status: historyStatus(view, actionCaseIds) }))
    .sort((a, b) => b.view.submittedOn.getTime() - a.view.submittedOn.getTime()), [views, actionCaseIds]);
  const counts = (id: "all" | HistoryStatus) => id === "all" ? rows.length : rows.filter((row) => row.status === id).length;
  const filtered = rows.filter(({ view, status: rowStatus }) => {
    const needle = query.trim().toLowerCase();
    const matchesSearch = !needle || [view.c.registrationNumber, view.c.authority.office, view.c.authority.ministry, view.c.subject].join(" ").toLowerCase().includes(needle);
    const date = view.c.submittedOn;
    return matchesSearch && (tab === "all" || rowStatus === tab) && (status === "all" || rowStatus === status)
      && (!fromDate || date >= fromDate) && (!toDate || date <= toDate);
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const start = filtered.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const end = Math.min(currentPage * PAGE_SIZE, filtered.length);
  const hasFilters = Boolean(status !== "all" || fromDate || toDate || query);
  const clearFilters = () => { setStatus("all"); setFromDate(""); setToDate(""); setQuery(""); };

  return (
    <div className="mx-auto max-w-[1440px]">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div><h1 className="text-2xl font-bold tracking-tight text-ink sm:text-[28px]">My Applications <span className="text-ink-2">(History)</span></h1><p className="mt-1.5 text-sm text-ink-2 sm:text-[15px]">View all your RTI applications and their current status.</p></div>
        <Link href="/start-rti" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:px-7"><span aria-hidden className="text-xl font-light leading-none">+</span>File New RTI</Link>
      </header>

      <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(28,50,90,0.04)]">
        <div className="grid gap-4 border-b border-slate-200 p-4 sm:p-5 lg:grid-cols-[minmax(240px,1.5fr)_170px_180px_180px_auto] lg:items-end">
          <label className="relative block"><span className="sr-only">Search applications</span><span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><SearchIcon /></span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by Application No. or Department" className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-11 pr-3 text-sm text-ink shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50" /></label>
          <label className="block text-xs font-semibold text-ink-2">Status<select value={status} onChange={(event) => setStatus(event.target.value as "all" | HistoryStatus)} className="mt-1.5 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-ink shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"><option value="all">All Status</option>{HISTORY_TABS.slice(1).map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
          <label className="block text-xs font-semibold text-ink-2">From Date<input type="date" value={fromDate} max={toDate || undefined} onChange={(event) => setFromDate(event.target.value)} className="mt-1.5 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-ink shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" /></label>
          <label className="block text-xs font-semibold text-ink-2">To Date<input type="date" value={toDate} min={fromDate || undefined} onChange={(event) => setToDate(event.target.value)} className="mt-1.5 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-ink shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" /></label>
          <button type="button" onClick={hasFilters ? clearFilters : undefined} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-blue-500 bg-white px-4 text-sm font-semibold text-blue-600 transition hover:bg-blue-50" title={hasFilters ? "Clear all filters" : "Filters are applied automatically"}><FilterIcon />{hasFilters ? "Clear" : "Filters"}</button>
        </div>

        <div className="overflow-x-auto border-b border-slate-200 px-4 pt-4 sm:px-5"><div className="flex min-w-max gap-2" role="tablist" aria-label="Application status">
          {HISTORY_TABS.map((item) => { const active = tab === item.id; return <button key={item.id} type="button" role="tab" aria-selected={active} onClick={() => setTab(item.id)} className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${active ? "bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-100" : "text-ink-2 hover:bg-slate-50 hover:text-ink"}`}>{item.label} ({counts(item.id)})</button>; })}
        </div></div>

        {visibleRows.length ? <>
          <div className="hidden overflow-x-auto p-4 pt-3 sm:p-5 sm:pt-3 lg:block"><table className="w-full border-separate border-spacing-0 overflow-hidden rounded-lg border border-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold text-ink-2"><tr><th className="border-b border-slate-200 px-4 py-4">Application No.</th><th className="border-b border-slate-200 px-4 py-4">Department / Public Authority</th><th className="border-b border-slate-200 px-4 py-4">Submitted On</th><th className="border-b border-slate-200 px-4 py-4">Status</th><th className="border-b border-slate-200 px-4 py-4">Last Updated On</th><th className="border-b border-slate-200 px-4 py-4 text-center">Action</th></tr></thead>
            <tbody>{visibleRows.map(({ view, status: rowStatus }) => <tr key={view.c.id} className="transition hover:bg-blue-50/30"><td className="border-b border-slate-100 px-4 py-3.5 font-mono text-xs font-semibold text-ink">{view.c.registrationNumber}</td><td className="max-w-[290px] border-b border-slate-100 px-4 py-3.5 font-medium text-ink">{view.c.authority.office}</td><td className="whitespace-nowrap border-b border-slate-100 px-4 py-3.5 text-ink-2">{formatDate(view.submittedOn)}</td><td className="border-b border-slate-100 px-4 py-3.5"><StatusPill status={rowStatus} /></td><td className="whitespace-nowrap border-b border-slate-100 px-4 py-3.5 text-ink-2">{formatDate(lastUpdated(view))}</td><td className="border-b border-slate-100 px-4 py-3.5 text-center"><Link href={`/requests/${view.c.id}`} className="inline-flex min-h-9 items-center rounded-md border border-blue-500 px-4 text-xs font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white">View Details</Link></td></tr>)}</tbody>
          </table></div>
          <div className="grid gap-3 p-4 lg:hidden">{visibleRows.map(({ view, status: rowStatus }) => <article key={view.c.id} className="rounded-xl border border-slate-200 p-4 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-mono text-xs font-semibold text-ink">{view.c.registrationNumber}</p><StatusPill status={rowStatus} /></div><h2 className="mt-3 font-semibold leading-snug text-ink">{view.c.authority.office}</h2><dl className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-xs"><div><dt className="text-muted">Submitted On</dt><dd className="mt-1 font-medium text-ink-2">{formatDate(view.submittedOn)}</dd></div><div><dt className="text-muted">Last Updated</dt><dd className="mt-1 font-medium text-ink-2">{formatDate(lastUpdated(view))}</dd></div></dl><Link href={`/requests/${view.c.id}`} className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-blue-500 text-sm font-semibold text-blue-600">View Details</Link></article>)}</div>
        </> : <div className="px-5 py-16 text-center"><p className="font-semibold text-ink">No applications found</p><p className="mt-1 text-sm text-ink-2">Try another status, date range, or search term.</p><button type="button" onClick={clearFilters} className="mt-4 text-sm font-semibold text-blue-600 hover:underline">Clear filters</button></div>}

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 px-4 py-4 text-sm text-ink-2 sm:px-5"><p>Showing {start} to {end} of {filtered.length} application{filtered.length === 1 ? "" : "s"}</p><div className="flex items-center gap-2" aria-label="Pagination"><button type="button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="size-9 rounded-md border border-slate-200 text-lg text-ink-2 disabled:cursor-not-allowed disabled:opacity-35">‹</button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => <button key={number} type="button" aria-label={`Page ${number}`} aria-current={number === currentPage ? "page" : undefined} onClick={() => setPage(number)} className={`size-9 rounded-md border text-sm font-semibold ${number === currentPage ? "border-blue-500 text-blue-600" : "border-slate-200 text-ink-2 hover:bg-slate-50"}`}>{number}</button>)}<button type="button" aria-label="Next page" disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} className="size-9 rounded-md border border-slate-200 text-lg text-ink-2 disabled:cursor-not-allowed disabled:opacity-35">›</button></div></footer>
      </section>

      <aside className="mt-8 flex flex-wrap items-center gap-4 rounded-xl border border-blue-100 bg-blue-50/70 p-4 sm:px-5"><div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-blue-600 ring-1 ring-blue-100"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-6"><path d="M12 3 4.5 6v5.2c0 4.4 3 8.3 7.5 9.8 4.5-1.5 7.5-5.4 7.5-9.8V6L12 3Z" stroke="currentColor" strokeWidth="1.8"/><path d="M9.8 10a2.3 2.3 0 1 1 4.1 1.4c-.8.8-1.9 1-1.9 2.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/><path d="M12 16.8h.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg></div><div className="mr-auto"><p className="font-semibold text-ink">Need help?</p><p className="mt-0.5 text-sm text-ink-2">Visit our Help Center or contact support.</p></div><div className="flex w-full flex-wrap gap-3 sm:w-auto"><Link href="/about" className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg border border-blue-400 bg-white px-5 text-sm font-semibold text-blue-600 sm:flex-none">Help Center</Link><Link href="/about" className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg border border-blue-400 bg-white px-5 text-sm font-semibold text-blue-600 sm:flex-none">Contact Support</Link></div></aside>
    </div>
  );
}
