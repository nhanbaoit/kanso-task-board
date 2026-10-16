'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { getSupabase } from '../lib/supabase'
import { useUI } from './UIContext'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { setUser } = useUI()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const sb = getSupabase()
    if (!sb) {
      setChecking(false)
      return
    }
    let cancelled = false

    sb.auth.getSession().then(({ data }) => {
      if (cancelled) return
      const u = data.session?.user
      if (u) {
        setUser({ id: u.id, email: u.email ?? undefined })
        setChecking(false)
      } else if (pathname === '/login') {
        setChecking(false)
      } else {
        router.replace('/login')
      }
    })

    const { data: sub } = sb.auth.onAuthStateChange((event, session) => {
      if (cancelled) return
      if (event === 'SIGNED_IN' && session?.user) {
        setUser({ id: session.user.id, email: session.user.email ?? undefined })
        setChecking(false)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        try {
          localStorage.removeItem('kanso-tasks-v1')
        } catch {
          // ignore storage errors
        }
        router.replace('/login')
      }
    })

    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [pathname, router, setUser])

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <div className="flex items-center gap-2 text-[13px] text-ink-tertiary">
          <span className="size-2 animate-pulse rounded-full bg-accent" />
          Checking your session…
        </div>
      </div>
    )
  }

  if (pathname === '/login') {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      <Sidebar />
      <div className="md:pl-64">
        <main className="min-h-screen w-full pt-14">{children}</main>
      </div>
    </>
  )
}
