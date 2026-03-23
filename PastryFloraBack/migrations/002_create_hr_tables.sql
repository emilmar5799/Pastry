-- ============================================================
-- Migraciones para Módulo RRHH (Recursos Humanos)
-- ============================================================

USE Pastry;

-- 1. Tabla: employees
-- Extiende la tabla users con información específica de RRHH
CREATE TABLE IF NOT EXISTS `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `hire_date` date NOT NULL,
  `position` varchar(100) NOT NULL,
  `department` varchar(100),
  `contract_type` enum('FULL_TIME','PART_TIME','CONTRACT') DEFAULT 'FULL_TIME',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 2. Tabla: attendance
-- Control de asistencia diaria
CREATE TABLE IF NOT EXISTS `attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `date` date NOT NULL,
  `check_in` time,
  `check_out` time,
  `hours_worked` decimal(5,2) DEFAULT 0,
  `status` enum('PRESENT','ABSENT','LATE','HALF_DAY') DEFAULT 'PRESENT',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employee_date` (`employee_id`, `date`),
  FOREIGN KEY (`employee_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Índice para búsquedas por rango de fechas
CREATE INDEX idx_attendance_date ON `attendance` (`date`);
CREATE INDEX idx_attendance_employee_date ON `attendance` (`employee_id`, `date`);

-- 3. Tabla: payroll
-- Cálculo y gestión de nóminas
CREATE TABLE IF NOT EXISTS `payroll` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `pay_period_start` date NOT NULL,
  `pay_period_end` date NOT NULL,
  `base_salary` decimal(10,2) NOT NULL,
  `overtime_hours` decimal(5,2) DEFAULT 0,
  `overtime_rate` decimal(10,2) DEFAULT 0,
  `total_earnings` decimal(10,2) NOT NULL,
  `deductions` decimal(10,2) DEFAULT 0,
  `net_pay` decimal(10,2) NOT NULL,
  `payment_date` date,
  `status` enum('PENDING','PAID','CANCELLED') DEFAULT 'PENDING',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`employee_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Índice para búsquedas por período
CREATE INDEX idx_payroll_period ON `payroll` (`pay_period_start`, `pay_period_end`);
CREATE INDEX idx_payroll_employee ON `payroll` (`employee_id`);
CREATE INDEX idx_payroll_status ON `payroll` (`status`);

-- 4. Tabla: bonuses
-- Registro de bonificaciones
CREATE TABLE IF NOT EXISTS `bonuses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `bonus_amount` decimal(10,2) NOT NULL,
  `bonus_type` enum('PERFORMANCE','ANNUAL','SPECIAL') DEFAULT 'PERFORMANCE',
  `reason` text,
  `bonus_date` date NOT NULL,
  `approved_by` int,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`employee_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Índice para búsquedas por empleado
CREATE INDEX idx_bonuses_employee ON `bonuses` (`employee_id`);
CREATE INDEX idx_bonuses_date ON `bonuses` (`bonus_date`);
