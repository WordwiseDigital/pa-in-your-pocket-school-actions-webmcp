import type { AppState } from "./types";

export const DEMO_WEEK_END = "2026-09-04";

export const initialState: AppState = {
  actions: [
    {
      id: "ava-museum-trip",
      child: "Ava",
      title: "Museum trip permission",
      kind: "permission",
      dueDate: "2026-09-04",
      summary: "Confirm attendance and provide an emergency contact.",
      noticeText:
        "Year 6 will visit the City Science Museum on 10 September. Please confirm attendance by Friday and ensure learners bring a packed lunch.",
      requirements: [
        "Choose whether Ava may attend",
        "Provide an emergency contact number",
        "Add an optional note for the teacher",
      ],
      status: "pending",
      draft: { response: "", emergencyContact: "", note: "" },
    },
    {
      id: "noah-photo-consent",
      child: "Noah",
      title: "Athletics photo consent",
      kind: "consent",
      dueDate: "2026-09-03",
      summary: "Choose whether school event photographs may include Noah.",
      noticeText:
        "The inter-house athletics day will be photographed for the private parent portal. Please record your consent choice before Thursday.",
      requirements: [
        "Choose yes or no for photographs",
        "Add an optional restriction or note",
      ],
      status: "pending",
      draft: { response: "", emergencyContact: "", note: "" },
    },
    {
      id: "ava-summer-uniform",
      child: "Ava",
      title: "Summer uniform checklist",
      kind: "checklist",
      dueDate: "2026-09-07",
      summary: "Acknowledge the items needed for the summer uniform changeover.",
      noticeText:
        "Summer uniform begins next Monday. Learners need a hat, labelled water bottle and the standard summer uniform.",
      requirements: [
        "Review the required items",
        "Acknowledge the checklist",
      ],
      status: "pending",
      draft: { response: "", emergencyContact: "", note: "" },
    },
  ],
  audit: [],
};

export function freshInitialState(): AppState {
  return structuredClone(initialState);
}
