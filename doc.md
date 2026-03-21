# Diseño de Módulos del Sistema de Gestión - Pastelería Flora

## 1. Introducción
El presente documento describe el diseño de los módulos propuestos para la implementación de un sistema de gestión empresarial en **Pastelería Flora**. El objetivo principal es automatizar los procesos clave de la empresa, mejorar la eficiencia operativa y reducir los errores derivados del manejo manual de la información.

Actualmente, la empresa utiliza registros manuales en cuadernos para ventas, inventario, producción, finanzas y recursos humanos, lo que genera dificultades en el control de la información y en la toma de decisiones. La implementación de módulos de software permitirá centralizar los datos, facilitar el acceso a la información y optimizar la gestión empresarial.

Los módulos diseñados se basan en las áreas funcionales identificadas previamente como susceptibles de automatización: ventas, producción e inventario, contabilidad y finanzas, recursos humanos y dirección.

---

## 2. Áreas Identificadas para Automatización
Las áreas funcionales que serán apoyadas mediante módulos del sistema son las siguientes:

* **Ventas**
* **Producción e Inventario**
* **Contabilidad y Finanzas**
* **Recursos Humanos**
* **Dirección / Reportes Gerenciales**

Cada una de estas áreas contará con un módulo especializado que permitirá registrar información, procesar datos y generar reportes para mejorar la gestión empresarial.

---

## 3. Diseño de Módulos del Sistema

### 3.1 Módulo de Gestión de Ventas (POS)
* **Propósito:** Registrar y gestionar las ventas de productos de manera digital, permitiendo un control más rápido y preciso de las transacciones comerciales realizadas en las sucursales.
* **Objetivo:** Automatizar el proceso de venta, reducir el tiempo de atención al cliente y mantener un registro organizado.
* **Beneficios:** * Reducción del tiempo de registro de ventas.
    * Disminución de errores en cálculos manuales.
    * Registro automático del historial de clientes.
    * Mejor control de ingresos diarios.
* **Componentes:** Registro de ventas, gestión de productos, gestión de clientes, registro de pedidos/reservas y generación de comprobantes.
* **Interfaz:** Selección de productos desde lista, ingreso de cantidad y cálculo automático del total.
* **Entrada de Datos:** Nombre del cliente (opcional), producto, cantidad, fecha y monto pagado.
* **Salida de Datos:** Total de la venta, comprobante, historial de ventas y reporte diario.

### 3.2 Módulo de Inventario y Producción
* **Propósito:** Permitir el control automatizado de insumos, materias primas y productos elaborados, además de registrar la producción diaria.
* **Objetivo:** Mejorar la planificación de producción y evitar pérdidas por falta de control de inventario.
* **Beneficios:** Control de insumos disponibles, reducción de pérdidas por vencimiento y mayor coordinación entre producción y ventas.
* **Componentes:** Gestión de inventario, registro de insumos, stock mínimo, producción diaria y control de fechas de vencimiento.

#### Sub-módulos Especializados:
* **Gestión de Reservas:** Administra pedidos anticipados indicando producto, cantidad y fecha de entrega.
* **Distribución a Sucursales:** Gestiona el envío de productos desde la central a las sucursales con confirmación de recepción.
* **Producción Diaria:** Registro detallado de productos elaborados y responsables de producción.

### 3.3 Módulo Contable y Financiero
* **Propósito:** Registrar y controlar todas las operaciones financieras, incluyendo ingresos, gastos y cálculo de ganancias.
* **Objetivo:** Mejorar el control financiero y facilitar reportes para la toma de decisiones.
* **Beneficios:** Reducción de errores contables, control de pagos a proveedores y análisis de rentabilidad.
* **Entrada de Datos:** Monto de ingreso/gasto, concepto y fecha de operación.
* **Salida de Datos:** Balance financiero, reportes de ingresos/gastos y cálculo de pérdidas o ganancias.

### 3.4 Módulo de Recursos Humanos
* **Propósito:** Gestionar la información del personal, incluyendo registro, asistencia y pago de salarios.
* **Objetivo:** Organizar la gestión del personal y reducir errores administrativos.
* **Beneficios:** Control preciso de asistencia y automatización del cálculo de salarios (horas, bonos, descuentos).
* **Entrada de Datos:** Datos del empleado, cargo, horario, horas trabajadas y bonificaciones.
* **Salida de Datos:** Lista de empleados, registro de asistencia y reportes de pagos realizados.

### 3.5 Módulo de Reportes Gerenciales
* **Propósito:** Proporcionar información consolidada para apoyar la toma de decisiones estratégicas de la dirección.
* **Objetivo:** Acceso rápido a indicadores clave del negocio mediante un panel de control (Dashboard).
* **Componentes:** Reportes de ventas, financieros y análisis de productos más vendidos.
* **Interfaz:** Gráficos y reportes visuales claros y rápidos.

---

## 4. Integración de los Módulos
Los módulos estarán integrados para permitir el intercambio automático de información:
1. **Ventas e Ingresos:** Los datos de ventas se envían al módulo contable.
2. **Producción e Inventario:** El módulo de inventario se actualiza automáticamente según la producción y las ventas.
3. **Reportes Centralizados:** El módulo de reportes utiliza información de todos los demás módulos para generar indicadores estratégicos en tiempo real.

---

