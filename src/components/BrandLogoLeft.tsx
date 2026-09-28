import { Link } from 'react-router-dom'

export const BrandLogoLeft = () => {
  return (
    <Link to="/" aria-label="RODATA — Inicio" className="flex items-center group">
      <span className="font-sora font-extrabold text-xl tracking-[0.08em] uppercase select-none">
        <span className="text-brand-offwhite">RODA</span>
        <span className="text-brand-amber">TA</span>
      </span>
    </Link>
  )
}