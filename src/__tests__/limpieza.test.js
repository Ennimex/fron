// Prueba "guardia": falla si vuelve a entrar código muerto o restos de
// despliegues viejos. Corre con `pnpm test` (CRA/jest).
const fs = require("fs");
const path = require("path");

const raiz = path.join(__dirname, "..", "..");
const src = path.join(raiz, "src");

const archivosQueNoDebenExistir = [
  "public/github-pages-fix.js",
  "public/404.html",
  "src/hooks/useGitHubPagesNavigation.js",
  "src/components/shared/CartWidget.js",
  "src/services/base.js",
];

// Lee todo src/ excepto las pruebas: este archivo y whatsapp.test.js contienen
// a propósito los números y frases prohibidos, y no deben marcarse a sí mismos.
const leerTodo = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === "__tests__" ? [] : leerTodo(p);
    const esCodigo = /\.(js|jsx)$/.test(e.name) && !/\.test\.jsx?$/.test(e.name);
    return esCodigo ? [{ ruta: path.relative(raiz, p), texto: fs.readFileSync(p, "utf8") }] : [];
  });

describe("limpieza del front", () => {
  it.each(archivosQueNoDebenExistir)("%s no existe", (rel) => {
    expect(fs.existsSync(path.join(raiz, rel))).toBe(false);
  });

  it("index.html no carga el fix de GitHub Pages", () => {
    const html = fs.readFileSync(path.join(raiz, "public", "index.html"), "utf8");
    expect(html).not.toContain("github-pages-fix");
  });

  it("nadie importa useGitHubPagesNavigation, CartWidget ni services/base", () => {
    const culpables = leerTodo(src)
      .filter((a) => /useGitHubPagesNavigation|CartWidget|services\/base|from ["']\.\/base["']/.test(a.texto))
      .map((a) => a.ruta);
    expect(culpables).toEqual([]);
  });
});
