import React, { useEffect, useRef, useCallback, useId } from "react";
import { createPortal } from "react-dom";
import stylesGlobal from "../../styles/stylesGlobal";

/**
 * Modal accesible reutilizable — patrón ARIA "dialog" completo.
 *
 * Cumple:
 * - role="dialog" + aria-modal="true"
 * - aria-labelledby al título (id con useId; o labelledBy/ariaLabel manual)
 * - el foco ENTRA al diálogo al abrir (dirigible con initialFocusRef), y solo
 *   DESPUÉS se inerta el fondo (evita un frame con foco en subárbol aria-hidden)
 * - focus-trap: Tab / Shift+Tab ciclan dentro del diálogo
 * - Escape cierra; onKeyDown passthrough para teclas propias (p.ej. flechas)
 * - el foco REGRESA al disparador al cerrar; si ya no existe, va a un fallback
 * - portal a document.body (evita romperse por ancestros con transform/filter)
 * - fondo inerte real: inert + aria-hidden sobre #root mientras está abierto
 *
 * Modo `bare`: sin "chrome" de tarjeta (fondo transparente, sin título ni botón
 * de cerrar propios). El propio elemento a pantalla completa ES el role="dialog";
 * pensado para lightbox (imagen/video) que traen su propio cierre y flechas.
 */

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

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
  ariaLabel,
  children,
  initialFocusRef,
  maxWidth = 520,
  closeLabel = "Cerrar",
  bare = false,
  overlayColor,
  onKeyDown,
}) {
  const generatedId = useId();
  const titleId = titleIdProp || `modal-title-${generatedId}`;

  const overlayRef = useRef(null);
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (isOpen) triggerRef.current = document.activeElement;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const body = document.body;
    const root = document.getElementById("root");
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      const current = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${current + scrollbarWidth}px`;
    }

    // 1) foco DENTRO del modal primero
    const toFocus =
      (initialFocusRef && initialFocusRef.current) ||
      dialogRef.current?.querySelector(FOCUSABLE_SELECTOR) ||
      dialogRef.current;
    toFocus?.focus();

    // 2) luego inertar el fondo (el foco ya salió de #root)
    if (root) {
      root.setAttribute("aria-hidden", "true");
      try { root.inert = true; } catch (e) { /* inert no soportado: aria-hidden basta */ }
    }

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
      if (root) {
        root.removeAttribute("aria-hidden");
        try { root.inert = false; } catch (e) { /* no-op */ }
      }
      const trigger = triggerRef.current;
      if (trigger && document.contains(trigger) && typeof trigger.focus === "function") {
        trigger.focus();
      } else {
        const fallback = document.querySelector("main, [role='main'], h1");
        focusSafely(fallback || document.body);
      }
    };
  }, [isOpen, initialFocusRef]);

  const handleKeyDown = useCallback(
    (e) => {
      onKeyDown?.(e); // passthrough (flechas u otras teclas del consumidor)

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
    [onClose, onKeyDown]
  );

  if (!isOpen) return null;

  const resolvedLabel = labelledBy || (title != null ? titleId : undefined);

  // --- Modo bare: el contenedor a pantalla completa ES el diálogo (lightbox) ---
  if (bare) {
    const bareEl = (
      <div
        ref={(node) => {
          overlayRef.current = node;
          dialogRef.current = node;
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={resolvedLabel}
        aria-label={ariaLabel}
        tabIndex={-1}
        onMouseDown={(e) => {
          if (e.target === overlayRef.current) onClose?.();
        }}
        onKeyDown={handleKeyDown}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: overlayColor || "rgba(0, 0, 0, 0.95)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: stylesGlobal.spacing.scale[4],
          zIndex: stylesGlobal.utils.zIndex.modal,
          outline: "none",
        }}
      >
        {children}
      </div>
    );
    return createPortal(bareEl, document.body);
  }

  // --- Modo tarjeta (por defecto) ---
  const cardEl = (
    <div
      ref={overlayRef}
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) onClose?.();
      }}
      onKeyDown={handleKeyDown}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: overlayColor || stylesGlobal.colors.surface.overlay,
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
        aria-label={ariaLabel}
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

  return createPortal(cardEl, document.body);
}
