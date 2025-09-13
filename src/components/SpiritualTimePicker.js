import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X } from 'lucide-react';
import './SpiritualTimePicker.css';

const SpiritualTimePicker = ({ 
  selectedTime, 
  onTimeSelect, 
  isOpen, 
  onClose 
}) => {
  const [hoveredTime, setHoveredTime] = useState(null);

  // Generar horarios disponibles (cada 30 minutos desde 8:00 AM hasta 8:00 PM)
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 8;
    const endHour = 20;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = `${hour}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
        slots.push({
          value: timeString,
          display: displayTime,
          hour: hour,
          minute: minute
        });
      }
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleTimeClick = (time) => {
    onTimeSelect(time.value);
    onClose();
  };

  const isTimeSelected = (time) => {
    return selectedTime === time.value;
  };

  const isTimeHovered = (time) => {
    return hoveredTime === time.value;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="spiritual-time-picker-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="spiritual-time-picker"
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header del Time Picker */}
          <div className="time-picker-header">
            <div className="time-picker-title">
              <Clock size={20} />
              <span>Selecciona una Hora</span>
            </div>
            <button className="time-picker-close" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          {/* Grid de Horarios */}
          <div className="time-picker-grid">
            {timeSlots.map((time, index) => {
              const isSelected = isTimeSelected(time);
              const isHovered = isTimeHovered(time);
              
              return (
                <motion.button
                  key={time.value}
                  className={`time-slot ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
                  onClick={() => handleTimeClick(time)}
                  onMouseEnter={() => setHoveredTime(time.value)}
                  onMouseLeave={() => setHoveredTime(null)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <span className="time-display">{time.display}</span>
                  {isSelected && (
                    <motion.div
                      className="selected-indicator"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 15, stiffness: 300 }}
                    >
                      ✨
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Elementos Espirituales Decorativos */}
          <div className="time-picker-decorations">
            <motion.div
              className="decoration-1"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 15, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              🌙
            </motion.div>
            <motion.div
              className="decoration-2"
              animate={{ 
                rotate: [360, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 20, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              ⭐
            </motion.div>
            <motion.div
              className="decoration-3"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.3, 1]
              }}
              transition={{ 
                duration: 25, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              💫
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SpiritualTimePicker;
