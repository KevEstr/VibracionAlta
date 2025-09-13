# Vibración Alta - Frontend React

Un sistema moderno y responsive para la gestión de citas médicas, desarrollado con React y diseñado para integrarse fácilmente con N8N y Google Calendar.

## 🚀 Características

- **Formulario de Reserva**: Interfaz intuitiva para reservar citas con validaciones completas
- **Calendario Interactivo**: Visualización de disponibilidad en tiempo real
- **Gestión de Citas**: Agendar, modificar, cancelar y visualizar citas
- **Comprobante de Pago**: Opción para subir comprobantes de pago
- **Diseño Responsive**: Optimizado para dispositivos móviles y desktop
- **Notificaciones**: Sistema de notificaciones toast
- **Animaciones**: Transiciones suaves con Framer Motion

## 📱 Páginas Incluidas

1. **Inicio** (`/`) - Landing page con información del servicio
2. **Reservar** (`/reservar`) - Formulario de reserva de citas
3. **Calendario** (`/calendario`) - Vista de calendario con disponibilidad
4. **Mis Citas** (`/mis-citas`) - Gestión personal de citas

## 🛠️ Tecnologías Utilizadas

- **React 18** - Framework principal
- **React Router DOM** - Enrutamiento
- **React Hook Form** - Manejo de formularios
- **Framer Motion** - Animaciones
- **React Calendar** - Componente de calendario
- **React DatePicker** - Selector de fechas
- **Lucide React** - Iconos
- **CSS3** - Estilos personalizados

## 📦 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd sistema-citas-frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**
   ```bash
   npm start
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 🔧 Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm build` - Construye la aplicación para producción
- `npm test` - Ejecuta las pruebas
- `npm run eject` - Expone la configuración de webpack

## 📱 Diseño Responsive

El sistema está completamente optimizado para:

- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

### Breakpoints Principales:
- `768px` - Transición a diseño móvil
- `480px` - Optimizaciones para pantallas pequeñas

## 🎨 Características de Diseño

### Paleta de Colores
- **Primario**: Gradiente azul-púrpura (#667eea → #764ba2)
- **Secundario**: Gradiente rosa-rojo (#f093fb → #f5576c)
- **Éxito**: Verde (#10b981)
- **Advertencia**: Amarillo (#f59e0b)
- **Error**: Rojo (#ef4444)

### Tipografía
- **Fuente Principal**: Inter (Google Fonts)
- **Pesos**: 300, 400, 500, 600, 700

### Efectos Visuales
- **Glassmorphism**: Efectos de cristal con backdrop-filter
- **Gradientes**: Fondos y botones con gradientes suaves
- **Sombras**: Sombras suaves y realistas
- **Animaciones**: Transiciones fluidas con Framer Motion

## 🔌 Integración con N8N

El sistema ahora incluye integración completa con N8N para mostrar slots disponibles del calendario de forma visual.

### Características de la Integración

- **Webhook HTTP**: Reemplaza el chat de N8N por un webhook HTTP
- **Slots Disponibles**: Muestra horarios disponibles de 8:00 AM a 5:00 PM
- **Tiempo Real**: Actualización automática de disponibilidad
- **Visual**: Interfaz visual para seleccionar horarios

### Configuración

1. **Variables de Entorno**
   ```env
   REACT_APP_N8N_WEBHOOK_URL=https://tu-n8n-instance.com/webhook/calendar-slots
   ```

2. **Servicio N8N** (`src/services/n8nService.js`)
   - `getAvailableSlots(startDate, endDate)` - Obtiene slots disponibles
   - `getCalendarEvents(startDate, endDate)` - Obtiene eventos del calendario
   - `createAppointment(appointmentData)` - Crea nuevas citas

3. **Flujo de N8N**
   - Webhook → Google Calendar → Code (filtrado) → Webhook Response
   - Importa el archivo `n8n-workflow-example.json` en tu instancia de N8N

### Estructura de Datos

**Request al webhook:**
```json
{
  "startDate": "2024-03-15T00:00:00.000Z",
  "endDate": "2024-03-22T23:59:59.999Z",
  "action": "getSlots"
}
```

**Response del webhook:**
```json
{
  "slots": [
    {
      "date": "2024-03-15T08:00:00.000Z",
      "time": "08:00",
      "duration": 30,
      "available": true
    }
  ],
  "status": "success"
}
```

### Documentación Completa

Ver `N8N_INTEGRATION.md` para instrucciones detalladas de configuración.

## 📅 Integración con Google Calendar

El calendario está preparado para mostrar datos de Google Calendar. Actualmente usa datos mock, pero se puede conectar fácilmente:

```javascript
// En Calendar.js, línea ~25
const fetchAppointments = async () => {
  // Conectar con Google Calendar API
  // const response = await fetch('GOOGLE_CALENDAR_API_ENDPOINT');
  // const appointments = await response.json();
};
```

## 🚀 Despliegue

### Build para Producción
```bash
npm run build
```

### Variables de Entorno
Crear archivo `.env` en la raíz del proyecto:

```env
REACT_APP_N8N_WEBHOOK_URL=tu_webhook_url_aqui
REACT_APP_GOOGLE_CALENDAR_API_KEY=tu_api_key_aqui
REACT_APP_GOOGLE_CALENDAR_ID=tu_calendar_id_aqui
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Header.js       # Navegación principal
│   ├── LoadingSpinner.js
│   └── Toast.js
├── pages/              # Páginas principales
│   ├── Home.js         # Página de inicio
│   ├── BookingForm.js  # Formulario de reserva
│   ├── Calendar.js     # Vista de calendario
│   └── MyAppointments.js # Gestión de citas
├── App.js              # Componente principal
├── App.css             # Estilos globales
├── index.js            # Punto de entrada
└── index.css           # Estilos base
```

## 🎯 Funcionalidades Implementadas

### ✅ Completadas
- [x] Formulario de reserva con validaciones
- [x] Calendario interactivo
- [x] Gestión de citas (CRUD)
- [x] Subida de comprobantes de pago
- [x] Diseño responsive completo
- [x] Animaciones y transiciones
- [x] Sistema de notificaciones
- [x] Filtros y búsqueda
- [x] Estados de carga
- [x] Validaciones de formulario
- [x] **Integración con N8N via Webhook**
- [x] **Visualización de slots disponibles**
- [x] **Servicio para conectar con N8N**
- [x] **Componente de slots disponibles**

### 🔄 Pendientes de Integración
- [ ] Configuración del webhook en N8N
- [ ] Integración con Google Calendar API
- [ ] Sistema de autenticación
- [ ] Base de datos para persistencia
- [ ] Envío de emails de confirmación

## 📞 Soporte

Para soporte técnico o preguntas sobre la implementación, contacta al equipo de desarrollo.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**Desarrollado con ❤️ para facilitar la gestión de citas médicas**
