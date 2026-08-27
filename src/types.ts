export type ChildName = "Ava" | "Noah";
export type ActionStatus = "pending" | "prepared" | "submitted";
export type ActionKind = "permission" | "consent" | "checklist";
export type ResponseChoice = "yes" | "no" | "acknowledged" | "";

export interface ActionDraft {
  response: ResponseChoice;
  emergencyContact: string;
  note: string;
}

export interface AuditEntry {
  id: string;
  actionId: string;
  actor: "Agent" | "Parent" | "System";
  event: "prepared" | "submitted" | "reset";
  timestamp: string;
  detail: string;
}

export interface SchoolAction {
  id: string;
  child: ChildName;
  title: string;
  kind: ActionKind;
  dueDate: string;
  summary: string;
  noticeText: string;
  requirements: string[];
  status: ActionStatus;
  draft: ActionDraft;
}

export interface AppState {
  actions: SchoolAction[];
  audit: AuditEntry[];
}

export interface ActionFilter {
  child?: ChildName | "all";
  status?: ActionStatus | "all";
  dueBefore?: string;
}
