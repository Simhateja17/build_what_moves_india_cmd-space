"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { addDays, formatDate } from "@/lib/dates";
import { buildView, cardStatus, Tone } from "@/lib/dashboard";

type ProgressState = "complete" | "current" | "pending";

const toneStyles: Record<Tone, string> = {
  good: "bg-govgreen-50 text-govgreen-700",
  warn: "bg-saffron-50 text-saffron-600",
  danger: "bg-govred-50 text-govred-700",
  info: "bg-navy-50 text-navy-700",
  neutral: "bg-slate-100 text-ink-2",
};

export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getCase, dayOf, appealOf, readResponses, markResponseRead } = useStore();
  const c = getCase(id);

  const replyIsVisible = c?.replyDay !== undefined && dayOf(id) >= c.replyDay;
  useEffect(() => {
    if (replyIsVisible) markResponseRead(id);
  }, [replyIsVisible, id, markResponseRead]);

  if (!c) {
    return (
      <div className="gov-card p-8 text-center">
        <p className="font-semibold text-ink">We could not find that request.</p>
        <Link href="/my-rtis" className="mt-3 inline-block font-medium text-navy-700 hover:underline">
          Back to your RTIs
        </Link>
      </div>
    );
  }

  const day = dayOf(c.id);
  const appeal = appealOf(c.id);
  const v = buildView(c, day, appeal, readResponses.includes(c.id));
  const status = cardStatus(v);
  const forwardedOn = addDays(c.submittedOn, 2);

  const steps: Array<{ label: string; date: string; state: ProgressState }> = [
    { label: "Received", date: formatDate(v.submittedOn), state: "complete" },
    {
      label: "Forwarded to Public Authority",
      date: day >= 2 ? formatDate(forwardedOn) : "Pending",
      state: day >= 2 ? "complete" : "current",
    },
    {
      label: "Reply from Public Authority",
      date: v.repliedOn ? formatDate(v.repliedOn) : v.d.isOverdue ? "Overdue" : "Pending",
      state: v.d.hasReply ? "complete" : day >= 2 ? "current" : "pending",
    },
    {
      label: "Response to Applicant",
      date: v.repliedOn ? formatDate(v.repliedOn) : "Pending",
      state: v.d.hasReply ? "complete" : "pending",
    },
    {
      label: v.d.appealFiled ? "Appeal under review" : "Closed",
      date: v.d.appealFiled ? "Pending" : v.d.hasReply ? formatDate(v.repliedOn!) : "Pending",
      state: v.d.appealFiled ? "current" : v.d.hasReply ? "complete" : "pending",
    },
  ];

  const history = [
    {
      title: "Application received",
      text: c.feeLabel.toLowerCase().includes("waived")
        ? "Your RTI application was received. The application fee was waived."
        : "Your RTI application and fee were received.",
      date: `${formatDate(v.submittedOn)}, 9:30 AM`,
      state: "complete" as ProgressState,
    },
    {
      title: "Forwarded to Public Authority",
      text: "Your application was forwarded to the concerned Public Authority.",
      date: day >= 2 ? `${formatDate(forwardedOn)}, 10:15 AM` : "Pending",
      state: day >= 2 ? ("complete" as ProgressState) : ("current" as ProgressState),
    },
    {
      title: "Reply from Public Authority",
      text: v.d.hasReply ? "The Public Authority sent its reply." : "Waiting for the Public Authority to reply.",
      date: v.repliedOn ? formatDate(v.repliedOn) : v.d.isOverdue ? `${v.d.daysLate} days overdue` : "Pending",
      state: v.d.hasReply ? ("complete" as ProgressState) : day >= 2 ? ("current" as ProgressState) : ("pending" as ProgressState),
    },
    {
      title: "Response to Applicant",
      text: v.d.hasReply ? "The response is available in your account." : "Pending",
      date: v.repliedOn ? formatDate(v.repliedOn) : "Pending",
      state: v.d.hasReply ? ("complete" as ProgressState) : ("pending" as ProgressState),
    },
    {
      title: v.d.appealFiled ? "First Appeal" : "Closed",
      text: v.d.appealFiled ? "Your First Appeal is under review." : v.d.hasReply ? "The request has been completed." : "Pending",
      date: v.d.appealFiled && appeal.filedOnDay !== undefined ? formatDate(addDays(c.submittedOn, appeal.filedOnDay)) : v.d.hasReply && v.repliedOn ? formatDate(v.repliedOn) : "Pending",
      state: v.d.appealFiled ? ("current" as ProgressState) : v.d.hasReply ? ("complete" as ProgressState) : ("pending" as ProgressState),
    },
  ];

  return (
    <div className="mx-auto max-w-[1240px]">
      <Link href="/my-rtis" className="inline-flex items-center gap-2 text-sm font-semibold text-navy-700 hover:underline">
        <span aria-hidden>←</span> My RTIs
      </Link>

      <header className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-[30px]">View Status</h1>
          <p className="mt-1 text-sm text-ink-2">Track the current status and details of your RTI application.</p>
        </div>
        <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl border border-navy-600/50 bg-white px-5 py-2.5 text-sm font-bold text-navy-700 transition hover:bg-navy-50 print:hidden">
          <DownloadIcon /> Download
        </button>
      </header>

      <section className="mt-7 overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-panel)]">
        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.1fr_1fr_0.75fr_0.8fr] lg:items-center">
          <div className="flex items-center gap-4 lg:border-r lg:border-line-2 lg:pr-6">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-700"><ApplicationIcon /></span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted">Application No.</p>
              <p className="mt-1 truncate text-[18px] font-bold text-navy-900">{c.registrationNumber}</p>
              <span className={`mt-2 inline-flex rounded-md px-2.5 py-1 text-xs font-bold ${toneStyles[status.tone]}`}>{status.label}</span>
            </div>
          </div>
          <SummaryItem label="Department" value={c.authority.office} />
          <div className="space-y-4"><SummaryItem label="Submitted On" value={formatDate(v.submittedOn)} /><SummaryItem label="Application Fee" value={c.feeLabel} /></div>
          <div className="space-y-4"><SummaryItem label="Mode of Submission" value="Online" /><a href="#application" className="inline-flex items-center gap-1.5 text-sm font-bold text-navy-700 hover:underline">View Application <ExternalIcon /></a></div>
        </div>

        <div className="border-t border-line-2 px-5 py-7 sm:px-8">
          <ol className="grid gap-5 sm:grid-cols-5 sm:gap-0">
            {steps.map((step, index) => <ProgressStep key={step.label} {...step} first={index === 0} />)}
          </ol>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-panel)] sm:p-7">
          <h2 className="text-lg font-bold text-navy-900">Status History</h2>
          <ol className="mt-6 space-y-0">
            {history.map((item, index) => <HistoryItem key={`${item.title}-${index}`} {...item} last={index === history.length - 1} />)}
          </ol>
        </section>

        <section className="rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-panel)] sm:p-7">
          <h2 className="text-lg font-bold text-navy-900">Details</h2>
          <dl className="mt-3 divide-y divide-line-2">
            <DetailRow label="Public Authority" value={c.authority.office} />
            <DetailRow label="CPIO Name" value={c.authority.cpio} />
            <DetailRow label="Ministry" value={c.authority.ministry} />
            <DetailRow label="Description" value={c.plainTitle} />
            <DetailRow label="Request Date" value={formatDate(v.submittedOn)} />
            <DetailRow label={v.d.hasReply ? "Reply Date" : "Expected Reply Date"} value={v.d.hasReply && v.repliedOn ? formatDate(v.repliedOn) : `${formatDate(v.expectedBy)} (30 days)`} />
          </dl>
        </section>
      </div>

      <section className="relative mt-6 overflow-hidden rounded-2xl border border-navy-600/15 bg-navy-50 px-6 py-5 sm:px-7">
        <div className="max-w-3xl pr-0 sm:pr-32">
          <h2 className="font-bold text-navy-900">What happens next?</h2>
          <p className="mt-2 text-sm leading-6 text-ink-2">{nextStepCopy(v.d.hasReply, v.d.isOverdue, v.d.appealFiled, v.d.daysLeft)}</p>
        </div>
        <div aria-hidden className="absolute bottom-0 right-8 hidden h-24 w-24 items-end justify-center text-navy-600/80 sm:flex"><NextIllustration /></div>
      </section>

      {v.d.hasReply && v.d.reply ? (
        <section id="response" className="mt-6 rounded-2xl border border-govgreen-600/25 bg-govgreen-50 p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-bold text-govgreen-700">Response received</h2><span className="text-xs font-semibold text-govgreen-700">{v.repliedOn ? formatDate(v.repliedOn) : ""}</span></div>
          <p className="mt-3 text-sm leading-6 text-ink-2">{v.d.reply}</p>
        </section>
      ) : null}

      <section id="application" className="mt-6 rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-panel)] sm:p-7">
        <h2 className="text-lg font-bold text-navy-900">Your application</h2>
        <p className="mt-2 text-sm leading-6 text-ink-2">{c.question}</p>
      </section>

      <section id="appeal" className="mt-6 rounded-2xl border border-saffron-400/35 bg-white p-4 shadow-[var(--shadow-panel)] sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-5">
        <div className="flex gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-saffron-50 text-saffron-600"><AppealIcon /></span><div><h2 className="font-bold text-navy-900">Need to File an Appeal?</h2><p className="mt-1 max-w-3xl text-sm leading-5 text-ink-2">If you do not receive a satisfactory response within the stipulated time, or are not satisfied with the response, you can file a First Appeal.</p></div></div>
        <Link href={`/requests/${c.id}/appeal`} className="mt-4 inline-flex w-full shrink-0 justify-center rounded-lg border border-navy-600 bg-white px-5 py-2.5 text-sm font-bold text-navy-700 hover:bg-navy-50 sm:mt-0 sm:w-auto">{v.d.appealFiled ? "View First Appeal" : "File First Appeal"}</Link>
      </section>
    </div>
  );
}

