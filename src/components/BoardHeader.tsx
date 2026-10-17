'use client'

import { useState } from 'react'
import type { Task } from '../types'
import { useUI } from './UIContext'
import { Dropdown, DropdownItem } from './Dropdown'
import {
  IconCheckCircle,
  IconFilter,
  IconPerson,
  IconPlus,
  IconSort,
  IconSpeed,
  IconPending,
} from '../icons'

type SortMode = 'due' | 'new'
type FilterMode = 'all' | 'high' | 'urgent'

interface BoardHeaderProps {
  tasks: Task[]
  filter: FilterMode
  onFilterChange: (f: FilterMode) => void
  sort: SortMode
  onSortChange: (s: SortMode) => void
  onNewTask: () => void
}

export function BoardHeader({
  tasks,
  filter,
  onFilterChange,
  sort,
  onSortChange,
  onNewTask,
}: BoardHeaderProps) {
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const { user } = useUI()

  const displayName = user?.email
    ? user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1)
    : 'there'

  const total = tasks.length
  const done = tasks.filter((t) => t.column === 'done').length
  const active = total - done
  const velocity = total > 0 ? Math.round((done / total) * 100) : 0
  const blockers = tasks.filter((t) => t.column === 'inprogress' && t.priority === 'urgent').length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div className="flex flex-col gap-1">
          <h1 className="text-[22px] font-semibold tracking-[-0.015em] text-ink">
            Welcome back, {displayName}
          </h1>
          <p className="flex flex-wrap items-center gap-2 text-[13px] text-ink-secondary">
            <span>Product Launch</span>
            <span className="size-1 rounded-full bg-border-subtle" />
            <span>Q3 Go-To-Market</span>
            <span className="size-1 rounded-full bg-border-subtle" />
            <span>{active} active tasks</span>
            <span className="size-1 rounded-full bg-border-subtle" />
            <span className="font-medium text-accent">Sprint 4 (3 days remaining)</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="mr-1 flex items-center -space-x-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-surface-tone text-ink-secondary ring-2 ring-canvas">
              <IconPerson size={13} />
            </span>
            <span className="flex size-7 items-center justify-center rounded-full bg-info-soft text-[11px] font-medium text-info ring-2 ring-canvas">
              EL
            </span>
            <span className="flex size-7 items-center justify-center rounded-full bg-accent-soft text-[11px] font-medium text-accent-hover ring-2 ring-canvas">
              MK
            </span>
            <span className="flex size-7 items-center justify-center rounded-full bg-surface-tone text-[11px] font-medium text-ink-secondary ring-2 ring-canvas">
              +4
            </span>
          </div>
          <span className="mx-0.5 hidden h-4 w-px bg-border-subtle sm:block" />

          <Dropdown
            label={`Priority · ${filter === 'all' ? 'All' : filter === 'high' ? 'High' : 'Urgent'}`}
            icon={<IconFilter size={15} />}
            open={filterOpen}
            onOpenChange={setFilterOpen}
          >
            <DropdownItem active={filter === 'all'} onClick={() => { onFilterChange('all'); setFilterOpen(false) }}>
              All
            </DropdownItem>
            <DropdownItem active={filter === 'high'} onClick={() => { onFilterChange('high'); setFilterOpen(false) }}>
              High priority
            </DropdownItem>
            <DropdownItem active={filter === 'urgent'} onClick={() => { onFilterChange('urgent'); setFilterOpen(false) }}>
              Urgent only
            </DropdownItem>
          </Dropdown>

          <Dropdown
            label={`Sort · ${sort === 'due' ? 'Due date' : 'Newest'}`}
            icon={<IconSort size={15} />}
            open={sortOpen}
            onOpenChange={setSortOpen}
          >
            <DropdownItem active={sort === 'due'} onClick={() => { onSortChange('due'); setSortOpen(false) }}>
              Due date
            </DropdownItem>
            <DropdownItem active={sort === 'new'} onClick={() => { onSortChange('new'); setSortOpen(false) }}>
              Newest first
            </DropdownItem>
          </Dropdown>

          <button
            type="button"
            onClick={onNewTask}
            className="flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-[13px] font-medium text-white transition-all hover:bg-ink/85 active:scale-95"
          >
            <IconPlus size={15} />
            <span>Add New</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <StatCard label="Overall Velocity" value={`${velocity}% Done`} icon={<IconSpeed size={19} />} tone="accent" />
        <StatCard label="Remaining Work" value={`${active} Tasks`} icon={<IconPending size={19} />} tone="warning" />
        <StatCard
          label="Blockers"
          value={blockers === 0 ? 'None active' : `${blockers} active`}
          icon={<IconCheckCircle size={19} />}
          tone={blockers === 0 ? 'success' : 'urgent'}
        />
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string
  value: string
  icon: React.ReactNode
  tone: 'accent' | 'success' | 'warning' | 'urgent' | 'info'
}) {
  const toneClass =
    tone === 'accent'
      ? 'text-accent'
      : tone === 'success'
        ? 'text-success'
        : tone === 'warning'
          ? 'text-warning'
          : tone === 'urgent'
            ? 'text-urgent'
            : 'text-info'
  return (
    <div className="flex items-center justify-between rounded-lg bg-surface p-3 shadow-card ring-1 ring-border-subtle/60">
      <div className="flex flex-col">
        <span className="text-[11px] font-medium uppercase tracking-wider text-ink-secondary">{label}</span>
        <span className="mt-0.5 text-[18px] font-semibold tracking-[-0.01em] text-ink">{value}</span>
      </div>
      <span className={`flex size-10 items-center justify-center rounded-full bg-surface-subtle ring-1 ring-border-subtle/60 ${toneClass}`}>
        {icon}
      </span>
    </div>
  )
}

