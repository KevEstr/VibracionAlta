// ============================================
// ✅ CÓDIGO N8N CORRECTO - FILTRA POR HORA SELECCIONADA
// ============================================

const duracionCita = 90;

// ✅ HORARIOS ACTUALIZADOS
const horariosLunesViernes = ['09:00', '10:30', '12:30', '14:00', '16:00', '18:00'];
const horariosSabado = ['12:30']; // SOLO 12:30 PM LOS SÁBADOS

// Festivos Colombia 2025
const festivos = [
  '2025-01-01', '2025-01-06', '2025-03-24', '2025-04-17', '2025-04-18',
  '2025-05-01', '2025-06-02', '2025-06-23', '2025-06-30', '2025-07-07',
  '2025-07-20', '2025-08-07', '2025-08-18', '2025-10-13', '2025-11-03',
  '2025-11-17', '2025-12-08', '2025-12-25'
];

// 🔑 RECIBIR LA HORA SELECCIONADA DESDE EL FRONTEND
const horaSeleccionada = $input.first().json.body.hora; // Ejemplo: "12:30"

console.log('========================================');
console.log('🔍 HORA SELECCIONADA:', horaSeleccionada);
console.log('========================================');

// Eventos ocupados desde Google Calendar
const eventosOcupados = $input.all()
  .filter(item => item.json.start && item.json.start.dateTime)
  .map(item => ({
    inicio: new Date(item.json.start.dateTime),
    fin: new Date(item.json.end.dateTime)
  }));

console.log('📅 Total eventos ocupados:', eventosOcupados.length);

// 🔍 BUSCAR DÍAS DISPONIBLES SOLO PARA LA HORA SELECCIONADA
const diasDisponibles = [];
let dia = $now.startOf('day');

for (let d = 0; d < 60; d++) {
  dia = dia.plus({ days: 1 });
  
  // ❌ Excluir domingos
  if (dia.weekday === 7) continue;
  
  // ❌ Excluir festivos
  const fechaStr = dia.toFormat('yyyy-MM-dd');
  if (festivos.includes(fechaStr)) continue;
  
  // 🔑 DETERMINAR QUÉ HORARIOS APLICAN PARA ESTE DÍA
  const horariosDelDia = dia.weekday === 6 ? horariosSabado : horariosLunesViernes;
  
  // ⚠️ FILTRO CRÍTICO: ¿Esta hora está disponible este día?
  // Si seleccionó 12:30 y es lunes, SI está disponible (lunes tiene 12:30)
  // Si seleccionó 14:00 y es sábado, NO está disponible (sábado solo tiene 12:30)
  if (!horariosDelDia.includes(horaSeleccionada)) {
    console.log(`❌ ${fechaStr} (${dia.toFormat('EEEE')}): hora ${horaSeleccionada} NO disponible`);
    continue; // Saltar este día
  }
  
  console.log(`✅ ${fechaStr} (${dia.toFormat('EEEE')}): hora ${horaSeleccionada} SÍ disponible, verificando ocupación...`);
  
  // 🕐 Crear el slot de tiempo SOLO para la hora seleccionada
  const [hora, minuto] = horaSeleccionada.split(':').map(Number);
  const inicioSlot = dia.set({ hour: hora, minute: minuto, second: 0 });
  const finSlot = inicioSlot.plus({ minutes: duracionCita });
  
  // ⏰ Verificar si este slot está ocupado por un evento
  let estaOcupado = false;
  
  for (let j = 0; j < eventosOcupados.length; j++) {
    const evento = eventosOcupados[j];
    const eventoInicio = evento.inicio.getTime();
    const eventoFin = evento.fin.getTime();
    const slotInicio = inicioSlot.toMillis();
    const slotFin = finSlot.toMillis();
    
    // Verificar si hay superposición
    if (
      (slotInicio >= eventoInicio && slotInicio < eventoFin) ||
      (slotFin > eventoInicio && slotFin <= eventoFin) ||
      (slotInicio <= eventoInicio && slotFin >= eventoFin)
    ) {
      estaOcupado = true;
      console.log(`  ⛔ Ocupado por evento: ${new Date(eventoInicio).toISOString()}`);
      break;
    }
  }
  
  // ✅ Si NO está ocupado, agregarlo a los días disponibles
  if (!estaOcupado) {
    console.log(`  ✅ DISPONIBLE`);
    diasDisponibles.push({
      fecha: inicioSlot.toFormat('yyyy-MM-dd'),
      diaSemana: inicioSlot.toFormat('EEEE'),
      fechaLegible: inicioSlot.toFormat('dd MMM yyyy'),
      hora: horaSeleccionada, // LA HORA QUE SELECCIONÓ EL USUARIO
      fechaHoraISO: inicioSlot.toISO()
    });
  }
}

console.log('========================================');
console.log('✅ TOTAL DÍAS DISPONIBLES:', diasDisponibles.length);
console.log('========================================');

// 📤 RETORNAR RESPUESTA
return [{
  json: {
    success: true,
    horaConsultada: horaSeleccionada, // Para verificación
    totalDias: diasDisponibles.length,
    dias: diasDisponibles
  }
}];
