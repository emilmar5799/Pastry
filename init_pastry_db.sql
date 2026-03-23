
SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS Pastry;
CREATE DATABASE Pastry;
USE Pastry;

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS Pastry;


-- 1. Tabla: branches
CREATE TABLE `branches` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 2. Tabla: users
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 3. Tabla: customers
CREATE TABLE `customers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `ci` varchar(50) DEFAULT NULL,
  `registration_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 4. Tabla: products
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Disponible',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 5. Tabla: login_history
CREATE TABLE `login_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `branch_id` int NOT NULL,
  `login_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 6. Tabla: sales
CREATE TABLE `sales` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sale_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `customer_id` int DEFAULT NULL,
  `employee_id` int NOT NULL,
  `branch_id` int NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  FOREIGN KEY (`employee_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 7. Tabla: sale_products
CREATE TABLE `sale_products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sale_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`),
  FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 8. Tabla: orders (Pedidos / Reservas)
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `branch_id` int NOT NULL,
  `employee_id` int NOT NULL,
  `customer_id` int NOT NULL,
  `delivery_date` datetime NOT NULL,
  `color` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `pieces` int DEFAULT NULL,
  `specifications` text,
  `advance` decimal(10,2) NOT NULL,
  `event_type` varchar(100) DEFAULT NULL,
  `warranty` varchar(100) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'DEFAULT',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  FOREIGN KEY (`employee_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 9. Tabla: order_products
CREATE TABLE `order_products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 10. Tabla: supplies (Insumos)
CREATE TABLE `supplies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `available_amount` decimal(10,2) NOT NULL,
  `unit` varchar(50) NOT NULL,
  `expiration_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 11. Tabla: production
CREATE TABLE `production` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `produced_quantity` int NOT NULL,
  `production_date` date NOT NULL,
  `employee_id` int NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  FOREIGN KEY (`employee_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 12. Tabla: branch_distributions
CREATE TABLE `branch_distributions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `destination_branch` int NOT NULL,
  `shipping_date` date NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  FOREIGN KEY (`destination_branch`) REFERENCES `branches` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 15. Tabla: expenses (Gastos)
CREATE TABLE `expenses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` text NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 16. Tabla: incomes (Ingresos)
CREATE TABLE `incomes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` text NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



-- Tabla: employees
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

-- Tabla: payroll
CREATE TABLE IF NOT EXISTS `payroll` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `pay_period_start` date NOT NULL,
  `pay_period_end` date NOT NULL,
  `base_salary` decimal(10,2) NOT NULL,
  `bonus` decimal(10,2) DEFAULT 0,
  `deductions` decimal(10,2) DEFAULT 0,
  `net_salary` decimal(10,2) NOT NULL,
  `status` enum('PENDING','PAID','CANCELLED') DEFAULT 'PENDING',
  `paid_date` date,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`employee_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla: bonuses
CREATE TABLE IF NOT EXISTS `bonuses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `year` int NOT NULL,
  `annual_bonus` decimal(10,2) NOT NULL,
  `paid` boolean DEFAULT false,
  `paid_date` date,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`employee_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Verificar que se crearon
SHOW TABLES LIKE 'employees';
SHOW TABLES LIKE 'payroll';
SHOW TABLES LIKE 'bonuses';


-- Tabla: attendance
CREATE TABLE IF NOT EXISTS `attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `date` date NOT NULL,
  `check_in` varchar(10) DEFAULT NULL,
  `check_out` varchar(10) DEFAULT NULL,
  `hours_worked` decimal(10,2) DEFAULT '0.00',
  `status` varchar(20) DEFAULT 'ABSENT',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`employee_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



-- Alter table to match requirements
ALTER TABLE payroll MODIFY COLUMN paid_date DATETIME NULL;
ALTER TABLE payroll ADD COLUMN paid_by_user_id INT NULL;
ALTER TABLE payroll ADD CONSTRAINT fk_payroll_paid_by FOREIGN KEY (paid_by_user_id) REFERENCES users(id) ON DELETE SET NULL;

-- Enable event scheduler
SET GLOBAL event_scheduler = ON;

-- Drop event if exists to recreate
DROP EVENT IF EXISTS generate_monthly_payroll;

DELIMITER //

CREATE EVENT generate_monthly_payroll
ON SCHEDULE EVERY 1 MONTH STARTS (DATE_FORMAT(CURRENT_DATE + INTERVAL 1 MONTH, '%Y-%m-03 00:00:00'))
DO
BEGIN
    DECLARE v_is_december BOOLEAN;
    DECLARE v_year INT;
    DECLARE v_month INT;
    DECLARE v_start_date DATE;
    DECLARE v_end_date DATE;
    
    SET v_year = YEAR(CURRENT_DATE - INTERVAL 1 MONTH);
    SET v_month = MONTH(CURRENT_DATE - INTERVAL 1 MONTH);
    SET v_is_december = (v_month = 12);
    
    SET v_start_date = DATE(CONCAT(v_year, '-', v_month, '-01'));
    SET v_end_date = LAST_DAY(v_start_date);
    
    INSERT INTO payroll (employee_id, pay_period_start, pay_period_end, base_salary, bonus, deductions, net_salary, status)
    SELECT 
        id,
        v_start_date,
        v_end_date,
        salary,
        IF(v_is_december, 700.00, 0.00),
        0.00,
        salary + IF(v_is_december, 700.00, 0.00),
        'PENDING'
    FROM users
    WHERE active = 1 AND salary IS NOT NULL
    AND NOT EXISTS (
        SELECT 1 FROM payroll p 
        WHERE p.employee_id = users.id AND p.pay_period_start = v_start_date
    );
END//

DELIMITER ;



-- Generar variables para el hash de contraseña y roles
SET @password_hash = '$2b$10$APo8ozv.LpqDfQdsZUDmmOM4CCdg9ILWfPkysCpL.y9VDvohHBb4y';

-- 1. Insertar Usuarios
INSERT INTO users (first_name, last_name, email, password, role, salary, active, created_at) VALUES 
('Ana', 'Admin', 'ana.admin@pastry.com', @password_hash, 'ADMIN', 4500.00, 1, NOW()),
('Luis', 'Supervisor', 'luis.supervisor@pastry.com', @password_hash, 'SUPERVISOR', 3500.00, 1, NOW()),
('Marta', 'Contador', 'marta.contador@pastry.com', @password_hash, 'CONTADOR', 3800.00, 1, NOW()),
('Pedro', 'Panadero1', 'pedro.panadero@pastry.com', @password_hash, 'PANADERO', 2500.00, 1, NOW()),
('Juan', 'Panadero2', 'juan.panadero@pastry.com', @password_hash, 'PANADERO', 2500.00, 1, NOW()),
('Sofía', 'Decorador', 'sofia.decorador@pastry.com', @password_hash, 'DECORADOR', 2700.00, 1, NOW());

-- Obtener IDs recién creados
SET @u_admin = (SELECT id FROM users WHERE email = 'ana.admin@pastry.com');
SET @u_super = (SELECT id FROM users WHERE email = 'luis.supervisor@pastry.com');
SET @u_conta = (SELECT id FROM users WHERE email = 'marta.contador@pastry.com');
SET @u_pan1 = (SELECT id FROM users WHERE email = 'pedro.panadero@pastry.com');
SET @u_pan2 = (SELECT id FROM users WHERE email = 'juan.panadero@pastry.com');
SET @u_deco = (SELECT id FROM users WHERE email = 'sofia.decorador@pastry.com');

-- 2. Insertar en Employees
INSERT INTO employees (user_id, hire_date, position, department, contract_type) VALUES
(@u_admin, '2023-01-10', 'Administradora General', 'Administración', 'FULL_TIME'),
(@u_super, '2023-02-15', 'Supervisor de Turno', 'Operaciones', 'FULL_TIME'),
(@u_conta, '2023-03-01', 'Contadora Senior', 'Administración', 'FULL_TIME'),
(@u_pan1, '2023-06-20', 'Panadero Senior', 'Producción', 'FULL_TIME'),
(@u_pan2, '2024-01-15', 'Ayudante de Panadería', 'Producción', 'FULL_TIME'),
(@u_deco, '2023-08-10', 'Decoradora Principal', 'Producción', 'FULL_TIME');

-- 3. Insertar Asistencias (Últimos 3 días para todos)
INSERT INTO attendance (employee_id, date, check_in, check_out, hours_worked, status) VALUES
-- Admin
(@u_admin, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '08:00:00', '17:00:00', 9.0, 'PRESENT'),
(@u_admin, DATE_SUB(CURDATE(), INTERVAL 1 DAY), '08:15:00', '17:30:00', 9.25, 'LATE'),
(@u_admin, CURDATE(), '08:00:00', '17:00:00', 9.0, 'PRESENT'),

-- Supervisor
(@u_super, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '07:30:00', '16:30:00', 9.0, 'PRESENT'),
(@u_super, DATE_SUB(CURDATE(), INTERVAL 1 DAY), '07:30:00', '16:30:00', 9.0, 'PRESENT'),
(@u_super, CURDATE(), '07:30:00', '16:30:00', 9.0, 'PRESENT'),

-- Contador
(@u_conta, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '09:00:00', '18:00:00', 9.0, 'PRESENT'),
(@u_conta, DATE_SUB(CURDATE(), INTERVAL 1 DAY), '09:00:00', '18:00:00', 9.0, 'PRESENT'),
(@u_conta, CURDATE(), '09:00:00', '18:00:00', 9.0, 'PRESENT'),

-- Panadero 1
(@u_pan1, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '05:00:00', '14:00:00', 9.0, 'PRESENT'),
(@u_pan1, DATE_SUB(CURDATE(), INTERVAL 1 DAY), '05:00:00', '14:00:00', 9.0, 'PRESENT'),
(@u_pan1, CURDATE(), '05:00:00', '14:00:00', 9.0, 'PRESENT'),

-- Panadero 2
(@u_pan2, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '05:00:00', '14:00:00', 9.0, 'PRESENT'),
(@u_pan2, DATE_SUB(CURDATE(), INTERVAL 1 DAY), NULL, NULL, 0, 'ABSENT'),
(@u_pan2, CURDATE(), '05:15:00', '14:00:00', 8.75, 'PRESENT'),

-- Decorador
(@u_deco, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '08:00:00', '17:00:00', 9.0, 'PRESENT'),
(@u_deco, DATE_SUB(CURDATE(), INTERVAL 1 DAY), '08:00:00', '17:00:00', 9.0, 'PRESENT'),
(@u_deco, CURDATE(), '08:00:00', '12:00:00', 4.0, 'HALF_DAY');




SET @u_admin = (SELECT id FROM users WHERE email = 'ana.admin@pastry.com');
SET @u_super = (SELECT id FROM users WHERE email = 'luis.supervisor@pastry.com');
SET @u_conta = (SELECT id FROM users WHERE email = 'marta.contador@pastry.com');
SET @u_pan1 = (SELECT id FROM users WHERE email = 'pedro.panadero@pastry.com');
SET @u_pan2 = (SELECT id FROM users WHERE email = 'juan.panadero@pastry.com');
SET @u_deco = (SELECT id FROM users WHERE email = 'sofia.decorador@pastry.com');

INSERT INTO payroll (employee_id, pay_period_start, pay_period_end, base_salary, bonus, deductions, net_salary, status, paid_date) VALUES
(@u_admin, '2024-03-01', '2024-03-31', 4500.00, 200.00, 0.00, 4700.00, 'PAID', '2024-03-31'),
(@u_super, '2024-03-01', '2024-03-31', 3500.00, 150.00, 50.00, 3600.00, 'PAID', '2024-03-31'),
(@u_conta, '2024-03-01', '2024-03-31', 3800.00, 0.00, 0.00, 3800.00, 'PENDING', NULL),
(@u_pan1, '2024-03-01', '2024-03-31', 2500.00, 100.00, 0.00, 2600.00, 'PAID', '2024-03-31'),
(@u_pan2, '2024-03-01', '2024-03-31', 2500.00, 0.00, 100.00, 2400.00, 'PENDING', NULL),
(@u_deco, '2024-03-01', '2024-03-31', 2700.00, 50.00, 0.00, 2750.00, 'PAID', '2024-03-31');

-- Insert default records for Sales to work properly
INSERT INTO branches (name, address) VALUES ('Sucursal Central', 'Av. Principal 123'); 
INSERT INTO customers (name, phone, email, ci) VALUES ('Cliente General', '00000000', 'cliente@general.com', '0000000'); 
INSERT INTO products (name, description, price, category) VALUES ('Torta de Chocolate', 'Deliciosa torta de chocolate', 15.50, 'Tortas');

SET FOREIGN_KEY_CHECKS = 1;
