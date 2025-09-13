import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, RefreshCw, CheckCircle, ArrowLeft } from 'lucide-react';
import N8nService from '../services/n8nService';

const SlotSelector = ({ 
  selectedDate, 
  selectedTime, 
  onSlotSelect, 
  onBack, 
  onContinue 
}) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Cargar slots cuando cambie la fecha o hora
  useEffect(() => {
    if (selectedDate) {
      loadSlots();
    }
  }, [selectedDate, selectedTime]);

  const loadSlots = async () => {
    setLoading(true);
    setError(null);
    setSlots([]);
    setSelectedSlot(null);

    try {
      // Validar que la hora seleccionada esté dentro del rango de trabajo (8 AM - 5 PM)
      if (selectedTime) {
        const [hours, minutes] = selectedTime.split(':').map(Number);
        const selectedHour = hours + minutes / 60;
        
        if (selectedHour < 8 || selectedHour >= 17) {
          setError('Los horarios disponibles son de 8:00 AM a 5:00 PM');
          return;
        }
      }

      // Preparar datos para enviar a n8n
      const requestData = {
        fecha: selectedDate.toISOString().split('T')[0], // Formato YYYY-MM-DD
        hora: selectedTime || null
      };

      console.log('Consultando slots con:', requestData);

      // Usar el servicio de n8n para obtener slots con parámetros
      const transformedSlots = await N8nService.getAvailableSlotsWithParams(requestData.fecha, requestData.hora);
      setSlots(transformedSlots);

    } catch (err) {
      console.error('Error cargando slots:', err);
      setError('Error al cargar los horarios disponibles. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // La transformación de datos ahora se hace en el servicio

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    onSlotSelect(slot);
  };

  const handleContinue = () => {
    if (selectedSlot) {
      onContinue(selectedSlot);
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

  if (loading) {
    return (
      <div className="slot-selector">
        <div className="selector-header">
          <button className="btn btn-outline" onClick={onBack}>
            <ArrowLeft size={16} />
            Volver
          </button>
          <h3>Horarios Disponibles</h3>
        </div>
        
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando horarios disponibles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="slot-selector">
        <div className="selector-header">
          <button className="btn btn-outline" onClick={onBack}>
            <ArrowLeft size={16} />
            Volver
          </button>
          <h3>Horarios Disponibles</h3>
        </div>
        
        <div className="error-container">
          <h4>Error al cargar horarios</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadSlots}>
            <RefreshCw size={16} />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="slot-selector">
      <div className="selector-header">
        <button className="btn btn-outline" onClick={onBack}>
          <ArrowLeft size={16} />
          Volver
        </button>
        <div className="header-info">
          <h3>Horarios Disponibles</h3>
          <p>
            {selectedDate && formatDate(selectedDate.toISOString())}
            {selectedTime && ` • A partir de las ${selectedTime}`}
          </p>
        </div>
        <button className="btn btn-outline" onClick={loadSlots}>
          <RefreshCw size={16} />
          Actualizar
        </button>
      </div>

      <div className="slots-content">
        {slots.length === 0 ? (
          <div className="no-slots">
            <Calendar size={48} />
            <h4>No hay horarios disponibles</h4>
            <p>No se encontraron horarios disponibles para la fecha seleccionada</p>
          </div>
        ) : (
          <div className="slots-grid">
            {slots.map((slot, index) => (
              <motion.div
                key={`${slot.day}-${slot.time}`}
                className={`slot-card ${selectedSlot?.time === slot.time ? 'selected' : ''}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSlotClick(slot)}
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

      {selectedSlot && (
        <motion.div
          className="slot-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="selected-slot-info">
            <h4>Horario seleccionado:</h4>
            <p>
              <Calendar size={16} />
              {formatDate(selectedSlot.day)} a las {selectedSlot.time}
            </p>
          </div>
          <button 
            className="btn btn-primary btn-lg"
            onClick={handleContinue}
          >
            <CheckCircle size={20} />
            Continuar con este horario
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default SlotSelector;
