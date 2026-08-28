"use client";

import { useMemo } from "react";
import { useStore } from "./store";
import {
  ActionItem,
  CaseView,
  Notification,
  Overview,
  actionsFor,
  buildView,
  notificationsFor,
  overview,
} from "./dashboard";

export interface DashboardData {
  views: CaseView[];
  actions: ActionItem[];
  notifications: Notification[];
  overview: Overview;
  /**
   * Case ids that genuinely need the citizen to do something.
   *
   * Excludes "you have an unread reply" — that is a read receipt, not a
   * task, and counting it would push every answered case into "Needs you".
   */
  actionCaseIds: Set<string>;
  unreadNotifications: number;
}

/**
 * One derivation, shared by every screen. Home, My RTIs, Notifications
 * and the badge on the bottom bar all read from this, so they can never
 * disagree about how many things need doing.
 */
export function useDashboard(): DashboardData {
  const {
    cases,
    dayOf,
    appealOf,
    readResponses,
    payments,
    readNotifications,
    uploads,
  } = useStore();

  return useMemo(() => {
    const views = cases.map((c) =>
      buildView(c, dayOf(c.id), appealOf(c.id), readResponses.includes(c.id)),
    );

    // A case whose document has been sent no longer needs one asked for.
    const documentsSent = new Set(
      Object.keys(uploads).filter((id) => (uploads[id] ?? []).length > 0),
    );
    const actions = actionsFor(views, payments, documentsSent);
    const notifications = notificationsFor(views, payments);

    // An action id ends in the case id for case-derived items; map them
    // back so the "Needs you" chip can select whole cases.
    const actionCaseIds = new Set<string>();
    for (const v of views) {
      if (
        actions.some((a) => a.kind !== "response" && a.id.endsWith(`-${v.c.id}`))
      ) {
        actionCaseIds.add(v.c.id);
      }
    }

    return {
      views,
      actions,
      notifications,
      overview: overview(views, actions.length, actionCaseIds),
      actionCaseIds,
      unreadNotifications: notifications.filter(
        (n) => !readNotifications.includes(n.id),
      ).length,
    };
  }, [cases, dayOf, appealOf, readResponses, payments, readNotifications, uploads]);
}
