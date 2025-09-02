import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { Subject, takeUntil, of } from 'rxjs';

import { 
  AgendaData, 
  TurnoAgenda, 
  TrabajadorAgenda, 
  ValidationResult,
  MultipleTurnoInfo 
} from '../../models';
import { AgendaService } from '../../services/agenda.service';
import { MockAgendaService } from '../../mocks';
import { TurnoModalComponent, TurnoModalData, TurnoModalResult } from '../turno-modal/turno-modal.component';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDividerModule,
    MatMenuModule
  ],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.scss'
})
export class AgendaComponent implements OnInit, OnDestroy {
  @Input() instalacionId: number = 1;
  @Input() anio: number = new Date().getFullYear();
  @Input() mes: number = new Date().getMonth() + 1;
  
  @Output() agendaChanged = new EventEmitter<AgendaData>();
  @Output() turnoAssigned = new EventEmitter<{ trabajadorId: number; fecha: Date; turno: TurnoAgenda | null }>();

  agenda: AgendaData | null = null;
  // Propiedades para paginación por semanas
  semanaActual = 1;
  totalSemanas = 4;
  isVerticalView = false;
  isLoading = false;
  
  // Datos para la vista por semanas
  semanasDelMes: { numero: number, dias: any[], fechas: Date[] }[] = [];
  diasDeLaSemanaActual: any[] = [];
  fechasDeLaSemanaActual: Date[] = [];
  daysInMonth: number[] = [];
  displayedColumns: string[] = [];

  // Sistema de trabajadores por demanda
  trabajadoresDisponibles: TrabajadorAgenda[] = [];
  trabajadoresEnCalendario: TrabajadorAgenda[] = [];
  trabajadorSeleccionadoDropdown: TrabajadorAgenda | null = null;

  // Menu contextual
  mostrarMenuContextual = false;
  trabajadorSeleccionado: TrabajadorAgenda | null = null;
  fechaSeleccionada: Date | null = null;
  turnoActualSeleccionado: TurnoAgenda | null = null;
  posicionMenu = { x: 0, y: 0 };

  private destroy$ = new Subject<void>();
  private mockService = new MockAgendaService(); // Usar mock para desarrollo

  constructor(
    private agendaService: AgendaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.generateCalendarDays();
    this.setupDisplayedColumns();
    this.configurarVista();
    this.loadTrabajadoresDisponibles();
    // No cargar agenda automáticamente - ahora es por demanda
    this.initializeEmptyAgenda();
    
    // Escuchar cambios de tamaño de ventana
    window.addEventListener('resize', () => this.configurarVista());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    window.removeEventListener('resize', () => this.configurarVista());
  }

  configurarVista() {
    const esMovil = window.innerWidth <= 768;
    this.isVerticalView = esMovil;
    
    if (this.isVerticalView) {
      this.calcularSemanasDelMes();
      this.cargarSemanaActual();
    }
  }

  calcularSemanasDelMes() {
    this.semanasDelMes = [];
    const primerDia = new Date(this.anio, this.mes - 1, 1);
    const ultimoDia = new Date(this.anio, this.mes, 0);
    const totalDias = ultimoDia.getDate();
    
    let semana = 1;
    let diasDeLaSemana: any[] = [];
    let fechasDeLaSemana: Date[] = [];
    
    for (let dia = 1; dia <= totalDias; dia++) {
      const fecha = new Date(this.anio, this.mes - 1, dia);
      const diaDeLaSemana = fecha.getDay(); // 0 = Domingo, 1 = Lunes, etc.
      
      diasDeLaSemana.push(dia);
      fechasDeLaSemana.push(fecha);
      
      // Si es domingo (0) o es el último día del mes, cerrar la semana
      if (diaDeLaSemana === 0 || dia === totalDias) {
        this.semanasDelMes.push({
          numero: semana,
          dias: [...diasDeLaSemana],
          fechas: [...fechasDeLaSemana]
        });
        
        semana++;
        diasDeLaSemana = [];
        fechasDeLaSemana = [];
      }
    }
    
    this.totalSemanas = this.semanasDelMes.length;
    
    // Asegurar que la semana actual esté dentro del rango
    if (this.semanaActual > this.totalSemanas) {
      this.semanaActual = 1;
    }
  }

