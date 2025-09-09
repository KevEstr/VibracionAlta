import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Edit, 
  Trash2, 
  Eye, 
  Upload, 
  Download,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';
import './MyAppointments.css';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Simular datos de citas del usuario
  useEffect(() => {
    const fetchUserAppointments = async () => {
      setLoading(true);
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos de ejemplo
      const mockAppointments = [
        {
          id: 1,
          title: 'Consulta General',
          date: new Date(2024, 2, 15),
          time: '10:00',
          duration: 30,
          status: 'confirmed',
          paymentStatus: 'paid',
          reason: 'Revisión de rutina',
          comments: 'Primera consulta',
          paymentProof: 'comprobante_1.pdf',
          createdAt: new Date(2024, 2, 10),
          updatedAt: new Date(2024, 2, 10)
        },
        {
          id: 2,
          title: 'Seguimiento',
          date: new Date(2024, 2, 20),
          time: '14:30',
          duration: 45,
          status: 'pending',
          paymentStatus: 'pending',
          reason: 'Control de seguimiento',
          comments: 'Necesito subir comprobante de pago',
          paymentProof: null,
          createdAt: new Date(2024, 2, 12),
          updatedAt: new Date(2024, 2, 12)
        },
        {
          id: 3,
          title: 'Primera Consulta',
          date: new Date(2024, 2, 25),
          time: '09:00',
          duration: 60,
          status: 'confirmed',
          paymentStatus: 'paid',
          reason: 'Consulta inicial',
          comments: 'Consulta especializada',
          paymentProof: 'comprobante_3.pdf',
          createdAt: new Date(2024, 2, 14),
          updatedAt: new Date(2024, 2, 14)
        },
        {
          id: 4,
          title: 'Control',
          date: new Date(2024, 2, 18),
          time: '11:00',
          duration: 30,
          status: 'cancelled',
          paymentStatus: 'refunded',
          reason: 'Control de rutina',
          comments: 'Cancelada por motivos personales',
          paymentProof: null,
          createdAt: new Date(2024, 2, 8),
          updatedAt: new Date(2024, 2, 16)
        }
      ];
      
      setAppointments(mockAppointments);
      setFilteredAppointments(mockAppointments);
      setLoading(false);
    };

    fetchUserAppointments();
  }, []);

  // Filtrar citas
  useEffect(() => {
    let filtered = appointments;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(appointment =>
        appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.reason.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(appointment => appointment.status === statusFilter);
    }

    // Filtrar por estado de pago
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(appointment => appointment.paymentStatus === paymentFilter);
    }

    setFilteredAppointments(filtered);
  }, [appointments, searchTerm, statusFilter, paymentFilter]);

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

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return 'Desconocido';
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

  const getPaymentStatusText = (paymentStatus) => {
    switch (paymentStatus) {
      case 'paid':
        return 'Pagada';
      case 'pending':
        return 'Pendiente';
      case 'refunded':
        return 'Reembolsada';
      default:
        return 'Sin Pago';
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    return time;
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleCancelAppointment = (appointmentId) => {
    if (window.confirm('¿Estás seguro de que quieres cancelar esta cita?')) {
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === appointmentId 
            ? { ...appointment, status: 'cancelled', updatedAt: new Date() }
            : appointment
        )
      );
    }
  };

  const handleUploadPaymentProof = (appointmentId) => {
    // Simular subida de archivo
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setAppointments(prev => 
          prev.map(appointment => 
            appointment.id === appointmentId 
              ? { 
                  ...appointment, 
                  paymentProof: file.name,
                  paymentStatus: 'paid',
                  updatedAt: new Date() 
                }
              : appointment
          )
        );
      }
    };
    input.click();
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simular refresh
    setTimeout(() => setLoading(false), 1000);
  };

  if (loading) {
    return (
      <div className="my-appointments-page">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando tus citas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-appointments-page">
      <div className="container">
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-content">
            <div>
              <h1>Mis Citas</h1>
              <p>Gestiona todas tus citas programadas</p>
            </div>
            <button 
              className="btn btn-outline"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw size={20} className={loading ? 'spinning' : ''} />
              Actualizar
            </button>
          </div>
        </motion.div>

        {/* Filtros y Búsqueda */}
        <motion.div
          className="filters-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="filters-card">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Buscar citas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filters">
              <div className="filter-group">
                <label>Estado:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">Todos</option>
                  <option value="confirmed">Confirmadas</option>
                  <option value="pending">Pendientes</option>
                  <option value="cancelled">Canceladas</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Pago:</label>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">Todos</option>
                  <option value="paid">Pagadas</option>
                  <option value="pending">Pendientes</option>
                  <option value="refunded">Reembolsadas</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Lista de Citas */}
        <motion.div
          className="appointments-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {filteredAppointments.length > 0 ? (
            <div className="appointments-grid">
              {filteredAppointments.map((appointment, index) => (
                <motion.div
                  key={appointment.id}
                  className="appointment-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <div className="appointment-header">
                    <div className="appointment-date">
                      <Calendar size={16} />
                      <span>{formatDate(appointment.date)}</span>
                    </div>
                    <div className="appointment-time">
                      <Clock size={16} />
                      <span>{formatTime(appointment.time)}</span>
                    </div>
                  </div>

                  <div className="appointment-content">
                    <h3 className="appointment-title">{appointment.title}</h3>
                    <p className="appointment-reason">{appointment.reason}</p>
                    {appointment.comments && (
                      <p className="appointment-comments">{appointment.comments}</p>
                    )}
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
                      <span>{getStatusText(appointment.status)}</span>
                    </div>
                    
                    <div 
                      className="payment-badge"
                      style={{ 
                        backgroundColor: getPaymentStatusColor(appointment.paymentStatus),
                        color: 'white'
                      }}
                    >
                      {getPaymentStatusText(appointment.paymentStatus)}
                    </div>
                  </div>

                  {appointment.paymentProof && (
                    <div className="payment-proof">
                      <Download size={16} />
                      <span>{appointment.paymentProof}</span>
                    </div>
                  )}

                  <div className="appointment-actions">
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => handleEditAppointment(appointment)}
                    >
                      <Edit size={16} />
                      Editar
                    </button>

                    {appointment.paymentStatus === 'pending' && (
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={() => handleUploadPaymentProof(appointment.id)}
                      >
                        <Upload size={16} />
                        Subir Pago
                      </button>
                    )}

                    {appointment.status !== 'cancelled' && (
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancelAppointment(appointment.id)}
                      >
                        <Trash2 size={16} />
                        Cancelar
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="no-appointments">
              <Calendar size={64} />
              <h3>No hay citas</h3>
              <p>
                {searchTerm || statusFilter !== 'all' || paymentFilter !== 'all'
                  ? 'No se encontraron citas con los filtros aplicados'
                  : 'No tienes citas programadas aún'
                }
              </p>
              {(!searchTerm && statusFilter === 'all' && paymentFilter === 'all') && (
                <button className="btn btn-primary">
                  <Calendar size={20} />
                  Reservar Primera Cita
                </button>
              )}
            </div>
          )}
        </motion.div>

        {/* Modal de Edición */}
        {showModal && selectedAppointment && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Editar Cita</h3>
                <button 
                  className="modal-close"
                  onClick={() => setShowModal(false)}
                >
                  <XCircle size={24} />
                </button>
              </div>
              
              <div className="modal-body">
                <p>Funcionalidad de edición en desarrollo...</p>
                <p>Aquí podrás modificar los detalles de tu cita.</p>
              </div>
              
              <div className="modal-footer">
                <button 
                  className="btn btn-outline"
                  onClick={() => setShowModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
