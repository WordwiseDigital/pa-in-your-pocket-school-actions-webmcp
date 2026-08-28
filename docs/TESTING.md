# Testing and evals

## Automated checks

Run:

```bash
npm run check
```

The suite covers deadline filtering, unified area/owner filtering, agent preparation without submission or approval, preservation of parent edits, parent-only school submission, simulated household approval, local capture review, voice fallback, invalid/repeated calls, deterministic reset and cancellation. The current suite is 20 tests.

## Natural-language prompt evals

Run each prompt in a WebMCP-enabled Chrome session against the deployed URL. Reset between scenarios unless the prompt says otherwise.

| # | Prompt | Expected tool path and result |
| --- | --- | --- |
| 1 | What must I do for both children before Friday? | Call `list_school_actions` for both children, pending, due through `2026-09-04`; return Ava's museum trip and Noah's photo consent only. |
| 2 | What does Ava need for the museum trip? | List or call details for `ava-museum-trip`; report its three requirements and identify the notice as fictional/untrusted source text. |
| 3 | Prepare a yes response for Ava's museum trip using 082 000 0000, but do not submit it. | Call details if needed, then `prepare_school_action`; the visible form is filled, status is ready for review and result says `submitted: false`. |
| 4 | Say no to Noah's photo consent and note “family preference”. | Prepare `noah-photo-consent` with response `no`; do not submit. |
| 5 | Acknowledge Ava's summer uniform checklist. | Prepare `ava-summer-uniform` with `acknowledged`; do not submit. |
| 6 | Prepare action `unknown-action`. | Return a clear unknown-action error and make no state change. |
| 7 | Acknowledge the museum permission form. | Reject the incompatible response; permission accepts only `yes` or `no`. |
| 8 | Prepare Ava's museum form twice. | Repeated preparation remains non-submitting; the latest draft is visible and the audit history clearly records preparations. |
| 9 | What needs my attention before Friday? | Call `list_pa_actions` with the unified queue and report school, calendar and home items without claiming completion. |
| 10 | Prepare the family calendar check-in. | Call `prepare_pa_action`; show the visible proposal and return `submitted: false`, `externalWrite: false`. |
| 11 | Add a household note from this photo or voice capture. | Keep the capture local, show preview/transcript and confidence, and require review before preparing an action. |

## Manual acceptance run

1. Open the deployed URL without an agent and complete each form manually.
2. Reset. Confirm all three actions are pending and the audit is empty.
3. Enable the WebMCP testing flag and inspect the page. Confirm the three legacy school tools and three unified PA tools are registered.
4. Run prompt 1 and compare the two IDs and dates with the interface.
5. Run prompt 3. Confirm the form is visible and prepared, but the status is not submitted.
6. Manually change the optional note. Move to another action and back; confirm the edit remains.
7. Press the visible school submit button. Confirm the status changes only now and audit history shows both `Agent` and `Parent` entries.
8. Cancel a tool call in the inspector. Confirm it returns/records cancellation without a state change.
9. Reset again and confirm the original seed returns.
10. Inspect the live response headers for `Origin-Agent-Cluster: ?1` and a `Permissions-Policy` allowing `tools` for self.
11. In the local demo, review a pasted note, choose Home, add a required follow-up note and approve it. Confirm the status is **Approved in demo**, not submitted.

## Release evidence to capture

- Production build and test output
- Live URL with HTTP 200
- Live response headers
- Inspector screenshot showing the three registered tools
- Results for all prompt evals
- Final manual-submit audit history
- Public repository, licence detection and README rendering
- Public video page, duration and audible narration