  cargarSemanaActual() {
    if (this.semanasDelMes.length > 0 && this.semanaActual <= this.semanasDelMes.length) {
      const semana = this.semanasDelMes[this.semanaActual - 1];
      this.diasDeLaSemanaActual = semana.dias;
      this.fechasDeLaSemanaActual = semana.fechas;
    }
  }

  cambiarSemana(direccion: 'anterior' | 'siguiente') {
    if (direccion === 'anterior' && this.semanaActual > 1) {
      this.semanaActual--;
    } else if (direccion === 'siguiente' && this.semanaActual < this.totalSemanas) {
      this.semanaActual++;
    }
    this.cargarSemanaActual();
  }

  irASemana(numeroSemana: number) {
    if (numeroSemana >= 1 && numeroSemana <= this.totalSemanas) {
      this.semanaActual = numeroSemana;
      this.cargarSemanaActual();
    }
  }

  getNombreDiaSemana(fecha: Date): string {
    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return dias[fecha.getDay()];
  }

  private loadTrabajadoresDisponibles() {
    this.isLoading = true;
    this.mockService.getAgenda(this.instalacionId, this.anio, this.mes)
      .then(agendaData => {
        // Guardar todos los trabajadores disponibles pero no mostrarlos
        this.trabajadoresDisponibles = agendaData.trabajadores;
        this.isLoading = false;
      })
      .catch(error => {
        console.error('Error loading trabajadores:', error);
        this.isLoading = false;
      });
  }

  private initializeEmptyAgenda() {
    this.agenda = {
      instalacionId: this.instalacionId,
      año: this.anio,
      mes: this.mes,
      trabajadores: [], // Inicialmente vacío
      turnos: [], // Inicialmente vacío - ahora será array 3D
      feriados: [], // Mantener feriados vacíos por ahora
      estado: 'PLANIFICACION'
    };
    this.trabajadoresEnCalendario = [];
  }

  private generateCalendarDays() {
    const daysCount = new Date(this.anio, this.mes, 0).getDate();
    this.daysInMonth = Array.from({ length: daysCount }, (_, i) => i + 1);
  }

  private setupDisplayedColumns() {
    this.displayedColumns = ['trabajador', ...this.daysInMonth.map(day => `day-${day}`)];
  }

  private loadAgenda() {
    this.isLoading = true;
    
    // Usar mock service para desarrollo
    this.mockService.getAgenda(this.instalacionId, this.anio, this.mes)
      .then(agenda => {
        this.agenda = agenda;
        this.agendaChanged.emit(agenda);
        this.isLoading = false;
      })
      .catch(error => {
        console.error('Error loading agenda:', error);
        this.snackBar.open('Error al cargar la agenda', 'Cerrar', { duration: 3000 });
        this.isLoading = false;
      });
  }

  onCellSingleClick(trabajador: TrabajadorAgenda, dayIndex: number, event: MouseEvent) {
    // Prevenir evento por defecto y propagación
    event.preventDefault();
    event.stopPropagation();

    // Cerrar menú anterior si está abierto
    this.cerrarMenuContextual();

    // Configurar datos para el menú contextual
    const fecha = new Date(this.anio, this.mes - 1, dayIndex + 1);
    const turnoActual = this.getTurnoForWorkerAndDay(trabajador.id, dayIndex);
    
    this.trabajadorSeleccionado = trabajador;
    this.fechaSeleccionada = fecha;
    this.turnoActualSeleccionado = turnoActual;

    // Calcular posición del menú
    this.posicionMenu = { 
      x: event.clientX, 
      y: event.clientY 
    };

    // Mostrar menú contextual con un pequeño delay
    setTimeout(() => {
      this.mostrarMenuContextual = true;
    }, 10);

    console.log('Menú contextual abierto para:', {
      trabajador: trabajador.nombreCompleto,
      fecha: fecha.toLocaleDateString(),
      turnoActual,
      posicion: this.posicionMenu
    });
  }

