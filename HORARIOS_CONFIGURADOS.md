# ⏰ HORARIOS CONFIGURADOS - Sistema de Citas

## 📅 HORARIOS POR DÍA

### **Lunes a Viernes**
```
9:00 AM
10:30 AM
2:00 PM
4:00 PM
6:00 PM
```

**Total**: 5 horarios disponibles

---

### **Sábado**
```
9:00 AM
10:30 AM
12:30 PM
```

**Total**: 3 horarios disponibles

---

## 🔧 IMPLEMENTACIÓN TÉCNICA

### **Archivo**: `src/pages/Home.js`

```javascript
// Horarios disponibles - Lunes a Viernes
const timeSlotsWeekday = [
  "09:00",
  "10:30", 
  "14:00",
  "16:00",
  "18:00"
];

// Horarios disponibles - Sábado  
const timeSlotsSaturday = [
  "09:00",
  "10:30",
  "12:30"
];

// Detectar día actual
const getTodayDayOfWeek = () => {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return days[new Date().getDay()];
};

const isSaturday = getTodayDayOfWeek() === 'Sábado';

// Mostrar horarios según el día
const timeSlots = isSaturday ? timeSlotsSaturday : timeSlotsWeekday;
```

---

## 🎨 DISEÑO RESPONSIVE

### **Desktop (PC)**
- Todos los horarios en **UNA LÍNEA**
- Grid automático: `grid-template-columns: repeat(auto-fit, minmax(140px, 1fr))`
- Botones grandes y espaciados

### **Móvil**
- Grid de **2 columnas fijas**: `grid-template-columns: repeat(2, 1fr)`
- Botones compactos pero legibles
- Gap reducido para aprovechar espacio

---

## 📊 FORMATO DE HORAS

### **Formato 24 horas (backend)**
```
09:00
10:30
12:30
14:00
16:00
18:00
```

### **Formato 12 horas (frontend)**
```
9:00 AM
10:30 AM
12:30 PM
2:00 PM
4:00 PM
6:00 PM
```

**Conversión automática** con función `formatearHora12h()`

---

## 🔄 FLUJO DE SELECCIÓN

1. **Usuario selecciona una hora** → Trigger `handleTimeSlotSelect()`
2. **Sistema consulta API** → `POST /webhook/api/dias-disponibles`
3. **Recibe días disponibles** → Filtra por día de la semana
4. **Usuario selecciona día** → Completa reserva

---

## ⚠️ VALIDACIONES

- ✅ Solo se muestran horarios según día de la semana
- ✅ Horarios en formato 24h se envían al backend
- ✅ Frontend muestra formato 12h (AM/PM)
- ✅ Sábado tiene horarios reducidos automáticamente

---

## 🎯 PRÓXIMAS MEJORAS POSIBLES

- [ ] Detectar día automáticamente desde el calendario
- [ ] Permitir configuración dinámica de horarios sin código
- [ ] Horarios especiales para días festivos
- [ ] Bloqueo de horarios llenos en tiempo real

---

✅ **Sistema funcionando correctamente con horarios diferenciados**
