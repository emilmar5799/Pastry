-- etl_ventas_reservas.sql
-- Script para poblar dw_ventas_reservas desde la base de datos Pastry

SET FOREIGN_KEY_CHECKS = 0;

-- Limpiar las tablas de hechos y dimensiones en el Data Warehouse
TRUNCATE TABLE dw_ventas_reservas.Fact_Sales;
TRUNCATE TABLE dw_ventas_reservas.Fact_Orders;
TRUNCATE TABLE dw_ventas_reservas.Fact_Payroll;

TRUNCATE TABLE dw_ventas_reservas.Dim_Customer;
TRUNCATE TABLE dw_ventas_reservas.Dim_Branch;
TRUNCATE TABLE dw_ventas_reservas.Dim_Product;
TRUNCATE TABLE dw_ventas_reservas.Dim_Date;
TRUNCATE TABLE dw_ventas_reservas.Dim_Employee;

SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================
-- 1. POBLAR TABLAS DE DIMENSIÓN
-- ==========================================

-- Poblar Dim_Employee
INSERT INTO dw_ventas_reservas.Dim_Employee (employee_id, user_id, full_name, email, role, position, contract_type)
SELECT 
    e.id AS employee_id,
    u.id AS user_id,
    CONCAT(u.first_name, ' ', u.last_name) AS full_name,
    u.email,
    u.role,
    e.position,
    e.contract_type
FROM Pastry.employees e
JOIN Pastry.users u ON e.user_id = u.id;

-- Poblar Dim_Date
INSERT IGNORE INTO dw_ventas_reservas.Dim_Date (date_key, full_date, year, month, month_name, day, quarter, day_of_week)
SELECT DISTINCT 
    CAST(DATE_FORMAT(d.date_val, '%Y%m%d') AS UNSIGNED) AS date_key,
    DATE(d.date_val),
    YEAR(d.date_val),
    MONTH(d.date_val),
    MONTHNAME(d.date_val),
    DAY(d.date_val),
    QUARTER(d.date_val),
    DAYNAME(d.date_val)
FROM (
    SELECT DATE(sale_date) AS date_val FROM Pastry.sales WHERE sale_date IS NOT NULL
    UNION
    SELECT DATE(created_at) FROM Pastry.orders WHERE created_at IS NOT NULL
    UNION
    SELECT DATE(delivery_date) FROM Pastry.orders WHERE delivery_date IS NOT NULL
    UNION
    SELECT DATE(payment_date) FROM Pastry.payroll WHERE payment_date IS NOT NULL
) d
WHERE d.date_val IS NOT NULL;

-- Poblar Dim_Product
INSERT INTO dw_ventas_reservas.Dim_Product (product_id, name, category, status)
SELECT 
    id, name, category, status
FROM Pastry.products;

-- Poblar Dim_Branch
INSERT INTO dw_ventas_reservas.Dim_Branch (branch_id, name)
SELECT 
    id, name
FROM Pastry.branches;

-- Poblar Dim_Customer
INSERT INTO dw_ventas_reservas.Dim_Customer (customer_id, name, ci)
SELECT 
    id, name, ci
FROM Pastry.customers;

-- ==========================================
-- 2. POBLAR TABLAS DE HECHOS
-- ==========================================

-- Poblar Fact_Payroll
INSERT INTO dw_ventas_reservas.Fact_Payroll (date_key, employee_key, base_salary, bonus, deductions, net_salary)
SELECT 
    CAST(DATE_FORMAT(p.payment_date, '%Y%m%d') AS UNSIGNED) AS date_key,
    de.employee_key,
    p.base_salary,
    p.bonuses,
    p.deductions,
    p.final_salary
FROM Pastry.payroll p
JOIN dw_ventas_reservas.Dim_Employee de ON de.user_id = p.user_id; 

-- Poblar Fact_Orders
INSERT INTO dw_ventas_reservas.Fact_Orders (
    created_date_key,
    delivery_date_key,
    employee_key,
    product_key,
    branch_key,
    customer_key,
    quantity,
    advance_payment,
    color,
    event_type,
    order_status
)
SELECT 
    CAST(DATE_FORMAT(o.created_at, '%Y%m%d') AS UNSIGNED) AS created_date_key,
    CAST(DATE_FORMAT(o.delivery_date, '%Y%m%d') AS UNSIGNED) AS delivery_date_key,
    de.employee_key,
    dp.product_key,
    db.branch_key,
    dc.customer_key,
    op.quantity,
    o.advance,
    o.color,
    o.event_type,
    o.status
FROM Pastry.orders o
JOIN Pastry.order_products op ON op.order_id = o.id
LEFT JOIN dw_ventas_reservas.Dim_Employee de ON de.user_id = o.employee_id
LEFT JOIN dw_ventas_reservas.Dim_Product dp ON dp.product_id = op.product_id
LEFT JOIN dw_ventas_reservas.Dim_Branch db ON db.branch_id = o.branch_id
LEFT JOIN dw_ventas_reservas.Dim_Customer dc ON dc.customer_id = o.customer_id;

-- Poblar Fact_Sales
INSERT INTO dw_ventas_reservas.Fact_Sales (
    date_key,
    employee_key,
    product_key,
    branch_key,
    customer_key,
    quantity,
    unit_price,
    subtotal,
    payment_method
)
SELECT 
    CAST(DATE_FORMAT(s.sale_date, '%Y%m%d') AS UNSIGNED) AS date_key,
    de.employee_key,
    dp.product_key,
    db.branch_key,
    dc.customer_key,
    sp.quantity,
    sp.unit_price,
    sp.subtotal,
    s.payment_method
FROM Pastry.sales s
JOIN Pastry.sale_products sp ON sp.sale_id = s.id
LEFT JOIN dw_ventas_reservas.Dim_Employee de ON de.user_id = s.employee_id
LEFT JOIN dw_ventas_reservas.Dim_Product dp ON dp.product_id = sp.product_id
LEFT JOIN dw_ventas_reservas.Dim_Branch db ON db.branch_id = s.branch_id
LEFT JOIN dw_ventas_reservas.Dim_Customer dc ON dc.customer_id = s.customer_id;
