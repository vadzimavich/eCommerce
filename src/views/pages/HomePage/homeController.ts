import { DiscoountService } from '../../../models/services/DiscountService';
import { AppModel } from '../../../models/state/AppState';
import { HomeModel } from './homeModel';
import { HomeView } from './homeView';

export class HomeController {
  private readonly discountService: DiscoountService;
  constructor(
    private readonly appModel: AppModel,
    private readonly model: HomeModel,
    private readonly view: HomeView
  ) {
    this.discountService = DiscoountService.getInstance();
    this.getPromoCod();

    this.model.subscribeIsPromoCodeListener(() => {
      this.updateDiscontView();
    });
  }

  private async getPromoCod(): Promise<void> {
    const promoCode = await this.discountService.getPromoCodes();
    this.model.setPromoCode(promoCode[0].code);
  }

  private updateDiscontView(): void {
    this.view.buildPromoContainer();
  }
}
