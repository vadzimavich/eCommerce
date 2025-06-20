import { route } from '../../../app';
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
    this.handleCoppyButton();
    this.initButtonsHandlers();
    this.model.subscribeIsPromoCodeListener(() => {
      this.updateDiscontView();
    });
  }

  private async getPromoCod(): Promise<void> {
    const promoCode = await this.discountService.getPromoCodes();
    this.model.setPromoCode(promoCode[1].code);
  }

  private handleCoppyButton(): void {
    const button = this.view.getCopyButton();
    button.addEventListener('click', () => {
      const code = this.model.getPromoCode();
      navigator.clipboard.writeText(code).then(() => {
        this.view.updateCoppyButton('Copied!');
        setTimeout(() => this.view.updateCoppyButton('Copy'), 1500);
      });
    });
  }

  private initButtonsHandlers(): void {
    const buttonToAbout = this.view.getButtonToAbout();
    buttonToAbout.addEventListener('click', () => route.navigate('/about-us'));
  }

  private updateDiscontView(): void {
    this.view.buildPromoSection();
  }
}
