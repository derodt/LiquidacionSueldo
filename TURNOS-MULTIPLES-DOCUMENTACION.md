# Funcionalidad de Turnos Múltiples

## Descripción General

La nueva funcionalidad de **Turnos Múltiples** permite que los trabajadores puedan tener más de un turno asignado en el mismo día. Esto es especialmente útil para casos como:

- Trabajar toda la noche (19:00-07:00) + todo el día (07:00-19:00) 
- Combinar turnos de diferentes tipos y horarios
- Asignar turnos parciales que se sumen en un mismo día

## Cambios Implementados

### 1. Modelo de Datos

**Antes:**
```typescript
turnos: TurnoAgenda[][]  // [trabajador][día] = un solo turno
```

**Ahora:**
```typescript
turnos: TurnoAgenda[][][] // [trabajador][día][turno] = múltiples turnos por día
```

### 2. Nuevas Propiedades en TurnoAgenda

```typescript
export interface TurnoAgenda {
  id?: string;                // ID único para cada turno
  // ... propiedades existentes
  esTurnoMultiple?: boolean;  // Flag para turnos múltiples
  ordenEnDia?: number;        // Orden del turno en el día (1, 2, 3...)
}
```

### 3. Nueva Interfaz MultipleTurnoInfo

```typescript
export interface MultipleTurnoInfo {
  totalTurnos: number;     // Cantidad de turnos en el día
  totalHoras: number;      // Total de horas trabajadas
  tipos: string[];         // Tipos de turnos asignados
  conflictos: boolean;     // Si hay conflictos de horarios
}
```

## Funcionalidades Nuevas

### 1. Menú Contextual Mejorado

Al hacer clic en una celda del calendario, el menú contextual ahora incluye:

- **Diurno**: Asignar/quitar turno diurno (07:00-19:00)
- **Nocturno**: Asignar/quitar turno nocturno (19:00-07:00)
- **Turno Doble**: Asignar/quitar combinación noche + día (24 horas continuas)
- **Edición Avanzada**: Modal para configuración detallada
- **Limpiar Día**: Eliminar todos los turnos del día

### 2. Visualización de Turnos Múltiples

#### Desktop
- **Turno único**: Muestra el tipo de turno (TD, TN, etc.)
- **Turnos múltiples**: Muestra resumen como "TD + TN (24h)" con ícono especial 🔄

#### Mobile
- Igual que desktop pero adaptado al formato de tarjetas

### 3. Estilos Visuales

#### Turnos Múltiples
- Fondo degradado con colores combinados
- Borde azul distintivo
- Ícono 🔄 en la esquina superior derecha
- Efecto hover con escala y sombra

#### Conflictos
- Fondo con patrón de rayas para turnos con conflictos
- Animación de pulso para llamar la atención

### 4. Gestión Inteligente de Turnos

#### Toggle Behavior
- Si asignas un turno que ya existe → se elimina (toggle off)
- Si asignas un turno diferente → se agrega al día

#### Turno Doble
- Botón específico para asignar turno nocturno + diurno automáticamente
- Si ya existe turno doble → botón cambia a "Quitar Turno Doble"

## Métodos Principales Implementados

### 1. Gestión de Turnos Múltiples

```typescript
// Obtener todos los turnos de un día
getTurnosForWorkerAndDay(trabajadorId: number, dayIndex: number): TurnoAgenda[]

// Información resumida de turnos múltiples
getMultipleTurnoInfo(trabajadorId: number, dayIndex: number): MultipleTurnoInfo

// Calcular total de horas trabajadas en un día
calcularTotalHorasDelDia(turnos: TurnoAgenda[]): number

// Actualizar flags de turnos múltiples
actualizarTurnosMultiples(trabajadorIndex: number, dayIndex: number, turnos: TurnoAgenda[])
```

### 2. Nuevos Métodos del Menú Contextual

```typescript
// Asignar turno doble (noche + día)
asignarTurnoDoble(): void

// Verificar si tiene turno doble
tieneTurnoDoble(): boolean

// Verificar si tiene algún turno
tieneTurnos(): boolean

// Eliminar todos los turnos del día
eliminarTodosTurnos(): void
```

### 3. Métodos de Visualización Sobrecargados

```typescript
// Soporte para turno único o múltiples turnos
getTurnoDisplayText(turno: TurnoAgenda | TurnoAgenda[] | null): string
getTurnoIcon(turno: TurnoAgenda | TurnoAgenda[] | null): string  
getTurnoCssClass(turno: TurnoAgenda | TurnoAgenda[] | null): string
```

## Casos de Uso Típicos

### 1. Turno Doble (24 horas)

**Escenario**: Trabajador que trabaja toda la noche y todo el día
**Pasos**:
1. Clic derecho en la celda del trabajador/día
2. Seleccionar "Turno Doble (Noche + Día)"
3. Se asignan automáticamente:
   - Turno Nocturno: 19:00-07:00 (12h)
   - Turno Diurno: 07:00-19:00 (12h)
   - Total: 24 horas

### 2. Turnos Parciales Combinados

**Escenario**: Trabajador con horarios específicos en el mismo día
**Pasos**:
1. Clic derecho → "Edición Avanzada"
2. Configurar primer turno (ej: 08:00-12:00)
3. Volver a hacer clic → "Edición Avanzada" 
4. Configurar segundo turno (ej: 18:00-22:00)

### 3. Modificar Turnos Existentes

**Escenario**: Agregar o quitar turnos específicos
**Pasos**:
1. Clic derecho en celda con turnos existentes
2. Seleccionar tipo de turno:
   - Si no existe → se agrega
   - Si ya existe → se elimina (toggle)

## Limitaciones y Consideraciones

### 1. Validaciones Pendientes
- No se validan conflictos de horarios automáticamente
- No hay límites máximos de horas por día
- No se verifican regulaciones laborales

### 2. Integración con Backend
- La estructura actual es solo frontend (mock data)
- Necesario actualizar APIs para soportar múltiples turnos
- Considerar migración de datos existentes

### 3. Rendimiento
- Estructura 3D puede impactar performance con muchos trabajadores
- Considerar optimizaciones para calendarios grandes

## Próximos Pasos Sugeridos

1. **Validaciones de Negocio**
   - Implementar validación de conflictos de horarios
   - Agregar límites de horas por día/semana
   - Validar regulaciones laborales específicas

2. **Mejoras de UX**
   - Drag & drop para mover turnos entre días
   - Vista de resumen semanal con totales
   - Alertas visuales para sobrecarga de horas

3. **Integración Backend**
   - Actualizar modelos de base de datos
   - Implementar APIs para CRUD de turnos múltiples
   - Migración de datos existentes

4. **Reportes y Análisis**
   - Reportes de horas trabajadas por período
   - Análisis de turnos dobles por trabajador
   - Estadísticas de utilización de turnos múltiples

## Testing

### Manual Testing
1. Abrir calendario en http://localhost:4201
2. Agregar trabajador al calendario
3. Probar diferentes combinaciones de turnos
4. Verificar visualización en desktop y mobile

### Casos de Prueba Sugeridos
- Asignar turno doble y verificar total de 24h
- Agregar múltiples turnos personalizados
- Verificar comportamiento de toggle on/off
- Probar eliminación de todos los turnos
- Verificar responsive design en móvil

---

**Última actualización**: Septiembre 2025  
**Versión**: 1.0  
**Estado**: Implementación inicial completa
