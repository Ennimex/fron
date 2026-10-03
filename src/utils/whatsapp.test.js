import { numeroWhatsApp, urlWhatsApp } from "./whatsapp";

const con = (whatsapp) => ({ redesSociales: { whatsapp } });

describe("numeroWhatsApp", () => {
  it("devuelve null sin configuración o sin número", () => {
    expect(numeroWhatsApp(undefined)).toBeNull();
    expect(numeroWhatsApp({})).toBeNull();
    expect(numeroWhatsApp(con(""))).toBeNull();
    expect(numeroWhatsApp(con("   "))).toBeNull();
  });

  it("acepta una URL wa.me completa", () => {
    expect(numeroWhatsApp(con("https://wa.me/527711875194"))).toBe("527711875194");
    expect(numeroWhatsApp(con("https://wa.me/5217711875194?text=hola"))).toBe("5217711875194");
  });

  it("agrega la lada 52 a un número mexicano de 10 dígitos", () => {
    expect(numeroWhatsApp(con("7711875194"))).toBe("527711875194");
    expect(numeroWhatsApp(con("771 187 5194"))).toBe("527711875194");
    expect(numeroWhatsApp(con("771-187-5194"))).toBe("527711875194");
  });

  it("respeta un número que ya trae lada", () => {
    expect(numeroWhatsApp(con("+52 771 187 5194"))).toBe("527711875194");
    expect(numeroWhatsApp(con("52 771 187 5194"))).toBe("527711875194");
  });

  it("rechaza números demasiado cortos", () => {
    expect(numeroWhatsApp(con("12345"))).toBeNull();
  });
});

describe("urlWhatsApp", () => {
  it("devuelve null si no hay número", () => {
    expect(urlWhatsApp({}, "hola")).toBeNull();
  });

  it("arma la URL con el texto codificado", () => {
    expect(urlWhatsApp(con("7711875194"), "Hola, ¿tienen talla M?")).toBe(
      "https://wa.me/527711875194?text=Hola%2C%20%C2%BFtienen%20talla%20M%3F"
    );
  });

  it("sin texto devuelve solo la base", () => {
    expect(urlWhatsApp(con("7711875194"))).toBe("https://wa.me/527711875194");
  });
});
