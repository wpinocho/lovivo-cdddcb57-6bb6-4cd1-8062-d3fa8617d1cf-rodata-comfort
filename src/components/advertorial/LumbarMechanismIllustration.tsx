/**
 * Ilustración (no foto): piloto de perfil inclinado sobre la moto,
 * zona lumbar resaltada. Vectorial → pesa casi nada en móvil.
 */
export const LumbarMechanismIllustration = () => (
  <svg
    viewBox="0 0 400 260"
    role="img"
    aria-label="Ilustración: piloto de perfil inclinado hacia adelante, con la zona lumbar resaltada en rojo"
    className="w-full h-auto text-destructive"
  >
    <defs>
      <radialGradient id="adv-lumbar-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.85" />
        <stop offset="55%" stopColor="currentColor" stopOpacity="0.35" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Piso */}
    <line x1="20" y1="232" x2="380" y2="232" className="stroke-brand-steel/40" strokeWidth="2" />

    {/* Moto */}
    <g className="stroke-brand-steel" fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="95" cy="196" r="34" />
      <circle cx="310" cy="196" r="34" />
      <path d="M95 196 L140 150 L240 148 L310 196" />
      <path d="M262 112 L292 112 M282 112 L310 196" />
    </g>
    <path d="M182 146 Q200 116 248 124 L244 148 Z" className="fill-brand-steel" />
    <path d="M112 142 L186 142" className="stroke-brand-steel" strokeWidth="10" strokeLinecap="round" />

    {/* Piloto */}
    <g className="stroke-brand-smoke" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M156 128 L226 82" strokeWidth="22" />
      <path d="M226 84 L276 112" strokeWidth="11" />
      <path d="M158 130 L212 144 L200 192" strokeWidth="15" />
    </g>
    <circle cx="242" cy="62" r="17" className="fill-brand-smoke" />

    {/* Zona lumbar */}
    <circle cx="164" cy="114" r="34" fill="url(#adv-lumbar-glow)" />
    <path d="M152 124 L178 107" stroke="currentColor" strokeWidth="22" strokeLinecap="round" opacity="0.9" />

    {/* Anotación */}
    <line x1="148" y1="100" x2="104" y2="70" stroke="currentColor" strokeWidth="2" />
    <circle cx="104" cy="70" r="3.5" fill="currentColor" />
    <text x="14" y="32" className="fill-brand-offwhite font-inter" fontSize="21" fontWeight="700">
      Zona lumbar
    </text>
    <text x="14" y="54" className="fill-brand-smoke font-inter" fontSize="16">
      trabaja sin respaldo
    </text>
  </svg>
)