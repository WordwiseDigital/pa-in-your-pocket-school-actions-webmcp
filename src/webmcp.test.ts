import { describe, expect, it, vi } from "vitest";
import { freshInitialState } from "./data";
import { registerSchoolActionTools } from "./webmcp";

describe("WebMCP tools", () => {
  it("supports Chrome executeTool calls that omit callback options", async () => {
    const tools: WebMCPTool[] = [];
    const context: WebMCPModelContext = {
      registerTool: vi.fn(async (tool) => { tools.push(tool); }),
    };
    const controller = new AbortController();

    await registerSchoolActionTools(
      context,
      { getState: freshInitialState, prepareAction: vi.fn(), selectAction: vi.fn() },
      controller.signal,
    );

    await expect(
      tools.find((tool) => tool.name === "list_school_actions")?.execute({
        child: "all",
        status: "pending",
        dueBefore: "2026-09-04",
      }),
    ).resolves.toMatchObject({ count: 2 });
  });

  it("stops registration when the component lifecycle is cancelled", async () => {
    const tools: WebMCPTool[] = [];
    const controller = new AbortController();
    const context: WebMCPModelContext = {
      registerTool: vi.fn(async (tool) => {
        tools.push(tool);
        controller.abort();
      }),
    };

    await expect(
      registerSchoolActionTools(
        context,
        { getState: freshInitialState, prepareAction: vi.fn(), selectAction: vi.fn() },
        controller.signal,
      ),
    ).rejects.toMatchObject({ name: "AbortError" });
    expect(tools.map((tool) => tool.name)).toEqual(["list_school_actions"]);
  });

  it("registers three distinct tools with the intended safety hints", async () => {
    const tools: WebMCPTool[] = [];
    const context: WebMCPModelContext = {
      registerTool: vi.fn(async (tool) => { tools.push(tool); }),
    };
    const prepareAction = vi.fn();
    const selectAction = vi.fn();
    const controller = new AbortController();

    await registerSchoolActionTools(
      context,
      { getState: freshInitialState, prepareAction, selectAction },
      controller.signal,
    );

    expect(tools.map((tool) => tool.name)).toEqual([
      "list_school_actions",
      "get_school_action_details",
      "prepare_school_action",
    ]);
    expect(tools[0].annotations?.readOnlyHint).toBe(true);
    expect(tools[1].annotations?.untrustedContentHint).toBe(true);
    expect(tools[2].annotations?.readOnlyHint).toBe(false);
  });

  it("returns two pending actions before Friday", async () => {
    const tools: WebMCPTool[] = [];
    const context: WebMCPModelContext = {
      registerTool: async (tool) => { tools.push(tool); },
    };
    const controller = new AbortController();
    await registerSchoolActionTools(
      context,
      { getState: freshInitialState, prepareAction: vi.fn(), selectAction: vi.fn() },
      controller.signal,
    );
    const result = await tools[0].execute(
      { child: "all", status: "pending", dueBefore: "2026-09-04" },
      { signal: controller.signal },
    ) as { count: number };
    expect(result.count).toBe(2);
  });

  it("prepares a form without claiming submission", async () => {
    const tools: WebMCPTool[] = [];
    const context: WebMCPModelContext = {
      registerTool: async (tool) => { tools.push(tool); },
    };
    const prepareAction = vi.fn();
    const selectAction = vi.fn();
    const controller = new AbortController();
    await registerSchoolActionTools(
      context,
      { getState: freshInitialState, prepareAction, selectAction },
      controller.signal,
    );
    const result = await tools[2].execute(
      {
        actionId: "ava-museum-trip",
        response: "yes",
        emergencyContact: "082 000 0000",
      },
      { signal: controller.signal },
    ) as { submitted: boolean; status: string };
    expect(prepareAction).toHaveBeenCalledOnce();
    expect(result).toMatchObject({ submitted: false, status: "prepared_for_parent_review" });
  });

  it("rejects unknown IDs, incompatible responses and cancellation", async () => {
    const tools: WebMCPTool[] = [];
    const context: WebMCPModelContext = {
      registerTool: async (tool) => { tools.push(tool); },
    };
    const services = { getState: freshInitialState, prepareAction: vi.fn(), selectAction: vi.fn() };
    const controller = new AbortController();
    await registerSchoolActionTools(context, services, controller.signal);

    await expect(tools[1].execute({ actionId: "missing" }, { signal: controller.signal }))
      .rejects.toThrow("Unknown school action");
    await expect(tools[2].execute(
      { actionId: "ava-summer-uniform", response: "yes" },
      { signal: controller.signal },
    )).rejects.toThrow("Use acknowledged");

    const cancelled = new AbortController();
    cancelled.abort();
    await expect(tools[0].execute({}, { signal: cancelled.signal })).rejects.toMatchObject({
      name: "AbortError",
    });
  });
});
