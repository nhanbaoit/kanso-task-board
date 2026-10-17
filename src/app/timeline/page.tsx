'use client'

import { useTasks } from '@/hooks/useTasks'
import { TimelineView } from '@/components/ListTimeline'

export default function TimelinePage() {
  const { tasks } = useTasks()

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-8">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-[22px] font-semibold tracking-[-0.015em] text-ink">Roadmap</h1>
        <p className="text-[13px] text-ink-secondary">
          Tasks with due dates laid out by month
        </p>
      </div>

      <TimelineView tasks={tasks} />
    </div>
  )
}
