import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Plus, CheckCircle } from 'lucide-react';

const AvailableSlots = ({ slots, onBookSlot, loading = false }) => {
  if (loading) {
    return (
      <div className="slots-loading">
        <div className="spinner"></div>
        <p>Cargando horarios disponibles...</p>
      </div>
    );
  }

  if (!slots || slots.length === 0) {
    return (
      <div className="no-slots">
        <Clock size={32} />
        <h4>No hay horarios disponibles</h4>
        <p>No hay slots disponibles para esta fecha</p>
      </div>
    );
  }

  return (
    <div className="available-slots">
      <div className="slots-header">
        <h4>Horarios Disponibles</h4>
        <span className="slots-count">{slots.length} disponible{slots.length !== 1 ? 's' : ''}</span>
      </div>
      
      <div className="slots-grid">
        {slots.map((slot, index) => (
          <motion.div
            key={index}
            className="slot-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="slot-time">
              <Clock size={16} />
              {slot.time}
            </div>
            <div className="slot-duration">
              {slot.duration || 30} min
            </div>
            <div className="slot-status">
              <CheckCircle size={14} />
              Disponible
            </div>
            <button 
              className="btn btn-primary btn-sm slot-book-btn"
              onClick={() => onBookSlot && onBookSlot(slot)}
            >
              <Plus size={14} />
              Reservar
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AvailableSlots;
