export interface Trabajador {
  id: number;
  empresaId: number;
  rut: string;
  nombreCompleto: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  fechaIngreso: Date;
  fechaSalida?: Date;
  activo: boolean;
}

export interface AsignacionTrabajadorInstalacion {
  id: number;
  trabajadorId: number;
  instalacionId: number;
  fechaAsignacion: Date;
  fechaDesasignacion?: Date;
  activo: boolean;
  observaciones?: string;
}

export interface PerfilLaboral {
  id: number;
  empresaId: number;
  nombre: string;
  descripcion: string;
  valorHora: number; // Valor por hora base
  horasSemanalesMaximas: number;
  requiereAutorizacion: boolean;
  activo: boolean;
}

export interface ValorPerfil {
  id: number;
  perfilId: number;
  tipoTurno: 'DIURNO' | 'NOCTURNO';
  diasSemana: number[]; // [1,2,3,4,5,6,7]
  valorTurno: number;
  horasTurno: number;
  fechaVigenciaDesde: Date;
  fechaVigenciaHasta?: Date;
  activo: boolean;
}

export interface PerfilTrabajador {
  id: number;
  trabajadorId: number;
  perfilId: number;
  fechaAsignacion: Date;
  fechaDesasignacion?: Date;
  activo: boolean;
}
