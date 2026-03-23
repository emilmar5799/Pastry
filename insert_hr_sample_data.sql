-- ============================================================
-- SCRIPT DE DATOS DE EJEMPLO PARA MÓDULO RRHH
-- ============================================================
USE Pastry;

-- ============================================================
-- 0. LIMPIAR DATOS EXISTENTES
-- ============================================================

DELETE FROM bonuses WHERE employee_id IN (SELECT id FROM users WHERE email LIKE '%.garcia@pastry.com' OR email LIKE '%.lopez@pastry.com' OR email LIKE '%.martinez@pastry.com' OR email LIKE '%.rodriguez@pastry.com' OR email LIKE '%.fernandez@pastry.com' OR email LIKE '%.gomez@pastry.com');
DELETE FROM payroll WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%.garcia@pastry.com' OR email LIKE '%.lopez@pastry.com' OR email LIKE '%.martinez@pastry.com' OR email LIKE '%.rodriguez@pastry.com' OR email LIKE '%.fernandez@pastry.com' OR email LIKE '%.gomez@pastry.com');
DELETE FROM attendance WHERE employee_id IN (SELECT id FROM users WHERE email LIKE '%.garcia@pastry.com' OR email LIKE '%.lopez@pastry.com' OR email LIKE '%.martinez@pastry.com' OR email LIKE '%.rodriguez@pastry.com' OR email LIKE '%.fernandez@pastry.com' OR email LIKE '%.gomez@pastry.com');
DELETE FROM employees WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%.garcia@pastry.com' OR email LIKE '%.lopez@pastry.com' OR email LIKE '%.martinez@pastry.com' OR email LIKE '%.rodriguez@pastry.com' OR email LIKE '%.fernandez@pastry.com' OR email LIKE '%.gomez@pastry.com');
DELETE FROM users WHERE email LIKE '%.garcia@pastry.com' OR email LIKE '%.lopez@pastry.com' OR email LIKE '%.martinez@pastry.com' OR email LIKE '%.rodriguez@pastry.com' OR email LIKE '%.fernandez@pastry.com' OR email LIKE '%.gomez@pastry.com';

-- ============================================================
-- 1. INSERTAR EMPLEADOS (USUARIOS) UNO A UNO
-- ============================================================

INSERT INTO users (first_name, last_name, email, password, role, salary, active, created_at) 
VALUES ('Juan', 'García', 'juan.garcia@pastry.com', '$2b$10$YourHashedPassword123', 'PANADERO', 2500.00, 1, NOW());
SET @user_id_1 = LAST_INSERT_ID();

INSERT INTO users (first_name, last_name, email, password, role, salary, active, created_at) 
VALUES ('María', 'López', 'maria.lopez@pastry.com', '$2b$10$YourHashedPassword123', 'DECORADOR', 2800.00, 1, NOW());
SET @user_id_2 = LAST_INSERT_ID();

INSERT INTO users (first_name, last_name, email, password, role, salary, active, created_at) 
VALUES ('Carlos', 'Martínez', 'carlos.martinez@pastry.com', '$2b$10$YourHashedPassword123', 'PANADERO', 2600.00, 1, NOW());
SET @user_id_3 = LAST_INSERT_ID();

INSERT INTO users (first_name, last_name, email, password, role, salary, active, created_at) 
VALUES ('Ana', 'Rodríguez', 'ana.rodriguez@pastry.com', '$2b$10$YourHashedPassword123', 'SELLER', 2200.00, 1, NOW());
SET @user_id_4 = LAST_INSERT_ID();

INSERT INTO users (first_name, last_name, email, password, role, salary, active, created_at) 
VALUES ('Roberto', 'Fernández', 'roberto.fernandez@pastry.com', '$2b$10$YourHashedPassword123', 'REFILL', 2000.00, 1, NOW());
SET @user_id_5 = LAST_INSERT_ID();

INSERT INTO users (first_name, last_name, email, password, role, salary, active, created_at) 
VALUES ('Silvia', 'Gómez', 'silvia.gomez@pastry.com', '$2b$10$YourHashedPassword123', 'CONTADOR', 3200.00, 1, NOW());
SET @user_id_6 = LAST_INSERT_ID();

-- ============================================================
-- 2. INSERTAR REGISTROS DE EMPLEADOS
-- ============================================================

INSERT INTO employees (user_id, hire_date, position, department, contract_type, created_at, updated_at) VALUES
(@user_id_1, '2023-01-15', 'Panadero Senior', 'Producción', 'FULL_TIME', NOW(), NOW());

INSERT INTO employees (user_id, hire_date, position, department, contract_type, created_at, updated_at) VALUES
(@user_id_2, '2023-03-20', 'Decoradora', 'Producción', 'FULL_TIME', NOW(), NOW());

INSERT INTO employees (user_id, hire_date, position, department, contract_type, created_at, updated_at) VALUES
(@user_id_3, '2023-06-10', 'Panadero', 'Producción', 'FULL_TIME', NOW(), NOW());

