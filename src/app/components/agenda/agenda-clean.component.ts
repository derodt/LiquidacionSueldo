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
import { Subject, takeUntil, of } from 'rxjs';

import { 
  AgendaData, 
  TurnoAgenda, 
  TrabajadorAgenda, 
  ValidationResult 
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
    MatTooltipModule
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
  isLoading = false;
  daysInMonth: number[] = [];
  displayedColumns: string[] = [];

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
    this.loadAgenda();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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

  onCellSingleClick(trabajador: TrabajadorAgenda, dayIndex: number, event?: MouseEvent) {
    // Por ahora solo registramos el clic para futuras funcionalidades
    const fecha = new Date(this.anio, this.mes - 1, dayIndex + 1);
    const turnoActual = this.getTurnoForWorkerAndDay(trabajador.id, dayIndex);
    
    console.log('Clic simple en:', {
      trabajador: trabajador.nombreCompleto,
      fecha: fecha.toLocaleDateString(),
      turnoActual
    });
  }

  onCellDoubleClick(trabajador: TrabajadorAgenda, dayIndex: number) {
    const fecha = new Date(this.anio, this.mes - 1, dayIndex + 1);
    const turnoActual = this.getTurnoForWorkerAndDay(trabajador.id, dayIndex);

    const dialogData: TurnoModalData = {
      trabajador,
      fecha,
      turnoActual: turnoActual || undefined,
      esEdicion: turnoActual !== null
    };

    const dialogRef = this.dialog.open(TurnoModalComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: dialogData,
      panelClass: 'turno-modal-dialog'
    });

    dialogRef.afterClosed().subscribe((result: TurnoModalResult | 'DELETE' | undefined) => {
      if (result === 'DELETE') {
        // Eliminar turno
        this.deleteTurno(trabajador.id, fecha);
      } else if (result) {
        // Crear o actualizar turno
        const nuevoTurno: TurnoAgenda = {
          fecha,
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

        this.assignTurno(trabajador.id, fecha, nuevoTurno);
      }
    });
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
      this.agenda.turnos[rowIndex][dayIndex] = {
        fecha,
        tipo: null,
        perfil: null,
        esCompleto: true,
        estado: 'PLANIFICADO'
      };

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
    
    return this.agenda.turnos[trabajadorIndex][dayIndex] || null;
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
    this.agenda.turnos[trabajadorIndex][dayIndex] = turno;
  }

  getTurnoDisplayText(turno: TurnoAgenda | null): string {
    if (!turno || !turno.tipo) return '';
    
    if (turno.esHorasEspecificas && turno.horasEspecificas) {
      return `${turno.horasEspecificas.desde}-${turno.horasEspecificas.hasta}`;
    }
    
    switch (turno.tipo) {
      case 'DIURNO':
        return 'TD (12h)';
      case 'NOCTURNO':
        return 'TN (12h)';
      case 'HORAS_ESPECIFICAS':
        return turno.horaInicio && turno.horaFin ? `${turno.horaInicio}-${turno.horaFin}` : 'HE';
      case 'PERSONALIZADO':
        return 'TP';
      default:
        return '';
    }
  }

  getTurnoIcon(turno: TurnoAgenda | null): string {
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

  getTurnoCssClass(turno: TurnoAgenda | null): string {
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
}
