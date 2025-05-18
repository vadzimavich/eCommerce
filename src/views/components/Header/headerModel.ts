import { Subscriber } from '../../../models/types';

export class HeaderModel {
  private currentRoute: string;
  private isOpenBM: boolean;
  private currentPageListener: Subscriber[] = [];
  private burgerMenuListeners: Subscriber[] = [];

  constructor() {
    this.currentRoute = '/home';
    this.isOpenBM = false;
  }

  public getCurrentRoute(): string {
    return this.currentRoute;
  }

  public getBurgerMenuState(): boolean {
    return this.isOpenBM;
  }

  public setBurgerMenuState(state: boolean): void {
    this.isOpenBM = state;
    this.notifyBurgerMenuListeners();
  }

  public setCurrentRoute(route: string): void {
    this.currentRoute = route;
    this.notifyCurrentPageListener();
  }

  public subscribeCurrentPageListener(callback: () => void): void {
    this.currentPageListener.push(callback);
  }

  public subscribeBurgerMenuListener(callback: () => void): void {
    this.burgerMenuListeners.push(callback);
  }

  private notifyCurrentPageListener(): void {
    this.currentPageListener.forEach((callback) => callback());
  }

  private notifyBurgerMenuListeners(): void {
    this.burgerMenuListeners.forEach((callback) => callback());
  }
}
