'use client'

import type { ReactNode } from 'react'

interface DropdownProps {
  label: string
  icon?: ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}

export function Dropdown({ label, icon, open, onOpenChange, children }: DropdownProps) {
  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => onOpenChange(!open)}
        className="flex items-center gap-1.5 rounded-lg bg-surface px-2 py-1.5 text-[13px] text-ink-secondary shadow-[0_0_0_1px_#E7E4DC] transition-colors hover:bg-surface-subtle hover:text-ink"
      >
        {icon}
        <span>{label}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => onOpenChange(false)} />
          <div className="absolute right-0 top-full z-50 mt-1.5 min-w-40 rounded-lg bg-surface py-1 shadow-overlay ring-1 ring-border-subtle">
            {children}
          </div>
        </>
      )}
    </div>
  )
}

interface DropdownItemProps {
  active?: boolean
  onClick: () => void
  children: ReactNode
}

export function DropdownItem({ active, onClick, children }: DropdownItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-[13px] transition-colors ${
        active
          ? 'bg-accent-soft font-medium text-accent-hover'
          : 'text-ink-secondary hover:bg-surface-subtle hover:text-ink'
      }`}
    >
      {children}
      {active && (
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
      )}
    </button>
  )
}
