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

// Un solo WhatsApp, leído de la configuración: ningún teléfono ni correo fijo en código.
// (Los placeholder="+521234567890" de Login y Perfil no están aquí: son ejemplos de formato.)
const fragmentosProhibidos = [
  "527715563522", "527711234567", "7715563522", "7711234567", "7711875194", "wa.me/5",
  "+52 771 123 4567", "ventas@laaterciopelada.com", "info@laaterciopelada.com",
];

describe("datos de contacto", () => {
  it("ningún archivo de src contiene un número de teléfono o correo fijo", () => {
    const culpables = leerTodo(src)
      .filter((a) => fragmentosProhibidos.some((f) => a.texto.includes(f)))
      .map((a) => a.ruta);
    expect(culpables).toEqual([]);
  });
});

// Textos de relleno que no describen al negocio real (ver spec, Fase 0).
const frasesProhibidas = [
  "maestras artesanas", "Comercio Justo", "Talleres Educativos", "San Luis Potosí",
  "Boutique Huasteca Premium", "comunidades artesanales", "Comentarios de la Comunidad",
];

// Regla del autor: sin emojis en el front; iconos de lucide-react. En esta fase
// aplica a lo público y compartido; el panel admin entra en la Fase 1.
const regexEmoji = /[\u{1F300}-\u{1FAFF}]|✅|❌|⚠|✨|❤/u;
const esPublicoOCompartido = (ruta) => /^src[\\/](pages[\\/]public|components[\\/]shared|layouts)[\\/]/.test(ruta);

describe("textos del sitio", () => {
  it("ningún archivo de src contiene textos de relleno que no describen al negocio", () => {
    const culpables = leerTodo(src)
      .filter((a) => frasesProhibidas.some((f) => a.texto.includes(f)))
      .map((a) => `${a.ruta}: ${frasesProhibidas.filter((f) => a.texto.includes(f)).join(", ")}`);
    expect(culpables).toEqual([]);
  });

  it("no hay emojis en páginas públicas, componentes compartidos ni layouts", () => {
    const culpables = leerTodo(src)
      .filter((a) => esPublicoOCompartido(a.ruta) && regexEmoji.test(a.texto))
      .map((a) => a.ruta);
    expect(culpables).toEqual([]);
  });
});
