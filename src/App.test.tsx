import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("manual portal", () => {
  it("works without WebMCP and only submits after the parent completes the visible form", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText("Manual demo mode")).toBeInTheDocument();
    expect(screen.getByText("Fictional children")).toBeInTheDocument();

    const submit = screen.getByRole("button", { name: "Review complete — submit" });
    expect(submit).toBeDisabled();

    await user.click(screen.getByRole("radio", { name: "Yes, may attend" }));
    await user.type(screen.getByLabelText(/Emergency contact number/), "082 000 0000");
    await user.type(screen.getByLabelText(/Note to the school/), "Please use the side entrance.");

    expect(submit).toBeEnabled();
    await user.click(submit);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Submitted in this fictional demo. No information was sent anywhere.",
    );
    expect(
      screen.getByText("The parent reviewed the response and used the visible submit button."),
    ).toBeInTheDocument();
    expect(screen.getByText("Parent")).toBeInTheDocument();
  });

  it("reset restores the deterministic starting state", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("radio", { name: "Yes, may attend" }));
    fireEvent.change(screen.getByLabelText(/Emergency contact number/), {
      target: { value: "082 000 0000" },
    });
    await user.click(screen.getByRole("button", { name: "Reset demo" }));

    expect(screen.getByRole("radio", { name: "Yes, may attend" })).not.toBeChecked();
    expect(screen.getByLabelText(/Emergency contact number/)).toHaveValue("");
    expect(screen.getByText(/No activity yet/)).toBeInTheDocument();
  });

  it("reviews a pasted note, filters home actions and approves a simulated follow-up", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("tab", { name: "Home" }));
    await user.click(screen.getByRole("button", { name: /Follow up on kitchen repair quote/ }));
    await user.type(screen.getByLabelText(/Follow-up note/), "Ask for the revised repair timeline.");
    expect(screen.getByRole("button", { name: "Approve in demo" })).toBeEnabled();
    await user.click(screen.getByRole("button", { name: "Approve in demo" }));
    expect(screen.getByRole("status")).toHaveTextContent("Approved in this fictional demo");
    expect(screen.getByRole("button", { name: "Approved in demo" })).toBeDisabled();

    await user.type(screen.getByLabelText(/Paste a notice/), "Remember Ava's museum permission before Friday.");
    await user.click(screen.getByRole("button", { name: "Review this note" }));
    expect(screen.getByText("Review before action")).toBeInTheDocument();
    expect(screen.getAllByText(/Suggested next step/).length).toBeGreaterThan(0);
    await user.click(screen.getByRole("button", { name: /Open suggested action/ }));
    expect(screen.getByRole("heading", { name: "Museum trip permission" })).toBeInTheDocument();
  });

  it("provides a visible voice fallback when browser speech recognition is unavailable", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Use voice" }));
    expect(screen.getByRole("status")).toHaveTextContent("Voice capture is not available");
  });

  it("does not assign an unrelated capture to the wrong action", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/Paste a notice/), "Call the plumber about the shower.");
    await user.click(screen.getByRole("button", { name: "Review this note" }));

    expect(screen.getAllByText("Needs confirmation").length).toBeGreaterThan(0);
    expect(screen.getByText("Choose which household action this capture belongs to.")).toBeInTheDocument();
    expect(screen.getByText("low")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Choose an area first" })).toBeDisabled();

    await user.click(screen.getByRole("tab", { name: "Home" }));
    expect(screen.getByRole("heading", { level: 2, name: "Follow up on kitchen repair quote" })).toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: "Home admin" }));
    fireEvent.change(screen.getByLabelText("Deadline Required"), { target: { value: "2026-09-04" } });
    await user.click(screen.getByRole("button", { name: "Add new Home action" }));
    expect(screen.getByRole("button", { name: /Open suggested action/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Call the plumber about the shower" })).toBeInTheDocument();
  });

  it("lets a parent remove a Home action without deleting its audit history", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("tab", { name: "Home" }));
    await user.click(screen.getByRole("button", { name: /Follow up on kitchen repair quote/ }));
    await user.click(screen.getByRole("radio", { name: "No, remove from my list" }));

    const remove = screen.getByRole("button", { name: "Remove from my list" });
    expect(remove).toBeEnabled();
    await user.click(remove);

    expect(screen.getByRole("status")).toHaveTextContent("Removed from this fictional list");
    expect(screen.queryByRole("button", { name: /Follow up on kitchen repair quote/ })).not.toBeInTheDocument();
    expect(screen.getByText("The parent removed this item from the visible household list.")).toBeInTheDocument();
  });

  it("lets an unmatched note become a Calendar reminder instead of forcing Home", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/Paste a notice/), "Call to make a hotel reservation.");
    await user.click(screen.getByRole("button", { name: "Review this note" }));
    expect(screen.getByRole("button", { name: "Choose an area first" })).toBeDisabled();

    await user.click(screen.getByRole("radio", { name: "Calendar / reminder" }));
    fireEvent.change(screen.getByLabelText("Deadline Required"), { target: { value: "2026-09-06" } });
    await user.click(screen.getByRole("button", { name: "Add new Calendar action" }));

    expect(screen.getByRole("tab", { name: "Calendar" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("heading", { level: 2, name: "Call to make a hotel reservation" })).toBeInTheDocument();
    expect(screen.getAllByText("Calendar", { selector: ".area-tag" }).length).toBeGreaterThan(0);
  });

  it("keeps multiple voice segments together until listening stops", async () => {
    const user = userEvent.setup();
    let recognition: FakeRecognition | undefined;
    class FakeRecognition {
      onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>>; resultIndex?: number }) => void) | null = null;
      onend: (() => void) | null = null;
      start = () => undefined;
      stop = () => this.onend?.();
      constructor() { recognition = this; }
    }
    const original = (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition;
    Object.defineProperty(window, "SpeechRecognition", { configurable: true, value: FakeRecognition });
    try {
      render(<App />);
      await user.click(screen.getByRole("button", { name: "Use voice" }));
      recognition?.onresult?.({ resultIndex: 0, results: [[{ transcript: "Call to make" }]] });
      recognition?.onresult?.({ resultIndex: 0, results: [[{ transcript: "a hotel reservation" }]] });
      expect(screen.getByRole("button", { name: "Stop listening" })).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Stop listening" }));
      expect(screen.getByLabelText(/Paste a notice/)).toHaveValue("Call to make a hotel reservation");
      expect(screen.getAllByText("Call to make a hotel reservation").length).toBeGreaterThan(0);
    } finally {
      Object.defineProperty(window, "SpeechRecognition", { configurable: true, value: original });
    }
  });
});
