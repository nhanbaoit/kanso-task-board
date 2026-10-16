import { beforeEach, describe, expect, it } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import { useTasks } from './useTasks'

const STORAGE_KEY = 'kanso-tasks-v1'

describe('useTasks (local mode)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loads the seed tasks on first render', () => {
    const { result } = renderHook(() => useTasks())
    expect(result.current.tasks).toHaveLength(8)
    expect(result.current.isRemote).toBe(false)
    expect(result.current.loading).toBe(false)
  })

  it('adds a task with a generated key', () => {
    const { result } = renderHook(() => useTasks())
    act(() => {
      result.current.addTask({
        title: 'Write unit tests',
        description: 'Cover the useTasks hook',
        column: 'todo',
        tags: ['QA'],
      })
    })
    expect(result.current.tasks).toHaveLength(9)
    const added = result.current.tasks.find((t) => t.title === 'Write unit tests')
    expect(added?.key).toBe('KAN-109')
    expect(added?.tags).toEqual(['QA'])
    expect(added?.createdAt).toBeGreaterThan(0)
  })

  it('moves a task between columns', () => {
    const { result } = renderHook(() => useTasks())
    act(() => {
      result.current.moveTask('t1', 'done')
    })
    const moved = result.current.tasks.find((t) => t.id === 't1')
    expect(moved?.column).toBe('done')
    expect(moved?.completedNote).toBe('Completed just now')
  })

  it('marks a task done via toggleDone and back to todo on second toggle', () => {
    const { result } = renderHook(() => useTasks())
    act(() => {
      result.current.toggleDone('t2')
    })
    let task = result.current.tasks.find((t) => t.id === 't2')
    expect(task?.column).toBe('done')
    expect(task?.completedNote).toBe('Completed just now')

    act(() => {
      result.current.toggleDone('t2')
    })
    task = result.current.tasks.find((t) => t.id === 't2')
    expect(task?.column).toBe('todo')
    expect(task?.completedNote).toBeUndefined()
  })

  it('deletes a task', () => {
    const { result } = renderHook(() => useTasks())
    act(() => {
      result.current.deleteTask('t3')
    })
    expect(result.current.tasks).toHaveLength(7)
    expect(result.current.tasks.find((t) => t.id === 't3')).toBeUndefined()
  })

  it('persists tasks to localStorage after a change', async () => {
    const { result } = renderHook(() => useTasks())
    act(() => {
      result.current.addTask({
        title: 'Persist me',
        column: 'todo',
        tags: [],
      })
    })
    await waitFor(() => {
      const raw = localStorage.getItem(STORAGE_KEY)
      expect(raw).toContain('Persist me')
    })
  })

  it('restores tasks from localStorage on next mount', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          id: 'custom-1',
          key: 'KAN-500',
          title: 'Restored task',
          column: 'inprogress',
          tags: [],
          createdAt: 1,
        },
      ]),
    )
    const { result } = renderHook(() => useTasks())
    expect(result.current.tasks).toHaveLength(1)
    expect(result.current.tasks[0].title).toBe('Restored task')
  })
})
