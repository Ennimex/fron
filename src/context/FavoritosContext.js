import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import favoritoService from "../services/favoritoService";

const FavoritosContext = createContext();
export const useFavoritos = () => useContext(FavoritosContext);

export const FavoritosProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [ids, setIds] = useState(() => new Set()); // IDs favoritos (para el estado del corazón)
  const [favoritos, setFavoritos] = useState([]); // productos poblados (para la página "Mis Favoritos")
  const [loading, setLoading] = useState(false);

  // Cargar los favoritos del usuario (o limpiar si no hay sesión)
  const cargar = useCallback(async () => {
    if (!isAuthenticated) {
      setIds(new Set());
      setFavoritos([]);
      return;
    }
    try {
      setLoading(true);
      const data = await favoritoService.getAll();
      const lista = Array.isArray(data) ? data : [];
      setFavoritos(lista);
      setIds(new Set(lista.map((p) => p._id)));
    } catch (error) {
      // Silencioso: si falla (p. ej. sesión expirada), dejamos la lista vacía
      setFavoritos([]);
      setIds(new Set());
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const esFavorito = useCallback((id) => ids.has(id), [ids]);

  // Alterna un producto (recibe el objeto producto o solo su id) con
  // actualización optimista; si la API falla, recarga el estado real.
  const toggleFavorito = useCallback(
    async (producto) => {
      const id = typeof producto === "string" ? producto : producto?._id;
      if (!id) return;
      const yaEsFavorito = ids.has(id);

      setIds((prev) => {
        const next = new Set(prev);
        if (yaEsFavorito) next.delete(id);
        else next.add(id);
        return next;
      });
      setFavoritos((prev) => {
        if (yaEsFavorito) return prev.filter((p) => p._id !== id);
        return typeof producto === "object" ? [producto, ...prev] : prev;
      });

      try {
        if (yaEsFavorito) await favoritoService.remove(id);
        else await favoritoService.add(id);
      } catch (error) {
        cargar(); // revertir al estado del servidor
      }
    },
    [ids, cargar]
  );

  return (
    <FavoritosContext.Provider
      value={{ favoritos, esFavorito, toggleFavorito, loading, recargar: cargar, total: ids.size }}
    >
      {children}
    </FavoritosContext.Provider>
  );
};

export default FavoritosContext;
