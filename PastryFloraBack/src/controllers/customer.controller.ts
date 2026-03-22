import { Request, Response } from 'express';
import * as service from '../services/customer.service';

export const create = async (req: Request, res: Response) => {
  try {
    const result = await service.createCustomer(req.body);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const list = async (_req: Request, res: Response) => {
  try {
    const customers = await service.listCustomers();
    res.json(customers);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
