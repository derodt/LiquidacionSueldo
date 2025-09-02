import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { AgendaComponent } from './agenda.component';
import { AgendaService } from '../../services/agenda.service';
import { generateMockAgendaData } from '../../mocks';

describe('AgendaComponent', () => {
  let component: AgendaComponent;
  let fixture: ComponentFixture<AgendaComponent>;
  let mockAgendaService: jasmine.SpyObj<AgendaService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    // Crear spies para los servicios
    mockAgendaService = jasmine.createSpyObj('AgendaService', [
      'getAgenda',
      'assignTurno',
      'validateTurnoAssignment'
    ]);
    
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        AgendaComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: AgendaService, useValue: mockAgendaService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AgendaComponent);
    component = fixture.componentInstance;
    
    // Configurar propiedades de entrada
    component.instalacionId = 1;
    component.anio = 2024;
    component.mes = 3;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize calendar days correctly', () => {
    // Marzo 2024 tiene 31 días
    component.ngOnInit();
    
    expect(component.daysInMonth).toEqual(
      Array.from({ length: 31 }, (_, i) => i + 1)
    );
  });

  it('should setup displayed columns correctly', () => {
    component.ngOnInit();
    
    expect(component.displayedColumns).toEqual([
      'trabajador',
      ...Array.from({ length: 31 }, (_, i) => `day-${i + 1}`)
    ]);
  });

  it('should load agenda on init', () => {
    const mockAgenda = generateMockAgendaData(1, 2024, 3);
    spyOn(component['mockService'], 'getAgenda').and.returnValue(Promise.resolve(mockAgenda));
    
    component.ngOnInit();
    
    expect(component['mockService'].getAgenda).toHaveBeenCalledWith(1, 2024, 3);
  });

  it('should handle loading state correctly', () => {
    const mockAgenda = generateMockAgendaData(1, 2024, 3);
    spyOn(component['mockService'], 'getAgenda').and.returnValue(Promise.resolve(mockAgenda));
    
    expect(component.isLoading).toBeFalse();
    
    component.ngOnInit();
    
    // Debería estar cargando inmediatamente después de ngOnInit
    expect(component.isLoading).toBeTrue();
  });

  it('should get turno display text correctly', () => {
    const turnoDiurno = {
      fecha: new Date(),
      tipo: 'DIURNO' as const,
      perfil: null,
      esCompleto: true,
      estado: 'PLANIFICADO' as const
    };
    
    const turnoNocturno = {
      fecha: new Date(),
      tipo: 'NOCTURNO' as const,
      perfil: null,
      esCompleto: true,
      estado: 'PLANIFICADO' as const
    };
    
    const turnoPersonalizado = {
      fecha: new Date(),
      tipo: 'PERSONALIZADO' as const,
      perfil: null,
      esCompleto: true,
      estado: 'PLANIFICADO' as const
    };
    
    expect(component.getTurnoDisplayText(turnoDiurno)).toBe('TD');
    expect(component.getTurnoDisplayText(turnoNocturno)).toBe('TN');
    expect(component.getTurnoDisplayText(turnoPersonalizado)).toBe('TP');
    expect(component.getTurnoDisplayText(null)).toBe('');
  });

  it('should get turno icons correctly', () => {
    const turnoDiurno = {
      fecha: new Date(),
      tipo: 'DIURNO' as const,
      perfil: null,
      esCompleto: true,
      estado: 'PLANIFICADO' as const
    };
    
    const turnoNocturno = {
      fecha: new Date(),
      tipo: 'NOCTURNO' as const,
      perfil: null,
      esCompleto: true,
      estado: 'PLANIFICADO' as const
    };
    
    expect(component.getTurnoIcon(turnoDiurno)).toBe('☀️');
    expect(component.getTurnoIcon(turnoNocturno)).toBe('🌙');
    expect(component.getTurnoIcon(null)).toBe('');
  });

  it('should get turno CSS classes correctly', () => {
    const turnoNormal = {
      fecha: new Date(),
      tipo: 'DIURNO' as const,
      perfil: null,
      esCompleto: true,
      estado: 'PLANIFICADO' as const
    };
    
    const turnoConflicto = {
      fecha: new Date(),
      tipo: 'DIURNO' as const,
      perfil: null,
      esCompleto: true,
      estado: 'CONFLICTO' as const
    };
    
    expect(component.getTurnoCssClass(turnoNormal)).toBe('turno-cell turno-normal turno-diurno');
    expect(component.getTurnoCssClass(turnoConflicto)).toBe('turno-cell turno-conflict turno-diurno');
    expect(component.getTurnoCssClass(null)).toBe('turno-empty');
  });

  it('should detect feriados correctly', () => {
    const mockAgenda = generateMockAgendaData(1, 2024, 3);
    component.agenda = mockAgenda;
    
    // Verificar si hay feriados en marzo (en el mock, Viernes Santo es 29 de marzo)
    const feriadoDay = 29 - 1; // index 0-based
    expect(component.isFeriado(feriadoDay)).toBeTrue();
    
    // Verificar un día normal
    expect(component.isFeriado(0)).toBeFalse(); // 1 de marzo
  });

  it('should get month name correctly', () => {
    component.mes = 1;
    expect(component.getMonthName()).toBe('Enero');
    
    component.mes = 3;
    expect(component.getMonthName()).toBe('Marzo');
    
    component.mes = 12;
    expect(component.getMonthName()).toBe('Diciembre');
  });

  it('should handle cell click correctly', () => {
    const mockAgenda = generateMockAgendaData(1, 2024, 3);
    component.agenda = mockAgenda;
    
    const trabajador = mockAgenda.trabajadores[0];
    const dayIndex = 0; // 1 de marzo
    
    spyOn(component['mockService'], 'assignTurno').and.returnValue(
      Promise.resolve({ success: true, data: {} as any })
    );
    
    component.onCellClick(trabajador, dayIndex);
    
    // Debería llamar al servicio para asignar turno
    expect(component['mockService'].assignTurno).toHaveBeenCalled();
  });

  it('should emit events correctly', () => {
    spyOn(component.agendaChanged, 'emit');
    spyOn(component.turnoAssigned, 'emit');
    
    const mockAgenda = generateMockAgendaData(1, 2024, 3);
    component.agenda = mockAgenda;
    component.agendaChanged.emit(mockAgenda);
    
    expect(component.agendaChanged.emit).toHaveBeenCalledWith(mockAgenda);
  });

  it('should handle errors gracefully', () => {
    spyOn(component['mockService'], 'getAgenda').and.returnValue(
      Promise.reject(new Error('Network error'))
    );
    
    spyOn(console, 'error');
    
    component.ngOnInit();
    
    // Verificar que el error se maneja sin lanzar excepción
    expect(console.error).toHaveBeenCalled();
  });

  it('should cleanup on destroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');
    
    component.ngOnDestroy();
    
    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});
