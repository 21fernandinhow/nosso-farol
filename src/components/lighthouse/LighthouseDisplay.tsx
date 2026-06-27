interface LighthouseDisplayProps {
  isLit: boolean
}

export const LighthouseDisplay = ({ isLit }: LighthouseDisplayProps) => (
  <svg
    viewBox="-22 0 124 200"
    className={`w-56 h-auto select-none${isLit ? " animate-[glow-pulse_3s_ease-in-out_infinite]" : ""}`}
    xmlns="http://www.w3.org/2000/svg"
    aria-label={isLit ? "Farol aceso" : "Farol apagado"}
    role="img"
  >
    {/* Glow (aceso) — centrado na lente */}
    {isLit && (
      <>
        <circle cx="40" cy="52" r="40" fill="#FCD34D" opacity="0.07" />
        <circle cx="40" cy="52" r="24" fill="#FCD34D" opacity="0.14" />
      </>
    )}

    {/* Ilha */}
    <ellipse cx="40" cy="172" rx="58" ry="18" fill="#7a5c14" />
    <ellipse cx="40" cy="169" rx="48" ry="12" fill="#c4921a" />

    {/* Torre (+6 em todos os y) */}
    <path d="M 12 168 L 68 168 L 54 68 L 26 68 Z" fill="#d44040" />

    {/* Faixa clara inferior */}
    <path d="M 18 144 L 62 144 L 59 124 L 21 124 Z" fill="#f09090" />

    {/* Faixa clara superior */}
    <path d="M 34 104 L 46 104 L 44 84 L 36 84 Z" fill="#f09090" />

    {/* Sacada / galeria */}
    <rect x="22" y="64" width="36" height="5" rx="1" fill="#7b1c1c" />

    {/* Sala da lanterna */}
    <rect x="26" y="44" width="28" height="22" rx="2" fill="#7b1c1c" />

    {/* Divisórias verticais */}
    <line x1="33" y1="44" x2="33" y2="66" stroke="#5c1010" strokeWidth="1.5" />
    <line x1="40" y1="44" x2="40" y2="66" stroke="#5c1010" strokeWidth="1.5" />
    <line x1="47" y1="44" x2="47" y2="66" stroke="#5c1010" strokeWidth="1.5" />

    {/* Cúpula */}
    <path d="M 22 44 L 58 44 L 40 28 Z" fill="#7b1c1c" />

    {/* Lente */}
    {isLit ? (
      <>
        <circle cx="40" cy="55" r="8" fill="#FCD34D" />
        <circle cx="40" cy="55" r="5" fill="#FEF9C3" />
      </>
    ) : (
      <circle cx="40" cy="55" r="8" fill="#5c1010" />
    )}
  </svg>
)
