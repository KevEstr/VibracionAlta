import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TestN8nIntegration from '../components/TestN8nIntegration';
import SimpleDebug from '../components/SimpleDebug';
import WebhookTester from '../components/WebhookTester';
import SlotsGrid from '../components/SlotsGrid';
import './Calendar.css';

const CalendarPage = () => {
  const [showTestComponent, setShowTestComponent] = useState(false);
  const [showSimpleDebug, setShowSimpleDebug] = useState(false);
  const [showWebhookTester, setShowWebhookTester] = useState(false);
  const [showSlotsGrid, setShowSlotsGrid] = useState(true);

  // Ya no necesitamos cargar datos aquí, el SlotsGrid se encarga

  // Las funciones del calendario ya no son necesarias

  return (
    <div className="calendar-page">
      <div className="container">
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-content">
            <div>
          <h1>Calendario de Disponibilidad</h1>
          <p>Visualiza y gestiona todas las citas programadas</p>
            </div>
            <div className="header-actions">
              <button 
                className="btn btn-outline"
                onClick={() => setShowSlotsGrid(!showSlotsGrid)}
              >
                {showSlotsGrid ? 'Ocultar Horarios' : 'Ver Horarios'}
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => setShowWebhookTester(!showWebhookTester)}
              >
                {showWebhookTester ? 'Ocultar Tester' : 'Tester Webhook'}
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => setShowSimpleDebug(!showSimpleDebug)}
              >
                {showSimpleDebug ? 'Ocultar Debug' : 'Debug Simple'}
              </button>
                  <button 
                className="btn btn-outline"
                onClick={() => setShowTestComponent(!showTestComponent)}
                  >
                {showTestComponent ? 'Ocultar Prueba' : 'Probar N8N'}
                  </button>
                </div>
              </div>
            </motion.div>

        {/* Grid de Slots */}
        {showSlotsGrid && (
          <motion.div
            className="slots-container"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SlotsGrid />
          </motion.div>
        )}
              </div>

      {/* Tester Webhook */}
      {showWebhookTester && (
        <motion.div
          className="tester-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <WebhookTester />
        </motion.div>
      )}

      {/* Debug Simple */}
      {showSimpleDebug && (
        <motion.div
          className="debug-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SimpleDebug />
        </motion.div>
      )}

      {/* Componente de prueba de N8N */}
      {showTestComponent && (
        <motion.div
          className="test-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <TestN8nIntegration />
          </motion.div>
      )}
    </div>
  );
};

export default CalendarPage;
