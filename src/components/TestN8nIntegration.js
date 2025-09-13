import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import N8nService from '../services/n8nService';

const TestN8nIntegration = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testResult, setTestResult] = useState(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setTestResult(null);
    setSlots([]);

    try {
      console.log('🔍 Probando conexión con n8n...');
      console.log('📡 URL:', process.env.REACT_APP_N8N_WEBHOOK_URL);
      
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);

      const availableSlots = await N8nService.getAvailableSlots(startDate, endDate);
      
      console.log('✅ Respuesta recibida:', availableSlots);
      
      setSlots(availableSlots);
      setTestResult({
        success: true,
        message: `¡Conexión exitosa! Se obtuvieron ${availableSlots.length} slots disponibles`,
        slotsCount: availableSlots.length,
        daysCount: new Set(availableSlots.map(slot => slot.day)).size
      });

    } catch (err) {
      console.error('❌ Error en la prueba:', err);
      setError(err.message);
      setTestResult({
        success: false,
        message: `Error: ${err.message}`
      });
    } finally {
      setLoading(false);
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

  const groupSlotsByDay = (slots) => {
    const grouped = {};
    slots.forEach(slot => {
      const day = slot.day || new Date(slot.date).toISOString().split('T')[0];
      if (!grouped[day]) {
        grouped[day] = [];
      }
      grouped[day].push(slot);
    });
    return grouped;
  };

  const groupedSlots = groupSlotsByDay(slots);

  return (
    <div className="test-n8n-integration">
      <div className="test-header">
        <h2>Prueba de Integración con N8N</h2>
        <p>Verifica que la conexión con tu webhook de n8n funcione correctamente</p>
        
        <button 
          className="btn btn-primary"
          onClick={testConnection}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? 'spinning' : ''} />
          {loading ? 'Probando...' : 'Probar Conexión'}
        </button>
      </div>

      {testResult && (
        <motion.div
          className={`test-result ${testResult.success ? 'success' : 'error'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="result-icon">
            {testResult.success ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          </div>
          <div className="result-content">
            <h4>{testResult.success ? '¡Conexión Exitosa!' : 'Error de Conexión'}</h4>
            <p>{testResult.message}</p>
            {testResult.success && (
              <div className="success-stats">
                <div className="stat-item">
                  <span className="stat-number">{testResult.slotsCount}</span>
                  <span className="stat-label">Slots disponibles</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{testResult.daysCount}</span>
                  <span className="stat-label">Días con disponibilidad</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div
          className="error-details"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h4>Detalles del Error:</h4>
          <pre>{error}</pre>
        </motion.div>
      )}

      {slots.length > 0 && (
        <motion.div
          className="slots-display"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="slots-header">
            <h3>📅 Días con Disponibilidad</h3>
            <div className="summary-badge">
              {Object.keys(groupedSlots).length} día{Object.keys(groupedSlots).length !== 1 ? 's' : ''} disponible{Object.keys(groupedSlots).length !== 1 ? 's' : ''}
            </div>
          </div>
          
          {Object.entries(groupedSlots).map(([day, daySlots]) => (
            <div key={day} className="day-group">
              <div className="day-header">
                <h4 className="day-title">
                  <Clock size={16} />
                  {formatDate(day)}
                </h4>
                <div className="day-stats">
                  <span className="slots-count">{daySlots.length} horarios</span>
                  <span className="time-range">
                    {daySlots[0]?.time} - {daySlots[daySlots.length - 1]?.time}
                  </span>
                </div>
              </div>
              <div className="slots-grid">
                {daySlots.map((slot, index) => (
                  <div key={index} className="slot-item">
                    <span className="slot-time">{slot.time}</span>
                    <span className="slot-duration">{slot.duration} min</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      <div className="test-info">
        <h4>Información de la Prueba:</h4>
        <ul>
          <li><strong>URL del Webhook:</strong> {process.env.REACT_APP_N8N_WEBHOOK_URL || 'No configurada'}</li>
          <li><strong>Método:</strong> GET</li>
          <li><strong>Estructura esperada:</strong> {"{ available: [{ day, available_slots }] }"}</li>
        </ul>
      </div>
    </div>
  );
};

export default TestN8nIntegration;
