'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUI } from './UIContext'
import { getSupabase } from '../lib/supabase'
import {
  IconBell,
  IconChevronDown,
  IconKanban,
  IconList,
  IconCalendarWeek,
  IconLogo,
  IconLogout,
  IconMenu,
  IconSearch,
} from '../icons'

export const NAV_ITEMS: { href: string; label: string; icon: typeof IconKanban }[] = [
  { href: '/', label: 'Board', icon: IconKanban },
  { href: '/list', label: 'List', icon: IconList },
  { href: '/timeline', label: 'Timeline', icon: IconCalendarWeek },
]

export function Header() {
  const pathname = usePathname()
  const { user, searchOpen, query, sidebarOpen, setSearchOpen, setQuery, setSidebarOpen } = useUI()
  const inputRef = useRef<HTMLInputElement>(null)

  const signOut = async () => {
    await getSupabase()?.auth.signOut()
  }

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus()
  }, [searchOpen])

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-canvas/90 backdrop-blur-md shadow-[0_1px_0_0_#E7E4DC]">
      <div className="flex h-14 w-full items-center justify-between gap-3 px-4 lg:px-5">
        <div className="flex min-w-0 items-center gap-4">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-1.5 text-ink-secondary transition-colors hover:bg-surface-tone hover:text-ink lg:hidden"
          >
            <IconMenu size={20} />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <IconLogo size={28} />
            <span className="text-[17px] font-semibold tracking-tight text-ink">Kanso</span>
          </Link>
          <div className="hidden h-4 w-px bg-border-subtle md:block" />
          <button
            type="button"
            className="hidden items-center gap-1 rounded-lg px-2 py-1 text-left transition-colors hover:bg-surface-tone md:flex"
          >
            <span className="text-[13px] font-medium text-ink">Product Launch</span>
            <IconChevronDown size={15} className="text-ink-tertiary" />
          </button>
          <div className="hidden h-4 w-px bg-border-subtle md:block" />
          <nav className="hidden items-center gap-0.5 md:flex" aria-label="Views">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-[13px] transition-colors ${
                    active
                      ? 'bg-accent-soft font-medium text-accent-hover'
                      : 'text-ink-secondary hover:bg-surface-tone hover:text-ink'
                  }`}
                >
                  <item.icon size={15} />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {searchOpen ? (
            <div className="relative">
              <IconSearch
                size={15}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-tertiary"
              />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onBlur={() => {
                  if (!query) setSearchOpen(false)
                }}
                placeholder="Search tasks…"
                className="h-8 w-56 rounded-lg border border-border-subtle bg-surface pl-8 pr-7 text-[13px] text-ink outline-none transition-shadow placeholder:text-ink-tertiary focus:border-accent focus:shadow-[0_0_0_2px_#EDF3EE] sm:w-64"
              />
              {query && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setQuery('')}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-ink-tertiary hover:text-ink"
                >
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="m6 6 12 12M18 6 6 18" />
                  </svg>
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex w-56 items-center gap-2.5 rounded-lg bg-surface px-3 py-1.5 shadow-[0_0_0_1px_#E7E4DC] transition-colors hover:text-ink lg:w-64"
            >
              <span className="flex flex-1 items-center gap-1.5 text-ink-secondary">
                <IconSearch size={15} />
                <span className="hidden text-[13px] text-ink-secondary sm:inline">Quick search</span>
              </span>
              <kbd className="rounded bg-surface-tone px-1.5 py-0.5 font-mono text-[11px] text-ink-tertiary">⌘K</kbd>
            </button>
          )}
          <button
            type="button"
            aria-label="Notifications"
            className="rounded-lg p-1.5 text-ink-secondary transition-colors hover:bg-surface-tone hover:text-ink"
          >
            <IconBell size={19} />
          </button>
          {user ? (
            <div className="flex items-center gap-1.5">
              <span className="hidden max-w-36 truncate text-[12px] text-ink-secondary sm:inline">
                {user.email}
              </span>
              <span
                className="flex size-8 items-center justify-center rounded-full bg-accent-soft text-[12px] font-medium text-accent-hover ring-1 ring-border-subtle"
                title={user.email}
              >
                {(user.email ?? '?').charAt(0).toUpperCase()}
              </span>
              <button
                type="button"
                aria-label="Sign out"
                title="Sign out"
                onClick={signOut}
                className="rounded-lg p-1.5 text-ink-secondary transition-colors hover:bg-surface-tone hover:text-ink"
              >
                <IconLogout size={17} />
              </button>
            </div>
          ) : (
            <div className="flex size-8 items-center justify-center rounded-full bg-accent-soft text-accent-hover ring-1 ring-border-subtle">
              <IconPersonSmall />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function IconPersonSmall() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  )
}
