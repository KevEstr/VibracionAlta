// Servicio para conectar con n8n webhook (producción)
// Usamos el endpoint de días disponibles en producción
const N8N_WEBHOOK_URL = 'https://vibracionaltacalendario.app.n8n.cloud/webhook-test/api/dias-disponibles';

class N8nService {
  /**
   * Obtiene los slots disponibles del calendario desde n8n (GET - para el calendario)
   * @param {Date} startDate - Fecha de inicio para buscar slots
   * @param {Date} endDate - Fecha de fin para buscar slots
   * @returns {Promise<Array>} Array de slots disponibles
   */
  static async getAvailableSlots(startDate, endDate) {
    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      
      // Manejar la nueva estructura de datos que viene con horarioLaboral, franjas, etc.
      let availableData = [];
      
      if (data.franjas && Array.isArray(data.franjas)) {
        // Nueva estructura: {horarioLaboral, totalFranjas, franjasOcupadas, franjasDisponibles, franjas: [...]}
        availableData = data.franjas;
      } else if (Array.isArray(data) && data.length > 0 && data[0].franjas) {
        // Estructura como array con objeto que contiene franjas: [{horarioLaboral, franjas: [...]}]
        availableData = data[0].franjas;
      } else if (Array.isArray(data) && data.length > 0 && data[0].franja) {
        // Estructura para hora específica: [{fecha, horaConsultada, disponible, franja: {...}, mensaje}]
        availableData = [data[0].franja];
      } else if (Array.isArray(data)) {
        // Estructura anterior: array directo
        availableData = data[0]?.available || data;
      } else if (data.available) {
        // Estructura con propiedad available
        availableData = data.available;
      }
      
      // Transformar la estructura de datos de n8n al formato esperado
      const transformedSlots = this.transformSlotsData(availableData);
      
      return transformedSlots;
    } catch (error) {
      console.error('Error obteniendo slots desde n8n:', error);
      throw error;
    }
  }

  /**
   * Obtiene los slots disponibles con parámetros específicos (POST - para el formulario)
   * @param {string} fecha - Fecha en formato YYYY-MM-DD
   * @param {string} hora - Hora en formato HH:MM o null
   * @returns {Promise<Array>} Array de slots disponibles
   */
  static async getAvailableSlotsWithParams(fecha, hora = null) {
    try {
      const requestData = {
        fecha: fecha, // Formato YYYY-MM-DD
        hora: hora    // Formato HH:MM o null
      };

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('Datos recibidos de n8n:', data);
      
      // Manejar la nueva estructura de datos que viene con horarioLaboral, franjas, etc.
      let availableData = [];
      
      if (data.franjas && Array.isArray(data.franjas)) {
        // Nueva estructura: {horarioLaboral, totalFranjas, franjasOcupadas, franjasDisponibles, franjas: [...]}
        availableData = data.franjas;
        console.log('Usando nueva estructura - franjas encontradas:', availableData.length);
      } else if (Array.isArray(data) && data.length > 0 && data[0].franjas) {
        // Estructura como array con objeto que contiene franjas: [{horarioLaboral, franjas: [...]}]
        availableData = data[0].franjas;
        console.log('Usando estructura de array con franjas:', availableData.length);
      } else if (Array.isArray(data) && data.length > 0 && data[0].franja) {
        // Estructura para hora específica: [{fecha, horaConsultada, disponible, franja: {...}, mensaje}]
        availableData = [data[0].franja];
        console.log('Usando estructura de hora específica - franja encontrada');
      } else if (Array.isArray(data)) {
        // Estructura anterior: array directo
        availableData = data[0]?.available || data;
        console.log('Usando estructura anterior - array directo:', availableData.length);
      } else if (data.available) {
        // Estructura con propiedad available
        availableData = data.available;
        console.log('Usando estructura con propiedad available:', availableData.length);
      }
      
      console.log('Datos a transformar:', availableData);
      
      // Transformar la estructura de datos de n8n al formato esperado
      const transformedSlots = this.transformSlotsData(availableData, fecha);
      
      console.log('Slots transformados:', transformedSlots);
      
      return transformedSlots;
    } catch (error) {
      console.error('Error obteniendo slots con parámetros desde n8n:', error);
      throw error;
    }
  }

  /**
   * Transforma los datos de n8n al formato esperado por el frontend
   * @param {Array} availableData - Datos de n8n con estructura de franjas horarias
   * @param {string} fecha - Fecha en formato YYYY-MM-DD para usar en los slots
   * @returns {Array} Array de slots en formato estándar
   */
  static transformSlotsData(availableData, fecha = null) {
    const slots = [];
    
    // Si availableData es un array de franjas horarias directas
    if (Array.isArray(availableData) && availableData.length > 0) {
      // Verificar si es la estructura de franjas horarias que me mostraste
      if (availableData[0].inicio && availableData[0].fin) {
        // Estructura: [{inicio: "08:00", fin: "08:30", disponible: true, datetime: "..."}, ...]
        availableData.forEach((slot, index) => {
          if (slot.disponible) {
            const [startHour, startMinute] = slot.inicio.split(':').map(Number);
            const [endHour, endMinute] = slot.fin.split(':').map(Number);
            
            // Calcular duración en minutos
            const duration = (endHour - startHour) * 60 + (endMinute - startMinute);
            
            // Usar la fecha proporcionada o la del datetime si está disponible
            let slotDate;
            if (fecha) {
              // Usar la fecha proporcionada en la consulta
              slotDate = new Date(fecha);
            } else if (slot.datetime && slot.datetime !== 'undefinedT08:00:00' && !slot.datetime.includes('undefined')) {
              slotDate = new Date(slot.datetime);
            } else {
              // Si no hay fecha específica, usar la fecha actual
              slotDate = new Date();
            }
            
            // Establecer la hora del slot
            slotDate.setHours(startHour, startMinute, 0, 0);
            
            slots.push({
              date: slotDate.toISOString(),
              time: slot.inicio,
              duration: duration,
              available: slot.disponible,
              day: slotDate.toISOString().split('T')[0]
            });
          }
        });
      } else if (availableData[0].day && availableData[0].available_slots) {
        // Estructura original: {day, available_slots}
        availableData.forEach(dayData => {
          const day = new Date(dayData.day);
          
          dayData.available_slots.forEach(slotRange => {
            const [startTime, endTime] = slotRange.split('-');
            const [startHour, startMinute] = startTime.split(':').map(Number);
            const [endHour, endMinute] = endTime.split(':').map(Number);
            
            // Crear fecha completa para el slot
            const slotDateTime = new Date(day);
            slotDateTime.setHours(startHour, startMinute, 0, 0);
            
            // Calcular duración en minutos
            const duration = (endHour - startHour) * 60 + (endMinute - startMinute);
            
            slots.push({
              date: slotDateTime.toISOString(),
              time: startTime,
              duration: duration,
              available: true,
              day: dayData.day
            });
          });
        });
      }
    }
    
    return slots;
  }

  /**
   * Obtiene los eventos del calendario desde n8n
   * @param {Date} startDate - Fecha de inicio
   * @param {Date} endDate - Fecha de fin
   * @returns {Promise<Array>} Array de eventos del calendario
   */
  static async getCalendarEvents(startDate, endDate) {
    try {
      // Por ahora devolvemos un array vacío ya que tu webhook solo devuelve slots disponibles
      // Si necesitas eventos existentes, tendrías que crear otro webhook o modificar el actual
      return [];
    } catch (error) {
      console.error('Error obteniendo eventos desde n8n:', error);
      throw error;
    }
  }

  /**
   * Crea una nueva cita a través de n8n
   * @param {Object} appointmentData - Datos de la cita
   * @returns {Promise<Object>} Respuesta de la creación
   */
  static async createAppointment(appointmentData) {
    try {
      // Por ahora simulamos la creación de cita
      // Si necesitas crear citas, tendrías que crear otro webhook POST en n8n
      console.log('Creando cita:', appointmentData);
      
      return {
        success: true,
        message: 'Cita creada exitosamente',
        appointmentId: Date.now().toString()
      };
    } catch (error) {
      console.error('Error creando cita en n8n:', error);
      throw error;
    }
  }
}

export default N8nService;
