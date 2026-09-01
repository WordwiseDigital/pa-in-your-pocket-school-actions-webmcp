# PA in Your Pocket: Household Actions

An experimental WebMCP competition prototype that turns school, calendar, home administration and personal notes into one calm next-action queue while leaving the final decision with the parent.

> **Demo only:** Ava, Noah, household notes, all prepared actions and every approval are fictional. Nothing is sent to a school, calendar, payment service, vendor or PA in Your Pocket production system.

Live demo: [pa-school-actions.web.app](https://pa-school-actions.web.app/)

## The idea

School messages and household loose ends often scatter deadlines across different places. This prototype turns five seeded fictional actions—and any new locally confirmed capture in the area the parent chooses—into one calm action list that works in two ways:

- A parent can use the responsive portal manually.
- A WebMCP-capable agent can list actions, inspect one and prepare its visible form or proposal.

The agent cannot approve, submit or remove an item. The parent can review and edit the prepared values, then must press the visible final button. For household items, the parent can either keep the item or remove it from the active list; the activity history records that decision without deleting the fictional audit trail.

## WebMCP tools

| Tool | Effect | Trust boundary |
| --- | --- | --- |
| `list_school_actions` | Filters actions by child, status and inclusive due date | Read-only |
| `get_school_action_details` | Opens an action and returns its requirements and fictional notice | Read-only; notice is marked untrusted |
| `prepare_school_action` | Opens and fills the visible response form | Changes only local draft state; never submits |
| `list_pa_actions` | Filters the unified school, calendar, home and notes queue | Read-only |
| `get_pa_action_details` | Opens a unified action and returns source, confidence and next step | Read-only; source is marked untrusted |
| `prepare_pa_action` | Prepares a calendar or household proposal | Changes only local draft state; never approves or writes externally |

The implementation uses the current imperative API at `document.modelContext`. It does not depend on `requestUserInteraction()`.

## Run locally

Requirements: Node.js 22 or later and npm.

```bash
npm install
npm run dev
```

Open the local URL shown by Vite. The portal remains fully usable in browsers without WebMCP; it will display **Manual demo mode**. Paste a notice or brain-dump, add a photo for local preview, or use browser voice capture where supported; the review step stays local.

For local WebMCP testing, enable `chrome://flags/#enable-webmcp-testing`, relaunch Chrome, open the app and use the Model Context Tool Inspector extension to inspect and call the registered tools.

## Verify

```bash
npm run check
```

This runs the automated tests and a production build. The human/browser acceptance cases and prompt variations are in [docs/TESTING.md](docs/TESTING.md).

## Deploy

The site is a static Vite build configured for Firebase Hosting:

```bash
npm run build
firebase deploy --only hosting --project YOUR_PROJECT_ID
```

`firebase.json` sets the origin-isolation and permissions-policy response headers required for current WebMCP browser support. Confirm them on the deployed URL; do not treat a successful CLI deploy as proof that the tools are discoverable.

The current demo is hosted as the dedicated `pa-school-actions` site in the existing `pa-in-your-pocket-app` Firebase project. The existing PA site was not changed.

## Project documentation

- [Project wiki and current status](docs/WIKI.md)
- [Architecture and state flow](docs/ARCHITECTURE.md)
- [Tool contracts and security boundaries](docs/TOOL-CONTRACTS.md)
- [Testing and eval prompts](docs/TESTING.md)
- [90–150 second demo script](docs/DEMO-SCRIPT.md)
- [Devpost draft](docs/DEVPOST-DRAFT.md)
- [Release checklist](docs/RELEASE-CHECKLIST.md)

## Status

This is a standalone competition experiment, not a released PA in Your Pocket feature. The expanded household version is deployed only to the dedicated competition Hosting site. Local, repository, deployed and submitted states are tracked separately in the release checklist.

## Licence

[MIT](LICENSE) © Annabel Koekemoer.
