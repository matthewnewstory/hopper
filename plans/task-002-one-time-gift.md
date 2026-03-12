# Plan: One-Time Gift Field Mappings

**Task ID:** TASK-002
**Status:** planned
**Last updated:** 2026-03-12

---

## Summary

When a one-time gift is logged via Funraise, several Salesforce Opportunity fields are not being populated: Donation Pipeline, Solicit Team, fundraiser ID, Funraise Donation Status, Donation Form Name, Funraise Payment Method, and Funraise Checkbox. This plan adds those ~7 field mappings to the Salesforce Opportunity creation/update flow so that one-time gifts are correctly reflected in Salesforce.

---

## Files to Touch

- `[app]/salesforce/opportunities.ts` (or equivalent — e.g. `lib/salesforce.ts`, `services/salesforce.ts`, `integrations/salesforce/opportunity.ts`) — modify: add the 7 new field mappings to the Opportunity upsert payload for one-time gifts
- `[app]/funraise/webhook.ts` (or equivalent — e.g. `handlers/funraise.ts`, `routes/webhooks/funraise.ts`) — modify (if needed): ensure the 7 Funraise source fields are extracted and passed through to the Salesforce mapper
- `[app]/types/funraise.ts` (or equivalent) — modify (if needed): add any missing fields to the Funraise donation type definition
- `[app]/types/salesforce.ts` (or equivalent) — modify (if needed): add any missing fields to the Salesforce Opportunity type definition

> **Note:** Exact file paths must be confirmed against the actual app repo during execution. Search for where `Opportunity` objects are constructed and where Funraise webhook payloads are parsed.

---

## Approach

1. **Find the Salesforce Opportunity builder.** Search the app codebase for where Salesforce Opportunity records are created or updated (look for `Opportunity`, `sf.create`, `jsforce`, `SalesforceService`, or similar). Identify the function that constructs the field payload.

2. **Find the Funraise data source.** Locate where Funraise donation webhook payloads are received and parsed. Identify which fields are currently extracted from the incoming payload.

3. **Identify the one-time gift code path.** Determine how one-time gifts are distinguished from recurring gifts in the codebase (e.g. a `donation_type`, `frequency`, or `is_recurring` flag). Confirm the branching point.

4. **Add the 7 field mappings.** In the Opportunity builder function, for the one-time gift code path, add the following field mappings (using the confirmed Salesforce API field names — see Open Questions):

   | Salesforce Field (label) | Value / Source |
   |---|---|
   | Donation Pipeline | Hardcoded: `"One-time Donor (operations)"` |
   | Solicit Team | Hardcoded: `"Donation"` |
   | Fundraiser ID | From Funraise payload: `fundraiser_id` (or equivalent) |
   | Funraise Donation Status | From Funraise payload: `donation_status` (or equivalent) |
   | Donation Form Name | From Funraise payload: `form_name` (or `donation_form_name`, etc.) |
   | Funraise Payment Method | From Funraise payload: `payment_method` (or equivalent) |
   | Funraise Checkbox | Hardcoded: `true` |

5. **Update type definitions** if the Funraise donation type is missing any of the source fields, or if the Salesforce Opportunity type is missing any of the target fields.

6. **Verify no regression on recurring gifts.** Ensure the newly added fields are scoped to the one-time gift branch and do not affect the recurring gift code path (unless the same fields should apply there too — see Open Questions).

---

## Assumptions Made

- The app already has a working Funraise → Salesforce integration; this task adds missing fields, not a new integration.
- Salesforce custom fields for all 7 targets already exist on the Opportunity object (i.e. they don't need to be created in Salesforce; only the code mapping is missing).
- The Funraise webhook payload already includes `fundraiser_id`, `donation_status`, `form_name`, and `payment_method` (or similar) — the data is available but not currently mapped.
- "Donation Pipeline" and "Solicit Team" are always `"One-time Donor (operations)"` and `"Donation"` respectively for one-time gifts (hardcoded values, not derived from Funraise data).
- "Funraise Checkbox" is always `true` for one-time gifts (hardcoded).
- One-time gifts are already distinguishable from recurring gifts via a field on the Funraise payload or via the code path that calls the Opportunity builder.
- The app uses JavaScript/TypeScript (consistent with the Next.js UI in this repo).

---

## Open Questions

> These must be answered by Matthew before execution can begin.

- [ ] What are the exact Salesforce API field names (not labels) for: Donation Pipeline, Solicit Team, Funraise Donation Status, Donation Form Name, Funraise Payment Method, and Funraise Checkbox? (e.g. `Donation_Pipeline__c`, `Solicit_Team__c`, etc.)
- [ ] What are the exact Funraise payload field names for: fundraiser ID, donation status, donation form name, and payment method? (e.g. `fundraiserId`, `status`, `formName`, `paymentMethod`)
- [ ] Should the "Donation Pipeline" and "Solicit Team" values also be set for recurring gifts, or strictly for one-time gifts only?
- [ ] Is "Funraise Checkbox" the actual label of the Salesforce field, or a shorthand? What is the full label and API name?

---

## Explicitly Out of Scope

- Creating new Salesforce custom fields on the Opportunity object — assumes they already exist.
- Changes to how Funraise webhooks are authenticated or routed.
- Changes to any recurring gift field mappings (unless Matthew confirms overlap in annotations).
- UI changes in the submission form or any admin dashboard.
- Backfilling historical Opportunities that were created without these fields.

---

## Risks

- **Wrong Salesforce field API names:** If the assumed API names don't match what's in the org, the upsert will silently drop those fields or throw an error. Confirm field names before executing.
- **Funraise payload field names vary by event type:** Some Funraise fields may have different names in `donation.created` vs `donation.updated` webhook events. Verify across all relevant event handlers.
- **Regression on recurring gifts:** If the code path for one-time and recurring gifts shares the same Opportunity builder function without branching, adding these fields without a guard could pollute recurring gift records. The implementation must confirm the branching logic first.
- **`null` / `undefined` values for dynamic fields:** If `fundraiser_id`, `donation_status`, `form_name`, or `payment_method` are absent from some Funraise payloads, the Salesforce upsert should gracefully omit them rather than writing `null` to the field.

---

## Estimated Scope

Small

---

## Matthew's Annotations

> Matthew fills this in during plan review. Claude reads this before executing.

_No annotations yet._
