import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";
import Inicio from "./pages/public/Inicio";
import Productos from "./pages/public/Productos";
import Servicios from "./pages/public/Servicios";
import Nosotros from "./pages/public/Nosotros";
import Contacto from "./pages/public/Contacto";
import Login from "./pages/public/Login";
import Galeria from "./pages/public/Galeria";
import ProductoDetalle from "./pages/public/ProductoDetalle";
import Carrito from "./pages/public/Carrito";
import Politicas from "./pages/public/Politicas";

import InicioPrivate from "./pages/Private/InicioPrivate";
import Perfil from "./pages/Private/Perfil";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Componente para rutas privadas
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user.isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
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
                <Route path="/carrito" element={<Carrito />} />
                <Route path="/politicas" element={<Politicas />} />
              </Route>

              {/* Rutas Privadas usando PrivateLayout y protegidas con PrivateRoute */}
              <Route element={<PrivateLayout />}>
                <Route path="/inicio-privado" element={<PrivateRoute><InicioPrivate /></PrivateRoute>}/>
                <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>}/>
              </Route>
              {/* Redirección por defecto */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;