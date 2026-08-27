"use client";

import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/lib/store";
import { useDashboard } from "@/lib/use-dashboard";
import {
  ActionItem,
  CaseView,
  Notification,
  Tone,
  cardStatus,
} from "@/lib/dashboard";
import { formatDate } from "@/lib/dates";
import { OverviewStats } from "@/components/dashboard/OverviewStats";
import { ProcessDemo } from "@/components/dashboard/ProcessDemo";

type QuickActionKind = "file" | "cases" | "track" | "appeal";

const QUICK_ACTIONS: Array<{
  title: string;
  detail: string;
  href: string;
  kind: QuickActionKind;
  tone: string;
}> = [
  {
    title: "File a new RTI",
    detail: "Start a new information request",
    href: "/start-rti",
    kind: "file",
    tone: "bg-navy-50 text-navy-700",
  },
  {
    title: "My RTIs",
    detail: "View and manage all your requests",
    href: "/my-rtis",
    kind: "cases",
    tone: "bg-govgreen-50 text-govgreen-700",
  },
  {
    title: "Track a request",
    detail: "Check its latest status",
    href: "/view-status",
    kind: "track",
    tone: "bg-[#f3edff] text-[#7447b8]",
  },
  {
    title: "My appeals",
    detail: "View or file an appeal",
    href: "/my-rtis?filter=appeal",
    kind: "appeal",
    tone: "bg-saffron-50 text-saffron-600",
  },
];

