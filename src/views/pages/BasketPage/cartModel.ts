import { Cart } from '@commercetools/platform-sdk';
import { Subscriber } from '../../../models/types';

export class CartModel {
  private cart: Cart | null = null;
  private cartUpdateListeners: Subscriber[] = [];

  public getCart(): Cart | null {
    return this.cart;
  }

  public setCart(cart: Cart | null): void {
    this.cart = cart;
    this.notifyCartUpdateListeners();
  }

  public subscribeToCartUpdates(listener: Subscriber): void {
    this.cartUpdateListeners.push(listener);
  }

  private notifyCartUpdateListeners(): void {
    this.cartUpdateListeners.forEach((listener) => listener());
  }
}
