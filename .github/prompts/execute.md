Read BACKLOG.md. Find the highest priority task with status `reviewed`.

Then:
1. Read its plan file (listed under the **Plan** field).
2. Read Matthew's Annotations in the plan — treat them as binding constraints.
3. Create a new git branch named `task/[task-id]-[slugified-title]` (e.g. `task/task-001-csv-export`).
4. Implement the solution exactly as described in the plan. Do not add features or scope not listed.
5. If you encounter something unexpected that the plan did not anticipate, STOP. Add a note to the plan file under a new "Blockers" section describing what you found. Update the task status to `planned` (reverting to plan-review). Do NOT proceed with a guess.
6. If implementation completes cleanly, open a PR from your branch to `main`. PR title: `[TASK-XXX] Task title`. PR body: brief summary of what was done, link to the plan file, and a checklist of what was implemented.
7. Update BACKLOG.md: set the task status to `in-review`, record the branch name and PR URL.

Rules:
- Follow the plan exactly.
- If there are no reviewed tasks, output "No reviewed tasks found." and stop.
