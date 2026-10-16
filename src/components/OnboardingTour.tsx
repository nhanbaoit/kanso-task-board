'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import {
  IconDrag,
  IconPlus,
  IconSearch,
  IconVerified,
  IconLogo,
  IconX,
} from '../icons'

interface Step {
  icon: ReactNode
  title: string
  description: string
}

const STEPS: Step[] = [
  {
    icon: <IconLogo size={26} />,
    title: 'Welcome to Kanso',
    description:
      'A calm kanban board for focused work. Take a 30-second tour to see how everything works.',
  },
  {
    icon: <IconDrag size={22} />,
    title: 'Drag cards between columns',
    description:
      'Grab any card and drop it into To Do, In Progress or Done. The column highlights while you hover, and your change syncs instantly.',
  },
  {
    icon: <IconPlus size={22} />,
    title: 'Create tasks your way',
    description:
      'Use the New Task button, the “Add task” link under each column, or simply press C anywhere on the board.',
  },
  {
    icon: <IconSearch size={22} />,
    title: 'Find and organize fast',
    description:
      'Press / to search, or use Filter to show only high-priority work and Sort to line tasks up by due date.',
  },
  {
    icon: <IconVerified size={22} />,
    title: 'Your workspace, kept private',
    description:
      'Everything you create is saved to your account in real time — and visible only to you, protected by database-level security.',
  },
]

export function OnboardingTour({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (open) setStep(0)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' && step < STEPS.length - 1) setStep((s) => s + 1)
      if (e.key === 'ArrowLeft' && step > 0) setStep((s) => s - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, step, onClose])

  if (!open) return null

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-ink/25 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Getting started tour"
        className="relative z-10 w-full max-w-sm rounded-xl bg-surface p-6 shadow-overlay ring-1 ring-border-subtle"
      >
        <button
          type="button"
          aria-label="Skip tour"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg p-1.5 text-ink-tertiary transition-colors hover:bg-surface-subtle hover:text-ink"
        >
          <IconX size={16} />
        </button>

        <div className="flex flex-col items-center gap-3 pt-2 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-accent-soft text-accent-hover">
            {current.icon}
          </span>
          <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-ink">{current.title}</h2>
          <p className="min-h-12 text-[13px] leading-relaxed text-ink-secondary">
            {current.description}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5" aria-hidden="true">
          {STEPS.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to step ${i + 1}`}
              onClick={() => setStep(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? 'w-5 bg-accent' : 'w-1.5 bg-surface-tone hover:bg-border-hover'
              }`}
            />
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-[13px] text-ink-tertiary transition-colors hover:text-ink"
          >
            Skip
          </button>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="rounded-lg border border-border-subtle px-3 py-1.5 text-[13px] text-ink transition-colors hover:bg-surface-subtle"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={() => (isLast ? onClose() : setStep((s) => s + 1))}
              className="rounded-lg bg-accent px-3.5 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-accent-hover"
            >
              {isLast ? 'Get started' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
