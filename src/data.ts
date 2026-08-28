import type { ActionDraft, AppState } from "./types";

export const DEMO_WEEK_END = "2026-09-04";

const emptyDraft: ActionDraft = {
  response: "",
  emergencyContact: "",
  note: "",
  proposedTitle: "",
  proposedDate: "",
  proposedTime: "",
};

export const initialState: AppState = {
  actions: [
    {
      id: "ava-museum-trip",
      area: "school",
      child: "Ava",
      title: "Museum trip permission",
      kind: "permission",
      actionType: "school-response",
      dueDate: "2026-09-04",
      summary: "Confirm attendance and provide an emergency contact.",
      noticeText:
        "Year 6 will visit the City Science Museum on 10 September. Please confirm attendance by Friday and ensure learners bring a packed lunch.",
      sourceLabel: "Fictional school notice",
      requirements: [
        "Choose whether Ava may attend",
        "Provide an emergency contact number",
        "Add an optional note for the teacher",
      ],
      suggestedNextStep: "Confirm Ava's attendance and add the emergency contact.",
      confidence: "high",
      status: "pending",
      draft: { ...emptyDraft },
    },
    {
      id: "noah-photo-consent",
      area: "school",
      child: "Noah",
      title: "Athletics photo consent",
      kind: "consent",
      actionType: "school-response",
      dueDate: "2026-09-03",
      summary: "Choose whether school event photographs may include Noah.",
      noticeText:
        "The inter-house athletics day will be photographed for the private parent portal. Please record your consent choice before Thursday.",
      sourceLabel: "Fictional school notice",
      requirements: [
        "Choose yes or no for photographs",
        "Add an optional restriction or note",
      ],
      suggestedNextStep: "Choose Noah's photo preference and add any restriction.",
      confidence: "high",
      status: "pending",
      draft: { ...emptyDraft },
    },
    {
      id: "ava-summer-uniform",
      area: "school",
      child: "Ava",
      title: "Summer uniform checklist",
      kind: "checklist",
      actionType: "school-response",
      dueDate: "2026-09-07",
      summary: "Acknowledge the items needed for the summer uniform changeover.",
      noticeText:
        "Summer uniform begins next Monday. Learners need a hat, labelled water bottle and the standard summer uniform.",
      sourceLabel: "Fictional school notice",
      requirements: [
        "Review the required items",
        "Acknowledge the checklist",
      ],
      suggestedNextStep: "Check the hat and labelled water bottle before Monday.",
      confidence: "high",
      status: "pending",
      draft: { ...emptyDraft },
    },
    {
      id: "household-calendar-check",
      area: "calendar",
      child: "Household",
      title: "Family calendar check-in",
      kind: "appointment",
      actionType: "calendar-event",
      dueDate: "2026-09-01",
      summary: "Make space for a short family planning check-in this week.",
      noticeText:
        "A weekly family planning check-in helps keep school, appointments and household tasks visible in one place.",
      sourceLabel: "Fictional household note",
      requirements: [
        "Choose a day and time",
        "Confirm the event title",
        "Review the reminder before approval",
      ],
      suggestedNextStep: "Prepare a 20-minute calendar event for family planning.",
      confidence: "medium",
      status: "pending",
      draft: {
        ...emptyDraft,
        proposedTitle: "Family planning check-in",
        proposedDate: "2026-09-01",
        proposedTime: "18:00",
      },
    },
    {
      id: "home-repair-follow-up",
      area: "home",
      child: "Household",
      title: "Follow up on kitchen repair quote",
      kind: "reminder",
      actionType: "household-task",
      dueDate: "2026-09-02",
      summary: "Keep a household repair follow-up from becoming a loose end.",
      noticeText:
        "The kitchen repair quote needs a follow-up note this week. This demo does not contact a vendor or approve spending.",
      sourceLabel: "Fictional household task",
      requirements: [
        "Confirm the follow-up task",
        "Add the question you want answered",
      ],
      suggestedNextStep: "Prepare a reminder to ask for the revised repair timeline.",
      confidence: "medium",
      status: "pending",
      draft: { ...emptyDraft, response: "acknowledged" },
    },
  ],
  audit: [],
};

export function freshInitialState(): AppState {
  return structuredClone(initialState);
}
