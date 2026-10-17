const AVATAR_TONES = [
  'bg-accent-soft text-accent-hover',
  'bg-info-soft text-info',
  'bg-warning-soft text-warning',
  'bg-urgent-soft text-urgent',
  'bg-surface-tone text-ink-secondary',
]

export function avatarTone(initials: string): string {
  const sum = [...initials].reduce((a, c) => a + c.charCodeAt(0), 0)
  return AVATAR_TONES[sum % AVATAR_TONES.length]
}
