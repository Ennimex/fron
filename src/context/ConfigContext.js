import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { publicAPI } from "../services/api";

export const ConfigContext = createContext();
export const useConfig = () => useContext(ConfigContext);

// Valores por defecto mientras carga (o si falla la API), para que la UI nunca quede vacía
const defaultConfig = {
  nombre: "La Aterciopelada",
  descripcion: "",
  logoUrl: "",
  direccion: "",
  telefono: "",
  email: "",
  horarios: "",
  redesSociales: {
    facebook: "",
    instagram: "",
    whatsapp: "",
    twitter: "",
    tiktok: "",
  },
};

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(defaultConfig);
  const [loading, setLoading] = useState(true);

  const loadConfig = useCallback(async () => {
    try {
      const data = await publicAPI.getConfiguracion();
      if (data) {
        setConfig({ ...defaultConfig, ...data, redesSociales: { ...defaultConfig.redesSociales, ...(data.redesSociales || {}) } });
      }
    } catch (error) {
      console.error("No se pudo cargar la configuración del sitio:", error?.error || error?.message);
      // Se mantienen los valores por defecto
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  return (
    <ConfigContext.Provider value={{ config, loading, refreshConfig: loadConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};
