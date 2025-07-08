/**
 * AdminPerfil - La Aterciopelada
 * Wrapper del componente PerfilUsuario para contexto administrativo
 * 
 * @version 1.0
 * @fecha 2025-01-08
 */

import React from 'react';
import PerfilUsuario from '../../components/shared/PerfilUsuario';

const AdminPerfil = () => {
  return <PerfilUsuario variant="admin" />;
};

export default AdminPerfil;
