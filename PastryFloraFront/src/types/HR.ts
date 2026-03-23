// Empleados
export interface Employee {
  id: number;
  user_id: number;
  hire_date: string;
  position: string;
  department?: string;
  contract_type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
  created_at: string;
  updated_at: string;
}

export interface EmployeeWithUser extends Employee {
  first_name: string;
  last_name: string;
  email: string;
  salary?: number;
  active: boolean;
  role: string;
}

// Asistencia
export interface Attendance {
  id: number;
  employee_id: number;
  date: string;
  check_in?: string;
  check_out?: string;
  hours_worked: number;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY';
  created_at: string;
  updated_at: string;
}

export interface AttendanceSummary {
  total_hours: number;
  total_days: number;
  present_days: number;
  absent_days: number;
  late_days: number;
  half_days: number;
}

// Nóminas
export interface Payroll {
  id: number;
  employee_id: number;
  pay_period_start: string;
  pay_period_end: string;
  base_salary: number;
  overtime_hours: number;
  overtime_rate: number;
  total_earnings: number;
  deductions: number;
  net_pay: number;
  payment_date?: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  created_at: string;
  updated_at: string;
}

export interface PayrollDetail extends Payroll {
  employee_name?: string;
  email?: string;
}

// Bonificaciones
export interface Bonus {
  id: number;
  employee_id: number;
  bonus_amount: number;
  bonus_type: 'PERFORMANCE' | 'ANNUAL' | 'SPECIAL';
  reason?: string;
  bonus_date: string;
  approved_by?: number;
  created_at: string;
  updated_at: string;
}

export interface BonusDetail extends Bonus {
  employee_name?: string;
  approved_by_name?: string;
}

// Payloads para crear/actualizar
export interface CreateEmployeePayload {
  user_id: number;
  hire_date: string;
  position: string;
  department?: string;
  contract_type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
  role: string;
}

export interface UpdateEmployeePayload {
  position?: string;
  department?: string;
  contract_type?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
  hire_date?: string;
  role?: string;
}

export interface CreateAttendancePayload {
  employee_id: number;
  date: string;
  check_in?: string;
  check_out?: string;
  status?: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY';
}

export interface CreatePayrollPayload {
  employee_id: number;
  pay_period_start: string;
  pay_period_end: string;
}

export interface CreateBonusPayload {
  employee_id: number;
  bonus_amount: number;
  bonus_type: 'PERFORMANCE' | 'ANNUAL' | 'SPECIAL';
  reason?: string;
  bonus_date: string;
  approved_by?: number;
}
