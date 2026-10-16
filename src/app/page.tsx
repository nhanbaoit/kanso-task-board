'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { useTasks } from '@/hooks/useTasks'
import { useUI } from '@/components/UIContext'
import { BoardHeader } from '@/components/BoardHeader'
import { Column } from '@/components/Column'
import { TaskCard } from '@/components/TaskCard'
import { TaskModal } from '@/components/TaskModal'
import { COLUMNS, type ColumnId, type Task, type TaskDraft } from '@/types'

type FilterMode = 'all' | 'high' | 'urgent'
type SortMode = 'due' | 'new'

const DUE_MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

function dueTs(due?: string): number {
  if (!due) return Number.POSITIVE_INFINITY
  const monthIdx = DUE_MONTHS.findIndex((m) => due.toLowerCase().includes(m))
  const dayMatch = due.match(/(\d{1,2})/)
  if (monthIdx === -1 || !dayMatch) return Number.POSITIVE_INFINITY
  return new Date(2024, monthIdx, Number.parseInt(dayMatch[1], 10)).getTime()
}

const COLUMN_DOTS: Record<ColumnId, string> = {
  todo: 'bg-ink-tertiary',
  inprogress: 'bg-accent animate-pulse',
  done: 'bg-accent-soft ring-1 ring-border-subtle',
}

export default function BoardPage() {
  const { tasks, loading, isRemote, addTask, updateTask, deleteTask, moveTask } = useTasks()
  const { query, setSearchOpen } = useUI()

  const [filter, setFilter] = useState<FilterMode>('all')
  const [sort, setSort] = useState<SortMode>('due')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [modal, setModal] = useState<{ open: boolean; task?: Task; column?: ColumnId }>({
    open: false,
  })

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const openNewTask = (column?: ColumnId) => setModal({ open: true, column })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const typing =
        target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT'
      if (typing || modal.open) return
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault()
        openNewTask()
      } else if (e.key === '/') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modal.open, setSearchOpen])

  const visible = useMemo(() => {
    let list = tasks
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          (t.description ?? '').toLowerCase().includes(q),
      )
    }
    if (filter !== 'all') list = list.filter((t) => t.priority === filter)
    const byDue = (a: Task, b: Task) => dueTs(a.dueDate) - dueTs(b.dueDate)
    const byNew = (a: Task, b: Task) => b.createdAt - a.createdAt
    return [...list].sort(sort === 'due' ? byDue : byNew)
  }, [tasks, query, filter, sort])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    if (!over) return
    const targetCol =
      (over.data.current?.columnId as ColumnId | undefined) ??
      tasks.find((t) => t.id === over.id)?.column
    if (!targetCol) return
    const current = tasks.find((t) => t.id === active.id)
    if (current && current.column !== targetCol) moveTask(current.id, targetCol)
  }

  const handleSave = (draft: TaskDraft) => {
    if (modal.task) updateTask(modal.task.id, draft)
    else addTask(draft)
  }

  const activeTask = activeId ? (tasks.find((t) => t.id === activeId) ?? null) : null

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-8">
      <BoardHeader
        tasks={tasks}
        filter={filter}
        onFilterChange={setFilter}
        sort={sort}
        onSortChange={setSort}
        onNewTask={() => openNewTask()}
      />

      {loading && (
        <div className="flex items-center gap-2 text-[12px] text-ink-tertiary">
          <span className="size-1.5 animate-pulse rounded-full bg-accent" />
          Syncing tasks from Supabase…
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              id={col.id}
              label={col.label}
              dotClass={COLUMN_DOTS[col.id]}
              tasks={visible.filter((t) => t.column === col.id)}
              onAddTask={(column) => openNewTask(column)}
              onOpenTask={(task) => setModal({ open: true, task })}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.2, 0, 0, 1)' }}>
          {activeTask && (
            <div className="rotate-[1.5deg] shadow-drag">
              <TaskCard task={activeTask} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <footer className="mt-2 flex flex-col items-center justify-between gap-2 border-t border-border-subtle/60 pt-4 text-[11px] text-ink-tertiary sm:flex-row">
        <div className="flex items-center gap-4">
          <span>
            Press{' '}
            <kbd className="rounded bg-surface-tone px-1.5 py-0.5 font-mono text-[11px] text-ink-secondary">
              C
            </kbd>{' '}
            to quick-create task
          </span>
          <span>
            <kbd className="rounded bg-surface-tone px-1.5 py-0.5 font-mono text-[11px] text-ink-secondary">
              /
            </kbd>{' '}
            to command bar
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`size-2 rounded-full ${loading ? 'animate-pulse bg-warning' : 'bg-accent'}`} />
          <span>
            {loading
              ? 'Syncing…'
              : isRemote
                ? 'All changes synced to Supabase'
                : 'Saved in this browser (offline mode)'}
          </span>
        </div>
      </footer>

      <TaskModal
        open={modal.open}
        task={modal.task}
        defaultColumn={modal.column}
        onClose={() => setModal({ open: false })}
        onSave={handleSave}
        onDelete={deleteTask}
      />
    </div>
  )
}
