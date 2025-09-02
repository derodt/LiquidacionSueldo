import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TurnoModalComponent, TurnoModalData } from './turno-modal.component';
import { TrabajadorAgenda } from '../../models/agenda.model';
import { PerfilLaboral } from '../../models/trabajador.model';

describe('TurnoModalComponent', () => {
  let component: TurnoModalComponent;
  let fixture: ComponentFixture<TurnoModalComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<TurnoModalComponent>>;

  const mockPerfiles: PerfilLaboral[] = [
    {
      id: 1,
      nombre: 'TENS',
      descripcion: 'Técnico en Enfermería de Nivel Superior',
      valorHora: 8000,
      horasSemanalesMaximas: 44,
      requiereAutorizacion: false,
      activo: true
    },
    {
      id: 2,
      nombre: 'Cuidador',
      descripcion: 'Cuidador de Personas Mayores',
      valorHora: 6000,
      horasSemanalesMaximas: 44,
      requiereAutorizacion: false,
      activo: true
    }
  ];

  const mockTrabajador: TrabajadorAgenda = {
    id: 1,
    rut: '12345678-9',
    nombreCompleto: 'Juan Pérez González',
    perfilesDisponibles: mockPerfiles,
    limitesHoras: {
      semanales: 44,
      mensuales: 180
    }
  };

  const mockData: TurnoModalData = {
    trabajador: mockTrabajador,
    fecha: new Date(2024, 2, 15), // 15 de marzo 2024
    esEdicion: false
  };

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        TurnoModalComponent,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TurnoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.turnoForm.get('tipoTurno')?.value).toBe('DIURNO');
    expect(component.turnoForm.get('esCompleto')?.value).toBe(true);
    expect(component.turnoForm.get('horaInicio')?.value).toBe('07:00');
    expect(component.turnoForm.get('horaFin')?.value).toBe('19:00');
    expect(component.turnoForm.get('totalHoras')?.value).toBe(12);
  });

  it('should display trabajador information', () => {
    expect(component.data.trabajador.nombreCompleto).toBe('Juan Pérez González');
    expect(component.perfilesDisponibles.length).toBe(2);
  });

  it('should handle turno completo selection', () => {
    component.turnoForm.patchValue({ esCompleto: true, tipoTurno: 'NOCTURNO' });
    component.onTipoTurnoChange();
    
    expect(component.turnoForm.get('horaInicio')?.value).toBe('19:00');
    expect(component.turnoForm.get('horaFin')?.value).toBe('07:00');
    expect(component.turnoForm.get('totalHoras')?.value).toBe(12);
  });

  it('should handle horas específicas selection', () => {
    component.turnoForm.patchValue({ esCompleto: false });
    component.onEsCompletoChange();
    
    expect(component.turnoForm.get('tipoTurno')?.value).toBe('HORAS_ESPECIFICAS');
    expect(component.turnoForm.get('horaInicio')?.value).toBe('08:00');
    expect(component.turnoForm.get('horaFin')?.value).toBe('12:00');
    expect(component.turnoForm.get('totalHoras')?.value).toBe(4);
  });

  it('should calculate hours correctly', () => {
    const horas = component['calcularDiferenciaHoras']('08:00', '16:00');
    expect(horas).toBe(8);
  });

  it('should calculate overnight hours correctly', () => {
    const horas = component['calcularDiferenciaHoras']('22:00', '06:00');
    expect(horas).toBe(8);
  });

  it('should save turno completo correctly', () => {
    component.turnoForm.patchValue({
      tipoTurno: 'DIURNO',
      perfilId: 1,
      esCompleto: true,
      observaciones: 'Turno de prueba'
    });

    component.onSave();

    expect(mockDialogRef.close).toHaveBeenCalledWith({
      tipo: 'DIURNO',
      perfil: mockPerfiles[0],
      esCompleto: true,
      observaciones: 'Turno de prueba'
    });
  });

  it('should save horas específicas correctly', () => {
    component.turnoForm.patchValue({
      tipoTurno: 'HORAS_ESPECIFICAS',
      perfilId: 2,
      esCompleto: false,
      horaInicio: '10:00',
      horaFin: '14:00',
      totalHoras: 4,
      observaciones: 'Medio turno'
    });

    component.onSave();

    expect(mockDialogRef.close).toHaveBeenCalledWith({
      tipo: 'HORAS_ESPECIFICAS',
      perfil: mockPerfiles[1],
      esCompleto: false,
      horasEspecificas: {
        desde: '10:00',
        hasta: '14:00',
        totalHoras: 4
      },
      observaciones: 'Medio turno'
    });
  });

  it('should cancel dialog', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalledWith();
  });

  it('should delete turno when editing', () => {
    component.data.esEdicion = true;
    component.onEliminar();
    expect(mockDialogRef.close).toHaveBeenCalledWith('DELETE');
  });

  it('should format fecha correctly', () => {
    const fechaFormateada = component.fechaFormateada;
    expect(fechaFormateada).toContain('viernes');
    expect(fechaFormateada).toContain('marzo');
    expect(fechaFormateada).toContain('2024');
  });
});
