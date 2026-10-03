# fron — sitio web de La Aterciopelada

Contexto de negocio y reglas del workspace: ver `../CLAUDE.md`.

## Stack
- React 18 con Create React App, `HashRouter` (las URLs llevan `/#/`). Bootstrap + estilos inline desde `src/styles/stylesGlobal.js` y `src/styles/adminTheme.js`.
- Gestor: **pnpm**. Deploy en Vercel (`fron-gamma.vercel.app`) con `CI=true`: cualquier warning de lint rompe el build.
- API: `src/services/api.js` apunta a `https://back-yvy1.onrender.com/api` (override con `REACT_APP_API_URL`). Render gratuito duerme; `components/shared/Skeleton.js` muestra el aviso de espera.

## Dónde está cada cosa
- Rutas y layouts: `src/App.js` (público / privado / admin), `src/routes/PrivateRoute.js` (`allowedRoles`).
- Páginas: `src/pages/public`, `src/pages/Private` (perfil, favoritos, solicitudes), `src/pages/Admin` (una pantalla por módulo; varias pasan de 1 000 líneas, la mayor es `GestionProductos.js` con ~1 460: usar grep antes de leer completa).
- Estado global: `src/context/AuthContext.js`, `ConfigContext.js` (configuración del sitio desde la API), `FavoritosContext.js`.
- Servicios HTTP: `src/services/adminServices.js` (CRUD + notificaciones) y un `*Service.js` por módulo; hooks en `src/services/adminHooks.js`.
- Kit UI del panel admin: `src/components/admin/ui/` (AdminHeader, AdminModal, Campo, Botones, ConfirmDialog, ListaFilas, StatCard). Toda pantalla admin nueva usa este kit.

## Reglas
- Notificaciones del panel solo con `useAdminNotifications` + `NotificationContainer` (una instancia por página).
- Modales con `components/shared/Modal.js` (accesible, portal, foco). No crear overlays a mano.
- No tocar `src/services/base.js` ni `components/shared/CartWidget.js`: son código muerto (CartContext no existe). Pendientes de borrar.
- Teléfono de WhatsApp real hardcodeado en `SolicitudModal.js`, `Destacados.js` y `ProductoDetalle.js`; debe salir de `ConfigContext`.
