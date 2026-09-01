import { freshInitialState } from "./data";
import type { ActionDraft, ActionFilter, AppState, AuditEntry, PAAction } from "./types";

const STORAGE_KEY = "pa-school-actions-webmcp-v2";

export type AppAction =
  | { type: "agent-prepare"; actionId: string; draft: Partial<ActionDraft> }
  | { type: "add-action"; action: PAAction }
  | { type: "parent-update"; actionId: string; draft: Partial<ActionDraft> }
  | { type: "parent-submit"; actionId: string }
  | { type: "parent-approve"; actionId: string }
  | { type: "parent-dismiss"; actionId: string }
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

export function isDraftComplete(action: PAAction): boolean {
  if (action.actionType === "school-response") {
    if (!action.draft.response) return false;
    if (action.kind === "permission" && !action.draft.emergencyContact.trim()) return false;
    return true;
  }
  if (action.actionType === "calendar-event") {
    return Boolean(
      action.draft.proposedTitle.trim() &&
        action.draft.proposedDate.trim() &&
        action.draft.proposedTime.trim(),
    );
  }
  if (action.draft.response === "no") return true;
  return Boolean(action.draft.response && action.draft.note.trim());
}

function getCurrent(state: AppState, actionId: string): PAAction {
  const current = state.actions.find((item) => item.id === actionId);
  if (!current) throw new Error(`Unknown school action: ${actionId}`);
  return current;
}

export function reducer(state: AppState, action: AppAction): AppState {
  if (action.type === "reset") return freshInitialState();

  if (action.type === "add-action") {
    return {
      actions: [...state.actions, action.action],
      audit: [
        auditEntry(action.action.id, "Parent", "captured", "The parent confirmed a new local household action from a captured note."),
        ...state.audit,
      ],
    };
  }

  const current = getCurrent(state, action.actionId);
  if (current.status === "submitted" && action.type !== "parent-update") {
    throw new Error("Submitted actions cannot be prepared or submitted again.");
  }
  if (current.status === "approved" && action.type !== "parent-update") {
    throw new Error("Completed actions cannot be prepared or approved again.");
  }
  if (current.status === "dismissed" && action.type !== "parent-update") {
    throw new Error("Removed actions cannot be prepared or changed again.");
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
    return {
      actions: state.actions.map((item) =>
        item.id === action.actionId
          ? { ...item, status: "prepared" as const, draft: { ...item.draft, ...action.draft } }
          : item,
      ),
      audit: [
        auditEntry(
          action.actionId,
          "Agent",
          "prepared",
          "The agent prepared a visible draft for parent review. No external action was taken.",
        ),
        ...state.audit,
      ],
    };
  }

  if (action.type === "parent-dismiss") {
    return {
      actions: state.actions.map((item) =>
        item.id === action.actionId ? { ...item, status: "dismissed" as const } : item,
      ),
      audit: [
        auditEntry(
          action.actionId,
          "Parent",
          "dismissed",
          "The parent removed this item from the visible household list.",
        ),
        ...state.audit,
      ],
    };
  }

  const nextAction = { ...current };
  if (!isDraftComplete(nextAction)) {
    throw new Error(
      action.type === "parent-submit"
        ? "Complete the required response fields before submitting."
        : "Complete the required fields before approving this demo action.",
    );
  }

  const isSchoolSubmit = action.type === "parent-submit";
  return {
    actions: state.actions.map((item) =>
      item.id === action.actionId
          ? { ...item, status: isSchoolSubmit ? "submitted" : "approved" }
        : item,
    ),
    audit: [
      auditEntry(
        action.actionId,
        "Parent",
        isSchoolSubmit ? "submitted" : "approved",
        isSchoolSubmit
          ? "The parent reviewed the response and used the visible submit button."
          : "The parent approved this simulated demo action. No external calendar, reminder or vendor system was changed.",
      ),
      ...state.audit,
    ],
  };
}

export function filterActions(actions: PAAction[], filter: ActionFilter = {}): PAAction[] {
  return actions.filter((action) => {
    if (filter.child && filter.child !== "all" && action.child !== filter.child) return false;
    // An omitted area retains the original School Actions API behaviour.
    if (filter.area ? filter.area !== "all" && action.area !== filter.area : action.area !== "school") return false;
    if (!filter.status && action.status === "dismissed") return false;
    if (filter.status && filter.status !== "all" && action.status !== filter.status) return false;
    if (filter.dueBefore && action.dueDate > filter.dueBefore) return false;
    return true;
  });
}

export function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return freshInitialState();
    const parsed = JSON.parse(saved) as AppState;
    if (
      !Array.isArray(parsed.actions) ||
      !Array.isArray(parsed.audit) ||
      parsed.actions.some((action) => !action.area || !action.actionType)
    ) {
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
