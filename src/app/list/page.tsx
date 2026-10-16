'use client'

import { useState } from 'react'
import { useTasks } from '@/hooks/useTasks'
import { ListView } from '@/components/ListTimeline'
import { TaskModal } from '@/components/TaskModal'
import type { Task, TaskDraft } from '@/types'

export default function ListPage() {
  const { tasks, updateTask, deleteTask, toggleDone } = useTasks()
  const [modal, setModal] = useState<{ open: boolean; task?: Task }>({ open: false })

  const handleSave = (draft: TaskDraft) => {
    if (modal.task) updateTask(modal.task.id, draft)
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-8">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-[22px] font-semibold tracking-[-0.015em] text-ink">Backlog List</h1>
        <p className="text-[13px] text-ink-secondary">
          Every task across the board — {tasks.length} total
        </p>
      </div>

      <ListView
        tasks={tasks}
        onToggleDone={toggleDone}
        onOpenTask={(task) => setModal({ open: true, task })}
      />

      <TaskModal
        open={modal.open}
        task={modal.task}
        onClose={() => setModal({ open: false })}
        onSave={handleSave}
        onDelete={deleteTask}
      />
    </div>
  )
}
