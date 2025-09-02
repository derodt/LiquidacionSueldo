import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgendaComponent } from '../../components/agenda/agenda.component';

@Component({
  selector: 'app-agenda-page',
  standalone: true,
  imports: [CommonModule, AgendaComponent],
  template: `
    <div class="agenda-page-container">
      <app-agenda></app-agenda>
    </div>
  `,
  styles: [`
    .agenda-page-container {
      height: 100vh;
      overflow: hidden;
    }
  `]
})
export class AgendaPageComponent {
  
}
