USE Pastry;

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
