'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { dateFromISO, isoFromDate } from '../lib/dueDate'

interface DatePickerProps {
  id?: string
  value: string
  onChange: (iso: string) => void
}

export function DatePicker({ id, value, onChange }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const date = dateFromISO(value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          id={id}
          data-empty={!date}
          className="h-9 w-full justify-between rounded-lg border-border-subtle bg-surface px-2.5 text-left text-[13px] font-normal data-[empty=true]:text-ink-tertiary"
        >
          {date ? format(date, 'MMM d, yyyy') : <span>Pick a date</span>}
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink-tertiary" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="z-[70] w-auto p-0"
        align="start"
        onEscapeKeyDown={(e) => e.stopPropagation()}
      >
        <Calendar
          mode="single"
          selected={date}
          defaultMonth={date}
          onSelect={(d) => {
            onChange(d ? isoFromDate(d) : '')
            if (d) setOpen(false)
          }}
          footer={
            <div className="flex items-center justify-between border-t border-border-subtle px-1.5 pt-2 pb-0.5">
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
      </PopoverContent>
    </Popover>
  )
}