  onCellDoubleClick(trabajador: TrabajadorAgenda, dayIndex: number) {
    // Doble clic desactivado - ahora solo se usa el menú contextual
    console.log('Doble clic desactivado');
    return;
  }

  // Mantener el método anterior para compatibilidad (ahora llama al doble clic)
  onCellClick(trabajador: TrabajadorAgenda, dayIndex: number) {
    this.onCellDoubleClick(trabajador, dayIndex);
  }

  private getHorarioCompleto(tipo: 'DIURNO' | 'NOCTURNO' | 'HORAS_ESPECIFICAS'): { inicio: string, fin: string } {
    switch (tipo) {
      case 'DIURNO':
        return { inicio: '07:00', fin: '19:00' };
      case 'NOCTURNO':
        return { inicio: '19:00', fin: '07:00' };
      default:
        return { inicio: '08:00', fin: '20:00' };
    }
  }

  private deleteTurno(trabajadorId: number, fecha: Date) {
    if (!this.agenda) return;

    const rowIndex = this.agenda.trabajadores.findIndex(t => t.id === trabajadorId);
    const dayIndex = fecha.getDate() - 1;

    if (rowIndex >= 0 && dayIndex >= 0 && dayIndex < this.agenda.turnos[rowIndex].length) {
      // Limpiar todos los turnos del día (ahora es un array)
      this.agenda.turnos[rowIndex][dayIndex] = [];

      this.snackBar.open('Turno eliminado correctamente', 'Cerrar', { duration: 3000 });
      this.turnoAssigned.emit({
        trabajadorId,
        fecha,
        turno: null
      });
    }
  }

  private getTurnoForWorkerAndDay(trabajadorId: number, dayIndex: number): TurnoAgenda | null {
    if (!this.agenda) return null;
    
    const trabajadorIndex = this.agenda.trabajadores.findIndex(t => t.id === trabajadorId);
    if (trabajadorIndex === -1) return null;
    
    // Devolver el primer turno si existen múltiples turnos
    const turnosDelDia = this.agenda.turnos[trabajadorIndex][dayIndex];
    return turnosDelDia && turnosDelDia.length > 0 ? turnosDelDia[0] : null;
  }

  // Nuevo método para obtener todos los turnos de un día
  private getTurnosForWorkerAndDay(trabajadorId: number, dayIndex: number): TurnoAgenda[] {
    if (!this.agenda) return [];
    
    const trabajadorIndex = this.agenda.trabajadores.findIndex(t => t.id === trabajadorId);
    if (trabajadorIndex === -1) return [];
    
    return this.agenda.turnos[trabajadorIndex][dayIndex] || [];
  }

  // Método para obtener información resumida de múltiples turnos
  private getMultipleTurnoInfo(trabajadorId: number, dayIndex: number): MultipleTurnoInfo {
    const turnos = this.getTurnosForWorkerAndDay(trabajadorId, dayIndex);
    
    return {
      totalTurnos: turnos.length,
      totalHoras: this.calcularTotalHorasDelDia(turnos),
      tipos: turnos.map(t => t.tipo || '').filter(tipo => tipo !== ''),
      conflictos: turnos.some(t => t.estado === 'CONFLICTO')
    };
  }

  // Método para calcular total de horas trabajadas en un día
  private calcularTotalHorasDelDia(turnos: TurnoAgenda[]): number {
    return turnos.reduce((total, turno) => {
      if (!turno.horaInicio || !turno.horaFin) return total;
      
      if (turno.esHorasEspecificas && turno.horasEspecificas) {
        return total + turno.horasEspecificas.totalHoras;
      }
      
      // Calcular horas para turnos completos
      const horas = this.calcularDiferenciaHoras(turno.horaInicio, turno.horaFin);
      return total + horas;
    }, 0);
  }

  private calcularDiferenciaHoras(inicio: string, fin: string): number {
    const [horaInicio, minInicio] = inicio.split(':').map(Number);
    const [horaFin, minFin] = fin.split(':').map(Number);
    
    let minutosInicio = horaInicio * 60 + minInicio;
    let minutosFin = horaFin * 60 + minFin;
    
    // Si el turno cruza la medianoche
    if (minutosFin <= minutosInicio) {
      minutosFin += 24 * 60;
    }
    
    const diferenciaMinutos = minutosFin - minutosInicio;
    return Math.round((diferenciaMinutos / 60) * 100) / 100;
  }

