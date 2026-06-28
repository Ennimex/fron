import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Importación de layouts
import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";
import AdminLayout from "./layouts/AdminLayout";

// Importación de páginas públicas
import Inicio from "./pages/public/Inicio";
import Productos from "./pages/public/Productos";
import Servicios from "./pages/public/Servicios";
import Nosotros from "./pages/public/Nosotros";
import Contacto from "./pages/public/Contacto";
import Login from "./pages/public/Login";
import Destacados from "./pages/public/Destacados";
import ProductoDetalle from "./pages/public/ProductoDetalle";
import GaleriaCompleta from "./pages/public/GaleriaCompleta";
import RecuperarContrasena from "./pages/public/RecuperarContrasena";
import ResetPassword from "./pages/public/ResetPassword";

// Importación de componentes privados
import Perfil from "./pages/Private/PerfilNuevo";
import MisFavoritos from "./pages/Private/MisFavoritos";
import MisSolicitudes from "./pages/Private/MisSolicitudes";
// import MisProductos from "./pages/Private/MisProductos";
// import Mensajes from "./pages/Private/Mensajes";
// import HistorialCompras from "./pages/Private/HistorialCompras";
// import MiCuenta from "./pages/Private/MiCuenta";

// Importación de componentes de administración
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUsersView from "./pages/Admin/AdminUsersView";
import AdminPerfil from "./pages/Admin/AdminPerfil";
import AdminNuevoProducto from "./pages/Admin/GestionProductos";
import GestionTallas from "./pages/Admin/GestionTallas";
import GestionCategorias from "./pages/Admin/GestionCategorias";
import GestorLocalidades from "./pages/Admin/GestorLocalidades";
import GestionFotos from "./pages/Admin/GestionFotos";
import GestionVideos from "./pages/Admin/GestionVideos";
import GestionEventos from "./pages/Admin/GestionEventos";
import GestionMision from "./pages/Admin/GestionMision";
import GestionServicio from "./pages/Admin/GestionServicio";
import GestionConfiguracion from "./pages/Admin/GestionConfiguracion";
import GestionNosotros from "./pages/Admin/GestionNosotros";
import GestionColaboradores from "./pages/Admin/GestionColaboradores";
import GestionSolicitudes from "./pages/Admin/GestionSolicitudes";

// import AdminProductosView from "./pages/Admin/AdminProductosView";
// import AdminProductoCreate from "./pages/Admin/AdminProductoCreate";
// import AdminCategoriasView from "./pages/Admin/AdminCategoriasView";

import { AuthProvider } from "./context/AuthContext";
import { ConfigProvider } from "./context/ConfigContext";
import { FavoritosProvider } from "./context/FavoritosContext";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <ConfigProvider>
      <FavoritosProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Rutas Públicas usando PublicLayout */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Inicio />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/producto/:id" element={<ProductoDetalle />} />
              <Route path="/servicios" element={<Servicios />} />              
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/login" element={<Login />} />
              <Route path="/destacados" element={<Destacados />} />
              <Route path="/catalogofotos" element={<GaleriaCompleta />} />
              <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
            </Route>

            {/* Rutas Privadas usando PrivateLayout */}
            <Route element={<PrivateLayout />}>
              <Route path="/Inicio" element={<PrivateRoute><Inicio /></PrivateRoute>} />
              <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
              <Route path="/favoritos" element={<PrivateRoute><MisFavoritos /></PrivateRoute>} />
              <Route path="/solicitudes" element={<PrivateRoute><MisSolicitudes /></PrivateRoute>} />
            </Route>

            {/* Rutas de administración usando AdminLayout */}
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<PrivateRoute allowedRoles={["admin"]}><AdminDashboard /></PrivateRoute>} />
              <Route path="/admin/perfil" element={<PrivateRoute allowedRoles={["admin"]}><AdminPerfil /></PrivateRoute>} />
              <Route path="/admin/usuarios" element={<PrivateRoute allowedRoles={["admin"]}><AdminUsersView /></PrivateRoute>} />
              <Route path="/admin/solicitudes" element={<PrivateRoute allowedRoles={["admin"]}><GestionSolicitudes /></PrivateRoute>} />
              <Route path="/admin/productos/nuevo" element={<PrivateRoute allowedRoles={["admin"]}><AdminNuevoProducto /></PrivateRoute>} />
              <Route path="/admin/productos/tallas" element={<PrivateRoute allowedRoles={["admin"]}><GestionTallas /></PrivateRoute>} />
              <Route path="/admin/productos/categorias" element={<PrivateRoute allowedRoles={["admin"]}><GestionCategorias /></PrivateRoute>} />
              <Route path="/admin/localidades" element={<PrivateRoute allowedRoles={["admin"]}><GestorLocalidades /></PrivateRoute>} />
              <Route path="/admin/galeria/fotos" element={<PrivateRoute allowedRoles={["admin"]}><GestionFotos /></PrivateRoute>} />
              <Route path="/admin/galeria/videos" element={<PrivateRoute allowedRoles={["admin"]}><GestionVideos /></PrivateRoute>} />
              <Route path="/admin/eventos" element={<PrivateRoute allowedRoles={["admin"]}><GestionEventos /></PrivateRoute>} />
              <Route path="/admin/informacion/mision" element={<PrivateRoute allowedRoles={["admin"]}><GestionMision /></PrivateRoute>} />
              <Route path="/admin/informacion/servicios" element={<PrivateRoute allowedRoles={["admin"]}><GestionServicio /></PrivateRoute>} />
              <Route path="/admin/configuracion" element={<PrivateRoute allowedRoles={["admin"]}><GestionConfiguracion /></PrivateRoute>} />
              <Route path="/admin/informacion/nosotros" element={<PrivateRoute allowedRoles={["admin"]}><GestionNosotros /></PrivateRoute>} />
              <Route path="/admin/informacion/colaboradores" element={<PrivateRoute allowedRoles={["admin"]}><GestionColaboradores /></PrivateRoute>} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
      </FavoritosProvider>
      </ConfigProvider>
    </AuthProvider>
  );
}

export default App;