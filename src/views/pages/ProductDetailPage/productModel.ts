import { Subscriber } from '../../../models/types';
import { ProductData } from '../../../models/types/api-types';

export class ProductModel {
  public dataProduct: ProductData | null;
  private productsListener: Subscriber[] = [];
  constructor() {
    this.dataProduct = null;
    this.notifyProductListeners();
  }

  public setProducts(data: ProductData): void {
    this.dataProduct = data;
    this.notifyProductListeners();
  }

  public subscribeProductListener(callback: () => void): void {
    this.productsListener.push(callback);
  }

  private notifyProductListeners(): void {
    this.productsListener.forEach((callback) => callback());
  }
}
