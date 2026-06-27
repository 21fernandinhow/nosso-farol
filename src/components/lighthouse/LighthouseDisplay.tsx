interface LighthouseDisplayProps {
  isLit: boolean
}

export const LighthouseDisplay = ({ isLit }: LighthouseDisplayProps) => (
  <svg
    viewBox="0 0 80 180"
    className={`w-56 h-auto select-none${isLit ? " animate-[glow-pulse_3s_ease-in-out_infinite]" : ""}`}
    xmlns="http://www.w3.org/2000/svg"
    aria-label={isLit ? "Farol aceso" : "Farol apagado"}
    role="img"
  >
    {/* Glow (aceso) */}
    {isLit && (
      <>
        <circle cx="40" cy="46" r="40" fill="#FCD34D" opacity="0.07" />
        <circle cx="40" cy="46" r="24" fill="#FCD34D" opacity="0.14" />
      </>
    )}

    {/* Base / mar */}
    <ellipse cx="40" cy="170" rx="30" ry="8" fill="#1e1010" />

    {/* Torre */}
    <path d="M 12 162 L 68 162 L 54 62 L 26 62 Z" fill="#d44040" />

    {/* Faixa clara inferior */}
    <path d="M 18 138 L 62 138 L 59 118 L 21 118 Z" fill="#f09090" />

    {/* Faixa clara superior */}
    <path d="M 34 98 L 46 98 L 44 78 L 36 78 Z" fill="#f09090" />

    {/* Sacada / galeria */}
    <rect x="22" y="58" width="36" height="5" rx="1" fill="#7b1c1c" />

    {/* Sala da lanterna */}
    <rect x="26" y="38" width="28" height="22" rx="2" fill="#7b1c1c" />

    {/* Divisórias verticais */}
    <line x1="33" y1="38" x2="33" y2="60" stroke="#5c1010" strokeWidth="1.5" />
    <line x1="40" y1="38" x2="40" y2="60" stroke="#5c1010" strokeWidth="1.5" />
    <line x1="47" y1="38" x2="47" y2="60" stroke="#5c1010" strokeWidth="1.5" />

    {/* Cúpula */}
    <path d="M 22 38 L 58 38 L 40 22 Z" fill="#7b1c1c" />

    {/* Lente */}
    {isLit ? (
      <>
        <circle cx="40" cy="49" r="8" fill="#FCD34D" />
        <circle cx="40" cy="49" r="5" fill="#FEF9C3" />
      </>
    ) : (
      <circle cx="40" cy="49" r="8" fill="#5c1010" />
    )}
  </svg>
)
