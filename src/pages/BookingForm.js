import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Mail, Phone, Upload, CheckCircle, AlertCircle, X, Sparkles, MapPin } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './BookingForm.css';

const BookingForm = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
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

  // Horarios disponibles (esto se conectaría con tu API)
  const availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  // Fechas no disponibles (esto se conectaría con Google Calendar)
  const unavailableDates = [
    new Date(2024, 2, 20), // 20 de marzo
    new Date(2024, 2, 25), // 25 de marzo
  ];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    // Simular envío a N8N
    try {
      const formData = {
        ...data,
        selectedDate: selectedDate?.toISOString(),
        selectedTime,
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
                    <label className="form-label">Selecciona la Hora *</label>
                    <div className="time-slots">
                      {availableTimes.map((time) => (
                        <button
                          key={time}
                          type="button"
                          className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                          onClick={() => setSelectedTime(time)}
                        >
                          <Clock size={16} />
                          {time}
                        </button>
                      ))}
                    </div>
                    {!selectedTime && (
                      <div className="error-message">
                        <AlertCircle size={16} />
                        Selecciona una hora
                      </div>
                    )}
                  </div>
                </div>
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
