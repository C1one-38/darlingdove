import { createSelector } from 'reselect';

export const getCategory = state => state.category;

export const getProducts = createSelector(
  getCategory,
  category => category.products
);

export const getProductsCount = createSelector(
  getProducts,
  products => products.count
);

export const getProductsData = createSelector(
  getProducts,
  products => products.data
);

export const getTags = createSelector(getCategory, category => category.tags);
