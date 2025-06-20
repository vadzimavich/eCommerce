import { Subscriber } from '../../../models/types';

export class HomeModel {
  private promoCode: string = '';

  private isPromoCodeListener: Subscriber[] = [];

  public setPromoCode(code: string): void {
    this.promoCode = code;
    this.notifyIsPromoCodeListener();
  }

  public getPromoCode(): string {
    return this.promoCode;
  }

  public subscribeIsPromoCodeListener(callback: () => void): void {
    this.isPromoCodeListener.push(callback);
  }

  private notifyIsPromoCodeListener(): void {
    this.isPromoCodeListener.forEach((callback) => callback());
  }
}