export default function DashboardPage() {
  const { citizenName } = useStore();
  const { views, actions, overview, notifications } = useDashboard();

  const recentApplications = [...views]
    .sort((a, b) => b.submittedOn.getTime() - a.submittedOn.getTime())
    .slice(0, 5);

  return (
    <div className="dashboard-canvas space-y-7 sm:space-y-9">
      <section className="dashboard-home-hero overflow-hidden rounded-[28px] border border-navy-600/15 px-5 py-8 shadow-[var(--shadow-panel-lg)] sm:px-9 sm:py-10 lg:min-h-[300px] lg:px-12">
        <div className="relative z-[2] flex h-full max-w-xl flex-col items-start justify-center">
          <h1 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            Namaste, {citizenName.split(" ")[0]}
          </h1>
          <p className="mt-3 text-base font-bold text-ink">
            Manage your RTI applications in one place.
          </p>
          <p className="mt-1 max-w-md text-sm leading-relaxed text-ink-2">
            View your applications, check responses, track deadlines, and take
            action when required.
          </p>
          <p className="mt-3 text-[13px] text-ink-2">
            {overview.actions > 0 ? (
              <>
                <span className="font-bold text-saffron-500">
                  {overview.actions} thing{overview.actions === 1 ? "" : "s"} need
                  {overview.actions === 1 ? "s" : ""} you
                </span>{" "}
                · {overview.active} in progress
              </>
            ) : (
              <>Nothing needs you · {overview.active} in progress</>
            )}
          </p>
          <Link
            href="/start-rti"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-navy-700 px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_10px_22px_rgba(61,111,179,0.22)] transition hover:-translate-y-0.5 hover:bg-navy-800"
          >
            <span aria-hidden className="text-lg leading-none">
              +
            </span>
            File a new RTI
          </Link>
        </div>

        <div className="dashboard-workspace-art" aria-hidden="true">
          <Image
            src="/dashboard-welcome-illustration.png"
            alt=""
            width={1672}
            height={941}
            priority
            sizes="(max-width: 767px) 85vw, (max-width: 1023px) 57vw, 49vw"
          />
        </div>
      </section>

      <section aria-labelledby="quick-actions-title">
        <h2
          id="quick-actions-title"
          className="mb-3 text-lg font-bold tracking-tight text-navy-900"
        >
          What would you like to do?
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="lift gov-card group flex min-h-[126px] items-center gap-4 p-4 transition hover:border-navy-600/30 sm:p-5"
            >
              <span
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${action.tone}`}
                aria-hidden
              >
                <QuickActionIcon kind={action.kind} />
              </span>
              <span className="min-w-0">
                <span className="block font-bold text-ink">{action.title}</span>
                <span className="mt-1 block text-[12px] leading-relaxed text-ink-2">
                  {action.detail}
                </span>
              </span>
              <span
                aria-hidden
                className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-700 transition group-hover:translate-x-0.5"
              >
                ›
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="overview-title">
        <h2
          id="overview-title"
          className="mb-3 text-lg font-bold tracking-tight text-navy-900"
        >
          Your RTI overview
        </h2>
        <OverviewStats o={overview} />
      </section>

      <div className="grid items-stretch gap-6 lg:grid-cols-12 lg:gap-7">
        <section className="flex flex-col lg:col-span-8">
          <SectionHead
            title="Recent applications"
            href="/my-rtis"
            cta="View all applications"
          />
          <RecentApplicationsTable views={recentApplications} />
        </section>

        <aside className="flex flex-col lg:col-span-4">
          <SectionHead
            title="Needs your attention"
            href="/my-rtis?filter=action"
            cta="View all"
          />
          <AttentionPanel items={actions} />
        </aside>
      </div>

      <div className="grid items-stretch gap-6 lg:grid-cols-12 lg:gap-7">
        <section className="flex flex-col lg:col-span-7">
          <SectionHead
            title="Recent activity"
            href="/notifications"
            cta="View all activity"
          />
          <ActivityPanel notifications={notifications} />
        </section>

        <section className="flex flex-col lg:col-span-5">
          <h2 className="mb-3 text-lg font-bold tracking-tight text-navy-900">
            Need help?
          </h2>
          <div className="gov-card relative flex min-h-[320px] flex-1 flex-col overflow-hidden p-6 sm:p-7">
            <div className="relative z-[2] max-w-sm">
              <p className="text-sm text-ink-2">
                Find answers to common questions or get guided support.
              </p>
              <ul className="mt-5 space-y-3 text-sm font-semibold text-navy-700">
                <li><Link href="/start-rti" className="hover:underline">How to file an RTI <span aria-hidden>›</span></Link></li>
                <li><Link href="/about" className="hover:underline">Understand RTI status <span aria-hidden>›</span></Link></li>
                <li><Link href="/my-rtis?filter=appeal" className="hover:underline">How to file a First Appeal <span aria-hidden>›</span></Link></li>
                <li><Link href="/find-department" className="hover:underline">Find the right public authority <span aria-hidden>›</span></Link></li>
                <li><Link href="/assistant" className="hover:underline">Start with my problem <span aria-hidden>›</span></Link></li>
              </ul>
              <Link
                href="/assistant"
                className="mt-6 inline-flex rounded-lg border border-navy-600/35 bg-white px-4 py-2.5 text-sm font-bold text-navy-700 transition hover:bg-navy-50"
              >
                Get guided help
              </Link>
            </div>
            <div className="dashboard-help-art" aria-hidden="true">
              <HelpIllustration />
            </div>
          </div>
        </section>
      </div>

      <ProcessDemo />

      <section className="dashboard-trust-strip rounded-2xl border border-navy-600/15 px-5 py-4 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:px-7">
        <div>
          <p className="text-sm font-bold text-navy-900">
            Your demo information stays on this device.
          </p>
          <p className="mt-1 text-xs text-ink-2">
            This prototype does not submit a real RTI or send personal data to a government system.
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-[11px] font-semibold text-navy-700 sm:mt-0 sm:justify-end">
          <span>✓ Local demo</span>
          <span>✓ Fictional case data</span>
          <span>✓ Independent concept</span>
        </div>
      </section>
    </div>
  );
}

const STATUS_STYLE: Record<Tone, string> = {
  good: "bg-govgreen-50 text-govgreen-700",
  warn: "bg-saffron-50 text-saffron-600",
  danger: "bg-govred-50 text-govred-700",
  info: "bg-navy-50 text-navy-700",
  neutral: "bg-canvas text-ink-2",
};

function RecentApplicationsTable({ views }: { views: CaseView[] }) {
  return (
    <div className="gov-card flex-1">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
        <thead className="bg-navy-50/55 text-[11px] font-bold uppercase tracking-wide text-muted">
          <tr>
            <th className="px-5 py-3.5">Application no.</th>
            <th className="px-4 py-3.5">Department</th>
            <th className="px-4 py-3.5">Submitted on</th>
            <th className="px-4 py-3.5">Status</th>
            <th className="px-5 py-3.5 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line-2">
          {views.map((view) => {
            const status = cardStatus(view);
            return (
              <tr key={view.c.id} className="transition hover:bg-navy-50/30">
                <td className="px-5 py-4 font-mono text-[11px] text-ink-2">
                  {view.c.registrationNumber}
                </td>
                <td className="max-w-[220px] px-4 py-4 text-[13px] font-medium text-ink">
                  <span className="line-clamp-2">{view.c.authority.office}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-[12px] text-ink-2">
                  {formatDate(view.submittedOn)}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${STATUS_STYLE[status.tone]}`}
                  >
                    {status.label}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/requests/${view.c.id}`}
                    className="inline-flex rounded-lg border border-navy-600/30 bg-white px-3 py-1.5 text-[12px] font-bold text-navy-700 transition hover:bg-navy-50"
                  >
                    View
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
        </table>
      </div>
    </div>
  );
}

function AttentionPanel({ items }: { items: ActionItem[] }) {
  const shown = items.slice(0, 2);

  return (
    <div className="gov-card flex min-h-[350px] flex-1 flex-col gap-3 p-4 sm:p-5">
      {shown.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-2xl bg-govgreen-50 p-6 text-center">
          <div>
            <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-govgreen-600 font-bold text-white" aria-hidden>
              ✓
            </span>
            <p className="mt-3 font-bold text-ink">Nothing needs you right now</p>
            <p className="mt-1 text-sm text-ink-2">We will tell you when that changes.</p>
          </div>
        </div>
      ) : (
        shown.map((item) => (
          <div
            key={item.id}
            className={`flex flex-1 gap-3 rounded-2xl border p-4 ${
              item.tone === "danger"
                ? "border-govred-600/20 bg-govred-50"
                : item.tone === "good"
                  ? "border-govgreen-600/20 bg-govgreen-50"
                  : "border-saffron-500/25 bg-saffron-50"
            }`}
          >
            <span
              aria-hidden
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                item.tone === "danger"
                  ? "bg-govred-600 text-white"
                  : item.tone === "good"
                    ? "bg-govgreen-600 text-white"
                    : "bg-saffron-500 text-white"
              }`}
            >
              {item.tone === "good" ? "✓" : "!"}
            </span>
            <div className="min-w-0">
              <p className="text-[14px] font-bold text-ink">{item.title}</p>
              <p className="mt-1 line-clamp-3 text-[12px] leading-relaxed text-ink-2">
                {item.detail}
              </p>
              <Link
                href={item.href}
                className="mt-3 inline-flex rounded-lg border border-current/20 bg-white px-3 py-2 text-[12px] font-bold text-navy-700 transition hover:bg-navy-50"
              >
                {item.cta} →
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function ActivityPanel({ notifications }: { notifications: Notification[] }) {
  return (
    <ul className="gov-card flex min-h-[320px] flex-1 flex-col justify-center overflow-hidden px-5 py-3 sm:px-6">
      {notifications.slice(0, 5).map((notification, index) => (
        <li key={notification.id} className="relative flex gap-4 py-3">
          {index < Math.min(notifications.length, 5) - 1 ? (
            <span
              aria-hidden
              className="absolute left-[13px] top-9 h-[calc(100%-1rem)] w-px bg-line"
            />
          ) : null}
          <span
            aria-hidden
            className={`relative z-[1] flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${
              index === 0
                ? "bg-govgreen-600"
                : index === 1
                  ? "bg-saffron-500"
                  : "bg-navy-600"
            }`}
          >
            {index === 0 ? "✓" : index + 1}
          </span>
          <Link href={notification.href} className="group min-w-0">
            <span className="block text-[13px] font-semibold text-ink group-hover:text-navy-700">
              {notification.title}
            </span>
            <span className="mt-0.5 line-clamp-1 block text-[11px] text-muted">
              {notification.body}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function QuickActionIcon({ kind }: { kind: QuickActionKind }) {
  if (kind === "file") {
    return (
      <svg viewBox="0 0 28 28" className="h-7 w-7" fill="none">
        <path d="M7 3.5h10l4 4V23H7V3.5Z" stroke="currentColor" strokeWidth="2" />
        <path d="M17 3.5V8h4M10.5 12h7M10.5 16h4" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
        <circle cx="20.5" cy="20.5" r="5" fill="currentColor" />
        <path d="M20.5 18v5M18 20.5h5" stroke="#fff" strokeLinecap="round" strokeWidth="1.5" />
      </svg>
    );
  }

  if (kind === "cases") {
    return (
      <svg viewBox="0 0 28 28" className="h-7 w-7" fill="none">
        <path d="M3.5 8.5h8l2-2h11v15.5a2 2 0 0 1-2 2h-17a2 2 0 0 1-2-2V8.5Z" fill="currentColor" opacity=".2" />
        <path d="M3.5 10h21l-2.5 13H6L3.5 10Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    );
  }

  if (kind === "track") {
    return (
      <svg viewBox="0 0 28 28" className="h-7 w-7" fill="none">
        <circle cx="12.5" cy="12.5" r="7.5" stroke="currentColor" strokeWidth="2.5" />
        <path d="m18 18 6 6" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 28 28" className="h-7 w-7" fill="none">
      <path d="M14 4v19M8 7h12M8 7l-4 8h8L8 7Zm12 0-4 8h8l-4-8ZM10 24h8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function HelpIllustration() {
  return (
    <svg viewBox="0 0 180 180" role="presentation">
      <path d="M41 101a49 49 0 0 1 98 0" fill="none" stroke="#dce9ff" strokeLinecap="round" strokeWidth="13" />
      <rect x="31" y="94" width="25" height="48" rx="12" fill="#b9d1f6" />
      <rect x="124" y="94" width="25" height="48" rx="12" fill="#b9d1f6" />
      <path d="M136 138c0 18-16 24-35 24" fill="none" stroke="#b9d1f6" strokeLinecap="round" strokeWidth="7" />
      <rect x="83" y="156" width="24" height="11" rx="5.5" fill="#8fb3ea" />
      <circle cx="91" cy="88" r="28" fill="#edf4ff" />
      <path d="M82 80c1-10 8-16 18-16 11 0 18 7 18 17 0 13-15 15-15 25" fill="none" stroke="#4778bd" strokeLinecap="round" strokeWidth="7" />
      <circle cx="103" cy="119" r="4" fill="#4778bd" />
    </svg>
  );
}

function SectionHead({
  title,
  href,
  cta,
}: {
  title: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-3">
      <h2 className="text-lg font-bold tracking-tight text-navy-900">{title}</h2>
      <Link
        href={href}
        className="shrink-0 text-[13px] font-semibold text-navy-700 hover:underline"
      >
        {cta} →
      </Link>
    </div>
  );
}
