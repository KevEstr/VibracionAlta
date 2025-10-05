# 📋 DOCUMENTACIÓN - Variable comprobanteUrl y JSON enviado a N8N

## 🎯 RESUMEN

El sistema ahora captura el link de Cloudinary cuando el usuario sube un comprobante y lo envía automáticamente en el JSON a n8n al agendar la cita.

---

## 🔍 VARIABLE: `comprobanteUrl`

### **Declaración:**
```javascript
const [comprobanteUrl, setComprobanteUrl] = useState(null);
```

### **Tipo de dato:**
- `null` - Cuando NO se ha subido ningún comprobante
- `string` - URL completa de Cloudinary cuando SÍ se subió un comprobante

### **Ejemplo de valor cuando SE SUBE un archivo:**
```javascript
comprobanteUrl = "https://res.cloudinary.com/dyvgbo5jo/image/upload/v1759632987/comprobantes_pago/qo6oxukygrf78gpqzxca.jpg"
```

### **Ejemplo de valor cuando NO se sube archivo:**
```javascript
comprobanteUrl = null
```

---

## 📤 JSON ENVIADO A N8N

### **CASO 1: Usuario SÍ subió comprobante**

Cuando el usuario responde "Sí" a "¿Ya pagaste?" y sube un archivo:

```json
{
  "nombre": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "celular": "+57 300 123 4567",
  "motivo": "Consulta de tarot y sanación",
  "esPrimeraVez": "Sí",
  "yaPago": "Sí",
  "fechaHoraISO": "2025-10-05T09:00:00.000Z",
  "comprobanteUrl": "https://res.cloudinary.com/dyvgbo5jo/image/upload/v1759632987/comprobantes_pago/qo6oxukygrf78gpqzxca.jpg"
}
```

### **CASO 2: Usuario NO subió comprobante**

Cuando el usuario responde "No" a "¿Ya pagaste?" o no sube archivo:

```json
{
  "nombre": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "celular": "+57 300 123 4567",
  "motivo": "Consulta de tarot y sanación",
  "esPrimeraVez": "Sí",
  "yaPago": "No",
  "fechaHoraISO": "2025-10-05T09:00:00.000Z"
}
```

**Nota:** El campo `comprobanteUrl` NO se incluye en el JSON si no existe (es más limpio así).

---

## 🔄 FLUJO COMPLETO

### **1. Usuario sube archivo**
```javascript
handleComprobanteUpload(event)
  ↓
Archivo se sube a Cloudinary
  ↓
Cloudinary responde con: { secure_url: "https://res.cloudinary.com/..." }
  ↓
setComprobanteUrl(data.secure_url)
  ↓
comprobanteUrl = "https://res.cloudinary.com/dyvgbo5jo/image/upload/v1759632987/comprobantes_pago/qo6oxukygrf78gpqzxca.jpg"
```

### **2. Usuario envía formulario**
```javascript
submitForm()
  ↓
Se construye dataToSend:
  - Incluye todos los campos básicos
  - Si comprobanteUrl existe, se agrega al JSON
  ↓
Se envía a: https://vibracionaltacalendario.app.n8n.cloud/webhook/agendar-cita
  ↓
N8N recibe el JSON con el comprobanteUrl
```

---

## 💻 CÓDIGO RELEVANTE

### **Donde se captura el link de Cloudinary:**
```javascript
// En handleComprobanteUpload, línea ~110
const data = await response.json();
setComprobanteUrl(data.secure_url);  // ← Aquí se guarda el link
console.log('Comprobante subido exitosamente:', data.secure_url);
```

### **Donde se agrega al JSON para n8n:**
```javascript
// En submitForm, línea ~235
const dataToSend = {
  nombre: formData.name,
  email: formData.email,
  celular: formData.phone,
  motivo: formData.motivo || 'No especificado',
  esPrimeraVez: formData.primeraConsulta === true ? 'Sí' : formData.primeraConsulta === false ? 'No' : 'No especificado',
  yaPago: formData.yaPago === true ? 'Sí' : 'No',
  fechaHoraISO: selectedDay.fechaHoraISO
};

// Solo agregar comprobanteUrl si existe (si se subió un archivo)
if (comprobanteUrl) {
  dataToSend.comprobanteUrl = comprobanteUrl;  // ← Aquí se agrega al JSON
}
```

---

## 🎨 FORMATO DEL LINK DE CLOUDINARY

