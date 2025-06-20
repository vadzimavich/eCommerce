import { DiscountCode } from '@commercetools/platform-sdk';
import { CustomerService } from './AuthService';
export class DiscoountService {
  private static instance: DiscoountService;
  constructor(private readonly customerService = CustomerService.getInstance()) {
    this;
  }
  public static getInstance(): DiscoountService {
    if (!DiscoountService.instance) {
      DiscoountService.instance = new DiscoountService();
    }
    return DiscoountService.instance;
  }

  public async getPromoCodes(): Promise<DiscountCode[]> {
    const resp = await this.customerService.getCurrentClient().discountCodes().get().execute();
    return resp.body.results;
  }
}
