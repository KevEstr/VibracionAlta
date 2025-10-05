# 🌟 Configuración de Cloudinary para Subida de Comprobantes

## 📋 Paso 1: Crear una Cuenta en Cloudinary

1. Ve a [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Regístrate gratuitamente (el plan gratuito incluye 25GB - más que suficiente)
3. Verifica tu email
4. Completa el setup inicial

## 🔑 Paso 2: Obtener tu CLOUD NAME

1. Inicia sesión en Cloudinary
2. Ve al Dashboard: [https://console.cloudinary.com/](https://console.cloudinary.com/)
3. En la parte superior verás un panel que dice **"Product Environment Credentials"**
4. Ahí encontrarás tu **Cloud Name** (ejemplo: `vibracion-alta` o `dxhhrqxwm`)
5. **COPIA ESTE NOMBRE** - lo necesitarás para el `.env`

**IMPORTANTE**: NO necesitas copiar el API Key ni el API Secret, solo el **Cloud Name**

## ⚙️ Paso 3: Crear un Upload Preset (CRÍTICO ⚠️)

**Este paso es OBLIGATORIO** para que funcione la subida desde el navegador:

1. En el Dashboard de Cloudinary, haz clic en el ⚙️ **Settings** (esquina superior derecha)
2. Haz clic en la pestaña **"Upload"** (segunda opción)
3. Scroll down hasta encontrar **"Upload presets"**
4. Haz clic en **"Add upload preset"** (botón azul)
5. Configura así:
   
   **⭐ CONFIGURACIÓN OBLIGATORIA:**
   - **Upload preset name**: `comprobantes_citas` (o el nombre que prefieras)
   - **Signing Mode**: Selecciona **"Unsigned"** ⚠️ (ESTO ES CRÍTICO - permite subir desde el navegador)
   
   **📁 CONFIGURACIÓN OPCIONAL (pero recomendada):**
   - **Folder**: `comprobantes/` (para organizar las imágenes)
   - **Resource Type**: `Auto`
   - **Access Mode**: `Public`
   - **Unique filename**: ✅ Activado (para evitar sobrescribir archivos)
   - **Use filename**: ✅ Activado (mantiene el nombre original)
   - **Allowed formats**: `jpg, png, pdf, jpeg, webp` (formatos permitidos)
   
6. Haz clic en **"Save"** (botón azul abajo)
7. **COPIA EL NOMBRE DEL PRESET** que acabas de crear - lo necesitarás para el `.env`

**⚠️ MUY IMPORTANTE**: Si el preset NO es "Unsigned", NO funcionará desde el navegador

## 🔒 Paso 4: Configurar Variables de Entorno

1. Abre el archivo `.env` en la raíz del proyecto (ya existe)
2. Reemplaza estos valores con los tuyos:

```env
# REEMPLAZA "tu-cloud-name-aqui" con el Cloud Name que copiaste en el Paso 2
REACT_APP_CLOUDINARY_CLOUD_NAME=tu-cloud-name-aqui

# REEMPLAZA "comprobantes_citas" con el nombre del preset que creaste en el Paso 3
REACT_APP_CLOUDINARY_UPLOAD_PRESET=comprobantes_citas
```

**📝 EJEMPLO REAL (con valores de ejemplo):**
```env
REACT_APP_CLOUDINARY_CLOUD_NAME=vibracion-alta
REACT_APP_CLOUDINARY_UPLOAD_PRESET=comprobantes_citas
```

**✅ CHECKLIST - Verifica que:**
- [ ] El Cloud Name es exactamente como aparece en tu Dashboard
- [ ] El Upload Preset es exactamente como lo nombraste (sin espacios)
- [ ] El Upload Preset está configurado como "Unsigned"
- [ ] No hay espacios antes o después de los valores
- [ ] Guardaste el archivo `.env`

## 🚀 Paso 5: Reiniciar el Servidor

Después de configurar las variables de entorno, reinicia el servidor de desarrollo:

```bash
# Detén el servidor con Ctrl+C
# Luego vuelve a iniciarlo
npm start
```

## ✅ Paso 6: Probar la Funcionalidad

1. Ve a tu aplicación
2. Inicia el proceso de reserva
3. En la sección "Información Personal", responde "Sí" a "¿Ya pagaste la consulta?"
4. Aparecerá el campo de subida de comprobante
5. Haz clic en el área de subida y selecciona una imagen o PDF
6. El archivo se subirá automáticamente a Cloudinary
7. Verás un mensaje de éxito con un enlace para ver el comprobante

## 📁 Estructura de Archivos en Cloudinary

Los comprobantes se guardarán en:
```
cloudinary.com/
  └── tu_cloud_name/
      └── comprobantes_pago/
          ├── archivo1_xxx.jpg
          ├── archivo2_xxx.png
          └── archivo3_xxx.pdf
```

## 🔐 Seguridad

- El preset está configurado como **Unsigned** para facilitar subidas desde el navegador
- Los archivos se almacenan en la carpeta `comprobantes_pago`
- Cloudinary genera URLs únicas para cada archivo
- El plan gratuito incluye 25 GB de almacenamiento

## 🎨 Tipos de Archivo Permitidos

- ✅ JPG / JPEG
- ✅ PNG
- ✅ WEBP
- ✅ PDF
- ❌ Máximo: 5MB por archivo

## 📊 Límites del Plan Gratuito

- **Almacenamiento**: 25 GB
- **Ancho de banda**: 25 GB/mes
- **Transformaciones**: 25,000 créditos/mes
- **Más que suficiente para comenzar** 🎉

## 🆘 Solución de Problemas

### Error: "Upload preset not found"
- Verifica que el preset `vibracion_alta_comprobantes` esté creado en Cloudinary
- Asegúrate de que esté configurado como **Unsigned**

### Error: "Invalid cloud name"
- Verifica que el `REACT_APP_CLOUDINARY_CLOUD_NAME` sea correcto
- No incluyas espacios ni caracteres especiales

### El archivo no se sube
- Verifica que el archivo sea menor a 5MB
- Asegúrate de que el formato sea permitido (JPG, PNG, WEBP, PDF)
- Revisa la consola del navegador para más detalles

## 📝 Notas Adicionales

- Las URLs generadas son permanentes y seguras
- Puedes ver todos los archivos subidos en el Media Library de Cloudinary
- Los archivos se pueden eliminar manualmente desde el Dashboard si es necesario

---

✨ **¡Listo!** Ahora tu aplicación puede recibir comprobantes de pago de forma segura y profesional.
