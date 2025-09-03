import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-mobile-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mobile-header.component.html',
  styleUrls: ['./mobile-header.component.scss']
})
export class MobileHeaderComponent implements OnInit, OnDestroy {
  
  currentPageTitle = 'LiquidacionSueldo';
  isSidebarHidden = true;
  private destroy$ = new Subject<void>();

  // Mapeo de rutas a títulos
  private routeTitles: { [key: string]: string } = {
    '/dashboard': 'Dashboard',
    '/trabajadores': 'Trabajadores',
    '/liquidaciones': 'Liquidaciones',
    '/empresas': 'Empresas',
    '/agenda': 'Agenda',
    '/settings': 'Configuración',
    '/help': 'Ayuda'
  };

  constructor(
    private router: Router,
    private sidebarService: SidebarService
  ) {}

  ngOnInit() {
    // Escuchar cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.updatePageTitle();
    });

    // Escuchar estado del sidebar
    this.sidebarService.sidebarState$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(state => {
      this.isSidebarHidden = state.isHidden;
    });

    // Inicializar título
    this.updatePageTitle();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updatePageTitle() {
    const currentRoute = this.router.url;
    
    // Buscar coincidencia exacta primero
    if (this.routeTitles[currentRoute]) {
      this.currentPageTitle = this.routeTitles[currentRoute];
      return;
    }

    // Buscar coincidencia por prefijo para rutas anidadas
    for (const route in this.routeTitles) {
      if (currentRoute.startsWith(route + '/')) {
        this.currentPageTitle = this.routeTitles[route];
        return;
      }
    }

    // Título por defecto
    this.currentPageTitle = 'LiquidacionSueldo';
  }

  openSidebar() {
    this.sidebarService.showSidebar();
  }
}
