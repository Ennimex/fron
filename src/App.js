import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import PublicLayout from './layouts/PublicLayout';
import Inicio from './pages/public/Inicio';
import Productos from './pages/public/Productos';
import Servicios from './pages/public/Servicios';
import Nosotros from './pages/public/Nosotros';
import Contacto from './pages/public/Contacto';
import Login from './pages/public/Login';
import Galeria from './pages/public/Galeria';
import ProductoDetalle from './pages/public/ProductoDetalle';
import Carrito from "./pages/public/Carrito";
import { CartProvider } from './context/CartContext';

function App() {
  return (
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
              <Route path='/galeria' element={<Galeria />} />
              <Route path='/carrito' element={<Carrito />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;