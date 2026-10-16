'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { ColumnId, Task } from '../types'
import { SortableTaskCard } from './TaskCard'
import { IconPlus, IconMoreH } from '../icons'

interface ColumnProps {
  id: ColumnId
  label: string
  dotClass: string
  tasks: Task[]
  onAddTask: (column: ColumnId) => void
  onOpenTask: (task: Task) => void
}

export function Column({ id, label, dotClass, tasks, onAddTask, onOpenTask }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id, data: { columnId: id } })

  return (
    <section
      ref={setNodeRef}
      aria-label={label}
      className={`flex flex-col rounded-xl p-2 transition-colors ${
        isOver ? 'bg-accent-soft/70 ring-1 ring-accent-ring' : 'bg-surface-tone/60'
      }`}
    >
      <div className="mb-2 flex items-center justify-between px-1.5 py-1.5">
        <div className="flex items-center gap-2">
          <span className={`size-2 rounded-full ${dotClass}`} />
          <h2 className="text-[13px] font-semibold uppercase tracking-wider text-ink">{label}</h2>
          <span className="rounded-full bg-surface px-2 py-0.5 font-mono text-[12px] font-medium text-ink-secondary ring-1 ring-border-subtle">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            title="Quick Add"
            aria-label={`Add task to ${label}`}
            onClick={() => onAddTask(id)}
            className="rounded-md p-1 text-ink-tertiary transition-colors hover:bg-surface hover:text-ink"
          >
            <IconPlus size={15} />
          </button>
          <button
            type="button"
            title="Column Options"
            className="rounded-md p-1 text-ink-tertiary transition-colors hover:bg-surface hover:text-ink"
          >
            <IconMoreH size={15} />
          </button>
        </div>
      </div>

      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex min-h-16 flex-col gap-2">
          {tasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              onOpen={() => onOpenTask(task)}
            />
          ))}

          {tasks.length === 0 && (
            <div
              className={`flex h-20 items-center justify-center rounded-lg border border-dashed text-[12px] text-ink-tertiary ${
                isOver ? 'border-accent-ring bg-accent-soft/50' : 'border-border-subtle'
              }`}
            >
              {isOver ? 'Release to drop here' : 'No tasks yet'}
            </div>
          )}
        </div>
      </SortableContext>

      <button
        type="button"
        onClick={() => onAddTask(id)}
        className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[13px] text-ink-tertiary transition-colors hover:bg-surface hover:text-ink"
      >
        <IconPlus size={15} />
        <span>Add task</span>
      </button>
    </section>
  )
}
