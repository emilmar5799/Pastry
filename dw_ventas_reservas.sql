CREATE DATABASE IF NOT EXISTS dw_ventas_reservas;
USE dw_ventas_reservas;

-- -----------------------------------------------------
-- 1. TABLAS DE DIMENSIÓN (Se crean primero)
-- -----------------------------------------------------

CREATE TABLE Dim_Employee (
    employee_key INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    user_id INT,
    full_name VARCHAR(255),
    email VARCHAR(100),
    role VARCHAR(50),
    position VARCHAR(50),
    contract_type VARCHAR(50)
);

CREATE TABLE Dim_Date (
    date_key INT PRIMARY KEY,
    full_date DATE,
    year INT,
    month INT,
    month_name VARCHAR(20),
    day INT,
    quarter INT,
    day_of_week VARCHAR(20)
);

CREATE TABLE Dim_Product (
    product_key INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    name VARCHAR(255),
    category VARCHAR(100),
    status VARCHAR(50)
);

CREATE TABLE Dim_Branch (
    branch_key INT AUTO_INCREMENT PRIMARY KEY,
    branch_id INT NOT NULL,
    name VARCHAR(255)
);

CREATE TABLE Dim_Customer (
    customer_key INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    name VARCHAR(255),
    ci VARCHAR(20)
);

-- -----------------------------------------------------
-- 2. TABLAS DE HECHOS (Fact Tables)
-- -----------------------------------------------------

-- Hechos de Nómina
CREATE TABLE Fact_Payroll (
    payroll_key INT AUTO_INCREMENT PRIMARY KEY,
    date_key INT,
    employee_key INT,
    base_salary DECIMAL(12, 2),
    bonus DECIMAL(12, 2),
    deductions DECIMAL(12, 2),
    net_salary DECIMAL(12, 2),
    CONSTRAINT fk_payroll_date FOREIGN KEY (date_key) REFERENCES Dim_Date(date_key),
    CONSTRAINT fk_payroll_employee FOREIGN KEY (employee_key) REFERENCES Dim_Employee(employee_key)
);

-- Hechos de Órdenes/Reservas
CREATE TABLE Fact_Orders (
    order_detail_id INT AUTO_INCREMENT PRIMARY KEY,
    created_date_key INT,
    delivery_date_key INT,
    employee_key INT,
    product_key INT,
    branch_key INT,
    customer_key INT,
    quantity INT,
    advance_payment DECIMAL(12, 2),
    color VARCHAR(50),
    event_type VARCHAR(50),
    order_status VARCHAR(50),
    CONSTRAINT fk_orders_created FOREIGN KEY (created_date_key) REFERENCES Dim_Date(date_key),
    CONSTRAINT fk_orders_delivery FOREIGN KEY (delivery_date_key) REFERENCES Dim_Date(date_key),
    CONSTRAINT fk_orders_employee FOREIGN KEY (employee_key) REFERENCES Dim_Employee(employee_key),
    CONSTRAINT fk_orders_product FOREIGN KEY (product_key) REFERENCES Dim_Product(product_key),
    CONSTRAINT fk_orders_branch FOREIGN KEY (branch_key) REFERENCES Dim_Branch(branch_key),
    CONSTRAINT fk_orders_customer FOREIGN KEY (customer_key) REFERENCES Dim_Customer(customer_key)
);

-- Hechos de Ventas
CREATE TABLE Fact_Sales (
    sale_detail_id INT AUTO_INCREMENT PRIMARY KEY,
    date_key INT,
    employee_key INT,
    product_key INT,
    branch_key INT,
    customer_key INT,
    quantity INT,
    unit_price DECIMAL(12, 2),
    subtotal DECIMAL(12, 2),
    payment_method VARCHAR(50),
    CONSTRAINT fk_sales_date FOREIGN KEY (date_key) REFERENCES Dim_Date(date_key),
    CONSTRAINT fk_sales_employee FOREIGN KEY (employee_key) REFERENCES Dim_Employee(employee_key),
    CONSTRAINT fk_sales_product FOREIGN KEY (product_key) REFERENCES Dim_Product(product_key),
    CONSTRAINT fk_sales_branch FOREIGN KEY (branch_key) REFERENCES Dim_Branch(branch_key),
    CONSTRAINT fk_sales_customer FOREIGN KEY (customer_key) REFERENCES Dim_Customer(customer_key)
);