### **Estructura típica:**
```
https://res.cloudinary.com/{cloud_name}/{resource_type}/{type}/v{version}/{folder}/{public_id}.{format}
```

### **Ejemplo real desglosado:**
```
https://res.cloudinary.com/dyvgbo5jo/image/upload/v1759632987/comprobantes_pago/qo6oxukygrf78gpqzxca.jpg
│                           │         │     │      │          │                    │                           │
│                           │         │     │      │          │                    │                           └─ Formato
│                           │         │     │      │          │                    └─ ID único del archivo
│                           │         │     │      │          └─ Carpeta en Cloudinary
│                           │         │     │      └─ Versión (timestamp)
│                           │         │     └─ Tipo de acción (upload)
│                           │         └─ Tipo de recurso (image)
│                           └─ Tu Cloud Name
└─ Dominio de Cloudinary
```

---

## ✅ VALIDACIONES

### **El sistema valida:**
1. ✅ Tipo de archivo (JPG, PNG, WEBP, PDF)
2. ✅ Tamaño máximo (5MB)
3. ✅ Subida exitosa a Cloudinary
4. ✅ URL válida generada

### **Estados posibles de comprobanteUrl:**
- `null` → No se ha subido nada
- `"https://res.cloudinary.com/..."` → Archivo subido exitosamente

---

## 🔍 CÓMO VERIFICAR EN N8N

En tu workflow de n8n, recibirás el JSON con el campo `comprobanteUrl`:

```javascript
// En n8n, puedes acceder al comprobante así:
const comprobanteUrl = $json.comprobanteUrl;

// Si existe, puedes:
if (comprobanteUrl) {
  // Guardar en base de datos
  // Enviar por email
  // Procesarlo
  console.log('Comprobante recibido:', comprobanteUrl);
} else {
  console.log('No se proporcionó comprobante');
}
```

---

## 📊 EJEMPLO COMPLETO DE PETICIÓN

### **Headers:**
```
POST /webhook/agendar-cita HTTP/1.1
Host: vibracionaltacalendario.app.n8n.cloud
Content-Type: application/json
```

### **Body (con comprobante):**
```json
{
  "nombre": "María González",
  "email": "maria@ejemplo.com",
  "celular": "+57 310 555 1234",
  "motivo": "Consulta espiritual",
  "esPrimeraVez": "No",
  "yaPago": "Sí",
  "fechaHoraISO": "2025-10-06T13:30:00.000Z",
  "comprobanteUrl": "https://res.cloudinary.com/dyvgbo5jo/image/upload/v1759632987/comprobantes_pago/abc123xyz.jpg"
}
```

---

## 🎉 RESULTADO FINAL

### **Variable comprobanteUrl contiene:**
- **Antes de subir**: `null`
- **Después de subir**: `"https://res.cloudinary.com/dyvgbo5jo/image/upload/v1759632987/comprobantes_pago/qo6oxukygrf78gpqzxca.jpg"`
- **En el JSON a n8n**: Solo se incluye si tiene valor (no se envía si es `null`)

### **Beneficios:**
✅ Link permanente y seguro
✅ Accesible desde cualquier lugar
✅ No ocupa espacio en tu servidor
✅ Se puede ver directamente en el navegador
✅ Compatible con emails, bases de datos, etc.

---

## 🆘 DEBUGGING

Si necesitas verificar el valor en consola:

```javascript
// Se imprime automáticamente cuando se sube el archivo
console.log('Comprobante subido exitosamente:', data.secure_url);

// Se imprime antes de enviar a n8n
console.log('Enviando datos a n8n:', dataToSend);
```

Abre las DevTools (F12) y ve a la pestaña "Console" para ver estos logs.

---

## 📝 NOTAS IMPORTANTES

1. **El link ES PERMANENTE**: Una vez subido, el archivo permanece en Cloudinary
2. **ES PÚBLICO**: Cualquiera con el link puede ver el archivo
3. **NO SE PUEDE EDITAR**: Si quieren cambiar el comprobante, deben subir uno nuevo
4. **SE GUARDA EN**: `comprobantes_pago/` en tu cuenta de Cloudinary
5. **FORMATO ÚNICO**: Cloudinary genera un ID único para cada archivo

---

✨ **¡Todo está funcionando perfectamente!** El link se captura, se guarda y se envía automáticamente a n8n.
