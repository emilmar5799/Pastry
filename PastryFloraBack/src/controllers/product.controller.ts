import { Request, Response } from 'express';
import * as productService from '../services/product.service';

export const create = async (req: Request, res: Response) => {
  const { name, price } = req.body;
  await productService.createProduct(name, Number(price));
  res.status(201).json({ message: 'Product created' });
};

export const list = async (_req: Request, res: Response) => {
  const products = await productService.listProducts();
  res.json(products);
};

export const getById = async (req: Request, res: Response) => {
  const product = await productService.getProduct(Number(req.params.id));
  res.json(product);
};

export const update = async (req: Request, res: Response) => {
  const { name, price } = req.body;
  await productService.updateProduct(
    Number(req.params.id),
    name,
    Number(price)
  );
  res.json({ message: 'Product updated' });
};

export const remove = async (req: Request, res: Response) => {
  await productService.deleteProduct(Number(req.params.id));
  res.json({ message: 'Product deleted' });
};
