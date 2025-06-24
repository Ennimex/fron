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

// Importación de componentes privados
import Perfil from "./pages/Private/Perfil";
// import MisProductos from "./pages/Private/MisProductos";
// import Mensajes from "./pages/Private/Mensajes";
// import HistorialCompras from "./pages/Private/HistorialCompras";
// import MiCuenta from "./pages/Private/MiCuenta";

// Importación de componentes de administración
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUsersView from "./pages/Admin/AdminUsersView";
import AdminNuevoProducto from "./pages/Admin/GestionProductos";
import GestionTallas from "./pages/Admin/GestionTallas";
import GestionCategorias from "./pages/Admin/GestionCategorias";
import GestorLocalidades from "./pages/Admin/GestorLocalidades";
import GestionFotos from "./pages/Admin/GestionFotos";
import GestionVideos from "./pages/Admin/GestionVideos";
import GestionEventos from "./pages/Admin/GestionEventos";

// import AdminProductosView from "./pages/Admin/AdminProductosView";
// import AdminProductoCreate from "./pages/Admin/AdminProductoCreate";
// import AdminCategoriasView from "./pages/Admin/AdminCategoriasView";

import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Rutas Públicas usando PublicLayout */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Inicio />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/producto/:id" element={<ProductoDetalle />} />
              <Route path="/servicios" element={<Servicios />} />              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/login" element={<Login />} />
              <Route path="/destacados" element={<Destacados />} />
              <Route path="/catalogofotos" element={<GaleriaCompleta />} /></Route>

            {/* Rutas Privadas usando PrivateLayout */}
            <Route element={<PrivateLayout />}>
              <Route path="/Inicio" element={<PrivateRoute><Inicio /></PrivateRoute>} />
              <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
            </Route>

            {/* Rutas de administración usando AdminLayout */}
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<PrivateRoute allowedRoles={["admin"]}><AdminDashboard /></PrivateRoute>} />
              <Route path="/admin/usuarios" element={<PrivateRoute allowedRoles={["admin"]}><AdminUsersView /></PrivateRoute>} />
              <Route path="/admin/productos/nuevo" element={<PrivateRoute allowedRoles={["admin"]}><AdminNuevoProducto /></PrivateRoute>} />
              <Route path="/admin/productos/tallas" element={<PrivateRoute allowedRoles={["admin"]}><GestionTallas /></PrivateRoute>} />
              <Route path="/admin/productos/categorias" element={<PrivateRoute allowedRoles={["admin"]}><GestionCategorias /></PrivateRoute>} />
              <Route path="/admin/localidades" element={<PrivateRoute allowedRoles={["admin"]}><GestorLocalidades /></PrivateRoute>} />
              <Route path="/admin/galeria/fotos" element={<PrivateRoute allowedRoles={["admin"]}><GestionFotos /></PrivateRoute>} />
              <Route path="/admin/galeria/videos" element={<PrivateRoute allowedRoles={["admin"]}><GestionVideos /></PrivateRoute>} />
              <Route path="/admin/eventos" element={<PrivateRoute allowedRoles={["admin"]}><GestionEventos /></PrivateRoute>} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;