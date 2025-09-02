# Sistema de Turnos de 12 Horas - Documentación de Cambios

## 🔄 Cambios Implementados

### 1. **Sistema de Turnos de 12 Horas (Lunes a Domingo)**

#### Tipos de Turno Actualizados:
- **Turno Diurno**: 7:00 AM - 7:00 PM (12 horas)
- **Turno Nocturno**: 7:00 PM - 7:00 AM (12 horas)
- **Horas Específicas**: Horario personalizado para trabajadores de medio tiempo

#### Funcionalidades:
- ✅ Asignación de turnos completos de 12 horas
- ✅ Modal interactivo para selección de tipo de turno
- ✅ Validación automática de horarios
- ✅ Cálculo automático de horas trabajadas

### 2. **Modal de Asignación de Turnos Avanzado**

#### Características del Modal:
- **Selección de Tipo**: Radio buttons para elegir entre turno completo o horas específicas
- **Configuración Dinámica**: Horarios se actualizan automáticamente según el tipo
- **Perfiles Laborales**: Dropdown con perfiles disponibles y valor por hora
- **Validación**: Formulario reactivo con validaciones en tiempo real
- **Responsive**: Adaptado para móviles y tablets

#### Campos del Modal:
```typescript
interface TurnoModalData {
  trabajador: TrabajadorAgenda;
  fecha: Date;
  turnoActual?: TurnoAgenda;
  esEdicion: boolean;
}
```

### 3. **Modelos de Datos Actualizados**

#### PerfilLaboral Extendido:
```typescript
interface PerfilLaboral {
  id: number;
  empresaId: number;
  nombre: string;
  descripcion: string;
  valorHora: number;              // ⬅️ NUEVO
  horasSemanalesMaximas: number;  // ⬅️ NUEVO
  requiereAutorizacion: boolean;  // ⬅️ NUEVO
  activo: boolean;
}
```

#### TurnoPlanificado Mejorado:
```typescript
interface TurnoPlanificado {
  tipoTurno: 'DIURNO' | 'NOCTURNO' | 'HORAS_ESPECIFICAS'; // ⬅️ ACTUALIZADO
  esHorasEspecificas?: boolean;    // ⬅️ NUEVO
  horasEspecificas?: {             // ⬅️ NUEVO
    desde: string;
    hasta: string;
    totalHoras: number;
  };
}
```

#### TurnoAgenda Ampliado:
```typescript
interface TurnoAgenda {
  tipo: 'DIURNO' | 'NOCTURNO' | 'HORAS_ESPECIFICAS' | 'PERSONALIZADO' | null;
  esHorasEspecificas?: boolean;    // ⬅️ NUEVO
  horasEspecificas?: {             // ⬅️ NUEVO
    desde: string;
    hasta: string;
    totalHoras: number;
  };
}
```

### 4. **Componentes Nuevos**

#### TurnoModalComponent:
- **Ubicación**: `src/app/components/turno-modal/`
- **Archivos**:
  - `turno-modal.component.ts` - Lógica del modal
  - `turno-modal.component.html` - Template del modal
  - `turno-modal.component.scss` - Estilos responsivos
  - `turno-modal.component.spec.ts` - Pruebas unitarias

#### Funcionalidades del Modal:
1. **Selección de Tipo de Turno**:
   - Turno Completo (12 horas)
   - Horas Específicas (personalizado)

2. **Configuración Automática**:
   - Horarios predefinidos para turnos completos
   - Cálculo automático de horas para turnos específicos

3. **Validaciones**:
   - Formularios reactivos con Angular
   - Validación de horarios solapados
   - Verificación de límites de horas

4. **Acciones**:
   - Crear nuevo turno
   - Editar turno existente
   - Eliminar turno

### 5. **Datos Mock Actualizados**

#### Perfiles con Valores de Hora:
```typescript
const mockPerfilesLaborales = [
  {
    nombre: 'Cuidador de Abuelos',
    valorHora: 6500,
    horasSemanalesMaximas: 44
  },
  {
    nombre: 'TENS',
    valorHora: 8500,
    horasSemanalesMaximas: 44
  },
  {
    nombre: 'Personal de Aseo',
    valorHora: 5500,
    horasSemanalesMaximas: 44
  }
];
```

### 6. **Estilos Visuales Mejorados**

