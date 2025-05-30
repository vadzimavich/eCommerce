import { Category } from '@commercetools/platform-sdk';
import { Subscriber } from '../../../models/types';
import { CategoryData, ProductData, ProductFilter } from '../../../models/types/api-types';
import { parserCategories } from '../../../utils/parsers';

export class CatalogModel {
  private products: ProductData[] = [];
  private categories: CategoryData[] = [];
  private filters: ProductFilter = {};
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

  public setFilters(filterUpdate: ProductFilter): void {
    this.filters = { ...this.filters, ...filterUpdate };
    console.log(this.filters);
  }

  public getFilters(): ProductFilter {
    return this.filters;
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
