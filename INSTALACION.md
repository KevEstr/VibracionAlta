# 🚀 Instalación Rápida - Vibración Alta

## ⚡ Inicio Rápido (5 minutos)

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Iniciar la Aplicación
```bash
npm start
```

### 3. Abrir en el Navegador
```
http://localhost:3000
```

¡Listo! 🎉 Vibración Alta está funcionando.

## 📱 Páginas Disponibles

- **Inicio**: `http://localhost:3000/`
- **Reservar**: `http://localhost:3000/reservar`
- **Calendario**: `http://localhost:3000/calendario`
- **Mis Citas**: `http://localhost:3000/mis-citas`

## 🔧 Configuración Avanzada

### Variables de Entorno
1. Copia `env.example` a `.env`
2. Configura tus URLs de N8N y Google Calendar

### Integración con N8N
1. Crea un webhook en N8N
2. Actualiza `REACT_APP_N8N_WEBHOOK_URL` en `.env`
3. Modifica la función de envío en `src/pages/BookingForm.js`

### Integración con Google Calendar
1. Obtén una API key de Google Calendar
2. Actualiza `REACT_APP_GOOGLE_CALENDAR_API_KEY` en `.env`
3. Modifica la función de carga en `src/pages/Calendar.js`

## 📦 Build para Producción

```bash
npm run build
```

Los archivos se generarán en la carpeta `build/`.

## 🎨 Personalización

### Colores
Edita `src/utils/constants.js` para cambiar la paleta de colores.

### Textos
Modifica los textos en `src/utils/constants.js` en la sección `MESSAGES`.

### Horarios
Actualiza `AVAILABLE_TIMES` en `src/utils/constants.js`.

## 🐛 Solución de Problemas

### Error de Dependencias
```bash
rm -rf node_modules package-lock.json
npm install
```

### Puerto Ocupado
```bash
PORT=3001 npm start
```

### Problemas de Build
```bash
npm run build -- --verbose
```

## 📞 Soporte

Si tienes problemas, revisa:
1. La consola del navegador (F12)
2. La terminal donde ejecutas `npm start`
3. El archivo README.md para más detalles

---

**¡Disfruta Vibración Alta! 🎉**
