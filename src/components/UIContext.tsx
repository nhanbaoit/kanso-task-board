'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

interface UIState {
  searchOpen: boolean
  query: string
  sidebarOpen: boolean
  setSearchOpen: (open: boolean) => void
  setQuery: (query: string) => void
  setSidebarOpen: (open: boolean) => void
}

const UIContext = createContext<UIState | null>(null)

export function UIProvider({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <UIContext.Provider
      value={{ searchOpen, query, sidebarOpen, setSearchOpen, setQuery, setSidebarOpen }}
    >
      {children}
    </UIContext.Provider>
  )
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used within UIProvider')
  return ctx
}
