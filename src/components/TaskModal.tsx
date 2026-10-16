'use client'

import { useEffect, useState } from 'react'
import { COLUMNS, type ColumnId, type Priority, type Task, type TaskDraft } from '../types'
import { IconTrash, IconX } from '../icons'

interface TaskModalProps {
  open: boolean
  task?: Task
  defaultColumn?: ColumnId
  onClose: () => void
  onSave: (draft: TaskDraft) => void
  onDelete: (id: string) => void
}

const EMPTY: TaskDraft = {
  title: '',
  description: '',
  column: 'todo',
  tags: [],
  priority: undefined,
  dueDate: '',
  assignee: '',
}

export function TaskModal({ open, task, defaultColumn, onClose, onSave, onDelete }: TaskModalProps) {
  const [draft, setDraft] = useState<TaskDraft>(EMPTY)

  useEffect(() => {
    if (!open) return
    if (task) {
      const { id: _id, key: _key, createdAt: _createdAt, ...rest } = task
      setDraft({
        ...EMPTY,
        ...rest,
        dueDate: rest.dueDate ?? '',
        assignee: rest.assignee ?? '',
        description: rest.description ?? '',
      })
    } else {
      setDraft({ ...EMPTY, column: defaultColumn ?? 'todo' })
    }
  }, [open, task, defaultColumn])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const set = <K extends keyof TaskDraft>(field: K, value: TaskDraft[K]) =>
    setDraft((d) => ({ ...d, [field]: value }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft.title.trim()) return
    onSave({
      ...draft,
      title: draft.title.trim(),
      tags: draft.tags.filter(Boolean),
    })
    onClose()
  }

  const inputClass =
    'h-9 w-full rounded-md border border-border-subtle bg-surface px-2.5 text-[13px] text-ink outline-none transition-shadow placeholder:text-ink-tertiary focus:border-accent focus:shadow-[0_0_0_2px_#EDF3EE]'
  const labelClass = 'text-[11px] font-medium uppercase tracking-wider text-ink-secondary'

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-ink/25 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <form
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        aria-label={task ? 'Edit task' : 'New task'}
        className="relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-surface shadow-overlay sm:rounded-xl"
      >
        <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[15px] font-semibold text-ink">
              {task ? `Edit ${task.key}` : 'New Task'}
            </h2>
            {task && (
              <span className="rounded-full bg-surface-tone px-2 py-0.5 font-mono text-[11px] text-ink-secondary">
                {task.key}
              </span>
            )}
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-secondary transition-colors hover:bg-surface-subtle hover:text-ink"
          >
            <IconX size={17} />
          </button>
        </div>

        <div className="flex flex-col gap-3.5 overflow-y-auto px-4 py-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="task-title" className={labelClass}>
              Title
            </label>
            <input
              id="task-title"
              value={draft.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="What needs to be done?"
              autoFocus
              required
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="task-desc" className={labelClass}>
              Description
            </label>
            <textarea
              id="task-desc"
              value={draft.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Add more detail (optional)"
              rows={3}
              className="w-full resize-none rounded-md border border-border-subtle bg-surface px-2.5 py-2 text-[13px] text-ink outline-none transition-shadow placeholder:text-ink-tertiary focus:border-accent focus:shadow-[0_0_0_2px_#EDF3EE]"
            />
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="task-column" className={labelClass}>
                Column
              </label>
              <select
                id="task-column"
                value={draft.column}
                onChange={(e) => set('column', e.target.value as ColumnId)}
                className={inputClass}
              >
                {COLUMNS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="task-priority" className={labelClass}>
                Priority
              </label>
              <select
                id="task-priority"
                value={draft.priority ?? ''}
                onChange={(e) =>
                  set('priority', (e.target.value || undefined) as Priority | undefined)
                }
                className={inputClass}
              >
                <option value="">None</option>
                <option value="low">Low</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="task-due" className={labelClass}>
                Due date
              </label>
              <div className="relative">
                <input
                  id="task-due"
                  type="date"
                  value={draft.dueDate}
                  onChange={(e) => set('dueDate', e.target.value)}
                  className={inputClass}
                />
                {draft.dueDate && (
                  <button
                    type="button"
                    aria-label="Clear due date"
                    title="Clear due date"
                    onClick={() => set('dueDate', '')}
                    className="absolute right-7 top-1/2 -translate-y-1/2 rounded p-0.5 text-ink-tertiary transition-colors hover:text-ink"
                  >
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="m6 6 12 12M18 6 6 18" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="task-assignee" className={labelClass}>
                Assignee (initials)
              </label>
              <input
                id="task-assignee"
                value={draft.assignee}
                onChange={(e) => set('assignee', e.target.value.slice(0, 3))}
                placeholder="e.g. JD"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="task-tags" className={labelClass}>
              Tags (comma separated)
            </label>
            <input
              id="task-tags"
              value={draft.tags.join(', ')}
              onChange={(e) =>
                set(
                  'tags',
                  e.target.value.split(',').map((t) => t.trim()),
                )
              }
              placeholder="e.g. Design, Engineering"
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border-subtle px-4 py-3">
          {task ? (
            <button
              type="button"
              onClick={() => {
                onDelete(task.id)
                onClose()
              }}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-urgent transition-colors hover:bg-urgent-soft"
            >
              <IconTrash size={15} />
              Delete
            </button>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border-subtle px-3 py-1.5 text-[13px] text-ink transition-colors hover:bg-surface-subtle"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-accent px-3.5 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-accent-hover"
            >
              {task ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
