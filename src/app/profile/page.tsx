'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useUI } from '@/components/UIContext'
import { useTasks } from '@/hooks/useTasks'
import { getSupabase } from '@/lib/supabase'
import { IconLogout } from '@/icons'

interface ProfileInfo {
  provider?: string
  createdAt?: string
  lastSignIn?: string
}

function formatDate(iso?: string): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function ProfilePage() {
  const { user, setUser } = useUI()
  const { tasks } = useTasks()
  const [info, setInfo] = useState<ProfileInfo>({})

  useEffect(() => {
    const sb = getSupabase()
    if (!sb) return
    sb.auth.getUser().then(({ data }) => {
      const u = data.user
      if (!u) return
      setInfo({
        provider: (u.app_metadata?.provider as string) ?? 'email',
        createdAt: u.created_at,
        lastSignIn: u.last_sign_in_at ?? undefined,
      })
    })
  }, [])

  const done = tasks.filter((t) => t.column === 'done').length
  const displayName = user?.email ? user.email.split('@')[0] : 'Guest'

  const signOut = async () => {
    await getSupabase()?.auth.signOut()
    setUser(null)
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4 md:p-6">
      <div>
        <h1 className="text-[22px] font-semibold tracking-[-0.015em] text-ink">Profile</h1>
        <p className="text-[13px] text-ink-secondary">Your account details and activity</p>
      </div>

      <div className="flex items-center gap-4 rounded-xl bg-surface p-5 shadow-card ring-1 ring-border-subtle/60">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[18px] font-semibold text-accent-hover">
          {(user?.email ?? '?').charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[16px] font-semibold capitalize text-ink">{displayName}</p>
          <p className="truncate text-[13px] text-ink-secondary">{user?.email ?? 'Not signed in'}</p>
        </div>
      </div>

      <div className="rounded-xl bg-surface p-5 shadow-card ring-1 ring-border-subtle/60">
        <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-ink-secondary">Account</h2>
        <dl className="flex flex-col divide-y divide-border-subtle/60">
          {[
            ['Sign-in method', info.provider === 'email' ? 'Email & password' : (info.provider ?? '—')],
            ['Member since', formatDate(info.createdAt)],
            ['Last sign-in', formatDate(info.lastSignIn)],
            ['User ID', user?.id ?? '—'],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 py-2.5">
              <dt className="shrink-0 text-[13px] text-ink-secondary">{label}</dt>
              <dd className="truncate text-right text-[13px] font-medium text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="rounded-xl bg-surface p-5 shadow-card ring-1 ring-border-subtle/60">
        <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-ink-secondary">Activity</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-accent-soft/60 p-3 text-center ring-1 ring-accent/20">
            <p className="text-[20px] font-semibold text-accent">{tasks.length}</p>
            <p className="text-[11px] font-medium uppercase tracking-wide text-ink-secondary">Total tasks</p>
          </div>
          <div className="rounded-lg bg-success-soft/60 p-3 text-center ring-1 ring-success/25">
            <p className="text-[20px] font-semibold text-success">{done}</p>
            <p className="text-[11px] font-medium uppercase tracking-wide text-ink-secondary">Completed</p>
          </div>
          <div className="rounded-lg bg-warning-soft/60 p-3 text-center ring-1 ring-warning/30">
            <p className="text-[20px] font-semibold text-warning">{tasks.length - done}</p>
            <p className="text-[11px] font-medium uppercase tracking-wide text-ink-secondary">In progress</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-surface p-5 shadow-card ring-1 ring-border-subtle/60">
        <div>
          <p className="text-[14px] font-medium text-ink">Sign out</p>
          <p className="text-[12px] text-ink-tertiary">End your session on this device</p>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="flex items-center gap-1.5 rounded-lg border border-urgent/30 bg-urgent-soft px-3 py-1.5 text-[13px] font-medium text-urgent transition-colors hover:bg-urgent hover:text-white"
        >
          <IconLogout size={15} />
          Sign out
        </button>
      </div>

      <p className="text-center text-[12px] text-ink-tertiary">
        <Link href="/" className="transition-colors hover:text-accent">
          ← Back to board
        </Link>
      </p>
    </div>
  )
}
