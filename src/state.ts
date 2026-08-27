import { freshInitialState } from "./data";
import type {
  ActionDraft,
  ActionFilter,
  AppState,
  AuditEntry,
  SchoolAction,
} from "./types";

const STORAGE_KEY = "pa-school-actions-webmcp-v1";

export type AppAction =
  | { type: "agent-prepare"; actionId: string; draft: Partial<ActionDraft> }
  | { type: "parent-update"; actionId: string; draft: Partial<ActionDraft> }
  | { type: "parent-submit"; actionId: string }
  | { type: "reset" };

function auditEntry(
  actionId: string,
  actor: AuditEntry["actor"],
  event: AuditEntry["event"],
  detail: string,
): AuditEntry {
  return {
    id: `${actionId}-${event}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    actionId,
    actor,
    event,
    timestamp: new Date().toISOString(),
    detail,
  };
}

export function isDraftComplete(action: SchoolAction): boolean {
  if (!action.draft.response) return false;
  if (action.kind === "permission" && !action.draft.emergencyContact.trim()) {
    return false;
  }
  return true;
}

export function reducer(state: AppState, action: AppAction): AppState {
  if (action.type === "reset") return freshInitialState();

  const current = state.actions.find((item) => item.id === action.actionId);
  if (!current) throw new Error(`Unknown school action: ${action.actionId}`);
  if (current.status === "submitted" && action.type !== "parent-update") {
    throw new Error("Submitted actions cannot be prepared or submitted again.");
  }

  if (action.type === "parent-update") {
    return {
      ...state,
      actions: state.actions.map((item) =>
        item.id === action.actionId
          ? { ...item, draft: { ...item.draft, ...action.draft } }
          : item,
      ),
    };
  }

  if (action.type === "agent-prepare") {
    const nextActions = state.actions.map((item) =>
      item.id === action.actionId
        ? {
            ...item,
            status: "prepared" as const,
            draft: { ...item.draft, ...action.draft },
          }
        : item,
    );
    return {
      actions: nextActions,
      audit: [
        auditEntry(
          action.actionId,
          "Agent",
          "prepared",
          "The agent prepared the visible response for parent review.",
        ),
        ...state.audit,
      ],
    };
  }

  const nextAction = { ...current };
  if (!isDraftComplete(nextAction)) {
    throw new Error("Complete the required response fields before submitting.");
  }

  return {
    actions: state.actions.map((item) =>
      item.id === action.actionId ? { ...item, status: "submitted" } : item,
    ),
    audit: [
      auditEntry(
        action.actionId,
        "Parent",
        "submitted",
        "The parent reviewed the response and used the visible submit button.",
      ),
      ...state.audit,
    ],
  };
}

export function filterActions(
  actions: SchoolAction[],
  filter: ActionFilter = {},
): SchoolAction[] {
  return actions.filter((action) => {
    if (filter.child && filter.child !== "all" && action.child !== filter.child) {
      return false;
    }
    if (filter.status && filter.status !== "all" && action.status !== filter.status) {
      return false;
    }
    if (filter.dueBefore && action.dueDate > filter.dueBefore) return false;
    return true;
  });
}

export function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return freshInitialState();
    const parsed = JSON.parse(saved) as AppState;
    if (!Array.isArray(parsed.actions) || !Array.isArray(parsed.audit)) {
      return freshInitialState();
    }
    return parsed;
  } catch {
    return freshInitialState();
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
