import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Base({ size = 18, children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

export const IconKanban = (p: IconProps) => (
  <Base {...p}>
    <rect x="3.5" y="4" width="4.6" height="13" rx="1" />
    <rect x="9.7" y="4" width="4.6" height="9" rx="1" />
    <rect x="15.9" y="4" width="4.6" height="16" rx="1" />
  </Base>
)

export const IconList = (p: IconProps) => (
  <Base {...p}>
    <circle cx="4.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="4.5" cy="12" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="4.5" cy="17.5" r="0.9" fill="currentColor" stroke="none" />
    <path d="M9 6.5h11M9 12h11M9 17.5h11" />
  </Base>
)

export const IconCalendarWeek = (p: IconProps) => (
  <Base {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
    <path d="M3.5 9.5h17M8.5 9.5v11M15.5 9.5v11M8 3v3M16 3v3" />
  </Base>
)

export const IconSearch = (p: IconProps) => (
  <Base {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-3.8-3.8" />
  </Base>
)

export const IconBell = (p: IconProps) => (
  <Base {...p}>
    <path d="M18 9.5a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6" />
    <path d="M10 19a2.2 2.2 0 0 0 4 0" />
  </Base>
)

export const IconChevronDown = (p: IconProps) => (
  <Base {...p}>
    <path d="m6 9.5 6 6 6-6" />
  </Base>
)

export const IconFilter = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 7h16M7 12h10M10 17h4" />
  </Base>
)

export const IconSort = (p: IconProps) => (
  <Base {...p}>
    <path d="M8 5v14M8 5 5 8.5M8 5l3 3.5M16 19V5M16 19l-3-3.5M16 19l3-3.5" />
  </Base>
)

export const IconShare = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 14V4M12 4 8.5 7.5M12 4l3.5 3.5" />
    <path d="M5 12v6.5a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5V12" />
  </Base>
)

export const IconPlus = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 5v14M5 12h14" />
  </Base>
)

export const IconMoreH = (p: IconProps) => (
  <Base {...p}>
    <circle cx="5" cy="12" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="19" cy="12" r="1.1" fill="currentColor" stroke="none" />
  </Base>
)

export const IconMoreV = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="5" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="19" r="1.1" fill="currentColor" stroke="none" />
  </Base>
)

export const IconCalendar = (p: IconProps) => (
  <Base {...p}>
    <rect x="4" y="5.5" width="16" height="14.5" rx="2" />
    <path d="M4 10h16M8.5 3.5v3M15.5 3.5v3" />
  </Base>
)

export const IconChecklist = (p: IconProps) => (
  <Base {...p}>
    <rect x="4" y="4.5" width="7" height="7" rx="1.5" />
    <path d="m5.5 8 1.6 1.6L10 6.7" />
    <path d="M14 6.5h6M14 8.5h4" />
    <path d="M4 16.5h16M4 19.5h9" />
  </Base>
)

export const IconAttachment = (p: IconProps) => (
  <Base {...p}>
    <path d="m20 11.5-7.9 7.9a5 5 0 0 1-7-7l8.6-8.6a3.4 3.4 0 0 1 4.8 4.8l-8.5 8.5a1.8 1.8 0 0 1-2.5-2.5l7.8-7.8" />
  </Base>
)

export const IconSchedule = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Base>
)

export const IconCheckCircle = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m8.5 12.2 2.4 2.4 4.8-5" />
  </Base>
)

export const IconDrag = (p: IconProps) => (
  <Base {...p}>
    <circle cx="9" cy="6" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="15" cy="6" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="9" cy="12" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="15" cy="12" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="9" cy="18" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="15" cy="18" r="1.2" fill="currentColor" stroke="none" />
  </Base>
)

export const IconArrowDown = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 4v15M12 19l-5-5M12 19l5-5" />
  </Base>
)

export const IconSpeed = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 17.5a8.5 8.5 0 1 1 14 0" />
    <path d="m12 13.5 3.5-4.5" />
    <circle cx="12" cy="14.5" r="1.4" fill="currentColor" stroke="none" />
  </Base>
)

export const IconPending = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 4a8 8 0 1 1-7.6 5.5" />
    <path d="M4.5 4.5v4h4" />
    <path d="M12 8.5V12l2.5 1.7" />
  </Base>
)

export const IconVerified = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3.5 5 6v5.5c0 4.6 3 7.6 7 9 4-1.4 7-4.4 7-9V6l-7-2.5Z" />
    <path d="m9 12 2.2 2.2L15.5 10" />
  </Base>
)

export const IconFlag = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 21V4.5" />
    <path d="M6 5c2.5-1.6 5-1.6 7.5 0s5 1.6 6.5.5V13c-1.5 1.1-4 1.1-6.5-.5S8.5 11.4 6 13" />
  </Base>
)

export const IconTune = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 8h9M17 8h3M4 16h3M11 16h9" />
    <circle cx="15" cy="8" r="2" />
    <circle cx="9" cy="16" r="2" />
  </Base>
)

export const IconPerson = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20a7 7 0 0 1 14 0" />
  </Base>
)

export const IconX = (p: IconProps) => (
  <Base {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </Base>
)

export const IconTrash = (p: IconProps) => (
  <Base {...p}>
    <path d="M4.5 7h15M9.5 7V5.2A1.2 1.2 0 0 1 10.7 4h2.6a1.2 1.2 0 0 1 1.2 1.2V7" />
    <path d="M6.5 7 7.4 19a1.5 1.5 0 0 0 1.5 1.4h6.2A1.5 1.5 0 0 0 16.6 19l.9-12" />
    <path d="M10 11v5M14 11v5" />
  </Base>
)

export const IconMenu = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Base>
)

export const IconLogout = (p: IconProps) => (
  <Base {...p}>
    <path d="M14.5 4H18a1.5 1.5 0 0 1 1.5 1.5v13A1.5 1.5 0 0 1 18 20h-3.5" />
    <path d="M9.5 8.5 6 12l3.5 3.5M6 12h9" />
  </Base>
)

export const IconLogo = ({ size = 32, ...props }: IconProps) => (
  <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true" {...props}>
    <rect width="32" height="32" rx="8" fill="#2563EB" />
    <path
      d="M11 7v18M11 15.5 19.5 7M13.5 13.5 21.5 25"
      stroke="#FFFFFF"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
)
