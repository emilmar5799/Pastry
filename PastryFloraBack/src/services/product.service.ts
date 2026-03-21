import * as productRepo from '../repositories/product.repository';

export const createProduct = async (name: string, price: number) => {
  if (!name || price <= 0) {
    throw new Error('Invalid product data');
  }

  await productRepo.createProduct(name, price);
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
  price: number
) => {
  await productRepo.updateProduct(id, name, price);
};

export const deleteProduct = async (id: number) => {
  await productRepo.deleteProduct(id);
};
