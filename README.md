# PastryFlora - Sistema de Gestión de Pastelería

PastryFlora es un sistema integral de punto de venta (POS) y planificación de recursos empresariales (ERP) diseñado específicamente para la gestión de sucursales de pastelerías y panaderías. El sistema estructura todo el flujo operativo, desde la asistencia de recursos humanos hasta las ventas y la producción diaria.

## 🏗️ Arquitectura del Sistema

El proyecto sigue una arquitectura Cliente-Servidor separada en dos repositorios principales (Frontend y Backend), utilizando tecnologías modernas basadas en TypeScript.

### 1. Frontend (`PastryFloraFront`)
- **Tecnologías:** React, Vite, TypeScript, Tailwind CSS, Headless UI / Heroicons.
- **Estructura:** Single Page Application (SPA).
- **Patrones:** 
  - Organización modular por características (features): `customers`, `hr`, `sales`, `users`.
  - Consumo de API mediante cliente Axios configurado globalmente (`src/api/axios.ts`).
  - Separación de capa lógica de UI a través de `hooks` personalizados y `services`.
  - Rutas protegidas y jerarquía de vistas usando React Router (`AppRouter.tsx`).

### 2. Backend (`PastryFloraBack`)
- **Tecnologías:** Node.js, Express, TypeScript, MySQL2 (Promises).
- **Estructura Arquitectónica (Capas):**
  - **Rutas (`routes`):** Exponen los endpoints RESTful para recursos específicos (ej. `/api/hr/attendance`).
  - **Controladores (`controllers`):** Validan peticiones entrantes, extraen el usuario autenticado (JWT) y gestionan las respuestas HTTP y sus códigos de estado.
  - **Servicios (`services`):** Concentran la **Lógica de Negocio**. Realizan cálculos (ej. deducciones, sumatorias de tickets, horas trabajadas basándose en el Check-in/Check-out).
  - **Repositorios (`repositories`):** Capa de acceso a datos (Data Access Layer). Encapsula y aísla las consultas SQL directas contra los modelos, facilitando cambios futuros al motor PDO de Base de Datos.
  - **Modelos (`models`):** Definición estática de las interfaces/tipos que mapean a las tablas para el autocompletado en TypeScript.

### 3. Base de Datos (MySQL - Dockerized)
- Emplea un contenedor Docker `mysql:8.0` con volumen persistente.
- El sistema utiliza Eventos de Base de Datos (Event Scheduler) para rutinas autónomas, como por ejemplo la generación de nóminas estructuradas de forma mensual.

---

## 💼 Lógica de Negocio y Módulos Principales

### A. Módulo de Recursos Humanos (RRHH)
Gestiona el personal de la pastelería, estructurándose en:
- **Roles y Permisos:** `ADMIN`, `SUPERVISOR`, `CONTADOR`, `PANADERO`, `DECORADOR`, `SELLER` (Vendedor) y `REFILL` (Reabastecedor). Cada rol tiene responsabilidades asignadas y sueldos predefinidos.
- **Asistencia (Attendance):**
  - Registro diario de hora de entrada (`check_in`) y salida (`check_out`).
  - Lógica automática en el servicio: Evalúa si un empleado se presenta tarde (LATE), trabajó medio turno (HALF_DAY), o faltó (ABSENT).
- **Nóminas y Salarios (Payroll):**
  - Consolidación del salario de los empleados en base a un periodo de pago (Start/End Date).
  - Integración de bonos y penalizaciones.
  - **Automatización MySQL:** Un evento automático (`generate_monthly_payroll`) toma a todos los empleados activos y les genera su nómina programada con estado `PENDING` (Pendiente). Implementa deducciones lógicas, como por ejemplo asignar de forma automatizada un aguinaldo o bono navideño en Diciembre.

### B. Módulo de Ventas y Clientes (Sales / Customers)
- **Sucursales (Branches):** Toda venta está obligatoriamente arraigada a una Sucursal para cuadre de caja (Constraint `branch_id`).
- **Registro de Clientes:** Mantiene una base de datos de usuarios recurrentes con su Carnet de Identidad (CI), correo, teléfono y el historial de compras para posteriores análisis comerciales.
- **Transacciones de Venta:**
  1. El vendedor (Seller) registra la cabecera de la venta.
  2. A través de transacciones conjuntas, inserta el abanico de sub-productos (`sale_products`), registrando los precios unitarios al momento y aplicando los subtotales automáticamente por cantidad.

### C. Módulo de Inventario y Producción (Production / Inventory)
- **Catálogo de Productos:** Pasteles, tortas y postres disponibles con categorización y precio estándar.
- **Producción Diaria:** Cada `Panadero` o `Decorador` puede registrar la cantidad diaria de productos finalizados contra órdenes requeridas.
- **Insumos y Logística:** Existen tablas dedicadas para registrar los materiales disponibles en tienda y gestionar *Envíos/Distribuciones (`branch_distributions`)* desde la planta general a las pequeñas sucursales vendedoras.
