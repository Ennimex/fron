import React, { useEffect, useRef, useCallback } from "react";
import stylesGlobal from "../../styles/stylesGlobal";

/**
 * Modal accesible reutilizable — patrón ARIA "dialog" completo.
 *
 * Cumple:
 * - role="dialog" + aria-modal="true"
 * - aria-labelledby apuntando al título (o al id que se pase en labelledBy)
 * - el foco ENTRA al diálogo al abrir
 * - focus-trap: Tab / Shift+Tab ciclan dentro del diálogo
 * - Escape cierra
 * - el foco REGRESA al elemento disparador al cerrar
 * - fondo inerte para lectores (aria-modal) y para el puntero (overlay a pantalla completa)
 *
 * Nota: si el contenido necesita una región viva, el consumidor debe usar el
 * patrón persistente del sub-commit 2 (contenedor role="status"/"alert" SIEMPRE
 * presente, que solo cambia su texto). Este componente no la monta condicionalmente.
 */

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

export default function Modal({
  isOpen,
  onClose,
  title,
  titleId = "modal-title",
  labelledBy,
  children,
  initialFocusRef,
  maxWidth = 520,
  closeLabel = "Cerrar",
}) {
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);

  // Guarda el elemento con foco al abrir para devolvérselo al cerrar.
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement;
    }
  }, [isOpen]);

  // Al abrir: bloquea el scroll del fondo y mueve el foco al diálogo.
  // Al cerrar/desmontar: restaura scroll y devuelve el foco al disparador.
  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const toFocus =
      (initialFocusRef && initialFocusRef.current) ||
      dialogRef.current?.querySelector(FOCUSABLE_SELECTOR) ||
      dialogRef.current;
    // Espera al pintado para que el nodo exista y sea enfocable.
    const raf = requestAnimationFrame(() => toFocus?.focus());

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = previousOverflow;
      const trigger = triggerRef.current;
      if (trigger && typeof trigger.focus === "function") {
        trigger.focus();
      }
    };
  }, [isOpen, initialFocusRef]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose?.();
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = Array.from(
        dialogRef.current?.querySelectorAll(FOCUSABLE_SELECTOR) || []
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);

      if (focusables.length === 0) {
        // Sin elementos enfocables: mantén el foco en el diálogo.
        e.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || active === dialogRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  if (!isOpen) return null;

  const resolvedLabel = labelledBy || (title != null ? titleId : undefined);

  return (
    <div
      ref={overlayRef}
      onMouseDown={(e) => {
        // Cierra solo si el clic empezó en el overlay, no dentro del diálogo.
        if (e.target === overlayRef.current) onClose?.();
      }}
      onKeyDown={handleKeyDown}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: stylesGlobal.colors.surface.overlay,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: stylesGlobal.spacing.scale[4],
        zIndex: stylesGlobal.utils.zIndex.modal,
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={resolvedLabel}
        tabIndex={-1}
        style={{
          position: "relative",
          background: stylesGlobal.colors.surface.primary,
          borderRadius: stylesGlobal.borders.radius.xl,
          maxWidth,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: stylesGlobal.shadows.xl,
          outline: "none",
        }}
      >
        <button
          type="button"
          onClick={() => onClose?.()}
          aria-label={closeLabel}
          style={{
            position: "absolute",
            top: stylesGlobal.spacing.scale[3],
            right: stylesGlobal.spacing.scale[3],
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            lineHeight: 1,
            color: stylesGlobal.colors.text.secondary,
            background: "transparent",
            border: "none",
            borderRadius: stylesGlobal.borders.radius.full,
            cursor: "pointer",
          }}
        >
          <span aria-hidden="true">×</span>
        </button>

        {title != null && (
          <h2
            id={titleId}
            style={{
              ...stylesGlobal.typography.headings.h4,
              margin: 0,
              padding: `${stylesGlobal.spacing.scale[6]} ${stylesGlobal.spacing.scale[12]} 0 ${stylesGlobal.spacing.scale[6]}`,
            }}
          >
            {title}
          </h2>
        )}

        <div style={{ padding: stylesGlobal.spacing.scale[6] }}>{children}</div>
      </div>
    </div>
  );
}
