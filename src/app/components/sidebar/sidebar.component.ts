import { Component, inject, OnDestroy, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  public router = inject(Router);
  
  isCollapsed = false;
  isMobile = false;
  activeRoute = '';
  private resizeTimeout: any;

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
    this.setActiveRoute();
    
    // En desktop, mostrar el sidebar por defecto
    if (!this.isMobile) {
      this.isCollapsed = false;
    }
  }

  ngOnInit() {
    // Escuchar cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.setActiveRoute();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // Debounce para optimizar rendimiento
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.checkScreenSize();
    }, 150);
  }

  private setActiveRoute() {
    this.activeRoute = this.router.url;
  }

  checkScreenSize() {
    const previousMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;
    
    // Si cambió de desktop a móvil, colapsar automáticamente
    if (!previousMobile && this.isMobile) {
      this.isCollapsed = true;
    }
    // Si cambió de móvil a desktop, expandir automáticamente
    else if (previousMobile && !this.isMobile) {
      this.isCollapsed = false;
      this.closeSidebar(); // Limpiar estilos de móvil
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    
    // En móvil, controlar el scroll del body
    this.updateBodyScrollState();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    
    // En móvil, cerrar el menú después de navegar
    if (this.isMobile) {
      setTimeout(() => {
        this.closeSidebar();
      }, 100);
    }
  }

  closeSidebar() {
    if (this.isMobile) {
      this.isCollapsed = true;
    }
    this.updateBodyScrollState();
  }

  private updateBodyScrollState() {
    if (this.isMobile) {
      if (!this.isCollapsed) {
        document.body.classList.add('sidebar-open');
        document.body.style.overflow = 'hidden';
      } else {
        document.body.classList.remove('sidebar-open');
        document.body.style.overflow = '';
      }
    } else {
      document.body.classList.remove('sidebar-open');
      document.body.style.overflow = '';
    }
  }

  isRouteActive(route: string): boolean {
    return this.activeRoute === route || this.activeRoute.startsWith(route + '/');
  }
  
  ngOnDestroy() {
    // Limpiar estilos del body al destruir el componente
    document.body.classList.remove('sidebar-open');
    document.body.style.overflow = '';
    
    // Limpiar timeout
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
  }
}
