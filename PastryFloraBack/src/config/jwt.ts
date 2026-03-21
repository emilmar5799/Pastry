import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { env } from './env';

export interface JwtPayload {
  userId: number;
  role: string;
  branchId: number;
}

export const signToken = (payload: JwtPayload) => {
  return jwt.sign(payload, env.jwt.secret as Secret, {
    expiresIn: env.jwt.expiresIn as SignOptions['expiresIn']
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.jwt.secret) as JwtPayload;
};
