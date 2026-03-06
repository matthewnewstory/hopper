# Claude Code Autonomous Task System

## Overview

This system allows Claude Code to autonomously work through a backlog of feature requests and bugs across one or more projects. It is designed around a structured task lifecycle with three human-gated checkpoints, a plan-first execution model, and a simple UI for team-wide task submission.

---

## Core Principles

- Claude never writes code without an approved plan
- Matthew is the sole gatekeeper at all approval stages
- All team members can submit tasks; only Matthew can advance them
- Plan refinement happens interactively in Claude Code before execution begins
- Claude always opens a PR — it never commits directly to main

---

## Task Lifecycle

```
[submitted] → [triaging] → [triaged] → [approved] → [researching] → [planned] → [reviewed] → [executing] → [in-review] → [done]
                                            ↑                             ↑                        ↑
                                     Matthew gates                 Matthew gates            Matthew gates
                                     (go / no-go)                 (plan review)             (PR merge)
```

### Status Definitions

| Status | Triggered By | Description |
|---|---|---|
| `submitted` | Team member | Added via submission UI |
| `triaging` | Cron (daily) | Claude assesses complexity and feasibility |
| `triaged` | Claude | Awaiting Matthew's go/no-go |
| `approved` | **Matthew** | Matthew advances task to research phase |
| `researching` | Cron | Claude does deep codebase research |
| `planned` | Claude | Plan doc written, awaiting Matthew's review |
| `reviewed` | **Matthew** | Matthew annotates plan and approves execution |
| `executing` | Cron | Claude implements per the approved plan |
| `in-review` | Claude | PR opened, awaiting Matthew's merge |
| `done` | **Matthew** | PR merged |

---

## Backlog Structure

Tasks live in `BACKLOG.md` at the repo root, organized by project. Each task links to a plan file in the `plans/` folder.

### Example Task Entry

```markdown
### FEATURE: Add CSV export to dashboard
- **Submitted by:** Sarah
- **Status:** `planned`
- **Type:** feature | bug | research
- **Priority:** high | medium | low
- **Complexity (Claude):** Medium — requires new endpoint + frontend button.
  No major dependencies. Estimated 2–3 hours of work.
- **Plan:** See `plans/csv-export.md`
- **Matthew's notes:** ✅ Approved. Keep it simple — no formatting options yet.
- **Branch:** —
- **PR:** —
```

---

## The Plan Document (`plans/<task-name>.md`)

Each task gets its own plan file. This is the living document that Claude writes, Matthew annotates, and Claude revises before any code is touched.

### Plan File Template

```markdown
# Plan: [Task Title]

## Summary
What this task does in 2–3 sentences.

## Files to Touch
- `src/components/Dashboard.tsx` — add export button
- `src/api/export.ts` — new endpoint (create)
- `src/utils/csv.ts` — new utility (create)

## Approach
Step-by-step description of implementation approach.

## Assumptions Made
- List any assumptions Claude made about the codebase or intent

## Open Questions
- Things Claude couldn't determine that Matthew should answer before execution

## Explicitly Out of Scope
- What this task is NOT doing

## Risks
- Anything that could go wrong or cause side effects

## Estimated Scope
Small | Medium | Large
```

---

## Plan Refinement Workflow

When a plan is ~60% right and needs iteration before approval:

1. Open a Claude Code session
2. Say: *"Read `plans/[task].md`. [Explain what's wrong or missing.] Revise the plan."*
3. Claude reads the codebase in context and rewrites the plan file
4. Review the updated plan
5. When satisfied, flip status to `reviewed`
6. Next cron run picks it up for execution

> Plan refinement and execution are always separate Claude Code sessions. The refinement session only has permission to write to the plan file — not to touch source code.

---

## Cron Jobs (GitHub Actions)

Two separate scheduled workflows:

### 1. Triage + Research Run (daily)
- Finds all tasks with status `submitted` → runs triage, updates to `triaged`
- Finds all tasks with status `approved` → runs deep research, writes plan doc, updates to `planned`

### 2. Execution Run (daily, after Matthew's review window)
- Finds all tasks with status `reviewed` → creates branch, implements per plan, opens PR, updates to `in-review`

---

## Claude Code Prompt Patterns

### Triage Prompt
```
Read BACKLOG.md. Find all tasks with status `submitted`.
For each: research the codebase to assess complexity and feasibility.
Write a 1-paragraph assessment under "Complexity (Claude)".
Update the task status to `triaged`.
Do not write any code or modify any source files.
```

### Research + Plan Prompt
```
Read BACKLOG.md. Find the highest priority task with status `approved`.
Do deep research into the relevant parts of the codebase.
Write a full plan to `plans/[task-name].md` using the plan template.
Update the task status to `planned`.
Do not write any code or modify any source files.
```

### Execution Prompt
```
Read BACKLOG.md. Find the highest priority task with status `reviewed`.
Read its plan file in `plans/`. Follow the plan exactly.
Create a new branch named `task/[task-name]`.
Implement the solution. Open a PR.
Update the task status to `in-review` and record the branch and PR link.
Do not deviate from the plan. If you encounter something unexpected, stop and add a note to the plan file instead of proceeding.
```

---

## Task Submission UI

A simple web app accessible to all team members with the following fields:

- **Title** — short description
- **Type** — bug / feature / research
- **Description** — details, context, reproduction steps if a bug
- **Submitted by** — name
- **Priority suggestion** — low / medium / high

On submit, the entry is written to `BACKLOG.md` via the GitHub API (or creates a GitHub Issue that syncs in). No repo access required for submitters.

---

## Folder Structure

```
/
├── BACKLOG.md              # Master task list
├── plans/
│   ├── csv-export.md
│   ├── safari-login-bug.md
│   └── ...
└── .github/
    └── workflows/
        ├── triage.yml      # Daily triage + research cron
        └── execute.yml     # Daily execution cron
```

---

## What Matthew Controls

- ✅ Go/no-go on all submitted tasks (`submitted` → `approved`)
- ✅ Plan review and annotation (`planned` → `reviewed`)
- ✅ Final merge of all PRs (`in-review` → `done`)
- ✅ Priority ordering in `BACKLOG.md`
- ✅ Adding context/constraints to any plan file at any time
