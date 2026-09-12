# LinkedIn Research Workflow

Use LinkedIn to enrich professional meeting preparation with the target’s profile, recent professional posts, articles, newsletters, comments, and relevant relationship context. Support both public evidence and information the user can access through their own account. Keep collection bounded to the target and the meeting objective.

## Choose an available access route

1. Discover available connector or API tools and inspect their supported operations. Prefer a suitable authorized read-only integration; do not claim that a LinkedIn connector or a particular feed, connections, or content endpoint exists without checking.
2. Use public pages for accessible profile and content evidence.
3. If account-visible research is requested and browser tooling supports it, use a separate hidden in-app browser tab. Inspect the actual session state. Do not take over user-owned tabs or assume authentication carries across browsers. Close agent-created tabs when finished.
4. If the hidden session lacks access, explain the limitation and continue public research. Help the user supply relevant post links, copied excerpts, screenshots, or an account export they already have. Links alone may still require authentication. Ask for the smallest useful subset, not an entire account archive by default. Do not ask for passwords, cookies, session tokens, or MFA codes.

Use the user's existing authorization for read-only research; do not repeatedly ask permission for each source. Authentication or foreground browser interaction, if needed, must be handled explicitly with the user. Never bypass login barriers, access restrictions, rate limits, or anti-bot controls. If access fails, report the gap and use another authorized route rather than repeatedly retrying.

## Collect the professional evidence

Resolve identity before combining sources. Start with a bounded recent window, normally 90 days, and expand only when the meeting question needs older context. Record the actual period and surfaces reviewed; do not describe a sampled or ranked feed as complete history.

- **Profile:** inspect relevant role, organization, career history, and professional focus. Treat profile claims as self-reported and corroborate current role where practical.
- **Target-authored content:** capture direct permalinks where available, author, publication date, content type, a concise summary, and the statement that supports a meeting topic. Distinguish original posts, comments, reposts, and the target’s added commentary. A repost or reaction alone does not establish endorsement or a settled opinion.
- **User’s feed:** inspect target-related items and relevant professional context visible to the user. Distinguish authored content from recommendations, advertisements, and third-party commentary. A feed item proves it was visible in that session, not that the target or user read or endorsed it.
- **Connections:** inspect only relevant visible connections or mutual connections, or a user-supplied connection export. Record the observed connection and its source date. Do not enumerate unrelated contacts or infer hidden connections, relationship strength, influence, or willingness to introduce. Describe a possible introduction route as a question for the user to validate.
- **Supplied material:** preserve the distinction between the original content date and the date the user supplied it. Skip unrelated rows and personal contact fields in exports. Mark missing authorship, dates, context, or provenance as evidence gaps.

Do not send messages, connection requests, follow requests, reactions, comments, or other account changes as part of research. Outbound communication requires explicit user authorization.

## Convert evidence into a brief

Add each useful item to the claim-source ledger with its access class and acquisition method. Attribute statements narrowly: “In a post dated …, the subject wrote …” rather than presenting the post’s underlying claim as independently verified.

Use a short LinkedIn context section when evidence warrants it: recent professional themes, specific statements relevant to the meeting, and potential introduction routes for user validation. Cite each item. Keep facts, assessments, and questions separate. Do not infer personality, sensitive traits, private relationships, or psychological vulnerabilities from feed activity or connection patterns.

Summarize account-visible evidence with minimal necessary detail and preserve source audience restrictions. For a brief intended for wider circulation, omit restricted details or use corroborating public sources unless sharing is authorized. Do not invent a confidentiality label; explain any material distribution limitation in verification notes.

Report exactly what was available: surfaces reviewed, date range, public versus account-visible versus supplied material, and significant inaccessible content. Never claim to have reviewed the user’s feed, connections, or full target history unless the available evidence supports that statement.

## Optional: if you have Sales Navigator

This is a user-operated research path, not a requirement for the skill or evidence that Nucleus has an authenticated LinkedIn integration. Use the features actually available on your seat; labels and entitlements can vary. Official LinkedIn guidance checked September 10, 2026.

1. Open Sales Navigator in your own account. Search for the person and narrow by company or role as needed. Open the lead page and confirm at least two identity details before using it.
2. Review the lead’s recent activity. Open relevant original posts or comments and keep the author, date, permalink and a short professional takeaway. Start with the last 90 days; record gaps rather than assuming the activity view is complete.
3. Review visible shared connections for a possible introduction route. If your seat includes TeamLink (Advanced or Advanced Plus), inspect the team connection paths it provides. A displayed connection is a candidate to validate with your colleague, not proof of a close relationship or a promised introduction.
4. If you want continuing updates, save the lead and optionally its account in Sales Navigator, then review homepage alerts before the meeting. The user can do this directly; an agent should save leads or change alert settings only when asked. An alert is a discovery cue: inspect the underlying source before including a claim.
5. Supply the research assistant with a small packet: profile/lead link, meeting objective, three to five relevant dated content items, and any introduction candidate you want to validate. If links cannot be opened by the assistant, provide permitted excerpts or screenshots. Omit unrelated contacts and personal contact fields; do not supply login credentials.
6. Ask: “Use strike-package for [name, role, company] for [meeting objective]. Include these Sales Navigator observations as account-visible or user-supplied evidence. Separate the person’s statements from corroborated facts, identify one introduction route to validate, and cite each meeting angle.”

No license? Use ordinary LinkedIn pages you can access, official biographies and user-supplied material. A Sales Navigator license does not by itself give an agent API access, enable CRM sync, or establish permission to export or redistribute all visible data. Native Nucleus Contact research and an agent-assisted LinkedIn research packet are separate paths; do not claim that the Contact action imports this packet unless a supported input has been verified.

Practice: A mutual connection and a repost appear on the lead page. What can the brief say? Record the observed connection as a possible route to validate and attribute the repost precisely. Neither proves willingness to introduce, relationship strength, or endorsement of the underlying claim.

Official references:
- [How to use Sales Navigator](https://business.linkedin.com/sell/sales-navigator/how-to-use)
- [Lead page activity and connection paths](https://business.linkedin.com/sales-solutions/learning-center/resources/tip-sheets/ts036)
- [Sales Navigator plans and TeamLink](https://business.linkedin.com/sell/sales-navigator)
- [Sales Navigator alerts](https://www.linkedin.com/help/sales-navigator/answer/a105133)
