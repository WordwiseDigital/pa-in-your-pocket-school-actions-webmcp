# PA in Your Pocket: Household Actions — project wiki

Last updated: 1 September 2026

## Purpose

This is the durable project status page for the standalone WebMCP competition prototype. It records what is live, what was verified, and where to resume without confusing a local, committed, deployed, published or submitted state.

## Current status

| State | Current evidence |
| --- | --- |
| Canonical source | `C:\Users\annab\OneDrive\Documents\Annabel AI Workspace\pa-in-your-pocket-school-actions-webmcp` |
| Local Git | Clean `main`, tracking `origin/main` |
| Firebase | Existing project `pa-in-your-pocket-app`, dedicated Hosting site `pa-school-actions` |
| Live demo | https://pa-school-actions.web.app/ |
| Native WebMCP | Verified in Chrome 151 with six tools on the live URL |
| Public GitHub repository | https://github.com/WordwiseDigital/pa-in-your-pocket-school-actions-webmcp — public `main`, README and MIT licence verified |
| Competition submission | Not submitted |
| Video | Script exists; recording and public upload remain outstanding |

## Local expansion candidate

The `0.2.0` expansion is deployed and browser-accepted on the dedicated live URL. It expands the public prototype into one fictional household queue covering School, Calendar, Home and Notes. It adds paste/photo/voice capture review, confidence and next-step facts, a no-deadline Notes area, simulated calendar/home approvals, an approval centre, and three unified PA WebMCP tools. Follow-up revisions ensure unmatched captures are not assigned to an unrelated action: the parent chooses the area and deadline when needed, then adds a distinct local action. A Home or Notes item can be kept or removed while retaining the audit decision. Completed approved or submitted items now leave the active **Next actions** queue while remaining in audit history. Detailed base acceptance evidence is in [LIVE-PROMPT-EVIDENCE-2026-08-28.md](LIVE-PROMPT-EVIDENCE-2026-08-28.md).

## Verified live acceptance

- The page reports **Agent tools ready**.
- Exactly these three tools were discovered: `get_school_action_details`, `list_school_actions`, and `prepare_school_action`.
- `list_school_actions` for both children, pending, due through `2026-09-04` returned exactly Ava's museum trip and Noah's photo consent.
- `get_school_action_details` opened Ava's museum action and returned its requirements and fictional notice.
- `prepare_school_action` populated Ava's visible form and returned `submitted: false`.
- The visible parent button alone changed the fictional action to submitted and created the Parent audit event.
- Reset restored three pending actions and an empty audit.
- Five natural-language prompt scenarios passed live; detailed results are in [LIVE-PROMPT-EVIDENCE-2026-08-28.md](LIVE-PROMPT-EVIDENCE-2026-08-28.md).
- Expanded revision `fa64a92` includes the live UI fix that makes **Open suggested action** select and scroll to the matched action; the six-tool HTTP/header and native Chrome acceptance remains valid.
- The expanded live tab was left with three prepared fictional drafts, zero approvals and zero submissions.

## Local candidate checks

- `npm test`: 26 tests passed locally.
- `npm run build`: production build passed locally.
- The latest capture and voice revision is pushed to the public `main` branch and deployed to the dedicated Hosting site.
- Native Chrome discovery and prepare-only acceptance passed for the six-tool expanded build.

## Safety boundary

All children, notices, contact details and submissions are fictional. The app has no school, calendar, payment or production PA integration. The WebMCP preparation tool changes only local demo state and never submits.

## Resume tomorrow

1. Record and publicly upload the 90–150 second narrated demo from the verified expanded URL.
2. Replace the remaining Devpost video placeholder with the verified public link.
3. Complete the Devpost submission yourself before the stated deadline.

Do not call the project submitted until Devpost confirms it. Do not call the video public until its YouTube page is readable without account access.

## Source documents

- [Release checklist](RELEASE-CHECKLIST.md)
- [Morning handoff](HANDOFF-2026-08-28.md)
- [Testing and prompt evaluations](TESTING.md)
- [Live prompt evidence](LIVE-PROMPT-EVIDENCE-2026-08-28.md)
- [Demo script](DEMO-SCRIPT.md)
- [Devpost draft](DEVPOST-DRAFT.md)
