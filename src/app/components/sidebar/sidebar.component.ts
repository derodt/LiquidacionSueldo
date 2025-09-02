import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnDestroy {
  public router = inject(Router);
  
  isCollapsed = false;
  isMobile = false;

  menuItems = [
    {
      icon: 'group',
      label: 'Trabajadores',
      route: '/trabajadores',
      description: 'Gestión de empleados'
    },
    {
      icon: 'receipt_long',
      label: 'Liquidaciones',
      route: '/liquidaciones',
      description: 'Cálculo de sueldos'
    },
    {
      icon: 'business',
      label: 'Empresas',
      route: '/empresas',
      description: 'Administración empresarial'
    },
    {
      icon: 'calendar_today',
      label: 'Agenda',
      route: '/agenda',
      description: 'Planificación de turnos'
    }
  ];

  constructor() {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) {
      this.isCollapsed = true;
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    
    // En móvil, agregar/quitar clase al body para controlar el scroll
    if (this.isMobile) {
      if (!this.isCollapsed) {
        document.body.classList.add('sidebar-open');
        document.body.style.overflow = 'hidden';
      } else {
        document.body.classList.remove('sidebar-open');
        document.body.style.overflow = 'auto';
      }
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    // En móvil, cerrar el menú después de navegar
    if (this.isMobile) {
      this.closeSidebar();
    }
  }

  closeSidebar() {
    if (this.isMobile) {
      this.isCollapsed = true;
      document.body.classList.remove('sidebar-open');
      document.body.style.overflow = 'auto';
    }
  }
  
  ngOnDestroy() {
    // Limpiar estilos del body al destruir el componente
    document.body.classList.remove('sidebar-open');
    document.body.style.overflow = 'auto';
    window.removeEventListener('resize', () => this.checkScreenSize());
  }
}
