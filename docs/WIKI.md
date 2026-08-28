# PA in Your Pocket: School Actions — project wiki

Last updated: 28 August 2026

## Purpose

This is the durable project status page for the standalone WebMCP competition prototype. It records what is live, what was verified, and where to resume without confusing a local, committed, deployed, published or submitted state.

## Current status

| State | Current evidence |
| --- | --- |
| Canonical source | `C:\Users\annab\OneDrive\Documents\Annabel AI Workspace\pa-in-your-pocket-school-actions-webmcp` |
| Local Git | Clean `main`, tracking `origin/main` |
| Firebase | Existing project `pa-in-your-pocket-app`, dedicated Hosting site `pa-school-actions` |
| Live demo | https://pa-school-actions.web.app/ |
| Native WebMCP | Verified in Chrome 151 with WebMCP flags on the live URL |
| Public GitHub repository | https://github.com/WordwiseDigital/pa-in-your-pocket-school-actions-webmcp — public `main`, README and MIT licence verified |
| Competition submission | Not submitted |
| Video | Script exists; recording and public upload remain outstanding |

## Verified live acceptance

- The page reports **Agent tools ready**.
- Exactly these three tools were discovered: `get_school_action_details`, `list_school_actions`, and `prepare_school_action`.
- `list_school_actions` for both children, pending, due through `2026-09-04` returned exactly Ava's museum trip and Noah's photo consent.
- `get_school_action_details` opened Ava's museum action and returned its requirements and fictional notice.
- `prepare_school_action` populated Ava's visible form and returned `submitted: false`.
- The visible parent button alone changed the fictional action to submitted and created the Parent audit event.
- Reset restored three pending actions and an empty audit.

## Safety boundary

All children, notices, contact details and submissions are fictional. The app has no school, calendar, payment or production PA integration. The WebMCP preparation tool changes only local demo state and never submits.

## Resume tomorrow

1. Run the documented natural-language prompt evaluations in a live WebMCP-capable agent; record results for the five-or-more-prompt checklist item.
2. Record and publicly upload the 90–150 second narrated demo from the live URL.
3. Replace the remaining Devpost video placeholder with the verified public link, then complete the submission yourself.

Do not call the project submitted until Devpost confirms it. Do not call the video public until its YouTube page is readable without account access.

## Source documents

- [Release checklist](RELEASE-CHECKLIST.md)
- [Morning handoff](HANDOFF-2026-08-28.md)
- [Testing and prompt evaluations](TESTING.md)
- [Demo script](DEMO-SCRIPT.md)
- [Devpost draft](DEVPOST-DRAFT.md)
