import { products } from '../data/shop.js';

export const findProduct = (slug) => products.find((product) => product.slug === slug) ?? products[0];

export const productsByCategory = (slug) =>
  slug ? products.filter((product) => product.categorySlug === slug) : products;

export const searchProducts = (query, source = products) => {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return source;
  }

  return source.filter((product) =>
    `${product.title} ${product.category} ${product.brand} ${product.sku}`.toLowerCase().includes(normalized)
  );
};
