interface OrnamentProps {
  className?: string
}

export function Ornament({ className }: OrnamentProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 18"
      width="240"
      height="18"
      aria-hidden="true"
      style={{ display: 'block', maxWidth: '100%', color: 'var(--color-accent)' }}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        <path d="M4 9 H92" opacity="0.5" />
        <path d="M148 9 H236" opacity="0.5" />
        <path d="M92 9 c6 -7 14 -7 18 0 c-4 5 -10 5 -12 1" />
        <path d="M148 9 c-6 -7 -14 -7 -18 0 c4 5 10 5 12 1" />
      </g>
      <path d="M120 3 L126 9 L120 15 L114 9 Z" fill="currentColor" />
      <circle cx="120" cy="9" r="1.6" fill="var(--color-bg)" />
    </svg>
  )
}
