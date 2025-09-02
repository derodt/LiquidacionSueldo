export interface Liquidacion {
  id: number;
  instalacionId: number;
  trabajadorId: number;
  año: number;
  mes: number;
  fechaGeneracion: Date;
  totalTurnos: number;
  totalHoras: number;
  subtotalBase: number;
  totalRecargos: number;
  totalBruto: number;
  descuentos: number;
  totalLiquido: number;
  estado: 'BORRADOR' | 'GENERADA' | 'PAGADA';
  esConsolidada: boolean; // indica si incluye múltiples instalaciones
}

export interface DetalleLiquidacion {
  id: number;
  liquidacionId: number;
  turnoRealizadoId: number;
  perfilId: number;
  instalacionId: number;
  fechaTurno: Date;
  tipoTurno: 'DIURNO' | 'NOCTURNO';
  horasTrabajadas: number;
  valorBase: number;
  factorRecargo: number;
  valorConRecargo: number;
  esFeriado: boolean;
}

export interface ResumenLiquidacion {
  liquidacion: Liquidacion;
  trabajador: {
    rut: string;
    nombreCompleto: string;
  };
  instalacion: {
    nombre: string;
  };
  detalles: DetalleLiquidacion[];
}
