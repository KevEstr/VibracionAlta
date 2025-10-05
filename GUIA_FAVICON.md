# 🎨 GUÍA: Crear Favicon desde logo.jpg

## ✅ **Ya está configurado (Solución Rápida)**

He actualizado `public/index.html` para usar tu `logo.jpg` como favicon. 

**Resultado:** El logo aparecerá en la pestaña del navegador.

---

## 🚀 **Solución PROFESIONAL (Opcional - Mejor calidad)**

Para mejor calidad y compatibilidad, te recomiendo crear iconos optimizados:

### **Opción 1: Usar herramienta online (MÁS FÁCIL)**

1. Ve a: **https://favicon.io/favicon-converter/**
2. Sube tu archivo `logo.jpg`
3. Descarga el paquete generado
4. Reemplaza los archivos en la carpeta `public/`

Los archivos que necesitas:
```
public/
  ├── favicon.ico (16x16, 32x32, 48x48 en uno)
  ├── favicon-16x16.png
  ├── favicon-32x32.png
  ├── apple-touch-icon.png (180x180)
  └── android-chrome-192x192.png
  └── android-chrome-512x512.png
```

### **Opción 2: Crear manualmente con Photoshop/GIMP**

1. Abre `logo.jpg` en tu editor de imágenes
2. Exporta en estos tamaños:
   - **16x16** → favicon-16x16.png
   - **32x32** → favicon-32x32.png
   - **180x180** → apple-touch-icon.png
   - **192x192** → android-chrome-192x192.png
   - **512x512** → android-chrome-512x512.png

3. Usa un conversor online para crear `.ico`:
   - https://convertio.co/es/png-ico/

---

## 📝 **Si generas los iconos optimizados, actualiza el HTML así:**

```html
<head>
  <meta charset="utf-8" />
  
  <!-- Favicons -->
  <link rel="icon" type="image/x-icon" href="%PUBLIC_URL%/favicon.ico" />
  <link rel="icon" type="image/png" sizes="16x16" href="%PUBLIC_URL%/favicon-16x16.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="%PUBLIC_URL%/favicon-32x32.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="%PUBLIC_URL%/apple-touch-icon.png" />
  
  <!-- Android -->
  <link rel="icon" type="image/png" sizes="192x192" href="%PUBLIC_URL%/android-chrome-192x192.png" />
  <link rel="icon" type="image/png" sizes="512x512" href="%PUBLIC_URL%/android-chrome-512x512.png" />
  
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#4d406b" />
  <title>Vibración Alta - Terapia Angelical y Reiki</title>
</head>
```

---

## ✅ **Estado Actual:**

Por ahora, tu página ya tiene el logo en la pestaña usando `logo.jpg` directamente.

**Funciona en:**
- ✅ Chrome/Edge/Firefox (desktop)
- ✅ Safari (desktop)
- ✅ Chrome/Firefox (móvil)
- ⚠️ iOS Safari (puede verse pixelado)

Si quieres mejor calidad en todos los dispositivos, sigue los pasos de "Solución PROFESIONAL".

---

## 🔧 **Para ver los cambios:**

1. Guarda todos los archivos
2. Recarga la página con **Ctrl + Shift + R** (borrar caché)
3. Si no ves el cambio, cierra y vuelve a abrir el navegador
