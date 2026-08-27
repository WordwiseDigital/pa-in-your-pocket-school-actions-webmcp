import { describe, expect, it, vi } from "vitest";
import { DEMO_WEEK_END, freshInitialState } from "./data";
import { filterActions, isDraftComplete, reducer } from "./state";

describe("school action state", () => {
  it("finds the two actions due by the end of the demo week", () => {
    const result = filterActions(freshInitialState().actions, {
      status: "pending",
      child: "all",
      dueBefore: DEMO_WEEK_END,
    });
    expect(result.map((action) => action.id)).toEqual([
      "ava-museum-trip",
      "noah-photo-consent",
    ]);
  });

  it("lets the agent prepare but never submit an action", () => {
    vi.spyOn(Date, "now").mockReturnValue(1);
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const state = reducer(freshInitialState(), {
      type: "agent-prepare",
      actionId: "ava-museum-trip",
      draft: { response: "yes", emergencyContact: "082 000 0000" },
    });
    const prepared = state.actions.find((action) => action.id === "ava-museum-trip")!;
    expect(prepared.status).toBe("prepared");
    expect(prepared.draft.response).toBe("yes");
    expect(state.audit[0]).toMatchObject({ actor: "Agent", event: "prepared" });
  });

  it("preserves parent edits made after agent preparation", () => {
    let state = reducer(freshInitialState(), {
      type: "agent-prepare",
      actionId: "ava-museum-trip",
      draft: { response: "yes", emergencyContact: "082 000 0000" },
    });
    state = reducer(state, {
      type: "parent-update",
      actionId: "ava-museum-trip",
      draft: { note: "Please seat Ava near the front." },
    });
    expect(state.actions[0].draft.note).toBe("Please seat Ava near the front.");
  });

  it("allows only the parent submit action to set submitted", () => {
    let state = reducer(freshInitialState(), {
      type: "parent-update",
      actionId: "ava-museum-trip",
      draft: { response: "yes", emergencyContact: "082 000 0000" },
    });
    expect(isDraftComplete(state.actions[0])).toBe(true);
    state = reducer(state, { type: "parent-submit", actionId: "ava-museum-trip" });
    expect(state.actions[0].status).toBe("submitted");
    expect(state.audit[0]).toMatchObject({ actor: "Parent", event: "submitted" });
  });

  it("rejects incomplete and repeated submissions", () => {
    expect(() =>
      reducer(freshInitialState(), { type: "parent-submit", actionId: "ava-museum-trip" }),
    ).toThrow("Complete the required response fields");

    let state = reducer(freshInitialState(), {
      type: "parent-update",
      actionId: "noah-photo-consent",
      draft: { response: "no" },
    });
    state = reducer(state, { type: "parent-submit", actionId: "noah-photo-consent" });
    expect(() =>
      reducer(state, { type: "parent-submit", actionId: "noah-photo-consent" }),
    ).toThrow("Submitted actions cannot be prepared or submitted again");
  });

  it("restores deterministic seed state", () => {
    const changed = reducer(freshInitialState(), {
      type: "parent-update",
      actionId: "noah-photo-consent",
      draft: { response: "yes" },
    });
    const reset = reducer(changed, { type: "reset" });
    expect(reset).toEqual(freshInitialState());
  });
});
