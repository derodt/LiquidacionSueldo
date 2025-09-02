import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

import { MenuContextualTurnoComponent, MenuContextualData } from './menu-contextual-turno.component';
import { TrabajadorAgenda, TurnoAgenda } from '../../models/agenda.model';
import { PerfilLaboral } from '../../models/trabajador.model';

describe('MenuContextualTurnoComponent', () => {
  let component: MenuContextualTurnoComponent;
  let fixture: ComponentFixture<MenuContextualTurnoComponent>;

  const mockPerfil: PerfilLaboral = {
    id: 1,
    empresaId: 1,
    nombre: 'Técnico Senior',
    descripcion: 'Técnico especializado',
    valorHora: 5000,
    horasSemanalesMaximas: 60,
    requiereAutorizacion: false,
    activo: true
  };

  const mockTrabajador: TrabajadorAgenda = {
    id: 1,
    rut: '12345678-9',
    nombreCompleto: 'Juan Pérez',
    perfilesDisponibles: [mockPerfil],
    perfilPrimario: mockPerfil,
    limitesHoras: {
      diarias: 12,
      semanales: 60,
      mensuales: 200
    }
  };

  const mockTurno: TurnoAgenda = {
    fecha: new Date(2024, 0, 15),
    tipo: 'DIURNO',
    perfil: mockPerfil,
    horaInicio: '07:00',
    horaFin: '19:00',
    esCompleto: true,
    estado: 'PLANIFICADO'
  };

  const mockData: MenuContextualData = {
    trabajador: mockTrabajador,
    fecha: new Date(2024, 0, 15),
    turnoActual: mockTurno,
    position: { x: 100, y: 200 }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MenuContextualTurnoComponent,
        NoopAnimationsModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatDividerModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuContextualTurnoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.isVisible).toBe(false);
    expect(component.data).toBeDefined();
    expect(component.opcionesRapidas).toBeDefined();
    expect(component.opcionesRapidas.length).toBeGreaterThan(0);
  });

  it('should format fecha correctly', () => {
    const fecha = new Date(2024, 0, 15); // 15 de enero 2024
    component.data = { ...mockData, fecha };
    component.ngOnInit();
    
    expect(component.fechaFormateada).toBeDefined();
  });

  it('should generate turno rapido correctly for DIURNO', () => {
    component.data = mockData;
    
    const turno = component.generarTurnoRapido('DIURNO');
    
    expect(turno.tipo).toBe('DIURNO');
    expect(turno.horaInicio).toBe('07:00');
    expect(turno.horaFin).toBe('19:00');
    expect(turno.perfil).toBe(mockTrabajador.perfilPrimario);
    expect(turno.esCompleto).toBe(true);
  });

  it('should generate turno rapido correctly for NOCTURNO', () => {
    component.data = mockData;
    
    const turno = component.generarTurnoRapido('NOCTURNO');
    
    expect(turno.tipo).toBe('NOCTURNO');
    expect(turno.horaInicio).toBe('19:00');
    expect(turno.horaFin).toBe('07:00');
    expect(turno.perfil).toBe(mockTrabajador.perfilPrimario);
    expect(turno.esCompleto).toBe(true);
  });

  it('should have predefined opciones rapidas', () => {
    expect(component.opcionesRapidas.length).toBe(2);
    
    const diurno = component.opcionesRapidas.find(o => o.tipo === 'DIURNO');
    const nocturno = component.opcionesRapidas.find(o => o.tipo === 'NOCTURNO');
    
    expect(diurno).toBeDefined();
    expect(nocturno).toBeDefined();
    
    expect(diurno?.horaInicio).toBe('07:00');
    expect(diurno?.horaFin).toBe('19:00');
    expect(nocturno?.horaInicio).toBe('19:00');
    expect(nocturno?.horaFin).toBe('07:00');
  });

  it('should call asignarTurnoRapido when option selected', () => {
    spyOn(component, 'asignarTurnoRapido');
    component.data = mockData;
    
    const opcion = component.opcionesRapidas[0];
    component.onSeleccionarOpcion(opcion);
    
    expect(component.asignarTurnoRapido).toHaveBeenCalledWith(opcion);
  });

  it('should call editarTurnoActual when edit clicked', () => {
    spyOn(component, 'editarTurnoActual');
    
    component.onEditarTurno();
    
    expect(component.editarTurnoActual).toHaveBeenCalled();
  });

  it('should call eliminarTurnoActual when delete clicked', () => {
    spyOn(component, 'eliminarTurnoActual');
    
    component.onEliminarTurno();
    
    expect(component.eliminarTurnoActual).toHaveBeenCalled();
  });

  it('should call cerrarMenu when close clicked', () => {
    spyOn(component, 'cerrarMenu');
    
    component.onCerrar();
    
    expect(component.cerrarMenu).toHaveBeenCalled();
  });

  it('should check if trabajador has turno correctly', () => {
    component.data = { ...mockData, turnoActual: mockTurno };
    expect(component.tieneTurnoAsignado).toBe(true);
    
    component.data = { ...mockData, turnoActual: undefined };
    expect(component.tieneTurnoAsignado).toBe(false);
  });

  it('should return correct turno info display text', () => {
    component.data = { ...mockData, turnoActual: mockTurno };
    
    const info = component.turnoInfo;
    expect(info.tipo).toContain('Turno Diurno');
    expect(info.horario).toContain('07:00');
    expect(info.horario).toContain('19:00');
  });
});
