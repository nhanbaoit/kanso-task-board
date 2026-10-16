'use client'

import { useEffect, useRef, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { dateFromISO, formatDueDate, isoFromDate } from '../lib/dueDate'

interface DatePickerProps {
  id?: string
  value: string
  onChange: (iso: string) => void
}

export function DatePicker({ id, value, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = dateFromISO(value)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        id={id}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex h-9 w-full items-center justify-between rounded-md border border-border-subtle bg-surface px-2.5 text-[13px] outline-none transition-shadow focus-visible:border-accent focus-visible:shadow-[0_0_0_2px_#EDF3EE]"
      >
        <span className={selected ? 'text-ink' : 'text-ink-tertiary'}>
          {selected ? formatDueDate(isoFromDate(selected)) : 'Pick a date'}
        </span>
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-ink-tertiary" aria-hidden="true">
          <rect x="4" y="5.5" width="16" height="14.5" rx="2" />
          <path d="M4 10h16M8.5 3.5v3M15.5 3.5v3" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1.5 rounded-xl bg-surface p-2.5 shadow-overlay ring-1 ring-border-subtle">
          <DayPicker
            mode="single"
            selected={selected}
            defaultMonth={selected ?? new Date()}
            onSelect={(d) => {
              onChange(d ? isoFromDate(d) : '')
              setOpen(false)
            }}
            footer={
              <div className="mt-2 flex items-center justify-between border-t border-border-subtle pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onChange('')
                    setOpen(false)
                  }}
                  className="rounded px-1.5 py-0.5 text-[12px] font-medium text-ink-secondary transition-colors hover:bg-surface-subtle hover:text-ink"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChange(isoFromDate(new Date()))
                    setOpen(false)
                  }}
                  className="rounded px-1.5 py-0.5 text-[12px] font-medium text-accent transition-colors hover:bg-accent-soft hover:text-accent-hover"
                >
                  Today
                </button>
              </div>
            }
          />
        </div>
      )}
    </div>
  )
}
