// Configuración de la aplicación
export const APP_CONFIG = {
  name: 'Vibración Alta',
  version: '1.0.0',
  description: 'Sistema moderno para gestión de citas médicas',
  author: 'Tu Nombre',
  contact: {
    email: 'contacto@vibracionalta.com',
    phone: '+57 300 123 4567'
  }
};

// Configuración de horarios disponibles
export const AVAILABLE_TIMES = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];

// Configuración de duración de citas
export const APPOINTMENT_DURATION = {
  default: 30, // minutos
  options: [15, 30, 45, 60, 90, 120]
};

// Estados de citas
export const APPOINTMENT_STATUS = {
  CONFIRMED: 'confirmed',
  PENDING: 'pending',
  CANCELLED: 'cancelled'
};

// Estados de pago
export const PAYMENT_STATUS = {
  PAID: 'paid',
  PENDING: 'pending',
  REFUNDED: 'refunded'
};

// Configuración de validaciones
export const VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  email: {
    required: true,
    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
  },
  phone: {
    required: true,
    pattern: /^[\+]?[0-9\s\-\(\)]{10,}$/
  },
  file: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
  }
};

// Configuración de notificaciones
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Configuración de animaciones
export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.6
};

// Configuración de breakpoints
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  large: 1200
};

// Configuración de colores
export const COLORS = {
  primary: {
    50: '#f0f2ff',
    100: '#e0e7ff',
    500: '#667eea',
    600: '#5a6fd8',
    700: '#4c51bf',
    900: '#312e81'
  },
  secondary: {
    50: '#fdf2f8',
    100: '#fce7f3',
    500: '#f093fb',
    600: '#ec4899',
    700: '#db2777',
    900: '#831843'
  },
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    900: '#064e3b'
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    900: '#78350f'
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    900: '#7f1d1d'
  }
};

// Configuración de la API (para integración futura)
export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  endpoints: {
    appointments: '/appointments',
    calendar: '/calendar',
    users: '/users',
    payments: '/payments'
  },
  timeout: 10000, // 10 segundos
  retries: 3
};

// Configuración de Google Calendar (para integración futura)
export const GOOGLE_CALENDAR_CONFIG = {
  apiKey: process.env.REACT_APP_GOOGLE_CALENDAR_API_KEY,
  calendarId: process.env.REACT_APP_GOOGLE_CALENDAR_ID,
  scopes: ['https://www.googleapis.com/auth/calendar.readonly']
};

// Configuración de N8N (para integración futura)
export const N8N_CONFIG = {
  webhookUrl: process.env.REACT_APP_N8N_WEBHOOK_URL,
  timeout: 30000, // 30 segundos
  retries: 2
};

// Mensajes de la aplicación
export const MESSAGES = {
  success: {
    appointmentBooked: '¡Cita reservada exitosamente!',
    appointmentUpdated: 'Cita actualizada correctamente',
    appointmentCancelled: 'Cita cancelada correctamente',
    paymentUploaded: 'Comprobante de pago subido correctamente'
  },
  error: {
    networkError: 'Error de conexión. Intenta nuevamente.',
    validationError: 'Por favor, revisa los datos ingresados',
    appointmentNotFound: 'Cita no encontrada',
    paymentUploadFailed: 'Error al subir el comprobante de pago'
  },
  info: {
    loading: 'Cargando...',
    noAppointments: 'No tienes citas programadas',
    noResults: 'No se encontraron resultados'
  }
};

// Configuración de fechas
export const DATE_CONFIG = {
  locale: 'es-ES',
  timeZone: 'America/Bogota',
  format: {
    date: 'dd/MM/yyyy',
    time: 'HH:mm',
    datetime: 'dd/MM/yyyy HH:mm'
  }
};
