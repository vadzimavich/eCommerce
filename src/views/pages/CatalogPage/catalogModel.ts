import { Category, ProductProjection } from '@commercetools/platform-sdk';
import { Subscriber } from '../../../models/types';
import { CategoryData, ProductData, ProductQueryParameters } from '../../../models/types/api-types';
import { parseProduct, parserCategories } from '../../../utils/parsers';

export class CatalogModel {
  private products: ProductData[] = [];
  private categories: CategoryData[] = [];
  private currentParameters: ProductQueryParameters = {
    page: 1,
    limit: 6,
  };
  private currentCategory: string = '';
  private productsListener: Subscriber[] = [];
  private filtersListener: Subscriber[] = [];

  public setProducts(data: ProductProjection[]): void {
    this.products = parseProduct(data);
    this.notifyProductsListeners();
  }

  public getProducts(): ProductData[] {
    return this.products;
  }

  public setCategories(data: Category[]): void {
    this.categories = parserCategories(data);
  }

  public setParameters(update: ProductQueryParameters): void {
    if (update.filters !== undefined) {
      this.currentParameters.filters = { ...update.filters };
      this.checkIsFiltred();
      this.notifyFiltersListeners();
    }
    if (update.sort !== undefined) {
      this.currentParameters.sort = update.sort;
    }
    if (update.searchText !== undefined) {
      this.currentParameters.searchText = update.searchText;
    }

    if (update.page !== undefined) {
      this.currentParameters.page = update.page;
    }

    this.currentParameters.total = update.total;
  }

  public getParameters(): ProductQueryParameters {
    return { ...this.currentParameters };
  }

  public clearParametrs(): void {
    delete this.currentParameters.filters;
    this.notifyFiltersListeners();
  }

  public checkIsFiltred(): boolean {
    const filters = this.currentParameters.filters;
    if (!filters) return false;
    return Object.keys(filters).some((item) => {
      if (item === 'categoryId') return false;
      return item;
    });
  }

  public getCategories(): CategoryData[] {
    debugger;
    return this.categories;
  }

  public checkCategory(inputCategory: string): string | null {
    if (inputCategory === 'all') {
      return 'all';
    }
    const category = this.categories.find((item) => item.name.toLowerCase() === inputCategory);
    return category ? category.id : null;
  }

  public setSelectegCategoty(categoryName: string): void {
    this.currentCategory = categoryName[0].toUpperCase() + categoryName.slice(1);
  }

  public getSelectedCategory(): string | null {
    return this.currentCategory ?? null;
  }

  public subscribeProductsListener(callback: () => void): void {
    this.productsListener.push(callback);
  }

  public subscribeFiltersListener(callback: () => void): void {
    this.filtersListener.push(callback);
  }

  private notifyProductsListeners(): void {
    this.productsListener.forEach((callback) => callback());
  }

  private notifyFiltersListeners(): void {
    this.filtersListener.forEach((callback) => callback());
  }
}
