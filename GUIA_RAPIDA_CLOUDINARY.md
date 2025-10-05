# 🚀 GUÍA RÁPIDA - Configuración Cloudinary en 5 Minutos

## ⚡ PASO A PASO SUPER RÁPIDO

### 1️⃣ CREAR CUENTA (2 minutos)
```
👉 Ve aquí: https://cloudinary.com/users/register/free
📧 Regístrate con tu email
✅ Verifica tu email
```

### 2️⃣ COPIAR CLOUD NAME (30 segundos)
```
👉 Ve al Dashboard: https://console.cloudinary.com/
📋 Busca "Product Environment Credentials" en la parte superior
📝 Copia el "Cloud Name" (ejemplo: vibracion-alta)
```

### 3️⃣ CREAR UPLOAD PRESET (2 minutos)
```
👉 Click en Settings (⚙️) arriba a la derecha
👉 Click en pestaña "Upload"
👉 Scroll down a "Upload presets"
👉 Click "Add upload preset"

⚙️ CONFIGURACIÓN IMPORTANTE:
   ✅ Upload preset name: comprobantes_citas
   ✅ Signing Mode: UNSIGNED (esto es CRÍTICO)
   ✅ Folder: comprobantes/
   
👉 Click "Save"
```

### 4️⃣ CONFIGURAR .ENV (30 segundos)
```
👉 Abre el archivo .env en la raíz del proyecto
👉 Reemplaza estos dos valores:

REACT_APP_CLOUDINARY_CLOUD_NAME=tu-cloud-name-aqui
REACT_APP_CLOUDINARY_UPLOAD_PRESET=comprobantes_citas

📝 EJEMPLO:
REACT_APP_CLOUDINARY_CLOUD_NAME=vibracion-alta
REACT_APP_CLOUDINARY_UPLOAD_PRESET=comprobantes_citas

💾 GUARDA el archivo
```

### 5️⃣ REINICIAR SERVIDOR (30 segundos)
```powershell
# Detén el servidor con Ctrl+C en la terminal
# Luego ejecuta:
npm start
```

---

## ✅ LISTO! Así de simple

Ahora cuando alguien responda "Sí" a "¿Ya pagaste la consulta?", aparecerá el campo para subir el comprobante y se subirá automáticamente a Cloudinary.

---

## 📍 RECORDATORIOS IMPORTANTES

### ❌ Si NO funciona, verifica:
1. ✅ El Cloud Name está bien escrito (sin espacios)
2. ✅ El Upload Preset existe y está como "Unsigned"
3. ✅ Guardaste el archivo .env
4. ✅ Reiniciaste el servidor después de editar .env

### 🎯 Dónde encontrar tus valores:

| Valor | Dónde encontrarlo |
|-------|-------------------|
| **Cloud Name** | Dashboard > Product Environment Credentials |
| **Upload Preset** | Settings > Upload > Upload presets |

---

## 🎨 VISTA PREVIA

Así se verá en tu app:

```
┌─────────────────────────────────────────┐
│ ¿Ya pagaste la consulta?                │
│ ● Sí  ○ No                              │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │  📁 Subir Comprobante               │ │
│ │                                     │ │
│ │  [Arrastra tu archivo aquí]        │ │
│ │  o haz clic para seleccionar       │ │
│ │                                     │ │
│ │  JPG, PNG, PDF (máx. 5MB)          │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 🆘 ¿NECESITAS AYUDA?

Si tienes problemas, revisa el archivo `CLOUDINARY_SETUP.md` que tiene instrucciones más detalladas.

---

## 🎉 ¡DISFRUTA TU NUEVA FUNCIONALIDAD!

Los comprobantes se guardarán automáticamente en:
```
cloudinary.com > tu-cloud-name > comprobantes/
```

Y podrás verlos en cualquier momento desde tu Dashboard de Cloudinary.
