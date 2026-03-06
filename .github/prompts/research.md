Read BACKLOG.md. Find the highest priority task with status `approved`.

Then:
1. Do deep research into the relevant parts of the codebase for that task.
2. Write a full plan to `plans/[task-name].md` using the template at `plans/_template.md`.
   - Use the task ID and a slugified title for the filename (e.g. `plans/task-001-csv-export.md`).
   - Fill in all sections: Summary, Files to Touch, Approach, Assumptions Made, Open Questions, Explicitly Out of Scope, Risks, Estimated Scope.
   - Leave "Matthew's Annotations" blank.
3. Update the task's **Plan** field in BACKLOG.md to link to the new plan file.
4. Update the task status from `approved` to `planned`.

Rules:
- Do NOT write any code or modify any source files.
- Do NOT modify any tasks other than the one being researched.
- If there are no approved tasks, output "No approved tasks found." and stop.
