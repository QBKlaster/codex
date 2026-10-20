type Props = { variant: 'mix' | 'slabs' | 'blocks'; className?: string }

export function ProductVisual({ variant, className = '' }: Props) {
  const id = `concrete-${variant}`
  return (
    <svg className={`product-visual ${className}`} viewBox="0 0 480 300" role="img" aria-label={variant === 'mix' ? 'Beton namunasi' : variant === 'slabs' ? 'Temir-beton yopma plitalari' : 'Beton qurilish bloklari'}>
      <defs>
        <filter id={`${id}-texture`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="3" stitchTiles="stitch" result="noise" />
          <feColorMatrix in="noise" type="saturate" values="0" />
          <feBlend in="SourceGraphic" mode="soft-light" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
        <filter id={`${id}-shadow`} x="-50%" y="-100%" width="200%" height="300%"><feGaussianBlur stdDeviation="11" /></filter>
        <linearGradient id={`${id}-top`} x2="0.5" y2="1"><stop stopColor="#d6d5cd" /><stop offset="1" stopColor="#b7b7ae" /></linearGradient>
        <linearGradient id={`${id}-front`} x2="0.8" y2="1"><stop stopColor="#aaa99f" /><stop offset="1" stopColor="#818078" /></linearGradient>
        <linearGradient id={`${id}-side`}><stop stopColor="#73746e" /><stop offset="1" stopColor="#999990" /></linearGradient>
      </defs>
      <ellipse cx="245" cy="250" rx="145" ry="16" fill="#858277" opacity=".22" filter={`url(#${id}-shadow)`} />
      {variant === 'mix' && <>
        <g filter={`url(#${id}-texture)`}>
          <path d="m137 118 103-48 104 48-104 52z" fill={`url(#${id}-top)`} />
          <path d="m137 118 103 52v111l-103-54z" fill={`url(#${id}-front)`} />
          <path d="m240 170 104-52v109l-104 54z" fill={`url(#${id}-side)`} />
        </g>
        <path d="m160 119 80-36 79 36-79 38z" fill="none" stroke="#dfded4" opacity=".5" />
        <g transform="translate(280 228) rotate(-20)"><path d="m0 0 75-7 14 20-83 6z" fill="#c4c5bf" stroke="#96978f" /><path d="m38 2 0-13" stroke="#74786e" strokeWidth="7" /><rect x="21" y="-21" width="40" height="12" rx="6" fill="#f46536" /></g>
      </>}
      {variant === 'slabs' && <g transform="translate(0 12)">
        {[42, 0, -42].map((y) => <g key={y} transform={`translate(0 ${y})`}>
          <g filter={`url(#${id}-texture)`}>
            <path d="m89 165 194-93 111 52-196 96z" fill={`url(#${id}-top)`} />
            <path d="m89 165 109 55v33L89 198z" fill={`url(#${id}-front)`} />
            <path d="m198 220 196-96v33l-196 96z" fill={`url(#${id}-side)`} />
          </g>
          {[0, 1, 2, 3, 4].map((n) => <ellipse key={n} cx={107 + n * 18} cy={185 + n * 9} rx="6.5" ry="9" transform={`rotate(-24 ${107 + n * 18} ${185 + n * 9})`} fill="#565851" />)}
          <path d="m109 160 193-91M132 171l193-91M155 182l193-91M178 193l193-91" stroke="#e2e0d5" strokeWidth="1" opacity=".5" />
        </g>)}
      </g>}
      {variant === 'blocks' && <g transform="translate(7 -8)">
        {[[96, 174], [207, 225], [213, 121], [102, 123]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y})`}>
          <g filter={`url(#${id}-texture)`}>
            <path d="m0 0 94-45 93 44-94 45z" fill={`url(#${id}-top)`} />
            <path d="m0 0 93 44v49L0 48z" fill={`url(#${id}-front)`} />
            <path d="m93 44 94-45v48L93 93z" fill={`url(#${id}-side)`} />
          </g>
          <path d="m28 0 24-12 28 13-24 12zM80-25l24-12 28 13-24 12z" fill="#62645c" />
          <path d="m29 0 23-11v9L38 4zM81-25l23-11v9l-14 6z" fill="#42463e" />
        </g>)}
      </g>}
    </svg>
  )
}
