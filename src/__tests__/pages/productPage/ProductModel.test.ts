/**
 * @jest-environment jsdom
 */

import { ProductModel } from '../../../views/pages/ProductDetailPage/productModel';
import { ProductData } from '../../../models/types/api-types';

// eslint-disable-next-line max-lines-per-function
describe('ProductModel', () => {
  let productModel: ProductModel;

  beforeEach(() => {
    productModel = new ProductModel();
  });

  test('dataProduct: should initialize with null dataProduct', () => {
    expect(productModel.dataProduct).toBeNull();
  });

  test('setProducts(): should set products and notify listeners', () => {
    const mockCallback = jest.fn();
    productModel.subscribeProductListener(mockCallback);

    const productData: ProductData = {
      id: '1',
      title: 'test',
      description: 'test',
      price: 100,
    };

    productModel.setProducts(productData);

    expect(productModel.dataProduct).toEqual(productData);
    expect(mockCallback).toHaveBeenCalled();
  });

  test('subscribeProductListener(): should notify multiple listeners', () => {
    const mockCallback1 = jest.fn();
    const mockCallback2 = jest.fn();
    productModel.subscribeProductListener(mockCallback1);
    productModel.subscribeProductListener(mockCallback2);

    const productData: ProductData = {
      id: '2',
      title: 'test',
      description: 'test',
      price: 200,
    };

    productModel.setProducts(productData);

    expect(mockCallback1).toHaveBeenCalled();
    expect(mockCallback2).toHaveBeenCalled();
  });
});
