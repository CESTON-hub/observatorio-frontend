// Logotipo oficial de ACIEM: dos triángulos rojos con abertura central
// y wordmark "ACIEM" en negro, geometría reconstruida como SVG vectorial.
export function AciemLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1024 1024" className={className} role="img" aria-label="ACIEM">
      <polygon points="478,96 64,690 494,690" fill="#E30613" />
      <polygon points="546,96 960,690 530,690" fill="#E30613" />
      <text
        x="512"
        y="905"
        textAnchor="middle"
        fontFamily="var(--font-dm-sans), Arial, sans-serif"
        fontWeight="800"
        fontSize="200"
        letterSpacing="2"
        fill="#1a1a1a"
      >
        ACIEM
      </text>
    </svg>
  );
}
