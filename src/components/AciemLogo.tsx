// Marca gráfica provisional inspirada en el logo de ACIEM (triángulos rojos).
// Reemplazar por el activo oficial de marca antes del lanzamiento.
export function AciemLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 34" className={className} aria-label="ACIEM">
      <polygon points="20,0 30,17 10,17" fill="#c41414" />
      <polygon points="10,17 20,34 0,34" fill="#c41414" />
      <polygon points="30,17 40,34 20,34" fill="#c41414" />
      <text x="20" y="31" textAnchor="middle" fontSize="7" fontWeight="700" fill="#fff" fontFamily="inherit">
        ACIEM
      </text>
    </svg>
  );
}
