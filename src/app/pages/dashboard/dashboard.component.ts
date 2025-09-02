import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { AgendaComponent } from '../../components/agenda/agenda.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    AgendaComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1;
  instalacionId = 1; // Por defecto para desarrollo

  onAgendaChanged(agenda: any) {
    console.log('Agenda changed:', agenda);
  }

  onTurnoAssigned(event: any) {
    console.log('Turno assigned:', event);
  }
}
