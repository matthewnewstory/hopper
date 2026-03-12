# Backlog

> Tasks are ordered by priority within each status group. Matthew controls priority ordering.
> To add a task, use the submission UI or follow the task format below.

---

## How to Read This File

- **Status flow:** `submitted` → `triaging` → `triaged` → `approved` → `researching` → `planned` → `reviewed` → `executing` → `in-review` → `done`
- **Matthew gates:** `approved`, `reviewed`, `done`
- **Claude gates:** `triaging`, `triaged`, `researching`, `planned`, `executing`, `in-review`

---

## Active Tasks

### BUG: On /results after an update to an opportunity the app created the correct SF payments but didn't create the QB invoices
- **ID:** TASK-003
- **Submitted by:** Matthew Marshall
- **Submitted at:** 2026-03-12
- **Status:** `triaged`
- **Type:** bug
- **Priority:** high
- **Complexity (Claude):** _Pending triage_
- **Plan:** —
- **Branch:** —
- **PR:** —
- **Matthew's notes:** —

> See error message: QB invoices failed: QB token refresh failed (400): {"error":"invalid_grant","error_description":"Incorrect or invalid refresh token"}

---


### FEATURE: one time gift
- **ID:** TASK-002
- **Submitted by:** Matthew Marshall
- **Submitted at:** 2026-03-07
- **Status:** `approved`
- **Type:** feature
- **Priority:** medium
- **Complexity (Claude):** Medium — requires adding ~7 field mappings to the Salesforce Opportunity creation/update flow for one-time gifts (Donation Pipeline, Solicit Team, fundraiser ID, Funraise Donation Status, Donation Form Name, Funraise Payment Method, Funraise Checkbox); straightforward if the Salesforce fields already exist on the Opportunity object and the Funraise integration already provides the data.
- **Plan:** —
- **Branch:** —
- **PR:** —
- **Matthew's notes:** —

> When I tried to log a one-time gift, 
> the payment method was not saved correctly. 
> The sales force opportunity should save the gift’s Donation Pipeline (One-time Donor (operations)), Solict Team (Donation), fundraiser ID, Funraise Donation Status, Donation Form Name, Funraise Payment Method, and Funraise Checkbox as true.

---


<!-- Tasks that are in flight (submitted through in-review) go here, newest first -->

---

## Done

<!-- Completed tasks (status: done) go here, newest first -->

---

## Task Format Reference

```markdown
### [TYPE]: [Title]
- **ID:** TASK-001
- **Submitted by:** Name
- **Submitted at:** YYYY-MM-DD
- **Status:** `submitted`
- **Type:** feature | bug | research
- **Priority:** high | medium | low
- **Complexity (Claude):** _Pending triage_
- **Plan:** —
- **Branch:** —
- **PR:** —
- **Matthew's notes:** —
```

---

<!-- END OF BACKLOG -->
