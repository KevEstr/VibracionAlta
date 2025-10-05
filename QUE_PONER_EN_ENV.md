# 📋 RESUMEN - QUÉ NECESITAS EN EL .ENV

## 🎯 VALORES QUE NECESITAS

En el archivo `.env` necesitas configurar **2 valores**:

```env
REACT_APP_CLOUDINARY_CLOUD_NAME=tu-cloud-name-aqui
REACT_APP_CLOUDINARY_UPLOAD_PRESET=comprobantes_citas
```

---

## 📍 DE DÓNDE SACAR CADA VALOR

### 1️⃣ REACT_APP_CLOUDINARY_CLOUD_NAME

**Dónde sacarlo:**
1. Ve a: https://console.cloudinary.com/
2. En la parte superior del Dashboard verás "Product Environment Credentials"
3. Ahí dice **"Cloud Name: xxxxx"**
4. Copia ese valor

**Ejemplo real:**
```
Cloud Name: vibracion-alta
```

**En el .env quedaría:**
```env
REACT_APP_CLOUDINARY_CLOUD_NAME=vibracion-alta
```

---

### 2️⃣ REACT_APP_CLOUDINARY_UPLOAD_PRESET

**Dónde sacarlo:**
1. Ve a: https://console.cloudinary.com/
2. Click en Settings (⚙️) arriba a la derecha
3. Click en la pestaña "Upload"
4. Scroll down hasta "Upload presets"
5. Click en "Add upload preset"
6. Configura:
   - **Upload preset name**: `comprobantes_citas` (o el que quieras)
   - **Signing Mode**: **UNSIGNED** (esto es obligatorio)
7. Click "Save"
8. El nombre que pusiste es tu UPLOAD_PRESET

**Ejemplo:**
Si pusiste como nombre: `comprobantes_citas`

**En el .env quedaría:**
```env
REACT_APP_CLOUDINARY_UPLOAD_PRESET=comprobantes_citas
```

---

## ✅ EJEMPLO COMPLETO DEL .ENV

```env
# N8N (ya lo tienes configurado)
REACT_APP_N8N_WEBHOOK_URL=https://vibracionaltacalendar.app.n8n.cloud/webhook-test/ab708bcb-c9e5-456c-9485-c89ad238863b

# CLOUDINARY (lo que necesitas agregar)
REACT_APP_CLOUDINARY_CLOUD_NAME=vibracion-alta
REACT_APP_CLOUDINARY_UPLOAD_PRESET=comprobantes_citas
```

---

## 🔄 DESPUÉS DE CONFIGURAR

1. **Guarda el archivo .env**
2. **Reinicia el servidor:**
   ```powershell
   # Presiona Ctrl+C para detener el servidor
   npm start
   ```

3. **¡Listo!** La funcionalidad de subida de comprobantes estará funcionando

---

## 🎯 QUICK CHECKLIST

Antes de continuar, asegúrate de:

- [ ] Tienes una cuenta en Cloudinary (gratis)
- [ ] Copiaste el Cloud Name del Dashboard
- [ ] Creaste un Upload Preset con modo "Unsigned"
- [ ] Pegaste ambos valores en el .env
- [ ] Guardaste el archivo .env
- [ ] Reiniciaste el servidor con `npm start`

---

## 📚 DOCUMENTACIÓN ADICIONAL

- **Guía rápida**: Ver archivo `GUIA_RAPIDA_CLOUDINARY.md`
- **Guía detallada**: Ver archivo `CLOUDINARY_SETUP.md`

---

## 🆘 AYUDA RÁPIDA

**Problema**: "No se sube el archivo"
**Solución**: Verifica que el Upload Preset esté en modo "Unsigned"

**Problema**: "Error de credenciales"
**Solución**: Verifica que el Cloud Name esté bien escrito (sin espacios)

**Problema**: "Los cambios no se aplican"
**Solución**: Reinicia el servidor (Ctrl+C y luego `npm start`)

---

## 🎉 RESULTADO FINAL

Cuando todo esté configurado, en tu aplicación:

1. Usuario responde "Sí" a "¿Ya pagaste la consulta?"
2. Aparece campo de subida de comprobante
3. Usuario arrastra o selecciona archivo
4. Se sube AUTOMÁTICAMENTE a Cloudinary
5. Se guarda la URL del comprobante
6. ✅ Todo listo!
