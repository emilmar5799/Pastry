import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as service from '../services/order.service';

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const result = await service.createOrder(req.user!, req.body);
    res.status(201).json(result);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};

export const list = async (req: AuthRequest, res: Response) => {
  res.json(await service.listOrders(req.user!.branchId));
};

export const get = async (req: AuthRequest, res: Response) => {
  res.json(await service.getOrder(Number(req.params.id)));
};

export const update = async (req: AuthRequest, res: Response) => {
  await service.updateOrder(Number(req.params.id), req.body);
  res.json({ message: 'Updated' });
};

export const markFailed = async (req: AuthRequest, res: Response) => {
  await service.markAsFailed(Number(req.params.id));
  res.json({ message: 'Order marked as FAILED' });
};

export const markDelivered = async (req: AuthRequest, res: Response) => {
  await service.markAsDelivered(Number(req.params.id));
  res.json({ message: 'Order marked as DELIVERED' });
};

export const markDone = async (req: AuthRequest, res: Response) => {
  await service.markAsDone(Number(req.params.id));
  res.json({ message: 'Order marked as DONE' });
};

export const markFinished = async (req: AuthRequest, res: Response) => {
  await service.markAsFinished(Number(req.params.id));
  res.json({ message: 'Order marked as FINISHED' });
};