INSERT INTO employees (user_id, hire_date, position, department, contract_type, created_at, updated_at) VALUES
(@user_id_4, '2023-08-05', 'Vendedora', 'Ventas', 'FULL_TIME', NOW(), NOW());

INSERT INTO employees (user_id, hire_date, position, department, contract_type, created_at, updated_at) VALUES
(@user_id_5, '2024-01-12', 'Reabastecedor', 'Logística', 'PART_TIME', NOW(), NOW());

INSERT INTO employees (user_id, hire_date, position, department, contract_type, created_at, updated_at) VALUES
(@user_id_6, '2023-02-01', 'Contadora', 'Administración', 'FULL_TIME', NOW(), NOW());

-- ============================================================
-- 3. INSERTAR DATOS DE ASISTENCIA
-- ============================================================

-- Asistencia para los últimos 10 días
INSERT INTO attendance (employee_id, date, check_in, check_out, hours_worked, status, created_at, updated_at) VALUES
-- Juan García
(@user_id_1, DATE_SUB(CURDATE(), INTERVAL 9 DAY), '08:00:00', '17:00:00', 9.0, 'PRESENT', NOW(), NOW()),
(@user_id_1, DATE_SUB(CURDATE(), INTERVAL 8 DAY), '08:05:00', '17:15:00', 9.0, 'PRESENT', NOW(), NOW()),
(@user_id_1, DATE_SUB(CURDATE(), INTERVAL 7 DAY), '08:15:00', '17:00:00', 8.75, 'LATE', NOW(), NOW()),
(@user_id_1, DATE_SUB(CURDATE(), INTERVAL 6 DAY), '08:00:00', '17:30:00', 9.5, 'PRESENT', NOW(), NOW()),
(@user_id_1, DATE_SUB(CURDATE(), INTERVAL 5 DAY), '08:00:00', '17:00:00', 9.0, 'PRESENT', NOW(), NOW()),

-- María López
(@user_id_2, DATE_SUB(CURDATE(), INTERVAL 9 DAY), '08:30:00', '17:30:00', 9.0, 'PRESENT', NOW(), NOW()),
(@user_id_2, DATE_SUB(CURDATE(), INTERVAL 8 DAY), '08:30:00', '17:30:00', 9.0, 'PRESENT', NOW(), NOW()),
(@user_id_2, DATE_SUB(CURDATE(), INTERVAL 7 DAY), NULL, NULL, 0, 'ABSENT', NOW(), NOW()),
(@user_id_2, DATE_SUB(CURDATE(), INTERVAL 6 DAY), '08:30:00', '14:30:00', 6.0, 'HALF_DAY', NOW(), NOW()),
(@user_id_2, DATE_SUB(CURDATE(), INTERVAL 5 DAY), '08:30:00', '17:30:00', 9.0, 'PRESENT', NOW(), NOW()),

-- Carlos Martínez
(@user_id_3, DATE_SUB(CURDATE(), INTERVAL 9 DAY), '08:00:00', '17:00:00', 9.0, 'PRESENT', NOW(), NOW()),
(@user_id_3, DATE_SUB(CURDATE(), INTERVAL 8 DAY), '08:00:00', '17:00:00', 9.0, 'PRESENT', NOW(), NOW()),
(@user_id_3, DATE_SUB(CURDATE(), INTERVAL 7 DAY), '08:00:00', '17:00:00', 9.0, 'PRESENT', NOW(), NOW()),
(@user_id_3, DATE_SUB(CURDATE(), INTERVAL 6 DAY), '08:00:00', '17:00:00', 9.0, 'PRESENT', NOW(), NOW()),
(@user_id_3, DATE_SUB(CURDATE(), INTERVAL 5 DAY), '08:00:00', '17:00:00', 9.0, 'PRESENT', NOW(), NOW()),

-- Ana Rodríguez
(@user_id_4, DATE_SUB(CURDATE(), INTERVAL 9 DAY), '09:00:00', '18:00:00', 9.0, 'PRESENT', NOW(), NOW()),
(@user_id_4, DATE_SUB(CURDATE(), INTERVAL 8 DAY), '09:00:00', '18:00:00', 9.0, 'PRESENT', NOW(), NOW()),
(@user_id_4, DATE_SUB(CURDATE(), INTERVAL 7 DAY), '09:30:00', '18:00:00', 8.5, 'LATE', NOW(), NOW()),
(@user_id_4, DATE_SUB(CURDATE(), INTERVAL 6 DAY), '09:00:00', '18:00:00', 9.0, 'PRESENT', NOW(), NOW()),
(@user_id_4, DATE_SUB(CURDATE(), INTERVAL 5 DAY), '09:00:00', '18:00:00', 9.0, 'PRESENT', NOW(), NOW()),

