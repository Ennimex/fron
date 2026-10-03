// Único punto del front que sabe cómo armar un enlace de WhatsApp.
// El número sale de la configuración del sitio (redesSociales.whatsapp), que
// la clienta captura en el panel en cualquier formato: URL wa.me, "+52 771 ...",
// "771 187 5194", etc. Nunca hay un número fijo en código.

const LADA_MEXICO = "52";

export const numeroWhatsApp = (config) => {
  const crudo = String(config?.redesSociales?.whatsapp || "").trim();
  if (!crudo) return null;

  // Si es URL, quedarnos con la parte después de wa.me/ (y antes de ?)
  const sinQuery = crudo.split("?")[0];
  const trasWaMe = sinQuery.includes("wa.me/") ? sinQuery.split("wa.me/")[1] : sinQuery;
  const digitos = trasWaMe.replace(/\D/g, "");

  if (digitos.length === 10) return LADA_MEXICO + digitos;
  if (digitos.length >= 11 && digitos.length <= 15) return digitos;
  return null;
};

export const urlWhatsApp = (config, texto = "") => {
  const numero = numeroWhatsApp(config);
  if (!numero) return null;
  const base = `https://wa.me/${numero}`;
  return texto ? `${base}?text=${encodeURIComponent(texto)}` : base;
};
