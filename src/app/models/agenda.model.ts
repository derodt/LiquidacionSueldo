import { PerfilLaboral } from './trabajador.model';

export interface Feriado {
  id: number;
  empresaId: number;
  fechaFeriado: Date;
  nombreFeriado: string;
  tipoFeriado: 'IRRENUNCIABLE' | 'NO_IRRENUNCIABLE';
  año: number;
  activo: boolean;
}

export interface AgendaTurnos {
  id: number;
  instalacionId: number;
  año: number;
  mes: number;
  fechaCreacion: Date;
  fechaCierre?: Date;
  estado: 'PLANIFICACION' | 'CERRADA' | 'LIQUIDADA';
}

export interface TurnoPlanificado {
  id: number;
  agendaId: number;
  trabajadorId: number;
  instalacionId: number;
  perfilId: number;
  fechaTurno: Date;
  tipoTurno: 'DIURNO' | 'NOCTURNO' | 'HORAS_ESPECIFICAS';
  horaInicio: string;
  horaFin: string;
  esTurnoCompleto: boolean;
  esHorasEspecificas?: boolean; // Campo opcional para mantener compatibilidad
  horasEspecificas?: {
    desde: string; // HH:mm
    hasta: string; // HH:mm
    totalHoras: number;
  };
  observaciones?: string;
}

export interface TurnoRealizado {
  id: number;
  turnoPlanificadoId: number;
  fechaRealizado: Date;
  horaInicioReal: string;
  horaFinReal: string;
  esFeriado: boolean;
  tipoFeriado?: 'IRRENUNCIABLE' | 'NO_IRRENUNCIABLE';
  factorRecargo: number; // 1.0, 1.5, 2.0
  observaciones?: string;
  confirmado: boolean;
}

// Interfaces para el componente de agenda
export interface AgendaData {
  instalacionId: number;
  año: number;
  mes: number;
  trabajadores: TrabajadorAgenda[];
  turnos: TurnoAgenda[][][]; // Cambio: ahora es un array de 3 dimensiones para soportar múltiples turnos por día
  feriados: FeriadoDelMes[];
  estado: 'PLANIFICACION' | 'CERRADA' | 'LIQUIDADA';
}

export interface TrabajadorAgenda {
  id: number;
  rut: string;
  nombreCompleto: string;
  perfilesDisponibles: PerfilLaboral[];
  perfilPrimario: PerfilLaboral; // Perfil por defecto del trabajador
  limitesHoras: {
    semanales: number;
    mensuales: number;
  };
}

export interface TurnoAgenda {
  id?: string; // ID único para identificar cada turno individual
  fecha: Date;
  tipo: 'DIURNO' | 'NOCTURNO' | 'HORAS_ESPECIFICAS' | 'PERSONALIZADO' | null;
  perfil: PerfilLaboral | null;
  horaInicio?: string;
  horaFin?: string;
  esCompleto: boolean;
  esHorasEspecificas?: boolean;
  horasEspecificas?: {
    desde: string;
    hasta: string;
    totalHoras: number;
  };
  observaciones?: string;
  estado: 'PLANIFICADO' | 'CONFIRMADO' | 'CONFLICTO';
  esTurnoMultiple?: boolean; // Flag para indicar si es parte de un turno múltiple
  ordenEnDia?: number; // Orden del turno en el día (1, 2, 3...)
}

export interface MultipleTurnoInfo {
  totalTurnos: number;
  totalHoras: number;
  tipos: string[];
  conflictos: boolean;
}

export interface FeriadoDelMes {
  fecha: Date;
  nombre: string;
  tipo: 'IRRENUNCIABLE' | 'NO_IRRENUNCIABLE';
}
