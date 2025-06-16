import { CartService } from '../../../models/services/CartService';
import { AppModel } from '../../../models/state/AppState';

export class CartPage {
  private readonly cartService: CartService;
  constructor(private readonly appModel: AppModel) {
    this.cartService = CartService.getInstance(this.appModel);
    this.showCart();
  }
  public render(): HTMLElement {
    const container = document.createElement('div');

    container.classList.add('plug');
    container.innerHTML = 'cartPage';

    return container;
  }

  private async showCart(): Promise<void> {
    if (this.appModel.getCurrentCart() === null) {
      await this.cartService.getOrCreateCart();
    }

    console.log(this.appModel.getCurrentCart());
  }
}
