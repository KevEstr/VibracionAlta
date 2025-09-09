import { format, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

// Formatear fechas
export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) ? format(dateObj, formatStr, { locale: es }) : '';
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

// Formatear fecha completa
export const formatFullDate = (date) => {
  return formatDate(date, "EEEE, d 'de' MMMM 'de' yyyy");
};

// Formatear hora
export const formatTime = (time) => {
  if (!time) return '';
  return time;
};

// Formatear fecha y hora
export const formatDateTime = (date, time) => {
  const formattedDate = formatFullDate(date);
  return `${formattedDate} a las ${formatTime(time)}`;
};

// Validar email
export const isValidEmail = (email) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
};

// Validar teléfono
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

// Validar archivo
export const isValidFile = (file, maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']) => {
  if (!file) return { valid: false, message: 'No se seleccionó ningún archivo' };
  
  if (file.size > maxSize) {
    return { valid: false, message: `El archivo es demasiado grande. Máximo ${maxSize / (1024 * 1024)}MB` };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, message: 'Tipo de archivo no permitido' };
  }
  
  return { valid: true, message: '' };
};

// Generar ID único
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Capitalizar primera letra
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Capitalizar cada palabra
export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.split(' ').map(word => capitalize(word)).join(' ');
};

// Truncar texto
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

// Formatear tamaño de archivo
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Obtener color según estado
export const getStatusColor = (status) => {
  const colors = {
    confirmed: '#10b981',
    pending: '#f59e0b',
    cancelled: '#ef4444',
    paid: '#10b981',
    refunded: '#6b7280'
  };
  
  return colors[status] || '#6b7280';
};

// Obtener texto según estado
export const getStatusText = (status) => {
  const texts = {
    confirmed: 'Confirmada',
    pending: 'Pendiente',
    cancelled: 'Cancelada',
    paid: 'Pagada',
    refunded: 'Reembolsada'
  };
  
  return texts[status] || 'Desconocido';
};

// Verificar si es dispositivo móvil
export const isMobile = () => {
  return window.innerWidth <= 768;
};

// Verificar si es tablet
export const isTablet = () => {
  return window.innerWidth > 768 && window.innerWidth <= 1024;
};

// Verificar si es desktop
export const isDesktop = () => {
  return window.innerWidth > 1024;
};

// Obtener breakpoint actual
export const getCurrentBreakpoint = () => {
  const width = window.innerWidth;
  
  if (width <= 480) return 'mobile';
  if (width <= 768) return 'mobile-large';
  if (width <= 1024) return 'tablet';
  if (width <= 1200) return 'desktop';
  return 'large';
};

// Scroll suave
export const smoothScrollTo = (element, offset = 0) => {
  if (!element) return;
  
  const elementPosition = element.offsetTop - offset;
  window.scrollTo({
    top: elementPosition,
    behavior: 'smooth'
  });
};

// Copiar al portapapeles
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true, message: 'Copiado al portapapeles' };
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return { success: false, message: 'Error al copiar' };
  }
};

// Generar URL de descarga
export const generateDownloadUrl = (file) => {
  if (!file) return null;
  
  if (typeof file === 'string') {
    return file; // URL directa
  }
  
  if (file instanceof File) {
    return URL.createObjectURL(file);
  }
  
  return null;
};

// Limpiar URL de objeto
export const revokeObjectURL = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

// Validar formulario
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = data[field];
    
    if (rule.required && (!value || value.trim() === '')) {
      errors[field] = `${field} es obligatorio`;
      return;
    }
    
    if (value && rule.minLength && value.length < rule.minLength) {
      errors[field] = `${field} debe tener al menos ${rule.minLength} caracteres`;
      return;
    }
    
    if (value && rule.maxLength && value.length > rule.maxLength) {
      errors[field] = `${field} debe tener máximo ${rule.maxLength} caracteres`;
      return;
    }
    
    if (value && rule.pattern && !rule.pattern.test(value)) {
      errors[field] = `${field} no tiene un formato válido`;
      return;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Formatear número de teléfono
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remover todos los caracteres no numéricos
  const cleaned = phone.replace(/\D/g, '');
  
  // Formatear según el patrón colombiano
  if (cleaned.length === 10) {
    return `+57 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('57')) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }
  
  return phone; // Retornar original si no coincide con patrones conocidos
};

// Obtener iniciales de un nombre
export const getInitials = (name) => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
};

// Generar color aleatorio para avatar
export const generateAvatarColor = (name) => {
  if (!name) return '#667eea';
  
  const colors = [
    '#667eea', '#764ba2', '#f093fb', '#f5576c',
    '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
    '#ffecd2', '#fcb69f', '#a8edea', '#fed6e3'
  ];
  
  const hash = name.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
};
