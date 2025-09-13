# Integración con n8n - Calendario de Citas

Este documento explica cómo configurar n8n para integrar con tu frontend de React y mostrar los slots disponibles del calendario.

## Configuración en n8n

### 1. Crear un Webhook

1. En tu instancia de n8n, crea un nuevo workflow
2. Agrega un nodo **Webhook** como trigger
3. Configura el webhook:
   - **HTTP Method**: GET
   - **Path**: `/calendar-slots` (o el que prefieras)
   - **Response Mode**: "On Received"

**Tu webhook actual:**
```
https://vibracionaltacalendar.app.n8n.cloud/webhook/ab708bcb-c9e5-456c-9485-c89ad238863b
```

### 2. Configurar el flujo de n8n

Tu flujo debería verse así:

```
Webhook → AI Agent/Calendar → Code (filtrado) → Webhook Response
```

#### Nodos necesarios:

1. **Webhook** (Trigger)
   - Recibe las peticiones del frontend
   - Configura para recibir JSON con `startDate`, `endDate`, y `action`

2. **Google Calendar** o **Outlook Calendar**
   - Conecta con tu calendario
   - Obtiene los eventos en el rango de fechas especificado

3. **Code** (JavaScript)
   - Filtra los eventos para encontrar slots disponibles
   - Genera horarios de 8:00 AM a 5:00 PM
   - Excluye horarios ya ocupados

4. **Webhook Response**
   - Devuelve los datos en formato JSON al frontend

### 3. Código de ejemplo para el nodo Code

```javascript
// Obtener datos del webhook
const { startDate, endDate, action } = $input.first().json;

if (action === 'getEvents') {
  // Lógica para obtener eventos existentes
  return {
    events: events // Array de eventos del calendario
  };
}

if (action === 'getSlots') {
  // Lógica para generar slots disponibles
  const slots = generateAvailableSlots(startDate, endDate, existingEvents);
  return {
    slots: slots
  };
}

function generateAvailableSlots(startDate, endDate, events) {
  const slots = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Generar slots de 8:00 AM a 5:00 PM
  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    for (let hour = 8; hour < 17; hour++) {
      const slotTime = new Date(date);
      slotTime.setHours(hour, 0, 0, 0);
      
      // Verificar si el slot está disponible
      const isAvailable = !events.some(event => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        return slotTime >= eventStart && slotTime < eventEnd;
      });
      
      if (isAvailable) {
        slots.push({
          date: slotTime.toISOString(),
          time: `${hour.toString().padStart(2, '0')}:00`,
          duration: 30, // 30 minutos por defecto
          available: true
        });
      }
    }
  }
  
  return slots;
}
```

### 4. Configuración del Webhook Response

```json
{
  "slots": "{{ $json.slots }}",
  "events": "{{ $json.events }}",
  "status": "success",
  "timestamp": "{{ new Date().toISOString() }}"
}
```

## Configuración en el Frontend

### 1. Variables de entorno

Crea un archivo `.env` en la raíz de tu proyecto:

```env
REACT_APP_N8N_WEBHOOK_URL=https://tu-n8n-instance.com/webhook/calendar-slots
```

### 2. Uso del servicio

El servicio `N8nService` ya está configurado para:

- Obtener slots disponibles: `N8nService.getAvailableSlots(startDate, endDate)`
- Obtener eventos del calendario: `N8nService.getCalendarEvents(startDate, endDate)`
- Crear nuevas citas: `N8nService.createAppointment(appointmentData)`

### 3. Ejemplo de uso en un componente

```javascript
import React, { useState, useEffect } from 'react';
import N8nService from '../services/n8nService';

const MyComponent = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7); // Próximos 7 días
      
      const availableSlots = await N8nService.getAvailableSlots(startDate, endDate);
      setSlots(availableSlots);
    } catch (error) {
      console.error('Error fetching slots:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div>
          {slots.map((slot, index) => (
            <div key={index}>
              {slot.time} - {slot.duration} min
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

## Estructura de datos

### Request al webhook

```json
{
  "startDate": "2024-03-15T00:00:00.000Z",
  "endDate": "2024-03-22T23:59:59.999Z",
  "action": "getSlots",
  "timeRange": {
    "start": "08:00",
    "end": "17:00"
  }
}
```

### Response del webhook

```json
{
  "slots": [
    {
      "date": "2024-03-15T08:00:00.000Z",
      "time": "08:00",
      "duration": 30,
      "available": true
    },
    {
      "date": "2024-03-15T08:30:00.000Z",
      "time": "08:30",
      "duration": 30,
      "available": true
    }
  ],
  "events": [
    {
      "id": "event1",
      "title": "Cita existente",
      "start": "2024-03-15T10:00:00.000Z",
      "end": "2024-03-15T10:30:00.000Z",
      "status": "confirmed"
    }
  ],
  "status": "success",
  "timestamp": "2024-03-15T12:00:00.000Z"
}
```

## Próximos pasos

1. Configura tu instancia de n8n con el webhook
2. Actualiza la URL del webhook en tu archivo `.env`
3. Prueba la integración con el frontend
4. Personaliza los horarios y duración según tus necesidades
5. Agrega validaciones adicionales en n8n si es necesario

## Troubleshooting

- Verifica que la URL del webhook sea correcta
- Asegúrate de que n8n esté ejecutándose y accesible
- Revisa los logs de n8n para errores
- Verifica que las credenciales del calendario estén configuradas correctamente
