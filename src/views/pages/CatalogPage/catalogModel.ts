import { Category } from '@commercetools/platform-sdk';
import { Subscriber } from '../../../models/types';
import { CategoryData, ProductData, ProductQueryParameters } from '../../../models/types/api-types';
import { parserCategories } from '../../../utils/parsers';

export class CatalogModel {
  private products: ProductData[] = [];
  private categories: CategoryData[] = [];
  private currentParameters: ProductQueryParameters = {};
  private productsListener: Subscriber[] = [];

  private categoryListeners: Subscriber[] = [];

  public setProducts(data: ProductData[]): void {
    this.products = data;
    this.notifyProductsListeners();
    console.log(this.products);
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
