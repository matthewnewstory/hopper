# Hopper

An autonomous task system for Claude Code. Team members submit tasks via a web UI. Claude triages, plans, and executes them on a daily cron schedule. Matthew gates every stage.

---

## Setup

### 1. GitHub repo

Push this repo to GitHub. All cron jobs run as GitHub Actions.

### 2. GitHub secret

Add `ANTHROPIC_API_KEY` to your repo's **Settings → Secrets and variables → Actions**.

### 3. Submission UI

```bash
cd ui
cp .env.local.example .env.local
# Fill in GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO
npm install
npm run dev
```

Deploy to Vercel by importing the `ui/` directory.

---

## How it works

```
[Team submits via UI]
        ↓
    submitted
        ↓ (cron: 10am UTC)
    triaging → triaged
        ↓ Matthew approves
    approved
        ↓ (cron: 10am UTC)
  researching → planned
        ↓ Matthew reviews plan
    reviewed
        ↓ (cron: 2pm UTC)
   executing → in-review
        ↓ Matthew merges PR
      done
```

### Cron jobs

| Workflow | Schedule | What it does |
|---|---|---|
| `triage.yml` | 10am UTC daily | Triages `submitted` tasks; writes plans for `approved` tasks |
| `execute.yml` | 2pm UTC daily | Implements `reviewed` tasks, opens PRs |

---

## Matthew's controls

- `submitted` → `approved` — go/no-go in BACKLOG.md
- `planned` → `reviewed` — annotate the plan file, flip status
- `in-review` → `done` — merge the PR

---

## File structure

```
/
├── BACKLOG.md
├── plans/
│   └── _template.md
├── ui/                         # Submission web app (Next.js)
│   ├── app/
│   │   ├── page.tsx            # Submission form
│   │   └── api/submit/route.ts # GitHub API writer
│   └── .env.local.example
└── .github/
    ├── prompts/
    │   ├── triage.md
    │   ├── research.md
    │   └── execute.md
    └── workflows/
        ├── triage.yml
        └── execute.yml
```
