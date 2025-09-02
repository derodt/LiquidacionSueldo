import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-liquidaciones',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="page-container">
      <mat-card class="page-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>receipt_long</mat-icon>
            Sistema de Liquidaciones
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Módulo para el cálculo y gestión de liquidaciones de sueldos.</p>
          <ul>
            <li>Cálculo automático de sueldos</li>
            <li>Aplicación de descuentos</li>
            <li>Generación de comprobantes</li>
            <li>Reportes de liquidación</li>
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
export class LiquidacionesComponent {
  
}
