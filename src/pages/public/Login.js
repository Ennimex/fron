import { useState, useEffect, useMemo, useContext, useRef } from "react";
import { IonIcon } from "@ionic/react";
import { eyeOffOutline, eyeOutline, mailOutline, callOutline, personOutline } from "ionicons/icons";
import { Link, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import stylesPublic from "../../styles/stylesGlobal";

const Login = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(() => {
    // Si viene del botón de la navbar, mostrar login
    if (location.state?.showLogin) return true;
    // Si hay parámetro register, mostrar registro
    if (searchParams.get("register")) return false;
    // Por defecto, mostrar login
    return true;
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [animating, setAnimating] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Field errors
  const [fieldErrors, setFieldErrors] = useState({
    name: false,
    phone: false,
    email: false,
    password: false,
    confirmPassword: false,
    loginEmail: false,
    loginPassword: false,
    acceptTerms: false,
  });

  // Contexto y navegación
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  // Nuevas referencias para medir la altura del formulario activo
  const activeFormRef = useRef(null);
  const formWrapperRef = useRef(null);
  const [formHeight, setFormHeight] = useState('auto');

  // Background images
  const backgroundImages = useMemo(
    () => [
      "https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=2787",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2787",
    ],
    []
  );

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    setCurrentImageIndex(randomIndex);
    
    // Si viene del botón de la navbar, forzar mostrar login
    if (location.state?.showLogin) {
      setIsLogin(true);
      return;
    }
    
    // Manejar cambios en los parámetros de URL
    if (searchParams.get("register")) {
      setIsLogin(false); // Mostrar formulario de registro
    } else {
      setIsLogin(true); // Mostrar formulario de login por defecto
    }
  }, [searchParams, backgroundImages, location.state]);

  useEffect(() => {
    // Ajustar la altura cuando cambia el formulario activo o el contenido
    const updateFormHeight = () => {
      if (activeFormRef.current) {
        // Permitir que el contenido determine su altura natural
        const height = activeFormRef.current.scrollHeight;
        setFormHeight(`${height}px`);
      }
    };

    // Delay para asegurar que el DOM se haya actualizado
    const timer = setTimeout(updateFormHeight, 100);
    return () => clearTimeout(timer);
  }, [isLogin, password, confirmPassword, name, phone, email, error, success, fieldErrors]);

  // Efecto para ajustar la altura inicial
  useEffect(() => {
    const initializeHeight = () => {
      if (activeFormRef.current) {
        const height = activeFormRef.current.scrollHeight;
        setFormHeight(`${height}px`);
      }
    };

    // Delay para asegurar que todos los elementos estén renderizados
    const timer = setTimeout(initializeHeight, 100);
    return () => clearTimeout(timer);
  }, []); // Solo se ejecuta una vez al montar el componente

  useEffect(() => {
    if (animating) {
      const timer = setTimeout(() => setAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [animating]);

  const toggleForm = () => {
    setAnimating(true);
    
    setTimeout(() => {
      setIsLogin(!isLogin);
      setError("");
      setSuccess("");
      setFieldErrors({
        name: false,
        phone: false,
        email: false,
        password: false,
        confirmPassword: false,
        loginEmail: false,
        loginPassword: false,
        acceptTerms: false,
      });
    }, 300);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^\+?\d{10,15}$/.test(phone.replace(/\s/g, ""));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const errors = {
      loginEmail: !loginEmail || !validateEmail(loginEmail),
      loginPassword: !loginPassword,
    };
    setFieldErrors(errors);

    if (!errors.loginEmail && !errors.loginPassword) {
      setError("");
      setSuccess("");
      setAnimating(true);
      try {
        const credentials = {
          email: loginEmail,
          password: loginPassword,
        };

        const result = await login(credentials);
        setAnimating(false);

        if (result.success) {
          setSuccess("¡Inicio de sesión exitoso!");
          setTimeout(() => {
            if (result.role === "admin") {
              navigate("/admin");
            } else {
              navigate("/Inicio");
            }
          }, 1500);
        } else {
          setError(result.message || "Error de autenticación");
          setSuccess("");
        }
      } catch (err) {
        setAnimating(false);
        setError("Error al iniciar sesión. Por favor, intenta de nuevo.");
        setSuccess("");
      }
    } else {
      setError("Por favor, completa todos los campos correctamente.");
      setSuccess("");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const errors = {
      name: !name,
      phone: !phone || !validatePhone(phone),
      email: !email || !validateEmail(email),
      password: !password || password.length < 8,
      confirmPassword: !confirmPassword || password !== confirmPassword,
      acceptTerms: !acceptTerms,
    };
    setFieldErrors(errors);

    if (!Object.values(errors).some(Boolean)) {
      setError("");
      setSuccess("");
      setAnimating(true);
      try {
        const registerData = {
          name,
          email,
          password,
          phone,
        };

        const result = await register(registerData);
        setAnimating(false);
        if (result.success) {
          setSuccess(result.message);
          setName("");
          setPhone("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setAcceptTerms(false);
          setTimeout(() => {
            toggleForm();
            setLoginEmail(email);
            setSuccess("");
            setError("");
          }, 2000);
        } else {
          setError(result.message || "Error en el registro");
          setSuccess("");
        }
      } catch (err) {
        setAnimating(false);
        setError("Error al registrarse. Por favor, intenta de nuevo.");
        setSuccess("");
      }
    } else {
      setError("Por favor, completa todos los campos correctamente.");
      setSuccess("");
    }
  };

  const passwordStrength = (pass) => {
    if (!pass) return 0;
    let strength = 0;
    if (pass.length >= 8) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    return strength;
  };

  const getPasswordStrengthColor = () => {
    const strength = passwordStrength(password);
    if (strength === 0) return stylesPublic.colors.semantic.error.main;
    if (strength === 1) return stylesPublic.colors.semantic.warning.main;
    if (strength === 2) return stylesPublic.colors.semantic.warning.light;
    if (strength === 3) return stylesPublic.colors.secondary[500];
    if (strength === 4) return stylesPublic.colors.secondary[500];
  };

  const getPasswordStrengthText = () => {
    const strength = passwordStrength(password);
    if (strength === 0) return "Muy débil";
    if (strength === 1) return "Débil";
    if (strength === 2) return "Media";
    if (strength === 3) return "Fuerte";
    if (strength === 4) return "Muy fuerte";
  };

  const cssStyles = `
    .login-container {
      min-height: 100vh;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, rgba(214, 51, 132, 0.08) 0%, rgba(107, 155, 107, 0.06) 50%, rgba(230, 167, 86, 0.04) 100%),
                  linear-gradient(${stylesPublic.colors.surface.overlay}, ${stylesPublic.colors.surface.overlay}), 
                  url(${backgroundImages[currentImageIndex]});
      background-size: cover;
      background-position: center;
      background-attachment: scroll; /* Cambiar de fixed a scroll para evitar conflictos */
      padding: ${stylesPublic.spacing.scale[4]};
      padding-top: 88px; /* Espacio para navbar fijo (72px + 16px margen) */
      font-family: ${stylesPublic.typography.families.body};
      position: relative;
      z-index: 1; /* Z-index bajo para que navbar (1100) esté por encima */
      /* Asegurar que no se cree contexto de apilamiento conflictivo */
      isolation: isolate;
    }

    .login-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 30% 20%, rgba(214, 51, 132, 0.12) 0%, transparent 50%),
                  radial-gradient(circle at 70% 80%, rgba(107, 155, 107, 0.10) 0%, transparent 50%);
      pointer-events: none;
      z-index: -1; /* Enviar atrás para que no interfiera */
    }

    .login-inner-container {
      display: flex;
      max-width: ${stylesPublic.utils.container.maxWidth.xl};
      width: 100%;
      position: relative;
      z-index: 2; /* Por encima del background pero por debajo del navbar (1100) */
      gap: ${stylesPublic.spacing.scale[8]};
      align-items: center;
    }

    .login-left-panel {
      flex: 1;
      padding: ${stylesPublic.spacing.scale[12]} ${stylesPublic.spacing.scale[8]};
      color: ${stylesPublic.colors.text.inverse};
      display: none;
      background: ${stylesPublic.colors.gradients.elegant};
      backdrop-filter: blur(20px);
      border-radius: ${stylesPublic.borders.radius.xl};
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: ${stylesPublic.shadows.xl};
    }

    @media (min-width: ${stylesPublic.breakpoints.lg}) {
      .login-left-panel {
        display: block;
      }
    }

    .login-right-panel {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: ${stylesPublic.spacing.scale[4]};
    }

    .login-form-wrapper {
      position: relative;
      width: 100%;
      max-width: 480px;
      background: ${stylesPublic.colors.surface.glass};
      backdrop-filter: blur(20px);
      border-radius: ${stylesPublic.borders.radius.xl};
      box-shadow: ${stylesPublic.shadows.brand.elegant};
      border: 1px solid rgba(255, 255, 255, 0.2);
      overflow: hidden;
      height: ${formHeight};
      min-height: 400px;
      transition: height ${stylesPublic.animations.duration.elegant} ${stylesPublic.animations.easing.elegant};
    }

    .login-form-container {
      width: 100%;
      height: 100%;
      transition: opacity ${stylesPublic.animations.duration.elegant} ${stylesPublic.animations.easing.elegant};
      opacity: ${animating ? 0.8 : 1};
    }

    .login-form-panel {
      width: 100%;
      padding: ${stylesPublic.spacing.scale[10]} ${stylesPublic.spacing.scale[8]};
      box-sizing: border-box;
      min-height: fit-content;
    }

    .login-logo {
      text-align: center;
      margin-bottom: ${stylesPublic.spacing.scale[8]};
    }

    .login-logo-text {
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

    .login-logo-subtext {
      font-size: ${stylesPublic.typography.scale.sm};
      color: ${stylesPublic.colors.text.secondary};
      margin-top: ${stylesPublic.spacing.scale[2]};
      font-style: italic;
      opacity: 0.8;
    }

    .login-title {
      font-size: ${stylesPublic.typography.scale["2xl"]};
      margin-bottom: ${stylesPublic.spacing.scale[2]};
      text-align: center;
      color: ${stylesPublic.colors.text.primary};
      font-weight: ${stylesPublic.typography.weights.bold};
      font-family: ${stylesPublic.typography.families.display};
    }

    .login-subtitle {
      font-size: ${stylesPublic.typography.scale.base};
      text-align: center;
      color: ${stylesPublic.colors.text.secondary};
      margin-bottom: ${stylesPublic.spacing.scale[8]};
      opacity: 0.9;
    }

    .login-input-box {
      position: relative;
      width: 100%;
      margin-bottom: ${stylesPublic.spacing.scale[6]};
    }

    .login-label {
      display: block;
      margin-bottom: ${stylesPublic.spacing.scale[2]};
      font-size: ${stylesPublic.typography.scale.sm};
      font-weight: ${stylesPublic.typography.weights.semibold};
      color: ${stylesPublic.colors.text.primary};
      opacity: 0.9;
    }

    .login-input {
      ${Object.entries(stylesPublic.components.input.base).map(([key, value]) => 
        `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`
      ).join(' ')}
      padding-right: ${stylesPublic.spacing.scale[12]};
      backdrop-filter: blur(10px);
    }

    .login-input:focus {
      outline: none;
      border: 1px solid ${stylesPublic.colors.primary[500]};
      box-shadow: 0 0 0 3px rgba(214, 51, 132, 0.1);
      background: rgba(255, 255, 255, 0.95);
      transform: translateY(-1px);
    }

    .login-input::placeholder {
      color: ${stylesPublic.colors.text.muted};
      font-size: ${stylesPublic.typography.scale.sm};
    }

    .login-input.input-error {
      border: 1px solid ${stylesPublic.colors.semantic.error.main};
      background: rgba(225, 29, 72, 0.05);
      animation: shake 0.5s ease-in-out;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-4px); }
      75% { transform: translateX(4px); }
    }

    .login-error-text {
      color: ${stylesPublic.colors.semantic.error.main};
      font-size: ${stylesPublic.typography.scale.xs};
      margin-top: ${stylesPublic.spacing.scale[1]};
      font-weight: ${stylesPublic.typography.weights.semibold};
      display: flex;
      align-items: center;
      gap: ${stylesPublic.spacing.scale[1]};
    }

    .login-icon {
      position: absolute;
      right: ${stylesPublic.spacing.scale[4]};
      top: 50%;
      transform: translateY(-50%);
      font-size: ${stylesPublic.typography.scale.lg};
      color: ${stylesPublic.colors.primary[500]};
      display: flex;
      align-items: center;
      justify-content: center;
      width: ${stylesPublic.spacing.scale[6]};
      height: ${stylesPublic.spacing.scale[6]};
      pointer-events: none;
      opacity: 0.7;
    }

    .login-toggle-password {
      position: absolute;
      right: ${stylesPublic.spacing.scale[4]};
      top: 50%;
      transform: translateY(-50%);
      font-size: ${stylesPublic.typography.scale.lg};
      color: ${stylesPublic.colors.primary[500]};
      display: flex;
      align-items: center;
      justify-content: center;
      width: ${stylesPublic.spacing.scale[6]};
      height: ${stylesPublic.spacing.scale[6]};
      cursor: pointer;
      pointer-events: auto;
      transition: ${stylesPublic.animations.transitions.elegant};
      border-radius: ${stylesPublic.borders.radius.sm};
    }

    .login-toggle-password:hover {
      color: ${stylesPublic.colors.primary[700]};
      background: rgba(214, 51, 132, 0.1);
      transform: translateY(-50%) scale(1.1);
    }

    .login-password-strength {
      display: ${password ? "block" : "none"};
      width: 100%;
      height: 4px;
      background-color: ${stylesPublic.colors.neutral[200]};
      margin-top: ${stylesPublic.spacing.scale[2]};
      border-radius: ${stylesPublic.borders.radius.full};
      overflow: hidden;
    }

    .login-password-strength-bar {
      height: 100%;
      transition: all ${stylesPublic.animations.duration.elegant} ${stylesPublic.animations.easing.elegant};
      border-radius: ${stylesPublic.borders.radius.full};
    }

    .login-password-strength-text {
      font-size: ${stylesPublic.typography.scale.xs};
      margin-top: ${stylesPublic.spacing.scale[1]};
      text-align: right;
      transition: color ${stylesPublic.animations.duration.elegant} ${stylesPublic.animations.easing.elegant};
      font-weight: ${stylesPublic.typography.weights.semibold};
    }

    .login-checkbox-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: ${stylesPublic.spacing.scale[6]};
      flex-wrap: wrap;
      gap: ${stylesPublic.spacing.scale[3]};
    }

    .login-checkbox-label {
      display: flex;
      align-items: center;
      color: ${stylesPublic.colors.text.primary};
      font-size: ${stylesPublic.typography.scale.sm};
      cursor: pointer;
      transition: ${stylesPublic.animations.transitions.colors};
    }

    .login-checkbox-label:hover {
      color: ${stylesPublic.colors.primary[500]};
    }

    .login-checkbox {
      margin-right: ${stylesPublic.spacing.scale[2]};
      cursor: pointer;
      accent-color: ${stylesPublic.colors.primary[500]};
      transform: scale(1.1);
    }

    .login-forgot-password {
      color: ${stylesPublic.colors.primary[500]};
      font-size: ${stylesPublic.typography.scale.sm};
      text-decoration: none;
      transition: ${stylesPublic.animations.transitions.colors};
      font-weight: ${stylesPublic.typography.weights.semibold};
    }

    .login-forgot-password:hover {
      color: ${stylesPublic.colors.primary[700]};
      text-decoration: underline;
    }

    .login-button {
      width: 100%;
      ${Object.entries({
        ...stylesPublic.components.button.sizes.base,
        ...stylesPublic.components.button.variants.primary
      }).map(([key, value]) => 
        `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`
      ).join(' ')}
      border: none;
      outline: none;
      cursor: pointer;
      font-weight: ${stylesPublic.typography.weights.semibold};
      margin-top: ${stylesPublic.spacing.scale[2]};
      position: relative;
      overflow: hidden;
      font-family: ${stylesPublic.typography.families.body};
      letter-spacing: 0.025em;
      background: ${stylesPublic.colors.gradients.primary};
    }

    .login-button:hover {
      transform: translateY(-2px);
      box-shadow: ${stylesPublic.shadows.brand.glow};
      background: linear-gradient(135deg, ${stylesPublic.colors.primary[600]} 0%, ${stylesPublic.colors.primary[400]} 100%);
    }

    .login-button:active {
      transform: translateY(0);
    }

    .login-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }

    .login-switch-form {
      text-align: center;
      margin-top: ${stylesPublic.spacing.scale[8]};
      color: ${stylesPublic.colors.text.primary};
      font-size: ${stylesPublic.typography.scale.sm};
    }

    .login-link {
      color: ${stylesPublic.colors.primary[500]};
      text-decoration: none;
      cursor: pointer;
      font-weight: ${stylesPublic.typography.weights.semibold};
      transition: ${stylesPublic.animations.transitions.colors};
    }

    .login-link:hover {
      color: ${stylesPublic.colors.primary[700]};
      text-decoration: underline;
    }

    .login-terms-text {
      font-size: ${stylesPublic.typography.scale.xs};
      color: ${stylesPublic.colors.text.secondary};
      text-align: center;
      margin-top: ${stylesPublic.spacing.scale[6]};
      line-height: ${stylesPublic.typography.leading.normal};
      opacity: 0.8;
    }

    .login-highlight {
      color: ${stylesPublic.colors.primary[500]};
      text-decoration: underline;
      cursor: pointer;
      font-weight: ${stylesPublic.typography.weights.semibold};
      transition: ${stylesPublic.animations.transitions.colors};
    }

    .login-highlight:hover {
      color: ${stylesPublic.colors.primary[700]};
    }

    .login-alert-success {
      background: linear-gradient(135deg, ${stylesPublic.colors.semantic.success.light}, rgba(34, 197, 94, 0.1));
      color: ${stylesPublic.colors.semantic.success.main};
      padding: ${stylesPublic.spacing.scale[4]};
      border-radius: ${stylesPublic.borders.radius.lg};
      border-left: 4px solid ${stylesPublic.colors.semantic.success.main};
      margin-bottom: ${stylesPublic.spacing.scale[6]};
      font-size: ${stylesPublic.typography.scale.sm};
      font-weight: ${stylesPublic.typography.weights.semibold};
      backdrop-filter: blur(10px);
    }

    .login-alert-error {
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

    .feature-item {
      display: flex;
      align-items: center;
      margin-bottom: ${stylesPublic.spacing.scale[4]};
      padding: ${stylesPublic.spacing.scale[4]};
      background: rgba(255, 255, 255, 0.1);
      border-radius: ${stylesPublic.borders.radius.lg};
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: ${stylesPublic.animations.transitions.elegant};
    }

    .feature-item:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateX(4px);
    }

    .feature-icon {
      font-size: ${stylesPublic.typography.scale.xl};
      margin-right: ${stylesPublic.spacing.scale[3]};
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }

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
      0%, 100% { 
        transform: translateY(0px) scale(1) rotate(0deg); 
        opacity: 0.4; 
      }
      33% { 
        transform: translateY(-20px) scale(1.2) rotate(120deg); 
        opacity: 0.8; 
      }
      66% { 
        transform: translateY(-10px) scale(0.8) rotate(240deg); 
        opacity: 0.6; 
      }
    }

    /* Responsive Design */
    @media (max-width: ${stylesPublic.breakpoints.lg}) {
      .login-container {
        padding: ${stylesPublic.spacing.scale[2]};
        align-items: flex-start;
        padding-top: 88px; /* Espacio para navbar fijo en móviles */
      }
      
      .login-inner-container {
        flex-direction: column;
        gap: 0;
      }
      
      .login-left-panel {
        display: none !important;
      }
      
      .login-right-panel {
        width: 100%;
        padding: 0;
      }
      
      .login-form-wrapper {
        max-width: 100%;
        margin: 0;
        border-radius: ${stylesPublic.borders.radius.xl};
      }
      
      .login-form-panel {
        padding: ${stylesPublic.spacing.scale[6]} ${stylesPublic.spacing.scale[4]};
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.sm}) {
      .login-form-wrapper {
        border-radius: ${stylesPublic.borders.radius.lg};
      }
      
      .login-form-panel {
        padding: ${stylesPublic.spacing.scale[4]} ${stylesPublic.spacing.scale[3]};
      }
      
      .login-title {
        font-size: ${stylesPublic.typography.scale.xl};
      }
      
      .login-input {
        font-size: ${stylesPublic.typography.scale.sm};
        padding: ${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[10]} ${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[3]};
      }
      
      .login-button {
        font-size: ${stylesPublic.typography.scale.sm};
        padding: ${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[4]};
      }
    }
  `;

  return (
    <>
      <style>{cssStyles}</style>

      {/* Floating decorative elements */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: stylesPublic.utils.zIndex.hide,
        }}
      >
        <div
          className="floating-element"
          style={{
            top: "15%",
            left: "8%",
            background: stylesPublic.colors.primary[500],
            animationDelay: "0s",
          }}
        ></div>
        <div
          className="floating-element"
          style={{
            top: "70%",
            right: "12%",
            background: stylesPublic.colors.secondary[500],
            animationDelay: "4s",
          }}
        ></div>
        <div
          className="floating-element"
          style={{
            bottom: "25%",
            left: "15%",
            background: stylesPublic.colors.primary[300],
            animationDelay: "8s",
          }}
        ></div>
        <div
          className="floating-element"
          style={{
            top: "40%",
            right: "25%",
            background: stylesPublic.colors.primary[500],
            animationDelay: "2s",
          }}
        ></div>
        <div
          className="floating-element"
          style={{
            bottom: "60%",
            left: "70%",
            background: stylesPublic.colors.secondary[500],
            animationDelay: "6s",
          }}
        ></div>
      </div>

      <div className="login-container">
        <div className="login-inner-container">
          {/* Left panel - Brand information */}
          <div className="login-left-panel">
            <div>
              <div style={{ marginBottom: stylesPublic.spacing.scale[12] }}>
                <h1
                  style={{
                    fontSize: stylesPublic.typography.scale["2xl"],
                    fontWeight: stylesPublic.typography.weights.bold,
                    color: stylesPublic.colors.surface.primary,
                    marginBottom: stylesPublic.spacing.scale[4],
                    fontFamily: stylesPublic.typography.families.display,
                  }}
                >
                  Bienvenido a La Aterciopelada
                </h1>
                <p
                  style={{
                    fontSize: stylesPublic.typography.scale.base,
                    color: stylesPublic.colors.surface.primary,
                    opacity: 0.9,
                    lineHeight: stylesPublic.typography.leading.normal,
                  }}
                >
                  Descubre el arte textil de la Huasteca. Únete a nuestra comunidad para acceder a productos exclusivos,
                  eventos culturales y más.
                </p>
              </div>

              {[
                { icon: "👗", text: "Prendas artesanales únicas" },
                { icon: "🧵", text: "Técnicas de bordado tradicional" },
                { icon: "🎨", text: "Diseños exclusivos huastecos" },
                { icon: "✨", text: "Eventos culturales especiales" },
              ].map((feature, index) => (
                <div key={index} className="feature-item">
                  <div className="feature-icon">{feature.icon}</div>
                  <div
                    style={{
                      fontSize: stylesPublic.typography.scale.base,
                      color: stylesPublic.colors.surface.primary,
                      fontWeight: stylesPublic.typography.weights.semibold,
                    }}
                  >
                    {feature.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel - Forms */}
          <div className="login-right-panel">
            <div className="login-form-wrapper" ref={formWrapperRef}>
              <div className="login-form-container">
                {isLogin ? (
                  /* Login Form */
                  <div className="login-form-panel" ref={activeFormRef}>
                    <div className="login-logo">
                      <h1 className="login-logo-text">La Aterciopelada</h1>
                      <p className="login-logo-subtext">Arte Textil Huasteco</p>
                    </div>
                    <div>
                      <h2 className="login-title">Iniciar Sesión</h2>
                      <p className="login-subtitle">Accede a tu cuenta para continuar</p>

                      {error && <div className="login-alert-error">{error}</div>}
                      {success && <div className="login-alert-success">{success}</div>}

                      <form onSubmit={handleLoginSubmit}>
                        <div className="login-input-box">
                          <label className="login-label">Correo Electrónico*</label>
                          <input
                            type="email"
                            placeholder="tu@email.com"
                            value={loginEmail}
                            onChange={(e) => {
                              setLoginEmail(e.target.value);
                              setFieldErrors({ ...fieldErrors, loginEmail: false });
                            }}
                            className={`login-input ${fieldErrors.loginEmail ? "input-error" : ""}`}
                          />
                          <span className="login-icon">
                            <IonIcon icon={mailOutline} />
                          </span>
                          {fieldErrors.loginEmail && (
                            <p className="login-error-text">⚠️ Por favor ingresa un correo válido</p>
                          )}
                        </div>

                        <div className="login-input-box">
                          <label className="login-label">Contraseña*</label>
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Tu contraseña"
                            value={loginPassword}
                            onChange={(e) => {
                              setLoginPassword(e.target.value);
                              setFieldErrors({ ...fieldErrors, loginPassword: false });
                            }}
                            className={`login-input ${fieldErrors.loginPassword ? "input-error" : ""}`}
                          />
                          <span className="login-toggle-password" onClick={togglePasswordVisibility}>
                            <IonIcon icon={showPassword ? eyeOutline : eyeOffOutline} />
                          </span>
                          {fieldErrors.loginPassword && <p className="login-error-text">⚠️ La contraseña es requerida</p>}
                        </div>

                        <div className="login-checkbox-container">
                          <label className="login-checkbox-label">
                            <input
                              type="checkbox"
                              className="login-checkbox"
                              checked={rememberMe}
                              onChange={() => setRememberMe(!rememberMe)}
                            />
                            Recordarme
                          </label>
                          <Link to="/recuperar-contrasena" className="login-forgot-password">
                            ¿Olvidaste tu contraseña?
                          </Link>
                        </div>

                        <button type="submit" className="login-button" disabled={animating}>
                          {animating ? "Iniciando..." : "Iniciar Sesión"}
                        </button>
                      </form>

                      <div className="login-switch-form">
                        ¿No tienes una cuenta?{" "}
                        <span className="login-link" onClick={toggleForm}>
                          Regístrate aquí
                        </span>
                      </div>

                      <div className="login-terms-text">
                        Al iniciar sesión, aceptas nuestras{" "}
                        <Link to="/politicas#cliente" className="login-highlight">
                          Políticas de Cliente
                        </Link>{" "}
                        y{" "}
                        <Link to="/politicas#privacidad" className="login-highlight">
                          Políticas de Privacidad
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Register Form */
                  <div className="login-form-panel" ref={activeFormRef}>
                    <div className="login-logo">
                      <h1 className="login-logo-text">La Aterciopelada</h1>
                      <p className="login-logo-subtext">Arte Textil Huasteco</p>
                    </div>
                    <div>
                      <h2 className="login-title">Crear Cuenta</h2>
                      <p className="login-subtitle">Únete a nuestra comunidad</p>

                      {error && <div className="login-alert-error">{error}</div>}
                      {success && <div className="login-alert-success">{success}</div>}

                      <form onSubmit={handleRegisterSubmit}>
                        <div className="login-input-box">
                          <label className="login-label">Nombre Completo*</label>
                          <input
                            type="text"
                            placeholder="Tu nombre completo"
                            value={name}
                            onChange={(e) => {
                              setName(e.target.value);
                              setFieldErrors({ ...fieldErrors, name: false });
                            }}
                            className={`login-input ${fieldErrors.name ? "input-error" : ""}`}
                          />
                          <span className="login-icon">
                            <IonIcon icon={personOutline} />
                          </span>
                          {fieldErrors.name && <p className="login-error-text">⚠️ El nombre es requerido</p>}
                        </div>

                        <div className="login-input-box">
                          <label className="login-label">Teléfono*</label>
                          <input
                            type="tel"
                            placeholder="+521234567890"
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value);
                              setFieldErrors({ ...fieldErrors, phone: false });
                            }}
                            className={`login-input ${fieldErrors.phone ? "input-error" : ""}`}
                          />
                          <span className="login-icon">
                            <IonIcon icon={callOutline} />
                          </span>
                          {fieldErrors.phone && (
                            <p className="login-error-text">⚠️ Por favor ingresa un teléfono válido</p>
                          )}
                        </div>

                        <div className="login-input-box">
                          <label className="login-label">Correo Electrónico*</label>
                          <input
                            type="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setFieldErrors({ ...fieldErrors, email: false });
                            }}
                            className={`login-input ${fieldErrors.email ? "input-error" : ""}`}
                          />
                          <span className="login-icon">
                            <IonIcon icon={mailOutline} />
                          </span>
                          {fieldErrors.email && <p className="login-error-text">⚠️ Por favor ingresa un correo válido</p>}
                        </div>

                        <div className="login-input-box">
                          <label className="login-label">Contraseña*</label>
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mínimo 8 caracteres"
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              setFieldErrors({ ...fieldErrors, password: false });
                            }}
                            className={`login-input ${fieldErrors.password ? "input-error" : ""}`}
                          />
                          <span className="login-toggle-password" onClick={togglePasswordVisibility}>
                            <IonIcon icon={showPassword ? eyeOutline : eyeOffOutline} />
                          </span>

                          {password && (
                            <>
                              <div className="login-password-strength">
                                <div
                                  className="login-password-strength-bar"
                                  style={{
                                    width: `${(passwordStrength(password) / 4) * 100}%`,
                                    backgroundColor: getPasswordStrengthColor(),
                                  }}
                                ></div>
                              </div>
                              <div className="login-password-strength-text" style={{ color: getPasswordStrengthColor() }}>
                                {getPasswordStrengthText()}
                              </div>
                            </>
                          )}

                          {fieldErrors.password && (
                            <p className="login-error-text">⚠️ La contraseña debe tener al menos 8 caracteres</p>
                          )}
                        </div>

                        <div className="login-input-box">
                          <label className="login-label">Confirmar Contraseña*</label>
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirma tu contraseña"
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              setFieldErrors({ ...fieldErrors, confirmPassword: false });
                            }}
                            className={`login-input ${fieldErrors.confirmPassword ? "input-error" : ""}`}
                          />
                          <span className="login-toggle-password" onClick={togglePasswordVisibility}>
                            <IonIcon icon={showPassword ? eyeOutline : eyeOffOutline} />
                          </span>
                          {fieldErrors.confirmPassword && (
                            <p className="login-error-text">⚠️ Las contraseñas no coinciden</p>
                          )}
                        </div>

                        <div style={{ marginBottom: stylesPublic.spacing.scale[6] }}>
                          <label className="login-checkbox-label">
                            <input
                              type="checkbox"
                              className="login-checkbox"
                              checked={acceptTerms}
                              onChange={() => {
                                setAcceptTerms(!acceptTerms);
                                setFieldErrors({ ...fieldErrors, acceptTerms: false });
                              }}
                            />
                            Acepto los términos y condiciones
                          </label>
                          {fieldErrors.acceptTerms && <p className="login-error-text">⚠️ Debes aceptar los términos</p>}
                        </div>

                        <button type="submit" className="login-button" disabled={animating}>
                          {animating ? "Creando cuenta..." : "Crear Cuenta"}
                        </button>
                      </form>

                      <div className="login-switch-form">
                        ¿Ya tienes una cuenta?{" "}
                        <span className="login-link" onClick={toggleForm}>
                          Inicia sesión aquí
                        </span>
                      </div>

                      <div className="login-terms-text">
                        Al registrarte, aceptas recibir correos electrónicos sobre nuestros productos y eventos
                        culturales.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;