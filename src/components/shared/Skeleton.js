import React, { useEffect, useState } from "react";
import stylesGlobal from "../../styles/stylesGlobal";

/**
 * Estados de carga reutilizables para "La Aterciopelada".
 *
 * Motivo: el backend gratuito de Render "se duerme" y la primera carga del día
 * puede tardar ~50s. Un spinner mudo hace creer que la app está rota
 * (viola NN/g #1 "visibilidad del estado del sistema"). En su lugar mostramos
 * skeletons (mejor rendimiento percibido, web.dev) y un mensaje escalonado que
 * explica la espera del cold start.
 */

const SHIMMER_CSS = `
  @keyframes lae-shimmer {
    0% { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
`;

// Bloque base con animación shimmer.
export const Skeleton = ({ width = "100%", height = 16, radius = stylesGlobal.borders.radius.md, style = {} }) => (
  <span
    aria-hidden="true"
    style={{
      display: "block",
      width,
      height: typeof height === "number" ? `${height}px` : height,
      borderRadius: radius,
      background: `linear-gradient(90deg, ${stylesGlobal.colors.neutral[200]} 25%, ${stylesGlobal.colors.neutral[100]} 37%, ${stylesGlobal.colors.neutral[200]} 63%)`,
      backgroundSize: "800px 100%",
      animation: "lae-shimmer 1.4s ease-in-out infinite",
      ...style,
    }}
  />
);

// Tarjeta skeleton: imagen + dos líneas de texto.
export const SkeletonCard = () => (
  <div style={{ ...stylesGlobal.components.card.base, padding: 0, overflow: "hidden" }}>
    <Skeleton height={200} radius="0px" />
    <div
      style={{
        padding: stylesGlobal.spacing.scale[4],
        display: "flex",
        flexDirection: "column",
        gap: stylesGlobal.spacing.scale[3],
      }}
    >
      <Skeleton height={18} width="70%" />
      <Skeleton height={14} width="45%" />
    </div>
  </div>
);

// Rejilla de tarjetas skeleton que imita la de un catálogo.
export const SkeletonGrid = ({ count = 8, minCard = 260 }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: `repeat(auto-fill, minmax(${minCard}px, 1fr))`,
      gap: stylesGlobal.spacing.scale[6],
      width: "100%",
    }}
  >
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
    <style>{SHIMMER_CSS}</style>
  </div>
);

/**
 * Nivel de mensaje según cuánto lleva cargando:
 * 0 = aún nada (carga normal), 1 = "tarda un poco", 2 = "servidor despertando".
 */
export const useWakeLevel = (active, { firstDelay = 6000, secondDelay = 12000 } = {}) => {
  const [level, setLevel] = useState(0);
  useEffect(() => {
    if (!active) {
      setLevel(0);
      return;
    }
    const t1 = setTimeout(() => setLevel(1), firstDelay);
    const t2 = setTimeout(() => setLevel(2), secondDelay);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [active, firstDelay, secondDelay]);
  return level;
};

// Mensaje escalonado accesible. `light` para fondos oscuros.
export const WakeMessage = ({ active, light = false }) => {
  const level = useWakeLevel(active);
  if (!active || level === 0) return null;
  const msg =
    level >= 2
      ? "Estamos despertando el servidor, puede tardar hasta 1 min. Gracias por tu paciencia 🙏"
      : "Esto está tardando un poco más de lo normal…";
  return (
    <p
      role="status"
      aria-live="polite"
      style={{
        marginTop: stylesGlobal.spacing.scale[5],
        marginBottom: 0,
        color: light ? "rgba(255, 255, 255, 0.92)" : stylesGlobal.colors.text.secondary,
        fontSize: stylesGlobal.typography.scale.sm,
        textAlign: "center",
        maxWidth: 440,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      {msg}
    </p>
  );
};
