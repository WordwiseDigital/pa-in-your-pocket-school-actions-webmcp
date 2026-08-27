# PA in Your Pocket: School Actions

An experimental WebMCP competition prototype that shows how a parent-facing assistant can identify school admin tasks and prepare a response while leaving the final submission with the parent.

> **Demo only:** Ava, Noah, their school notices, all form responses and every submission are fictional. Nothing is sent to a school, calendar, payment service or PA in Your Pocket production system.

## The idea

School messages often scatter deadlines and actions across notices. This prototype turns three fictional notices into a calm action list that works in two ways:

- A parent can use the responsive portal manually.
- A WebMCP-capable agent can list actions, inspect one and prepare its visible form.

The agent cannot submit. The parent can review and edit the prepared values, then must press the visible final button. The activity history records agent preparation and parent submission as separate events.

## WebMCP tools

| Tool | Effect | Trust boundary |
| --- | --- | --- |
| `list_school_actions` | Filters actions by child, status and inclusive due date | Read-only |
| `get_school_action_details` | Opens an action and returns its requirements and fictional notice | Read-only; notice is marked untrusted |
| `prepare_school_action` | Opens and fills the visible response form | Changes only local draft state; never submits |

The implementation uses the current imperative API at `document.modelContext`. It does not depend on `requestUserInteraction()`.

## Run locally

Requirements: Node.js 22 or later and npm.

```bash
npm install
npm run dev
```

Open the local URL shown by Vite. The portal remains fully usable in browsers without WebMCP; it will display **Manual demo mode**.

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

## Project documentation

- [Architecture and state flow](docs/ARCHITECTURE.md)
- [Tool contracts and security boundaries](docs/TOOL-CONTRACTS.md)
- [Testing and eval prompts](docs/TESTING.md)
- [90–150 second demo script](docs/DEMO-SCRIPT.md)
- [Devpost draft](docs/DEVPOST-DRAFT.md)
- [Release checklist](docs/RELEASE-CHECKLIST.md)

## Status

This is a standalone competition experiment, not a released PA in Your Pocket feature. Local, repository, deployed and submitted states are tracked separately in the release checklist.

## Licence

[MIT](LICENSE) © Annabel Koekemoer.

