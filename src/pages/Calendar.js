import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import CalendarComponent from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simular datos de citas (esto se conectaría con Google Calendar)
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos de ejemplo
      const mockAppointments = [
        {
          id: 1,
          title: 'Consulta General',
          client: 'María González',
          date: new Date(2024, 2, 15),
          time: '10:00',
          duration: 30,
          status: 'confirmed',
          paymentStatus: 'paid'
        },
        {
          id: 2,
          title: 'Seguimiento',
          client: 'Carlos Rodríguez',
          date: new Date(2024, 2, 15),
          time: '14:30',
          duration: 45,
          status: 'pending',
          paymentStatus: 'pending'
        },
        {
          id: 3,
          title: 'Primera Consulta',
          client: 'Ana Martínez',
          date: new Date(2024, 2, 16),
          time: '09:00',
          duration: 60,
          status: 'confirmed',
          paymentStatus: 'paid'
        },
        {
          id: 4,
          title: 'Control',
          client: 'Luis Pérez',
          date: new Date(2024, 2, 18),
          time: '11:00',
          duration: 30,
          status: 'cancelled',
          paymentStatus: 'refunded'
        }
      ];
      
      setAppointments(mockAppointments);
      setLoading(false);
    };

    fetchAppointments();
  }, []);

  const getAppointmentsForDate = (date) => {
    return appointments.filter(appointment => 
      appointment.date.toDateString() === date.toDateString()
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={16} />;
      case 'pending':
        return <Clock size={16} />;
      case 'cancelled':
        return <XCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus) {
      case 'paid':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'refunded':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const formatTime = (time) => {
    return time;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayAppointments = getAppointmentsForDate(date);
      if (dayAppointments.length > 0) {
        return (
          <div className="calendar-day-content">
            <div className="appointment-indicator">
              {dayAppointments.length} cita{dayAppointments.length > 1 ? 's' : ''}
            </div>
          </div>
        );
      }
    }
    return null;
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dayAppointments = getAppointmentsForDate(date);
      if (dayAppointments.length > 0) {
        return 'has-appointments';
      }
    }
    return null;
  };

  const selectedDateAppointments = getAppointmentsForDate(selectedDate);

  if (loading) {
    return (
      <div className="calendar-page">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando calendario...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-page">
      <div className="container">
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Calendario de Disponibilidad</h1>
          <p>Visualiza y gestiona todas las citas programadas</p>
        </motion.div>

        <div className="calendar-container">
          <div className="calendar-grid">
            {/* Calendario Principal */}
            <motion.div
              className="calendar-card"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="calendar-header">
                <h3>Calendario</h3>
                <div className="calendar-controls">
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => setView(view === 'month' ? 'year' : 'month')}
                  >
                    {view === 'month' ? 'Vista Anual' : 'Vista Mensual'}
                  </button>
                </div>
              </div>
              
              <div className="calendar-wrapper">
                <CalendarComponent
                  onChange={setSelectedDate}
                  value={selectedDate}
                  view={view}
                  tileContent={tileContent}
                  tileClassName={tileClassName}
                  className="custom-calendar"
                  locale="es"
                />
              </div>
            </motion.div>

            {/* Panel de Citas del Día */}
            <motion.div
              className="appointments-panel"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="panel-header">
                <h3>
                  <Clock size={20} />
                  Citas del {formatDate(selectedDate)}
                </h3>
                <span className="appointment-count">
                  {selectedDateAppointments.length} cita{selectedDateAppointments.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="appointments-list">
                {selectedDateAppointments.length > 0 ? (
                  selectedDateAppointments.map((appointment) => (
                    <motion.div
                      key={appointment.id}
                      className="appointment-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -2 }}
                    >
                      <div className="appointment-header">
                        <div className="appointment-time">
                          <Clock size={16} />
                          {formatTime(appointment.time)}
                        </div>
                        <div className="appointment-duration">
                          {appointment.duration} min
                        </div>
                      </div>
                      
                      <div className="appointment-content">
                        <h4 className="appointment-title">{appointment.title}</h4>
                        <p className="appointment-client">{appointment.client}</p>
                      </div>

                      <div className="appointment-status">
                        <div 
                          className="status-badge"
                          style={{ 
                            backgroundColor: getStatusColor(appointment.status),
                            color: 'white'
                          }}
                        >
                          {getStatusIcon(appointment.status)}
                          <span>
                            {appointment.status === 'confirmed' ? 'Confirmada' :
                             appointment.status === 'pending' ? 'Pendiente' :
                             appointment.status === 'cancelled' ? 'Cancelada' : 'Desconocido'}
                          </span>
                        </div>
                        
                        <div 
                          className="payment-badge"
                          style={{ 
                            backgroundColor: getPaymentStatusColor(appointment.paymentStatus),
                            color: 'white'
                          }}
                        >
                          {appointment.paymentStatus === 'paid' ? 'Pagada' :
                           appointment.paymentStatus === 'pending' ? 'Pendiente' :
                           appointment.paymentStatus === 'refunded' ? 'Reembolsada' : 'Sin Pago'}
                        </div>
                      </div>

                      <div className="appointment-actions">
                        <button className="btn btn-outline btn-sm">
                          Editar
                        </button>
                        <button className="btn btn-danger btn-sm">
                          Cancelar
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="no-appointments">
                    <Calendar size={48} />
                    <h4>No hay citas programadas</h4>
                    <p>No hay citas programadas para esta fecha</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Estadísticas Rápidas */}
          <motion.div
            className="stats-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon confirmed">
                  <CheckCircle size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-number">
                    {appointments.filter(a => a.status === 'confirmed').length}
                  </div>
                  <div className="stat-label">Confirmadas</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon pending">
                  <Clock size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-number">
                    {appointments.filter(a => a.status === 'pending').length}
                  </div>
                  <div className="stat-label">Pendientes</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon paid">
                  <CheckCircle size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-number">
                    {appointments.filter(a => a.paymentStatus === 'paid').length}
                  </div>
                  <div className="stat-label">Pagadas</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon total">
                  <Calendar size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-number">{appointments.length}</div>
                  <div className="stat-label">Total Citas</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
