USE Pastry;

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

