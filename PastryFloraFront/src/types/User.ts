export type UserRole = 'ADMIN' | 'SUPERVISOR' | 'SELLER' | 'REFILL'

export interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  role: UserRole
  active: boolean
  branch_id: number
  salary?: number
  created_at: string
}
