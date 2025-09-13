import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, RefreshCw, Calendar, Clock } from 'lucide-react';

const SimpleDebug = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [rawData, setRawData] = useState(null);

  const testConnection = async () => {
    setIsLoading(true);
    setResult(null);
    setRawData(null);

    try {
      console.log('🔍 Probando conexión...');
      console.log('🌐 URL completa:', process.env.REACT_APP_N8N_WEBHOOK_URL);
      
      // Verificar si la URL está configurada
      if (!process.env.REACT_APP_N8N_WEBHOOK_URL) {
        throw new Error('URL del webhook no configurada. Crea un archivo .env con REACT_APP_N8N_WEBHOOK_URL');
      }

      console.log('📡 Haciendo petición GET...');
      
      const response = await fetch(process.env.REACT_APP_N8N_WEBHOOK_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors' // Agregar modo CORS explícito
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Error response body:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}. Body: ${errorText}`);
      }

      const data = await response.json();
      console.log('📦 Raw data received:', data);
      
      setRawData(data);

      // Analizar los datos
      const available = data.available || [];
      const totalSlots = available.reduce((total, day) => total + (day.available_slots?.length || 0), 0);
      const totalDays = available.length;

      setResult({
        success: true,
        totalSlots,
        totalDays,
        days: available.map(day => ({
          date: day.day,
          slots: day.available_slots?.length || 0
        }))
      });

    } catch (error) {
      console.error('❌ Error completo:', error);
      console.error('❌ Error stack:', error.stack);
      setResult({
        success: false,
        error: error.message,
        details: error.stack
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="simple-debug">
      <div className="debug-header">
        <h3>🔧 Debug de Conexión N8N</h3>
        <button 
          className="btn btn-primary"
          onClick={testConnection}
          disabled={isLoading}
        >
          <RefreshCw size={16} className={isLoading ? 'spinning' : ''} />
          {isLoading ? 'Probando...' : 'Probar Conexión'}
        </button>
      </div>

      {result && (
        <motion.div
          className={`debug-result ${result.success ? 'success' : 'error'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="result-icon">
            {result.success ? <CheckCircle size={24} /> : <XCircle size={24} />}
          </div>
          <div className="result-content">
            <h4>{result.success ? '✅ Conexión Exitosa' : '❌ Error de Conexión'}</h4>
            
            {result.success ? (
              <div className="success-info">
                <div className="stats">
                  <div className="stat">
                    <span className="number">{result.totalDays}</span>
                    <span className="label">Días disponibles</span>
                  </div>
                  <div className="stat">
                    <span className="number">{result.totalSlots}</span>
                    <span className="label">Slots totales</span>
                  </div>
                </div>
                
                <div className="days-list">
                  <h5>📅 Días con disponibilidad:</h5>
                  {result.days.map((day, index) => (
                    <div key={index} className="day-item">
                      <Calendar size={16} />
                      <span className="date">{day.date}</span>
                      <span className="slots">{day.slots} horarios</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="error-info">
                <p><strong>Error:</strong> {result.error}</p>
                {result.details && (
                  <details className="error-details">
                    <summary>Ver detalles técnicos</summary>
                    <pre>{result.details}</pre>
                  </details>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {rawData && (
        <motion.div
          className="raw-data"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h4>📦 Datos Raw del Webhook:</h4>
          <pre>{JSON.stringify(rawData, null, 2)}</pre>
        </motion.div>
      )}

      <div className="debug-info">
        <h4>ℹ️ Información:</h4>
        <ul>
          <li><strong>URL:</strong> {process.env.REACT_APP_N8N_WEBHOOK_URL || 'No configurada'}</li>
          <li><strong>Método:</strong> GET</li>
          <li><strong>Esperado:</strong> {"{ available: [{ day, available_slots }] }"}</li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleDebug;
