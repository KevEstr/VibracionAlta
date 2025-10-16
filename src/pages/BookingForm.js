import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, Mail, Phone, Upload, CheckCircle, AlertCircle, X, Sparkles, MapPin } from 'lucide-react';
import './BookingForm.css';

const BookingForm = () => {
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

  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null); // "09:00", "13:30", etc
  const [availableDays, setAvailableDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [isLoadingDays, setIsLoadingDays] = useState(false);
  const [paymentProof, setPaymentProof] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm();

  const paymentRequired = watch('paymentRequired', false);

  // Horarios disponibles fijos
  const timeSlots = [
    { value: "09:00", label: "9:00 AM" },
    { value: "13:30", label: "1:30 PM" },
    { value: "15:30", label: "3:30 PM" },
    { value: "17:30", label: "5:30 PM" }
  ];

  // Función para consultar días disponibles para una hora específica
  const handleTimeSlotSelect = async (timeValue) => {
    setSelectedTimeSlot(timeValue);
    setSelectedDay(null);
    setAvailableDays([]);
    setIsLoadingDays(true);
    setError(null);

    try {
      const response = await fetch(process.env.REACT_APP_N8N_WEBHOOK_URL, {
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
      
      if (data.success && data.dias && Array.isArray(data.dias)) {
        setAvailableDays(data.dias);
      } else {
        throw new Error('Formato de respuesta inválido');
      }
    } catch (error) {
      console.error('Error obteniendo días disponibles:', error);
      setError('No se pudieron cargar los días disponibles. Por favor intenta nuevamente.');
      setAvailableDays([]);
    } finally {
      setIsLoadingDays(false);
    }
  };

  // Función para seleccionar un día específico
  const handleDaySelect = (day) => {
    setSelectedDay(day);
  };

  const onSubmit = async (data) => {
    if (!selectedDay) {
      alert('Por favor selecciona una fecha y hora disponible');
      return;
    }

    setIsSubmitting(true);
    
    // Enviar a N8N
    try {
      const formData = {
        ...data,
        fecha: selectedDay.fecha,
        hora: selectedTimeSlot,
        fechaHoraISO: selectedDay.fechaHoraISO,
        fechaLegible: traducirFecha(selectedDay.fechaLegible),
        diaSemana: selectedDay.diaSemana,
        paymentProof: paymentProof ? paymentProof.name : null,
        timestamp: new Date().toISOString()
      };

      console.log('Datos enviados a N8N:', formData);
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowSuccess(true);
      reset();
      setSelectedTimeSlot(null);
      setSelectedDay(null);
      setAvailableDays([]);
      setPaymentProof(null);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      alert('Hubo un error al reservar tu cita. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentProof(file);
    }
  };

  const removeFile = () => {
    setPaymentProof(null);
  };

  if (showSuccess) {
    return (
      <motion.div
        className="success-container"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="success-card">
          <div className="success-icon">
            <CheckCircle size={64} />
          </div>
          <h2>¡Cita Reservada Exitosamente!</h2>
          <p>
            Tu cita ha sido reservada correctamente. Recibirás un correo de confirmación 
            en los próximos minutos.
          </p>
          <div className="success-actions">
            <button 
              className="btn btn-primary"
              onClick={() => setShowSuccess(false)}
            >
              Reservar Otra Cita
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="booking-form-page">
      <div className="container">
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Reservar Sesión Espiritual</h1>
          <p>Conecta con tu esencia divina a través de la Terapia Angelical y Reiki</p>
        </motion.div>

        <div className="form-container">
          <motion.div
            className="form-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="booking-form">
              {/* Información Personal */}
              <div className="form-section">
                <h3>
                  <User size={20} />
                  Información Personal
                </h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nombre Completo *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.fullName ? 'error' : ''}`}
                      placeholder="Ingresa tu nombre completo"
                      {...register('fullName', { 
                        required: 'El nombre es obligatorio',
                        minLength: {
                          value: 2,
                          message: 'El nombre debe tener al menos 2 caracteres'
                        }
                      })}
                    />
                    {errors.fullName && (
                      <div className="error-message">
                        <AlertCircle size={16} />
                        {errors.fullName.message}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Correo Electrónico *</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'error' : ''}`}
                      placeholder="tu@email.com"
                      {...register('email', { 
                        required: 'El correo es obligatorio',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Ingresa un correo válido'
                        }
                      })}
                    />
                    {errors.email && (
                      <div className="error-message">
                        <AlertCircle size={16} />
                        {errors.email.message}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Número de Celular *</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.phone ? 'error' : ''}`}
                      placeholder="3001234567"
                      {...register('phone', { 
                        required: 'El teléfono es obligatorio',
                        pattern: {
                          value: /^[\+]?[0-9\s\-\(\)]{10,}$/,
                          message: 'Ingresa un número de teléfono válido'
                        }
                      })}
                    />
                    {errors.phone && (
                      <div className="error-message">
                        <AlertCircle size={16} />
                        {errors.phone.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Selección de Hora y Fecha */}
              <div className="form-section">
                <h3>
                  <Clock size={20} />
                  Elige tu momento perfecto
                </h3>

                {/* Selección de Hora */}
                <div className="form-group">
                  <label className="form-label">Selecciona la Hora *</label>
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
                {isLoadingDays && (
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
                    <AlertCircle size={20} />
                    <p>{error}</p>
                  </motion.div>
                )}

                {/* Mostrar días disponibles */}
                {!isLoadingDays && availableDays.length > 0 && (
                  <motion.div
                    className="available-days-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <label className="form-label">
                      Días Disponibles ({availableDays.length}) *
                    </label>
                    <div className="days-grid">
                      {availableDays.map((day, index) => (
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
                            <span>{selectedTimeSlot}</span>
                          </div>
                        </button>
                      ))}
                    </div>
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
                          <span>{timeSlots.find(s => s.value === selectedTimeSlot)?.label}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Información Adicional */}
              <div className="form-section">
                <h3>
                  <Mail size={20} />
                  Información Adicional
                </h3>

                <div className="form-group">
                  <label className="form-label">Motivo de la Cita</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Describe brevemente el motivo de tu cita..."
                    {...register('reason')}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Comentarios Adicionales</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Cualquier información adicional que consideres importante..."
                    {...register('comments')}
                  />
                </div>
              </div>

              {/* Pago */}
              <div className="form-section">
                <h3>
                  <Upload size={20} />
                  Comprobante de Pago
                </h3>

                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="paymentRequired"
                      {...register('paymentRequired')}
                    />
                    <label htmlFor="paymentRequired">
                      ¿Ya realizaste el pago?
                    </label>
                  </div>
                </div>

                {paymentRequired && (
                  <motion.div
                    className="form-group"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="form-label">Subir Comprobante de Pago</label>
                    <div className="file-upload">
                      <input
                        type="file"
                        id="paymentProof"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="file-input"
                      />
                      <label htmlFor="paymentProof" className="file-label">
                        <Upload size={20} />
                        <span>
                          {paymentProof ? paymentProof.name : 'Seleccionar archivo'}
                        </span>
                      </label>
                      {paymentProof && (
                        <button
                          type="button"
                          className="remove-file"
                          onClick={removeFile}
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    <small className="file-help">
                      Formatos aceptados: JPG, PNG, PDF (máx. 5MB)
                    </small>
                  </motion.div>
                )}
              </div>

              {/* Términos y Condiciones */}
              <div className="form-section">
                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="terms"
                      {...register('terms', { required: 'Debes aceptar los términos y condiciones' })}
                    />
                    <label htmlFor="terms">
                      Acepto los <a href="#" className="link">términos y condiciones</a> y la 
                      <a href="#" className="link"> política de privacidad</a> *
                    </label>
                  </div>
                  {errors.terms && (
                    <div className="error-message">
                      <AlertCircle size={16} />
                      {errors.terms.message}
                    </div>
                  )}
                </div>
              </div>

              {/* Botón de Envío */}
              <div className="form-actions">
                <button
                  type="submit"
                  className={`btn btn-primary btn-lg ${isSubmitting ? 'loading' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Calendar size={20} />
                      Reservar Cita
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
