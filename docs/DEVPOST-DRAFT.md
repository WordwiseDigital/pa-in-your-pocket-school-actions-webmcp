# Devpost submission draft

## Project title

PA in Your Pocket: Household Actions

## Tagline

A human-controlled household assistant that turns school, calendar and home admin into one calm next step without taking away the parent's final say.

## Inspiration

Parents regularly need to turn school notices, calendar commitments and household loose ends into clear next steps. The hard part is not one form; it is finding what matters across people and messages while retaining confidence about what an assistant did.

## What it does

The prototype starts with five deterministic fictional actions across school, calendar and home administration. A parent can also turn an unmatched local capture into a distinct Home action after confirming its deadline. A WebMCP-capable agent can:

1. filter a unified action queue by area, owner, status and deadline;
2. open an action and explain its source, confidence, requirements and next step;
3. prepare the visible school response, calendar proposal or household follow-up for review.

The agent cannot perform the final approval, submission or removal. The parent can edit the draft and must press the visible final button. For Home items, the parent can choose to keep the item or remove it from the active list. A simple audit history separates “prepared by agent” from “approved/submitted/removed by parent.”

## How we built it

The app is a static React, Vite and TypeScript site. Six tools use the WebMCP imperative API through `document.modelContext`. React reducer state is persisted locally in the browser. Firebase Hosting serves the production build with origin-isolation and tools permissions headers.

## Challenges

The main design challenge was creating useful agent action without disguising the moment of commitment. We deliberately made preparation reversible and local, kept submission out of the tool surface, marked school notice content as untrusted and tested the normal portal independently of WebMCP support.

## What we learned

WebMCP is most convincing when the agent changes the same visible interface a person uses. Structured tools reduce ambiguity, but clear state transitions and human confirmation remain product-design decisions rather than API decorations.

## What's next

This competition build remains a standalone experiment. Any production exploration would need consent design, identity and access controls, real integration agreements, data minimisation, retention rules and independent privacy/security review.

## Required links

- Live demo: https://pa-school-actions.web.app/
- Public source repository: https://github.com/WordwiseDigital/pa-in-your-pocket-school-actions-webmcp
- Public YouTube video: `ADD AFTER VERIFIED UPLOAD`

## Disclosure

All names, school notices, contact details and submissions shown in the project are simulated. The app has no school, calendar, payment or PA in Your Pocket production integration.
