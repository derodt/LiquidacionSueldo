export interface Instalacion {
  id: number;
  empresaId: number;
  nombre: string;
  direccion: string;
  telefono: string;
  responsable: string;
  fechaCreacion: Date;
  activo: boolean;
}

export interface Usuario {
  id: number;
  empresaId?: number;
  instalacionId?: number;
  username: string;
  email: string;
  nombreCompleto: string;
  rol: 'ADMIN_GENERAL' | 'ADMIN_EMPRESA' | 'ADMIN_INSTALACION' | 'USUARIO';
  activo: boolean;
  fechaCreacion: Date;
  ultimoAcceso?: Date;
}