#### Indicadores de Turno:
- **Diurno (12h)**: ☀️ Fondo amarillo claro
- **Nocturno (12h)**: 🌙 Fondo azul claro
- **Horas Específicas**: ⏰ Fondo verde claro
- **Personalizado**: ⚙️ Fondo violeta claro

#### CSS Classes:
```scss
.turno-horas_especificas {
  background: #e0f2f1;
  color: #00695c;
  border-color: #00bfa5;
  
  .turno-text {
    font-size: 9px; // Texto más pequeño para mostrar horario
  }
}
```

## 🎯 Casos de Uso Implementados

### Caso 1: Asignación de Turno Completo
1. Usuario hace clic en celda de la agenda
2. Se abre modal con opción "Turno Completo" seleccionada
3. Usuario elige "Diurno" o "Nocturno"
4. Se asignan automáticamente 12 horas (7:00-19:00 o 19:00-7:00)
5. Usuario selecciona perfil laboral
6. Se guarda el turno

### Caso 2: Asignación de Horas Específicas
1. Usuario hace clic en celda de la agenda
2. Usuario selecciona "Horas Específicas"
3. Modal muestra campos de hora inicio y fin
4. Usuario ingresa horario (ej: 10:00 - 14:00)
5. Sistema calcula automáticamente 4 horas
6. Usuario selecciona perfil laboral
7. Se guarda con tipo "HORAS_ESPECIFICAS"

### Caso 3: Edición de Turno Existente
1. Usuario hace clic en celda con turno asignado
2. Modal se abre en modo edición con datos actuales
3. Usuario puede modificar tipo, horario o perfil
4. Opción de eliminar turno disponible
5. Cambios se reflejan inmediatamente en la agenda

## 🔧 Configuración Técnica

### Dependencias Agregadas:
- `@angular/material/dialog` - Para modales
- `@angular/material/radio` - Para selección de tipo
- `@angular/forms` - Para formularios reactivos

### Imports Requeridos:
```typescript
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { TurnoModalComponent } from '../turno-modal/turno-modal.component';
```

### Configuración del Modal:
```typescript
const dialogRef = this.dialog.open(TurnoModalComponent, {
  width: '600px',
  maxWidth: '90vw',
  data: dialogData,
  panelClass: 'turno-modal-dialog'
});
```

## 📱 Responsive Design

### Breakpoints:
- **Desktop** (>1200px): Modal completo con layout de 2 columnas
- **Tablet** (768px-1200px): Modal adaptado con layout vertical
- **Mobile** (<768px): Modal full-width con controles simplificados

### Adaptaciones Móviles:
- Campos de hora en una sola columna
- Botones de acción apilados verticalmente
- Texto más grande para facilitar la lectura
- Controles táctiles optimizados

## 🧪 Testing

### Casos de Prueba Incluidos:
1. **Creación de modal**: Verificar inicialización correcta
2. **Validación de formularios**: Campos requeridos y validaciones
3. **Cálculo de horas**: Verificar cálculo automático de diferencia de horas
4. **Guardado de datos**: Verificar estructura de datos retornada
5. **Casos límite**: Turnos que cruzan medianoche

### Comandos de Testing:
```bash
# Ejecutar pruebas
ng test

# Pruebas con coverage
ng test --code-coverage

# Pruebas en modo headless
ng test --watch=false --browsers=ChromeHeadless
```

## 🚀 Próximos Pasos

### Funcionalidades Pendientes:
1. **Validaciones Avanzadas**:
   - Verificar límites de horas semanales/mensuales
   - Detectar conflictos de horarios
   - Validar permisos por perfil laboral

2. **Cálculos de Liquidación**:
   - Integrar valores por hora del perfil
   - Calcular recargos por feriados
   - Aplicar factores de turno nocturno

3. **Mejoras UX**:
   - Arrastrar y soltar para reasignar turnos
   - Vista de calendario semanal
   - Notificaciones de conflictos en tiempo real

4. **Integración Backend**:
   - Conectar con API real
   - Sincronización en tiempo real
   - Validaciones del servidor

## 📋 Checklist de Implementación

- ✅ Modal de asignación de turnos
- ✅ Tipos de turno (Completo/Horas específicas)
- ✅ Cálculo automático de horas
- ✅ Integración con perfiles laborales
- ✅ Estilos responsive
- ✅ Validaciones de formulario
- ✅ Pruebas unitarias básicas
- ✅ Documentación técnica

---

**Estado**: ✅ Implementación Completa  
**Versión**: 2.0.0-beta  
**Última actualización**: Septiembre 2025
