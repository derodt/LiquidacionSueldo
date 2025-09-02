import { 
  Trabajador, 
  PerfilLaboral, 
  ValorPerfil, 
  AsignacionTrabajadorInstalacion 
} from '../models';

export const mockPerfilesLaborales: PerfilLaboral[] = [
  {
    id: 1,
    empresaId: 1,
    nombre: 'Cuidador de Abuelos',
    descripcion: 'Cuidado integral de adultos mayores',
    valorHora: 6500,
    horasSemanalesMaximas: 44,
    requiereAutorizacion: false,
    activo: true
  },
  {
    id: 2,
    empresaId: 1,
    nombre: 'TENS (Técnico Nivel Superior)',
    descripcion: 'Técnico en Enfermería de Nivel Superior',
    valorHora: 8500,
    horasSemanalesMaximas: 44,
    requiereAutorizacion: true,
    activo: true
  },
  {
    id: 3,
    empresaId: 1,
    nombre: 'Personal de Aseo',
    descripcion: 'Limpieza y mantención de instalaciones',
    valorHora: 5500,
    horasSemanalesMaximas: 44,
    requiereAutorizacion: false,
    activo: true
  },
  {
    id: 4,
    empresaId: 2,
    nombre: 'Cuidador de Abuelos',
    descripcion: 'Cuidado integral de adultos mayores',
    valorHora: 7000,
    horasSemanalesMaximas: 44,
    requiereAutorizacion: false,
    activo: true
  },
  {
    id: 5,
    empresaId: 2,
    nombre: 'TENS (Técnico Nivel Superior)',
    descripcion: 'Técnico en Enfermería de Nivel Superior',
    valorHora: 9000,
    horasSemanalesMaximas: 44,
    requiereAutorizacion: true,
    activo: true
  }
];

export const mockValoresPerfiles: ValorPerfil[] = [
  // Cuidador de Abuelos - Empresa 1
  {
    id: 1,
    perfilId: 1,
    tipoTurno: 'DIURNO',
    diasSemana: [1, 2, 3, 4, 5, 6, 7],
    valorTurno: 30000,
    horasTurno: 12,
    fechaVigenciaDesde: new Date('2024-01-01'),
    activo: true
  },
  {
    id: 2,
    perfilId: 1,
    tipoTurno: 'NOCTURNO',
    diasSemana: [1, 2, 3, 4, 5, 6, 7],
    valorTurno: 45000,
    horasTurno: 12,
    fechaVigenciaDesde: new Date('2024-01-01'),
    activo: true
  },
  // TENS - Empresa 1
  {
    id: 3,
    perfilId: 2,
    tipoTurno: 'DIURNO',
    diasSemana: [1, 2, 3, 4, 5],
    valorTurno: 17000,
    horasTurno: 12,
    fechaVigenciaDesde: new Date('2024-01-01'),
    activo: true
  },
  // Personal de Aseo
  {
    id: 4,
    perfilId: 3,
    tipoTurno: 'DIURNO',
    diasSemana: [1, 2, 3, 4, 5, 6],
    valorTurno: 12000,
    horasTurno: 8,
    fechaVigenciaDesde: new Date('2024-01-01'),
    activo: true
  }
];

export const mockTrabajadores: Trabajador[] = [
  {
    id: 1,
    empresaId: 1,
    rut: '12.345.678-9',
    nombreCompleto: 'Juan Carlos Pérez García',
    email: 'juan.perez@centronorte.cl',
    telefono: '+56 9 8765 4321',
    direccion: 'Los Álamos 123, Santiago',
    fechaIngreso: new Date('2024-01-15'),
    activo: true
  },
  {
    id: 2,
    empresaId: 1,
    rut: '98.765.432-1',
    nombreCompleto: 'Ana María García López',
    email: 'ana.garcia@centronorte.cl',
    telefono: '+56 9 1234 5678',
    direccion: 'Av. Las Condes 456, Santiago',
    fechaIngreso: new Date('2024-02-01'),
    activo: true
  },
  {
    id: 3,
    empresaId: 1,
    rut: '15.678.432-K',
    nombreCompleto: 'María Elena Silva Torres',
    email: 'maria.silva@centronorte.cl',
    telefono: '+56 9 5555 7777',
    direccion: 'Calle Norte 789, Santiago',
    fechaIngreso: new Date('2024-01-20'),
    activo: true
  },
  {
    id: 4,
    empresaId: 1,
    rut: '11.222.333-4',
    nombreCompleto: 'Roberto González Martínez',
    email: 'roberto.gonzalez@centronorte.cl',
    telefono: '+56 9 3333 4444',
    direccion: 'Pasaje Sur 321, Santiago',
    fechaIngreso: new Date('2024-02-10'),
    activo: true
  },
  {
    id: 5,
    empresaId: 2,
    rut: '22.333.444-5',
    nombreCompleto: 'Patricia Morales Ruiz',
    email: 'patricia.morales@clinicasur.cl',
    telefono: '+56 9 6666 7777',
    direccion: 'Av. Central 654, Temuco',
    fechaIngreso: new Date('2024-02-15'),
    activo: true
  }
];

