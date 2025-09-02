import { Empresa, SolicitudInstalacion } from '../models';

export const mockEmpresas: Empresa[] = [
  {
    id: 1,
    nombre: 'Centro Médico Norte',
    rut: '76.123.456-7',
    direccion: 'Av. Providencia 1234, Santiago',
    telefono: '+56 9 1234 5678',
    emailContacto: 'contacto@centronorte.cl',
    limiteInstalaciones: 2,
    instalacionesActuales: 1,
    fechaCreacion: new Date('2024-01-15'),
    activo: true
  },
  {
    id: 2,
    nombre: 'Clínica del Sur',
    rut: '76.789.012-3',
    direccion: 'Calle Los Olivos 567, Temuco',
    telefono: '+56 9 8765 4321',
    emailContacto: 'admin@clinicasur.cl',
    limiteInstalaciones: 1,
    instalacionesActuales: 1,
    fechaCreacion: new Date('2024-02-20'),
    activo: true
  },
  {
    id: 3,
    nombre: 'Residencia Esperanza',
    rut: '76.345.678-9',
    direccion: 'Pasaje La Paz 890, Valparaíso',
    telefono: '+56 9 5555 1234',
    emailContacto: 'info@esperanza.cl',
    limiteInstalaciones: 3,
    instalacionesActuales: 2,
    fechaCreacion: new Date('2024-01-08'),
    activo: true
  }
];

export const mockSolicitudesInstalacion: SolicitudInstalacion[] = [
  {
    id: 1,
    empresaId: 1,
    usuarioSolicitanteId: 2,
    cantidadSolicitada: 1,
    justificacion: 'Necesitamos una nueva instalación para expandir nuestros servicios en la zona oriente de Santiago.',
    fechaSolicitud: new Date('2024-03-01'),
    estado: 'PENDIENTE'
  },
  {
    id: 2,
    empresaId: 2,
    usuarioSolicitanteId: 4,
    cantidadSolicitada: 2,
    justificacion: 'Expansión a nuevas sucursales en Temuco y Villarrica para cubrir mayor demanda.',
    fechaSolicitud: new Date('2024-02-28'),
    fechaRespuesta: new Date('2024-03-05'),
    estado: 'APROBADA',
    observacionesAdmin: 'Solicitud aprobada. Empresa tiene buen historial de gestión.',
    aprobadoPor: 1
  },
  {
    id: 3,
    empresaId: 3,
    usuarioSolicitanteId: 6,
    cantidadSolicitada: 1,
    justificacion: 'Solicitud poco fundamentada sin análisis de costos.',
    fechaSolicitud: new Date('2024-02-15'),
    fechaRespuesta: new Date('2024-02-20'),
    estado: 'RECHAZADA',
    observacionesAdmin: 'Falta documentación de respaldo y análisis financiero.',
    aprobadoPor: 1
  }
];

export class MockEmpresaService {
  getEmpresas() {
    return Promise.resolve({
      items: mockEmpresas,
      total: mockEmpresas.length,
      page: 1,
      pageSize: 10,
      hasNext: false,
      hasPrevious: false
    });
  }

  getEmpresa(id: number) {
    const empresa = mockEmpresas.find(e => e.id === id);
    return Promise.resolve(empresa);
  }

  createEmpresa(empresa: any) {
    const newEmpresa = {
      ...empresa,
      id: Math.max(...mockEmpresas.map(e => e.id)) + 1,
      fechaCreacion: new Date(),
      instalacionesActuales: 0
    };
    mockEmpresas.push(newEmpresa);
    return Promise.resolve({ success: true, data: newEmpresa });
  }

  updateEmpresa(id: number, empresa: any) {
    const index = mockEmpresas.findIndex(e => e.id === id);
    if (index !== -1) {
      mockEmpresas[index] = { ...mockEmpresas[index], ...empresa };
      return Promise.resolve({ success: true, data: mockEmpresas[index] });
    }
    return Promise.reject({ success: false, message: 'Empresa no encontrada' });
  }

  getSolicitudesInstalacion(empresaId?: number) {
    let solicitudes = mockSolicitudesInstalacion;
    if (empresaId) {
      solicitudes = solicitudes.filter(s => s.empresaId === empresaId);
    }
    return Promise.resolve(solicitudes);
  }

  createSolicitudInstalacion(solicitud: any) {
    const newSolicitud = {
      ...solicitud,
      id: Math.max(...mockSolicitudesInstalacion.map(s => s.id)) + 1,
      fechaSolicitud: new Date(),
      estado: 'PENDIENTE' as const
    };
    mockSolicitudesInstalacion.push(newSolicitud);
    return Promise.resolve({ success: true, data: newSolicitud });
  }

  procesarSolicitudInstalacion(solicitudId: number, decision: any) {
    const index = mockSolicitudesInstalacion.findIndex(s => s.id === solicitudId);
    if (index !== -1) {
      mockSolicitudesInstalacion[index] = {
        ...mockSolicitudesInstalacion[index],
        ...decision,
        fechaRespuesta: new Date(),
        aprobadoPor: 1 // Admin general
      };
      return Promise.resolve({ success: true, data: mockSolicitudesInstalacion[index] });
    }
    return Promise.reject({ success: false, message: 'Solicitud no encontrada' });
  }
}
