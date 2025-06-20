/**
 * @jest-environment jsdom
 */

import { CatalogModel } from '../../../views/pages/CatalogPage/catalogModel';

jest.mock('../../../utils/parsers');

// eslint-disable-next-line max-lines-per-function
describe('CatalogModel:', () => {
  let catalogModel = new CatalogModel();
  const mockModel = {
    filtersListener: [],
    productsListener: [],
    currentCategory: '',
    products: [],
    currentParameters: { filters: {}, sort: '', searchText: '' },
    categories: [{}],
    setProducts: catalogModel.setProducts,
    getProducts: catalogModel.getProducts,
    setCategories: catalogModel.setCategories,
    setParameters: catalogModel.setParameters,
    getCategories: catalogModel.getCategories,
    getParameters: catalogModel.getParameters,
    setSelectegCategoty: catalogModel.setSelectegCategoty,
    getSelectedCategory: catalogModel.getSelectedCategory,
    clearParametrs: catalogModel.clearParametrs,
    checkIsFiltred: catalogModel.checkIsFiltred,
    checkCategory: catalogModel.checkCategory,
    subscribeProductsListener: catalogModel.subscribeProductsListener,
    subscribeFiltersListener: catalogModel.subscribeFiltersListener,
    notifyProductsListeners: jest.fn(),
    notifyFiltersListeners: jest.fn(),
  };

  describe('setParameters():', () => {
    beforeEach(() => {
      mockModel.currentParameters = { filters: {}, sort: '', searchText: '' };
      mockModel.notifyFiltersListeners.mockClear();
    });

    test('updates filters and notifies listeners', () => {
      const parametersUpdate = { filters: { color: 'red' } };
      mockModel.setParameters(parametersUpdate);

      expect(mockModel.currentParameters.filters).toEqual(parametersUpdate.filters);
      expect(mockModel.notifyFiltersListeners).toHaveBeenCalled();
    });

    test('updates sort and searchText but does not notify listeners', () => {
      const parametersUpdate = { sort: 'price', searchText: 'test' };
      mockModel.setParameters(parametersUpdate);

      expect(mockModel.currentParameters.filters).toEqual({});
      expect(mockModel.notifyFiltersListeners).not.toHaveBeenCalled();
    });

    test('updates sort and does not notify listeners', () => {
      const parametersUpdate = { sort: 'price' };
      mockModel.setParameters(parametersUpdate);

      expect(mockModel.currentParameters.sort).toEqual(parametersUpdate.sort);
      expect(mockModel.notifyFiltersListeners).not.toHaveBeenCalled();
    });

    test('updates searchText and does not notify listeners', () => {
      const parametersUpdate = { searchText: 'test' };
      mockModel.setParameters(parametersUpdate);

      expect(mockModel.currentParameters.searchText).toEqual(parametersUpdate.searchText);
      expect(mockModel.notifyFiltersListeners).not.toHaveBeenCalled();
    });
  });

  describe('clearParametrs():', () => {
    test('clears filters and notifies listeners', () => {
      mockModel.setParameters({ filters: { color: 'red' } });
      mockModel.clearParametrs();

      expect(mockModel.getParameters().filters).toBeUndefined();
      expect(mockModel.notifyFiltersListeners).toHaveBeenCalled();
    });
  });

  describe('checkIsFiltred():', () => {
    test('returns true if there are filters', () => {
      mockModel.setParameters({ filters: { color: 'red' } });
      expect(mockModel.checkIsFiltred()).toBe(true);
    });

    test('returns false if there are no filters', () => {
      mockModel.setParameters({ filters: {} });
      expect(mockModel.checkIsFiltred()).toBe(false);
    });
  });

  describe('checkCategory():', () => {
    test('returns category id if category exists', () => {
      mockModel.categories = [{ id: 'category', name: 'Category 1' }];

      expect(mockModel.checkCategory('category 1')).toBe('category');
    });

    test('returns null if category does not exist', () => {
      mockModel.categories = [{ id: 'category', name: 'Category 1' }];

      expect(mockModel.checkCategory('non-existing')).toBe(null);
    });

    test('returns "all" if input is "all"', () => {
      expect(mockModel.checkCategory('all')).toBe('all');
    });
  });

  describe('setSelectegCategoty():', () => {
    test('sets the selected category with first letter capitalized', () => {
      mockModel.setSelectegCategoty('test');
      expect(mockModel.currentCategory).toBe('Test');
    });
  });

  describe('getSelectedCategory():', () => {
    test('returns the selected category if set', () => {
      mockModel.currentCategory = 'Test';
      expect(mockModel.getSelectedCategory()).toBe('Test');
    });
  });

  describe('subscribeProductsListener():', () => {
    test('adds a product listener and it gets called on product update', () => {
      const callback = jest.fn();
      mockModel.subscribeProductsListener(callback);

      expect(mockModel.productsListener).toContain(callback);
    });
  });

  describe('subscribeFiltersListener():', () => {
    test('adds a filters listener and it gets called on filters update', () => {
      const callback = jest.fn();
      mockModel.subscribeFiltersListener(callback);

      expect(mockModel.filtersListener).toContain(callback);
    });
  });
});
