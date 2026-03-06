'use client'

import { useState } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function SubmitPage() {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    const form = e.currentTarget
    const data = {
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      type: (form.elements.namedItem('type') as HTMLSelectElement).value,
      description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
      submittedBy: (form.elements.namedItem('submittedBy') as HTMLInputElement).value,
      priority: (form.elements.namedItem('priority') as HTMLSelectElement).value,
    }

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error || 'Submission failed')
      }
      setStatus('success')
      form.reset()
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  return (
    <main style={{ maxWidth: 600, margin: '60px auto', padding: '0 24px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Submit a Task</h1>
      <p style={{ color: '#666', marginBottom: 32 }}>
        Feature requests and bugs go here. Matthew will triage and approve.
      </p>

      {status === 'success' && (
        <div style={banner('green')}>
          Submitted. Your task is in the backlog and will be triaged shortly.
        </div>
      )}

      {status === 'error' && (
        <div style={banner('red')}>
          Error: {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Field label="Title" required>
          <input name="title" required placeholder="Short description of the task" style={input()} />
        </Field>

        <Field label="Type" required>
          <select name="type" required style={input()}>
            <option value="">Select type…</option>
            <option value="feature">Feature</option>
            <option value="bug">Bug</option>
            <option value="research">Research</option>
          </select>
        </Field>

        <Field label="Description" required>
          <textarea
            name="description"
            required
            rows={5}
            placeholder="Details, context, reproduction steps (for bugs), expected behavior…"
            style={{ ...input(), resize: 'vertical' }}
          />
        </Field>

        <Field label="Your name" required>
          <input name="submittedBy" required placeholder="First name or full name" style={input()} />
        </Field>

        <Field label="Priority suggestion">
          <select name="priority" style={input()}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </Field>

        <button
          type="submit"
          disabled={status === 'submitting'}
          style={{
            padding: '12px 24px',
            background: status === 'submitting' ? '#999' : '#1a1a1a',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontSize: 15,
            fontWeight: 600,
            cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
            alignSelf: 'flex-start',
          }}
        >
          {status === 'submitting' ? 'Submitting…' : 'Submit task'}
        </button>
      </form>
    </main>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>
        {label}{required && <span style={{ color: '#c00' }}> *</span>}
      </label>
      {children}
    </div>
  )
}

function input(): React.CSSProperties {
  return {
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: 6,
    fontSize: 15,
    width: '100%',
    boxSizing: 'border-box',
    background: '#fff',
  }
}

function banner(color: 'green' | 'red'): React.CSSProperties {
  const colors = {
    green: { background: '#f0fdf4', border: '#86efac', text: '#166534' },
    red:   { background: '#fef2f2', border: '#fca5a5', text: '#991b1b' },
  }
  const c = colors[color]
  return {
    padding: '12px 16px',
    background: c.background,
    border: `1px solid ${c.border}`,
    borderRadius: 6,
    color: c.text,
    marginBottom: 24,
    fontSize: 14,
  }
}
