'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ColumnId, Task, TaskDraft } from '../types'
import { SEED_TASKS } from '../data'
import { getSupabase, isSupabaseConfigured } from '../lib/supabase'

const STORAGE_KEY = 'kanso-tasks-v1'

interface DBTask {
  id: string
  task_key: string
  title: string
  description: string | null
  status: ColumnId
  tags: string[] | null
  priority: Task['priority'] | null
  due_date: string | null
  due_tone: Task['dueTone'] | null
  checklist_done: number | null
  checklist_total: number | null
  attachments: number | null
  assignee: string | null
  completed_note: string | null
  preview: string | null
  created_at: string
}

function rowToTask(r: DBTask): Task {
  return {
    id: r.id,
    key: r.task_key,
    title: r.title,
    description: r.description ?? undefined,
    column: r.status,
    tags: r.tags ?? [],
    priority: r.priority ?? undefined,
    dueDate: r.due_date ?? undefined,
    dueTone: r.due_tone ?? undefined,
    checklist:
      r.checklist_done != null && r.checklist_total != null
        ? { done: r.checklist_done, total: r.checklist_total }
        : undefined,
    attachments: r.attachments ?? undefined,
    assignee: r.assignee ?? undefined,
    completedNote: r.completed_note ?? undefined,
    preview: (r.preview as Task['preview']) ?? undefined,
    createdAt: Date.parse(r.created_at),
  }
}

function draftToRow(draft: TaskDraft) {
  return {
    title: draft.title,
    description: draft.description || null,
    status: draft.column,
    tags: draft.tags.length > 0 ? draft.tags : null,
    priority: draft.priority ?? null,
    due_date: draft.dueDate || null,
    due_tone: draft.dueTone ?? null,
    checklist_done: draft.checklist?.done ?? null,
    checklist_total: draft.checklist?.total ?? null,
    attachments: draft.attachments ?? null,
    assignee: draft.assignee || null,
    completed_note: draft.completedNote || null,
    preview: draft.preview ?? null,
  }
}

function loadLocal(): Task[] {
  if (typeof window === 'undefined') return SEED_TASKS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return SEED_TASKS
    const parsed = JSON.parse(raw) as Task[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_TASKS
  } catch {
    return SEED_TASKS
  }
}

function nextKey(tasks: Task[]): string {
  const max = tasks.reduce((acc, t) => {
    const n = Number.parseInt(t.key.replace('KAN-', ''), 10)
    return Number.isNaN(n) ? acc : Math.max(acc, n)
  }, 100)
  return `KAN-${max + 1}`
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(loadLocal)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [isRemote, setIsRemote] = useState(false)
  const keyRef = useRef(0)

  useEffect(() => {
    const sb = getSupabase()
    if (!sb) return

    let cancelled = false
    setLoading(true)
    sb.from('tasks')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return
        if (error || !data) {
          console.error('Supabase fetch failed, using local data:', error?.message)
          setTasks(loadLocal())
          setIsRemote(false)
        } else {
          const rows = data as DBTask[]
          setTasks(rows.length > 0 ? rows.map(rowToTask) : SEED_TASKS)
          setIsRemote(true)
        }
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  // Mirror tasks to localStorage so refreshes feel instant even in remote mode,
  // and so the app still works if Supabase is unreachable.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    }
  }, [tasks])

  const addTask = useCallback(
    (draft: TaskDraft) => {
      const sb = getSupabase()
      if (!sb) {
        setTasks((prev) => [
          ...prev,
          { ...draft, id: crypto.randomUUID(), key: nextKey(prev), createdAt: Date.now() },
        ])
        return
      }
      keyRef.current += 1
      const payload = { ...draftToRow(draft), task_key: nextKey(tasks) }
      sb.from('tasks')
        .insert(payload)
        .select()
        .single()
        .then(({ data, error }) => {
          if (error || !data) {
            console.error('Supabase insert failed:', error?.message)
            return
          }
          setTasks((prev) =>
            prev.some((t) => t.id === (data as DBTask).id)
              ? prev
              : [...prev, rowToTask(data as DBTask)],
          )
        })
    },
    [tasks],
  )

  const updateTask = useCallback((id: string, draft: TaskDraft) => {
    const sb = getSupabase()
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...draft } : t)))
    if (!sb) return
    sb.from('tasks')
      .update(draftToRow(draft))
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.error('Supabase update failed:', error.message)
      })
  }, [])

  const deleteTask = useCallback((id: string) => {
    const sb = getSupabase()
    setTasks((prev) => prev.filter((t) => t.id !== id))
    if (!sb) return
    sb.from('tasks')
      .delete()
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.error('Supabase delete failed:', error.message)
      })
  }, [])

  const moveTask = useCallback((id: string, column: ColumnId) => {
    const sb = getSupabase()
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              column,
              completedNote:
                column === 'done' && t.column !== 'done' ? 'Completed just now' : t.completedNote,
            }
          : t,
      ),
    )
    if (!sb) return
    sb.from('tasks')
      .update({ status: column })
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.error('Supabase move failed:', error.message)
      })
  }, [])

  const toggleDone = useCallback((id: string) => {
    const sb = getSupabase()
    let target: Task | undefined
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t
        target = t
        const nowDone = t.column !== 'done'
        return {
          ...t,
          column: nowDone ? 'done' : 'todo',
          completedNote: nowDone ? 'Completed just now' : undefined,
        }
      }),
    )
    if (!sb || !target) return
    const nowDone = target.column !== 'done'
    sb.from('tasks')
      .update({ status: nowDone ? 'done' : 'todo', completed_note: nowDone ? 'Completed just now' : null })
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.error('Supabase toggle failed:', error.message)
      })
  }, [])

  return { tasks, loading, isRemote, addTask, updateTask, deleteTask, moveTask, toggleDone }
}