## 6. Conclusión
El diseño de los módulos propuestos permitirá transformar el sistema manual actual de **Pastelería Flora** en un sistema digital integrado. La automatización reducirá errores, mejorará la eficiencia operativa y fortalecerá la competitividad de la empresa en el mercado.
### 1. Tabla: CLIENTES
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| id_cliente | INT | Identificador único del cliente |
| nombre | VARCHAR | Nombre del cliente |
| telefono | VARCHAR | Número de teléfono |
| email | VARCHAR | Correo electrónico |
| ci | VARCHAR | Número de documento de identidad |
| fecha_registro | DATETIME | Fecha de registro del cliente |

### 2. Tabla: PRODUCTOS
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| id_producto | INT | Identificador del producto |
| nombre_producto | VARCHAR | Nombre del producto |
| descripcion | TEXT | Descripción del producto |
| precio | DECIMAL | Precio de venta |
| categoria | VARCHAR | Categoría del producto |
| estado | VARCHAR | Disponible / No disponible |
| created_at | DATETIME | Fecha de creación del registro |

### 3. Tabla: SUCURSALES
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| id_sucursal | INT | Identificador de la sucursal |
| nombre | VARCHAR | Nombre de la sucursal |
| direccion | VARCHAR | Dirección de la sucursal |

### 4. Tabla: VENTAS
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| id_venta | INT | Identificador de la venta |
| fecha_venta | DATETIME | Fecha y hora de la venta |
| id_cliente | INT | Cliente asociado |
| id_empleado | INT | Usuario que registró la venta |
| id_sucursal | INT | Sucursal donde se realizó la venta |
| total | DECIMAL | Total de la venta |
| metodo_pago | VARCHAR | Método de pago |

### 5. Tabla: DETALLE_VENTA
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| id_detalle | INT | Identificador del detalle |
| id_venta | INT | Venta asociada |
| id_producto | INT | Producto vendido |
| cantidad | INT | Cantidad vendida |
| precio_unitario | DECIMAL | Precio del producto |
| subtotal | DECIMAL | Total parcial del producto |

### 6. Tabla: RESERVAS (Pedidos especiales)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| id_reserva | INT | Identificador de la reserva |
| id_sucursal | INT | Sucursal donde se registra |
| id_empleado | INT | Usuario que creó la reserva |
| id_cliente | INT | Cliente que solicita el pedido |
| fecha_entrega | DATETIME | Fecha y hora de entrega |
| color | VARCHAR | Color del pastel |
| precio | DECIMAL | Precio acordado |
| pieces | INT | Número de piezas |
| especificaciones | TEXT | Detalles especiales del pedido |
| adelanto | DECIMAL | Pago adelantado |
| tipo_evento | VARCHAR | Tipo de evento |
| garantia | VARCHAR | Garantía o condiciones |
| tipo | VARCHAR | Tamaño del pastel (pequeño / grande) |
| created_at | DATETIME | Fecha de creación del pedido |

### 7. Tabla: INSUMOS
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| id_insumo | INT | Identificador del insumo |
| nombre_insumo | VARCHAR | Nombre del ingrediente |
| cantidad_disponible | DECIMAL | Cantidad disponible |
| unidad_medida | VARCHAR | Unidad de medida |
| fecha_vencimiento | DATE | Fecha de vencimiento |

### 8. Tabla: PRODUCCION
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| id_produccion | INT | Identificador de producción |
| id_producto | INT | Producto elaborado |
| cantidad_producida | INT | Cantidad elaborada |
| fecha_produccion | DATE | Fecha de producción |
| id_empleado | INT | Usuario responsable |

### 9. Tabla: DISTRIBUCION_SUCURSALES
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| id_distribucion | INT | Identificador de distribución |
| id_producto | INT | Producto distribuido |
| cantidad | INT | Cantidad enviada |
| id_sucursal_destino | INT | Sucursal que recibe |
| fecha_envio | DATE | Fecha de envío |

### 10. Tabla: USERS (Usuarios del sistema)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| id_user | INT | Identificador del usuario |
| firstname | VARCHAR | Nombre del usuario |
| lastname | VARCHAR | Apellido del usuario |
| email | VARCHAR | Correo electrónico |
| password | VARCHAR | Contraseña |
| role | VARCHAR | Rol (admin, cajero, etc.) |
| salario | DECIMAL | Salario del empleado |
| active | BOOLEAN | Estado del usuario |
| created_at | DATETIME | Fecha de creación |

### 11. Tabla: ASISTENCIA
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| id_asistencia | INT | Identificador de asistencia |
| id_user | INT | Usuario |
| fecha | DATE | Fecha de asistencia |
| hora_entrada | TIME | Hora de ingreso |
| hora_salida | TIME | Hora de salida |

### 12. Tabla: PAGOS_SUELDO
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| id_pago | INT | Identificador del pago |
| id_user | INT | Usuario |
| salario_base | DECIMAL | Salario base |
| bonos | DECIMAL | Bonos otorgados |
| descuentos | DECIMAL | Descuentos aplicados |
| salario_final | DECIMAL | Salario total |
| fecha_pago | DATE | Fecha del pago |

### 13. Tabla: GASTOS
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| id_gasto | INT | Identificador del gasto |
| descripcion | TEXT | Descripción del gasto |
| monto | DECIMAL | Monto del gasto |
| fecha | DATE | Fecha del gasto |

### 14. Tabla: INGRESOS
| Campo       | Tipo    | Descripción               |
| :---------- | :------ | :------------------------ |
| id_ingreso  | INT     | Identificador del ingreso |
| descripcion | TEXT    | Descripción del ingreso   |
| monto       | DECIMAL | Monto                     |
| fecha       | DATE    | Fecha                     |