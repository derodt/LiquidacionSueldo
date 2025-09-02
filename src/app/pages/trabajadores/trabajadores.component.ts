import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-trabajadores',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="page-container">
      <mat-card class="page-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>group</mat-icon>
            Gestión de Trabajadores
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Aquí se gestiona la información de los empleados del sistema.</p>
          <ul>
            <li>Registro de nuevos trabajadores</li>
            <li>Edición de datos personales</li>
            <li>Asignación de perfiles</li>
            <li>Historial laboral</li>
          </ul>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .page-card {
      margin-bottom: 24px;
    }
    
    mat-card-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    @media (max-width: 768px) {
      .page-container {
        padding: 16px;
      }
    }
  `]
})
export class TrabajadoresComponent {
  
}
