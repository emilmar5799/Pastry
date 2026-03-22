import * as productRepo from '../repositories/product.repository';

export const createProduct = async (name: string, price: number, description?: string, category?: string, status?: string) => {
  if (!name || price <= 0) {
    throw new Error('Invalid product data');
  }

  await productRepo.createProduct(name, price, description, category, status);
};

export const listProducts = async () => {
  return productRepo.getAllProducts();
};

export const getProduct = async (id: number) => {
  const product = await productRepo.getProductById(id);
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

export const updateProduct = async (
  id: number,
  name: string,
  price: number,
  description?: string,
  category?: string,
  status?: string
) => {
  await productRepo.updateProduct(id, name, price, description, category, status);
};

export const deleteProduct = async (id: number) => {
  await productRepo.deleteProduct(id);
};
