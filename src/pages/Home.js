import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Heart, Sparkles, ChevronDown, User, Mail, Phone, Clock, CheckCircle, X, Search, Upload } from 'lucide-react';
import './Home.css';
import MyBookings from './MyBookings';

const Home = () => {
  const [showBooking, setShowBooking] = useState(false);
  const [showMyBookings, setShowMyBookings] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null); // "09:00", "13:30", etc
  const [availableDays, setAvailableDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loadingDays, setLoadingDays] = useState(false);
  const [error, setError] = useState(null);
  const [showAllDays, setShowAllDays] = useState(false); // Para mostrar/ocultar días
  const [selectedDayFilter, setSelectedDayFilter] = useState('todos'); // Filtro por día de la semana
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    motivo: '',
    primeraConsulta: null,
    yaPago: null
  });
  const [comprobanteUrl, setComprobanteUrl] = useState(null);
  const [uploadingComprobante, setUploadingComprobante] = useState(false);

  // Detectar si es móvil para optimizar rendimiento
  const [isMobile, setIsMobile] = useState(false);
  
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToBooking = () => {
    setShowBooking(true);
    setTimeout(() => {
      document.getElementById('booking-section')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 100);
  };

  const handleShowMyBookings = () => {
    setShowMyBookings(true);
  };

  const handleBackFromBookings = () => {
    setShowMyBookings(false);
  };

  const steps = [
    { id: 'schedule', title: 'Seleccionar Horario', icon: Clock },
    { id: 'personal', title: 'Información Personal', icon: User },
    { id: 'confirm', title: 'Confirmación', icon: CheckCircle }
  ];

  // Horarios disponibles fijos
  const timeSlots = [
    { value: "09:00", label: "9:00 AM" },
    { value: "10:30", label: "10:30 AM" },
    { value: "12:30", label: "12:30 PM" },
    { value: "14:00", label: "2:00 PM" },
    { value: "16:00", label: "4:00 PM" },
    { value: "18:00", label: "6:00 PM" }
  ];

  const handleInputChange = (field, value) => {
    // Validaciones específicas por campo
    if (field === 'name') {
      // Solo letras y espacios
      value = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    } else if (field === 'phone') {
      // Solo números, sin espacios ni caracteres especiales
      value = value.replace(/[^\d]/g, '');
      // Limitar a 10 dígitos
      if (value.length > 10) {
        value = value.slice(0, 10);
      }
    } else if (field === 'email') {
      // Convertir a minúsculas y eliminar espacios
      value = value.toLowerCase().trim();
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Función para subir comprobante a Cloudinary
  const handleComprobanteUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Por favor sube una imagen (JPG, PNG, WEBP) o PDF');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('El archivo es muy grande. El tamaño máximo es 5MB');
      return;
    }

    setUploadingComprobante(true);

    try {
      const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'dxhhrqxwm';
      const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'vibracion_alta_comprobantes';
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', 'comprobantes_pago');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error('Error al subir el archivo');
      }

      const data = await response.json();
      setComprobanteUrl(data.secure_url);
      console.log('Comprobante subido exitosamente:', data.secure_url);
    } catch (error) {
      console.error('Error al subir comprobante:', error);
      alert('Hubo un error al subir el comprobante. Por favor intenta nuevamente.');
    } finally {
      setUploadingComprobante(false);
    }
  };

  // Mapeo de días en inglés a español
  const diasEspanol = {
    'Monday': 'Lunes',
    'Tuesday': 'Martes',
    'Wednesday': 'Miércoles',
    'Thursday': 'Jueves',
    'Friday': 'Viernes',
    'Saturday': 'Sábado',
    'Sunday': 'Domingo'
  };

  // Mapeo de meses abreviados en inglés a español
  const mesesEspanol = {
    'Jan': 'Ene',
    'Feb': 'Feb',
    'Mar': 'Mar',
    'Apr': 'Abr',
    'May': 'May',
    'Jun': 'Jun',
    'Jul': 'Jul',
    'Aug': 'Ago',
    'Sep': 'Sep',
    'Oct': 'Oct',
    'Nov': 'Nov',
    'Dec': 'Dic'
  };

  // Función para traducir fechas del inglés al español
  const traducirFecha = (fechaLegible) => {
    if (!fechaLegible) return fechaLegible;
    
    // Reemplazar nombres de meses abreviados
    let fechaTraducida = fechaLegible;
    Object.keys(mesesEspanol).forEach(monthEn => {
      const monthEs = mesesEspanol[monthEn];
      // Buscar el patrón del mes en inglés y reemplazarlo
      const regex = new RegExp(`\\b${monthEn}\\b`, 'g');
      fechaTraducida = fechaTraducida.replace(regex, monthEs);
    });
    
    return fechaTraducida;
  };

  // Días de la semana para filtros (orden correcto)
  const diasSemanaFiltros = [
    { key: 'todos', label: 'Todos', emoji: '📅' },
    { key: 'Lunes', label: 'Lunes', emoji: '📌' },
    { key: 'Martes', label: 'Martes', emoji: '📌' },
    { key: 'Miércoles', label: 'Miércoles', emoji: '📌' },
    { key: 'Jueves', label: 'Jueves', emoji: '📌' },
    { key: 'Viernes', label: 'Viernes', emoji: '📌' },
    { key: 'Sábado', label: 'Sábado', emoji: '📌' }
  ];

  // Función para filtrar días según el día de la semana seleccionado
  const getFilteredDays = () => {
    if (selectedDayFilter === 'todos') {
      return availableDays;
    }
    return availableDays.filter(day => day.diaSemana === selectedDayFilter);
  };

  // Función para convertir hora 24h a 12h con AM/PM
  const formatearHora12h = (hora24) => {
    const [horas, minutos] = hora24.split(':');
    const h = parseInt(horas);
    const m = minutos;
    
    if (h === 0) return `12:${m} AM`;
    if (h < 12) return `${h}:${m} AM`;
    if (h === 12) return `12:${m} PM`;
    return `${h - 12}:${m} PM`;
  };

  // Función para consultar días disponibles para una hora específica
  const handleTimeSlotSelect = async (timeValue) => {
    setSelectedTimeSlot(timeValue);
    setSelectedDay(null);
    setAvailableDays([]);
    setShowAllDays(false); // Reset al seleccionar nueva hora
    setLoadingDays(true);
    setError(null);

    try {
      const response = await fetch('https://vibracionaltacalendario.app.n8n.cloud/webhook/api/dias-disponibles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hora: timeValue })
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      
  // Datos recibidos de n8n (procesados sin logs de debug en producción)
      
      if (data.success && data.dias && Array.isArray(data.dias)) {
        // Traducir días al español
        const diasTraducidos = data.dias.map(dia => ({
          ...dia,
          diaSemanaOriginal: dia.diaSemana,
          diaSemana: diasEspanol[dia.diaSemana] || dia.diaSemana
        }));
        
  // Días traducidos listos para renderizar
        
        setAvailableDays(diasTraducidos);
      } else {
        throw new Error('Formato de respuesta inválido');
      }
    } catch (error) {
      console.error('Error obteniendo días disponibles:', error);
      setError('No se pudieron cargar los días disponibles. Por favor intenta nuevamente.');
      setAvailableDays([]);
    } finally {
      setLoadingDays(false);
    }
  };

  // Función para seleccionar un día específico
  const handleDaySelect = (day) => {
    setSelectedDay(day);
    setFormData(prev => ({
      ...prev,
      date: day.fecha,
      time: selectedTimeSlot
    }));
  };

  const nextStep = () => {
    // Validar que se haya seleccionado día y hora en el primer paso
    if (currentStep === 0) {
      if (!selectedDay || !selectedTimeSlot) {
        alert('Por favor selecciona una hora y una fecha disponible');
        return;
      }
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState(null);

  const submitForm = async () => {
    // Validar campos requeridos
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    if (!selectedDay || !selectedTimeSlot) {
      alert('Error: No se ha seleccionado fecha y hora');
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar datos para enviar a n8n
      const dataToSend = {
        nombre: formData.name,
        email: formData.email,
        celular: formData.phone,
        motivo: formData.motivo || 'No especificado',
        esPrimeraVez: formData.primeraConsulta === true ? 'Sí' : formData.primeraConsulta === false ? 'No' : 'No especificado',
        yaPago: formData.yaPago === true ? 'Sí' : 'No',
        fechaHoraISO: selectedDay.fechaHoraISO
      };

      // Solo agregar comprobanteUrl si existe (si se subió un archivo)
      if (comprobanteUrl) {
        dataToSend.comprobanteUrl = comprobanteUrl;
      }

      console.log('Enviando datos a n8n:', dataToSend);

      // Enviar a n8n (producción)
      const response = await fetch('https://vibracionaltacalendario.app.n8n.cloud/webhook/agendar-cita', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const result = await response.json();
      console.log('Respuesta de n8n:', result);

      // Guardar datos para mostrar en confirmación
      setBookingConfirmation({
        nombre: formData.name,
        email: formData.email,
        fecha: traducirFecha(selectedDay.fechaLegible),
        diaSemana: selectedDay.diaSemana,
        hora: formatearHora12h(selectedTimeSlot),
        motivo: formData.motivo || 'No especificado',
        esPrimeraVez: formData.primeraConsulta === true ? 'Sí' : 'No'
      });

      // Mostrar pantalla de éxito
      setShowSuccess(true);

    } catch (error) {
      console.error('Error al agendar cita:', error);
      alert('Hubo un error al agendar tu cita. Por favor intenta nuevamente o contacta con soporte.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Mostrar MyBookings si está activo con animación suave
  if (showMyBookings) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <MyBookings onBack={handleBackFromBookings} />
      </motion.div>
    );
  }

  // Pantalla de éxito
  if (showSuccess && bookingConfirmation) {
    return (
      <div className="home">
        <motion.section 
          className="success-screen"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="success-wrapper">
            <div className="success-header">
              <motion.h2
                className="success-title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                ¡Solicitud de Cita Enviada!
              </motion.h2>

              <motion.p
                className="success-message"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                ¡Gracias por reservar en Vibración Alta! Te estaremos enviando una confirmación por correo electronico.
              </motion.p>
            </div>

            <motion.div
              className="booking-summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h3>Resumen de la Cita:</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <div className="summary-icon">
                    <User size={18} />
                  </div>
                  <div className="summary-content">
                    <span className="summary-label">Nombre</span>
                    <span className="summary-value">{bookingConfirmation.nombre}</span>
                  </div>
                </div>
                
                <div className="summary-item">
                  <div className="summary-icon">
                    <Calendar size={18} />
                  </div>
                  <div className="summary-content">
                    <span className="summary-label">Fecha y Hora</span>
                    <span className="summary-value">
                      {bookingConfirmation.diaSemana}, {bookingConfirmation.fecha} @ {bookingConfirmation.hora}
                    </span>
                  </div>
                </div>
                
                <div className="summary-item">
                  <div className="summary-icon">
                    <Mail size={18} />
                  </div>
                  <div className="summary-content">
                    <span className="summary-label">Email</span>
                    <span className="summary-value">{bookingConfirmation.email}</span>
                  </div>
                </div>
                
                {bookingConfirmation.motivo && bookingConfirmation.motivo !== 'No especificado' && (
                  <div className="summary-item">
                    <div className="summary-icon">
                      <Sparkles size={18} />
                    </div>
                    <div className="summary-content">
                      <span className="summary-label">Motivo</span>
                      <span className="summary-value">{bookingConfirmation.motivo}</span>
                    </div>
                  </div>
                )}
              </div>

              <motion.button
                className="back-home-btn"
                onClick={() => {
                  setShowSuccess(false);
                  setShowBooking(false);
                  setCurrentStep(0);
                  setSelectedDay(null);
                  setSelectedTimeSlot(null);
                  setAvailableDays([]);
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    date: '',
                    time: '',
                    motivo: '',
                    primeraConsulta: null,
                    yaPago: null
                  });
                  setComprobanteUrl(null);
                  setBookingConfirmation(null);
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Heart size={20} />
                Volver al Inicio
              </motion.button>
            </motion.div>
          </div>
        </motion.section>
      </div>
    );
  }

  return (
    <div className={`home ${showBooking ? 'with-booking' : ''}`}>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        
        <div className="hero-content">
          <motion.div
            className="hero-main"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            {/* Logo integrado en el diseño */}
            <div className="logo-container">
              <img src="/logo.jpg" alt="Vibración Alta" className="logo" />
              <div className="logo-glow"></div>
            </div>

              <motion.h1
                className="hero-title"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              >
              Bienvenidos a un rincón de
              <span className="highlight"> sanación y expansión espiritual</span>
              </motion.h1>
              
              <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Conecta con tu esencia divina a través de la Terapia Angelical y Reiki
            </motion.p>

            <motion.div 
              className="hero-buttons"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
            >
              <motion.button
                className="reserve-btn primary"
                onClick={scrollToBooking}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart size={24} />
                <span>Agendar mi sesión ahora</span>
                <Sparkles size={20} />
              </motion.button>

              <motion.button
                className="reserve-btn secondary"
                onClick={handleShowMyBookings}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search size={24} />
                <span>Consultar Reservas</span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="scroll-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            onClick={scrollToBooking}
          >
            <ChevronDown size={24} />
          </motion.div>
        </div>

        {/* Floating spiritual elements */}
        <div className="spiritual-elements">
          <motion.div
            className="element element-1"
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, 0],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            ✨
          </motion.div>
          <motion.div
            className="element element-2"
            animate={{
              y: [0, 20, 0],
              rotate: [0, -8, 0],
              opacity: [0.2, 0.6, 0.2]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          >
            🌙
          </motion.div>
          <motion.div
            className="element element-3"
            animate={{
              y: [0, -25, 0],
              rotate: [0, 5, 0],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }}
          >
            💫
          </motion.div>
        </div>
      </section>

      {/* Booking Section - Optimizado para móvil */}
      {showBooking && (
        <AnimatePresence>
          <motion.section 
            id="booking-section" 
            className={`booking-section ${isMobile ? 'mobile-optimized' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: isMobile ? 0 : 0.5 }}
          >
            {/* Elementos Espirituales de Fondo - DESACTIVADOS EN MÓVIL para mejor rendimiento */}
            {!isMobile && (
              <div className="spiritual-background-elements">
                <motion.div
                  className="floating-element floating-1"
                  animate={{
                    y: [0, -40, 0],
                    rotate: [0, 15, 0],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  ✨
                </motion.div>
              <motion.div
                className="floating-element floating-2"
                animate={{
                  y: [0, 30, 0],
                  rotate: [0, -10, 0],
                  opacity: [0.2, 0.7, 0.2]
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 3
                }}
              >
                🌙
              </motion.div>
              <motion.div
                className="floating-element floating-3"
                animate={{
                  y: [0, -35, 0],
                  rotate: [0, 8, 0],
                  opacity: [0.4, 0.9, 0.4]
                }}
                transition={{
                  duration: 18,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 6
                }}
              >
                💫
              </motion.div>
              <motion.div
                className="floating-element floating-4"
                animate={{
                  y: [0, 25, 0],
                  rotate: [0, -12, 0],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 14,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 9
                }}
              >
                🔮
              </motion.div>
              <motion.div
                className="floating-element floating-5"
                animate={{
                  y: [0, -30, 0],
                  rotate: [0, 6, 0],
                  opacity: [0.2, 0.8, 0.2]
                }}
                transition={{
                  duration: 16,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 12
                }}
              >
                ⭐
              </motion.div>
              <motion.div
                className="floating-element floating-6"
                animate={{
                  y: [0, 40, 0],
                  rotate: [0, -8, 0],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 15
                }}
              >
                🌟
              </motion.div>
            </div>
            )}

            {/* Líneas de Energía Espiritual - DESACTIVADAS EN MÓVIL para mejor rendimiento */}
            {!isMobile && (
              <div className="energy-lines">
              <motion.div
                className="energy-line line-1"
                animate={{
                  scaleX: [0, 1, 0],
                  opacity: [0, 0.6, 0]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              ></motion.div>
              <motion.div
                className="energy-line line-2"
                animate={{
                  scaleX: [0, 1, 0],
                  opacity: [0, 0.4, 0]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
              ></motion.div>
              <motion.div
                className="energy-line line-3"
                animate={{
                  scaleX: [0, 1, 0],
                  opacity: [0, 0.5, 0]
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 4
                }}
              ></motion.div>
            </div>
            )}

            <div className="booking-container">
              <div className="spiritual-form">
                {/* Header del Formulario */}
                <div className="form-header">
                  <h2>Elige el momento para tu sanación</h2>
                  <p>A través de Terapia Angelical y Reiki, abre tu camino hacia la claridad y la transmutación.
                  El cambio que buscas comienza hoy.</p>
                </div>

                {/* Progress Steps */}
                <div className="steps-container">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
              return (
                <motion.div
                        key={step.id}
                        className={`step ${index <= currentStep ? 'active' : ''} ${index === currentStep ? 'current' : ''}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="step-icon">
                          <Icon size={20} />
                  </div>
                        <span className="step-title">{step.title}</span>
                </motion.div>
              );
            })}
          </div>

                {/* Form Content */}
                <div className="form-content">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep}
                        initial={false}
                        animate={{ opacity: 1 }}
                        exit={false}
                        transition={{ duration: 0 }}
                        className="step-content"
                      >
                      {/* Elementos Decorativos Laterales - DESACTIVADOS EN MÓVIL para mejor rendimiento */}
                      {!isMobile && (
                        <div className="side-decorations">
                          <motion.div
                            className="decoration-left"
                            animate={{
                              rotate: [0, 360],
                              scale: [1, 1.1, 1]
                            }}
                            transition={{
                              duration: 20,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                          >
                            <div className="spiritual-symbol">☯</div>
                          </motion.div>
                          <motion.div
                            className="decoration-right"
                            animate={{
                              rotate: [0, -360],
                              scale: [1, 1.1, 1]
                            }}
                            transition={{
                              duration: 25,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                          >
                            <div className="spiritual-symbol">∞</div>
                          </motion.div>
                        </div>
                      )}
                      {/* Step 1: Seleccionar Hora y Día */}
                      {currentStep === 0 && (
                        <div className="step-form">
                          <h3>Tenemos estas horas disponibles para que puedas reservar con nosotros:</h3>
                          
                          {/* Selección de hora */}
                          <div className="time-selection">

                            <div className="time-slots-grid">
                              {timeSlots.map((slot) => (
                                <button
                                  key={slot.value}
                                  type="button"
                                  className={`time-slot-button ${selectedTimeSlot === slot.value ? 'selected' : ''}`}
                                  onClick={() => handleTimeSlotSelect(slot.value)}
                                >
                                  <Clock size={18} />
                                  <span>{slot.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Mostrar loading mientras carga los días */}
                          {loadingDays && (
                            <motion.div
                              className="loading-days"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="spinner"></div>
                              <p>Cargando días disponibles...</p>
                            </motion.div>
                          )}

                          {/* Mostrar error si hay */}
                          {error && (
                            <motion.div
                              className="error-message-box"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <p>{error}</p>
                            </motion.div>
                          )}

                          {/* Debug visual eliminado para producción */}

                          {/* Mostrar días disponibles */}
                          {!loadingDays && availableDays.length > 0 && (
                            <motion.div
                              className="available-days-section"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4 }}
                            >
                              <div className="days-header">
                                <label className="days-label">
                                  Días Disponibles ({getFilteredDays().length}) *
                                </label>
                              </div>

                              {/* Filtro desplegable por día de la semana */}
                              <motion.div 
                                className="day-filter-container"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                              >
                                <label className="filter-label-text">
                                  <Calendar size={18} />
                                  Filtrar por día:
                                </label>
                                <div className="filter-select-wrapper">
                                  <select
                                    className="filter-select"
                                    value={selectedDayFilter}
                                    onChange={(e) => {
                                      e.preventDefault();
                                      setSelectedDayFilter(e.target.value);
                                      setShowAllDays(false);
                                    }}
                                  >
                                    {diasSemanaFiltros.map((dia) => {
                                      const count = dia.key === 'todos' 
                                        ? availableDays.length 
                                        : availableDays.filter(d => d.diaSemana === dia.key).length;
                                      return (
                                        <option key={dia.key} value={dia.key}>
                                          {dia.emoji} {dia.label} {count > 0 ? `(${count})` : ''}
                                        </option>
                                      );
                                    })}
                                  </select>
                                  <ChevronDown className="select-arrow" size={18} />
                                </div>
                              </motion.div>

                              <div className="days-grid">
                                {(showAllDays ? getFilteredDays() : getFilteredDays().slice(0, 6)).map((day, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    className={`day-button ${selectedDay?.fecha === day.fecha ? 'selected' : ''}`}
                                    onClick={() => handleDaySelect(day)}
                                  >
                                    <div className="day-header">
                                      <Calendar size={16} />
                                      <span className="day-weekday">{day.diaSemana}</span>
                                    </div>
                                    <div className="day-date">{traducirFecha(day.fechaLegible)}</div>
                                    <div className="day-time">
                                      <Clock size={14} />
                                      <span>{formatearHora12h(day.hora || selectedTimeSlot)}</span>
                                    </div>
                                  </button>
                                ))}
                              </div>
                              
                              {/* Botón para mostrar más días */}
                              {getFilteredDays().length > 6 && (
                                <motion.button
                                  type="button"
                                  className="show-more-days-btn"
                                  onClick={() => setShowAllDays(!showAllDays)}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.3 }}
                                >
                                  {showAllDays ? (
                                    <>
                                      Mostrar menos días
                                      <ChevronDown size={18} style={{ transform: 'rotate(180deg)' }} />
                                    </>
                                  ) : (
                                    <>
                                      Mostrar más días ({getFilteredDays().length - 6} más)
                                      <ChevronDown size={18} />
                                    </>
                                  )}
                                </motion.button>
                              )}
                            </motion.div>
                          )}

                          {/* Mostrar selección final */}
                          {selectedDay && selectedTimeSlot && (
                            <motion.div
                              className="selected-slot-display"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="slot-info">
                                <h4>✨ Horario Seleccionado:</h4>
                                <div className="slot-details">
                                  <div className="slot-detail">
                                    <Calendar size={16} />
                                    <span>{traducirFecha(selectedDay.fechaLegible)} - {selectedDay.diaSemana}</span>
                                  </div>
                                  <div className="slot-detail">
                                    <Clock size={16} />
                                    <span>{formatearHora12h(selectedTimeSlot)}</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      )}

                      {/* Step 2: Información Personal */}
                      {currentStep === 1 && (
                        <div className="step-form">
                          <h3>Tu Información</h3>
                          <div className="input-group">
                            <div className="input-field">
                              <User size={20} />
                              <input
                                type="text"
                                placeholder="Tu nombre completo"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                required
                                minLength={3}
                                maxLength={50}
                                pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
                                title="Solo letras y espacios"
                                autoComplete="name"
                              />
                            </div>
                            <div className="input-field">
                              <Mail size={20} />
                              <input
                                type="email"
                                placeholder="tu@email.com"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                required
                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                title="Ingresa un email válido"
                                autoComplete="email"
                              />
                            </div>
                            <div className="input-field">
                              <Phone size={20} />
                              <input
                                type="tel"
                                inputMode="numeric"
                                placeholder="3001234567"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                required
                                pattern="\d{10}"
                                minLength={10}
                                maxLength={10}
                                title="Ingresa 10 dígitos sin espacios (ej: 3001234567)"
                                autoComplete="tel"
                              />
                            </div>

                            {/* Campo de Motivo */}
                            <div className="input-field textarea-field">
                              <Sparkles size={20} />
                              <textarea
                                placeholder="Motivo de tu consulta..."
                                value={formData.motivo}
                                onChange={(e) => handleInputChange('motivo', e.target.value)}
                                rows={4}
                              />
                            </div>

                            {/* Preguntas Sí/No */}
                            <div className="yes-no-questions">
                              {/* ¿Es tu primera consulta? */}
                              <div className="question-group">
                                <label className="question-label">¿Es tu primera consulta?</label>
                                <div className="yes-no-buttons">
                                  <button
                                    type="button"
                                    className={`yes-no-btn ${formData.primeraConsulta === true ? 'selected yes' : ''}`}
                                    onClick={() => handleInputChange('primeraConsulta', true)}
                                  >
                                    <CheckCircle size={18} />
                                    Sí
                                  </button>
                                  <button
                                    type="button"
                                    className={`yes-no-btn ${formData.primeraConsulta === false ? 'selected no' : ''}`}
                                    onClick={() => handleInputChange('primeraConsulta', false)}
                                  >
                                    <X size={18} />
                                    No
                                  </button>
                                </div>
                              </div>

                              {/* ¿Ya pagaste la consulta? */}
                              <div className="question-group">
                                <label className="question-label">¿Ya pagaste la consulta?</label>
                                <div className="yes-no-buttons">
                                  <button
                                    type="button"
                                    className={`yes-no-btn ${formData.yaPago === true ? 'selected yes' : ''}`}
                                    onClick={() => {
                                      handleInputChange('yaPago', true);
                                      // Reset comprobante si cambia de opinión
                                    }}
                                  >
                                    <CheckCircle size={18} />
                                    Sí
                                  </button>
                                  <button
                                    type="button"
                                    className={`yes-no-btn ${formData.yaPago === false ? 'selected no' : ''}`}
                                    onClick={() => {
                                      handleInputChange('yaPago', false);
                                      setComprobanteUrl(null);
                                    }}
                                  >
                                    <X size={18} />
                                    No
                                  </button>
                                </div>
                              </div>

                              {/* Campo de Subida de Comprobante - Solo si yaPago === true */}
                              <AnimatePresence>
                                {formData.yaPago === true && (
                                  <motion.div
                                    className="comprobante-upload-section"
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                                  >
                                    <label className="comprobante-label">
                                      <Sparkles size={18} />
                                      Subir Comprobante de Pago
                                    </label>
                                    
                                    <div className="comprobante-upload-container">
                                      <input
                                        type="file"
                                        id="comprobante-input"
                                        className="comprobante-input"
                                        accept="image/*,.pdf"
                                        onChange={handleComprobanteUpload}
                                        disabled={uploadingComprobante}
                                        style={{ display: 'none' }}
                                      />
                                      
                                      <div
                                        className={`comprobante-upload-box ${uploadingComprobante ? 'uploading' : ''} ${comprobanteUrl ? 'uploaded' : ''}`}
                                        onClick={() => {
                                          if (!uploadingComprobante && !comprobanteUrl) {
                                            document.getElementById('comprobante-input').click();
                                          }
                                        }}
                                        style={{ cursor: uploadingComprobante || comprobanteUrl ? 'default' : 'pointer' }}
                                      >
                                        {uploadingComprobante ? (
                                          <div className="upload-loading">
                                            <div className="spinner"></div>
                                            <span>Subiendo...</span>
                                          </div>
                                        ) : comprobanteUrl ? (
                                          <div className="upload-success">
                                            <CheckCircle size={32} className="success-icon" />
                                            <span className="success-text">¡Comprobante subido!</span>
                                            <button
                                              type="button"
                                              className="change-file-btn"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                setComprobanteUrl(null);
                                              }}
                                            >
                                              Cambiar archivo
                                            </button>
                                          </div>
                                        ) : (
                                          <div className="upload-placeholder">
                                            <Upload size={32} className="upload-icon" />
                                            <span className="upload-text">Haz clic para subir</span>
                                            <span className="upload-hint">JPG, PNG, WEBP o PDF (máx. 5MB)</span>
                                          </div>
                                        )}
                                      </div>

                                      {comprobanteUrl && (
                                        <motion.a
                                          href={comprobanteUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="view-comprobante-link"
                                          initial={{ opacity: 0, y: -10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay: 0.2 }}
                                        >
                                          <Search size={16} />
                                          Ver comprobante
                                        </motion.a>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 3: Confirmación */}
                      {currentStep === 2 && (
                        <div className="step-form">
                          <h3>Confirma tu sesión</h3>
                          <div className="confirmation-details">
                            <div className="detail-item">
                              <span>Nombre:</span>
                              <span>{formData.name}</span>
                            </div>
                            <div className="detail-item">
                              <span>Email:</span>
                              <span>{formData.email}</span>
                            </div>
                            <div className="detail-item">
                              <span>Teléfono:</span>
                              <span>{formData.phone}</span>
                            </div>
                            <div className="detail-item">
                              <span>Fecha:</span>
                              <span>{traducirFecha(selectedDay?.fechaLegible)}</span>
                            </div>
                            <div className="detail-item">
                              <span>Día:</span>
                              <span>{selectedDay?.diaSemana}</span>
                            </div>
                            <div className="detail-item">
                              <span>Hora:</span>
                              <span>{formatearHora12h(selectedTimeSlot)}</span>
                            </div>
                            {formData.motivo && (
                              <div className="detail-item full-width">
                                <span>Motivo:</span>
                                <span>{formData.motivo}</span>
                              </div>
                            )}
                            <div className="detail-item">
                              <span>Primera consulta:</span>
                              <span className={`badge ${formData.primeraConsulta ? 'badge-yes' : 'badge-no'}`}>
                                {formData.primeraConsulta === true ? 'Sí' : formData.primeraConsulta === false ? 'No' : 'No especificado'}
                              </span>
                            </div>
                            <div className="detail-item">
                              <span>Ya pagó:</span>
                              <span className={`badge ${formData.yaPago ? 'badge-yes' : 'badge-no'}`}>
                                {formData.yaPago === true ? 'Sí' : formData.yaPago === false ? 'No' : 'No especificado'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                      </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Buttons */}
                <div className={`form-navigation ${currentStep === 0 ? 'centered' : ''}`}>
                  {currentStep > 0 && (
                    <button className="nav-btn prev-btn" onClick={prevStep}>
                      Anterior
                    </button>
                  )}
                  {currentStep < steps.length - 1 ? (
                    <button className="nav-btn next-btn" onClick={nextStep}>
                      Siguiente
                    </button>
                  ) : (
                    <button 
                      className={`nav-btn submit-btn ${isSubmitting ? 'loading' : ''}`}
                      onClick={submitForm}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="spinner"></div>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Heart size={20} />
                          Reservar Cita
                        </>
                      )}
                    </button>
                  )}
            </div>
              </div>
            </div>
          </motion.section>
        </AnimatePresence>
      )}

    </div>
  );
};

export default Home;
