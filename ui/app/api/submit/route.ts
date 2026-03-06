import { NextRequest, NextResponse } from 'next/server'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!
const GITHUB_OWNER = process.env.GITHUB_OWNER!
const GITHUB_REPO  = process.env.GITHUB_REPO!
const BACKLOG_PATH = 'BACKLOG.md'

interface SubmitBody {
  title: string
  type: 'feature' | 'bug' | 'research'
  description: string
  submittedBy: string
  priority: 'low' | 'medium' | 'high'
}

export async function POST(req: NextRequest) {
  const body: SubmitBody = await req.json()
  const { title, type, description, submittedBy, priority } = body

  if (!title || !type || !description || !submittedBy) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Fetch current BACKLOG.md from GitHub
  const fileRes = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${BACKLOG_PATH}`,
    { headers: githubHeaders() }
  )
  if (!fileRes.ok) {
    return NextResponse.json({ error: 'Failed to fetch backlog from GitHub' }, { status: 502 })
  }
  const fileData = await fileRes.json()
  const currentContent = Buffer.from(fileData.content, 'base64').toString('utf-8')
  const sha = fileData.sha

  // Derive the next task ID
  const ids = [...currentContent.matchAll(/\*\*ID:\*\* TASK-(\d+)/g)].map(m => parseInt(m[1], 10))
  const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1
  const taskId = `TASK-${String(nextId).padStart(3, '0')}`
  const today = new Date().toISOString().slice(0, 10)
  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1)

  const taskEntry = `
### ${typeLabel.toUpperCase()}: ${title}
- **ID:** ${taskId}
- **Submitted by:** ${submittedBy}
- **Submitted at:** ${today}
- **Status:** \`submitted\`
- **Type:** ${type}
- **Priority:** ${priority}
- **Complexity (Claude):** _Pending triage_
- **Plan:** —
- **Branch:** —
- **PR:** —
- **Matthew's notes:** —

> ${description.replace(/\n/g, '\n> ')}

---
`

  // Insert after "## Active Tasks" header
  const insertMarker = '## Active Tasks'
  const markerIndex = currentContent.indexOf(insertMarker)
  if (markerIndex === -1) {
    return NextResponse.json({ error: 'Could not locate Active Tasks section in BACKLOG.md' }, { status: 500 })
  }

  // Insert after the marker line and any trailing newlines
  const afterMarker = markerIndex + insertMarker.length
  const newContent =
    currentContent.slice(0, afterMarker) +
    '\n' +
    taskEntry +
    currentContent.slice(afterMarker)

  // Write back to GitHub
  const updateRes = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${BACKLOG_PATH}`,
    {
      method: 'PUT',
      headers: githubHeaders(),
      body: JSON.stringify({
        message: `feat(backlog): submit ${taskId} — ${title}`,
        content: Buffer.from(newContent).toString('base64'),
        sha,
      }),
    }
  )

  if (!updateRes.ok) {
    const err = await updateRes.json()
    return NextResponse.json({ error: err.message || 'Failed to update backlog' }, { status: 502 })
  }

  return NextResponse.json({ taskId }, { status: 201 })
}

function githubHeaders() {
  return {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}
