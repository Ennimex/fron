import { useState, useMemo } from "react";
import { IonIcon } from "@ionic/react";
import {
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  arrowBackOutline,
  checkmarkCircleOutline,
  shieldCheckmarkOutline,
} from "ionicons/icons";
import { Link, useParams, useNavigate } from "react-router-dom";
import stylesPublic from "../../styles/stylesGlobal";
import { authAPI } from "../../services/api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = formulario, 2 = éxito
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setError("");
    setLoading(true);
    setAnimating(true);

    try {
      await authAPI.resetPassword(token, password);
      setStep(2);
    } catch (err) {
      setError(err.error || "El enlace es inválido o ha expirado. Solicita uno nuevo.");
    } finally {
      setLoading(false);
      setAnimating(false);
    }
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
      padding: ${stylesPublic.spacing.scale[4]};
      padding-top: 88px;
      font-family: ${stylesPublic.typography.families.body};
      position: relative;
      z-index: 1;
      isolation: isolate;
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
    }

    .rp-panel {
      padding: ${stylesPublic.spacing.scale[10]} ${stylesPublic.spacing.scale[8]};
      transition: opacity ${stylesPublic.animations.duration.elegant} ${stylesPublic.animations.easing.elegant};
      opacity: ${animating ? 0.7 : 1};
    }

    .rp-logo { text-align: center; margin-bottom: ${stylesPublic.spacing.scale[8]}; }

    .rp-logo-text {
      font-size: ${stylesPublic.typography.scale["3xl"]};
      font-weight: ${stylesPublic.typography.weights.bold};
      background: ${stylesPublic.colors.gradients.elegant};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0;
      font-family: ${stylesPublic.typography.families.display};
    }

    .rp-logo-subtext {
      font-size: ${stylesPublic.typography.scale.sm};
      color: ${stylesPublic.colors.text.secondary};
      margin-top: ${stylesPublic.spacing.scale[2]};
      font-style: italic;
      opacity: 0.8;
    }

    .rp-icon-wrapper { display: flex; justify-content: center; margin-bottom: ${stylesPublic.spacing.scale[6]}; }

    .rp-icon-circle {
      width: 64px; height: 64px;
      border-radius: ${stylesPublic.borders.radius.full};
      background: ${stylesPublic.colors.gradients.primary};
      display: flex; align-items: center; justify-content: center;
      font-size: 28px; color: #fff;
      box-shadow: ${stylesPublic.shadows.brand.glow};
    }

    .rp-icon-circle.success {
      background: linear-gradient(135deg, ${stylesPublic.colors.semantic.success.main}, ${stylesPublic.colors.secondary[500]});
      box-shadow: 0 0 32px rgba(34, 197, 94, 0.35);
      animation: popIn 0.5s ${stylesPublic.animations.easing.bounce} forwards;
    }

    @keyframes popIn {
      0% { transform: scale(0.5); opacity: 0; }
      80% { transform: scale(1.1); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
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

    .rp-input-box { position: relative; width: 100%; margin-bottom: ${stylesPublic.spacing.scale[6]}; }

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
    }

    .rp-input-icon {
      position: absolute;
      right: ${stylesPublic.spacing.scale[4]};
      top: 42px;
      font-size: ${stylesPublic.typography.scale.lg};
      color: ${stylesPublic.colors.primary[500]};
      display: flex; align-items: center;
      cursor: pointer;
      opacity: 0.7;
      background: none; border: none;
    }

    .rp-alert-error {
      background: linear-gradient(135deg, ${stylesPublic.colors.semantic.error.light}, rgba(225, 29, 72, 0.1));
      color: ${stylesPublic.colors.semantic.error.main};
      padding: ${stylesPublic.spacing.scale[4]};
      border-radius: ${stylesPublic.borders.radius.lg};
      border-left: 4px solid ${stylesPublic.colors.semantic.error.main};
      margin-bottom: ${stylesPublic.spacing.scale[6]};
      font-size: ${stylesPublic.typography.scale.sm};
      font-weight: ${stylesPublic.typography.weights.semibold};
    }

    .rp-button {
      width: 100%;
      padding: 12px 24px;
      font-size: ${stylesPublic.typography.scale.base};
      border-radius: ${stylesPublic.borders.radius.lg};
      border: none; outline: none; cursor: pointer;
      font-weight: ${stylesPublic.typography.weights.semibold};
      color: #ffffff;
      background: ${stylesPublic.colors.gradients.primary};
      box-shadow: ${stylesPublic.shadows.brand.primary};
      transition: all ${stylesPublic.animations.duration.elegant} ${stylesPublic.animations.easing.elegant};
      font-family: ${stylesPublic.typography.families.body};
    }

    .rp-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: ${stylesPublic.shadows.brand.glow};
    }

    .rp-button:disabled { opacity: 0.7; cursor: not-allowed; }

    .rp-spinner {
      display: inline-block; width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.4);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-right: 8px; vertical-align: middle;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .rp-back-link {
      display: flex; align-items: center; justify-content: center;
      gap: ${stylesPublic.spacing.scale[2]};
      margin-top: ${stylesPublic.spacing.scale[6]};
      color: ${stylesPublic.colors.text.secondary};
      font-size: ${stylesPublic.typography.scale.sm};
      text-decoration: none;
      font-weight: ${stylesPublic.typography.weights.medium};
    }

    .rp-back-link:hover { color: ${stylesPublic.colors.primary[500]}; }

    .rp-hint {
      font-size: ${stylesPublic.typography.scale.xs};
      color: ${stylesPublic.colors.text.muted};
      margin-top: -${stylesPublic.spacing.scale[4]};
      margin-bottom: ${stylesPublic.spacing.scale[6]};
    }

    @media (max-width: ${stylesPublic.breakpoints.sm}) {
      .rp-panel { padding: ${stylesPublic.spacing.scale[6]} ${stylesPublic.spacing.scale[4]}; }
    }
  `;

  return (
    <>
      <style>{css}</style>
      <div className="rp-container">
        <div className="rp-card">
          <div className="rp-panel">
            <div className="rp-logo">
              <h1 className="rp-logo-text">La Aterciopelada</h1>
              <p className="rp-logo-subtext">Arte Textil Huasteco</p>
            </div>

            {/* PASO 1: Formulario nueva contraseña */}
            {step === 1 && (
              <>
                <div className="rp-icon-wrapper">
                  <div className="rp-icon-circle">
                    <IonIcon icon={shieldCheckmarkOutline} />
                  </div>
                </div>

                <h2 className="rp-title">Nueva contraseña</h2>
                <p className="rp-subtitle">
                  Crea una nueva contraseña para tu cuenta. Asegúrate de que sea segura.
                </p>

                {error && <div className="rp-alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="rp-input-box">
                    <label className="rp-label">Nueva contraseña*</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 8 caracteres"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); if (error) setError(""); }}
                      className="rp-input"
                      disabled={loading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="rp-input-icon"
                      onClick={() => setShowPassword((s) => !s)}
                      tabIndex={-1}
                      aria-label="Mostrar u ocultar contraseña"
                    >
                      <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                    </button>
                  </div>

                  <div className="rp-input-box">
                    <label className="rp-label">Confirmar contraseña*</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Repite la contraseña"
                      value={confirm}
                      onChange={(e) => { setConfirm(e.target.value); if (error) setError(""); }}
                      className="rp-input"
                      disabled={loading}
                      autoComplete="new-password"
                    />
                    <span className="rp-input-icon" style={{ pointerEvents: "none" }}>
                      <IonIcon icon={lockClosedOutline} />
                    </span>
                  </div>

                  <button type="submit" className="rp-button" disabled={loading}>
                    {loading && <span className="rp-spinner" />}
                    {loading ? "Guardando..." : "Restablecer contraseña"}
                  </button>
                </form>

                <Link to="/login" className="rp-back-link">
                  <IonIcon icon={arrowBackOutline} />
                  Volver al inicio de sesión
                </Link>
              </>
            )}

            {/* PASO 2: Éxito */}
            {step === 2 && (
              <>
                <div className="rp-icon-wrapper">
                  <div className="rp-icon-circle success">
                    <IonIcon icon={checkmarkCircleOutline} />
                  </div>
                </div>

                <h2 className="rp-title">¡Contraseña actualizada!</h2>
                <p className="rp-subtitle">
                  Tu contraseña se cambió correctamente. Ya puedes iniciar sesión con tu nueva contraseña.
                </p>

                <button className="rp-button" onClick={() => navigate("/login")}>
                  Ir al inicio de sesión
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
