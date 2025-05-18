import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './layouts/public/PublicNavbar.js'; 
import Footer from './layouts/public/Footer.js';
import Inicio from './pages/public/Inicio.js';
import Productos from './pages/public/Productos.js';
import Servicios from './pages/public/Servicios.js';
import Nosotros from './pages/public/Nosotros.js';
import Contacto from './pages/public/Contacto.js';
import Login from './pages/public/Login.js';
import Galeria from './pages/public/Galeria.js';
import ProductoDetalle from './pages/public/ProductoDetalle.js';
import Carrito from "./pages/public/Carrito.js";
import { CartProvider } from './context/CartContext';

/*
// Componentes Administrativos
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';

// Componentes de Usuarios
import UsuariosGeneral from './pages/admin/usuarios/UsuariosGeneral.js';
import UsuariosAltas from './pages/admin/usuarios/UsuariosAltas.js';
import UsuariosBajas from './pages/admin/usuarios/UsuariosBajas.js';
import UsuariosCambios from './pages/admin/usuarios/UsuariosCambios.js';

// Componentes de IoT
import IoTGeneral from './pages/admin/iot/IoTGeneral.js';
import IoTVinculacion from './pages/admin/iot/IoTVinculacion.js';
import IoTAltas from './pages/admin/iot/IoTAltas.js';
import IoTBajas from './pages/admin/iot/IoTBajas.js';
import IoTUsuarios from './pages/admin/iot/IoTUsuarios.js';

// Componentes de Información
import InformacionModificacion from './pages/admin/informacion/InformacionModificacion.js';
import InformacionVista from './pages/admin/informacion/InformacionVista.js';

// Componentes de Políticas
import PoliticasGeneral from './pages/admin/politicas/PoliticasGeneral.js';
import PoliticasEmpresa from './pages/admin/politicas/PoliticasEmpresa.js';
import PoliticasPrivacidad from './pages/admin/politicas/PoliticasPrivacidad.js';
import PoliticasCliente from './pages/admin/politicas/PoliticasCliente.js';

// Componentes de Preguntas Frecuentes
import PreguntasGeneral from './pages/admin/preguntas/PreguntasGeneral.js';
import PreguntasAltas from './pages/admin/preguntas/PreguntasAltas.js';
import PreguntasBajas from './pages/admin/preguntas/PreguntasBajas.js';
import PreguntasCambios from './pages/admin/preguntas/PreguntasCambios.js';
*/
// Componente para envolver las rutas públicas
const PublicRoute = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<PublicRoute><Inicio /></PublicRoute>} />
            <Route path="/productos" element={<PublicRoute><Productos /></PublicRoute>} />
            <Route path="/producto/:id" element={<PublicRoute><ProductoDetalle /></PublicRoute>} />
            <Route path="/servicios" element={<PublicRoute><Servicios /></PublicRoute>} />
            <Route path="/nosotros" element={<PublicRoute><Nosotros /></PublicRoute>} />
            <Route path="/contacto" element={<PublicRoute><Contacto /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path='/galeria' element={<PublicRoute><Galeria /></PublicRoute>} />
            <Route path='/carrito' element={<PublicRoute><Carrito /></PublicRoute>} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;