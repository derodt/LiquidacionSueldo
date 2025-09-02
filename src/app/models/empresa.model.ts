export interface Empresa {
  id: number;
  nombre: string;
  rut: string;
  direccion: string;
  telefono: string;
  emailContacto: string;
  limiteInstalaciones: number;
  instalacionesActuales: number;
  fechaCreacion: Date;
  activo: boolean;
}

export interface SolicitudInstalacion {
  id: number;
  empresaId: number;
  usuarioSolicitanteId: number;
  cantidadSolicitada: number;
  justificacion: string;
  fechaSolicitud: Date;
  fechaRespuesta?: Date;
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
  observacionesAdmin?: string;
  aprobadoPor?: number;
}
