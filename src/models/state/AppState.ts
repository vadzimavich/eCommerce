import { Cart, Customer } from '@commercetools/platform-sdk';
import { Subscriber } from '../types';
import { REFRESH_TOKEN } from '../../controllers/AuthController';
import { ANON_CART_ID, CartService } from '../services/CartService';
import { CUSTOMER_CART } from '../services/AuthService';

export class AppModel {
  private currentUser: Partial<Customer> = {};
  private isLogined: boolean = false;
  private currentHash: string = '/';
  private currentCart: Cart | null = null;
  private loginStateListener: Subscriber[] = [];
  private currentPageListener: Subscriber[] = [];
  private coinProductsInCartListener: Subscriber[] = [];

  public initUserFromSession(): void {
    const storedUser = sessionStorage.getItem(REFRESH_TOKEN);
    if (storedUser) {
      this.isLogined = true;
      this.notifyLoginStateListener();
    }
    CartService.getInstance(this).getOrCreateCart();
  }

  public getLoginState(): boolean {
    return this.isLogined;
  }

  public setCurrentUser(user: Customer): void {
    this.currentUser = user;
  }

  public getCurrentUser(): Partial<Customer> {
    return this.currentUser;
  }

  public getCurrentRoute(): string {
    return this.currentHash;
  }

  public logout(): void {
    this.currentUser = {};
    this.isLogined = false;
    sessionStorage.removeItem(REFRESH_TOKEN);
    sessionStorage.removeItem(CUSTOMER_CART);
    this.currentCart = null;
    this.notifyLoginStateListener();
    this.notifyCoinProductsInCartListener();
  }

  public login(customer: Customer): void {
    this.currentUser = customer;
    this.isLogined = true;
    sessionStorage.removeItem(ANON_CART_ID);
    this.notifyLoginStateListener();
    this.notifyCoinProductsInCartListener();
  }

  public setCurrentHash(hash: string): void {
    this.currentHash = hash;
    this.notifyCurrentPageListener();
  }

  public setCartItems(cart: Cart): void {
    this.currentCart = cart;
    this.notifyCoinProductsInCartListener();
  }

  public getCurrentCart(): Cart | null {
    return this.currentCart;
  }

  public getProductsIdInCart(): string[] | null {
    if (!this.currentCart) {
      return null;
    }
    const products = this.currentCart.lineItems;
    return products.map((li) => li.productId);
  }

  public getCoinProductsInCart(): number | null {
    if (!this.currentCart) {
      return null;
    }
    const coin = this.currentCart.totalLineItemQuantity;
    return coin || null;
  }

  public subscribeLoginStateListener(callback: () => void): void {
    this.loginStateListener.push(callback);
  }

  public subscribeCurrentPageListener(callback: () => void): void {
    this.currentPageListener.push(callback);
  }

  public subscribeCoinProductsInCartListener(callback: () => void): void {
    this.coinProductsInCartListener.push(callback);
  }

  private notifyLoginStateListener(): void {
    this.loginStateListener.forEach((callback) => callback());
  }

  private notifyCurrentPageListener(): void {
    this.currentPageListener.forEach((callback) => callback());
  }

  private notifyCoinProductsInCartListener(): void {
    this.coinProductsInCartListener.forEach((callback) => callback());
  }
}
