# Consulta de Reservas - Nueva Funcionalidad

## 📋 Descripción
Se ha agregado una nueva funcionalidad para que los usuarios puedan consultar sus reservas existentes mediante su correo electrónico.

## ✨ Características

### Página Principal (Home.js)
- **Nuevo botón "Consultar Reservas"** al lado del botón "Reservar Sesión"
- Diseño responsive que se adapta perfectamente a móvil y PC
- Animaciones suaves con Framer Motion
- Estilos diferenciados: botón primario (Reservar) y secundario (Consultar)

### Nueva Página: MyBookings.js
- **Búsqueda por email**: Los usuarios ingresan su correo electrónico
- **Listado de reservas**: Muestra todas las citas asociadas al email
- **Diseño espectacular**: 
  - Background con orbes cósmicos animados
  - Tarjetas (cards) para cada reserva con efectos hover
  - Indicador de estado "Confirmada" con animación pulse
  - Botón para volver al inicio
- **Información detallada de cada reserva**:
  - Número de reserva
  - Título de la consulta
  - Fecha y hora formateadas
  - Descripción completa
  - Link a Google Calendar (si está disponible)

## 🔌 Integración API

### Endpoint
```
POST https://vibracionaltacalendario.app.n8n.cloud/webhook-test/gestionar-citas
```

### Request Body
```json
{
  "accion": "listar",
  "email": "usuario@ejemplo.com"
}
```

### Response Expected
```json
{
  "success": true,
  "email": "usuario@ejemplo.com",
  "totalCitas": 1,
  "citas": [
    {
      "eventId": "po6borl50l7ccru8buhn8sb2s0",
      "titulo": "Consulta - Nombre del Paciente",
      "fecha": "2025-10-06",
      "hora": "11:00",
      "fechaLegible": "Monday, 06 October 2025 - 11:00 AM",
      "fechaISO": "2025-10-06T11:00:00-05:00",
      "descripcion": "Detalles de la cita...",
      "linkCalendar": "https://www.google.com/calendar/event?eid=..."
    }
  ]
}
```

## 🎨 Diseño Responsive

### Desktop
- Botones lado a lado
- Grid de 2-3 columnas para las tarjetas de reservas
- Animaciones y efectos hover completos

### Tablet
- Botones lado a lado con espacio reducido
- Grid de 2 columnas para las tarjetas

### Mobile
- Botones apilados verticalmente
- Una columna para las tarjetas
- Diseño optimizado para pantallas pequeñas
- Touch-friendly con tamaños de botón más grandes

## 🚀 Componentes Añadidos

### Archivos Nuevos
1. `src/pages/MyBookings.js` - Componente principal de consulta de reservas
2. `src/pages/MyBookings.css` - Estilos espectaculares para la página

### Archivos Modificados
1. `src/pages/Home.js` - Añadido botón y estado para MyBookings
2. `src/pages/Home.css` - Añadidos estilos para hero-buttons y botones primary/secondary

## 💫 Características Especiales

### Animaciones
- Entrada suave de elementos con Framer Motion
- Efectos hover en tarjetas con elevación
- Spinner de carga durante búsqueda
- Orbes cósmicos en background con movimiento infinito
- Dot pulsante en el estado "Confirmada"

### UX/UI
- Mensajes de error claros y amigables
- Estado de "No se encontraron reservas"
- Loading state durante búsqueda
- Validación de email
- Diseño consistente con el tema espiritual del sitio

## 🎯 Cómo Usar

1. Usuario hace clic en "Consultar Reservas" en la página principal
2. Ingresa su correo electrónico
3. Hace clic en "Buscar Reservas"
4. Ve todas sus reservas con información detallada
5. Puede hacer clic en el link de Google Calendar para cada reserva
6. Puede volver al inicio con el botón "Volver"

---

**Hecho con ❤️ y ✨ vibraciones espirituales**
