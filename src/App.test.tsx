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
});
