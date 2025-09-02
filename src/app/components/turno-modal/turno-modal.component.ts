import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { TrabajadorAgenda, TurnoAgenda } from '../../models/agenda.model';
import { PerfilLaboral } from '../../models/trabajador.model';

export interface TurnoModalData {
  trabajador: TrabajadorAgenda;
  fecha: Date;
  turnoActual?: TurnoAgenda;
  esEdicion: boolean;
}

export interface TurnoModalResult {
  tipo: 'DIURNO' | 'NOCTURNO' | 'HORAS_ESPECIFICAS';
  perfil: PerfilLaboral;
  esCompleto: boolean;
  horasEspecificas?: {
    desde: string;
    hasta: string;
    totalHoras: number;
  };
  observaciones?: string;
}

@Component({
  selector: 'app-turno-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './turno-modal.component.html',
  styleUrls: ['./turno-modal.component.scss']
})
export class TurnoModalComponent implements OnInit {
  turnoForm: FormGroup;
  perfilesDisponibles: PerfilLaboral[] = [];
  
  // Horarios predefinidos para turnos completos de 12 horas
  horariosCompletos = [
    { tipo: 'DIURNO', inicio: '07:00', fin: '19:00', descripcion: 'Turno Diurno (7:00 - 19:00)' },
    { tipo: 'NOCTURNO', inicio: '19:00', fin: '07:00', descripcion: 'Turno Nocturno (19:00 - 7:00)' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TurnoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TurnoModalData
  ) {
    this.perfilesDisponibles = data.trabajador.perfilesDisponibles;
    this.turnoForm = this.createForm();
  }

  ngOnInit() {
    if (this.data.esEdicion && this.data.turnoActual) {
      this.loadTurnoActual();
    }
  }

  private createForm(): FormGroup {
    // Usar perfil primario por defecto
    const perfilPrimarioId = this.data.trabajador.perfilPrimario?.id || this.perfilesDisponibles[0]?.id || null;
    
    return this.fb.group({
      tipoTurno: ['DIURNO', Validators.required], // Por defecto Diurno
      perfilId: [perfilPrimarioId, Validators.required], // Perfil primario por defecto
      esCompleto: [true], // Por defecto turno completo de 12 horas
      horaInicio: ['07:00'], // Horario por defecto 7:00 AM
      horaFin: ['19:00'], // Horario por defecto 7:00 PM
      totalHoras: [12], // 12 horas por defecto
      observaciones: ['']
    });
  }

  private loadTurnoActual() {
    const turno = this.data.turnoActual!;
    this.turnoForm.patchValue({
      tipoTurno: turno.tipo,
      perfilId: turno.perfil?.id,
      esCompleto: turno.esCompleto,
      horaInicio: turno.esHorasEspecificas ? turno.horasEspecificas?.desde : turno.horaInicio,
      horaFin: turno.esHorasEspecificas ? turno.horasEspecificas?.hasta : turno.horaFin,
      totalHoras: turno.esHorasEspecificas ? turno.horasEspecificas?.totalHoras : 12,
      observaciones: turno.observaciones
    });
  }

  onTipoTurnoChange() {
    const tipoTurno = this.turnoForm.get('tipoTurno')?.value;
    const esCompleto = this.turnoForm.get('esCompleto')?.value;
    
    if (esCompleto && tipoTurno !== 'HORAS_ESPECIFICAS') {
      const horario = this.horariosCompletos.find(h => h.tipo === tipoTurno);
      if (horario) {
        this.turnoForm.patchValue({
          horaInicio: horario.inicio,
          horaFin: horario.fin,
          totalHoras: 12
        });
      }
    }
  }

  onEsCompletoChange() {
    const esCompleto = this.turnoForm.get('esCompleto')?.value;
    
    if (esCompleto) {
      this.turnoForm.patchValue({
        tipoTurno: 'DIURNO'
      });
      this.onTipoTurnoChange();
    } else {
      this.turnoForm.patchValue({
        tipoTurno: 'HORAS_ESPECIFICAS',
        horaInicio: '08:00',
        horaFin: '12:00',
        totalHoras: 4
      });
    }
  }

  onHoraChange() {
    const horaInicio = this.turnoForm.get('horaInicio')?.value;
    const horaFin = this.turnoForm.get('horaFin')?.value;
    
    if (horaInicio && horaFin) {
      const totalHoras = this.calcularDiferenciaHoras(horaInicio, horaFin);
      this.turnoForm.patchValue({ totalHoras });
    }
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
    return Math.round((diferenciaMinutos / 60) * 100) / 100; // Redondear a 2 decimales
  }

  getPerfilPorId(id: number): PerfilLaboral | undefined {
    return this.perfilesDisponibles.find(p => p.id === id);
  }

  onSave() {
    if (this.turnoForm.valid) {
      const formValue = this.turnoForm.value;
      const perfil = this.getPerfilPorId(formValue.perfilId);
      
      if (!perfil) {
        return;
      }

      const result: TurnoModalResult = {
        tipo: formValue.tipoTurno,
        perfil: perfil,
        esCompleto: formValue.esCompleto,
        observaciones: formValue.observaciones
      };

      if (!formValue.esCompleto) {
        result.horasEspecificas = {
          desde: formValue.horaInicio,
          hasta: formValue.horaFin,
          totalHoras: formValue.totalHoras
        };
      }

      this.dialogRef.close(result);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onEliminar() {
    this.dialogRef.close('DELETE');
  }

  get fechaFormateada(): string {
    return this.data.fecha.toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  get esCompletoControl() {
    return this.turnoForm.get('esCompleto')?.value;
  }

  get tipoTurnoControl() {
    return this.turnoForm.get('tipoTurno')?.value;
  }
}
