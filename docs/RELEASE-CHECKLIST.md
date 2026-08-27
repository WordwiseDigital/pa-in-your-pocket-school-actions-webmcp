# Release checklist

This file deliberately separates build, publication and submission evidence.

## Local build

- [x] Dependencies installed with a lockfile
- [x] Automated tests pass (13 tests on 27 August 2026)
- [x] Production build passes
- [x] Manual portal works without WebMCP at desktop and 390px mobile widths
- [ ] Three tools pass the browser acceptance run
- [x] Reset restores the deterministic seed

## Public repository

- [ ] Git repository initialised on `main`
- [ ] MIT licence detected
- [x] No secrets, real personal information or private PA/client code found in the bounded source scan
- [ ] Repository created under `WordwiseDigital`
- [ ] Commit pushed and public repository read back

## Firebase deployment

- [ ] Dedicated Firebase project/site selected
- [ ] Production build deployed
- [ ] Live URL returns HTTP 200
- [ ] `Origin-Agent-Cluster: ?1` present
- [ ] `Permissions-Policy` permits `tools` for self
- [ ] All three tools discoverable on the live URL

## Demo evidence

- [ ] Five or more natural-language prompt variations pass in a live WebMCP-capable agent (eight cases are documented)
- [x] Invalid ID and invalid response tested
- [x] Repeated call tested
- [x] Cancellation tested, including registration lifecycle cancellation
- [x] Parent edit remains after agent preparation
- [x] Parent-only submission shown in audit history

## Submission

- [ ] Annabel joined the competition on Devpost
- [ ] 90–150 second narrated video recorded from live app
- [ ] Video public, audible and under three minutes
- [ ] Devpost copy checked against the actual released state
- [ ] Live, repository and video URLs added
- [ ] Submission completed by 15:00 SAST on 3 September 2026
