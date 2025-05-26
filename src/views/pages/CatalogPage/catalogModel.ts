import { Subscriber } from '../../../models/types';
import { ProductData } from '../../../models/types/api-types';

export class CatalogModel {
  private products: ProductData[] = [];
  private productsListener: Subscriber[] = [];

  public setProducts(data: ProductData[]): void {
    this.products = data;
    this.notifyProductsListeners();
    console.log(this.products);
  }

  public getProducts(): ProductData[] {
    return this.products;
  }

  public subscribeProductsListener(callback: () => void): void {
    this.productsListener.push(callback);
  }

  private notifyProductsListeners(): void {
    this.productsListener.forEach((callback) => callback());
  }
}
