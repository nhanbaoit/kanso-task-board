# Kanso — Task Board

![CI](https://github.com/ngnhanbao/kanso-task-board/actions/workflows/ci.yml/badge.svg)

A calm, minimal kanban task board built for focused teams. Full-stack portfolio project: **Next.js (App Router) + TypeScript + Tailwind CSS v4 + Supabase + dnd-kit**.

> *Kanso (簡素)* — the Japanese aesthetic principle of simplicity and omission of clutter. That idea drives every design decision here: warm paper tones, hairline borders, quiet sage accents, and zero visual noise.

## Features

- **Kanban board** — three columns (To Do / In Progress / Done) with smooth drag & drop between columns, powered by `@dnd-kit` with a `DragOverlay` and column highlight states
- **Task CRUD** — create, edit and delete tasks through a modal (press <kbd>C</kbd> anywhere to quick-create)
- **Real database** — tasks persist in **Supabase Postgres** with Row Level Security enabled; every drag, edit and delete syncs instantly
- **Graceful offline fallback** — if the database is unreachable, the app silently degrades to browser localStorage so it never breaks
- **Multiple views** — Board, Backlog List (with checkboxes) and Roadmap timeline, each on its own route
- **Search, filter & sort** — live search across titles, descriptions and tags (press <kbd>/</kbd>), filter by priority, sort by due date or newest
- **Dynamic stats** — velocity, remaining work and blockers computed live from task data
- **Fully responsive** — mobile drawer sidebar, stacked columns on small screens, full three-column layout on desktop

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (custom design tokens via `@theme`) |
| Database | Supabase (Postgres + RLS) |
| Drag & drop | @dnd-kit/core + @dnd-kit/sortable |
| Fonts | Geist & JetBrains Mono via `next/font` |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Run the schema below in the Supabase **SQL Editor**
3. Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

### 3. Database schema

```sql
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  task_key text not null unique,
  title text not null,
  description text,
  status text not null default 'todo'
    check (status in ('todo', 'inprogress', 'done')),
  tags text[],
  priority text check (priority in ('low', 'high', 'urgent')),
  due_date text,
  due_tone text check (due_tone in ('normal', 'highlight')),
  checklist_done int,
  checklist_total int,
  attachments int,
  assignee text,
  completed_note text,
  preview text,
  created_at timestamptz not null default now()
);

alter table public.tasks enable row level security;

create policy "tasks_select" on public.tasks for select using (true);
create policy "tasks_insert" on public.tasks for insert with check (true);
create policy "tasks_update" on public.tasks for update using (true);
create policy "tasks_delete" on public.tasks for delete using (true);
```

> The policies are intentionally permissive for this demo. In a production app with authentication, they should be scoped to `auth.uid()`.

### 4. Run

```bash
npm run dev        # http://localhost:3001
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout: fonts, metadata, UIProvider
│   ├── page.tsx            # Board route (DndContext + DragOverlay)
│   ├── list/page.tsx       # Backlog list route
│   └── timeline/page.tsx   # Roadmap route
├── components/
│   ├── Header.tsx          # Top bar with routing + global search
│   ├── Sidebar.tsx         # Workspace navigation
│   ├── BoardHeader.tsx     # Project title, stats, filter/sort controls
│   ├── Column.tsx          # Droppable kanban column
│   ├── TaskCard.tsx        # Presentational card + sortable wrapper
│   ├── TaskModal.tsx       # Create/edit task dialog
│   ├── ListTimeline.tsx    # Backlog list + roadmap views
│   ├── Dropdown.tsx        # Accessible dropdown primitives
│   └── UIContext.tsx       # Shared UI state (search, sidebar)
├── hooks/
│   └── useTasks.ts         # CRUD + optimistic sync with Supabase
├── lib/
│   └── supabase.ts         # Supabase client singleton
├── types.ts                # Task / Column / Priority types
└── data.ts                 # Seed data
```

## Testing

```bash
npm run test          # single run (CI mode)
npm run test:watch    # watch mode
```

7 unit tests cover the `useTasks` hook: seed loading, task creation with generated keys, cross-column moves, done toggling, deletion and localStorage persistence/restore.

## Roadmap

- [ ] Authentication (Google / email) with scoped RLS policies
- [ ] Multiple boards per workspace
- [ ] Checklist editing directly on cards
- [ ] Realistic due dates with overdue highlighting
- [x] CI with GitHub Actions (typecheck + unit tests + build on every push)
- [x] Unit tests with Vitest + Testing Library

---

Built as a portfolio project. Feedback welcome!
