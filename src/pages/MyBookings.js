import React, { useState } from 'react';
import { Search, Mail, Calendar, Clock, FileText, ExternalLink, ArrowLeft, Loader, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import './MyBookings.css';

const MyBookings = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [deleteModalBooking, setDeleteModalBooking] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [motivoCancelacion, setMotivoCancelacion] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setError('Por favor ingresa un correo electrónico válido');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSearched(false);

    try {
      const response = await fetch('https://vibracionaltacalendario.app.n8n.cloud/webhook/gestionar-citas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accion: 'listar',
          email: email
        })
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setBookings(data.citas || []);
        setSearched(true);
      } else {
        throw new Error('No se pudieron obtener las reservas');
      }
    } catch (error) {
      console.error('Error al consultar reservas:', error);
      setError('No se pudieron cargar tus reservas. Por favor verifica el correo e intenta nuevamente.');
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatFecha = (fechaISO) => {
    try {
      const date = new Date(fechaISO);
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return fechaISO;
    }
  };

  const getDayOfWeek = (fechaISO) => {
    try {
      const date = new Date(fechaISO);
      return date.toLocaleDateString('es-ES', { weekday: 'long' });
    } catch (e) {
      return '';
    }
  };

  const formatFechaLegibleES = (fechaISO) => {
    try {
      const date = new Date(fechaISO);

      const weekday = date.toLocaleDateString('es-ES', { weekday: 'long' });
      const day = String(date.getDate()).padStart(2, '0');
      const month = date.toLocaleDateString('es-ES', { month: 'long' });
      const year = date.getFullYear();

      // Hora en 12h con AM/PM en mayúsculas
      const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      const timeUpper = time.replace('AM', 'AM').replace('PM', 'PM');

      return `${weekday}, ${day} ${month} ${year} - ${timeUpper}`;
    } catch (e) {
      return fechaISO || '';
    }
  };

  // Convertir hora de 24h a 12h con AM/PM
  const formatHora12h = (hora24) => {
    try {
      // Si la hora ya viene en formato 12h con AM/PM, devolverla tal cual
      if (hora24.toLowerCase().includes('am') || hora24.toLowerCase().includes('pm')) {
        return hora24;
      }

      // Extraer hora y minutos (formato esperado: "17:30" o "9:00")
      const [horaStr, minutosStr] = hora24.split(':');
      let hora = parseInt(horaStr, 10);
      const minutos = minutosStr || '00';

      // Determinar AM o PM
      const periodo = hora >= 12 ? 'PM' : 'AM';

      // Convertir a formato 12 horas
      if (hora === 0) {
        hora = 12; // Medianoche
      } else if (hora > 12) {
        hora = hora - 12; // Tarde/noche
      }

      return `${hora}:${minutos} ${periodo}`;
    } catch (e) {
      return hora24;
    }
  };

  // Delete modal helpers
  const openDeleteModal = (booking) => {
    setDeleteModalBooking(booking);
    setDeleteError(null);
    setMotivoCancelacion('');
  };
  
  const closeDeleteModal = () => {
    setDeleteModalBooking(null);
    setDeleteError(null);
    setIsDeleting(false);
    setMotivoCancelacion('');
  };

  const confirmDelete = async () => {
    if (!deleteModalBooking || isDeleting) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch('https://vibracionaltacalendario.app.n8n.cloud/webhook/gestionar-citas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accion: 'cancelar',
          email: email,
          eventId: deleteModalBooking.eventId,
          motivoCancelacion: motivoCancelacion.trim() || 'No especificado',
          // Información completa de la reserva para el correo
          infoReserva: {
            titulo: deleteModalBooking.titulo,
            fecha: deleteModalBooking.fecha,
            hora: deleteModalBooking.hora,
            fechaLegible: deleteModalBooking.fechaLegible,
            fechaISO: deleteModalBooking.fechaISO,
            descripcion: deleteModalBooking.descripcion,
            linkCalendar: deleteModalBooking.linkCalendar
          }
        })
      });

      const data = await response.json();
      console.log('Respuesta del servidor:', data);
      
      // Si la respuesta tiene success: true O tiene un id (respuesta de Gmail exitosa), es éxito
      if (data.success === true || data.id || response.ok) {
        // Cerrar modal inmediatamente
        closeDeleteModal();
        
        // Resetear todo para volver al estado inicial
        setSearched(false);
        setBookings([]);
        setEmail('');
      } else {
        throw new Error(data.mensaje || data.message || 'No se pudo eliminar la reserva');
      }
    } catch (error) {
      console.error('Error al eliminar reserva:', error);
      
      // Solo mostrar error si NO es un error de red después de éxito
      if (error.message && !error.message.includes('Failed to fetch')) {
        setDeleteError(error.message);
        setIsDeleting(false);
      }
    }
  };
  return (
    <div className="my-bookings-page">
      {/* Background Effects */}
      <div className="bookings-background">
        <div className="cosmic-orb orb-1"></div>
        <div className="cosmic-orb orb-2"></div>
        <div className="cosmic-orb orb-3"></div>
      </div>

      <div className="bookings-container">
        {/* Header */}
        <div className="bookings-header">
          <button className="back-button" onClick={onBack}>
            <ArrowLeft size={20} />
            <span>Volver</span>
          </button>

          <div className="bookings-title-wrapper">
            <div className="title-icon">
              <Sparkles size={32} />
            </div>
            <h1 className="bookings-title">Mis Reservas</h1>
            <p className="bookings-subtitle">Consulta todas tus citas programadas</p>
          </div>
        </div>

        {/* Search Form */}
        <div className="search-section">
          <div className="search-card">
            <div className="search-card-header">
              <Mail className="search-header-icon" size={24} />
              <h2>Buscar por Correo Electrónico</h2>
            </div>

            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-wrapper">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="search-input"
                  disabled={isLoading}
                  required
                />
              </div>

              <button
                type="submit"
                className="search-button"
                disabled={isLoading}
              >
                <Search size={20} />
                <span>{isLoading ? 'Buscando...' : 'Buscar Reservas'}</span>
              </button>
            </form>

            {error && (
              <div className="error-message">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {searched && !isLoading && (
          <div className="results-section">
              {bookings.length === 0 ? (
                <div className="no-bookings">
                  <div className="no-bookings-icon"><Calendar size={48} /></div>
                  <h3>No se encontraron reservas</h3>
                  <p>No hay citas registradas con este correo electrónico</p>
                </div>
              ) : (
                <>
                  <div className="results-header">
                    <CheckCircle className="results-icon" size={24} />
                    <h2>Se encontraron {bookings.length} {bookings.length === 1 ? 'reserva' : 'reservas'}</h2>
                  </div>

                  <div className="bookings-grid">
                    {bookings.map((booking, index) => (
                      <div 
                        key={booking.eventId} 
                        className="booking-card-horizontal"
                      >
                        {/* Left Section - Badge & Status */}
                        <div className="booking-badge-section">
                          <div className="booking-number-badge">
                            <span className="badge-hash">#</span>
                            <span className="badge-number">{index + 1}</span>
                          </div>
                          <div className="booking-status-badge">
                            <div className="status-pulse"></div>
                            <span>Confirmada</span>
                          </div>
                        </div>

                        {/* Middle Section - Main Info */}
                        <div className="booking-main-info">
                          <h3 className="booking-service-title">{booking.titulo}</h3>
                          
                          <div className="booking-datetime-grid">
                            <div className="datetime-item">
                              <Calendar className="datetime-icon" size={20} />
                              <div className="datetime-details">
                                <span className="datetime-label">Fecha</span>
                                <span className="datetime-value-secondary">{formatFechaLegibleES(booking.fechaISO)}</span>
                              </div>
                            </div>

                            <div className="datetime-item">
                              <Clock className="datetime-icon" size={20} />
                              <div className="datetime-details">
                                <span className="datetime-label">Hora</span>
                                <span className="datetime-value-primary">{formatHora12h(booking.hora)}</span>
                              </div>
                            </div>

                            {booking.descripcion && (
                              <div className="datetime-item full-width">
                                <FileText className="datetime-icon" size={20} />
                                <div className="datetime-details">
                                  <span className="datetime-label">Descripción</span>
                                  <div className="booking-description-text">
                                    {booking.descripcion.split('\n').map((line, i) => (
                                      <p key={i}>{line}</p>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right Section - Actions */}
                        <div className="booking-actions-section">
                          {booking.linkCalendar && (
                            <a 
                              href={booking.linkCalendar} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="action-btn action-calendar"
                            >
                              <ExternalLink size={16} />
                              <span>Ver en Calendar</span>
                            </a>
                          )}
                          
                          <button 
                            className="action-btn action-delete" 
                            onClick={() => openDeleteModal(booking)}
                          >
                            <AlertCircle size={16} />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

        {/* Delete Modal */}
        {deleteModalBooking && (
            <div className="modal-overlay">
              <div className="modal-card small">
                <h3>Eliminar Cita</h3>
                <p>¿Seguro que deseas eliminar esta cita?</p>
                <p className="delete-warning">Ten en cuenta que está acción no se puede deshacer y en caso que quieras, deberás crear otra cita.</p>

                <div className="modal-field">
                  <label>Motivo de cancelación</label>
                  <textarea 
                    value={motivoCancelacion}
                    onChange={(e) => setMotivoCancelacion(e.target.value)}
                    placeholder="Ej: Cambio de planes, reagendar para otra fecha..."
                    rows={3}
                    disabled={isDeleting}
                    className="motivo-cancelacion-textarea"
                  />
                </div>

                {deleteError && (
                  <div className="error-message">
                    <AlertCircle size={18} />
                    <span>{deleteError}</span>
                  </div>
                )}

                <div className="modal-actions">
                  <button 
                    className="btn" 
                    onClick={closeDeleteModal}
                    disabled={isDeleting}
                  >
                    Cancelar
                  </button>
                  <button 
                    className="btn danger" 
                    onClick={confirmDelete}
                    disabled={isDeleting}
                  >
                    <AlertCircle size={16} />
                    <span>{isDeleting ? 'Eliminando...' : 'Eliminar'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default MyBookings;
