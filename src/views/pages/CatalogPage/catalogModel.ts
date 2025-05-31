import { Category, ProductProjection } from '@commercetools/platform-sdk';
import { Subscriber } from '../../../models/types';
import { CategoryData, ProductData, ProductQueryParameters } from '../../../models/types/api-types';
import { parseProduct, parserCategories } from '../../../utils/parsers';

export class CatalogModel {
  private products: ProductData[] = [];
  private categories: CategoryData[] = [];
  private currentParameters: ProductQueryParameters = {};

  private productsListener: Subscriber[] = [];
  private categoryListeners: Subscriber[] = [];

  public setProducts(data: ProductProjection[]): void {
    this.products = parseProduct(data);
    this.notifyProductsListeners();
  }

  public getProducts(): ProductData[] {
    return this.products;
  }

  public setCategories(data: Category[]): void {
    this.categories = parserCategories(data);
    this.notifyCategoryListeners();
  }

  public setParameters(update: ProductQueryParameters): void {
    if (update.filters) {
      this.currentParameters.filters = {
        ...this.currentParameters.filters,
        ...update.filters,
      };
      this.checkIsFiltred();
      console.log(this.checkIsFiltred());
    }

    if (update.sort !== undefined) {
      this.currentParameters.sort = update.sort;
    }

    if (update.searchText !== undefined) {
      this.currentParameters.searchText = update.searchText;
    }
  }

  public getParameters(): ProductQueryParameters {
    return { ...this.currentParameters };
  }

  public clearParametrs(): void {
    this.currentParameters.filters = {};
    this.checkIsFiltred();
  }

  public checkIsFiltred(): boolean {
    const filters = this.currentParameters.filters;
    if (!filters) return false;
    return Object.values(filters).some((item) => {
      if (+item <= 0) {
        return false;
      }
      return item;
    });
  }

  public getCategories(): CategoryData[] {
    return this.categories;
  }

  public subscribeProductsListener(callback: () => void): void {
    this.productsListener.push(callback);
  }

  public subscribeToCategoryUpdate(callback: () => void): void {
    this.categoryListeners.push(callback);
  }

  private notifyProductsListeners(): void {
    this.productsListener.forEach((callback) => callback());
  }

  private notifyCategoryListeners(): void {
    this.categoryListeners.forEach((callback) => callback());
  }
}
