/**
 * @jest-environment jsdom
 */

import { ProductModel } from '../../../views/pages/ProductDetailPage/productModel';
import { ProductView } from '../../../views/pages/ProductDetailPage/productView';

jest.mock('../../../views/pages/ProductDetailPage/productModel');

// eslint-disable-next-line max-lines-per-function
describe('ProductView', () => {
  let mockModel: ProductModel;
  let mockView: ProductView;

  beforeEach(() => {
    mockModel = new ProductModel();
    mockView = new ProductView(mockModel);
  });

  test('should be defined', () => {
    expect(mockView).toBeDefined();
  });

  test('render(): should return the container element', () => {
    const result = mockView.render();
    expect(result).toBe(mockView.getContainer());
  });

  test('loadData(): should display loader when no product data is available', () => {
    mockModel.dataProduct = null;

    mockView.loadData();

    const loader = mockView.getContainer().querySelector('.loader');
    expect(loader).toBeTruthy();
  });

  test('loadData(): should call renderProduct() when product data is available', () => {
    mockModel.dataProduct = {
      id: '1',
      title: 'test',
      description: 'test',
      price: 100,
    };
    jest.spyOn(mockView, 'renderProduct');

    mockView.loadData();

    expect(mockView.renderProduct).toHaveBeenCalled();
  });

  test('renderProduct(): should create the product wrapper', () => {
    mockModel.dataProduct = {
      id: '2',
      title: 'test',
      description: 'test',
      price: 200,
    };
    mockView.renderProduct();

    const wrapper = mockView.getContainer().querySelector('.product__wrapper');
    expect(wrapper).toBeTruthy();
  });
});
