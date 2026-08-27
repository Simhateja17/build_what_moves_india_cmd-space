"use client";

import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { TOPIC_BY_ID } from "./topics";
import {
  AssistantState,
  AssistantStep,
  BodyType,
  DraftFormat,
  STATE_KEY,
  STEP_ORDER,
} from "./types";

/* ------------------------------------------------------------------
   The assistant's state.

   Deliberately a plain reducer over sessionStorage rather than another
   context in the tree: the finder and the full assistant are separate
   routes, and a citizen who starts at "find my department" and then
   decides to write the request should not be asked anything twice.
------------------------------------------------------------------- */

export const INITIAL: AssistantState = {
  step: "problem",
  rawProblem: "",
  stateName: "",
  city: "",
  bodyType: "urban",
  answers: {},
  skipped: [],
  selectedAskIds: [],
  customAsks: [],
  format: "letter",
};

type Action =
  | { type: "go"; step: AssistantStep }
  | { type: "problem"; text: string }
  | { type: "topic"; id: string }
  | { type: "location"; stateName?: string; city?: string; bodyType?: BodyType }
  | { type: "answer"; id: string; value: string }
  | { type: "skip"; id: string }
  | { type: "toggleAsk"; id: string }
  | { type: "addCustomAsk"; text: string }
  | { type: "removeCustomAsk"; index: number }
  | { type: "override"; id?: string }
  | { type: "editDraft"; text: string }
  | { type: "restoreDraft" }
  | { type: "format"; format: DraftFormat }
  | { type: "reset" }
  | { type: "hydrate"; state: AssistantState };

function defaultAsks(topicId: string): string[] {
  return (TOPIC_BY_ID[topicId]?.asks ?? [])
    .filter((a) => a.defaultOn)
    .map((a) => a.id);
}

function reducer(state: AssistantState, action: Action): AssistantState {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "reset":
      return INITIAL;
    case "go":
      return { ...state, step: action.step };
    case "problem":
      return { ...state, rawProblem: action.text };

    case "topic": {
      if (state.topicId === action.id) return state;
      // A new topic invalidates every answer and every tick that was
      // scoped to the old one — carrying them over would silently put
      // a school question inside a road request.
      return {
        ...state,
        topicId: action.id,
        answers: {},
        skipped: [],
        selectedAskIds: defaultAsks(action.id),
        customAsks: [],
        authorityOverrideId: undefined,
        editedDraft: undefined,
      };
    }

    case "location":
      return {
        ...state,
        stateName: action.stateName ?? state.stateName,
        city: action.city ?? state.city,
        bodyType: action.bodyType ?? state.bodyType,
        authorityOverrideId: undefined,
      };

    case "answer": {
      const answers = { ...state.answers, [action.id]: action.value };
      return {
        ...state,
        answers,
        skipped: state.skipped.filter((s) => s !== action.id),
        // Answering the deciding question again means the citizen is no
        // longer relying on whatever they picked from the alternatives.
        authorityOverrideId: undefined,
      };
    }

    case "skip": {
      const answers = { ...state.answers };
      delete answers[action.id];
      return {
        ...state,
        answers,
        skipped: state.skipped.includes(action.id)
          ? state.skipped
          : [...state.skipped, action.id],
      };
    }

    case "toggleAsk":
      return {
        ...state,
        selectedAskIds: state.selectedAskIds.includes(action.id)
          ? state.selectedAskIds.filter((a) => a !== action.id)
          : [...state.selectedAskIds, action.id],
      };

    case "addCustomAsk":
      return { ...state, customAsks: [...state.customAsks, action.text] };

    case "removeCustomAsk":
      return {
        ...state,
        customAsks: state.customAsks.filter((_, i) => i !== action.index),
      };

    case "override":
      return { ...state, authorityOverrideId: action.id, editedDraft: undefined };

    case "editDraft":
      return { ...state, editedDraft: action.text };

    case "restoreDraft":
      return { ...state, editedDraft: undefined };

    case "format":
      return { ...state, format: action.format };
  }
}

export function useAssistant() {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const [ready, setReady] = useState(false);

  // sessionStorage is read after mount only, so the server and the first
  // client render agree — the same rule the main store follows.
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STATE_KEY);
      if (raw) dispatch({ type: "hydrate", state: { ...INITIAL, ...JSON.parse(raw) } });
    } catch {
      /* private mode — start fresh */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.sessionStorage.setItem(STATE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, ready]);

  const stepIndex = STEP_ORDER.indexOf(state.step);

  const goNext = useCallback(() => {
    const next = STEP_ORDER[STEP_ORDER.indexOf(state.step) + 1];
    if (next) dispatch({ type: "go", step: next });
  }, [state.step]);

  const goBack = useCallback(() => {
    const prev = STEP_ORDER[STEP_ORDER.indexOf(state.step) - 1];
    if (prev) dispatch({ type: "go", step: prev });
  }, [state.step]);

  return useMemo(
    () => ({ state, dispatch, ready, stepIndex, goNext, goBack }),
    [state, ready, stepIndex, goNext, goBack],
  );
}

export type Assistant = ReturnType<typeof useAssistant>;
