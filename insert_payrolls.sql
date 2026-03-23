USE Pastry;

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

