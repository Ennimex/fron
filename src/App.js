import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
// Importación de layouts
import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";
// Importación de páginas públicas
import Inicio from "./pages/public/Inicio";
import Productos from "./pages/public/Productos";
import Servicios from "./pages/public/Servicios";
import Nosotros from "./pages/public/Nosotros";
import Contacto from "./pages/public/Contacto";
import Login from "./pages/public/Login";
import Galeria from "./pages/public/Galeria";
import ProductoDetalle from "./pages/public/ProductoDetalle";
// Importación de componentes privados
import Perfil from "./pages/Private/Perfil";
/*
";
import MisProductos from "./pages/Private/MisProductos";
import Mensajes from "./pages/Private/Mensajes";
import HistorialCompras from "./pages/Private/HistorialCompras";
import MiCuenta from "./pages/Private/MiCuenta";
*/
import { AuthProvider} from "./context/AuthContext";

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
              <Route path="/servicios" element={<Servicios />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/login" element={<Login />} />
              <Route path="/galeria" element={<Galeria />} />
            </Route>

            {/* Rutas Privadas usando PrivateLayout */}
            <Route element={<PrivateLayout />}>
              <Route path="/Inicio" element={<PrivateRoute><Inicio/></PrivateRoute>}/>
              <Route path="/perfil" element={<PrivateRoute><Perfil/></PrivateRoute>}/>
            </Route>
            
            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;