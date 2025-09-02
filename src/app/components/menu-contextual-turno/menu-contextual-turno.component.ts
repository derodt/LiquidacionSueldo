import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { TrabajadorAgenda, TurnoAgenda } from '../../models/agenda.model';
import { PerfilLaboral } from '../../models/trabajador.model';

export interface MenuContextualData {
  trabajador: TrabajadorAgenda;
  fecha: Date;
  turnoActual?: TurnoAgenda;
  position: { x: number; y: number };
}

export interface OpcionTurnoRapido {
  id: string;
  nombre: string;
  icono: string;
  tipo: 'DIURNO' | 'NOCTURNO';
  horaInicio: string;
  horaFin: string;
  descripcion: string;
  color: string;
}

@Component({
  selector: 'app-menu-contextual-turno',
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <div class="menu-contextual-overlay" 
         [style.left.px]="data.position.x"
         [style.top.px]="data.position.y"
         [class.show]="isVisible">
      
      <div class="menu-header">
        <mat-icon>person</mat-icon>
        <div class="trabajador-info">
          <span class="nombre">{{ data.trabajador.nombreCompleto }}</span>
          <span class="fecha">{{ fechaFormateada }}</span>
        </div>
        <button mat-icon-button (click)="cerrarMenu()" class="close-btn">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-divider></mat-divider>

      <!-- Turno Actual (si existe) -->
      <div class="turno-actual" *ngIf="data.turnoActual">
        <div class="turno-info">
          <mat-icon [style.color]="getTurnoColor(data.turnoActual.tipo)">
            {{ getTurnoIcon(data.turnoActual.tipo) }}
          </mat-icon>
          <div class="turno-detalles">
            <span class="tipo">{{ getTurnoNombre(data.turnoActual.tipo) }}</span>
            <span class="horario">{{ data.turnoActual.horaInicio }} - {{ data.turnoActual.horaFin }}</span>
            <span class="perfil">{{ data.turnoActual.perfil?.nombre }}</span>
          </div>
        </div>
        
        <div class="turno-acciones">
          <button mat-button color="primary" (click)="editarTurno()">
            <mat-icon>edit</mat-icon>
            Editar
          </button>
          <button mat-button color="warn" (click)="eliminarTurno()">
            <mat-icon>delete</mat-icon>
            Eliminar
          </button>
        </div>
        
        <mat-divider></mat-divider>
      </div>

      <!-- Opciones de Turno Rápido -->
      <div class="opciones-rapidas" *ngIf="!data.turnoActual">
        <div class="seccion-titulo">
          <mat-icon>flash_on</mat-icon>
          <span>Asignación Rápida</span>
        </div>
        
        <div class="opciones-grid">
          <button mat-button 
                  *ngFor="let opcion of opcionesTurnoRapido"
                  class="opcion-turno"
                  [style.border-left-color]="opcion.color"
                  (click)="asignarTurnoRapido(opcion)">
            <mat-icon [style.color]="opcion.color">{{ opcion.icono }}</mat-icon>
            <div class="opcion-info">
              <span class="nombre">{{ opcion.nombre }}</span>
              <span class="horario">{{ opcion.horaInicio }} - {{ opcion.horaFin }}</span>
              <span class="descripcion">{{ opcion.descripcion }}</span>
            </div>
          </button>
        </div>

        <mat-divider></mat-divider>
      </div>

      <!-- Opciones Avanzadas -->
      <div class="opciones-avanzadas">
        <button mat-button class="opcion-avanzada" (click)="abrirModalCompleto()">
          <mat-icon>settings</mat-icon>
          <div class="opcion-info">
            <span class="nombre">Configuración Avanzada</span>
            <span class="descripcion">Horas específicas, observaciones, etc.</span>
          </div>
          <mat-icon class="chevron">chevron_right</mat-icon>
        </button>

        <button mat-button class="opcion-avanzada" *ngIf="!data.turnoActual" (click)="copiarTurnoAnterior()">
          <mat-icon>content_copy</mat-icon>
          <div class="opcion-info">
            <span class="nombre">Copiar Turno Anterior</span>
            <span class="descripcion">Usar mismo turno del día anterior</span>
          </div>
          <mat-icon class="chevron">chevron_right</mat-icon>
        </button>
      </div>

    </div>

    <!-- Overlay para cerrar al hacer clic fuera -->
    <div class="backdrop" 
         *ngIf="isVisible" 
         (click)="cerrarMenu()"></div>
  `,
  styleUrls: ['./menu-contextual-turno.component.scss']
})
export class MenuContextualTurnoComponent implements OnInit {
  @Input() data!: MenuContextualData;
  @Input() isVisible = false;

  opcionesTurnoRapido: OpcionTurnoRapido[] = [
    {
      id: 'diurno-12h',
      nombre: 'Turno Diurno',
      icono: 'wb_sunny',
      tipo: 'DIURNO',
      horaInicio: '07:00',
      horaFin: '19:00',
      descripcion: '12 horas diurnas',
      color: '#ff9800'
    },
    {
      id: 'nocturno-12h',
      nombre: 'Turno Nocturno',
      icono: 'brightness_2',
      tipo: 'NOCTURNO',
      horaInicio: '19:00',
      horaFin: '07:00',
      descripcion: '12 horas nocturnas',
      color: '#3f51b5'
    }
  ];

  ngOnInit() {
    // Ajustar posición si el menú se sale de la pantalla
    this.ajustarPosicion();
  }

  get fechaFormateada(): string {
    return this.data.fecha.toLocaleDateString('es-CL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  }

  private ajustarPosicion() {
    // Lógica para ajustar la posición del menú dentro de la pantalla
    const menuWidth = 320;
    const menuHeight = 400;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    if (this.data.position.x + menuWidth > screenWidth) {
      this.data.position.x = screenWidth - menuWidth - 20;
    }

    if (this.data.position.y + menuHeight > screenHeight) {
      this.data.position.y = screenHeight - menuHeight - 20;
    }
  }

  getTurnoIcon(tipo: string | null): string {
    switch (tipo) {
      case 'DIURNO': return 'wb_sunny';
      case 'NOCTURNO': return 'brightness_2';
      case 'HORAS_ESPECIFICAS': return 'schedule';
      default: return 'work';
    }
  }

  getTurnoColor(tipo: string | null): string {
    switch (tipo) {
      case 'DIURNO': return '#ff9800';
      case 'NOCTURNO': return '#3f51b5';
      case 'HORAS_ESPECIFICAS': return '#00bfa5';
      default: return '#666';
    }
  }

  getTurnoNombre(tipo: string | null): string {
    switch (tipo) {
      case 'DIURNO': return 'Turno Diurno';
      case 'NOCTURNO': return 'Turno Nocturno';
      case 'HORAS_ESPECIFICAS': return 'Horas Específicas';
      default: return 'Sin turno';
    }
  }

  asignarTurnoRapido(opcion: OpcionTurnoRapido) {
    const nuevoTurno: TurnoAgenda = {
      fecha: this.data.fecha,
      tipo: opcion.tipo,
      perfil: this.data.trabajador.perfilPrimario,
      horaInicio: opcion.horaInicio,
      horaFin: opcion.horaFin,
      esCompleto: true,
      esHorasEspecificas: false,
      estado: 'PLANIFICADO'
    };

    this.emitirAccion('asignar-rapido', nuevoTurno);
    this.cerrarMenu();
  }

  editarTurno() {
    this.emitirAccion('editar', this.data.turnoActual);
    this.cerrarMenu();
  }

  eliminarTurno() {
    this.emitirAccion('eliminar', this.data.turnoActual);
    this.cerrarMenu();
  }

  abrirModalCompleto() {
    this.emitirAccion('modal-completo', null);
    this.cerrarMenu();
  }

  copiarTurnoAnterior() {
    this.emitirAccion('copiar-anterior', null);
    this.cerrarMenu();
  }

  cerrarMenu() {
    this.emitirAccion('cerrar', null);
  }

  private emitirAccion(accion: string, datos: any) {
    // Este evento será capturado por el componente padre
    const event = new CustomEvent('menu-accion', {
      detail: {
        accion,
        datos,
        trabajador: this.data.trabajador,
        fecha: this.data.fecha
      }
    });
    window.dispatchEvent(event);
  }
}
