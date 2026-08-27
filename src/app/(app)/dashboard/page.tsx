"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { useDashboard } from "@/lib/use-dashboard";
import { OverviewStats } from "@/components/dashboard/OverviewStats";
import { ActionRequired } from "@/components/dashboard/ActionRequired";
import { RtiCard } from "@/components/dashboard/RtiCard";
import { ResponsesList } from "@/components/dashboard/ResponsesList";

export default function HomePage() {
  const { citizenName } = useStore();
  const { views, actions, overview, notifications } = useDashboard();

  // Surface the ones actually moving: appeals first, then unread answers,
  // then whatever is closest to running out of time.
  const attention = [...views]
    .sort((a, b) => {
      const rank = (v: typeof a) =>
        v.d.canFileFirstAppeal || v.d.canFileSecondAppeal
          ? 0
          : v.d.hasReply && !v.responseRead
            ? 1
            : v.d.hasReply
              ? 3
              : 2;
      return rank(a) - rank(b) || a.d.daysLeft - b.d.daysLeft;
    })
    .slice(0, 3);

  return (
    <div className="grid items-start gap-5 sm:gap-6 lg:grid-cols-12">
      <section className="dashboard-hero overflow-hidden rounded-[28px] px-5 py-7 text-white shadow-[var(--shadow-panel-lg)] sm:px-8 sm:py-9 lg:col-span-8">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Namaste, {citizenName.split(" ")[0]}
        </h1>
        <p className="mt-1.5 text-[15px] text-white/75">
          {overview.actions > 0 ? (
            <>
              <span className="font-semibold text-saffron-400">
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
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-[15px] font-bold text-navy-800 transition hover:bg-navy-50 sm:w-auto sm:px-7"
        >
          <span aria-hidden className="text-lg leading-none">
            +
          </span>
          File a new RTI
        </Link>
      </section>

      {/* The way in for someone who has a problem but no idea whose
            problem it is — which is most first-time filers. The form
            itself opens with a ministry dropdown, and that is exactly
            the question they cannot answer. */}
      <div className="h-full rounded-[28px] border border-navy-600/20 bg-navy-50 px-5 py-5 sm:flex sm:items-center sm:justify-between sm:gap-6 lg:col-span-4 lg:block lg:p-7">
        <div>
          <p className="font-semibold text-navy-900">
            Don&apos;t know where to start?
          </p>
          <p className="mt-1 text-sm leading-relaxed text-navy-800/85">
            Describe your problem in your own words. We will find the
            department, tell you whether it belongs to this portal, and write
            the request for you.
          </p>
        </div>
        <div className="mt-4 flex shrink-0 flex-wrap gap-x-5 gap-y-2 sm:mt-0 sm:flex-col sm:items-end lg:mt-6 lg:items-start">
            <Link
              href="/assistant"
              className="text-sm font-semibold text-navy-800 underline underline-offset-2"
            >
              Start with my problem →
            </Link>
            <Link
              href="/find-department"
              className="text-sm font-medium text-navy-700 underline underline-offset-2"
            >
              Just find the department
            </Link>
        </div>
      </div>

      <div className="lg:col-span-12">
        <ActionRequired items={actions} />
      </div>

      <section className="lg:col-span-7 lg:row-span-2">
        <SectionHead title="Your RTIs" href="/my-rtis" cta="See all" />
        <div className="space-y-3">
          {attention.map((v) => (
            <RtiCard key={v.c.id} v={v} />
          ))}
        </div>
      </section>

      <div className="lg:col-span-5">
        <OverviewStats o={overview} />
      </div>

      <section className="lg:col-span-5">
        <SectionHead
          title="Recent responses"
          href="/my-rtis?filter=response"
          cta="See all"
        />
        <ResponsesList views={views} limit={2} />
      </section>

      <section className="lg:col-span-5">
        <SectionHead title="Latest updates" href="/notifications" cta="See all" />
        <ul className="gov-card divide-y divide-line-2">
          {notifications.slice(0, 3).map((n) => (
            <li key={n.id}>
              <Link
                href={n.href}
                className="block px-4 py-3.5 transition hover:bg-canvas/50"
              >
                <p className="text-[14px] font-semibold text-ink">{n.title}</p>
                <p className="mt-0.5 line-clamp-2 text-[13px] leading-relaxed text-ink-2">
                  {n.body}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
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
