const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

// Legacy seeds store "Oct 24" text; tasks created through the modal store ISO
// "YYYY-MM-DD" from the native date picker. Normalize everything to ISO.
export function toISODate(due?: string | null): string | undefined {
  if (!due) return undefined
  if (/^\d{4}-\d{2}-\d{2}$/.test(due)) return due
  const now = new Date()
  if (/^today$/i.test(due.trim())) {
    return isoFromParts(now.getFullYear(), now.getMonth() + 1, now.getDate())
  }
  if (/^tomorrow$/i.test(due.trim())) {
    const t = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    return isoFromParts(t.getFullYear(), t.getMonth() + 1, t.getDate())
  }
  const monthIdx = MONTHS.findIndex((m) => due.toLowerCase().includes(m))
  const dayMatch = due.match(/(\d{1,2})/)
  if (monthIdx === -1 || !dayMatch) return undefined
  const day = Number.parseInt(dayMatch[1], 10)
  if (day < 1 || day > 31) return undefined
  return isoFromParts(now.getFullYear(), monthIdx + 1, day)
}

function isoFromParts(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

export function isoFromDate(d: Date): string {
  return isoFromParts(d.getFullYear(), d.getMonth() + 1, d.getDate())
}

export function dateFromISO(iso?: string): Date | undefined {
  const normalized = toISODate(iso)
  if (!normalized) return undefined
  const [y, m, d] = normalized.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function formatDueDate(due?: string): string {
  const iso = toISODate(due)
  if (!iso) return due ?? ''
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function isOverdue(due: string | undefined, done: boolean): boolean {
  const iso = toISODate(due)
  if (!iso || done) return false
  const [y, m, d] = iso.split('-').map(Number)
  const dueTs = new Date(y, m - 1, d).getTime()
  const now = new Date()
  return dueTs < new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
}
