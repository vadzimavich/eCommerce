import { Customer } from '@commercetools/platform-sdk';
import { Subscriber } from '../types';
import { REFRESH_TOKEN } from '../../controllers/AuthController';
import { CART_ID_KEY } from '../services/CartService';

export class AppModel {
  private currentUser: Partial<Customer> = {};
  private isLogined: boolean = false;
  private currentHash: string = '/';
  private loginStateListener: Subscriber[] = [];
  private currentPageListener: Subscriber[] = [];

  public initUserFromSession(): void {
    const storedUser = sessionStorage.getItem(REFRESH_TOKEN);
    if (storedUser) {
      this.isLogined = true;
      this.notifyLoginStateListener();
    }
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
    this.notifyLoginStateListener();
  }

  public login(customer: Customer): void {
    this.currentUser = customer;
    this.isLogined = true;
    sessionStorage.removeItem(CART_ID_KEY);
    this.notifyLoginStateListener();
  }

  public setCurrentHash(hash: string): void {
    this.currentHash = hash;
    this.notifyCurrentPageListener();
  }

  public subscribeLoginStateListener(callback: () => void): void {
    this.loginStateListener.push(callback);
  }

  public subscribeCurrentPageListener(callback: () => void): void {
    this.currentPageListener.push(callback);
  }

  private notifyLoginStateListener(): void {
    this.loginStateListener.forEach((callback) => callback());
  }

  private notifyCurrentPageListener(): void {
    this.currentPageListener.forEach((callback) => callback());
  }
}
