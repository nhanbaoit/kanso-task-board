'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'
import { useUI } from '@/components/UIContext'
import { IconLogo } from '@/icons'

type Mode = 'signin' | 'signup'

export default function LoginPage() {
  const router = useRouter()
  const { user } = useUI()
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (user) router.replace('/')
  }, [user, router])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const sb = getSupabase()
    if (!sb || !isSupabaseConfigured) {
      setError('Authentication is not configured in this environment.')
      return
    }
    setBusy(true)
    setError(null)
    setInfo(null)
    try {
      if (mode === 'signup') {
        const { data, error } = await sb.auth.signUp({ email, password })
        if (error) {
          setError(error.message)
          return
        }
        if (data.session) {
          router.replace('/')
        } else {
          setInfo('Account created. Check your inbox to confirm your email, then sign in.')
        }
      } else {
        const { error } = await sb.auth.signInWithPassword({ email, password })
        if (error) {
          setError('Invalid email or password.')
          return
        }
        router.replace('/')
      }
    } finally {
      setBusy(false)
    }
  }

  const inputClass =
    'h-9 w-full rounded-md border border-border-subtle bg-surface px-2.5 text-[13px] text-ink outline-none transition-shadow placeholder:text-ink-tertiary focus:border-accent focus:shadow-[0_0_0_2px_#EDF3EE]'
  const labelClass = 'text-[11px] font-medium uppercase tracking-wider text-ink-secondary'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-canvas px-4">
      <div className="flex items-center gap-2.5">
        <IconLogo size={34} />
        <span className="text-[22px] font-semibold tracking-tight text-ink">Kanso</span>
      </div>

      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-xl bg-surface p-6 shadow-overlay ring-1 ring-border-subtle"
      >
        <h1 className="text-[18px] font-semibold tracking-[-0.01em] text-ink">
          {mode === 'signin' ? 'Sign in to your workspace' : 'Create your workspace'}
        </h1>
        <p className="mt-1 text-[13px] text-ink-secondary">
          {mode === 'signin'
            ? 'Welcome back — your board is waiting.'
            : 'Free, instant, and just an email away.'}
        </p>

        <div className="mt-5 flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="auth-email" className={labelClass}>
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="auth-password" className={labelClass}>
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className={inputClass}
            />
          </div>

          {error && (
            <p role="alert" className="text-[12px] leading-snug text-urgent">
              {error}
            </p>
          )}
          {info && (
            <p role="status" className="text-[12px] leading-snug text-accent">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-1 h-9 w-full rounded-lg bg-accent text-[13px] font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </div>

        <p className="mt-4 text-center text-[13px] text-ink-secondary">
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin')
              setError(null)
              setInfo(null)
            }}
            className="font-medium text-accent hover:underline"
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </form>

      <p className="max-w-sm text-center text-[12px] leading-relaxed text-ink-tertiary">
        A calm kanban board for focused teams.{' '}
        <a
          href="https://github.com/nhanbaoit/kanso-task-board"
          target="_blank"
          rel="noreferrer"
          className="text-ink-secondary underline decoration-border-subtle underline-offset-2 hover:text-ink"
        >
          View source on GitHub
        </a>
      </p>
    </div>
  )
}
