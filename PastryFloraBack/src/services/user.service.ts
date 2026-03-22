import bcrypt from 'bcrypt'
import * as repo from '../repositories/user.repository'
import { User } from '../models/user.model'

export const createUser = async (data: any) => {
  const hashedPassword = await bcrypt.hash(data.password, 10)

  const userId = await repo.createUser({
    ...data,
    password: hashedPassword
  })

  return { id: userId }
}

export const getUsers = async () => {
  return repo.findAllUsers()
}

export const getInactiveUsers = async () => {
  return repo.findInactiveUsers()
}

export const getUserById = async (id: number) => {
  const user = await repo.findUserById(id)
  if (!user) throw new Error('User not found')
  return user
}

export const updateUser = async (id: number, data: any) => {
  await repo.updateUser(id, data)

}

export const deleteUser = async (id: number) => {
  await repo.softDeleteUser(id)
}

export const reactivateUser = async (id: number) => {
  await repo.reactivateUser(id)
}
