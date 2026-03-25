import { useState, useMemo} from "react";
import { IonIcon } from "@ionic/react";
import { mailOutline, arrowBackOutline, checkmarkCircleOutline, keyOutline } from "ionicons/icons";
import { Link } from "react-router-dom";
import stylesPublic from "../../styles/stylesGlobal";

// Paso 1: Ingresa tu email
// Paso 2: Correo enviado (confirmación)

const RecuperarContrasena = () => {
  const [step, setStep] = useState(1); // 1 = form, 2 = success
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);

  const backgroundImages = useMemo(
    () => [
      "https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=2787",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2787",
    ],
    []
  );

  const [currentImageIndex] = useState(() =>
    Math.floor(Math.random() * backgroundImages.length)
  );

  // Simula el envío — aquí conectarías tu endpoint real
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValid) {
      setEmailError(true);
      setError("Por favor ingresa un correo electrónico válido.");
      return;
    }

    setError("");
    setLoading(true);
    setAnimating(true);

    // Simula llamada al backend (reemplaza con tu lógica real)
    await new Promise((r) => setTimeout(r, 1500));

    setLoading(false);
    setAnimating(false);
    setStep(2);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError(false);
    if (error) setError("");
  };

  const css = `
    .rp-container {
      min-height: 100vh;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background:
        linear-gradient(135deg, rgba(214, 51, 132, 0.08) 0%, rgba(107, 155, 107, 0.06) 50%, rgba(230, 167, 86, 0.04) 100%),
        linear-gradient(${stylesPublic.colors.surface.overlay}, ${stylesPublic.colors.surface.overlay}),
        url(${backgroundImages[currentImageIndex]});
      background-size: cover;
      background-position: center;
      background-attachment: scroll;
      padding: ${stylesPublic.spacing.scale[4]};
      padding-top: 88px;
      font-family: ${stylesPublic.typography.families.body};
      position: relative;
      z-index: 1;
      isolation: isolate;
    }

    .rp-container::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background:
        radial-gradient(circle at 30% 20%, rgba(214, 51, 132, 0.12) 0%, transparent 50%),
        radial-gradient(circle at 70% 80%, rgba(107, 155, 107, 0.10) 0%, transparent 50%);
      pointer-events: none;
      z-index: -1;
    }

    .rp-card {
      width: 100%;
      max-width: 480px;
      background: ${stylesPublic.colors.surface.glass};
      backdrop-filter: blur(20px);
      border-radius: ${stylesPublic.borders.radius.xl};
      box-shadow: ${stylesPublic.shadows.brand.elegant};
      border: 1px solid rgba(255, 255, 255, 0.2);
      overflow: hidden;
      transition: all ${stylesPublic.animations.duration.elegant} ${stylesPublic.animations.easing.elegant};
    }

    .rp-panel {
      padding: ${stylesPublic.spacing.scale[10]} ${stylesPublic.spacing.scale[8]};
      transition: opacity ${stylesPublic.animations.duration.elegant} ${stylesPublic.animations.easing.elegant};
      opacity: ${animating ? 0.7 : 1};
    }

    .rp-logo {
      text-align: center;
      margin-bottom: ${stylesPublic.spacing.scale[8]};
    }

    .rp-logo-text {
      font-size: ${stylesPublic.typography.scale["3xl"]};
      font-weight: ${stylesPublic.typography.weights.bold};
      background: ${stylesPublic.colors.gradients.elegant};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0;
      font-family: ${stylesPublic.typography.families.display};
      letter-spacing: ${stylesPublic.typography.tracking.tight};
    }

    .rp-logo-subtext {
      font-size: ${stylesPublic.typography.scale.sm};
      color: ${stylesPublic.colors.text.secondary};
      margin-top: ${stylesPublic.spacing.scale[2]};
      font-style: italic;
      opacity: 0.8;
    }

    /* Icono central decorativo */
    .rp-icon-wrapper {
      display: flex;
      justify-content: center;
      margin-bottom: ${stylesPublic.spacing.scale[6]};
    }

    .rp-icon-circle {
      width: 64px;
      height: 64px;
      border-radius: ${stylesPublic.borders.radius.full};
      background: ${stylesPublic.colors.gradients.primary};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      color: #fff;
      box-shadow: ${stylesPublic.shadows.brand.glow};
    }

    .rp-icon-circle.success {
      background: linear-gradient(135deg, ${stylesPublic.colors.semantic.success.main}, ${stylesPublic.colors.secondary[500]});
      box-shadow: 0 0 32px rgba(34, 197, 94, 0.35);
      animation: popIn 0.5s ${stylesPublic.animations.easing.bounce} forwards;
    }

    @keyframes popIn {
      0%   { transform: scale(0.5); opacity: 0; }
      80%  { transform: scale(1.1); opacity: 1; }
      100% { transform: scale(1);   opacity: 1; }
    }

    .rp-title {
      font-size: ${stylesPublic.typography.scale["2xl"]};
      font-weight: ${stylesPublic.typography.weights.bold};
      text-align: center;
      color: ${stylesPublic.colors.text.primary};
      font-family: ${stylesPublic.typography.families.display};
      margin-bottom: ${stylesPublic.spacing.scale[2]};
    }

    .rp-subtitle {
      font-size: ${stylesPublic.typography.scale.base};
      text-align: center;
      color: ${stylesPublic.colors.text.secondary};
      margin-bottom: ${stylesPublic.spacing.scale[8]};
      line-height: ${stylesPublic.typography.leading.normal};
      opacity: 0.9;
    }

    .rp-email-highlight {
      font-weight: ${stylesPublic.typography.weights.semibold};
      color: ${stylesPublic.colors.primary[500]};
    }

    /* Input */
    .rp-input-box {
      position: relative;
      width: 100%;
      margin-bottom: ${stylesPublic.spacing.scale[6]};
    }

    .rp-label {
      display: block;
      margin-bottom: ${stylesPublic.spacing.scale[2]};
      font-size: ${stylesPublic.typography.scale.sm};
      font-weight: ${stylesPublic.typography.weights.semibold};
      color: ${stylesPublic.colors.text.primary};
      opacity: 0.9;
    }

    .rp-input {
      width: 100%;
      padding: 12px 48px 12px 16px;
      font-size: ${stylesPublic.typography.scale.base};
      line-height: 1.5;
      color: ${stylesPublic.colors.text.primary};
      background: #ffffff;
      border: 1px solid ${stylesPublic.borders.colors.muted};
      border-radius: ${stylesPublic.borders.radius.lg};
      transition: all ${stylesPublic.animations.duration.elegant} ${stylesPublic.animations.easing.elegant};
      box-sizing: border-box;
      font-family: ${stylesPublic.typography.families.body};
    }

    .rp-input:focus {
      outline: none;
      border-color: ${stylesPublic.colors.primary[500]};
      box-shadow: 0 0 0 3px rgba(214, 51, 132, 0.1);
      background: rgba(255, 255, 255, 0.95);
      transform: translateY(-1px);
    }

    .rp-input::placeholder {
      color: ${stylesPublic.colors.text.muted};
      font-size: ${stylesPublic.typography.scale.sm};
    }

    .rp-input.input-error {
      border-color: ${stylesPublic.colors.semantic.error.main};
      background: rgba(225, 29, 72, 0.05);
      animation: shake 0.5s ease-in-out;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25%       { transform: translateX(-4px); }
      75%       { transform: translateX(4px); }
    }

    .rp-input-icon {
      position: absolute;
      right: ${stylesPublic.spacing.scale[4]};
      top: 50%;
      transform: translateY(-50%);
      font-size: ${stylesPublic.typography.scale.lg};
      color: ${stylesPublic.colors.primary[500]};
      display: flex;
      align-items: center;
      pointer-events: none;
      opacity: 0.7;
    }

    .rp-error-text {
      color: ${stylesPublic.colors.semantic.error.main};
      font-size: ${stylesPublic.typography.scale.xs};
      margin-top: ${stylesPublic.spacing.scale[1]};
      font-weight: ${stylesPublic.typography.weights.semibold};
    }

    /* Alerta de error global */
    .rp-alert-error {
      background: linear-gradient(135deg, ${stylesPublic.colors.semantic.error.light}, rgba(225, 29, 72, 0.1));
      color: ${stylesPublic.colors.semantic.error.main};
      padding: ${stylesPublic.spacing.scale[4]};
      border-radius: ${stylesPublic.borders.radius.lg};
      border-left: 4px solid ${stylesPublic.colors.semantic.error.main};
      margin-bottom: ${stylesPublic.spacing.scale[6]};
      font-size: ${stylesPublic.typography.scale.sm};
      font-weight: ${stylesPublic.typography.weights.semibold};
      backdrop-filter: blur(10px);
    }

    /* Botón principal */
    .rp-button {
      width: 100%;
      padding: 12px 24px;
      font-size: ${stylesPublic.typography.scale.base};
      border-radius: ${stylesPublic.borders.radius.lg};
      border: none;
      outline: none;
      cursor: pointer;
      font-weight: ${stylesPublic.typography.weights.semibold};
      color: #ffffff;
      background: ${stylesPublic.colors.gradients.primary};
      box-shadow: ${stylesPublic.shadows.brand.primary};
      transition: all ${stylesPublic.animations.duration.elegant} ${stylesPublic.animations.easing.elegant};
      font-family: ${stylesPublic.typography.families.body};
      letter-spacing: 0.025em;
      position: relative;
      overflow: hidden;
    }

    .rp-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: ${stylesPublic.shadows.brand.glow};
      background: linear-gradient(135deg, ${stylesPublic.colors.primary[600]} 0%, ${stylesPublic.colors.primary[400]} 100%);
    }

    .rp-button:active:not(:disabled) {
      transform: translateY(0);
    }

    .rp-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    /* Spinner dentro del botón */
    .rp-spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.4);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-right: 8px;
      vertical-align: middle;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Botón secundario (volver) */
    .rp-back-link {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: ${stylesPublic.spacing.scale[2]};
      margin-top: ${stylesPublic.spacing.scale[6]};
      color: ${stylesPublic.colors.text.secondary};
      font-size: ${stylesPublic.typography.scale.sm};
      text-decoration: none;
      transition: ${stylesPublic.animations.transitions.colors};
      font-weight: ${stylesPublic.typography.weights.medium};
    }

    .rp-back-link:hover {
      color: ${stylesPublic.colors.primary[500]};
    }

    .rp-back-link ion-icon {
      font-size: 16px;
    }

    /* Divisor */
    .rp-divider {
      display: flex;
      align-items: center;
      gap: ${stylesPublic.spacing.scale[3]};
      margin: ${stylesPublic.spacing.scale[6]} 0;
    }

    .rp-divider-line {
      flex: 1;
      height: 1px;
      background: ${stylesPublic.borders.colors.default};
    }

    .rp-divider-text {
      font-size: ${stylesPublic.typography.scale.xs};
      color: ${stylesPublic.colors.text.muted};
      white-space: nowrap;
    }

    /* Footer de registro */
    .rp-footer-text {
      text-align: center;
      font-size: ${stylesPublic.typography.scale.sm};
      color: ${stylesPublic.colors.text.secondary};
    }

    .rp-link {
      color: ${stylesPublic.colors.primary[500]};
      text-decoration: none;
      font-weight: ${stylesPublic.typography.weights.semibold};
      transition: ${stylesPublic.animations.transitions.colors};
    }

    .rp-link:hover {
      color: ${stylesPublic.colors.primary[700]};
      text-decoration: underline;
    }

    /* Info tip */
    .rp-tip {
      background: linear-gradient(135deg, rgba(214, 51, 132, 0.06), rgba(107, 155, 107, 0.05));
      border: 1px solid rgba(214, 51, 132, 0.15);
      border-radius: ${stylesPublic.borders.radius.lg};
      padding: ${stylesPublic.spacing.scale[4]};
      margin-bottom: ${stylesPublic.spacing.scale[6]};
      font-size: ${stylesPublic.typography.scale.sm};
      color: ${stylesPublic.colors.text.secondary};
      line-height: ${stylesPublic.typography.leading.normal};
    }

    .rp-tip strong {
      color: ${stylesPublic.colors.primary[600]};
    }

    /* Success actions */
    .rp-success-actions {
      display: flex;
      flex-direction: column;
      gap: ${stylesPublic.spacing.scale[3]};
      margin-top: ${stylesPublic.spacing.scale[6]};
    }

    .rp-button-outline {
      width: 100%;
      padding: 12px 24px;
      font-size: ${stylesPublic.typography.scale.base};
      border-radius: ${stylesPublic.borders.radius.lg};
      border: 1.5px solid ${stylesPublic.colors.primary[500]};
      outline: none;
      cursor: pointer;
      font-weight: ${stylesPublic.typography.weights.semibold};
      color: ${stylesPublic.colors.primary[500]};
      background: transparent;
      transition: all ${stylesPublic.animations.duration.elegant} ${stylesPublic.animations.easing.elegant};
      font-family: ${stylesPublic.typography.families.body};
    }

    .rp-button-outline:hover {
      background: ${stylesPublic.colors.primary[50]};
      transform: translateY(-1px);
    }

    /* Floating decorative elements (igual que Login) */
    .floating-element {
      position: fixed;
      width: 8px;
      height: 8px;
      border-radius: ${stylesPublic.borders.radius.full};
      opacity: 0.6;
      animation: float 12s ease-in-out infinite;
      pointer-events: none;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) scale(1) rotate(0deg); opacity: 0.4; }
      33%       { transform: translateY(-20px) scale(1.2) rotate(120deg); opacity: 0.8; }
      66%       { transform: translateY(-10px) scale(0.8) rotate(240deg); opacity: 0.6; }
    }

    /* Responsive */
    @media (max-width: ${stylesPublic.breakpoints.lg}) {
      .rp-container {
        padding: ${stylesPublic.spacing.scale[2]};
        align-items: flex-start;
        padding-top: 88px;
      }
      .rp-card {
        max-width: 100%;
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.sm}) {
      .rp-panel {
        padding: ${stylesPublic.spacing.scale[6]} ${stylesPublic.spacing.scale[4]};
      }
      .rp-title {
        font-size: ${stylesPublic.typography.scale.xl};
      }
    }
  `;

  return (
    <>
      <style>{css}</style>

      {/* Floating decorative elements — igual que Login */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: stylesPublic.utils.zIndex.hide }}>
        <div className="floating-element" style={{ top: "15%", left: "8%", background: stylesPublic.colors.primary[500], animationDelay: "0s" }} />
        <div className="floating-element" style={{ top: "70%", right: "12%", background: stylesPublic.colors.secondary[500], animationDelay: "4s" }} />
        <div className="floating-element" style={{ bottom: "25%", left: "15%", background: stylesPublic.colors.primary[300], animationDelay: "8s" }} />
        <div className="floating-element" style={{ top: "40%", right: "25%", background: stylesPublic.colors.primary[500], animationDelay: "2s" }} />
        <div className="floating-element" style={{ bottom: "60%", left: "70%", background: stylesPublic.colors.secondary[500], animationDelay: "6s" }} />
      </div>

      <div className="rp-container">
        <div className="rp-card">
          <div className="rp-panel">

            {/* Logo — idéntico a Login */}
            <div className="rp-logo">
              <h1 className="rp-logo-text">La Aterciopelada</h1>
              <p className="rp-logo-subtext">Arte Textil Huasteco</p>
            </div>

            {/* ───────── PASO 1: Formulario ───────── */}
            {step === 1 && (
              <>
                <div className="rp-icon-wrapper">
                  <div className="rp-icon-circle">
                    <IonIcon icon={keyOutline} />
                  </div>
                </div>

                <h2 className="rp-title">Recuperar contraseña</h2>
                <p className="rp-subtitle">
                  Ingresa el correo asociado a tu cuenta y te enviaremos las instrucciones para restablecerla.
                </p>

                <div className="rp-tip">
                  <strong>💡 Tip:</strong> Revisa también tu carpeta de spam si no encuentras el correo en tu bandeja de entrada.
                </div>

                {error && <div className="rp-alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="rp-input-box">
                    <label className="rp-label">Correo Electrónico*</label>
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={handleEmailChange}
                      className={`rp-input${emailError ? " input-error" : ""}`}
                      disabled={loading}
                      autoComplete="email"
                    />
                    <span className="rp-input-icon">
                      <IonIcon icon={mailOutline} />
                    </span>
                    {emailError && (
                      <p className="rp-error-text">⚠️ Por favor ingresa un correo válido</p>
                    )}
                  </div>

                  <button type="submit" className="rp-button" disabled={loading}>
                    {loading && <span className="rp-spinner" />}
                    {loading ? "Enviando..." : "Enviar instrucciones"}
                  </button>
                </form>

                <div className="rp-divider">
                  <div className="rp-divider-line" />
                  <span className="rp-divider-text">o</span>
                  <div className="rp-divider-line" />
                </div>

                <div className="rp-footer-text">
                  ¿Recordaste tu contraseña?{" "}
                  <Link to="/login" className="rp-link">Inicia sesión</Link>
                </div>

                <Link to="/login" className="rp-back-link">
                  <IonIcon icon={arrowBackOutline} />
                  Volver al inicio de sesión
                </Link>
              </>
            )}

            {/* ───────── PASO 2: Éxito ───────── */}
            {step === 2 && (
              <>
                <div className="rp-icon-wrapper">
                  <div className="rp-icon-circle success">
                    <IonIcon icon={checkmarkCircleOutline} />
                  </div>
                </div>

                <h2 className="rp-title">¡Correo enviado!</h2>
                <p className="rp-subtitle">
                  Enviamos las instrucciones de recuperación a{" "}
                  <span className="rp-email-highlight">{email}</span>.
                  Revisa tu bandeja de entrada.
                </p>

                <div className="rp-tip">
                  <strong>¿No lo ves?</strong> Puede tardar unos minutos. Revisa también la carpeta de spam o correo no deseado.
                </div>

                <div className="rp-success-actions">
                  <button
                    className="rp-button-outline"
                    onClick={() => { setStep(1); setEmail(""); }}
                  >
                    Intentar con otro correo
                  </button>

                  <Link to="/login" style={{ textDecoration: "none" }}>
                    <button className="rp-button" style={{ marginTop: 0 }}>
                      Volver al inicio de sesión
                    </button>
                  </Link>
                </div>

                <Link to="/" className="rp-back-link" style={{ marginTop: "24px" }}>
                  <IonIcon icon={arrowBackOutline} />
                  Ir al inicio
                </Link>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default RecuperarContrasena;