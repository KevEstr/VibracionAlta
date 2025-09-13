# Configuración Rápida - N8N + React

## 🚀 Pasos Rápidos

### 1. Configurar N8N

1. **Importar el workflow**
   - Abre tu instancia de n8n
   - Ve a "Workflows" → "Import from file"
   - Selecciona el archivo `n8n-workflow-example.json`

2. **Configurar credenciales**
   - Configura las credenciales de Google Calendar en el nodo "Get Calendar Events"
   - Activa el workflow

3. **Obtener la URL del webhook**
   - Copia la URL del webhook (algo como: `https://tu-n8n.com/webhook/calendar-slots`)

### 2. Configurar React

1. **Crear archivo .env**
   ```bash
   cp env.example .env
   ```

2. **Editar .env**
   ```env
   REACT_APP_N8N_WEBHOOK_URL=https://tu-n8n.com/webhook/calendar-slots
   ```

3. **Instalar dependencias**
   ```bash
   npm install
   ```

4. **Iniciar la aplicación**
   ```bash
   npm start
   ```

### 3. Probar la Integración

1. Ve a `http://localhost:3000/calendario`
2. Haz clic en "Actualizar" para cargar los slots desde N8N
3. Los slots disponibles aparecerán en el panel derecho

## 🔧 Solución de Problemas

### Error: "Failed to fetch"
- Verifica que la URL del webhook sea correcta
- Asegúrate de que N8N esté ejecutándose
- Revisa la consola del navegador para más detalles

### No aparecen slots
- Verifica que el workflow de N8N esté activo
- Revisa los logs de N8N
- Asegúrate de que las credenciales de Google Calendar estén configuradas

### Error de CORS
- Si usas N8N local, asegúrate de que esté configurado para aceptar requests desde localhost:3000

## 📝 Próximos Pasos

1. Personaliza los horarios de trabajo en el código de N8N
2. Agrega validaciones adicionales
3. Implementa la creación de citas desde el frontend
4. Agrega notificaciones por email

## 📚 Documentación Completa

Para más detalles, consulta `N8N_INTEGRATION.md`
