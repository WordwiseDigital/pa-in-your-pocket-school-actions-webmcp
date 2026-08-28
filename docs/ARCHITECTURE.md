# Architecture

## Shape

The prototype is deliberately small: one React/Vite/TypeScript single-page app, no backend, no accounts and no real personal information.

```text
Parent or agent
      |
      v
Responsive React portal
      |
      +-- capture review (paste, photo, voice)
      +-- manual action and approval controls
      +-- document.modelContext tools
      |
      v
React reducer + localStorage
      |
      v
Fictional deterministic household state
```

`src/data.ts` is the only starting dataset. `src/state.ts` owns all transitions. `src/webmcp.ts` adapts the same state operations into the three legacy school tools plus three unified PA tools. The manual interface and the agent therefore act on one visible source of truth.

## State transitions

```text
pending --agent prepares--> prepared --parent approves--> approved
   |                           |
   +------parent edits--------+

school prepared --parent submits--> submitted

reset -----------------------------------------------> pending
```

- Agent preparation updates a draft and adds an `Agent` audit event without any external write.
- Manual editing updates the draft without erasing the preparation event.
- Only the portal's visible final handler can set `approved` or `submitted` and add a `Parent` audit event.
- Reset replaces all state with a fresh clone of the deterministic seed.

## Persistence

State is stored in the browser's local storage under a versioned key. It never leaves the browser. A malformed or incompatible stored value is discarded in favour of the seed state.

## Progressive enhancement

The portal checks for `document.modelContext.registerTool`. When unavailable, the entire manual experience still works. When available, six tools register during the React component lifecycle and unregister through an `AbortSignal` on unmount. The original school tool names remain available for compatibility.

## Deployment

Vite emits static assets to `dist/`. Firebase Hosting serves those files with a single-page fallback and the headers in `firebase.json`.
