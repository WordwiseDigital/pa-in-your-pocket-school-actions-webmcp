# Live WebMCP prompt evidence — 28 August 2026

## Scope

Live URL: https://pa-school-actions.web.app/

Browser: external Chrome 151 with WebMCP enabled.

All names, contact details, notes and actions in this evidence are fictional demo data. No school or external service received a submission.

## Passing scenarios

| # | Natural-language intent | Tool path | Observed result |
| --- | --- | --- | --- |
| 1 | What must I do for both children before Friday? | `list_school_actions` with `child=all`, `status=pending`, `dueBefore=2026-09-04` | Count `2`: `ava-museum-trip` and `noah-photo-consent` |
| 2 | What does Ava need for the museum trip? | `get_school_action_details` for `ava-museum-trip` | Returned the three requirements and fictional school notice |
| 3 | Prepare a yes response for Ava's museum trip with a fictional emergency contact, but do not submit it. | `prepare_school_action` for `ava-museum-trip` | Returned `submitted: false`; visible form prepared; exact fictional contact value intentionally omitted from this public record |
| 4 | Say no to Noah's photo consent and add a fictional family-preference note. | `prepare_school_action` for `noah-photo-consent` | Returned `submitted: false`; visible form prepared |
| 5 | Acknowledge Ava's summer uniform checklist. | `prepare_school_action` for `ava-summer-uniform` | Returned `submitted: false`; visible form prepared |

## Final visible state

- The page reported **Agent tools ready** throughout.
- Three actions showed **Ready for your review**.
- Activity history contained three `Agent` preparation entries.
- Submitted count remained `0`.
- The page was intentionally left in the prepared fictional state for review; the previously verified reset flow remains available.
