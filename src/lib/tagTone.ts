const TAG_TONES = [
  { chip: 'bg-accent-soft text-accent' },
  { chip: 'bg-success-soft text-success' },
  { chip: 'bg-warning-soft text-warning' },
  { chip: 'bg-info-soft text-info' },
  { chip: 'bg-urgent-soft text-urgent' },
]

export function tagTone(tag: string): string {
  const sum = [...tag].reduce((a, c) => a + c.charCodeAt(0), 0)
  return TAG_TONES[sum % TAG_TONES.length].chip
}
