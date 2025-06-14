import { Cart, LineItem } from '@commercetools/platform-sdk';
import { Subscriber } from '../../../models/types';
import { ProductData } from '../../../models/types/api-types';

export class ProductModel {
  public dataProduct: ProductData | null;
  public isAdded: boolean;
  public cart: Cart | null = null;
  public lineItemCart: LineItem | undefined = undefined;
  private readonly productsListener: Subscriber[] = [];
  constructor() {
    this.dataProduct = null;
    this.isAdded = false;
    this.notifyProductListeners();
  }

  public setCartAndLineItem(data: Cart): void {
    this.cart = data;
    this.lineItemCart = this.cart.lineItems.find((item) => item.id === this.dataProduct?.id);
  }

  public checkProductInCart(): void {
    const cartsWithProduct = this.cart?.lineItems.filter((item) => item.productId === this.dataProduct?.id);
    if (cartsWithProduct) {
      this.lineItemCart = cartsWithProduct[0];
      this.isAdded = true;
    } else {
      this.isAdded = false;
    }
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
