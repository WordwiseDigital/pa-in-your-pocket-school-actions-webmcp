# Demo script (target: 110–130 seconds)

Use this script for the expanded build after it has been deployed and the six-tool native Chrome acceptance run has passed. All people, notices and actions remain fictional.

## 0–15 seconds — problem and boundary

“School notices, calendar commitments and household loose ends all compete for attention. PA in Your Pocket turns them into one calm next-action queue. Everything in this demonstration is fictional, and no external system is connected.”

Show the title, the fictional-data labels and the School, Calendar, Home and Notes tabs.

## 15–35 seconds — capture without sorting

Paste a short note such as:

> Remember Ava's museum permission and follow up on the kitchen repair before Friday.

Click **Review this note**.

“The assistant reviews the capture locally first. It shows the source, likely deadline, confidence and suggested next step before changing an action.”

Show the capture review and open the suggested action.

For a genuinely new instruction, use:

> Call the plumber about the bathroom shower.

This should show **Needs confirmation** rather than reuse the kitchen repair. Choose **Home admin**, choose a fictional deadline and click **Add new Home action** to show the new bathroom task entering the queue as its own item. For “Call to make a hotel reservation”, choose **Calendar / reminder** to demonstrate that a new capture is not forced into Home.

For a simple memory, choose **Notes** instead. No deadline is required; click **Save note to Notes** and show the note in its own tab.

## 35–60 seconds — one household queue

“The same interface brings together school responses, a family calendar check-in and a household repair follow-up. I can filter by area, see what is due, and open the source and requirements.”

Show the action cards and switch to **Calendar** or **Home**.

## 60–90 seconds — actual WebMCP preparation

Ask the WebMCP-capable agent:

> Prepare the family calendar check-in for Tuesday at 18:00, but do not approve it.

“The agent can prepare the visible proposal, but the result explicitly says it was not submitted and no external write occurred.”

Show **Ready for approval**, the prepared proposal and the **Approval centre**.

If you created the plumber capture, you can instead ask the agent to list Home actions and prepare the new bathroom task. This demonstrates that a parent-created action becomes available to the same WebMCP queue without being confused with the kitchen repair.

## 90–112 seconds — human approval

Edit the proposal if needed, then press **Approve in demo**.

“Only my visible action changes the state to Approved in demo. The audit history records the agent preparation and my approval separately.”

Show the Parent audit entry and the no-external-system label.

Optional safety branch: on a Home item, choose **No, remove from my list** and press the visible button. Show that it leaves the active queue while the audit history preserves the parent decision.

## 112–130 seconds — close

Show the school tab and the original parent-only response boundary, then press **Reset demo**.

“PA in Your Pocket helps turn scattered household admin into a next step while keeping the commitment visible and human-controlled. This is a competition prototype, not a live school, calendar or home-service integration.”

## Recording checks

- Capture the verified expanded URL, not localhost.
- Show both the legacy school tools and the unified PA tool at least once.
- Keep browser zoom large enough to read the source, confidence and approval state.
- Record in a quiet room; check the first ten seconds for audible narration.
- Export at 1080p and confirm the final file is below three minutes before uploading publicly.
