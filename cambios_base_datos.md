# Análisis de Cambios en la Base de Datos (Antigua vs Nueva)

Este documento detalla las diferencias entre el esquema de base de datos actual y el nuevo diseño propuesto (con las tablas en inglés) para el sistema de gestión de Pastelería Flora.

## 1. Tablas Modificadas, Mantenidas o Renombradas

### Branches (Sucursales)
*   **Antigua (`branches`):** `id`, `name`, `active`, `created_at`
*   **Nueva (`branches`):** `id`, `name`, `address`
*   **Cambios:** Se añade el campo `address` (dirección). Según el análisis se quitan `active` y `created_at`, aunque es recomendable mantener la estructura temporal.

### Users (Usuarios)
*   **Antigua (`users`):** `id`, `first_name`, `last_name`, `email`, `password`, `role`, `active`, `created_at`
*   **Nueva (`users`):** `id`, `first_name`, `last_name`, `email`, `password`, `role`, `salary`, `active`, `created_at`
*   **Cambios:** Se mantiene bajo el mismo nombre. Se agrega el campo `salary` (DECIMAL) para el módulo de Recursos Humanos.

### Products (Productos)
*   **Antigua (`products`):** `id`, `name`, `price`, `active`, `created_at`
*   **Nueva (`products`):** `id`, `name`, `description`, `price`, `category`, `status`, `created_at`
*   **Cambios:** Se añaden los campos `description` y `category`. El campo booleano `active` cambia a texto o nomenclatura `status` (Disponible / No disponible), aunque a nivel técnico podría mantenerse como booleano.

### Sales (Ventas)
*   **Antigua (`sales`):** `id`, `branch_id`, `sold_by`, `total`, `status`, `created_at`
*   **Nueva (`sales`):** `id`, `sale_date`, `customer_id`, `employee_id`, `branch_id`, `total`, `payment_method`
*   **Cambios:** `sold_by` conceptualmente es `employee_id`. Se incorpora `customer_id` para enlazar clientes. Se agrega `payment_method` y se elimina el estado normal.

### Sale Products (Detalle de Ventas)
*   **Antigua (`sale_products`):** `id`, `sale_id`, `product_id`, `quantity`, `price_at_sale`
*   **Nueva (`sale_products`):** `id`, `sale_id`, `product_id`, `quantity`, `unit_price`, `subtotal`
*   **Cambios:** `price_at_sale` se estandariza a `unit_price` y se agrega el campo calculable `subtotal`.

### Orders (Pedidos / Reservas)
*   **Antigua (`orders`):** `id`, `branch_id`, `created_by`, `delivery_datetime`, `customer_name`, `customer_ci`, `phone`, `color`, `price`, `pieces`, `specifications`, `advance`, `event`, `warranty`, `status`, `type`, `created_at`
*   **Nueva (`orders`):** `id`, `branch_id`, `employee_id`, `customer_id`, `delivery_date`, `color`, `price`, `pieces`, `specifications`, `advance`, `event_type`, `warranty`, `type`, `created_at`
*   **Cambios:** **Normalización de Cliente:** Se eliminan los campos manuales de cliente en esta tabla (`customer_name`, `customer_ci`, `phone`) reemplazándolos por `customer_id` foráneo. Los demás campos de reserva como color, porciones, adelanto, continúan.

### Tablas que se Conservan Intactas (Sin Eliminación)
*   **`order_products`:** Se mantiene en la nueva estructura para poder gestionar detalles de múltiples productos en una misma reserva.
*   **`login_history`:** Se conserva para el correcto rastro y auditoría de los inicios de sesión en el sistema.

## 2. Tablas Nuevas (Nuevos Módulos)

Se integran nuevas tablas en **inglés** para dar solución a los requerimientos del documento original:

*   **`customers` (Clientes)**: Centraliza los datos (`name`, `phone`, `email`, `ci`, `registration_date`) para relacionarlos en `sales` y `orders`.
*   **Producción e Inventario:**
    *   **`supplies` (Insumos)**: Control de ingredientes (`id`, `name`, `available_amount`, `unit`, `expiration_date`).
    *   **`production` (Producción)**: Registro de los productos creados (`id`, `product_id`, `produced_quantity`, `production_date`, `employee_id`).
    *   **`branch_distributions` (Distribución Sucursales)**: Envíos entre sucursales (`id`, `product_id`, `quantity`, `destination_branch`, `shipping_date`).
*   **Recursos Humanos:**
    *   **`attendance` (Asistencia)**: Control de asistencia (`id`, `user_id`, `date`, `entry_time`, `exit_time`).
    *   **`payroll` (Pago de Sueldos)**: Relación de salarios (`id`, `user_id`, `base_salary`, `bonuses`, `deductions`, `final_salary`, `payment_date`).
*   **Contabilidad y Finanzas:**
    *   **`expenses` (Gastos)**: Control de costos extra (`id`, `description`, `amount`, `date`).
    *   **`incomes` (Ingresos)**: Ingresos no operacionales (`id`, `description`, `amount`, `date`).

## 3. Tablas Eliminadas Parcial o Totalmente

*   **`user_phones`**: Se elimina por completo esta tabla (como se solicitó). Los teléfonos dejarán de manejarse en una tabla pivote separada para los usuarios.
