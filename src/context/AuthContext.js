import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Estado inicial del usuario (simulado, en un caso real vendría de una API)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser
      ? JSON.parse(savedUser)
      : { isAuthenticated: false, name: "", email: "", address: "", phone: "" };
  });

  // Estado para manejar errores o mensajes
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Efecto para guardar el estado en localStorage
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  // Función para iniciar sesión
  const login = (email, password) => {
    // Simulación de login (en un caso real, consulta a una API)
    if (email === "usuario@example.com" && password === "contraseña123") {
      const authenticatedUser = {
        isAuthenticated: true,
        name: "Ana López",
        email: "usuario@example.com",
        address: "Calle Principal 123, Ciudad Danza, México",
        phone: "555-123-4567",
      };
      setUser(authenticatedUser);
      setError("");
      setSuccess("Inicio de sesión exitoso.");
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError("Correo o contraseña incorrectos.");
      setTimeout(() => setError(""), 3000);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser({ isAuthenticated: false, name: "", email: "", address: "", phone: "" });
    setError("");
    setSuccess("Sesión cerrada exitosamente.");
    setTimeout(() => setSuccess(""), 3000);
  };

  // Función para actualizar la información del usuario (usada en Perfil.js)
  const updateUserInfo = (newInfo) => {
    if (!newInfo.name || !newInfo.email || !newInfo.address || !newInfo.phone) {
      setError("Por favor, completa todos los campos.");
      return;
    }
    setUser((prev) => ({ ...prev, ...newInfo, isAuthenticated: true }));
    setError("");
    setSuccess("Información actualizada correctamente.");
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserInfo, error, success }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);