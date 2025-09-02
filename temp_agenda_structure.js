// Propiedades básicas del calendario
const basicCalendarProps = `
  // Propiedades básicas para el calendario
  @Input() instalacionId: number = 1;
  @Input() mes: number = new Date().getMonth() + 1;
  @Input() anio: number = new Date().getFullYear();

  // Datos de la agenda
  agenda: AgendaData | null = null;
  daysInMonth: number[] = [];
  displayedColumns: string[] = [];

  // Propiedades para trabajadores bajo demanda
  trabajadoresDisponibles: TrabajadorAgenda[] = [];
  trabajadoresEnCalendario: TrabajadorAgenda[] = [];
  trabajadorSeleccionadoDropdown: TrabajadorAgenda | null = null;

  // Propiedades para vista responsiva
  semanaActual = 1;
  totalSemanas = 4;
  isVerticalView = false;
  isLoading = false;
  
  // Datos para la vista por semanas
  semanasDelMes: { numero: number, dias: any[], fechas: Date[] }[] = [];
  diasDeLaSemanaActual: any[] = [];
  fechasDeLaSemanaActual: Date[] = [];

  // Menú contextual
  mostrarMenuContextual = false;
  posicionMenu = { x: 0, y: 0 };
  trabajadorSeleccionado: TrabajadorAgenda | null = null;
  fechaSeleccionada: Date | null = null;
  turnoActualSeleccionado: TurnoAgenda | null = null;

  // Observable para destruir suscripciones
  private destroy$ = new Subject<void>();
`;

console.log('Estructura básica preparada para el componente agenda responsivo');
