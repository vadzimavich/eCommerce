import { Subscriber } from '../../../models/types';

export class HeaderModel {
  private currentRoute: string;
  private currentPageListener: Subscriber[] = [];

  constructor() {
    this.currentRoute = '/home';
  }

  public getCurrentRoute(): string {
    return this.currentRoute;
  }

  public setCurrentRoute(route: string): void {
    this.currentRoute = route;
    this.notifyCurrentPageListener();
  }

  public subscribeCurrentPageListener(callback: () => void): void {
    this.currentPageListener.push(callback);
  }

  private notifyCurrentPageListener(): void {
    this.currentPageListener.forEach((callback) => callback());
  }
}
