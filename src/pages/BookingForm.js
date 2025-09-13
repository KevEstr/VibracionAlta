import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Mail, Phone, Upload, CheckCircle, AlertCircle, X, Sparkles, MapPin } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SlotSelector from '../components/SlotSelector';
import './BookingForm.css';

const BookingForm = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showSlotSelector, setShowSlotSelector] = useState(false);
  const [paymentProof, setPaymentProof] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm();

  const paymentRequired = watch('paymentRequired', false);

  // Función para manejar la búsqueda de slots
  const handleSearchSlots = () => {
    if (selectedDate) {
      setShowSlotSelector(true);
    }
  };

  // Función para manejar la selección de un slot
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  // Función para continuar con el slot seleccionado
  const handleSlotContinue = (slot) => {
    setSelectedSlot(slot);
    setShowSlotSelector(false);
  };

  // Función para volver del selector de slots
  const handleSlotBack = () => {
    setShowSlotSelector(false);
    setSelectedSlot(null);
  };

  // Fechas no disponibles (esto se conectaría con Google Calendar)
  const unavailableDates = [
    new Date(2024, 2, 20), // 20 de marzo
    new Date(2024, 2, 25), // 25 de marzo
  ];

  const onSubmit = async (data) => {
    if (!selectedSlot) {
      alert('Por favor selecciona un horario disponible');
      return;
    }

    setIsSubmitting(true);
    
    // Simular envío a N8N
    try {
      const formData = {
        ...data,
        selectedDate: selectedSlot.day,
        selectedTime: selectedSlot.time,
        slotDuration: selectedSlot.duration,
        paymentProof: paymentProof ? paymentProof.name : null,
        timestamp: new Date().toISOString()
      };

      console.log('Datos enviados a N8N:', formData);
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowSuccess(true);
      reset();
      setSelectedDate(null);
      setSelectedTime('');
      setSelectedSlot(null);
      setPaymentProof(null);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
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

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // No permitir fechas pasadas
    if (date < today) return true;
    
    // No permitir fechas no disponibles
    return unavailableDates.some(unavailableDate => 
      date.getTime() === unavailableDate.getTime()
    );
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

  // Si se está mostrando el selector de slots
  if (showSlotSelector) {
    return (
      <div className="booking-form-page">
        <div className="container">
          <SlotSelector
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSlotSelect={handleSlotSelect}
            onBack={handleSlotBack}
            onContinue={handleSlotContinue}
          />
        </div>
      </div>
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
                      placeholder="+57 300 123 4567"
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

              {/* Selección de Fecha y Hora */}
              <div className="form-section">
                <h3>
                  <Calendar size={20} />
                  Fecha y Hora
                </h3>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Selecciona la Fecha *</label>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Selecciona una fecha"
                      className={`form-control ${!selectedDate ? 'error' : ''}`}
                      filterDate={isDateDisabled}
                      minDate={new Date()}
                      showPopperArrow={false}
                      calendarClassName="custom-calendar"
                    />
                    {!selectedDate && (
                      <div className="error-message">
                        <AlertCircle size={16} />
                        Selecciona una fecha
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Hora Preferida (Opcional)</label>
                    <input
                      type="time"
                      className="form-control"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      placeholder="HH:MM"
                    />
                    <small className="form-help">
                      Si no especificas hora, verás todos los horarios disponibles del día
                    </small>
                  </div>
                </div>

                {/* Botón para buscar horarios */}
                <div className="form-group">
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={handleSearchSlots}
                    disabled={!selectedDate}
                  >
                    <Calendar size={20} />
                    Buscar Horarios Disponibles
                  </button>
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
                          <span>{new Date(selectedSlot.day).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</span>
                        </div>
                        <div className="slot-detail">
                          <Clock size={16} />
                          <span>{selectedSlot.time} ({selectedSlot.duration} min)</span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => {
                        setSelectedSlot(null);
                        setShowSlotSelector(true);
                      }}
                    >
                      Cambiar Horario
                    </button>
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
