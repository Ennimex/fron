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
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

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
    return /^\+?\d{10,15}$/.test(phone.replace(/\s/g, ""))
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
      password: !password || password.length < 8,
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
    if (strength === 0) return stylesPublic.colors.semantic.error.main
    if (strength === 1) return stylesPublic.colors.semantic.warning.main
    if (strength === 2) return stylesPublic.colors.semantic.warning.light
    if (strength === 3) return stylesPublic.colors.secondary[500]
    if (strength === 4) return stylesPublic.colors.secondary[700]
  }

  const getPasswordStrengthText = () => {
    const strength = passwordStrength(password)
    if (strength === 0) return "Muy débil"
    if (strength === 1) return "Débil"
    if (strength === 2) return "Media"
    if (strength === 3) return "Fuerte"
    if (strength === 4) return "Muy fuerte"
  }

  // CSS usando exclusivamente tokens del sistema refactorizado
  const cssStyles = `
    .login-container {
      min-height: 100vh;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(${stylesPublic.colors.surface.overlay}, ${stylesPublic.colors.surface.overlay}), 
                  url(${backgroundImages[currentImageIndex]});
      background-size: cover;
      background-position: center;
      background-blend-mode: overlay;
      padding: ${stylesPublic.spacing.scale[4]};
      font-family: ${stylesPublic.typography.families.body};
      overflow-x: hidden;
    }

    .login-inner-container {
      display: flex;
      max-width: ${stylesPublic.utils.container.maxWidth.xl};
      width: 100%;
      position: relative;
      min-height: min-content;
      margin: auto;
      box-sizing: border-box;
    }

    .login-left-panel {
      flex: 1 1 45%;
      padding: ${stylesPublic.spacing.scale[10]};
      color: ${stylesPublic.colors.surface.primary};
      display: none;
    }

    @media (min-width: ${stylesPublic.breakpoints.lg}) {
      .login-left-panel {
        display: block;
      }
    }

    .login-right-panel {
      flex: 1 1 55%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: ${stylesPublic.spacing.scale[4]};
      min-width: 0;
    }

    .login-form-wrapper {
      position: relative;
      width: 100%;
      max-width: 450px;
      background: ${stylesPublic.colors.surface.glass};
      backdrop-filter: blur(${stylesPublic.spacing.scale[3]});
      border-radius: ${stylesPublic.borders.radius.xl};
      box-shadow: ${stylesPublic.shadows.xl};
      overflow: hidden;
      border: ${stylesPublic.borders.width[1]}px solid ${stylesPublic.borders.colors.default};
      transition: ${stylesPublic.animations.transitions.base};
      margin: ${stylesPublic.spacing.scale[4]} auto;
    }

    .login-form-slider {
      display: flex;
      width: 200%;
      transition: transform ${stylesPublic.animations.duration.slowest} ${stylesPublic.animations.easing['ease-in-out']};
      transform: ${isLogin ? "translateX(0)" : "translateX(-50%)"};
    }

    .login-form-panel {
      width: 50%;
      padding: ${isLogin ? stylesPublic.spacing.scale[8] : stylesPublic.spacing.scale[6]};
      transition: all ${stylesPublic.animations.duration.slow} ease;
      opacity: ${animating ? 0.7 : 1};
      max-height: calc(100vh - ${stylesPublic.spacing.scale[10]});
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }

    .login-form-panel::-webkit-scrollbar {
      width: ${stylesPublic.spacing.scale[2]};
    }

    .login-form-panel::-webkit-scrollbar-thumb {
      background-color: ${stylesPublic.colors.primary[500]};
      border-radius: ${stylesPublic.borders.radius.sm};
    }

    .login-form-panel::-webkit-scrollbar-track {
      background: transparent;
    }

    .login-logo {
      text-align: center;
      margin-bottom: ${isLogin ? stylesPublic.spacing.scale[6] : stylesPublic.spacing.scale[4]};
    }

    .login-logo-text {
      font-size: ${stylesPublic.typography.scale['3xl']};
      font-weight: ${stylesPublic.typography.weights.bold};
      color: ${stylesPublic.colors.primary[500]};
      margin: 0;
      font-family: ${stylesPublic.typography.families.display};
    }

    .login-logo-subtext {
      font-size: ${stylesPublic.typography.scale.sm};
      color: ${stylesPublic.colors.text.secondary};
      margin-top: ${stylesPublic.spacing.scale[1]};
      font-style: italic;
    }

    .login-title {
      font-size: ${isLogin ? stylesPublic.typography.scale['2xl'] : stylesPublic.typography.scale.xl};
      margin-bottom: ${isLogin ? stylesPublic.spacing.scale[2] : stylesPublic.spacing.scale[1]};
      text-align: center;
      color: ${stylesPublic.colors.primary[500]};
      font-weight: ${stylesPublic.typography.weights.semibold};
      font-family: ${stylesPublic.typography.families.display};
    }

    .login-subtitle {
      font-size: ${isLogin ? stylesPublic.typography.scale.sm : stylesPublic.typography.scale.xs};
      text-align: center;
      color: ${stylesPublic.colors.text.secondary};
      margin-bottom: ${isLogin ? stylesPublic.spacing.scale[6] : stylesPublic.spacing.scale[5]};
    }

    .login-input-box {
      position: relative;
      width: 100%;
      margin-bottom: ${isLogin ? stylesPublic.spacing.scale[5] : stylesPublic.spacing.scale[3]};
    }

    .login-label {
      display: block;
      margin-bottom: ${isLogin ? stylesPublic.spacing.scale[2] : stylesPublic.spacing.scale[1]};
      font-size: ${isLogin ? stylesPublic.typography.scale.sm : stylesPublic.typography.scale.xs};
      font-weight: ${stylesPublic.typography.weights.semibold};
      color: ${stylesPublic.colors.secondary[500]};
    }

    .login-input {
      width: 100%;
      background: ${stylesPublic.colors.surface.secondary};
      border: ${stylesPublic.borders.width[2]}px solid ${stylesPublic.colors.secondary[500]};
      outline: none;
      color: ${stylesPublic.colors.text.primary};
      padding: ${isLogin ? `${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[12]} ${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[4]}` : `${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[10]} ${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[3]}`};
      border-radius: ${stylesPublic.borders.radius.md};
      font-size: ${isLogin ? stylesPublic.typography.scale.base : stylesPublic.typography.scale.sm};
      transition: ${stylesPublic.animations.transitions.base};
      font-family: ${stylesPublic.typography.families.body};
    }

    .login-input:focus {
      background: ${stylesPublic.colors.surface.elevated};
      border-color: ${stylesPublic.colors.primary[500]};
      box-shadow: 0 0 0 ${stylesPublic.spacing.scale[1]} ${stylesPublic.colors.primary[500]}20;
    }

    .login-input::placeholder {
      color: ${stylesPublic.colors.text.disabled};
      font-size: ${isLogin ? stylesPublic.typography.scale.sm : stylesPublic.typography.scale.xs};
    }

    .login-input.input-error {
      border-color: ${stylesPublic.colors.semantic.error.main};
      animation: pulse ${stylesPublic.animations.duration.base} ease-in-out infinite alternate;
    }

    .login-error-text {
      color: ${stylesPublic.colors.semantic.error.main};
      font-size: ${isLogin ? stylesPublic.typography.scale.xs : stylesPublic.typography.scale.xs};
      margin-top: ${isLogin ? stylesPublic.spacing.scale[1] : stylesPublic.spacing.scale[1]};
      font-weight: ${stylesPublic.typography.weights.semibold};
    }

    .login-icon {
      position: absolute;
      right: ${isLogin ? stylesPublic.spacing.scale[4] : stylesPublic.spacing.scale[3]};
      top: 50%;
      transform: translateY(-50%);
      font-size: ${isLogin ? stylesPublic.typography.scale.lg : stylesPublic.typography.scale.base};
      color: ${stylesPublic.colors.primary[500]};
      display: flex;
      align-items: center;
      justify-content: center;
      width: ${isLogin ? stylesPublic.spacing.scale[6] : stylesPublic.spacing.scale[6]};
      height: ${isLogin ? stylesPublic.spacing.scale[6] : stylesPublic.spacing.scale[6]};
      pointer-events: none;
    }

    .login-toggle-password {
      position: absolute;
      right: ${isLogin ? stylesPublic.spacing.scale[4] : stylesPublic.spacing.scale[3]};
      top: 50%;
      transform: translateY(-50%);
      font-size: ${isLogin ? stylesPublic.typography.scale.lg : stylesPublic.typography.scale.base};
      color: ${stylesPublic.colors.primary[500]};
      display: flex;
      align-items: center;
      justify-content: center;
      width: ${isLogin ? stylesPublic.spacing.scale[6] : stylesPublic.spacing.scale[6]};
      height: ${isLogin ? stylesPublic.spacing.scale[6] : stylesPublic.spacing.scale[6]};
      cursor: pointer;
      pointer-events: auto;
      transition: ${stylesPublic.animations.transitions.colors};
    }

    .login-toggle-password:hover {
      color: ${stylesPublic.colors.primary[700]};
    }

    .login-password-strength {
      display: ${password ? "block" : "none"};
      width: 100%;
      height: ${stylesPublic.spacing.scale[1]};
      background-color: ${stylesPublic.colors.neutral[200]};
      margin-top: ${stylesPublic.spacing.scale[2]};
      border-radius: ${stylesPublic.borders.radius.sm};
      overflow: hidden;
    }

    .login-password-strength-bar {
      height: 100%;
      transition: width ${stylesPublic.animations.duration.slow} ease, background-color ${stylesPublic.animations.duration.slow} ease;
    }

    .login-password-strength-text {
      font-size: ${isLogin ? stylesPublic.typography.scale.xs : stylesPublic.typography.scale.xs};
      margin-top: ${stylesPublic.spacing.scale[1]};
      text-align: right;
      transition: color ${stylesPublic.animations.duration.slow} ease;
    }

    .login-checkbox-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: ${isLogin ? stylesPublic.spacing.scale[5] : stylesPublic.spacing.scale[4]};
      flex-wrap: wrap;
      gap: ${stylesPublic.spacing.scale[3]};
    }

    .login-checkbox-label {
      display: flex;
      align-items: center;
      color: ${stylesPublic.colors.text.primary};
      font-size: ${isLogin ? stylesPublic.typography.scale.xs : stylesPublic.typography.scale.xs};
      cursor: pointer;
    }

    .login-checkbox {
      margin-right: ${stylesPublic.spacing.scale[2]};
      cursor: pointer;
      accent-color: ${stylesPublic.colors.primary[500]};
    }

    .login-forgot-password {
      color: ${stylesPublic.colors.primary[500]};
      font-size: ${isLogin ? stylesPublic.typography.scale.xs : stylesPublic.typography.scale.xs};
      text-decoration: none;
      transition: ${stylesPublic.animations.transitions.colors};
    }

    .login-forgot-password:hover {
      color: ${stylesPublic.colors.text.primary};
      text-decoration: underline;
    }

    .login-button {
      width: 100%;
      padding: ${isLogin ? `${stylesPublic.spacing.scale[4]}` : `${stylesPublic.spacing.scale[3]}`};
      background: ${stylesPublic.colors.gradients.accent};
      border: none;
      outline: none;
      border-radius: ${stylesPublic.borders.radius.full};
      cursor: pointer;
      font-size: ${isLogin ? stylesPublic.typography.scale.lg : stylesPublic.typography.scale.base};
      color: ${stylesPublic.colors.text.inverse};
      font-weight: ${stylesPublic.typography.weights.semibold};
      transition: ${stylesPublic.animations.transitions.base};
      margin-top: ${isLogin ? stylesPublic.spacing.scale[2] : stylesPublic.spacing.scale[1]};
      box-shadow: ${stylesPublic.shadows.brand.primary};
      position: relative;
      overflow: hidden;
      font-family: ${stylesPublic.typography.families.body};
    }

    .login-button:hover {
      transform: translateY(-${stylesPublic.spacing.scale[1]});
      box-shadow: ${stylesPublic.shadows.brand.glow};
    }

    .login-button:active {
      transform: translateY(${stylesPublic.spacing.scale[0]});
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
        ${stylesPublic.colors.surface.overlay}20,
        transparent
      );
      transition: all ${stylesPublic.animations.duration.base} ease;
    }

    .login-button:hover::after {
      left: 100%;
    }

    .login-switch-form {
      text-align: center;
      margin-top: ${isLogin ? stylesPublic.spacing.scale[5] : stylesPublic.spacing.scale[4]};
      color: ${stylesPublic.colors.text.primary};
      font-size: ${isLogin ? stylesPublic.typography.scale.xs : stylesPublic.typography.scale.xs};
    }

    .login-link {
      color: ${stylesPublic.colors.primary[500]};
      text-decoration: none;
      cursor: pointer;
      font-weight: ${stylesPublic.typography.weights.semibold};
      transition: ${stylesPublic.animations.transitions.colors};
    }

    .login-link:hover {
      color: ${stylesPublic.colors.text.primary};
      text-decoration: underline;
    }

    .login-terms-text {
      font-size: ${isLogin ? stylesPublic.typography.scale.xs : stylesPublic.typography.scale.xs};
      color: ${stylesPublic.colors.text.secondary};
      text-align: center;
      margin-top: ${isLogin ? stylesPublic.spacing.scale[4] : stylesPublic.spacing.scale[3]};
      line-height: ${stylesPublic.typography.leading.normal};
    }

    .login-highlight {
      color: ${stylesPublic.colors.primary[500]};
      text-decoration: underline;
      cursor: pointer;
      font-weight: ${stylesPublic.typography.weights.semibold};
    }

    .login-alert-success {
      background-color: ${stylesPublic.colors.semantic.success.light};
      color: ${stylesPublic.colors.semantic.success.main};
      padding: ${isLogin ? `${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[4]}` : `${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[3]}`};
      border-radius: ${stylesPublic.borders.radius.md};
      border-left: ${stylesPublic.borders.width[4]}px solid ${stylesPublic.colors.secondary[500]};
      margin-bottom: ${isLogin ? stylesPublic.spacing.scale[4] : stylesPublic.spacing.scale[3]};
      font-size: ${isLogin ? stylesPublic.typography.scale.sm : stylesPublic.typography.scale.xs};
    }

    .login-alert-error {
      background-color: ${stylesPublic.colors.semantic.error.light};
      color: ${stylesPublic.colors.semantic.error.main};
      padding: ${isLogin ? `${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[4]}` : `${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[3]}`};
      border-radius: ${stylesPublic.borders.radius.md};
      border-left: ${stylesPublic.borders.width[4]}px solid ${stylesPublic.colors.primary[500]};
      margin-bottom: ${isLogin ? stylesPublic.spacing.scale[4] : stylesPublic.spacing.scale[3]};
      font-size: ${isLogin ? stylesPublic.typography.scale.sm : stylesPublic.typography.scale.xs};
    }

    /* Responsive Design */
    @media (max-width: ${stylesPublic.breakpoints['2xl']}) {
      .login-inner-container {
        max-width: ${stylesPublic.utils.container.maxWidth.xl};
      }
      
      .login-left-content {
        padding-right: ${stylesPublic.spacing.scale[4]};
      }
      
      .login-welcome-title {
        font-size: ${stylesPublic.typography.scale['2xl']};
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.lg}) {
      .login-container {
        padding: ${stylesPublic.spacing.scale[3]};
        min-height: 100vh;
        align-items: flex-start;
      }
      .login-inner-container {
        flex-direction: column;
        max-width: 100vw;
        min-height: unset;
        margin: 0;
      }
      .login-left-panel {
        display: none !important;
        padding: 0;
      }
      .login-right-panel {
        flex: 1 1 100%;
        padding: 0;
        min-width: 0;
        width: 100vw;
        justify-content: center;
        align-items: flex-start;
      }
      .login-form-wrapper {
        max-width: 100vw;
        margin: 0 auto;
        border-radius: 0;
        box-shadow: none;
        min-height: 100vh;
        padding: 0;
      }
      .login-form-panel {
        padding: ${stylesPublic.spacing.scale[5]} ${stylesPublic.spacing.scale[3]};
        min-height: 100vh;
        max-height: none;
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.sm}) {
      .login-container {
        padding: 0;
        min-height: 100vh;
      }
      .login-form-wrapper {
        margin: 0;
        border-radius: 0;
        box-shadow: none;
        min-height: 100vh;
        padding: 0;
      }
      .login-form-panel {
        padding: ${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[1]};
        min-height: 100vh;
        max-height: none;
      }
      .login-title {
        font-size: ${stylesPublic.typography.scale.lg};
      }
      .login-input {
        font-size: ${stylesPublic.typography.scale.sm};
        padding: ${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[9]} ${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[3]};
      }
      .login-button {
        font-size: ${stylesPublic.typography.scale.base};
        padding: ${stylesPublic.spacing.scale[3]};
      }
      .login-checkbox-label {
        font-size: ${stylesPublic.typography.scale.xs};
      }
      .login-terms-text {
        font-size: ${stylesPublic.typography.scale.xs};
      }
    }

    @keyframes pulse {
      from { box-shadow: 0 0 0 0 ${stylesPublic.colors.primary[500]}30; }
      to { box-shadow: 0 0 0 ${stylesPublic.spacing.scale[2]} ${stylesPublic.colors.primary[500]}10; }
    }

    .floating-element {
      position: fixed;
      width: ${stylesPublic.spacing.scale[1]};
      height: ${stylesPublic.spacing.scale[1]};
      border-radius: ${stylesPublic.borders.radius.full};
      opacity: 0.7;
      animation: float 8s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }
      50% { transform: translateY(-${stylesPublic.spacing.scale[5]}) scale(1.2); opacity: 0.8; }
    }
  `

  return (
    <>
      <style>{cssStyles}</style>

      {/* Elementos flotantes decorativos */}
      <div style={{ 
        position: "fixed", 
        top: 0, 
        left: 0, 
        width: "100%", 
        height: "100%", 
        pointerEvents: "none", 
        zIndex: stylesPublic.utils.zIndex.hide 
      }}>
        <div className="floating-element" style={{ 
          top: "20%", 
          left: "10%", 
          background: stylesPublic.colors.primary[500] 
        }}></div>
        <div className="floating-element" style={{ 
          top: "60%", 
          right: "15%", 
          background: stylesPublic.colors.secondary[500], 
          animationDelay: "2s" 
        }}></div>
        <div className="floating-element" style={{ 
          bottom: "30%", 
          left: "20%", 
          background: stylesPublic.colors.primary[300], 
          animationDelay: "4s" 
        }}></div>
      </div>

      <div className="login-container">
        <div className="login-inner-container">
          {/* Panel izquierdo - Información de la marca */}
          <div className="login-left-panel">
            <div className="login-left-content">
              <div style={{ marginBottom: stylesPublic.spacing.scale[12] }}>
                <h1 style={{ 
                  ...stylesPublic.typography.headings.h2,
                  color: stylesPublic.colors.surface.primary,
                  marginBottom: stylesPublic.spacing.scale[4]
                }}>
                  Bienvenido a La Aterciopelada
                </h1>
                <p style={{ 
                  ...stylesPublic.typography.body.base,
                  color: stylesPublic.colors.surface.primary,
                  opacity: 0.9
                }}>
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
                <div key={index} style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  marginBottom: stylesPublic.spacing.scale[4],
                  padding: stylesPublic.spacing.scale[3],
                  background: stylesPublic.colors.surface.overlay,
                  borderRadius: stylesPublic.borders.radius.md
                }}>
                  <div style={{ 
                    fontSize: stylesPublic.typography.scale.xl, 
                    marginRight: stylesPublic.spacing.scale[3] 
                  }}>
                    {feature.icon}
                  </div>
                  <div style={{ 
                    ...stylesPublic.typography.body.base,
                    color: stylesPublic.colors.surface.primary 
                  }}>
                    {feature.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Panel derecho - Formularios */}
          <div className="login-right-panel">
            <div className="login-form-wrapper">
              <div className="login-form-slider">
                {/* Formulario de Login */}
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
                        <label className="login-label">Correo Electrónico*</label>
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
                        <label className="login-label">Contraseña*</label>
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

                {/* Formulario de Registro */}
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
                        <label className="login-label">Nombre Completo*</label>
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
                        <label className="login-label">Teléfono*</label>
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
                        <label className="login-label">Correo Electrónico*</label>
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
                        <label className="login-label">Contraseña*</label>
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
                        <label className="login-label">Confirmar Contraseña*</label>
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

                      <div style={{ marginBottom: stylesPublic.spacing.scale[4] }}>
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