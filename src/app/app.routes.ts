import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TrabajadoresComponent } from './pages/trabajadores/trabajadores.component';
import { LiquidacionesComponent } from './pages/liquidaciones/liquidaciones.component';
import { EmpresasComponent } from './pages/empresas/empresas.component';
import { AgendaPageComponent } from './pages/agenda/agenda-page.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'trabajadores', component: TrabajadoresComponent },
  { path: 'liquidaciones', component: LiquidacionesComponent },
  { path: 'empresas', component: EmpresasComponent },
  { path: 'agenda', component: AgendaPageComponent },
  { path: '**', redirectTo: '/dashboard' }
];
