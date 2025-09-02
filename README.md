# Sistema de Liquidación de Sueldos - Frontend

Este es el frontend del Sistema de Liquidación de Sueldos desarrollado en Angular 17 con Material Design. El sistema está diseñado para gestionar turnos de trabajo y calcular liquidaciones automáticamente.

## 🚀 Características Principales

- **Gestión de Agenda**: Calendario interactivo para planificar turnos mensuales
- **Multi-empresa**: Soporte para múltiples empresas e instalaciones
- **Perfiles Laborales**: Configuración de diferentes tipos de trabajadores (TENS, Cuidadores, etc.)
- **Cálculo Automático**: Liquidaciones con recargos por feriados
- **Responsive Design**: Optimizado para desktop, tablet y móvil
- **Testing Completo**: Pruebas unitarias con mocks

## 🛠️ Tecnologías Utilizadas

- **Angular 17**: Framework principal con standalone components
- **Angular Material**: Biblioteca de componentes UI
- **TypeScript**: Lenguaje de programación tipado
- **SCSS**: Preprocesador CSS
- **Jasmine/Karma**: Framework de testing
- **RxJS**: Programación reactiva

## 📋 Requisitos Previos

- Node.js >= 18.x
- npm >= 9.x
- Angular CLI >= 17.x

## ⚡ Instalación y Configuración

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo**
   ```bash
   ng serve
   ```
   La aplicación estará disponible en `http://localhost:4200`

3. **Compilar para producción**
   ```bash
   ng build --configuration production
   ```

## 🧪 Testing

### Ejecutar todas las pruebas
```bash
ng test
```

### Ejecutar pruebas en modo headless
```bash
ng test --watch=false --browsers=ChromeHeadless
```

### Ejecutar pruebas con coverage
```bash
ng test --code-coverage --watch=false --browsers=ChromeHeadless
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/          # Componentes reutilizables
│   │   └── agenda/         # Componente de agenda principal
│   ├── models/             # Interfaces y tipos TypeScript
│   ├── mocks/              # Datos simulados para testing
│   ├── pages/              # Páginas principales
│   │   └── dashboard/      # Dashboard principal
│   ├── services/           # Servicios HTTP y lógica de negocio
│   └── app.config.ts       # Configuración de la aplicación
├── assets/                 # Recursos estáticos
└── styles.scss            # Estilos globales
```

## 🎯 Funcionalidades Implementadas

### ✅ Gestión de Agenda
- Calendario mensual interactivo
- Asignación de turnos por trabajador
- Validaciones en tiempo real
- Indicadores visuales para feriados
- Diferentes tipos de turno (Diurno, Nocturno, Personalizado)

### ✅ Modelos de Datos
- Empresas e instalaciones
- Trabajadores y perfiles laborales
- Turnos planificados y realizados
- Liquidaciones con detalles

### ✅ Servicios con Mocks
- `EmpresaService`: Gestión de empresas
- `AgendaService`: Manejo de turnos y agenda
- `AuthService`: Autenticación y autorización

### ✅ Testing
- Pruebas unitarias para componentes
- Mocks para servicios
- Cobertura de casos principales

## 🔧 Configuración de Desarrollo

### Variables de Entorno
El proyecto está configurado para usar mocks por defecto. Para conectar con un backend real:

1. Actualizar las URLs en los servicios (actualmente `http://localhost:3000/api`)
2. Reemplazar los mocks por llamadas HTTP reales
3. Configurar autenticación JWT

## 🚧 Próximas Funcionalidades

- [ ] Modal de asignación de turnos avanzado
- [ ] Módulo de trabajadores completo
- [ ] Generador de liquidaciones
- [ ] Reportes y exportación
- [ ] Autenticación con JWT
- [ ] Notificaciones push

## 🏗️ Estado del Proyecto

**Versión Actual**: 1.0.0-alpha  
**Estado**: En desarrollo activo  
**Última actualización**: Septiembre 2025

---

Generado con [Angular CLI](https://github.com/angular/angular-cli) version 17.3.17
