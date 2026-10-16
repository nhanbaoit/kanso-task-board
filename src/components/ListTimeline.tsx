'use client'

import type { Task } from '../types'
import { COLUMNS } from '../types'

const AVATAR_TONES = [
  'bg-accent-soft text-accent-hover',
  'bg-info-soft text-info',
  'bg-warning-soft text-warning',
  'bg-urgent-soft text-urgent',
  'bg-surface-tone text-ink-secondary',
]

function avatarTone(initials: string) {
  const sum = [...initials].reduce((a, c) => a + c.charCodeAt(0), 0)
  return AVATAR_TONES[sum % AVATAR_TONES.length]
}

export function ListView({
  tasks,
  onToggleDone,
  onOpenTask,
}: {
  tasks: Task[]
  onToggleDone: (id: string) => void
  onOpenTask: (task: Task) => void
}) {
  return (
    <div className="overflow-hidden rounded-xl bg-surface shadow-card ring-1 ring-border-subtle/60">
      {COLUMNS.map((col, ci) => {
        const colTasks = tasks.filter((t) => t.column === col.id)
        if (colTasks.length === 0) return null
        return (
          <div key={col.id} className={ci > 0 ? 'border-t border-border-subtle' : ''}>
            <div className="flex items-center gap-2 bg-surface-subtle px-4 py-2.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-secondary">
                {col.label}
              </span>
              <span className="rounded-full bg-surface px-2 py-0.5 font-mono text-[11px] text-ink-tertiary ring-1 ring-border-subtle">
                {colTasks.length}
              </span>
            </div>
            {colTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 border-t border-border-subtle/60 px-4 py-2.5 transition-colors first:border-t-0 hover:bg-surface-subtle"
              >
                <button
                  type="button"
                  aria-label={task.column === 'done' ? 'Mark as not done' : 'Mark as done'}
                  onClick={() => onToggleDone(task.id)}
                  className={`flex size-4 shrink-0 items-center justify-center rounded-sm border transition-colors ${
                    task.column === 'done'
                      ? 'border-accent bg-accent text-white'
                      : 'border-[#D5D1C7] bg-surface hover:border-accent'
                  }`}
                >
                  {task.column === 'done' && (
                    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 12.5 4.5 4.5L19 7.5" />
                    </svg>
                  )}
                </button>
                <span className="hidden shrink-0 font-mono text-[11px] text-ink-tertiary sm:inline">
                  {task.key}
                </span>
                <button
                  type="button"
                  onClick={() => onOpenTask(task)}
                  className={`min-w-0 flex-1 truncate text-left text-[13px] ${
                    task.column === 'done' ? 'text-ink-secondary line-through' : 'text-ink'
                  } hover:text-accent`}
                >
                  {task.title}
                </button>
                <div className="hidden shrink-0 items-center gap-1.5 md:flex">
                  {task.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-surface-tone px-2 py-0.5 text-[11px] text-ink-secondary">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="hidden w-14 shrink-0 text-right text-[11px] text-ink-tertiary sm:inline">
                  {task.dueDate ?? '—'}
                </span>
                {task.assignee ? (
                  <span
                    className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-medium ${avatarTone(task.assignee)}`}
                  >
                    {task.assignee}
                  </span>
                ) : (
                  <span className="size-5 shrink-0 rounded-full border border-dashed border-border-subtle" />
                )}
              </div>
            ))}
          </div>
        )
      })}
      {tasks.length === 0 && (
        <div className="px-4 py-10 text-center text-[13px] text-ink-tertiary">No tasks found</div>
      )}
    </div>
  )
}

const MONTH_DAYS = 31

function dayOf(due?: string): number | null {
  if (!due) return null
  const m = due.match(/(\d{1,2})/)
  if (!m) return null
  const day = Number.parseInt(m[1], 10)
  return day >= 1 && day <= MONTH_DAYS ? day : null
}

export function TimelineView({ tasks }: { tasks: Task[] }) {
  const withDay = tasks.map((t) => ({ task: t, day: dayOf(t.dueDate) })).filter((r) => r.day !== null)

  return (
    <div className="rounded-xl bg-surface p-4 shadow-card ring-1 ring-border-subtle/60">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-ink">October</h2>
        <span className="text-[12px] text-ink-tertiary">Q3 Go-To-Market · Sprint 4</span>
      </div>
      <div className="mb-1.5 flex justify-between px-0.5 font-mono text-[10px] text-ink-tertiary">
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i}>{i * 3 + 1}</span>
        ))}
      </div>
      <div className="flex flex-col gap-1.5">
        {withDay.map(({ task, day }) => (
          <div key={task.id} className="relative h-7">
            <div className="absolute inset-x-0 top-1/2 h-px bg-border-subtle/50" />
            <div
              className="absolute top-0 flex h-7 items-center gap-1.5 rounded-md bg-surface-subtle px-2 ring-1 ring-border-subtle"
              style={{ left: `${(((day as number) - 1) / MONTH_DAYS) * 100}%`, maxWidth: '60%' }}
            >
              <span
                className={`size-1.5 shrink-0 rounded-full ${
                  task.column === 'done' ? 'bg-accent' : task.column === 'inprogress' ? 'bg-warning' : 'bg-ink-tertiary'
                }`}
              />
              <span
                className={`truncate text-[12px] ${
                  task.column === 'done' ? 'text-ink-tertiary line-through' : 'text-ink'
                }`}
              >
                {task.title}
              </span>
            </div>
          </div>
        ))}
        {withDay.length === 0 && (
          <div className="py-8 text-center text-[13px] text-ink-tertiary">
            No scheduled tasks to show
          </div>
        )}
      </div>
    </div>
  )
}
