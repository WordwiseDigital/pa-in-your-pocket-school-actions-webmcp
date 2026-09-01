export type ChildName = "Ava" | "Noah";
export type ActionOwner = ChildName | "Household";
export type ActionArea = "school" | "calendar" | "home";
export type ActionStatus = "pending" | "prepared" | "approved" | "submitted";
export type ActionKind =
  | "permission"
  | "consent"
  | "checklist"
  | "appointment"
  | "reminder"
  | "task";
export type ActionType = "school-response" | "calendar-event" | "household-task";
export type ResponseChoice = "yes" | "no" | "acknowledged" | "confirm" | "";
export type Confidence = "high" | "medium" | "low";

export interface ActionDraft {
  response: ResponseChoice;
  emergencyContact: string;
  note: string;
  proposedTitle: string;
  proposedDate: string;
  proposedTime: string;
}

export interface AuditEntry {
  id: string;
  actionId: string;
  actor: "Agent" | "Parent" | "System";
  event: "captured" | "prepared" | "approved" | "submitted" | "reset";
  timestamp: string;
  detail: string;
}

export interface PAAction {
  id: string;
  area: ActionArea;
  child: ActionOwner;
  title: string;
  kind: ActionKind;
  actionType: ActionType;
  dueDate: string;
  summary: string;
  noticeText: string;
  sourceLabel: string;
  requirements: string[];
  suggestedNextStep: string;
  confidence: Confidence;
  status: ActionStatus;
  draft: ActionDraft;
}

/** Backwards-compatible name retained for the original School Actions API. */
export type SchoolAction = PAAction;

export interface AppState {
  actions: PAAction[];
  audit: AuditEntry[];
}

export interface ActionFilter {
  child?: ActionOwner | "all";
  area?: ActionArea | "all";
  status?: ActionStatus | "all";
  dueBefore?: string;
}

export interface CaptureReview {
  id: string;
  kind: "paste" | "photo" | "voice";
  label: string;
  text: string;
  actionIds: string[];
  deadline: string;
  area: ActionArea | "unknown";
  confidence: Confidence;
  nextStep: string;
  previewUrl?: string;
}
