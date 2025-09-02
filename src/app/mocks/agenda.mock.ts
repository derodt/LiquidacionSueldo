import { 
  AgendaData, 
  TurnoPlanificado, 
  TurnoRealizado, 
  Feriado,
  TrabajadorAgenda,
  TurnoAgenda,
  FeriadoDelMes
} from '../models';
import { mockTrabajadores, mockPerfilesLaborales } from './trabajador.mock';

export const mockFeriados: Feriado[] = [
  {
    id: 1,
    empresaId: 1,
    fechaFeriado: new Date('2024-03-29'),
    nombreFeriado: 'Viernes Santo',
    tipoFeriado: 'IRRENUNCIABLE',
    año: 2024,
    activo: true
  },
  {
    id: 2,
    empresaId: 1,
    fechaFeriado: new Date('2024-05-01'),
    nombreFeriado: 'Día del Trabajador',
    tipoFeriado: 'IRRENUNCIABLE',
    año: 2024,
    activo: true
  },
  {
    id: 3,
    empresaId: 1,
    fechaFeriado: new Date('2024-05-21'),
    nombreFeriado: 'Día de las Glorias Navales',
    tipoFeriado: 'NO_IRRENUNCIABLE',
    año: 2024,
    activo: true
  },
  {
    id: 4,
    empresaId: 1,
    fechaFeriado: new Date('2024-09-18'),
    nombreFeriado: 'Independencia Nacional',
    tipoFeriado: 'IRRENUNCIABLE',
    año: 2024,
    activo: true
  },
  {
    id: 5,
    empresaId: 1,
    fechaFeriado: new Date('2024-09-19'),
    nombreFeriado: 'Día de las Glorias del Ejército',
    tipoFeriado: 'IRRENUNCIABLE',
    año: 2024,
    activo: true
  },
  {
    id: 6,
    empresaId: 1,
    fechaFeriado: new Date('2024-12-25'),
    nombreFeriado: 'Navidad',
    tipoFeriado: 'IRRENUNCIABLE',
    año: 2024,
    activo: true
  }
];

export const mockTurnosPlanificados: TurnoPlanificado[] = [
  // Marzo 2024 - Juan Pérez
  {
    id: 1,
    agendaId: 1,
    trabajadorId: 1,
    instalacionId: 1,
    perfilId: 1, // Cuidador
    fechaTurno: new Date('2024-03-01'),
    tipoTurno: 'DIURNO',
    horaInicio: '06:00',
    horaFin: '18:00',
    esTurnoCompleto: true,
    esHorasEspecificas: false
  },
  {
    id: 2,
    agendaId: 1,
    trabajadorId: 1,
    instalacionId: 1,
    perfilId: 1,
    fechaTurno: new Date('2024-03-02'),
    tipoTurno: 'NOCTURNO',
    horaInicio: '18:00',
    horaFin: '06:00',
    esTurnoCompleto: true,
    esHorasEspecificas: false
  },
  {
    id: 3,
    agendaId: 1,
    trabajadorId: 1,
    instalacionId: 1,
    perfilId: 2, // TENS
    fechaTurno: new Date('2024-03-04'),
    tipoTurno: 'DIURNO',
    horaInicio: '06:00',
    horaFin: '18:00',
    esTurnoCompleto: true
  },
  // Ana García
  {
    id: 4,
    agendaId: 1,
    trabajadorId: 2,
    instalacionId: 1,
    perfilId: 2, // TENS
    fechaTurno: new Date('2024-03-01'),
    tipoTurno: 'DIURNO',
    horaInicio: '06:00',
    horaFin: '18:00',
    esTurnoCompleto: true
  },
  {
    id: 5,
    agendaId: 1,
    trabajadorId: 2,
    instalacionId: 1,
    perfilId: 2,
    fechaTurno: new Date('2024-03-02'),
    tipoTurno: 'DIURNO',
    horaInicio: '06:00',
    horaFin: '18:00',
    esTurnoCompleto: true
  },
  // María Silva
  {
    id: 6,
    agendaId: 1,
    trabajadorId: 3,
    instalacionId: 1,
    perfilId: 1, // Cuidador
    fechaTurno: new Date('2024-03-02'),
    tipoTurno: 'NOCTURNO',
    horaInicio: '18:00',
    horaFin: '06:00',
    esTurnoCompleto: true
  },
  {
    id: 7,
    agendaId: 1,
    trabajadorId: 3,
    instalacionId: 1,
    perfilId: 1,
    fechaTurno: new Date('2024-03-04'),
    tipoTurno: 'NOCTURNO',
    horaInicio: '18:00',
    horaFin: '06:00',
    esTurnoCompleto: true
  }
];

