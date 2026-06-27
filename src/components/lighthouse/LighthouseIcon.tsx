interface LighthouseIconProps {
  className?: string
  isLit?: boolean
}

export const LighthouseIcon = ({ className = "w-6 h-6", isLit = false }: LighthouseIconProps) => (
  <svg
    viewBox="0 0 40 72"
    className={`${className} select-none`}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {isLit && (
      <circle cx="20" cy="18" r="16" fill="#FCD34D" opacity="0.2" />
    )}

    {/* Torre */}
    <path d="M 4 66 L 36 66 L 28 30 L 12 30 Z" fill="#d44040" />

    {/* Sacada */}
    <rect x="8" y="27" width="24" height="4" rx="1" fill="#7b1c1c" />

    {/* Sala da lanterna */}
    <rect x="12" y="14" width="16" height="14" rx="1.5" fill="#7b1c1c" />

    {/* Cúpula */}
    <path d="M 10 14 L 30 14 L 20 4 Z" fill="#7b1c1c" />

    {/* Lente */}
    {isLit ? (
      <>
        <circle cx="20" cy="21" r="5" fill="#FCD34D" />
        <circle cx="20" cy="21" r="3" fill="#FEF9C3" />
      </>
    ) : (
      <circle cx="20" cy="21" r="5" fill="#5c1010" />
    )}
  </svg>
)
