import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Heart, Sparkles, ChevronDown, User, Mail, Phone, Clock, CheckCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import N8nService from '../services/n8nService';
import SpiritualCalendar from '../components/SpiritualCalendar';
import SpiritualTimePicker from '../components/SpiritualTimePicker';
import './Home.css';

const Home = () => {
  const [showBooking, setShowBooking] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: ''
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const scrollToBooking = () => {
    setShowBooking(true);
    setTimeout(() => {
      document.getElementById('booking-section')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 100);
  };

  const steps = [
    { id: 'schedule', title: 'Fecha y Hora', icon: Clock },
    { id: 'slots', title: 'Horarios', icon: Calendar },
    { id: 'personal', title: 'Información Personal', icon: User },
    { id: 'confirm', title: 'Confirmación', icon: CheckCircle }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Funciones para el calendario personalizado
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setFormData(prev => ({ ...prev, date: date.toISOString().split('T')[0] }));
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setFormData(prev => ({ ...prev, time }));
  };

  const openCalendar = () => {
    setShowCalendar(true);
  };

  const openTimePicker = () => {
    setShowTimePicker(true);
  };

  // Función para cargar slots disponibles
  const loadAvailableSlots = async () => {
    if (!selectedDate) return;

    setLoadingSlots(true);
    setSlotsError(null);
    setAvailableSlots([]);
    setSelectedSlot(null);

    try {
      const requestData = {
        fecha: selectedDate.toISOString().split('T')[0],
        hora: selectedTime || null
      };

      console.log('Consultando slots con:', requestData);
      const slots = await N8nService.getAvailableSlotsWithParams(requestData.fecha, requestData.hora);
      setAvailableSlots(slots);

    } catch (err) {
      console.error('Error cargando slots:', err);
      setSlotsError('Error al cargar los horarios disponibles. Inténtalo de nuevo.');
    } finally {
      setLoadingSlots(false);
    }
  };

  // Removemos la carga automática de slots
  // Los slots se cargarán solo cuando el usuario haga clic en "Continuar"

  // Función para manejar la selección de un slot
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setFormData(prev => ({
      ...prev,
      date: slot.day,
      time: slot.time
    }));
  };

  const nextStep = () => {
    // Validar que se haya seleccionado fecha en el primer paso
    if (currentStep === 0) {
      if (!selectedDate) {
        alert('Por favor selecciona una fecha');
        return;
      }
      // Cargar slots cuando se avance del paso 1 al paso 2
      loadAvailableSlots();
    }
    
    // Validar que se haya seleccionado un slot en el segundo paso (horarios)
    if (currentStep === 1) {
      if (!selectedSlot) {
        alert('Por favor selecciona un horario disponible');
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

  const submitForm = () => {
    console.log('Formulario enviado:', formData);
    // Aquí iría la lógica de envío
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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

            <motion.button
              className="reserve-btn"
              onClick={scrollToBooking}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart size={24} />
              <span>Reservar Sesión</span>
              <Sparkles size={20} />
            </motion.button>
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

      {/* Booking Section - Diseño Espiritual Original */}
      {showBooking && (
        <AnimatePresence>
          <motion.section 
            id="booking-section" 
            className="booking-section"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
          >
            {/* Elementos Espirituales de Fondo */}
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

            {/* Líneas de Energía Espiritual */}
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

            <div className="booking-container">
              <div className="spiritual-form">
                {/* Header del Formulario */}
                <div className="form-header">
                  <h2>Reservar Sesión Espiritual</h2>
                  <p>Conecta con tu esencia divina a través de la Terapia Angelical y Reiki</p>
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
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                        className="step-content"
                      >
                      {/* Elementos Decorativos Laterales */}
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
                      {/* Step 1: Fecha y Hora */}
                      {currentStep === 0 && (
                        <div className="step-form">
                          <h3>Elige tu momento perfecto</h3>
                          
                          {/* Selección de fecha */}
                          <div className="date-selection">
                            <label className="date-label">Selecciona la Fecha *</label>
                            <button
                              type="button"
                              className="date-picker-button"
                              onClick={openCalendar}
                            >
                              <Calendar size={20} />
                              <span>
                                {selectedDate 
                                  ? selectedDate.toLocaleDateString('es-ES', {
                                      weekday: 'long',
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })
                                  : 'Seleccionar fecha'
                                }
                              </span>
                            </button>
                          </div>

                          {/* Hora preferida (opcional) */}
                          <div className="time-selection">
                            <label className="time-label">Hora Preferida (Opcional)</label>
                            <button
                              type="button"
                              className="time-picker-button"
                              onClick={openTimePicker}
                            >
                              <Clock size={20} />
                              <span>
                                {selectedTime 
                                  ? selectedTime 
                                  : 'Seleccionar hora'
                                }
                              </span>
                            </button>
                            <small className="time-help">
                              Si no especificas hora, verás todos los horarios disponibles del día
                            </small>
                          </div>
                        </div>
                      )}

                      {/* Step 2: Horarios */}
                      {currentStep === 1 && (
                        <div className="step-form">
                          <h3>Selecciona tu horario</h3>
                          
                          {/* Mostrar slots disponibles */}
                          <div className="slots-section">
                            <div className="slots-header">
                              <h4>Horarios Disponibles</h4>
                              <button
                                type="button"
                                className="refresh-slots-btn"
                                onClick={loadAvailableSlots}
                                disabled={loadingSlots}
                              >
                                <RefreshCw size={16} className={loadingSlots ? 'spinning' : ''} />
                                Actualizar
                              </button>
                            </div>

                            {loadingSlots ? (
                              <div className="slots-loading">
                                <div className="spinner"></div>
                                <p>Cargando horarios disponibles...</p>
                              </div>
                            ) : slotsError ? (
                              <div className="slots-error">
                                <p>{slotsError}</p>
                                <button
                                  type="button"
                                  className="retry-btn"
                                  onClick={loadAvailableSlots}
                                >
                                  Reintentar
                                </button>
                              </div>
                            ) : availableSlots.length === 0 ? (
                              <div className="no-slots">
                                <Calendar size={32} />
                                <p>No hay horarios disponibles para esta fecha</p>
                              </div>
                            ) : (
                              <div className="slots-grid">
                                {availableSlots.map((slot, index) => (
                                  <motion.div
                                    key={`${slot.day}-${slot.time}`}
                                    className={`slot-card ${selectedSlot?.time === slot.time ? 'selected' : ''}`}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleSlotSelect(slot)}
                                  >
                                    <div className="slot-time">
                                      <Clock size={16} />
                                      {slot.time}
                                    </div>
                                    <div className="slot-duration">
                                      {slot.duration} min
                                    </div>
                                    <div className="slot-status">
                                      {selectedSlot?.time === slot.time ? (
                                        <>
                                          <CheckCircle size={14} />
                                          Seleccionado
                                        </>
                                      ) : (
                                        'Disponible'
                                      )}
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Mostrar slot seleccionado */}
                          {selectedSlot && (
                            <motion.div
                              className="selected-slot-display"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="slot-info">
                                <h4>Horario Seleccionado:</h4>
                                <div className="slot-details">
                                  <div className="slot-detail">
                                    <Calendar size={16} />
                                    <span>{formatDate(selectedSlot.day)}</span>
                                  </div>
                                  <div className="slot-detail">
                                    <Clock size={16} />
                                    <span>{selectedSlot.time} ({selectedSlot.duration} min)</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      )}

                      {/* Step 3: Información Personal */}
                      {currentStep === 2 && (
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
                              />
                            </div>
                            <div className="input-field">
                              <Mail size={20} />
                              <input
                                type="email"
                                placeholder="tu@email.com"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                              />
                            </div>
                            <div className="input-field">
                              <Phone size={20} />
                              <input
                                type="tel"
                                placeholder="+57 300 123 4567"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 4: Confirmación */}
                      {currentStep === 3 && (
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
                              <span>{formData.date}</span>
                            </div>
                            <div className="detail-item">
                              <span>Hora:</span>
                              <span>{formData.time}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Buttons */}
                <div className="form-navigation">
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
                    <button className="nav-btn submit-btn" onClick={submitForm}>
                      <Heart size={20} />
                      Reservar Sesión
                    </button>
                  )}
            </div>
              </div>
            </div>
          </motion.section>
        </AnimatePresence>
      )}

      {/* Componentes Personalizados */}
      <SpiritualCalendar
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        minDate={new Date()}
      />

      <SpiritualTimePicker
        selectedTime={selectedTime}
        onTimeSelect={handleTimeSelect}
        isOpen={showTimePicker}
        onClose={() => setShowTimePicker(false)}
      />
    </div>
  );
};

export default Home;