  private assignTurno(trabajadorId: number, fecha: Date, turno: TurnoAgenda) {
    this.mockService.assignTurno(this.instalacionId, trabajadorId, fecha, turno)
      .then(response => {
        if (response.success) {
          this.updateLocalAgenda(trabajadorId, fecha, turno);
          this.turnoAssigned.emit({ trabajadorId, fecha, turno });
          this.snackBar.open('Turno asignado correctamente', 'Cerrar', { duration: 3000 });
        }
      })
      .catch(error => {
        console.error('Error assigning turno:', error);
        this.snackBar.open('Error al asignar turno', 'Cerrar', { duration: 3000 });
      });
  }

  private updateLocalAgenda(trabajadorId: number, fecha: Date, turno: TurnoAgenda) {
    if (!this.agenda) return;

    const trabajadorIndex = this.agenda.trabajadores.findIndex(t => t.id === trabajadorId);
    if (trabajadorIndex === -1) return;

    const dayIndex = fecha.getDate() - 1;
    
    // Asegurar que existe el array de turnos para este día
    if (!this.agenda.turnos[trabajadorIndex]) {
      this.agenda.turnos[trabajadorIndex] = [];
    }
    if (!this.agenda.turnos[trabajadorIndex][dayIndex]) {
      this.agenda.turnos[trabajadorIndex][dayIndex] = [];
    }
    
    // Si el turno no tiene tipo, significa que lo estamos eliminando
    if (!turno.tipo) {
      this.agenda.turnos[trabajadorIndex][dayIndex] = [];
      return;
    }
    
    // Generar ID único para el turno
    turno.id = this.generateTurnoId(trabajadorId, dayIndex);
    turno.ordenEnDia = this.agenda.turnos[trabajadorIndex][dayIndex].length + 1;
    
    // Agregar el turno al array de turnos del día
    this.agenda.turnos[trabajadorIndex][dayIndex].push(turno);
  }

  private generateTurnoId(trabajadorId: number, dayIndex: number): string {
    const timestamp = Date.now();
    return `${trabajadorId}-${dayIndex}-${timestamp}`;
  }

  getTurnoDisplayText(turno: TurnoAgenda | null): string;
  getTurnoDisplayText(turnos: TurnoAgenda[]): string;
  getTurnoDisplayText(turnoOrTurnos: TurnoAgenda | TurnoAgenda[] | null): string {
    // Si es null, retornar vacío
    if (!turnoOrTurnos) return '';
    
    // Si es un array (múltiples turnos)
    if (Array.isArray(turnoOrTurnos)) {
      if (turnoOrTurnos.length === 0) return '';
      
      if (turnoOrTurnos.length === 1) {
        return this.getTurnoSingleDisplayText(turnoOrTurnos[0]);
      }
      
      // Múltiples turnos - mostrar resumen
      const tipos = turnoOrTurnos.map(t => this.getTurnoSingleDisplayText(t)).join(' + ');
      const totalHoras = this.calcularTotalHorasDelDia(turnoOrTurnos);
      return `${tipos} (${totalHoras}h)`;
    }
    
    // Si es un turno único
    return this.getTurnoSingleDisplayText(turnoOrTurnos);
  }

  private getTurnoSingleDisplayText(turno: TurnoAgenda): string {
    if (!turno || !turno.tipo) return '';
    
    if (turno.esHorasEspecificas && turno.horasEspecificas) {
      return `${turno.horasEspecificas.desde}-${turno.horasEspecificas.hasta}`;
    }
    
    switch (turno.tipo) {
      case 'DIURNO':
        return 'TD';
      case 'NOCTURNO':
        return 'TN';
      case 'HORAS_ESPECIFICAS':
        return turno.horaInicio && turno.horaFin ? `${turno.horaInicio}-${turno.horaFin}` : 'HE';
      case 'PERSONALIZADO':
        return 'TP';
      default:
        return '';
    }
  }

