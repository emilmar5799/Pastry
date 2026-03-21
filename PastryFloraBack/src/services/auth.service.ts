import { findUserByEmail } from '../repositories/user.repository';
import { comparePassword } from '../utils/hash';
import { signToken } from '../config/jwt';
import { insertLoginHistory } from '../repositories/login-history.repository';


export const login = async (
  email: string,
  password: string,
  branchId: number,
  ip?: string,
  userAgent?: string
) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    throw new Error('Invalid credentials');
  }
  await insertLoginHistory(
    user.id,
    branchId,
    ip,
    userAgent
  );
  const token = signToken({
    userId: user.id,
    role: user.role,
    branchId
  });

  return {
    token,
    user: {
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      role: user.role
    }
  };
};
