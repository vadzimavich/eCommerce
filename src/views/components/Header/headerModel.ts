import { Subscriber } from '../../../models/types';

export class HeaderModel {
  private isOpenBM: boolean;
  private burgerMenuListeners: Subscriber[] = [];

  constructor() {
    this.isOpenBM = false;
  }

  public getBurgerMenuState(): boolean {
    return this.isOpenBM;
  }

  public setBurgerMenuState(state: boolean): void {
    this.isOpenBM = state;
    this.notifyBurgerMenuListeners();
  }

  public subscribeBurgerMenuListener(callback: () => void): void {
    this.burgerMenuListeners.push(callback);
  }

  private notifyBurgerMenuListeners(): void {
    this.burgerMenuListeners.forEach((callback) => callback());
  }
}
