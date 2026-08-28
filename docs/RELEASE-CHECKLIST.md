# Release checklist

This file deliberately separates build, publication and submission evidence.

## Local build

- [x] Dependencies installed with a lockfile
- [x] Automated tests pass (20 tests on 28 August 2026)
- [x] Production build passes
- [x] Manual portal works without WebMCP at desktop and 390px mobile widths
- [x] Six local WebMCP tools pass automated contract coverage; the three-tool live run remains evidence for the previous deployment
- [x] Reset restores the deterministic seed

## Local household expansion candidate

- [x] Unified school, calendar and home action model
- [x] Local paste, photo preview and browser voice capture fallback
- [x] Capture review with source, deadline, owner, confidence and next step
- [x] Prepared-action approval centre with simulated-only approval
- [ ] Deploy the expanded build and repeat native Chrome WebMCP acceptance
- [ ] Update live prompt evidence and record a new expanded demo

## Public repository

- [x] Git repository initialised on `main`
- [x] MIT licence detected
- [x] No secrets, real personal information or private PA/client code found in the bounded source scan
- [x] Repository created under `WordwiseDigital`
- [x] Commit pushed and public repository read back

## Firebase deployment

- [x] Existing Firebase project/site selected without touching the existing PA site
- [x] Production build deployed to `pa-school-actions`
- [x] Live URL returns HTTP 200
- [x] `Origin-Agent-Cluster: ?1` present
- [x] `Permissions-Policy` permits `tools` for self
- [x] All three tools discoverable on the live URL

## Demo evidence

- [x] Five or more natural-language prompt variations pass in a live WebMCP-capable agent (five cases recorded in `docs/LIVE-PROMPT-EVIDENCE-2026-08-28.md`)
- [x] Invalid ID and invalid response tested
- [x] Repeated call tested
- [x] Cancellation tested, including registration lifecycle cancellation
- [x] Parent edit remains after agent preparation
- [x] Parent-only submission shown in audit history
- [x] Local household approval remains separate from school submission and never performs an external write

## Submission

- [ ] Annabel joined the competition on Devpost
- [ ] 90–150 second narrated video recorded from live app
- [ ] Video public, audible and under three minutes
- [ ] Devpost copy checked against the actual released state
- [ ] Live, repository and video URLs added
- [ ] Submission completed by 15:00 SAST on 3 September 2026
