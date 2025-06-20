"use client"

import { useState, useEffect, useMemo, useContext } from "react"
import { Button } from "react-bootstrap"
import { IonIcon } from "@ionic/react"
import { eyeOffOutline, eyeOutline, mailOutline, callOutline, personOutline } from "ionicons/icons"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import stylesPublic from "../../styles/stylesPublic"

const Login = () => {
  const [searchParams] = useSearchParams()
  const [isLogin, setIsLogin] = useState(!searchParams.get("register"))
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [animating, setAnimating] = useState(false)

  // Form states
  const [name, setName] = useState("") // Changed from nombre and apellido to name
  const [phone, setPhone] = useState("") // Changed from telefono to phone
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  // Field errors
  const [fieldErrors, setFieldErrors] = useState({
    name: false, // Changed from nombre and apellido
    phone: false, // Changed from telefono
    email: false,
    password: false,
    confirmPassword: false,
    loginEmail: false,
    loginPassword: false,
    acceptTerms: false,
  })
  // Contexto y navegación
  const { login, register } = useContext(AuthContext)
  const navigate = useNavigate()

  // Background images
  const backgroundImages = useMemo(
    () => [
      "https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=2787",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2787",
    ],
    [],
  )

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length)
    setCurrentImageIndex(randomIndex)
    if (searchParams.get("register")) {
      setIsLogin(false)
    }
  }, [searchParams, backgroundImages])

  useEffect(() => {
    if (animating) {
      const timer = setTimeout(() => setAnimating(false), 600)
      return () => clearTimeout(timer)
    }
  }, [animating])

  const toggleForm = () => {
    setAnimating(true)
    setTimeout(() => {
      setIsLogin(!isLogin)
      setError("")
      setSuccess("")
      setFieldErrors({
        name: false,
        phone: false,
        email: false,
        password: false,
        confirmPassword: false,
        loginEmail: false,
        loginPassword: false,
        acceptTerms: false,
      })
    }, 300)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePhone = (phone) => {
    return /^\+?\d{10,15}$/.test(phone.replace(/\s/g, "")) // Basic phone validation (10-15 digits, optional +)
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    const errors = {
      loginEmail: !loginEmail || !validateEmail(loginEmail),
      loginPassword: !loginPassword,
    }
    setFieldErrors(errors)

    if (!errors.loginEmail && !errors.loginPassword) {
      setError("")
      setSuccess("")
      setAnimating(true)
      try {
        const credentials = {
          email: loginEmail,
          password: loginPassword,
        }
        
        const result = await login(credentials)
        setAnimating(false)
        
        if (result.success) {
          setSuccess("¡Inicio de sesión exitoso!")
          setTimeout(() => {
            if (result.role === 'admin') {
              navigate("/admin")
            } else {
              navigate("/Inicio")
            }
          }, 1500)
        } else {
          setError(result.message || "Error de autenticación")
          setSuccess("")
        }
      } catch (err) {
        setAnimating(false)
        setError("Error al iniciar sesión. Por favor, intenta de nuevo.")
        setSuccess("")
      }
    } else {
      setError("Por favor, completa todos los campos correctamente.")
      setSuccess("")
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    const errors = {
      name: !name,
      phone: !phone || !validatePhone(phone),
      email: !email || !validateEmail(email),
      password: !password || password.length < 8, // Enforce backend's minlength
      confirmPassword: !confirmPassword || password !== confirmPassword,
      acceptTerms: !acceptTerms,
    }
    setFieldErrors(errors)

    if (!Object.values(errors).some(Boolean)) {
      setError("")
      setSuccess("")
      setAnimating(true)
      try {
        const registerData = {
          name,
          email,
          password,
          phone,
        }

        const result = await register(registerData)
        setAnimating(false)
        if (result.success) {
          setSuccess(result.message)
          setName("")
          setPhone("")
          setEmail("")
          setPassword("")
          setConfirmPassword("")
          setAcceptTerms(false)
          setTimeout(() => {
            toggleForm()
            setLoginEmail(email)
            setSuccess("")
            setError("")
          }, 2000)
        } else {
          setError(result.message || "Error en el registro")
          setSuccess("")
        }
      } catch (err) {
        setAnimating(false)
        setError("Error al registrarse. Por favor, intenta de nuevo.")
        setSuccess("")
      }
    } else {
      setError("Por favor, completa todos los campos correctamente.")
      setSuccess("")
    }
  }

  const passwordStrength = (pass) => {
    if (!pass) return 0
    let strength = 0
    if (pass.length >= 8) strength += 1
    if (/[A-Z]/.test(pass)) strength += 1
    if (/[0-9]/.test(pass)) strength += 1
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1
    return strength
  }
  const getPasswordStrengthColor = () => {
    const strength = passwordStrength(password)
    if (strength === 0) return stylesPublic.colors.state.error
    if (strength === 1) return stylesPublic.colors.accent.orange
    if (strength === 2) return stylesPublic.colors.accent.yellow
    if (strength === 3) return stylesPublic.colors.secondary.main
    if (strength === 4) return stylesPublic.colors.secondary.dark
  }

  const getPasswordStrengthText = () => {
    const strength = passwordStrength(password)
    if (strength === 0) return "Muy débil"
    if (strength === 1) return "Débil"
    if (strength === 2) return "Media"
    if (strength === 3) return "Fuerte"
    if (strength === 4) return "Muy fuerte"
  }
  const cssStyles = `
    :root {
      --huasteca-red: ${stylesPublic.colors.primary.main};
      --huasteca-green: ${stylesPublic.colors.secondary.main};
      --huasteca-beige: ${stylesPublic.colors.background.alt};
      --huasteca-dark: ${stylesPublic.colors.text.primary};
      --huasteca-pink: ${stylesPublic.colors.primary.light};
    }

    .login-container {
      min-height: 100vh;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(rgba(35, 16, 45, 0.85), rgba(35, 16, 45, 0.85)), 
                  url(${backgroundImages[currentImageIndex]});
      background-size: cover;
      background-position: center;
      background-blend-mode: overlay;
      padding: 15px;
      font-family: 'Roboto', sans-serif;
      overflow-x: hidden;
    }

    .login-inner-container {
      display: flex;
      max-width: 1100px;
      width: 100%;
      position: relative;
      min-height: min-content;
      margin: auto;
    }

    .login-left-panel {
      flex: 1 1 45%;
      padding: 40px;
      color: var(--huasteca-beige);
      display: none;
    }

    @media (min-width: 992px) {
      .login-left-panel {
        display: block;
      }
    }

    .login-left-content {
      max-width: 450px;
      margin-left: auto;
      margin-right: 20px;
    }    .login-welcome-title {
      font-size: ${stylesPublic.typography.fontSize.h1};
      font-weight: ${stylesPublic.typography.fontWeight.bold};
      margin-bottom: ${stylesPublic.spacing.md};
      line-height: ${stylesPublic.typography.lineHeight.tight};
      font-family: ${stylesPublic.typography.fontFamily.heading};
      color: var(--huasteca-beige);
    }

    .login-welcome-text {
      font-size: 0.95rem;
      margin-bottom: 1.5rem;
      line-height: 1.6;
      color: rgba(245, 232, 199, 0.8);
    }

    .login-brand-feature {
      margin-bottom: 1.2rem;
      display: flex;
      align-items: center;
    }

    .login-feature-icon {
      font-size: 1.2rem;
      margin-right: 0.8rem;
      width: 35px;
      height: 35px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(255, 0, 112, 0.3);
      color: var(--huasteca-beige);
    }

    .login-feature-text {
      font-size: 0.9rem;
      color: rgba(245, 232, 199, 0.8);
    }

    .login-right-panel {
      flex: 1 1 55%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 15px;
    }    .login-form-wrapper {
      position: relative;
      width: 100%;
      max-width: 450px;
      background: rgba(255, 248, 225, 0.95);
      backdrop-filter: blur(10px);
      border-radius: ${stylesPublic.borders.radius.xl};
      box-shadow: ${stylesPublic.shadows.xl};
      overflow: hidden;
      border: ${stylesPublic.borders.style.accent};
      transition: ${stylesPublic.transitions.preset.default};
      margin: ${stylesPublic.spacing.md} auto;
    }

    .login-form-slider {
      display: flex;
      width: 200%;
      transition: transform 0.6s ease-in-out;
      transform: ${isLogin ? "translateX(0)" : "translateX(-50%)"};
    }

    .login-form-panel {
      width: 50%;
      padding: ${isLogin ? "30px 25px" : "20px 20px"};
      transition: all 0.3s ease;
      opacity: ${animating ? 0.7 : 1};
      max-height: calc(100vh - 40px);
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }

    .login-form-panel::-webkit-scrollbar {
      width: 6px;
    }

    .login-form-panel::-webkit-scrollbar-thumb {
      background-color: var(--huasteca-red);
      border-radius: 3px;
    }

    .login-form-panel::-webkit-scrollbar-track {
      background: transparent;
    }

    .login-logo {
      text-align: center;
      margin-bottom: ${isLogin ? "25px" : "15px"};
    }    .login-logo-text {
      font-size: ${stylesPublic.typography.fontSize['3xl']};
      font-weight: ${stylesPublic.typography.fontWeight.bold};
      color: var(--huasteca-red);
      margin: 0;
      font-family: ${stylesPublic.typography.fontFamily.heading};
    }

    .login-logo-subtext {
      font-size: 0.8rem;
      color: var(--huasteca-dark);
      margin-top: 5px;
      font-style: italic;
    }

    .login-title {
      font-size: ${isLogin ? "1.6rem" : "1.4rem"};
      margin-bottom: ${isLogin ? "8px" : "5px"};
      text-align: center;
      color: var(--huasteca-red);
      font-weight: 600;
      font-family: 'Playfair Display', serif;
    }

    .login-subtitle {
      font-size: ${isLogin ? "0.9rem" : "0.8rem"};
      text-align: center;
      color: var(--huasteca-dark);
      margin-bottom: ${isLogin ? "25px" : "18px"};
    }

    .login-input-row {
      display: flex;
      gap: ${isLogin ? "15px" : "12px"};
      margin-bottom: ${isLogin ? "8px" : "5px"};
    }

    .login-input-box {
      position: relative;
      width: 100%;
      margin-bottom: ${isLogin ? "18px" : "12px"};
    }

    .login-label {
      display: block;
      margin-bottom: ${isLogin ? "6px" : "4px"};
      font-size: ${isLogin ? "0.9rem" : "0.8rem"};
      font-weight: 600;
      color: var(--huasteca-green);
    }    .login-input {
      width: 100%;
      background: rgba(255, 128, 144, 0.1);
      border: ${stylesPublic.borders.width.thick} solid var(--huasteca-green);
      outline: none;
      color: var(--huasteca-dark);
      padding: ${isLogin ? "12px 45px 12px 15px" : "10px 40px 10px 12px"};
      border-radius: ${stylesPublic.borders.radius.md};
      font-size: ${isLogin ? stylesPublic.typography.fontSize.md : stylesPublic.typography.fontSize.sm};
      transition: ${stylesPublic.transitions.preset.default};
    }

    .login-input:focus {
      background: rgba(255, 128, 144, 0.15);
      border-color: var(--huasteca-red);
      box-shadow: 0 0 0 2px rgba(255, 0, 112, 0.2);
    }

    .login-input::placeholder {
      color: rgba(35, 16, 45, 0.5);
      font-size: ${isLogin ? "0.9rem" : "0.8rem"};
    }

    .login-input.input-error {
      border-color: var(--huasteca-red);
      animation: pulse 0.5s ease-in-out infinite alternate;
    }

    .login-error-text {
      color: var(--huasteca-red);
      font-size: ${isLogin ? "0.8rem" : "0.7rem"};
      margin-top: ${isLogin ? "4px" : "3px"};
      font-weight: 600;
    }

    .login-icon {
      position: absolute;
      right: ${isLogin ? "15px" : "12px"};
      top: 50%;
      transform: translateY(-50%);
      font-size: ${isLogin ? "18px" : "16px"};
      color: var(--huasteca-red);
      display: flex;
      align-items: center;
      justify-content: center;
      width: ${isLogin ? "25px" : "22px"};
      height: ${isLogin ? "25px" : "22px"};
      pointer-events: none;
    }

    .login-toggle-password {
      position: absolute;
      right: ${isLogin ? "15px" : "12px"};
      top: 50%;
      transform: translateY(-50%);
      font-size: ${isLogin ? "18px" : "16px"};
      color: var(--huasteca-red);
      display: flex;
      align-items: center;
      justify-content: center;
      width: ${isLogin ? "25px" : "22px"};
      height: ${isLogin ? "25px" : "22px"};
      cursor: pointer;
      pointer-events: auto;
    }

    .login-password-strength {
      display: ${password ? "block" : "none"};
      width: 100%;
      height: 3px;
      background-color: rgba(255, 0, 112, 0.1);
      margin-top: 6px;
      border-radius: 2px;
      overflow: hidden;
    }

    .login-password-strength-bar {
      height: 100%;
      transition: width 0.3s ease, background-color 0.3s ease;
    }

    .login-password-strength-text {
      font-size: ${isLogin ? "11px" : "10px"};
      margin-top: 4px;
      text-align: right;
      transition: color 0.3s ease;
    }

    .login-checkbox-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: ${isLogin ? "20px" : "15px"};
      flex-wrap: wrap;
      gap: 10px;
    }

    .login-checkbox-label {
      display: flex;
      align-items: center;
      color: var(--huasteca-dark);
      font-size: ${isLogin ? "13px" : "11px"};
      cursor: pointer;
    }

    .login-checkbox {
      margin-right: 6px;
      cursor: pointer;
      accent-color: var(--huasteca-red);
    }

    .login-forgot-password {
      color: var(--huasteca-red);
      font-size: ${isLogin ? "13px" : "11px"};
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .login-forgot-password:hover {
      color: var(--huasteca-dark);
      text-decoration: underline;
    }    .login-button {
      width: 100%;
      padding: ${isLogin ? "14px" : "12px"};
      background: ${stylesPublic.colors.background.gradient.cta};
      border: none;
      outline: none;
      border-radius: ${stylesPublic.borders.radius.button};
      cursor: pointer;
      font-size: ${isLogin ? stylesPublic.typography.fontSize.lg : stylesPublic.typography.fontSize.md};
      color: var(--huasteca-beige);
      font-weight: ${stylesPublic.typography.fontWeight.semiBold};
      transition: ${stylesPublic.transitions.preset.buttonHover};
      margin-top: ${isLogin ? stylesPublic.spacing.sm : stylesPublic.spacing.xs};
      box-shadow: ${stylesPublic.shadows.button};
      position: relative;
      overflow: hidden;
    }

    .login-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 0, 112, 0.4);
    }

    .login-button:active {
      transform: translateY(1px);
    }

    .login-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .login-button::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      transition: all 0.5s ease;
    }

    .login-button:hover::after {
      left: 100%;
    }

    .login-switch-form {
      text-align: center;
      margin-top: ${isLogin ? "20px" : "15px"};
      color: var(--huasteca-dark);
      font-size: ${isLogin ? "13px" : "11px"};
    }

    .login-link {
      color: var(--huasteca-red);
      text-decoration: none;
      cursor: pointer;
      font-weight: 600;
      transition: color 0.3s ease;
    }

    .login-link:hover {
      color: var(--huasteca-dark);
      text-decoration: underline;
    }

    .login-terms-text {
      font-size: ${isLogin ? "10px" : "9px"};
      color: var(--huasteca-dark);
      text-align: center;
      margin-top: ${isLogin ? "15px" : "12px"};
      line-height: 1.3;
    }

    .login-highlight {
      color: var(--huasteca-red);
      text-decoration: underline;
      cursor: pointer;
      font-weight: 600;
    }    .login-alert-success {
      background-color: rgba(31, 138, 128, 0.2);
      color: ${stylesPublic.colors.state.success};
      padding: ${isLogin ? "12px 15px" : "10px 12px"};
      border-radius: ${stylesPublic.borders.radius.md};
      border-left: ${stylesPublic.borders.width.thicker} solid var(--huasteca-green);
      margin-bottom: ${isLogin ? stylesPublic.spacing.md : stylesPublic.spacing.sm};
      font-size: ${isLogin ? stylesPublic.typography.fontSize.sm : stylesPublic.typography.fontSize.xs};
    }

    .login-alert-error {
      background-color: rgba(255, 0, 112, 0.2);
      color: ${stylesPublic.colors.state.error};
      padding: ${isLogin ? "12px 15px" : "10px 12px"};
      border-radius: ${stylesPublic.borders.radius.md};
      border-left: ${stylesPublic.borders.width.thicker} solid var(--huasteca-red);
      margin-bottom: ${isLogin ? stylesPublic.spacing.md : stylesPublic.spacing.sm};
      font-size: ${isLogin ? stylesPublic.typography.fontSize.sm : stylesPublic.typography.fontSize.xs};
    }

    @media (max-width: 1200px) {
      .login-inner-container {
        max-width: 950px;
      }
      
      .login-left-content {
        padding-right: 15px;
      }
      
      .login-welcome-title {
        font-size: 2rem;
      }
    }

    @media (max-width: 992px) {
      .login-container {
        padding: 20px;
        min-height: calc(100vh - 40px);
        background: linear-gradient(rgba(35, 16, 45, 0.9), rgba(35, 16, 45, 0.9)),
                    url(${backgroundImages[currentImageIndex]});
      }
      
      .login-form-wrapper {
        max-width: 500px;
        margin: 0 auto;
      }

      .login-form-panel {
        padding: 25px 20px;
      }
    }

    @media (max-width: 576px) {
      .login-container {
        padding: 10px;
        min-height: calc(100vh - 20px);
      }

      .login-form-wrapper {
        margin: 10px auto;
      }

      .login-form-panel {
        padding: 15px;
        max-height: calc(100vh - 30px);
      }

      .login-input-row {
        flex-direction: column;
        gap: 0;
      }

      .login-input-box {
        margin-bottom: 12px;
      }

      .login-checkbox-container {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
    }

    @media (max-height: 600px) {
      .login-container {
        align-items: flex-start;
        padding: 10px 5px;
      }

      .login-form-wrapper {
        margin: 5px auto;
      }
    }

    @keyframes pulse {
      from { box-shadow: 0 0 0 0 rgba(255, 0, 112, 0.3); }
      to { box-shadow: 0 0 0 6px rgba(255, 0, 112, 0.1); }
    }

    .floating-element {
      position: fixed;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      opacity: 0.7;
      animation: float 8s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }
      50% { transform: translateY(-20px) scale(1.2); opacity: 0.8; }
    }
  `

  return (
    <>
      <style>{cssStyles}</style>

      <div
        className="floating-elements"
        style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}
      >        <div className="floating-element" style={{ top: "20%", left: "10%", background: stylesPublic.colors.primary.main }}></div>
        <div
          className="floating-element"
          style={{ top: "60%", right: "15%", background: stylesPublic.colors.secondary.main, animationDelay: "2s" }}
        ></div>
        <div
          className="floating-element"
          style={{ bottom: "30%", left: "20%", background: stylesPublic.colors.primary.light, animationDelay: "4s" }}
        ></div>
      </div>

      <div className="login-container">
        <div className="login-inner-container">
          <div className="login-left-panel">
            <div className="login-left-content">
              <div style={{ marginBottom: "50px" }}>
                <h1 className="login-welcome-title">Bienvenido a La Aterciopelada</h1>
                <p className="login-welcome-text">
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
                <div key={index} className="login-brand-feature">
                  <div className="login-feature-icon">{feature.icon}</div>
                  <div className="login-feature-text">{feature.text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="login-right-panel">
            <div className="login-form-wrapper">
              <div className="login-form-slider">
                <div className="login-form-panel">
                  <div className="login-logo">
                    <h1 className="login-logo-text">La Aterciopelada</h1>
                    <p className="login-logo-subtext">Arte Textil Huasteco</p>
                  </div>
                  <div>
                    <h2 className="login-title">Iniciar Sesión</h2>
                    <p className="login-subtitle">Accede a tu cuenta para continuar</p>

                    {error && isLogin && <div className="login-alert-error">{error}</div>}
                    {success && isLogin && <div className="login-alert-success">{success}</div>}

                    <form onSubmit={handleLoginSubmit}>
                      <div className="login-input-box">
                        <label className={`login-label ${loginEmail ? "label-float" : ""}`}>Correo Electrónico*</label>
                        <input
                          type="email"
                          placeholder="Correo Electrónico"
                          value={loginEmail}
                          onChange={(e) => {
                            setLoginEmail(e.target.value)
                            setFieldErrors({ ...fieldErrors, loginEmail: false })
                          }}
                          className={`login-input ${fieldErrors.loginEmail ? "input-error" : ""}`}
                        />
                        <span className="login-icon">
                          <IonIcon icon={mailOutline} />
                        </span>
                        {fieldErrors.loginEmail && (
                          <p className="login-error-text">Por favor ingresa un correo válido</p>
                        )}
                      </div>

                      <div className="login-input-box">
                        <label className={`login-label ${loginPassword ? "label-float" : ""}`}>Contraseña*</label>
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Contraseña"
                          value={loginPassword}
                          onChange={(e) => {
                            setLoginPassword(e.target.value)
                            setFieldErrors({ ...fieldErrors, loginPassword: false })
                          }}
                          className={`login-input ${fieldErrors.loginPassword ? "input-error" : ""}`}
                        />
                        <span className="login-toggle-password" onClick={togglePasswordVisibility}>
                          <IonIcon icon={showPassword ? eyeOutline : eyeOffOutline} />
                        </span>
                        {fieldErrors.loginPassword && <p className="login-error-text">La contraseña es requerida</p>}
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

                      <Button type="submit" className="login-button" disabled={animating}>
                        Iniciar Sesión
                      </Button>
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

                <div className="login-form-panel">
                  <div className="login-logo">
                    <h1 className="login-logo-text">La Aterciopelada</h1>
                    <p className="login-logo-subtext">Arte Textil Huasteco</p>
                  </div>
                  <div>
                    <h2 className="login-title">Crear Cuenta</h2>
                    <p className="login-subtitle">Únete a nuestra comunidad</p>

                    {error && !isLogin && <div className="login-alert-error">{error}</div>}
                    {success && !isLogin && <div className="login-alert-success">{success}</div>}

                    <form onSubmit={handleRegisterSubmit}>
                      <div className="login-input-box">
                        <label className={`login-label ${name ? "label-float" : ""}`}>Nombre Completo*</label>
                        <input
                          type="text"
                          placeholder="Nombre Completo"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value)
                            setFieldErrors({ ...fieldErrors, name: false })
                          }}
                          className={`login-input ${fieldErrors.name ? "input-error" : ""}`}
                        />
                        <span className="login-icon">
                          <IonIcon icon={personOutline} />
                        </span>
                        {fieldErrors.name && <p className="login-error-text">El nombre es requerido</p>}
                      </div>

                      <div className="login-input-box">
                        <label className={`login-label ${phone ? "label-float" : ""}`}>Teléfono*</label>
                        <input
                          type="tel"
                          placeholder="Teléfono (ej. +521234567890)"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value)
                            setFieldErrors({ ...fieldErrors, phone: false })
                          }}
                          className={`login-input ${fieldErrors.phone ? "input-error" : ""}`}
                        />
                        <span className="login-icon">
                          <IonIcon icon={callOutline} />
                        </span>
                        {fieldErrors.phone && <p className="login-error-text">Por favor ingresa un teléfono válido</p>}
                      </div>

                      <div className="login-input-box">
                        <label className={`login-label ${email ? "label-float" : ""}`}>Correo Electrónico*</label>
                        <input
                          type="email"
                          placeholder="Correo Electrónico"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            setFieldErrors({ ...fieldErrors, email: false })
                          }}
                          className={`login-input ${fieldErrors.email ? "input-error" : ""}`}
                        />
                        <span className="login-icon">
                          <IonIcon icon={mailOutline} />
                        </span>
                        {fieldErrors.email && <p className="login-error-text">Por favor ingresa un correo válido</p>}
                      </div>

                      <div className="login-input-box">
                        <label className={`login-label ${password ? "label-float" : ""}`}>Contraseña*</label>
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Contraseña"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value)
                            setFieldErrors({ ...fieldErrors, password: false })
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

                        {fieldErrors.password && <p className="login-error-text">La contraseña debe tener al menos 8 caracteres</p>}
                      </div>

                      <div className="login-input-box">
                        <label className={`login-label ${confirmPassword ? "label-float" : ""}`}>
                          Confirmar Contraseña*
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirmar Contraseña"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value)
                            setFieldErrors({ ...fieldErrors, confirmPassword: false })
                          }}
                          className={`login-input ${fieldErrors.confirmPassword ? "input-error" : ""}`}
                        />
                        <span className="login-toggle-password" onClick={togglePasswordVisibility}>
                          <IonIcon icon={showPassword ? eyeOutline : eyeOffOutline} />
                        </span>
                        {fieldErrors.confirmPassword && (
                          <p className="login-error-text">Las contraseñas no coinciden</p>
                        )}
                      </div>

                      <div style={{ marginBottom: "15px" }}>
                        <label className="login-checkbox-label">
                          <input
                            type="checkbox"
                            className="login-checkbox"
                            checked={acceptTerms}
                            onChange={() => {
                              setAcceptTerms(!acceptTerms)
                              setFieldErrors({ ...fieldErrors, acceptTerms: false })
                            }}
                          />
                          Acepto los términos y condiciones
                        </label>
                        {fieldErrors.acceptTerms && <p className="login-error-text">Debes aceptar los términos</p>}
                      </div>

                      <Button type="submit" className="login-button" disabled={animating}>
                        Crear Cuenta
                      </Button>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login