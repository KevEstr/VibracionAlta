import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';
import './SpiritualCalendar.css';

const SpiritualCalendar = ({ 
  selectedDate, 
  onDateSelect, 
  isOpen, 
  onClose, 
  minDate = new Date() 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState(null);

  // Generar días del mes
  const generateDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Días del mes anterior
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({ date, isCurrentMonth: false, isToday: false });
    }
    
    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === new Date().toDateString();
      days.push({ date, isCurrentMonth: true, isToday });
    }
    
    // Días del mes siguiente
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({ date, isCurrentMonth: false, isToday: false });
    }
    
    return days;
  };

  const days = generateDays();
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const handleDateClick = (date) => {
    if (date >= minDate) {
      onDateSelect(date);
      onClose();
    }
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const isDateSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const isDateDisabled = (date) => {
    return date < minDate;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="spiritual-calendar-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="spiritual-calendar"
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header del Calendario */}
          <div className="calendar-header">
            <button className="calendar-close" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          {/* Navegación del Mes */}
          <div className="calendar-navigation">
            <button 
              className="nav-button"
              onClick={() => navigateMonth(-1)}
            >
              <ChevronLeft size={20} />
            </button>
            
            <h3 className="month-year">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            
            <button 
              className="nav-button"
              onClick={() => navigateMonth(1)}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Días de la Semana */}
          <div className="calendar-weekdays">
            {dayNames.map(day => (
              <div key={day} className="weekday">
                {day}
              </div>
            ))}
          </div>

          {/* Grid de Días */}
          <div className="calendar-grid">
            {days.map((day, index) => {
              const isSelected = isDateSelected(day.date);
              const isDisabled = isDateDisabled(day.date);
              const isHovered = hoveredDate?.toDateString() === day.date.toDateString();
              
              return (
                <motion.button
                  key={index}
                  className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''} ${isHovered ? 'hovered' : ''}`}
                  onClick={() => !isDisabled && handleDateClick(day.date)}
                  onMouseEnter={() => !isDisabled && setHoveredDate(day.date)}
                  onMouseLeave={() => setHoveredDate(null)}
                  disabled={isDisabled}
                  whileHover={!isDisabled ? { scale: 1.1 } : {}}
                  whileTap={!isDisabled ? { scale: 0.95 } : {}}
                >
                  <span className="day-number">{day.date.getDate()}</span>
                  {day.isToday && <div className="today-indicator" />}
                </motion.button>
              );
            })}
          </div>

          {/* Elementos Espirituales Decorativos */}
          <div className="calendar-decorations">
            <motion.div
              className="decoration-1"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              ✨
            </motion.div>
            <motion.div
              className="decoration-2"
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              🌙
            </motion.div>
            <motion.div
              className="decoration-3"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              💫
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SpiritualCalendar;
