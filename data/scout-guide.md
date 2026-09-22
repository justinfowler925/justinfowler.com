# Scout

Scout is a research and data-ingestion assistant. Give him a professional research question and approved sources; he collects evidence, prepares a cited brief, and saves findings that other connected tools can retrieve.

**Preview · public documentation edition · September 22, 2026.**

[Read the public guide](https://justinfowler.com/writing/scout.html) · [Nucleus Company Tools](https://nucleus-clearspeed.vercel.app/company-tools)

This repository contains documentation and example requests. The running service, source data, credentials and deployment configuration are private. Cloning this repository does not install Scout or grant access.

## What Scout does

- Research people, organizations and professional meeting context using accessible public sources and authorized supplied material.
- Run background research jobs, including Strike Package meeting briefs, on an always-on host.
- Ingest bounded Salesforce and HubSpot records through configured integrations. Keep pagination and coverage gaps visible.
- Preserve source snapshots, observation dates, citations and stable finding IDs.
- Produce a readable Markdown brief and structured JSON for reuse.
- Serve saved sources and findings through a private MCP interface and authenticated API.

Strike Package is the meeting-research method. Scout is the running research worker and shared findings service that can use that method. [Strike Package source](https://github.com/justinfowler925/strike-package).

## Get access

Scout is currently an owner-managed private service. Ask Justin Fowler through your usual internal channel for an approved connection and a first-run check. A Nucleus account or a downloaded guide does not grant access to the service or its CRM data. Company-wide access has not been enabled by this listing.

The existing Codex connection is the verified entry point. Other MCP clients need separate configuration and an access check; cloud services cannot assume they can reach a private endpoint. There is no public chat endpoint or self-service signup. Never put service tokens in a prompt or repository.

## Your first request

In a session connected to Scout, name the subject, purpose, deadline, source boundaries and desired output. A useful first job is a small, public professional research question. Replace the brackets before sending:

> Scout, prepare a strike package for [person, role, organization] for a meeting about [objective] on [date]. Use current public sources and these approved links: [links]. Separate verified facts, assessments and open questions. Save a cited brief and JSON, return the finding ID, and do not publish to external services.

Ask for the run ID. Background submission means queued, not completed. Use that ID to request status. When a job finishes, open the saved finding and check its sources before using it.

## Ingest a bounded set of records

> Scout, ingest [named Salesforce or HubSpot object and record scope] using the configured connection. Include only [fields]. Report the records and pages read, any remaining cursor, and missing access. Save the source IDs. Do not change the CRM.

Choose a narrow scope first. A successful connection is not proof that records were ingested; one returned page is not the whole dataset. Google Sheets is deferred and is not required for Scout's current ingestion workflow. Additional services require their own adapter, authorization and live read test.

## Reuse existing findings

> Scout, search saved findings about [subject]. Show the finding IDs, research dates and source links. Open the best match, identify gaps that matter for [decision], and return its Markdown and JSON exports. Do not present an old finding as newly researched.

A finding has classified claims, source references, a research cutoff and known gaps. Raw sources can also be searched independently of the findings library. Keep the stable ID when another tool references a result.

## Review before acting

1. Confirm the correct person or organization and the research date.
2. Follow the citations. Does the quoted evidence support the claim?
3. Separate facts from assessments and hypotheses. Missing evidence is not a negative fact.
4. Check collection failures and pagination before assuming complete coverage.
5. Confirm the output includes the cited brief, JSON and finding ID.

The qualification run produced and verified a brief and JSON after corrective continuations. Unattended first-pass reliability is not established. PDF and Word rendering are separate capabilities and are not qualified by these outputs.

## Publish only to a named destination

Scout has adapters for planning a write to an existing Salesforce or HubSpot field, comparing the prior value, and reading back the result. Live publication has not been qualified for a teammate's destination. Review the exact content and record/field with the owner before authorizing a write. A saved finding is not a published CRM update. An uncertain write requires reconciliation; do not blindly retry it.

## If something stops

- No Scout tools in the session: confirm the connection and reload the client after configuration.
- Queued or running: check the existing run ID instead of submitting the same request repeatedly.
- Source denied or unavailable: use another accessible source or supply approved excerpts; record the gap.
- Claim validation fails: correct the source reference or exact excerpt before saving.
- Job fails: retain its run ID and failure details, then request a scoped continuation.
- Finding is stale: request a refresh and distinguish newly checked evidence from carried-forward material.

## Maintain this guide

The repository is private and requires an invitation. The usage guide on justinfowler.com remains public. If you have repository access, edit this README and submit a pull request. Keep capability claims tied to observed behavior. Do not add private records, account identifiers, access tokens or internal endpoint addresses. The public page and Nucleus guide packet should be updated together when these instructions change.
