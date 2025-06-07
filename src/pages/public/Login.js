"use client"

import { useState, useEffect, useMemo, useContext } from "react"
import { Button } from "react-bootstrap"
import { IonIcon } from "@ionic/react"
import { eyeOffOutline, eyeOutline, mailOutline, callOutline, personOutline } from "ionicons/icons"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"

const Login = () => {
  const [searchParams] = useSearchParams()
  const [isLogin, setIsLogin] = useState(!searchParams.get("register"))
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [animating, setAnimating] = useState(false)

  // Form states
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [telefono, setTelefono] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  // Field errors
  const [fieldErrors, setFieldErrors] = useState({
    nombre: false,
    apellido: false,
    telefono: false,
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

  // Color palette for La Aterciopelada
  const colors = {
    deepRed: "#ff0070",
    emeraldGreen: "#1f8a80",
    warmBeige: "#F5E8C7",
    darkPurple: "#23102d",
    softPink: "#ff8090",
  }

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
        nombre: false,
        apellido: false,
        telefono: false,
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
          // Redirigir según el rol del usuario
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
      nombre: !nombre,
      apellido: !apellido,
      telefono: !telefono,
      email: !email || !validateEmail(email),
      password: !password,
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
          name: `${nombre} ${apellido}`, // Combinamos nombre y apellido
          email,
          password,
          phone: telefono, // Añadimos el teléfono
        }

        const result = await register(registerData)
        setAnimating(false)
        if (result.success) {
          setSuccess(result.message)
          // Limpiar campos
          setNombre("")
          setApellido("")
          setTelefono("")
          setEmail("")
          setPassword("")
          setConfirmPassword("")
          setAcceptTerms(false)
          // Cambiar al formulario de login
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
    if (strength === 0) return colors.deepRed
    if (strength === 1) return "#ff9800"
    if (strength === 2) return "#ffeb3b"
    if (strength === 3) return colors.emeraldGreen
    if (strength === 4) return "#1B5E20"
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
      --huasteca-red: ${colors.deepRed};
      --huasteca-green: ${colors.emeraldGreen};
      --huasteca-beige: ${colors.warmBeige};
      --huasteca-dark: ${colors.darkPurple};
      --huasteca-pink: ${colors.softPink};
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
    }

    .login-inner-container {
      display: flex;
      max-width: 1100px;
      width: 100%;
      position: relative;
      min-height: 600px;
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
    }

    .login-welcome-title {
      font-size: 2.2rem;
      font-weight: bold;
      margin-bottom: 1rem;
      line-height: 1.2;
      font-family: 'Playfair Display', serif;
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
    }

    .login-form-wrapper {
      position: relative;
      width: 100%;
      max-width: 450px;
      background: rgba(255, 248, 225, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
      overflow: hidden;
      border: 1px solid rgba(232, 180, 184, 0.3);
      transition: all 0.3s ease;
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
      max-height: 85vh;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: var(--huasteca-red) transparent;
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
    }

    .login-logo-text {
      font-size: 1.8rem;
      font-weight: bold;
      color: var(--huasteca-red);
      margin: 0;
      font-family: 'Playfair Display', serif;
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
    }

    .login-input {
      width: 100%;
      background: rgba(255, 128, 144, 0.1);
      border: 2px solid var(--huasteca-green);
      outline: none;
      color: var(--huasteca-dark);
      padding: ${isLogin ? "12px 45px 12px 15px" : "10px 40px 10px 12px"};
      border-radius: 8px;
      font-size: ${isLogin ? "0.95rem" : "0.85rem"};
      transition: all 0.3s ease;
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
    }

    .login-button {
      width: 100%;
      padding: ${isLogin ? "14px" : "12px"};
      background: linear-gradient(135deg, var(--huasteca-red), var(--huasteca-green));
      border: none;
      outline: none;
      border-radius: 25px;
      cursor: pointer;
      font-size: ${isLogin ? "15px" : "13px"};
      color: var(--huasteca-beige);
      font-weight: 600;
      transition: all 0.3s ease;
      margin-top: ${isLogin ? "10px" : "8px"};
      box-shadow: 0 4px 15px rgba(255, 0, 112, 0.3);
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
    }

    .login-alert-success {
      background-color: rgba(31, 138, 128, 0.2);
      color: var(--huasteca-green);
      padding: ${isLogin ? "12px 15px" : "10px 12px"};
      border-radius: 8px;
      border-left: 3px solid var(--huasteca-green);
      margin-bottom: ${isLogin ? "20px" : "15px"};
      font-size: ${isLogin ? "13px" : "12px"};
    }

    .login-alert-error {
      background-color: rgba(255, 0, 112, 0.2);
      color: var(--huasteca-red);
      padding: ${isLogin ? "12px 15px" : "10px 12px"};
      border-radius: 8px;
      border-left: 3px solid var(--huasteca-red);
      margin-bottom: ${isLogin ? "20px" : "15px"};
      font-size: ${isLogin ? "13px" : "12px"};
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

    /* Responsive improvements */
    @media (max-width: 768px) {
      .login-container {
        padding: 10px;
      }
      
      .login-form-wrapper {
        max-width: 100%;
      }
      
      .login-form-panel {
        padding: ${isLogin ? "25px 20px" : "18px 15px"};
      }
      
      .login-input-row {
        flex-direction: column;
        gap: 0;
      }
      
      .login-checkbox-container {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
    }

    @media (max-width: 480px) {
      .login-form-panel {
        padding: ${isLogin ? "20px 15px" : "15px 12px"};
      }
      
      .login-title {
        font-size: ${isLogin ? "1.4rem" : "1.2rem"};
      }
      
      .login-welcome-title {
        font-size: 1.8rem;
      }
    }
  `

  return (
    <>
      <style>{cssStyles}</style>

      {/* Floating decorative elements */}
      <div
        className="floating-elements"
        style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}
      >
        <div className="floating-element" style={{ top: "20%", left: "10%", background: colors.deepRed }}></div>
        <div
          className="floating-element"
          style={{ top: "60%", right: "15%", background: colors.emeraldGreen, animationDelay: "2s" }}
        ></div>
        <div
          className="floating-element"
          style={{ bottom: "30%", left: "20%", background: colors.softPink, animationDelay: "4s" }}
        ></div>
      </div>

      <div className="login-container">
        <div className="login-inner-container">
          {/* Left Panel - Welcome Content */}
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

          {/* Right Panel - Sliding Forms */}
          <div className="login-right-panel">
            <div className="login-form-wrapper">
              <div className="login-form-slider">
                {/* Login Form Panel */}
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
                      {/* Email Input */}
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

                      {/* Password Input */}
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

                      {/* Remember Me & Forgot Password */}
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

                      {/* Submit Button */}
                      <Button type="submit" className="login-button" disabled={animating}>
                        Iniciar Sesión
                      </Button>
                    </form>

                    {/* Switch to Register */}
                    <div className="login-switch-form">
                      ¿No tienes una cuenta?{" "}
                      <span className="login-link" onClick={toggleForm}>
                        Regístrate aquí
                      </span>
                    </div>

                    {/* Terms */}
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

                {/* Register Form Panel */}
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
                      {/* Name Inputs */}
                      <div className="login-input-row">
                        <div className="login-input-box">
                          <label className={`login-label ${nombre ? "label-float" : ""}`}>Nombre*</label>
                          <input
                            type="text"
                            placeholder="Nombre"
                            value={nombre}
                            onChange={(e) => {
                              setNombre(e.target.value)
                              setFieldErrors({ ...fieldErrors, nombre: false })
                            }}
                            className={`login-input ${fieldErrors.nombre ? "input-error" : ""}`}
                          />
                          <span className="login-icon">
                            <IonIcon icon={personOutline} />
                          </span>
                          {fieldErrors.nombre && <p className="login-error-text">El nombre es requerido</p>}
                        </div>

                        <div className="login-input-box">
                          <label className={`login-label ${apellido ? "label-float" : ""}`}>Apellido*</label>
                          <input
                            type="text"
                            placeholder="Apellido"
                            value={apellido}
                            onChange={(e) => {
                              setApellido(e.target.value)
                              setFieldErrors({ ...fieldErrors, apellido: false })
                            }}
                            className={`login-input ${fieldErrors.apellido ? "input-error" : ""}`}
                          />
                          {fieldErrors.apellido && <p className="login-error-text">El apellido es requerido</p>}
                        </div>
                      </div>

                      {/* Phone Input */}
                      <div className="login-input-box">
                        <label className={`login-label ${telefono ? "label-float" : ""}`}>Teléfono*</label>
                        <input
                          type="tel"
                          placeholder="Teléfono"
                          value={telefono}
                          onChange={(e) => {
                            setTelefono(e.target.value)
                            setFieldErrors({ ...fieldErrors, telefono: false })
                          }}
                          className={`login-input ${fieldErrors.telefono ? "input-error" : ""}`}
                        />
                        <span className="login-icon">
                          <IonIcon icon={callOutline} />
                        </span>
                        {fieldErrors.telefono && <p className="login-error-text">El teléfono es requerido</p>}
                      </div>

                      {/* Email Input */}
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

                      {/* Password Input */}
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

                        {/* Password Strength Meter */}
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

                        {fieldErrors.password && <p className="login-error-text">La contraseña es requerida</p>}
                      </div>

                      {/* Confirm Password Input */}
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

                      {/* Terms Checkbox */}
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

                      {/* Submit Button */}
                      <Button type="submit" className="login-button" disabled={animating}>
                        Crear Cuenta
                      </Button>
                    </form>

                    {/* Switch to Login */}
                    <div className="login-switch-form">
                      ¿Ya tienes una cuenta?{" "}
                      <span className="login-link" onClick={toggleForm}>
                        Inicia sesión aquí
                      </span>
                    </div>

                    {/* Newsletter Text */}
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