export const mockTurnosRealizados: TurnoRealizado[] = [
  {
    id: 1,
    turnoPlanificadoId: 1,
    fechaRealizado: new Date('2024-03-01'),
    horaInicioReal: '06:00',
    horaFinReal: '18:00',
    esFeriado: false,
    factorRecargo: 1.0,
    confirmado: true
  },
  {
    id: 2,
    turnoPlanificadoId: 2,
    fechaRealizado: new Date('2024-03-02'),
    horaInicioReal: '18:00',
    horaFinReal: '06:00',
    esFeriado: false,
    factorRecargo: 1.0,
    confirmado: true
  },
  {
    id: 3,
    turnoPlanificadoId: 4,
    fechaRealizado: new Date('2024-03-01'),
    horaInicioReal: '06:00',
    horaFinReal: '18:00',
    esFeriado: false,
    factorRecargo: 1.0,
    confirmado: true
  }
];

function generateTrabajadorAgenda(): TrabajadorAgenda[] {
  return mockTrabajadores.slice(0, 4).map(trabajador => {
    const perfilesDisponibles = mockPerfilesLaborales.filter(p => p.empresaId === trabajador.empresaId);
    const perfilPrimario = perfilesDisponibles[0]; // El primer perfil es el primario por defecto
    
    return {
      id: trabajador.id,
      rut: trabajador.rut,
      nombreCompleto: trabajador.nombreCompleto,
      perfilesDisponibles,
      perfilPrimario,
      limitesHoras: {
        semanales: 48,
        mensuales: 180
      }
    };
  });
}

function generateTurnosAgenda(año: number, mes: number): TurnoAgenda[][][] {
  const daysInMonth = new Date(año, mes, 0).getDate();
  const trabajadores = generateTrabajadorAgenda();
  
  return trabajadores.map(trabajador => {
    const turnosTrabajadorPorDia: TurnoAgenda[][] = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const fecha = new Date(año, mes - 1, day);
      const turnosDelDia: TurnoAgenda[] = [];
      
      const turnoExistente = mockTurnosPlanificados.find(tp => 
        tp.trabajadorId === trabajador.id &&
        tp.fechaTurno.getDate() === day &&
        tp.fechaTurno.getMonth() === mes - 1 &&
        tp.fechaTurno.getFullYear() === año
      );

      if (turnoExistente) {
        const perfil = mockPerfilesLaborales.find(p => p.id === turnoExistente.perfilId);
        turnosDelDia.push({
          id: `${trabajador.id}-${day}-${Date.now()}`,
          fecha,
          tipo: turnoExistente.tipoTurno,
          perfil: perfil || null,
          horaInicio: turnoExistente.horaInicio,
          horaFin: turnoExistente.horaFin,
          esCompleto: turnoExistente.esTurnoCompleto,
          observaciones: turnoExistente.observaciones,
          estado: 'PLANIFICADO',
          esTurnoMultiple: false,
          ordenEnDia: 1
        });
      }
      // Los días sin turnos tienen un array vacío
      
      turnosTrabajadorPorDia.push(turnosDelDia);
    }
    
    return turnosTrabajadorPorDia;
  });
}

