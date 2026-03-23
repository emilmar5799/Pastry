# GUÍA DE PRUEBAS DEL MÓDULO RRHH

## 🚀 Inicio Rápido

### Backend - Ejecutar servidor
```bash
cd PastryFloraBack
npm install
npm run dev
```
Puerto: `http://localhost:3000`

### Frontend - Ejecutar servidor
```bash
cd PastryFloraFront
npm install
npm run dev
```
Puerto: `http://localhost:5173`

---

## 📋 Pruebas Manuales

### 1️⃣ MÓDULO: EMPLEADOS

#### 1.1 Crear Empleado
- Navegar a: **http://localhost:5173/hr/employees**
- Click en "Nuevo Empleado"
- Completar formulario:
  - Usuario: (seleccionar de lista)
  - Fecha Contratación: 2026-01-15
  - Posición: Vendedor
  - Departamento: Ventas
  - Tipo Contrato: Tiempo Completo
- Click "Crear"
- ✅ Esperado: Mensaje de éxito y empleado en tabla

#### 1.2 Editar Empleado
- En tabla de empleados, click en ✏️ (editar)
- Cambiar Posición: "Gerente de Ventas"
- Click "Actualizar"
- ✅ Esperado: Cambios reflejados en tabla

#### 1.3 Eliminar Empleado
- Click en 🗑️ (eliminar)
- Confirmar en modal
- ✅ Esperado: Empleado eliminado de tabla

#### 1.4 Filtrar por Departamento
- Click en "Actualizar"
- Cambiar URL a: `.../hr/employees?department=Ventas`
- ✅ Esperado: Solo empleados del departamento Ventas

---

### 2️⃣ MÓDULO: ASISTENCIA

#### 2.1 Registrar Asistencia
- Navegar a: **http://localhost:5173/hr/attendance**
- Click "Registrar Asistencia"
- Completar:
  - Empleado: (seleccionar)
  - Fecha: 2026-03-20
  - Hora Entrada: 09:00
  - Hora Salida: 17:00
- Click "Crear"
- ✅ Esperado: Horas calculadas automáticamente (8.0h)

#### 2.2 Registrar Tarde
- Fecha: 2026-03-21
- Entrada: 09:30 (después de 9:00)
- Salida: 17:30
- ✅ Esperado: Estado = "LATE"

#### 2.3 Registrar Ausencia
- No llenar Entrada ni Salida
- ✅ Esperado: Estado = "ABSENT", Horas = 0

#### 2.4 Editar Registro
- Click ✏️ en registro
- Cambiar hora salida: 16:00
- ✅ Esperado: Horas recalculadas

---

### 3️⃣ MÓDULO: SALARIOS

#### 3.1 Calcular Primera Nómina
- Navegar a: **http://localhost:5173/hr/payroll**
- Click "Calcular Nómina"
- Completar:
  - Empleado: (seleccionar)
  - Período Inicio: 2026-03-01
  - Período Fin: 2026-03-31
- Click "Calcular Nómina"
- ✅ Esperado: Nómina creada con estado PENDING

#### 3.2 Validar Cálculos
- Verificar en tabla:
  - Salario Base: valor de users.salary
  - Horas Extra: cálculos >= 160 horas / mes
  - Total Ganancia: base + (horas_extra × 1.5)
  - Neto: total - deducibles
- ✅ Esperado: Cálculos correctos

#### 3.3 Marcar Como Pagada
- Click ✅ en nómina PENDING
- Confirmar en modal
- ✅ Esperado: Estado cambia a "PAID", fecha pago registrada

#### 3.4 Validar Protección
- Intentar eliminar nómina PAID
- ✅ Esperado: Error "Cannot delete paid payroll"

#### 3.5 Filtrar por Estado
- URL: `.../hr/payroll?status=PAID`
- ✅ Esperado: Solo nóminas pagadas

---

### 4️⃣ MÓDULO: BONIFICACIONES

#### 4.1 Crear Bono Desempeño
- Navegar a: **http://localhost:5173/hr/bonuses**
- Click "Nuevo Bono"
- Completar:
  - Empleado: (seleccionar)
  - Monto: 500
  - Tipo: Desempeño
  - Fecha: 2026-03-20
- Click "Crear"
- ✅ Esperado: Bono creado con tipo PERFORMANCE

#### 4.2 Crear Bono Especial (con validación)
- Tipo: Especial
- Dejar Motivo vacío
- Click "Crear"
- ✅ Esperado: Error "requiere un motivo"

#### 4.3 Crear Bono con Motivo Válido
- Tipo: Especial
- Motivo: Cumpleaños empresa
- ✅ Esperado: Bono creado correctamente

#### 4.4 Validar Montos Negativos
- Monto: -100
- ✅ Esperado: Error "mayor a 0"

#### 4.5 Editar Bono
- Click ✏️
- Cambiar Monto: 600
- ✅ Esperado: Cantidad actualizada

---

## 🔐 Pruebas de Autenticación & Autorización

### 5.1 Acceso Solo SUPERVISOR/ADMIN
- Login como SELLER
- Intentar acceder a `/hr/employees`
- ✅ Esperado: Redirigido a "/"

