import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, RefreshCw, Filter, Search } from 'lucide-react';
import N8nService from '../services/n8nService';

const SlotsGrid = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Cargar slots al montar el componente
  useEffect(() => {
    loadSlots();
  }, []);

  const loadSlots = async () => {
    setLoading(true);
    setError(null);

    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30); // Próximos 30 días

      const availableSlots = await N8nService.getAvailableSlots(startDate, endDate);
      setSlots(availableSlots);
    } catch (err) {
      console.error('Error cargando slots:', err);
      setError('Error al cargar los horarios disponibles');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar slots
  const filteredSlots = slots.filter(slot => {
    const matchesSearch = !searchTerm || 
      slot.time.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slot.day.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !selectedDate || slot.day === selectedDate;
    
    return matchesSearch && matchesDate;
  });

  // Agrupar slots por día
  const groupedSlots = filteredSlots.reduce((groups, slot) => {
    const day = slot.day;
    if (!groups[day]) {
      groups[day] = [];
    }
    groups[day].push(slot);
    return groups;
  }, {});

  // Obtener días únicos para el filtro
  const uniqueDays = [...new Set(slots.map(slot => slot.day))].sort();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSlotClick = (slot) => {
    console.log('Slot seleccionado:', slot);
    // Aquí puedes agregar lógica para reservar el slot
    alert(`Horario seleccionado: ${formatDate(slot.day)} a las ${slot.time}`);
  };

  if (loading) {
    return (
      <div className="slots-grid-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando horarios disponibles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="slots-grid-container">
        <div className="error-container">
          <h3>Error al cargar horarios</h3>
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
    <div className="slots-grid-container">
      {/* Header con controles */}
      <div className="slots-header">
        <div className="header-info">
          <h2>📅 Horarios Disponibles</h2>
          <p>{filteredSlots.length} horarios disponibles</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={loadSlots}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? 'spinning' : ''} />
          Actualizar
        </button>
      </div>

      {/* Filtros */}
      <div className="filters-container">
        <div className="filter-group">
          <Search size={16} />
          <input
            type="text"
            placeholder="Buscar por hora o fecha..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <Calendar size={16} />
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-filter"
          >
            <option value="">Todos los días</option>
            {uniqueDays.map(day => (
              <option key={day} value={day}>
                {formatDate(day)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de slots */}
      <div className="slots-content">
        {Object.keys(groupedSlots).length === 0 ? (
          <div className="no-slots">
            <Calendar size={48} />
            <h3>No hay horarios disponibles</h3>
            <p>No se encontraron horarios con los filtros aplicados</p>
          </div>
        ) : (
          Object.entries(groupedSlots).map(([day, daySlots]) => (
            <motion.div
              key={day}
              className="day-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="day-header">
                <h3 className="day-title">
                  <Calendar size={20} />
                  {formatDate(day)}
                </h3>
                <span className="day-count">
                  {daySlots.length} horarios
                </span>
              </div>
              
              <div className="slots-grid">
                {daySlots.map((slot, index) => (
                  <motion.div
                    key={`${slot.day}-${slot.time}`}
                    className="slot-card"
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
                      Disponible
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default SlotsGrid;
