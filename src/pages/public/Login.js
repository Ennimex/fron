import { useState, useEffect, useMemo } from 'react';
import { Form, Button } from 'react-bootstrap';
import { IonIcon } from '@ionic/react';
import { eyeOffOutline, eyeOutline, mailOutline, callOutline } from 'ionicons/icons';
import { Link, useSearchParams } from 'react-router-dom';

const textStyles = {
  title: { fontFamily: "'Roboto', sans-serif", fontWeight: 'bold' },
  subtitle: { fontFamily: "'Roboto', sans-serif", fontWeight: 600 },
  paragraph: { fontFamily: "'Roboto', sans-serif", fontWeight: 400 },
  fontPrimary: "'Roboto', sans-serif",
};

const Login = () => {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(!searchParams.get('register'));
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [animating, setAnimating] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({
    nombre: false,
    apellido: false,
    telefono: false,
    email: false,
    password: false,
    confirmPassword: false,
    loginEmail: false,
    loginPassword: false,
    acceptTerms: false
  });

  const backgroundImages = useMemo(() => [
    'https://vidauniversitaria.uanl.mx/wp-content/uploads/2019/09/muestra-de-danza-folklorica-uanl-3.jpg',
    'https://vidauniversitaria.uanl.mx/wp-content/uploads/2019/09/muestra-de-danza-folklorica-uanl-2.jpg'
  ], []);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    setCurrentImageIndex(randomIndex);
    if (searchParams.get('register')) {
      setIsLogin(false);
    }
  }, [searchParams, backgroundImages]);

  useEffect(() => {
    if (animating) {
      const timer = setTimeout(() => setAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [animating]);

  const toggleForm = () => {
    setAnimating(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setError('');
      setSuccess('');
      setFieldErrors({
        nombre: false,
        apellido: false,
        telefono: false,
        email: false,
        password: false,
        confirmPassword: false,
        loginEmail: false,
        loginPassword: false,
        acceptTerms: false
      });
    }, 150);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const errors = {
      loginEmail: !loginEmail || !validateEmail(loginEmail),
      loginPassword: !loginPassword
    };
    setFieldErrors(errors);

    if (!errors.loginEmail && !errors.loginPassword) {
      setError('');
      setSuccess('¡Inicio de sesión exitoso!');
      setTimeout(() => {
        setSuccess('Redireccionando...');
      }, 1500);
    } else {
      setError('Por favor, completa todos los campos correctamente.');
      setSuccess('');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const errors = {
      nombre: !nombre,
      apellido: !apellido,
      telefono: !telefono,
      email: !email || !validateEmail(email),
      password: !password,
      confirmPassword: !confirmPassword || password !== confirmPassword,
      acceptTerms: !acceptTerms
    };
    setFieldErrors(errors);

    if (!Object.values(errors).some(Boolean)) {
      setError('');
      setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
      setTimeout(() => {
        setIsLogin(true);
        setSuccess('');
        setFieldErrors({
          nombre: false,
          apellido: false,
          telefono: false,
          email: false,
          password: false,
          confirmPassword: false,
          loginEmail: false,
          loginPassword: false,
          acceptTerms: false
        });
      }, 2000);
    } else {
      setError(
        errors.confirmPassword ? 'Las contraseñas no coinciden.' :
        errors.acceptTerms ? 'Debes aceptar los Términos de Servicio y la Política de Privacidad.' :
        'Por favor, completa todos los campos correctamente.'
      );
      setSuccess('');
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
    if (strength === 0) return '#A91B0D';
    if (strength === 1) return '#ff9800';
    if (strength === 2) return '#ffeb3b';
    if (strength === 3) return '#2E7D32';
    if (strength === 4) return '#1B5E20';
  };

  const getPasswordStrengthText = () => {
    const strength = passwordStrength(password);
    if (strength === 0) return 'Muy débil';
    if (strength === 1) return 'Débil';
    if (strength === 2) return 'Media';
    if (strength === 3) return 'Fuerte';
    if (strength === 4) return 'Muy fuerte';
  };

  const cssStyles = `
    :root {
      --huasteca-red: #A91B0D;
      --huasteca-green: #2E7D32;
      --huasteca-beige: #F5E8C7;
      --huasteca-yellow: #FFF8E1;
      --huasteca-dark: #4A4A4A;
    }

    .login-container {
      min-height: 100vh;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(to right, var(--huasteca-red), var(--huasteca-green));
      background-size: cover;
      background-position: center;
      background-blend-mode: overlay;
      padding: 20px;
      font-family: ${textStyles.fontPrimary};
    }

    .login-inner-container {
      display: flex;
      max-width: 1200px;
      width: 100%;
      position: relative;
    }

    .login-left-panel {
      flex: 1 1 45%;
      padding: 48px;
      color: var(--huasteca-beige);
      display: none;
    }

    @media (min-width: 768px) {
      .login-left-panel {
        display: block;
      }
    }

    .login-left-content {
      max-width: 500px;
      margin-left: auto;
      margin-right: 20px;
    }

    .login-welcome-title {
      font-size: 2.625rem;
      font-weight: bold;
      margin-bottom: 1.25rem;
      line-height: 1.2;
      font-family: ${textStyles.title.fontFamily};
    }

    .login-welcome-text {
      font-size: 1rem;
      margin-bottom: 1.875rem;
      line-height: 1.6;
      font-family: ${textStyles.paragraph.fontFamily};
    }

    .login-brand-feature {
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
    }

    .login-feature-icon {
      font-size: 1.375rem;
      margin-right: 0.9375rem;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(169, 27, 13, 0.3);
    }

    .login-feature-text {
      font-size: 1rem;
      font-family: ${textStyles.paragraph.fontFamily};
    }

    .login-right-panel {
      flex: 1 1 55%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }

    .login-form-wrapper {
      position: relative;
      width: 100%;
      max-width: 500px;
      background: rgba(255, 248, 225, 0.9);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
      padding: 40px;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .login-logo {
      text-align: center;
      margin-bottom: 30px;
    }

    .login-logo-text {
      font-size: 1.875rem;
      font-weight: bold;
      color: var(--huasteca-red);
      margin: 0;
      font-family: ${textStyles.title.fontFamily};
    }

    .login-logo-subtext {
      font-size: 0.875rem;
      color: var(--huasteca-dark);
      margin-top: 5px;
      font-family: ${textStyles.paragraph.fontFamily};
    }

    .login-title {
      font-size: 1.75rem;
      margin-bottom: 10px;
      text-align: center;
      color: var(--huasteca-red);
      font-weight: 600;
      font-family: ${textStyles.title.fontFamily};
    }

    .login-subtitle {
      font-size: 1rem;
      text-align: center;
      color: var(--huasteca-dark);
      margin-bottom: 30px;
      font-family: ${textStyles.subtitle.fontFamily};
    }

    .login-form-container {
      transition: opacity 0.3s ease;
    }

    .login-input-row {
      display: flex;
      gap: 15px;
      margin-bottom: 5px;
    }

    .login-input-box {
      position: relative;
      width: 100%;
      margin-bottom: 25px;
    }

    .login-label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      color: var(--huasteca-green);
      transition: all 0.3s ease;
      font-family: ${textStyles.subtitle.fontFamily};
    }

    .login-input {
      width: 100%;
      background: rgba(169, 27, 13, 0.1);
      border: 2px solid var(--huasteca-green);
      outline: none;
      color: var(--huasteca-red);
      padding: 15px 45px 15px 20px;  /* Aumentado el padding derecho de 40px a 45px */
      border-radius: 10px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .login-input:focus {
      background: rgba(169, 27, 13, 0.15);
      border-color: var(--huasteca-red);
      box-shadow: 0 0 0 2px rgba(169, 27, 13, 0.2);
    }

    .login-input::placeholder {
      color: rgba(169, 27, 13, 0.6);
    }

    .login-input.input-error {
      border-color: var(--huasteca-red);
      animation: pulse 0.5s ease-in-out infinite alternate;
    }

    .login-input.input-focus {
      animation: bounce 0.3s ease-in-out;
    }

    .login-label.label-float {
      transform: translateY(-24px);
      font-size: 14px;
      color: var(--huasteca-red);
      font-weight: 700;
      background-color: var(--huasteca-beige);
      padding: 0 6px;
    }

    .login-error-text {
      color: var(--huasteca-red);
      font-size: 0.875rem;
      margin-top: 0.25rem;
      font-weight: 600;
    }

    .login-icon {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-10%);
      font-size: 20px;
      color: var(--huasteca-red);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      pointer-events: none;
    }

    .login-toggle-password {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-10%);
      font-size: 20px;
      color: var(--huasteca-red);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      cursor: pointer;
      pointer-events: auto;
    }

    .login-password-strength {
      display: ${password ? 'block' : 'none'};
      width: 100%;
      height: 4px;
      background-color: rgba(169, 27, 13, 0.1);
      margin-top: 8px;
      border-radius: 2px;
      overflow: hidden;
    }

    .login-password-strength-bar {
      height: 100%;
      transition: width 0.3s ease, background-color 0.3s ease;
    }

    .login-password-strength-text {
      font-size: 12px;
      margin-top: 5px;
      text-align: right;
      transition: color 0.3s ease;
    }

    .login-checkbox-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .login-checkbox-label {
      display: flex;
      align-items: center;
      color: var(--huasteca-dark);
      font-size: 14px;
      cursor: pointer;
      font-family: ${textStyles.paragraph.fontFamily};
    }

    .login-checkbox {
      margin-right: 8px;
      cursor: pointer;
    }

    .login-forgot-password {
      color: var(--huasteca-red);
      font-size: 14px;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .login-forgot-password:hover {
      color: #7B0D05;
      text-decoration: underline;
    }

    .login-button {
      width: 100%;
      padding: 15px;
      background: linear-gradient(to right, var(--huasteca-red), var(--huasteca-green));
      border: none;
      outline: none;
      border-radius: 10px;
      cursor: pointer;
      font-size: 16px;
      color: var(--huasteca-beige);
      font-weight: 600;
      transition: all 0.3s ease;
      margin-top: 10px;
      box-shadow: 0 4px 15px rgba(169, 27, 13, 0.3);
      font-family: ${textStyles.fontPrimary};
    }

    .login-button:hover {
      background: var(--huasteca-green);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(169, 27, 13, 0.4);
    }

    .login-button:active {
      transform: translateY(1px);
    }

    .login-switch-form {
      text-align: center;
      margin-top: 25px;
      color: var(--huasteca-dark);
      font-size: 14px;
      font-family: ${textStyles.paragraph.fontFamily};
    }

    .login-link {
      color: var(--huasteca-red);
      text-decoration: none;
      cursor: pointer;
      font-weight: 600;
      transition: color 0.3s ease;
    }

    .login-link:hover {
      color: #7B0D05;
      text-decoration: underline;
    }

    .login-terms-text {
      font-size: 12px;
      color: var(--huasteca-dark);
      text-align: center;
      margin-top: 25px;
      font-family: ${textStyles.paragraph.fontFamily};
    }

    .login-highlight {
      color: var(--huasteca-red);
      text-decoration: underline;
      cursor: pointer;
    }

    .login-alert-success {
      background-color: rgba(46, 125, 50, 0.2);
      color: var(--huasteca-green);
      padding: 12px 15px;
      border-radius: 10px;
      border-left: 4px solid var(--huasteca-green);
      margin-bottom: 20px;
    }

    .login-alert-error {
      background-color: rgba(169, 27, 13, 0.2);
      color: var(--huasteca-red);
      padding: 12px 15px;
      border-radius: 10px;
      border-left: 4px solid var(--huasteca-red);
      margin-bottom: 20px;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }

    @keyframes pulse {
      from { box-shadow: 0 0 0 0 rgba(169, 27, 13, 0.3); }
      to { box-shadow: 0 0 0 6px rgba(169, 27, 13, 0.1); }
    }
  `;

  return (
    <>
      <style>{cssStyles}</style>
      <div className="login-container" style={{ backgroundImage: `url(${backgroundImages[currentImageIndex]})` }}>
        <div className="login-inner-container">
          <div className="login-left-panel">
            <div className="login-left-content">
              <div style={{ marginBottom: '60px' }}>
                <h1 className="login-welcome-title">Bienvenido a Danza Estelar</h1>
                <p className="login-welcome-text">
                  Únete a nuestra comunidad de danza huasteca. Inicia sesión o regístrate para reservar clases, alquilar trajes o personalizar coreografías.
                </p>
              </div>
              {[
                { icon: '💃', text: 'Clases de danza para todos los niveles' },
                { icon: '👗', text: 'Alquiler de vestuario exclusivo' },
                { icon: '🎭', text: 'Coreografías personalizadas' },
                { icon: '🏢', text: 'Reserva de estudios de danza' }
              ].map((feature, index) => (
                <div key={index} className="login-brand-feature">
                  <div className="login-feature-icon">{feature.icon}</div>
                  <div className="login-feature-text">{feature.text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="login-right-panel">
            <div
              className="login-form-wrapper"
              style={{ transform: animating ? 'scale(0.98)' : 'scale(1)', opacity: animating ? 0.8 : 1 }}
            >
              <div className="login-logo">
                <h1 className="login-logo-text">Danza Estelar</h1>
                <p className="login-logo-subtext">Estudio de Danza Huasteca</p>
              </div>

              <div className="login-form-container" style={{ opacity: animating ? 0 : 1 }}>
                {isLogin ? (
                  <>
                    <h2 className="login-title">Iniciar Sesión</h2>
                    <p className="login-subtitle">Accede a tu cuenta para continuar</p>
                    {error && <div className="login-alert-error">{error}</div>}
                    {success && <div className="login-alert-success">{success}</div>}
                    <Form onSubmit={handleLoginSubmit}>
                      <div className="login-input-box">
                        <label className={`login-label ${loginEmail ? 'label-float' : ''}`}>
                          Correo Electrónico*
                        </label>
                        <input
                          type="email"
                          placeholder="Correo Electrónico"
                          value={loginEmail}
                          onChange={(e) => { setLoginEmail(e.target.value); setFieldErrors({ ...fieldErrors, loginEmail: false }); }}
                          className={`login-input ${fieldErrors.loginEmail ? 'input-error' : ''} ${loginEmail ? 'input-focus' : ''}`}
                        />
                        <span className="login-icon"><IonIcon icon={mailOutline} /></span>
                        {fieldErrors.loginEmail && (
                          <p className="login-error-text">Por favor ingresa un correo válido</p>
                        )}
                      </div>
                      <div className="login-input-box">
                        <label className={`login-label ${loginPassword ? 'label-float' : ''}`}>
                          Contraseña*
                        </label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Contraseña"
                          value={loginPassword}
                          onChange={(e) => { setLoginPassword(e.target.value); setFieldErrors({ ...fieldErrors, loginPassword: false }); }}
                          className={`login-input ${fieldErrors.loginPassword ? 'input-error' : ''} ${loginPassword ? 'input-focus' : ''}`}
                        />
                        <span className="login-toggle-password" onClick={togglePasswordVisibility}>
                          <IonIcon icon={showPassword ? eyeOutline : eyeOffOutline} />
                        </span>
                        {fieldErrors.loginPassword && (
                          <p className="login-error-text">La contraseña es requerida</p>
                        )}
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
                      <Button type="submit" className="login-button">
                        Iniciar Sesión
                      </Button>
                    </Form>
                    <div className="login-switch-form">
                      ¿No tienes una cuenta?{' '}
                      <span className="login-link" onClick={toggleForm}>
                        Regístrate aquí
                      </span>
                    </div>
                    <div className="login-terms-text">
                      Al iniciar sesión, aceptas nuestras{' '}
                      <Link to="/politicas#cliente" className="login-highlight">Políticas de Cliente</Link>{' '}
                      y{' '}
                      <Link to="/politicas#privacidad" className="login-highlight">Políticas de Privacidad</Link>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="login-title">Crear Cuenta</h2>
                    <p className="login-subtitle">Únete a nuestra comunidad de danza</p>
                    {error && <div className="login-alert-error">{error}</div>}
                    {success && <div className="login-alert-success">{success}</div>}
                    <Form onSubmit={handleRegisterSubmit}>
                      <div className="login-input-row">
                        <div className="login-input-box">
                          <label className={`login-label ${nombre ? 'label-float' : ''}`}>
                            Nombre*
                          </label>
                          <input
                            type="text"
                            placeholder="Nombre"
                            value={nombre}
                            onChange={(e) => { setNombre(e.target.value); setFieldErrors({ ...fieldErrors, nombre: false }); }}
                            className={`login-input ${fieldErrors.nombre ? 'input-error' : ''} ${nombre ? 'input-focus' : ''}`}
                          />
                          {fieldErrors.nombre && (
                            <p className="login-error-text">El nombre es requerido</p>
                          )}
                        </div>
                        <div className="login-input-box">
                          <label className={`login-label ${apellido ? 'label-float' : ''}`}>
                            Apellido*
                          </label>
                          <input
                            type="text"
                            placeholder="Apellido"
                            value={apellido}
                            onChange={(e) => { setApellido(e.target.value); setFieldErrors({ ...fieldErrors, apellido: false }); }}
                            className={`login-input ${fieldErrors.apellido ? 'input-error' : ''} ${apellido ? 'input-focus' : ''}`}
                          />
                          {fieldErrors.apellido && (
                            <p className="login-error-text">El apellido es requerido</p>
                          )}
                        </div>
                      </div>
                      <div className="login-input-box">
                        <label className={`login-label ${telefono ? 'label-float' : ''}`}>
                          Teléfono*
                        </label>
                        <input
                          type="tel"
                          placeholder="Teléfono"
                          value={telefono}
                          onChange={(e) => { setTelefono(e.target.value); setFieldErrors({ ...fieldErrors, telefono: false }); }}
                          className={`login-input ${fieldErrors.telefono ? 'input-error' : ''} ${telefono ? 'input-focus' : ''}`}
                        />
                        <span className="login-icon"><IonIcon icon={callOutline} /></span>
                        {fieldErrors.telefono && (
                          <p className="login-error-text">El teléfono es requerido</p>
                        )}
                      </div>
                      <div className="login-input-box">
                        <label className={`login-label ${email ? 'label-float' : ''}`}>
                          Correo Electrónico*
                        </label>
                        <input
                          type="email"
                          placeholder="Correo Electrónico"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); setFieldErrors({ ...fieldErrors, email: false }); }}
                          className={`login-input ${fieldErrors.email ? 'input-error' : ''} ${email ? 'input-focus' : ''}`}
                        />
                        <span className="login-icon"><IonIcon icon={mailOutline} /></span>
                        {fieldErrors.email && (
                          <p className="login-error-text">Por favor ingresa un correo válido</p>
                        )}
                      </div>
                      <div className="login-input-box">
                        <label className={`login-label ${password ? 'label-float' : ''}`}>
                          Contraseña*
                        </label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Contraseña"
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); setFieldErrors({ ...fieldErrors, password: false }); }}
                          className={`login-input ${fieldErrors.password ? 'input-error' : ''} ${password ? 'input-focus' : ''}`}
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
                                  backgroundColor: getPasswordStrengthColor()
                                }}
                              ></div>
                            </div>
                            <div
                              className="login-password-strength-text"
                              style={{ color: getPasswordStrengthColor() }}
                            >
                              {getPasswordStrengthText()}
                            </div>
                          </>
                        )}
                        {fieldErrors.password && (
                          <p className="login-error-text">La contraseña es requerida</p>
                        )}
                      </div>
                      <div className="login-input-box">
                        <label className={`login-label ${confirmPassword ? 'label-float' : ''}`}>
                          Confirmar Contraseña*
                        </label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Confirmar Contraseña"
                          value={confirmPassword}
                          onChange={(e) => { setConfirmPassword(e.target.value); setFieldErrors({ ...fieldErrors, confirmPassword: false }); }}
                          className={`login-input ${fieldErrors.confirmPassword ? 'input-error' : ''} ${confirmPassword ? 'input-focus' : ''}`}
                        />
                        <span className="login-toggle-password" onClick={togglePasswordVisibility}>
                          <IonIcon icon={showPassword ? eyeOutline : eyeOffOutline} />
                        </span>
                        {fieldErrors.confirmPassword && (
                          <p className="login-error-text">Las contraseñas no coinciden</p>
                        )}
                      </div>
                      <div style={{ marginBottom: '20px' }}>
                        <label className="login-checkbox-label">
                          <input
                            type="checkbox"
                            className="login-checkbox"
                            checked={acceptTerms}
                            onChange={() => { setAcceptTerms(!acceptTerms); setFieldErrors({ ...fieldErrors, acceptTerms: false }); }}
                          />
                          Acepto las <Link to="/politicas#cliente" className="login-highlight">Políticas de Cliente</Link> y las <Link to="/politicas#privacidad" className="login-highlight">Políticas de Privacidad</Link>
                        </label>
                        {fieldErrors.acceptTerms && (
                          <p className="login-error-text">Debes aceptar los términos</p>
                        )}
                      </div>
                      <Button type="submit" className="login-button">
                        Crear Cuenta
                      </Button>
                    </Form>
                    <div className="login-switch-form">
                      ¿Ya tienes una cuenta?{' '}
                      <span className="login-link" onClick={toggleForm}>
                        Inicia sesión aquí
                      </span>
                    </div>
                    <div className="login-terms-text">
                      Al registrarte, aceptas recibir correos electrónicos de nuestro estudio de danza. Puedes darte de baja en cualquier momento.
                    </div>
                  </>
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