### 5.2 Acceso SUPERVISOR Correcto
- Login como SUPERVISOR
- Acceder a `/hr/employees`
- ✅ Esperado: Acceso concedido

### 5.3 Acceso ADMIN Completo
- Login como ADMIN
- Todas las rutas `/hr/*` funcionan
- ✅ Esperado: Acceso total

### 5.4 Session Expirada
- Eliminar token del localStorage
- Intentar usar API
- ✅ Esperado: Redirigido a `/login`

---

## 🐛 Pruebas de Validación

### 6.1 Validaciones en Formularios
- Campo vacío + Click crear
- ✅ Esperado: Validación HTML5 (required)

### 6.2 Fechas Futuras
- Fecha de contratación mayor a hoy
- ✅ Esperado: Error en backend

### 6.3 Período Salario Inverso
- Inicio > Fin
- ✅ Esperado: Error "debe ser anterior"

### 6.4 Empleado Duplicado
- Crear mismo usuario como empleado 2 veces
- ✅ Esperado: Error foreign key unique

---

## 🔄 Pruebas de UI

### 7.1 Estados de Carga
- Click "Actualizar"
- Botón debe mostrar spinner
- ✅ Esperado: Disabled durante request

### 7.2 Modales de Confirmación
- Click delete
- Modal aparece con avertencia
- Click Cancel → Modal cierra
- ✅ Esperado: Comportamiento correcto

### 7.3 Mensajes de Error
- Ejecutar una acción inválida
- ✅ Esperado: Alert rojo descriptivo en página

### 7.4 Mensajes de Éxito
- Crear un empleado válido
- ✅ Esperado: Modal verde con confirmación

---

## 📊 Pruebas de Datos

### 8.1 Verificar Datos en BD
```sql
-- Conectar a MySQL en PhpMyAdmin o CLI
USE Pastry;
SELECT * FROM employees;
SELECT * FROM attendance;
SELECT * FROM payroll;
SELECT * FROM bonuses;
```

### 8.2 Verificar API Responses
```bash
# Listar empleados
curl -H "Authorization: Bearer <TOKEN>" http://localhost:3000/api/hr/employees

# Listar asistencia
curl -H "Authorization: Bearer <TOKEN>" http://localhost:3000/api/hr/attendance

# Listar nóminas
curl -H "Authorization: Bearer <TOKEN>" http://localhost:3000/api/hr/payroll

# Listar bonos
curl -H "Authorization: Bearer <TOKEN>" http://localhost:3000/api/hr/bonuses
```

---

## ⚡ Pruebas de Rendimiento

### 9.1 Carga de 100+ empleados
- Crear múltiples empleados
- Navegar a `/hr/employees`
- ✅ Esperado: Página carga en <2 segundos

### 9.2 Tabla responsiva
- Redimensionar ventana a móvil (375px)
- Scroll horizontal debe funcionar
- ✅ Esperado: Layout correcto

---

## 📸 Casos de Prueba Adicionales

### 10.1 Flujo Completo HR
1. Crear empleado ✅
2. Registrar asistencia 5 días ✅
3. Calcular nómina de período ✅
4. Registrar bono desempeño ✅
5. Marcar nómina pagada ✅
6. ✅ Esperado: Todo integrado correctamente

### 10.2 Edge Cases
- Empleado sin asistencia → Nómina con 0 horas
- Bono aplicado a empleado no registrado
- Eliminar asistencia de empleado con nómina

---

## 📝 Matriz de Pruebas

| Módulo | Crear | Leer | Actualizar | Eliminar | Filtros | Validación |
|--------|-------|------|-----------|----------|---------|-----------|
| Empleados | ✅ | ✅ | ✅ | ✅ | Depto | SI |
| Asistencia | ✅ | ✅ | ✅ | ✅ | Fecha | SI |
| Nóminas | ✅ | ✅ | ✅ | ✅ | Estado | SI |
| Bonos | ✅ | ✅ | ✅ | ✅ | Tipo | SI |

---

## 🎯 Check List de Completitud

- [ ] Backend RRHH instalado y corriendo
- [ ] Frontend RRHH instalado y corriendo
- [ ] Supervisor puede ver usuarios
- [ ] Todos los CRUD funcionan
- [ ] Validaciones en backend
- [ ] Validaciones en frontend
- [ ] Rutas protegidas correctas
- [ ] Datos persistentes en BD
- [ ] Mensajes de error/éxito funcionan
- [ ] Formularios envían datos correctos

---

## 🚨 Troubleshooting

| Problema | Solución |
|----------|----------|
| 404 en `/hr/employees` | Verificar rutas en AppRouter.tsx |
| 401 en API | Token expirado, hacer login nuevamente |
| Tabla vacía | Backend retorna [], verificar datos en BD |
| Formulario no enva | Verificar console.log en chrome DevTools |
| Estilos rotos | Verificar tailwind está en dist |

---

## 📞 Contacto para Issues

- Backend: Verificar `src/controllers/hr.*.controller.ts`
- Frontend: Verificar `src/pages/hr/*.tsx`
- API: Verificar `src/routes/hr.routes.ts`
- BD: Verificar `migrations/002_create_hr_tables.sql`
