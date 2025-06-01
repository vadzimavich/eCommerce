/**
 * @jest-environment jsdom
 */

import { AppModel } from '../../models/state/AppState';
import { ProductPage } from '../../views/pages/ProductDetailPage';
import { ProductController } from '../../views/pages/ProductDetailPage/productController';
import { ProductModel } from '../../views/pages/ProductDetailPage/productModel';
import { ProductView } from '../../views/pages/ProductDetailPage/productView';

jest.mock('../../views/pages/ProductDetailPage/productModel');
jest.mock('../../views/pages/ProductDetailPage/productView');
jest.mock('../../views/pages/ProductDetailPage/productController');

describe('ProductPage', () => {
  let mockAppModel: AppModel;
  let productPage: ProductPage;
  const mockParameter = { id: '123' };

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    mockAppModel = {} as AppModel;
    productPage = new ProductPage(mockAppModel, mockParameter);
  });

  test('ProductPage: should initialize with ProductModel and ProductView', () => {
    expect(productPage).toBeDefined();
    expect(ProductModel).toHaveBeenCalled();
    expect(ProductView).toHaveBeenCalledWith(expect.any(ProductModel));
  });

  test('render(): should render and return an HTMLElement', () => {
    const mockRender = document.createElement('div');
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    (ProductView.prototype.render as jest.Mock).mockReturnValue(mockRender);

    const result = productPage.render();

    expect(result).toBe(mockRender);
    expect(ProductController).toHaveBeenCalledWith(
      mockAppModel,
      expect.any(ProductModel),
      expect.any(ProductView),
      mockParameter
    );
  });
});
