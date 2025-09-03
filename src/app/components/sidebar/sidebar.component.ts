import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  
  isMobile = false;
  isCollapsed = false;
  isHidden = false;
  activeRoute = '';
  private resizeTimeout: any;
  private destroy$ = new Subject<void>();

  menuItems = [
    {
      id: 'dashboard',
      icon: 'dashboard',
      label: 'Dashboard',
      description: 'Panel de control',
      route: '/dashboard'
    },
    {
      id: 'trabajadores',
      icon: 'trabajadores',
      label: 'Trabajadores',
      description: 'Gestión de personal',
      route: '/trabajadores'
    },
    {
      id: 'liquidaciones',
      icon: 'liquidaciones',
      label: 'Liquidaciones', 
      description: 'Cálculo de sueldos',
      route: '/liquidaciones'
    },
    {
      id: 'empresas',
      icon: 'empresas',
      label: 'Empresas',
      description: 'Gestión de empresas',
      route: '/empresas'
    },
    {
      id: 'agenda',
      icon: 'agenda',
      label: 'Agenda',
      description: 'Calendario y turnos',
      route: '/agenda'
    }
  ];

  constructor(private router: Router, private sidebarService: SidebarService) {
    this.checkScreenSize();
    this.setActiveRoute();
    this.updateSidebarService();
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.setActiveRoute();
    });

    // Escuchar cambios del servicio sidebar
    this.sidebarService.sidebarState$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(state => {
      // Solo actualizar si viene del servicio (no del propio componente)
      if (state.isHidden !== this.isHidden) {
        this.isHidden = state.isHidden;
      }
      if (state.isCollapsed !== this.isCollapsed) {
        this.isCollapsed = state.isCollapsed;
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.checkScreenSize();
    }, 150);
  }

  private checkScreenSize() {
    const previousMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;
    
    if (this.isMobile) {
      // En móvil: ocultar el sidebar por defecto
      this.isHidden = true;
      this.isCollapsed = false; // Cuando se muestre en móvil, debe estar expandido
    } else if (previousMobile && !this.isMobile) {
      // Al cambiar de móvil a desktop: mostrar y expandir
      this.isHidden = false;
      this.isCollapsed = false;
    }
    
    this.updateSidebarService();
  }

  private setActiveRoute() {
    this.activeRoute = this.router.url;
  }

  // Métodos para GitHub style
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    this.updateSidebarService();
  }

  hide() {
    this.isHidden = true;
    this.updateSidebarService();
  }

  show() {
    this.isHidden = false;
    this.updateSidebarService();
  }

  // Métodos legacy para compatibilidad
  toggleSidebar() {
    this.toggleCollapse();
  }

  hideSidebar() {
    this.hide();
  }

  private updateSidebarService() {
    this.sidebarService.updateSidebarState(this.isHidden, this.isCollapsed);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  isRouteActive(route: string): boolean {
    return this.activeRoute === route || this.activeRoute.startsWith(route + '/');
  }

  // TrackBy para GitHub style
  trackByMenuItem(index: number, item: any): string {
    return item.id;
  }

  // TrackBy legacy para compatibilidad
  trackByRoute(index: number, item: any): string {
    return item.route;
  }
}
