export interface Employee {
  id: number;
  user_id: number;
  hire_date: Date;
  position: string;
  department?: string;
  contract_type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
  created_at: Date;
  updated_at: Date;
}

export interface EmployeeWithUser extends Employee {
  first_name: string;
  last_name: string;
  email: string;
  salary?: number;
  active: boolean;
  role: string;
}