function getFeriadosDelMes(año: number, mes: number): FeriadoDelMes[] {
  return mockFeriados
    .filter(f => 
      f.fechaFeriado.getFullYear() === año && 
      f.fechaFeriado.getMonth() === mes - 1
    )
    .map(f => ({
      fecha: f.fechaFeriado,
      nombre: f.nombreFeriado,
      tipo: f.tipoFeriado
    }));
}

export function generateMockAgendaData(instalacionId: number, año: number, mes: number): AgendaData {
  return {
    instalacionId,
    año,
    mes,
    trabajadores: generateTrabajadorAgenda(),
    turnos: generateTurnosAgenda(año, mes),
    feriados: getFeriadosDelMes(año, mes),
    estado: 'PLANIFICACION'
  };
}

export class MockAgendaService {
  getAgenda(instalacionId: number, año: number, mes: number) {
    const agendaData = generateMockAgendaData(instalacionId, año, mes);
    return Promise.resolve(agendaData);
  }

  createAgenda(instalacionId: number, año: number, mes: number) {
    const newAgenda = {
      id: Math.random() * 1000,
      instalacionId,
      año,
      mes,
      fechaCreacion: new Date(),
      estado: 'PLANIFICACION' as const
    };
    return Promise.resolve({ success: true, data: newAgenda });
  }

  assignTurno(instalacionId: number, trabajadorId: number, fecha: Date, turno: TurnoAgenda) {
    const tipoTurno = turno.tipo === 'PERSONALIZADO' ? 'DIURNO' : (turno.tipo || 'DIURNO');
    
    const newTurno: TurnoPlanificado = {
      id: Math.random() * 1000,
      agendaId: 1,
      trabajadorId,
      instalacionId,
      perfilId: turno.perfil?.id || 1,
      fechaTurno: fecha,
      tipoTurno: tipoTurno as 'DIURNO' | 'NOCTURNO',
      horaInicio: turno.horaInicio || '06:00',
      horaFin: turno.horaFin || '18:00',
      esTurnoCompleto: turno.esCompleto,
      esHorasEspecificas: turno.esHorasEspecificas || false,
      horasEspecificas: turno.horasEspecificas,
      observaciones: turno.observaciones
    };
    
    mockTurnosPlanificados.push(newTurno);
    return Promise.resolve({ success: true, data: newTurno });
  }

  validateTurnoAssignment(trabajadorId: number, fecha: Date, horaInicio: string, horaFin: string) {
    // Simular validaciones
    const turnosConflicto = mockTurnosPlanificados.filter(tp => 
      tp.trabajadorId === trabajadorId &&
      tp.fechaTurno.toDateString() === fecha.toDateString()
    );

    const errors: string[] = [];
    const warnings: string[] = [];

    if (turnosConflicto.length > 0) {
      errors.push('El trabajador ya tiene un turno asignado en esta fecha');
    }

    // Simular validación de límite de horas
    const trabajadorTurnos = mockTurnosPlanificados.filter(tp => 
      tp.trabajadorId === trabajadorId &&
      tp.fechaTurno.getMonth() === fecha.getMonth()
    );

    if (trabajadorTurnos.length >= 15) {
      warnings.push('El trabajador está cerca del límite de horas mensuales');
    }

    return Promise.resolve({
      isValid: errors.length === 0,
      errors,
      warnings
    });
  }

  closeAgenda(agendaId: number) {
    return Promise.resolve({ 
      success: true, 
      data: { id: agendaId, estado: 'CERRADA' as const } 
    });
  }

  getTurnosRealizados(instalacionId: number, año: number, mes: number, trabajadorId?: number) {
    let turnos = mockTurnosRealizados;
    
    if (trabajadorId) {
      const turnosPlanificados = mockTurnosPlanificados.filter(tp => tp.trabajadorId === trabajadorId);
      const turnosPlanificadosIds = turnosPlanificados.map(tp => tp.id);
      turnos = turnos.filter(tr => turnosPlanificadosIds.includes(tr.turnoPlanificadoId));
    }
    
    return Promise.resolve(turnos);
  }
}