export const mockAsignacionesTrabajadorInstalacion: AsignacionTrabajadorInstalacion[] = [
  {
    id: 1,
    trabajadorId: 1,
    instalacionId: 1,
    fechaAsignacion: new Date('2024-01-15'),
    activo: true,
    observaciones: 'Asignación inicial'
  },
  {
    id: 2,
    trabajadorId: 2,
    instalacionId: 1,
    fechaAsignacion: new Date('2024-02-01'),
    activo: true
  },
  {
    id: 3,
    trabajadorId: 3,
    instalacionId: 1,
    fechaAsignacion: new Date('2024-01-20'),
    activo: true
  },
  {
    id: 4,
    trabajadorId: 4,
    instalacionId: 1,
    fechaAsignacion: new Date('2024-02-10'),
    activo: true
  },
  {
    id: 5,
    trabajadorId: 5,
    instalacionId: 2,
    fechaAsignacion: new Date('2024-02-15'),
    activo: true
  }
];

export class MockTrabajadorService {
  getTrabajadores(empresaId?: number) {
    let trabajadores = mockTrabajadores;
    if (empresaId) {
      trabajadores = trabajadores.filter(t => t.empresaId === empresaId);
    }
    return Promise.resolve({
      items: trabajadores,
      total: trabajadores.length,
      page: 1,
      pageSize: 10,
      hasNext: false,
      hasPrevious: false
    });
  }

  getTrabajador(id: number) {
    const trabajador = mockTrabajadores.find(t => t.id === id);
    return Promise.resolve(trabajador);
  }

  getTrabajadoresByInstalacion(instalacionId: number) {
    const asignaciones = mockAsignacionesTrabajadorInstalacion
      .filter(a => a.instalacionId === instalacionId && a.activo);
    
    const trabajadores = asignaciones.map(a => 
      mockTrabajadores.find(t => t.id === a.trabajadorId)
    ).filter(t => t !== undefined);

    return Promise.resolve(trabajadores);
  }

  createTrabajador(trabajador: any) {
    const newTrabajador = {
      ...trabajador,
      id: Math.max(...mockTrabajadores.map(t => t.id)) + 1,
      fechaIngreso: new Date(),
      activo: true
    };
    mockTrabajadores.push(newTrabajador);
    return Promise.resolve({ success: true, data: newTrabajador });
  }

  updateTrabajador(id: number, trabajador: any) {
    const index = mockTrabajadores.findIndex(t => t.id === id);
    if (index !== -1) {
      mockTrabajadores[index] = { ...mockTrabajadores[index], ...trabajador };
      return Promise.resolve({ success: true, data: mockTrabajadores[index] });
    }
    return Promise.reject({ success: false, message: 'Trabajador no encontrado' });
  }

  assignToInstalacion(trabajadorId: number, instalacionId: number) {
    const newAsignacion: AsignacionTrabajadorInstalacion = {
      id: Math.max(...mockAsignacionesTrabajadorInstalacion.map(a => a.id)) + 1,
      trabajadorId,
      instalacionId,
      fechaAsignacion: new Date(),
      activo: true
    };
    mockAsignacionesTrabajadorInstalacion.push(newAsignacion);
    return Promise.resolve({ success: true, data: newAsignacion });
  }

  getPerfilesLaborales(empresaId: number) {
    const perfiles = mockPerfilesLaborales.filter(p => p.empresaId === empresaId);
    return Promise.resolve(perfiles);
  }

  getValoresPerfiles(perfilId: number) {
    const valores = mockValoresPerfiles.filter(v => v.perfilId === perfilId);
    return Promise.resolve(valores);
  }

  createPerfilLaboral(perfil: any) {
    const newPerfil = {
      ...perfil,
      id: Math.max(...mockPerfilesLaborales.map(p => p.id)) + 1,
      activo: true
    };
    mockPerfilesLaborales.push(newPerfil);
    return Promise.resolve({ success: true, data: newPerfil });
  }
}