  getTurnoIcon(turno: TurnoAgenda | null): string;
  getTurnoIcon(turnos: TurnoAgenda[]): string;
  getTurnoIcon(turnoOrTurnos: TurnoAgenda | TurnoAgenda[] | null): string {
    if (!turnoOrTurnos) return '';
    
    // Si es un array (múltiples turnos)
    if (Array.isArray(turnoOrTurnos)) {
      if (turnoOrTurnos.length === 0) return '';
      
      if (turnoOrTurnos.length === 1) {
        return this.getTurnoSingleIcon(turnoOrTurnos[0]);
      }
      
      // Múltiples turnos - mostrar icon especial
      return '🔄'; // Icono para múltiples turnos
    }
    
    return this.getTurnoSingleIcon(turnoOrTurnos);
  }

  private getTurnoSingleIcon(turno: TurnoAgenda): string {
    if (!turno || !turno.tipo) return '';
    
    switch (turno.tipo) {
      case 'DIURNO':
        return '☀️';
      case 'NOCTURNO':
        return '🌙';
      case 'HORAS_ESPECIFICAS':
        return '⏰';
      case 'PERSONALIZADO':
        return '⚙️';
      default:
        return '';
    }
  }

  getTurnoCssClass(turno: TurnoAgenda | null): string;
  getTurnoCssClass(turnos: TurnoAgenda[]): string;
  getTurnoCssClass(turnoOrTurnos: TurnoAgenda | TurnoAgenda[] | null): string {
    if (!turnoOrTurnos) return 'turno-empty';
    
    // Si es un array (múltiples turnos)
    if (Array.isArray(turnoOrTurnos)) {
      if (turnoOrTurnos.length === 0) return 'turno-empty';
      
      if (turnoOrTurnos.length === 1) {
        return this.getTurnoSingleCssClass(turnoOrTurnos[0]);
      }
      
      // Múltiples turnos - clase especial
      const baseClass = 'turno-cell turno-multiple';
      const hasConflict = turnoOrTurnos.some(t => t.estado === 'CONFLICTO');
      return hasConflict ? `${baseClass} turno-conflict` : `${baseClass} turno-normal`;
    }
    
    return this.getTurnoSingleCssClass(turnoOrTurnos);
  }

  private getTurnoSingleCssClass(turno: TurnoAgenda): string {
    if (!turno || !turno.tipo) return 'turno-empty';
    
    const baseClass = 'turno-cell';
    const stateClass = turno.estado === 'CONFLICTO' ? 'turno-conflict' : 'turno-normal';
    const typeClass = `turno-${turno.tipo.toLowerCase()}`;
    
    return `${baseClass} ${stateClass} ${typeClass}`;
  }

  isFeriado(dayIndex: number): boolean {
    if (!this.agenda) return false;
    
    const fecha = new Date(this.anio, this.mes - 1, dayIndex + 1);
    return this.agenda.feriados.some(f => 
      f.fecha.toDateString() === fecha.toDateString()
    );
  }

  getFeriadoInfo(dayIndex: number): string {
    if (!this.agenda) return '';
    
    const fecha = new Date(this.anio, this.mes - 1, dayIndex + 1);
    const feriado = this.agenda.feriados.find(f => 
      f.fecha.toDateString() === fecha.toDateString()
    );
    
    return feriado ? feriado.nombre : '';
  }

  closeAgenda() {
    if (!this.agenda) return;
    
    this.snackBar.open('Funcionalidad de cierre en desarrollo', 'Cerrar', { duration: 3000 });
  }

  exportAgenda() {
    if (!this.agenda) return;
    
    this.snackBar.open('Funcionalidad de exportación en desarrollo', 'Cerrar', { duration: 3000 });
  }

  getMonthName(): string {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[this.mes - 1];
  }

  // Métodos para el menú contextual
  cerrarMenuContextual() {
    this.mostrarMenuContextual = false;
    this.trabajadorSeleccionado = null;
    this.fechaSeleccionada = null;
    this.turnoActualSeleccionado = null;
  }

