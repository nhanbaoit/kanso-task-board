'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUI } from './UIContext'
import { NAV_ITEMS } from './Header'
import { useTasks } from '../hooks/useTasks'
import { IconTune, IconLogo, IconX } from '../icons'

function SidebarInner({ onClose }: { onClose: () => void }) {
  const pathname = usePathname()
  const { tasks } = useTasks()

  return (
    <div className="flex h-full flex-col justify-between py-4">
      <div className="flex flex-col gap-4 px-3">
        <div className="flex items-center justify-between md:hidden">
          <div className="flex items-center gap-2">
            <IconLogo size={24} />
            <span className="text-[15px] font-semibold text-ink">Kanso</span>
          </div>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-secondary hover:bg-surface-tone hover:text-ink"
          >
            <IconX size={18} />
          </button>
        </div>

        <nav className="flex flex-col gap-0.5" aria-label="Workspace">
          <span className="px-2 text-[11px] font-medium uppercase tracking-wider text-ink-tertiary">
            Workspace
          </span>
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px] transition-colors ${
                  active
                    ? 'bg-surface-tone font-medium text-ink'
                    : 'text-ink-secondary hover:bg-surface-tone hover:text-ink'
                }`}
              >
                <item.icon size={17} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <nav className="flex flex-col gap-0.5" aria-label="Projects">
          <span className="px-2 text-[11px] font-medium uppercase tracking-wider text-ink-tertiary">
            Projects
          </span>
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center justify-between rounded-lg bg-surface-tone px-2 py-1.5 text-[13px] font-medium text-ink"
          >
            <span className="flex items-center gap-2.5">
              <span className="size-2 rounded-full bg-accent" />
              Product Launch
            </span>
            <span className="text-[11px] text-ink-tertiary">{tasks.length}</span>
          </Link>
          <button
            type="button"
            className="flex items-center justify-between rounded-lg px-2 py-1.5 text-[13px] text-ink-secondary transition-colors hover:bg-surface-tone hover:text-ink"
          >
            <span className="flex items-center gap-2.5">
              <span className="size-2 rounded-full bg-ink-tertiary" />
              Design System
            </span>
            <span className="text-[11px] text-ink-tertiary">6</span>
          </button>
        </nav>
      </div>

      <div className="flex flex-col gap-0.5 border-t border-border-subtle/60 px-3 pt-3">
        <button
          type="button"
          className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px] text-ink-secondary transition-colors hover:bg-surface-tone hover:text-ink"
        >
          <IconTune size={17} />
          Settings
        </button>
        <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-ink-tertiary">
          <span>Kanso v1.2</span>
          <span className="size-1.5 rounded-full bg-accent" />
        </div>
      </div>
    </div>
  )
}

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useUI()

  return (
    <>
      <aside className="fixed bottom-0 left-0 top-14 z-40 hidden w-64 border-r border-border-subtle bg-surface-subtle md:block">
        <SidebarInner onClose={() => setSidebarOpen(false)} />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-ink/20 backdrop-blur-[2px]"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute bottom-0 left-0 top-14 w-64 border-r border-border-subtle bg-surface-subtle shadow-overlay">
            <SidebarInner onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
