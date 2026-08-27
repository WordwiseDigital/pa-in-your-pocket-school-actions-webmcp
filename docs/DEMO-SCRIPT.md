# Demo script (target: 110–130 seconds)

## 0–15 seconds — problem and boundary

“School admin arrives as scattered notices and deadlines. PA in Your Pocket: School Actions is an experimental WebMCP prototype that turns those notices into clear actions. Every child, notice and submission you see is fictional.”

Show the title, the three boundary labels and the action list.

## 15–35 seconds — human-first portal

“It works as a normal responsive portal, without an agent. A parent can see what is due, open the original notice, review the requirements and complete the visible form.”

Open Ava's museum trip and point to the requirements and form.

## 35–65 seconds — actual WebMCP discovery

Open the WebMCP-capable agent or inspector and ask:

> What must I do for both children before Friday?

“The page exposes a read-only list tool, so the agent returns exactly the two actions due by Friday—one for Ava and one for Noah.”

Briefly show the tool call and structured result.

## 65–95 seconds — prepare, never submit

Ask:

> Prepare a yes response for Ava's museum trip using 082 000 0000, but do not submit it.

“The prepare tool opens and fills the same form the parent sees. It records that an agent prepared the draft, but it explicitly returns submitted false.”

Show the filled form, prepared status and Agent audit entry.

## 95–115 seconds — human control

Edit the note manually, then press **Review complete — submit**.

“My manual edit is preserved. Only my visible click changes the status to submitted, and the audit history records that separately as a parent action.”

Show the Parent entry.

## 115–130 seconds — reset and close

Press **Reset demo**.

“Reset restores the deterministic fictional starting state. This is a focused demonstration of useful agent assistance with a clear human boundary—not a production school integration.”

End on the title and repository/live URL card added during editing.

## Recording checks

- Capture the deployed URL, not localhost.
- Show the actual tool name/result at least once.
- Keep browser zoom large enough to read.
- Record in a quiet room; check the first ten seconds for audible narration.
- Export at 1080p and confirm the final file is below three minutes before uploading publicly.