  asignarTurnoRapido(tipo: 'DIURNO' | 'NOCTURNO') {
    if (!this.trabajadorSeleccionado || !this.fechaSeleccionada) return;

    // Obtener los turnos actuales del día
    const trabajadorIndex = this.agenda!.trabajadores.findIndex(t => t.id === this.trabajadorSeleccionado!.id);
    const dayIndex = this.fechaSeleccionada!.getDate() - 1;
    const turnosActuales = this.agenda!.turnos[trabajadorIndex][dayIndex] || [];

    // Verificar si ya existe un turno del mismo tipo
    const turnoExistente = turnosActuales.find(turno => turno.tipo === tipo);
    
    if (turnoExistente) {
      // Si ya existe, lo eliminamos (toggle off)
      const index = turnosActuales.indexOf(turnoExistente);
      turnosActuales.splice(index, 1);
      this.snackBar.open(`Turno ${tipo.toLowerCase()} eliminado`, 'Cerrar', { duration: 3000 });
    } else {
      // Si no existe, lo agregamos
      const nuevoTurno: TurnoAgenda = {
        id: this.generateTurnoId(this.trabajadorSeleccionado.id, dayIndex),
        fecha: this.fechaSeleccionada,
        tipo: tipo,
        perfil: this.trabajadorSeleccionado.perfilPrimario,
        horaInicio: tipo === 'DIURNO' ? '07:00' : '19:00',
        horaFin: tipo === 'DIURNO' ? '19:00' : '07:00',
        esCompleto: true,
        esHorasEspecificas: false,
        observaciones: 'Asignado desde menú rápido',
        estado: 'PLANIFICADO',
        esTurnoMultiple: turnosActuales.length > 0,
        ordenEnDia: turnosActuales.length + 1
      };

      turnosActuales.push(nuevoTurno);
      this.snackBar.open(`Turno ${tipo.toLowerCase()} agregado`, 'Cerrar', { duration: 3000 });
    }

    // Actualizar turnos múltiples
    this.actualizarTurnosMultiples(trabajadorIndex, dayIndex, turnosActuales);
    this.cerrarMenuContextual();
  }

  private actualizarTurnosMultiples(trabajadorIndex: number, dayIndex: number, turnos: TurnoAgenda[]) {
    // Marcar todos los turnos como múltiples si hay más de uno
    turnos.forEach((turno, index) => {
      turno.esTurnoMultiple = turnos.length > 1;
      turno.ordenEnDia = index + 1;
    });
    
    this.agenda!.turnos[trabajadorIndex][dayIndex] = turnos;
  }

  abrirModalParaEditar() {
    console.log('abrirModalParaEditar called');
    console.log('trabajadorSeleccionado:', this.trabajadorSeleccionado);
    console.log('fechaSeleccionada:', this.fechaSeleccionada);
    
    if (!this.trabajadorSeleccionado) {
      console.error('No hay trabajador seleccionado');
      alert('Error: No hay trabajador seleccionado');
      return;
    }
    
    if (!this.fechaSeleccionada) {
      console.error('No hay fecha seleccionada');
      alert('Error: No hay fecha seleccionada');
      return;
    }

    // Guardar las variables antes de cerrar el menú
    const trabajadorTemp = this.trabajadorSeleccionado;
    const fechaTemp = this.fechaSeleccionada;
    const turnoTemp = this.turnoActualSeleccionado;

    this.cerrarMenuContextual();

    const dialogData: TurnoModalData = {
      trabajador: trabajadorTemp,
      fecha: fechaTemp,
      turnoActual: turnoTemp || undefined,
      esEdicion: turnoTemp !== null
    };

    console.log('Abriendo modal con data:', dialogData);

    const dialogRef = this.dialog.open(TurnoModalComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: dialogData,
      panelClass: 'turno-modal-dialog'
    });

    console.log('Modal dialog ref created:', dialogRef);

