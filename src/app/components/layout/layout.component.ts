import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MobileHeaderComponent } from '../mobile-header/mobile-header.component';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    MobileHeaderComponent
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  sidebarHidden = false;
  sidebarCollapsed = false;

  constructor(private sidebarService: SidebarService) {
    this.sidebarService.sidebarState$.subscribe(state => {
      this.sidebarHidden = state.isHidden;
      this.sidebarCollapsed = state.isCollapsed;
    });
  }
}
