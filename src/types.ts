export type ColumnId = 'todo' | 'inprogress' | 'done'

export type Priority = 'low' | 'high' | 'urgent'

export interface Task {
  id: string
  key: string
  title: string
  description?: string
  column: ColumnId
  tags: string[]
  priority?: Exclude<Priority, 'low'> | 'low'
  dueDate?: string
  dueTone?: 'normal' | 'highlight'
  checklist?: { done: number; total: number }
  attachments?: number
  assignee?: string
  completedNote?: string
  preview?: 'pricing'
  createdAt: number
}

export type TaskDraft = Omit<Task, 'id' | 'key' | 'createdAt'>

export const COLUMNS: { id: ColumnId; label: string }[] = [
  { id: 'todo', label: 'To Do' },
  { id: 'inprogress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
]