    dialogRef.afterClosed().subscribe((result: TurnoModalResult | 'DELETE' | undefined) => {
      console.log('Modal closed with result:', result);
      if (result === 'DELETE') {
        this.deleteTurno(trabajadorTemp.id, fechaTemp);
      } else if (result) {
        const nuevoTurno: TurnoAgenda = {
          fecha: fechaTemp,
          tipo: result.tipo,
          perfil: result.perfil,
          horaInicio: result.esCompleto ? this.getHorarioCompleto(result.tipo).inicio : result.horasEspecificas!.desde,
          horaFin: result.esCompleto ? this.getHorarioCompleto(result.tipo).fin : result.horasEspecificas!.hasta,
          esCompleto: result.esCompleto,
          esHorasEspecificas: !result.esCompleto,
          horasEspecificas: result.horasEspecificas,
          observaciones: result.observaciones,
          estado: 'PLANIFICADO'
        };

        this.assignTurno(trabajadorTemp.id, fechaTemp, nuevoTurno);
      }
    });
  }

  eliminarTurno() {
    if (!this.trabajadorSeleccionado || !this.fechaSeleccionada) return;

    const confirmar = confirm('¿Está seguro de que desea eliminar este turno?');
    if (confirmar) {
      this.deleteTurno(this.trabajadorSeleccionado.id, this.fechaSeleccionada);
    }
    
    this.cerrarMenuContextual();
  }

  // Nuevos métodos para turnos múltiples
  
  asignarTurnoDoble() {
    if (!this.trabajadorSeleccionado || !this.fechaSeleccionada) return;

    const trabajadorIndex = this.agenda!.trabajadores.findIndex(t => t.id === this.trabajadorSeleccionado!.id);
    const dayIndex = this.fechaSeleccionada!.getDate() - 1;
    const turnosActuales = this.agenda!.turnos[trabajadorIndex][dayIndex] || [];

    // Verificar si ya tiene turno doble
    const tieneNocturno = turnosActuales.some(t => t.tipo === 'NOCTURNO');
    const tieneDiurno = turnosActuales.some(t => t.tipo === 'DIURNO');

    if (tieneNocturno && tieneDiurno) {
      // Quitar turno doble - eliminar ambos turnos
      this.agenda!.turnos[trabajadorIndex][dayIndex] = [];
      this.snackBar.open('Turno doble eliminado', 'Cerrar', { duration: 3000 });
    } else {
      // Agregar turno doble - asegurar que tiene ambos turnos
      const nuevosTeurnos: TurnoAgenda[] = [];
      
      // Agregar turno nocturno si no existe
      if (!tieneNocturno) {
        nuevosTeurnos.push({
          id: this.generateTurnoId(this.trabajadorSeleccionado.id, dayIndex),
          fecha: this.fechaSeleccionada,
          tipo: 'NOCTURNO',
          perfil: this.trabajadorSeleccionado.perfilPrimario,
          horaInicio: '19:00',
          horaFin: '07:00',
          esCompleto: true,
          esHorasEspecificas: false,
          observaciones: 'Turno doble - Nocturno',
          estado: 'PLANIFICADO',
          esTurnoMultiple: true,
          ordenEnDia: 1
        });
      }
      
      // Agregar turno diurno si no existe  
      if (!tieneDiurno) {
        nuevosTeurnos.push({
          id: this.generateTurnoId(this.trabajadorSeleccionado.id, dayIndex),
          fecha: this.fechaSeleccionada,
          tipo: 'DIURNO', 
          perfil: this.trabajadorSeleccionado.perfilPrimario,
          horaInicio: '07:00',
          horaFin: '19:00',
          esCompleto: true,
          esHorasEspecificas: false,
          observaciones: 'Turno doble - Diurno',
          estado: 'PLANIFICADO',
          esTurnoMultiple: true,
          ordenEnDia: 2
        });
      }
      
      // Combinar con turnos existentes si es necesario
      const turnosFinales = [...turnosActuales, ...nuevosTeurnos];
      this.actualizarTurnosMultiples(trabajadorIndex, dayIndex, turnosFinales);
      
      this.snackBar.open('Turno doble asignado (24 horas)', 'Cerrar', { duration: 4000 });
    }
    
    this.cerrarMenuContextual();
  }

  tieneTurnoDoble(): boolean {
    if (!this.trabajadorSeleccionado || !this.fechaSeleccionada) return false;
    
    const trabajadorIndex = this.agenda!.trabajadores.findIndex(t => t.id === this.trabajadorSeleccionado!.id);
    const dayIndex = this.fechaSeleccionada!.getDate() - 1;
    const turnos = this.agenda!.turnos[trabajadorIndex][dayIndex] || [];
    
    const tieneNocturno = turnos.some(t => t.tipo === 'NOCTURNO');
    const tieneDiurno = turnos.some(t => t.tipo === 'DIURNO');
    
    return tieneNocturno && tieneDiurno;
  }

  tieneTurnos(): boolean {
    if (!this.trabajadorSeleccionado || !this.fechaSeleccionada) return false;
    
    const trabajadorIndex = this.agenda!.trabajadores.findIndex(t => t.id === this.trabajadorSeleccionado!.id);
    const dayIndex = this.fechaSeleccionada!.getDate() - 1;
    const turnos = this.agenda!.turnos[trabajadorIndex][dayIndex] || [];
    
    return turnos.length > 0;
  }

  eliminarTodosTurnos() {
    if (!this.trabajadorSeleccionado || !this.fechaSeleccionada) return;

    const confirmar = confirm('¿Está seguro de que desea eliminar TODOS los turnos de este día?');
    if (!confirmar) return;

    const trabajadorIndex = this.agenda!.trabajadores.findIndex(t => t.id === this.trabajadorSeleccionado!.id);
    const dayIndex = this.fechaSeleccionada!.getDate() - 1;
    
    this.agenda!.turnos[trabajadorIndex][dayIndex] = [];
    this.snackBar.open('Todos los turnos del día eliminados', 'Cerrar', { duration: 3000 });
    
    this.cerrarMenuContextual();
  }

  // Métodos para manejar trabajadores por demanda
  onTrabajadorSeleccionado(trabajador: TrabajadorAgenda): void {
    if (trabajador) {
      this.trabajadorSeleccionadoDropdown = trabajador;
      this.agregarTrabajadorAlCalendario();
    }
  }

  agregarTrabajadorAlCalendario() {
    if (!this.trabajadorSeleccionadoDropdown) return;

    // Verificar que no esté ya en el calendario
    const yaExiste = this.trabajadoresEnCalendario.find(t => t.id === this.trabajadorSeleccionadoDropdown!.id);
    if (yaExiste) {
      this.snackBar.open('El trabajador ya está en el calendario', 'Cerrar', { duration: 3000 });
      return;
    }

    // Agregar al calendario
    this.trabajadoresEnCalendario.push(this.trabajadorSeleccionadoDropdown);
    this.agenda!.trabajadores = [...this.trabajadoresEnCalendario];

    // Crear matriz de turnos vacía para este trabajador (array 2D para días y turnos múltiples)
    const filaTurnosVacia: TurnoAgenda[][] = [];
    for (let i = 0; i < this.daysInMonth.length; i++) {
      filaTurnosVacia.push([]); // Cada día puede tener múltiples turnos
    }
    this.agenda!.turnos.push(filaTurnosVacia);

    // Limpiar selección
    this.trabajadorSeleccionadoDropdown = null;

    this.snackBar.open('Trabajador agregado al calendario', 'Cerrar', { duration: 3000 });
  }

  quitarTrabajadorDelCalendario(trabajador: TrabajadorAgenda) {
    const confirmar = confirm(`¿Está seguro de que desea quitar a ${trabajador.nombreCompleto} del calendario? Se perderán todos sus turnos programados.`);
    if (!confirmar) return;

    const index = this.trabajadoresEnCalendario.findIndex(t => t.id === trabajador.id);
    if (index === -1) return;

    // Quitar del calendario
    this.trabajadoresEnCalendario.splice(index, 1);
    this.agenda!.trabajadores = [...this.trabajadoresEnCalendario];
    this.agenda!.turnos.splice(index, 1);

    this.snackBar.open('Trabajador quitado del calendario', 'Cerrar', { duration: 3000 });
  }

  get trabajadoresDisponiblesParaAgregar(): TrabajadorAgenda[] {
    // Filtrar trabajadores que no estén ya en el calendario
    return this.trabajadoresDisponibles.filter(trabajador => 
      !this.trabajadoresEnCalendario.find(t => t.id === trabajador.id)
    );
  }
}
