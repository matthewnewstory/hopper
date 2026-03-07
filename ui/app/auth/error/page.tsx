export default function AuthError() {
  return (
    <main style={{ maxWidth: 480, margin: '100px auto', padding: '0 24px', textAlign: 'center' }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Access denied</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Only <strong>@newstoryhomes.org</strong> accounts can access this app.
      </p>
      <a
        href="/api/auth/signin"
        style={{
          display: 'inline-block',
          padding: '10px 20px',
          background: '#1a1a1a',
          color: '#fff',
          borderRadius: 6,
          textDecoration: 'none',
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        Try a different account
      </a>
    </main>
  )
}
