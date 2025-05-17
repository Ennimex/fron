import { useState, useEffect, useMemo } from 'react';
import { Form, Button } from 'react-bootstrap';
import { IonIcon } from '@ionic/react';
import { eyeOffOutline, eyeOutline, mailOutline, lockClosedOutline, callOutline } from 'ionicons/icons';
import { Link, useSearchParams } from 'react-router-dom';
import { colors } from '../../styles/styles';

const Login = () => {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(!searchParams.get('register'));
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [animating, setAnimating] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Estados para el formulario de registro
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Estados para el formulario de login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Mover backgroundImages dentro del componente y usar useMemo para memoizarlo
  const backgroundImages = useMemo(() => [
    'https://vidauniversitaria.uanl.mx/wp-content/uploads/2019/09/muestra-de-danza-folklorica-uanl-3.jpg',
    'https://vidauniversitaria.uanl.mx/wp-content/uploads/2019/09/muestra-de-danza-folklorica-uanl-2.jpg'
  ], []); // Array vacío porque las URLs son constantes

  // Cambiar imagen de fondo al cargar la página
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    setCurrentImageIndex(randomIndex);
    
    // Mostrar el formulario de registro si viene el parámetro register=true
    if (searchParams.get('register')) {
      setIsLogin(false);
    }
  }, [searchParams, backgroundImages.length]); // Agregar backgroundImages.length como dependencia

  // Manejo de animación al cambiar entre login y registro
  useEffect(() => {
    if (animating) {
      const timer = setTimeout(() => {
        setAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [animating]);

  const toggleForm = () => {
    setAnimating(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setError('');
      setSuccess('');
    }, 150);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setError('Por favor, completa todos los campos.');
      setSuccess('');
    } else {
      // Simulación de respuesta exitosa para login
      setError('');
      setSuccess('¡Inicio de sesión exitoso!');
      setTimeout(() => {
        setSuccess('Redireccionando...');
      }, 1500);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !apellido || !telefono || !email || !password || !confirmPassword) {
      setError('Por favor, completa todos los campos.');
      setSuccess('');
    } else if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setSuccess('');
    } else if (!acceptTerms) {
      setError('Debes aceptar los Términos de Servicio y la Política de Privacidad.');
      setSuccess('');
    } else {
      // Simulación de respuesta exitosa para registro
      setError('');
      setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
      setTimeout(() => {
        setIsLogin(true);
        setSuccess('');
      }, 2000);
    }
  };

  // Verificación de fortaleza de contraseña
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
    if (strength === 0) return '#f44336';
    if (strength === 1) return '#ff9800';
    if (strength === 2) return '#ffeb3b';
    if (strength === 3) return '#8bc34a';
    if (strength === 4) return '#4caf50';
  };

  const getPasswordStrengthText = () => {
    const strength = passwordStrength(password);
    if (strength === 0) return 'Muy débil';
    if (strength === 1) return 'Débil';
    if (strength === 2) return 'Media';
    if (strength === 3) return 'Fuerte';
    if (strength === 4) return 'Muy fuerte';
  };

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: `linear-gradient(135deg, rgba(232, 30, 99, 0.95) 0%, rgba(173, 20, 87, 0.95) 100%)`,
      backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundBlendMode: 'overlay',
      padding: '20px',
      transition: 'background-image 1s ease-in-out',
    },
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      maxWidth: '1200px',
      position: 'relative',
      zIndex: 1,
    },
    leftPanel: {
      flex: '1 1 45%',
      padding: '50px',
      color: colors.warmWhite,
      display: { xs: 'none', md: 'block' },
    },
    leftContent: {
      maxWidth: '500px',
      marginLeft: 'auto',
      marginRight: '20px',
    },
    rightPanel: {
      flex: '1 1 55%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
    },
    formWrapper: {
      position: 'relative',
      width: '100%',
      maxWidth: '500px',
      background: 'rgba(255, 245, 247, 0.85)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)',
      padding: '40px',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      transform: animating ? 'scale(0.98)' : 'scale(1)',
      opacity: animating ? 0.8 : 1,
    },
    logo: {
      textAlign: 'center',
      marginBottom: '30px',
    },
    logoText: {
      fontSize: '30px',
      fontWeight: 'bold',
      color: colors.pinkBerry,
      margin: 0,
    },
    logoSubtext: {
      fontSize: '14px',
      color: colors.darkGrey,
      marginTop: '5px',
    },
    title: {
      fontSize: '28px',
      marginBottom: '10px',
      textAlign: 'center',
      color: colors.pinkBerry,
      fontWeight: '600',
    },
    subtitle: {
      fontSize: '16px',
      textAlign: 'center',
      color: colors.darkGrey,
      marginBottom: '30px',
    },
    formContainer: {
      opacity: animating ? 0 : 1,
      transition: 'opacity 0.3s ease',
    },
    inputRow: {
      display: 'flex',
      gap: '15px',
      marginBottom: '5px',
    },
    inputBox: {
      position: 'relative',
      width: '100%',
      marginBottom: '25px',
    },
    input: {
      width: '100%',
      background: 'rgba(232, 30, 99, 0.1)',
      border: 'none',
      outline: 'none',
      color: colors.pinkBerry,
      padding: '15px 20px',
      paddingRight: '40px',
      borderRadius: '10px',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      '&:focus': {
        background: 'rgba(232, 30, 99, 0.15)',
        boxShadow: `0 0 0 2px ${colors.pinkLight}`,
      },
      '&::placeholder': {
        color: 'rgba(232, 30, 99, 0.6)',
      },
    },
    icon: {
      position: 'absolute',
      right: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '20px',
      color: colors.pinkBerry,
    },
    togglePassword: {
      position: 'absolute',
      right: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '20px',
      color: colors.pinkBerry,
      cursor: 'pointer',
      zIndex: 2,
      transition: 'color 0.3s ease',
      '&:hover': {
        color: colors.pinkDeep,
      },
    },
    passwordStrength: {
      display: password ? 'block' : 'none',
      width: '100%',
      height: '4px',
      backgroundColor: 'rgba(232, 30, 99, 0.1)',
      marginTop: '8px',
      borderRadius: '2px',
      overflow: 'hidden',
    },
    passwordStrengthBar: {
      height: '100%',
      width: `${(passwordStrength(password) / 4) * 100}%`,
      backgroundColor: getPasswordStrengthColor(),
      transition: 'width 0.3s ease, background-color 0.3s ease',
    },
    passwordStrengthText: {
      fontSize: '12px',
      color: getPasswordStrengthColor(),
      marginTop: '5px',
      textAlign: 'right',
      transition: 'color 0.3s ease',
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      color: colors.darkGrey,
      fontSize: '14px',
      cursor: 'pointer',
    },
    checkbox: {
      marginRight: '8px',
      cursor: 'pointer',
    },
    forgotPassword: {
      color: colors.pinkBerry,
      fontSize: '14px',
      textDecoration: 'none',
      transition: 'color 0.3s ease',
      '&:hover': {
        color: colors.pinkDeep,
        textDecoration: 'underline',
      },
    },
    button: {
      width: '100%',
      padding: '15px',
      background: colors.pinkBerry,
      border: 'none',
      outline: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '16px',
      color: colors.warmWhite,
      fontWeight: '600',
      transition: 'all 0.3s ease',
      marginTop: '10px',
      boxShadow: `0 4px 15px ${colors.pinkLight}`,
      '&:hover': {
        background: colors.pinkDeep,
        transform: 'translateY(-2px)',
        boxShadow: `0 6px 20px ${colors.pinkLight}`,
      },
      '&:active': {
        transform: 'translateY(1px)',
      },
    },
    switchForm: {
      textAlign: 'center',
      marginTop: '25px',
      color: colors.darkGrey,
      fontSize: '14px',
    },
    link: {
      color: colors.pinkBerry,
      textDecoration: 'none',
      cursor: 'pointer',
      transition: 'color 0.3s ease',
      fontWeight: '600',
      '&:hover': {
        color: colors.pinkDeep,
        textDecoration: 'underline',
      },
    },
    termsText: {
      fontSize: '12px',
      color: colors.darkGrey,
      textAlign: 'center',
      marginTop: '25px',
    },
    highlight: {
      color: colors.pinkBerry,
      textDecoration: 'underline',
      cursor: 'pointer',
    },
    brandFeature: {
      marginBottom: '25px',
      display: 'flex',
      alignItems: 'center',
    },
    featureIcon: {
      fontSize: '22px',
      marginRight: '15px',
      color: colors.pinkBerry,
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.pinkLight,
    },
    featureText: {
      color: colors.warmWhite,
      fontSize: '16px',
    },
    welcomeTitle: {
      fontSize: '42px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: colors.warmWhite,
      lineHeight: 1.2,
    },
    welcomeText: {
      fontSize: '16px',
      color: colors.warmWhite,
      marginBottom: '30px',
      lineHeight: 1.6,
    },
    alertContainer: {
      marginBottom: '20px',
    },
    success: {
      backgroundColor: 'rgba(76, 175, 80, 0.2)',
      color: '#4CAF50',
      padding: '12px 15px',
      borderRadius: '10px',
      borderLeft: '4px solid #4CAF50',
    },
    error: {
      backgroundColor: 'rgba(244, 67, 54, 0.2)',
      color: '#F44336',
      padding: '12px 15px',
      borderRadius: '10px',
      borderLeft: '4px solid #F44336',
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        {/* Panel Izquierdo - Solo visible en pantallas medianas y grandes */}
        <div style={styles.leftPanel}>
          <div style={styles.leftContent}>
            <div style={{ marginBottom: '60px' }}>
              <h1 style={styles.welcomeTitle}>Bienvenido a Nuestro Estudio de Danza</h1>
              <p style={styles.welcomeText}>
                Inicia sesión para acceder a tus clases, reservar estudios o comprar productos. 
                ¿Nuevo? Regístrate y únete a nuestra comunidad de danza.
              </p>
            </div>
            
            <div style={styles.brandFeature}>
              <div style={styles.featureIcon}>
                <span>💃</span>
              </div>
              <div style={styles.featureText}>Clases de danza para todos los niveles</div>
            </div>
            
            <div style={styles.brandFeature}>
              <div style={styles.featureIcon}>
                <span>👗</span>
              </div>
              <div style={styles.featureText}>Alquiler de vestuario exclusivo</div>
            </div>
            
            <div style={styles.brandFeature}>
              <div style={styles.featureIcon}>
                <span>🎭</span>
              </div>
              <div style={styles.featureText}>Coreografías personalizadas</div>
            </div>
            
            <div style={styles.brandFeature}>
              <div style={styles.featureIcon}>
                <span>🏢</span>
              </div>
              <div style={styles.featureText}>Reserva de estudios de danza</div>
            </div>
          </div>
        </div>

        {/* Panel Derecho - Formulario */}
        <div style={styles.rightPanel}>
          <div style={styles.formWrapper}>
            <div style={styles.logo}>
              <h1 style={styles.logoText}>Danza Estelar</h1>
              <p style={styles.logoSubtext}>Estudio de Danza</p>
            </div>

            <div style={styles.formContainer}>
              {/* FORMULARIO DE LOGIN */}
              {isLogin && (
                <>
                  <h2 style={styles.title}>Iniciar Sesión</h2>
                  <p style={styles.subtitle}>Accede a tu cuenta para continuar</p>
              
                  {error && (
                    <div style={styles.alertContainer}>
                      <div style={styles.error}>{error}</div>
                    </div>
                  )}
                    
                  {success && (
                    <div style={styles.alertContainer}>
                      <div style={styles.success}>{success}</div>
                    </div>
                  )}

                  <Form onSubmit={handleLoginSubmit}>
                    <div style={styles.inputBox}>
                      <span style={styles.icon}>
                        <IonIcon icon={mailOutline} />
                      </span>
                      <input
                        type="email"
                        placeholder="Correo Electrónico"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        style={styles.input}
                      />
                    </div>
                    
                    <div style={styles.inputBox}>
                      <span style={styles.icon}>
                        <IonIcon icon={lockClosedOutline} />
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Contraseña"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        style={styles.input}
                      />
                      <span style={styles.togglePassword} onClick={togglePasswordVisibility}>
                        <IonIcon icon={showPassword ? eyeOutline : eyeOffOutline} />
                      </span>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '20px'
                    }}>
                      <label style={styles.checkboxLabel}>
                        <input 
                          type="checkbox" 
                          style={styles.checkbox}
                          checked={rememberMe}
                          onChange={() => setRememberMe(!rememberMe)}
                        /> 
                        Recordarme
                      </label>
                      <a href="/recuperar-contrasena" style={styles.forgotPassword}>
                        ¿Olvidaste tu contraseña?
                      </a>
                    </div>
                    
                    <Button type="submit" style={styles.button}>
                      Iniciar Sesión
                    </Button>
                  </Form>
                  
                  <div style={styles.switchForm}>
                    ¿No tienes una cuenta?{' '}
                    <span style={styles.link} onClick={toggleForm}>
                      Regístrate aquí
                    </span>
                  </div>
                  
                  <div style={styles.termsText}>
                    Al iniciar sesión, aceptas nuestras{' '}
                    <Link to="/politicas#cliente" style={styles.highlight}>Políticas de Cliente</Link>{' '}
                    y{' '}
                    <Link to="/politicas#privacidad" style={styles.highlight}>Políticas de Privacidad</Link>
                  </div>
                </>
              )}

              {/* FORMULARIO DE REGISTRO */}
              {!isLogin && (
                <>
                  <h2 style={styles.title}>Crear Cuenta</h2>
                  <p style={styles.subtitle}>Únete a nuestra comunidad de danza</p>
              
                  {error && (
                    <div style={styles.alertContainer}>
                      <div style={styles.error}>{error}</div>
                    </div>
                  )}
                    
                  {success && (
                    <div style={styles.alertContainer}>
                      <div style={styles.success}>{success}</div>
                    </div>
                  )}

                  <Form onSubmit={handleRegisterSubmit}>
                    <div style={styles.inputRow}>
                      <div style={styles.inputBox}>
                        <input
                          type="text"
                          placeholder="Nombre"
                          value={nombre}
                          onChange={(e) => setNombre(e.target.value)}
                          style={styles.input}
                        />
                      </div>
                      <div style={styles.inputBox}>
                        <input
                          type="text"
                          placeholder="Apellido"
                          value={apellido}
                          onChange={(e) => setApellido(e.target.value)}
                          style={styles.input}
                        />
                      </div>
                    </div>
                    
                    <div style={styles.inputBox}>
                      <span style={styles.icon}>
                        <IonIcon icon={callOutline} />
                      </span>
                      <input
                        type="tel"
                        placeholder="Teléfono"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        style={styles.input}
                      />
                    </div>
                    
                    <div style={styles.inputBox}>
                      <span style={styles.icon}>
                        <IonIcon icon={mailOutline} />
                      </span>
                      <input
                        type="email"
                        placeholder="Correo Electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                      />
                    </div>
                    
                    <div style={styles.inputBox}>
                      <span style={styles.icon}>
                        <IonIcon icon={lockClosedOutline} />
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                      />
                      <span style={styles.togglePassword} onClick={togglePasswordVisibility}>
                        <IonIcon icon={showPassword ? eyeOutline : eyeOffOutline} />
                      </span>
                      {password && (
                        <>
                          <div style={styles.passwordStrength}>
                            <div style={styles.passwordStrengthBar}></div>
                          </div>
                          <div style={styles.passwordStrengthText}>
                            {getPasswordStrengthText()}
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div style={styles.inputBox}>
                      <span style={styles.icon}>
                        <IonIcon icon={lockClosedOutline} />
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirmar Contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={styles.input}
                      />
                      <span style={styles.togglePassword} onClick={togglePasswordVisibility}>
                        <IonIcon icon={showPassword ? eyeOutline : eyeOffOutline} />
                      </span>
                    </div>
                    
                    <div style={{
                      marginBottom: '20px',
                    }}>
                      <label style={styles.checkboxLabel}>
                        <input 
                          type="checkbox" 
                          style={styles.checkbox}
                          checked={acceptTerms}
                          onChange={() => setAcceptTerms(!acceptTerms)}
                        /> 
                        Acepto las <Link to="/politicas#cliente" style={styles.highlight}>Políticas de Cliente</Link> y las <Link to="/politicas#privacidad" style={styles.highlight}>Políticas de Privacidad</Link>
                      </label>
                    </div>
                    
                    <Button type="submit" style={styles.button}>
                      Crear Cuenta
                    </Button>
                  </Form>
                  
                  <div style={styles.switchForm}>
                    ¿Ya tienes una cuenta?{' '}
                    <span style={styles.link} onClick={toggleForm}>
                      Inicia sesión aquí
                    </span>
                  </div>
                  
                  <div style={styles.termsText}>
                    Al registrarte, aceptas recibir correos electrónicos de nuestro estudio de danza.
                    Puedes darte de baja en cualquier momento.
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;