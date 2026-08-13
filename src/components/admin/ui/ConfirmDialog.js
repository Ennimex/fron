import React from "react";
import { FaTrash } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa";
import stylesGlobal from "../../../styles/stylesGlobal";
import { BotonPrimario, BotonSecundario } from "./Botones";
import asegurarCssAdminUi from "./cssBase";

asegurarCssAdminUi();

/**
 * Confirmación destructiva canónica del panel (reemplaza a window.confirm).
 */
const ConfirmDialog = ({
  abierto,
  titulo = "¿Eliminar?",
  nombre,
  detalle = "Esta acción no se puede deshacer.",
  textoConfirmar = "Eliminar",
  cargando = false,
  onCancelar,
  onConfirmar,
}) => {
  if (!abierto) return null;

  return (
    <div
      className="adminui-overlay"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(42, 36, 31, 0.55)",
        backdropFilter: "blur(3px)",
        zIndex: 1400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={(e) => e.target === e.currentTarget && !cargando && onCancelar()}
    >
      <div
        className="adminui-modal"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "18px",
          border: "none",
          boxShadow: "0 24px 70px rgba(45, 40, 35, 0.3)",
          width: "100%",
          maxWidth: "420px",
          padding: stylesGlobal.spacing.scale[6],
          textAlign: "center",
          position: "relative",
        }}
      >
        <FaTrash
          size={40}
          style={{ color: stylesGlobal.colors.semantic.error.main, marginBottom: stylesGlobal.spacing.scale[4] }}
        />
        <h2 style={{ ...stylesGlobal.typography.headings.h2, fontSize: "1.4rem", margin: 0 }}>{titulo}</h2>
        {nombre && (
          <p
            style={{
              ...stylesGlobal.typography.body.base,
              color: stylesGlobal.colors.text.secondary,
              marginTop: stylesGlobal.spacing.scale[3],
              marginBottom: 0,
            }}
          >
            <strong>{nombre}</strong>
          </p>
        )}
        <p
          style={{
            ...stylesGlobal.typography.body.caption,
            color: stylesGlobal.colors.text.muted,
            fontStyle: "italic",
            marginTop: stylesGlobal.spacing.scale[2],
            marginBottom: stylesGlobal.spacing.scale[5],
          }}
        >
          {detalle}
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: stylesGlobal.spacing.scale[3] }}>
          <BotonSecundario onClick={onCancelar} disabled={cargando}>
            Cancelar
          </BotonSecundario>
          <BotonPrimario
            onClick={onConfirmar}
            disabled={cargando}
            style={{
              backgroundColor: stylesGlobal.colors.semantic.error.main,
              borderColor: stylesGlobal.colors.semantic.error.main,
            }}
          >
            {cargando ? (
              <>
                <FaSpinner style={{ animation: "spin 1s linear infinite" }} />
                Eliminando...
              </>
            ) : (
              textoConfirmar
            )}
          </BotonPrimario>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
