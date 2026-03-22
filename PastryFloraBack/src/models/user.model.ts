export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: UserRole;
  salary?: number;
  active: boolean;
  created_at: Date;
}

export type UserRole = 'ADMIN' | 'SUPERVISOR' | 'SELLER' | 'REFILL';
