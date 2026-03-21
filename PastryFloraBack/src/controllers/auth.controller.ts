import { Request, Response } from 'express';
import * as authService from '../services/auth.service';


export const login = async (req: Request, res: Response) => {
  const { email, password, branchId } = req.body;

  if (!email || !password || !branchId) {
    return res.status(400).json({
      message: 'Email, password and branchId are required'
    });
  }

  const result = await authService.login(
    email,
    password,
    Number(branchId),
    req.ip,
    req.headers['user-agent']
  );

  res.json(result);
};
