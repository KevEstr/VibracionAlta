import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import './SpiritualCalendar.css';

const SpiritualCalendar = ({ 
  selectedDate, 
  onDateSelect, 
  isOpen, 
  onClose, 
  minDate = new Date() 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

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
        className="calendar-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="calendar-container"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Título del mes */}
          <div className="calendar-title">
            <h3 className="month-title">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
          </div>

          {/* Días de la semana */}
          <div className="weekdays">
            {dayNames.map(day => (
              <div key={day} className="weekday">
                {day}
              </div>
            ))}
          </div>

          {/* Grid de días */}
          <div className="days-grid">
            {days.map((day, index) => {
              const isSelected = isDateSelected(day.date);
              const isDisabled = isDateDisabled(day.date);
              
              return (
                <motion.button
                  key={index}
                  className={`day-btn ${!day.isCurrentMonth ? 'other-month' : ''} ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                  onClick={() => !isDisabled && handleDateClick(day.date)}
                  disabled={isDisabled}
                  whileHover={!isDisabled ? { scale: 1.05 } : {}}
                  whileTap={!isDisabled ? { scale: 0.95 } : {}}
                >
                  <span className="day-number">{day.date.getDate()}</span>
                  {day.isToday && <div className="today-dot" />}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SpiritualCalendar;
