import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ConfigContext } from "../../context/ConfigContext";
import Politicas from "./Politicas";

const renderCon = (config, ruta = "/politicas") =>
  render(
    <ConfigContext.Provider value={{ config, loading: false, refreshConfig: () => {} }}>
      <MemoryRouter initialEntries={[ruta]}>
        <Routes>
          <Route path="/politicas" element={<Politicas />} />
        </Routes>
      </MemoryRouter>
    </ConfigContext.Provider>
  );

beforeEach(() => {
  // jsdom no implementa scrollIntoView
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

describe("Politicas", () => {
  it("muestra ambos textos cuando existen", () => {
    renderCon({ terminosCondiciones: "Texto de términos", avisoPrivacidad: "Texto de aviso" });
    expect(screen.getByRole("heading", { name: "Términos y Condiciones" })).toBeInTheDocument();
    expect(screen.getByText("Texto de términos")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Aviso de Privacidad" })).toBeInTheDocument();
    expect(screen.getByText("Texto de aviso")).toBeInTheDocument();
  });

  it("avisa cuando un texto aún no se publica", () => {
    renderCon({ terminosCondiciones: "", avisoPrivacidad: "" });
    expect(screen.getAllByText("Este documento aún no se ha publicado.")).toHaveLength(2);
  });

  it("hace scroll a la sección indicada en el hash", () => {
    renderCon({ terminosCondiciones: "T", avisoPrivacidad: "A" }, "/politicas#privacidad");
    const seccion = document.getElementById("privacidad");
    expect(seccion).not.toBeNull();
    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
  });
});
