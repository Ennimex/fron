/**
 * CSS base compartido del kit de UI del panel admin.
 * Se inyecta una sola vez; cubre lo que los estilos inline de React no pueden:
 * hovers, animaciones y el apilado responsivo de encabezados y filas-tarjeta.
 */
const css = `
  @keyframes adminuiVeloIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes adminuiModalIn {
    from { opacity: 0; transform: translateY(14px) scale(0.98); }
    to { opacity: 1; transform: none; }
  }
  .adminui-overlay { animation: adminuiVeloIn 0.2s ease-out; }
  .adminui-modal { animation: adminuiModalIn 0.25s ease-out; }
  .adminui-cerrar { transition: all 0.15s ease; }
  .adminui-cerrar:hover { background-color: #fdf2f4 !important; color: #d63384 !important; border-color: #f5c6d8 !important; }

  .admin-fila { transition: box-shadow 0.15s ease; }
  .admin-fila:hover { box-shadow: 0 4px 18px rgba(45, 40, 35, 0.1); }
  .adminui-btn-icono { transition: filter 0.15s ease; }
  .adminui-btn-icono:hover { filter: brightness(0.94); }

  @media (max-width: 768px) {
    .admin-header { flex-direction: column !important; align-items: stretch !important; }
    .admin-thead { display: none !important; }
    .admin-fila { grid-template-columns: 1fr !important; gap: 0.75rem !important; }
    .admin-acciones { justify-content: flex-start !important; }
  }
  @media (max-width: 560px) {
    .adminui-modal { margin: 8px !important; width: calc(100% - 16px) !important; }
    .adminui-pie { flex-direction: column-reverse !important; align-items: stretch !important; }
    .adminui-pie button { width: 100%; justify-content: center; }
  }
`;

export const asegurarCssAdminUi = () => {
  if (typeof document === "undefined") return;
  if (document.head.querySelector("style[data-admin-ui]")) return;
  const el = document.createElement("style");
  el.setAttribute("data-admin-ui", "true");
  el.textContent = css;
  document.head.appendChild(el);
};

export default asegurarCssAdminUi;
