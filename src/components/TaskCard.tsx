'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from '../types'
import { tagTone } from '../lib/tagTone'
import { formatDueDate, isOverdue } from '../lib/dueDate'

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

export function TaskCard({ task, onOpen }: { task: Task; onOpen?: () => void }) {
  const isDone = task.column === 'done'
  const overdue = isOverdue(task.dueDate, isDone)

  return (
    <article
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && onOpen) onOpen()
      }}
      tabIndex={0}
      role="button"
      aria-label={task.title}
      className={`group flex cursor-grab flex-col gap-2 rounded-lg border border-border-subtle bg-surface p-3 shadow-card transition-all hover:-translate-y-px hover:border-border-hover hover:shadow-card-hover active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        isDone ? 'bg-surface/80' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {task.priority === 'urgent' && (
            <span className="rounded-full border border-urgent/20 bg-urgent-soft px-2 py-0.5 text-[11px] font-medium text-urgent">
              Urgent
            </span>
          )}
          {task.priority === 'high' && (
            <span className="rounded-full border border-warning/20 bg-warning-soft px-2 py-0.5 text-[11px] font-medium text-warning">
              High Priority
            </span>
          )}
          {task.priority === 'low' && (
            <span className="rounded-full border border-success/20 bg-success-soft px-2 py-0.5 text-[11px] font-medium text-success">
              Low Priority
            </span>
          )}
          {task.tags.map((tag) => (
            <span key={tag} className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${tagTone(tag)}`}>
              {tag}
            </span>
          ))}
          {isDone && (
            <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-success">
              <IconCheckCircleSmall />
              Resolved
            </span>
          )}
        </div>
        <span className="text-ink-tertiary opacity-0 transition-opacity group-hover:opacity-100">
          <IconMoreVSmall />
        </span>
      </div>

      <p
        className={`text-[14px] font-medium leading-snug ${
          isDone ? 'text-ink-secondary line-through' : 'text-ink'
        }`}
      >
        {task.title}
      </p>

      {task.description && !task.preview && (
        <p className="line-clamp-2 text-[13px] leading-[1.45] text-ink-secondary">{task.description}</p>
      )}

      {task.preview === 'pricing' && (
        <div className="flex flex-col gap-1.5 rounded-md bg-surface-subtle p-2">
          <div className="flex items-center justify-between font-mono text-[11px] text-ink-tertiary">
            <span>pricing-v2-grid.fig</span>
            <span className="font-medium text-accent">Auto-layout</span>
          </div>
          <div className="flex h-6 gap-1.5">
            <span className="flex w-1/3 items-center justify-center rounded bg-surface-tone text-[11px] text-ink-secondary">
              Starter
            </span>
            <span className="flex w-1/3 items-center justify-center rounded bg-accent-soft text-[11px] font-medium text-accent-hover">
              Pro
            </span>
            <span className="flex w-1/3 items-center justify-center rounded bg-surface-tone text-[11px] text-ink-secondary">
              Scale
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-0.5 text-[11px] font-medium text-ink-secondary">
        <div className="flex items-center gap-1.5">
          {task.completedNote ? (
            <span className="text-ink-tertiary">{task.completedNote}</span>
          ) : (
            <>
              <span
                className={`flex items-center gap-1 ${
                  overdue
                    ? 'font-medium text-urgent'
                    : task.dueTone === 'highlight'
                      ? 'font-medium text-warning'
                      : 'text-ink-tertiary'
                }`}
              >
                <IconFlagSmall />
                {task.dueDate ? formatDueDate(task.dueDate) : 'No date'}
              </span>
              {task.attachments != null && task.attachments > 0 && (
                <span className="flex items-center gap-0.5 text-ink-tertiary">
                  <IconAttachmentSmall />
                  {task.attachments}
                </span>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          {task.checklist && (
            <span className="flex items-center gap-0.5 text-ink-tertiary">
              <IconChecklistSmall />
              {task.checklist.done}/{task.checklist.total}
            </span>
          )}
          {task.assignee && (
            <span
              className={`flex size-5 items-center justify-center rounded-full text-[10px] font-medium ${avatarTone(task.assignee)}`}
            >
              {task.assignee}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

export function SortableTaskCard({ task, onOpen }: { task: Task; onOpen: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { columnId: task.column },
  })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className={isDragging ? 'opacity-40' : undefined}
    >
      <TaskCard task={task} onOpen={onOpen} />
    </div>
  )
}

function IconMoreVSmall() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="5" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="12" cy="19" r="1.6" />
    </svg>
  )
}

function IconCheckCircleSmall() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12.2 2.4 2.4 4.8-5" />
    </svg>
  )
}

function IconFlagSmall() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 21V4.5" />
      <path d="M5 4.5h11.5l-2 3.5 2 3.5H5" />
    </svg>
  )
}

function IconAttachmentSmall() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m20 11.5-7.9 7.9a5 5 0 0 1-7-7l8.6-8.6a3.4 3.4 0 0 1 4.8 4.8l-8.5 8.5a1.8 1.8 0 0 1-2.5-2.5l7.8-7.8" />
    </svg>
  )
}

function IconChecklistSmall() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="4.5" width="7" height="7" rx="1.5" />
      <path d="m5.5 8 1.6 1.6L10 6.7" />
      <path d="M14 6.5h6M14 8.5h4M4 16.5h16M4 19.5h9" />
    </svg>
  )
}