-- Roberto Fernández
(@user_id_5, DATE_SUB(CURDATE(), INTERVAL 9 DAY), '14:00:00', '20:00:00', 6.0, 'PRESENT', NOW(), NOW()),
(@user_id_5, DATE_SUB(CURDATE(), INTERVAL 8 DAY), '14:00:00', '20:00:00', 6.0, 'PRESENT', NOW(), NOW()),
(@user_id_5, DATE_SUB(CURDATE(), INTERVAL 7 DAY), '14:00:00', '20:00:00', 6.0, 'PRESENT', NOW(), NOW()),
(@user_id_5, DATE_SUB(CURDATE(), INTERVAL 6 DAY), '14:00:00', '20:00:00', 6.0, 'PRESENT', NOW(), NOW()),
(@user_id_5, DATE_SUB(CURDATE(), INTERVAL 5 DAY), '14:00:00', '20:00:00', 6.0, 'PRESENT', NOW(), NOW()),

-- Silvia Gómez
(@user_id_6, DATE_SUB(CURDATE(), INTERVAL 9 DAY), '08:00:00', '17:00:00', 9.0, 'PRESENT', NOW(), NOW()),
(@user_id_6, DATE_SUB(CURDATE(), INTERVAL 8 DAY), '08:00:00', '17:00:00', 9.0, 'PRESENT', NOW(), NOW()),
(@user_id_6, DATE_SUB(CURDATE(), INTERVAL 7 DAY), '08:00:00', '17:00:00', 9.0, 'PRESENT', NOW(), NOW()),
(@user_id_6, DATE_SUB(CURDATE(), INTERVAL 6 DAY), '08:00:00', '17:00:00', 9.0, 'PRESENT', NOW(), NOW()),
(@user_id_6, DATE_SUB(CURDATE(), INTERVAL 5 DAY), '08:00:00', '17:00:00', 9.0, 'PRESENT', NOW(), NOW());

-- ============================================================
-- 4. INSERTAR DATOS DE NÓMINAS (usando user_id - estructura simple)
-- ============================================================

INSERT INTO payroll (user_id, base_salary, bonuses, deductions, final_salary, payment_date) 
VALUES (@user_id_1, 2500.00, 0.00, 250.00, 2250.00, DATE_SUB(CURDATE(), INTERVAL 25 DAY));

INSERT INTO payroll (user_id, base_salary, bonuses, deductions, final_salary, payment_date) 
VALUES (@user_id_1, 2500.00, 125.00, 250.00, 2375.00, NOW());

INSERT INTO payroll (user_id, base_salary, bonuses, deductions, final_salary, payment_date) 
VALUES (@user_id_2, 2800.00, 0.00, 280.00, 2520.00, DATE_SUB(CURDATE(), INTERVAL 25 DAY));

INSERT INTO payroll (user_id, base_salary, bonuses, deductions, final_salary, payment_date) 
VALUES (@user_id_2, 2800.00, 140.00, 280.00, 2660.00, NOW());

INSERT INTO payroll (user_id, base_salary, bonuses, deductions, final_salary, payment_date) 
VALUES (@user_id_3, 2600.00, 0.00, 260.00, 2340.00, DATE_SUB(CURDATE(), INTERVAL 25 DAY));

INSERT INTO payroll (user_id, base_salary, bonuses, deductions, final_salary, payment_date) 
VALUES (@user_id_3, 2600.00, 130.00, 260.00, 2470.00, NOW());

INSERT INTO payroll (user_id, base_salary, bonuses, deductions, final_salary, payment_date) 
VALUES (@user_id_4, 2200.00, 0.00, 220.00, 1980.00, DATE_SUB(CURDATE(), INTERVAL 25 DAY));

INSERT INTO payroll (user_id, base_salary, bonuses, deductions, final_salary, payment_date) 
VALUES (@user_id_4, 2200.00, 110.00, 220.00, 2090.00, NOW());

INSERT INTO payroll (user_id, base_salary, bonuses, deductions, final_salary, payment_date) 
VALUES (@user_id_5, 2000.00, 0.00, 200.00, 1800.00, DATE_SUB(CURDATE(), INTERVAL 25 DAY));

INSERT INTO payroll (user_id, base_salary, bonuses, deductions, final_salary, payment_date) 
VALUES (@user_id_5, 2000.00, 100.00, 200.00, 1900.00, NOW());

INSERT INTO payroll (user_id, base_salary, bonuses, deductions, final_salary, payment_date) 
VALUES (@user_id_6, 3200.00, 0.00, 320.00, 2880.00, DATE_SUB(CURDATE(), INTERVAL 25 DAY));

INSERT INTO payroll (user_id, base_salary, bonuses, deductions, final_salary, payment_date) 
VALUES (@user_id_6, 3200.00, 160.00, 320.00, 3040.00, NOW());

-- ============================================================
-- CONFIRMACIÓN
-- ============================================================
SELECT 'Datos de ejemplo insertados correctamente' AS resultado;
SELECT COUNT(*) as total_employees FROM users WHERE role IN ('PANADERO', 'DECORADOR', 'SELLER', 'REFILL', 'CONTADOR');
SELECT COUNT(*) as total_attendance FROM attendance;
SELECT COUNT(*) as total_payroll FROM payroll;
