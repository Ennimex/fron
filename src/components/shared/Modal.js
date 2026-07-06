import React, { useEffect, useRef, useCallback, useId } from "react";
import { createPortal } from "react-dom";
import stylesGlobal from "../../styles/stylesGlobal";

/**
 * Modal accesible reutilizable — patrón ARIA "dialog" completo.
 *
 * Cumple:
 * - role="dialog" + aria-modal="true"
 * - aria-labelledby al título (id generado con useId; se puede sobreescribir)
 * - el foco ENTRA al diálogo al abrir (dirigible con initialFocusRef)
 * - focus-trap: Tab / Shift+Tab ciclan dentro del diálogo
 * - Escape cierra
 * - el foco REGRESA al disparador al cerrar; si ya no existe, va a un fallback sensato
 * - se monta en un PORTAL a document.body (evita que un ancestro con transform/filter
 *   rompa el position:fixed, y permite apagar el fondo para el lector)
 * - fondo inerte real: inert + aria-hidden sobre el root de la app mientras está abierto
 *
 * Nota: si el contenido necesita una región viva, el consumidor debe usar el patrón
 * persistente (contenedor role="status"/"alert" SIEMPRE presente que solo cambia texto).
 */

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

// Enfoca un elemento haciéndolo enfocable de forma temporal si hiciera falta.
function focusSafely(el) {
  if (!el || typeof el.focus !== "function") return;
  if (!el.hasAttribute("tabindex")) {
    el.setAttribute("tabindex", "-1");
    el.addEventListener("blur", () => el.removeAttribute("tabindex"), { once: true });
  }
  el.focus();
}

export default function Modal({
  isOpen,
  onClose,
  title,
  titleId: titleIdProp,
  labelledBy,
  children,
  initialFocusRef,
  maxWidth = 520,
  closeLabel = "Cerrar",
}) {
  const generatedId = useId();
  const titleId = titleIdProp || `modal-title-${generatedId}`;

  const overlayRef = useRef(null);
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);

  // Guarda el elemento con foco al abrir para devolvérselo al cerrar.
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement;
    }
  }, [isOpen]);

  // Al abrir: bloquea scroll (compensando la barra), inerta el fondo y mueve el foco.
  // Al cerrar: restaura todo EN ORDEN (quitar inert antes de devolver el foco).
  useEffect(() => {
    if (!isOpen) return undefined;

    const body = document.body;
    const root = document.getElementById("root");
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;

    // Compensa el ancho de la barra de scroll para evitar salto horizontal.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      const current = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${current + scrollbarWidth}px`;
    }

    // Fondo inerte para puntero, teclado y lector (el modal está fuera de #root vía portal).
    if (root) {
      root.setAttribute("aria-hidden", "true");
      try { root.inert = true; } catch (e) { /* inert no soportado: aria-hidden basta */ }
    }

    const toFocus =
      (initialFocusRef && initialFocusRef.current) ||
      dialogRef.current?.querySelector(FOCUSABLE_SELECTOR) ||
      dialogRef.current;
    const raf = requestAnimationFrame(() => toFocus?.focus());

    return () => {
      cancelAnimationFrame(raf);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
      // Quitar la inercia ANTES de devolver el foco (el disparador vive dentro de #root).
      if (root) {
        root.removeAttribute("aria-hidden");
        try { root.inert = false; } catch (e) { /* no-op */ }
      }
      const trigger = triggerRef.current;
      if (trigger && document.contains(trigger) && typeof trigger.focus === "function") {
        trigger.focus();
      } else {
        // Fallback sensato si el disparador ya no está en el DOM.
        const fallback = document.querySelector("main, [role='main'], h1");
        focusSafely(fallback || document.body);
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

  const overlay = (
    <div
      ref={overlayRef}
      onMouseDown={(e) => {
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

  return createPortal(overlay, document.body);
}