function nextStepCopy(hasReply: boolean, isOverdue: boolean, appealFiled: boolean, daysLeft: number) {
  if (appealFiled) return "The Appellate Authority is reviewing your appeal. You will be notified when a decision is available.";
  if (hasReply) return "Review the response carefully. If it is incomplete, misleading, or unsatisfactory, you may file a First Appeal.";
  if (isOverdue) return "The legal response deadline has passed. You can now file a First Appeal free of cost.";
  return `The Public Authority will review your request and provide a response within 30 days. ${daysLeft} day${daysLeft === 1 ? "" : "s"} remain; you will be notified once a response is available.`;
}

function SummaryItem({ label, value }: { label: string; value: string }) { return <div><p className="text-xs font-medium text-muted">{label}</p><p className="mt-1 text-sm font-semibold leading-5 text-ink">{value}</p></div>; }

function ProgressStep({ label, date, state, first }: { label: string; date: string; state: ProgressState; first: boolean }) {
  const active = state !== "pending";
  return <li className="relative flex gap-3 sm:block sm:text-center"><div className={`absolute left-3 top-0 h-full w-px sm:left-0 sm:top-3 sm:h-px sm:w-full ${first ? "sm:left-1/2 sm:w-1/2" : ""} ${active ? "bg-navy-600" : "bg-slate-200"}`} /><span className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-4 border-white text-[10px] font-bold sm:mx-auto ${active ? "bg-navy-700 text-white" : "bg-slate-200 text-slate-500"}`}>{state === "complete" ? "✓" : state === "current" ? "•" : ""}</span><div className="relative sm:mt-2"><p className={`text-xs font-semibold leading-5 ${active ? "text-navy-900" : "text-ink-2"}`}>{label}</p><p className="text-[11px] text-muted">{date}</p></div></li>;
}

function HistoryItem({ title, text, date, state, last }: { title: string; text: string; date: string; state: ProgressState; last: boolean }) {
  const active = state !== "pending";
  return <li className="relative flex gap-4 pb-6 last:pb-0">{!last ? <span className={`absolute left-[9px] top-5 h-full w-px ${active ? "bg-navy-600/25" : "bg-slate-200"}`} /> : null}<span className={`relative z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${state === "complete" ? "bg-govgreen-600 text-white" : state === "current" ? "bg-navy-700 text-white" : "bg-slate-200 text-slate-500"}`}>{state === "complete" ? "✓" : state === "current" ? "•" : ""}</span><div><h3 className="text-sm font-bold text-ink">{title}</h3><p className="mt-1 text-xs leading-5 text-ink-2">{text}</p><p className="mt-1 text-xs text-muted">{date}</p></div></li>;
}

function DetailRow({ label, value }: { label: string; value: string }) { return <div className="grid gap-1 py-3.5 sm:grid-cols-[135px_1fr] sm:gap-4"><dt className="text-xs font-medium text-muted">{label}</dt><dd className="text-sm font-semibold leading-5 text-ink-2">{value}</dd></div>; }

function DownloadIcon() { return <svg aria-hidden width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 3v11m0 0 4-4m-4 4-4-4M5 16v4h14v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function ExternalIcon() { return <svg aria-hidden width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M14 5h5v5m0-5-8 8M19 13v6H5V5h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function ApplicationIcon() { return <svg aria-hidden width="34" height="34" viewBox="0 0 40 40" fill="none"><path d="M11 5h14l6 6v20H11V5Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/><path d="M25 5v7h6M16 18h10M16 23h8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><circle cx="28" cy="29" r="5" fill="white" stroke="currentColor" strokeWidth="2.5"/><path d="m26 29 1.5 1.5 3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function AppealIcon() { return <svg aria-hidden width="28" height="28" viewBox="0 0 32 32" fill="none"><path d="M16 4v23M9 7h14M9 7 4 17h10L9 7Zm14 0-5 10h10L23 7ZM5 20h8m6 0h8M11 27h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function NextIllustration() { return <svg width="95" height="90" viewBox="0 0 95 90" fill="none"><path d="M50 41h37v35H50z" fill="#CFE0FB"/><path d="m50 42 18 16 19-16" stroke="currentColor" strokeWidth="2"/><path d="M8 15h37M13 20h27M17 20c0 15 4 17 10 21-6 4-10 7-10 22m23-43c0 15-4 17-10 21 6 4 10 7 10 22M9 66h36" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><path d="M18 28h21L28 38 18 28Zm1 30h20L29 46 19 58Z" fill="currentColor" opacity=".25"/><circle cx="82" cy="65" r="11" fill="#4778BD"/><path d="M82 59v7l4 2" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>; }
