import { CartService } from '../../../models/services/CartService';
import { AppModel } from '../../../models/state/AppState';
import { CartModel } from './cartModel';
import { CartView } from './view/cartView';

export class CartController {
  private cartService: CartService;

  constructor(
    private readonly appModel: AppModel,
    private readonly cartModel: CartModel,
    private readonly cartView: CartView
  ) {
    this.cartService = CartService.getInstance(this.appModel);
    this.init();
  }

  private async init(): Promise<void> {
    const cart = await this.cartService.getOrCreateCart();
    this.cartModel.setCart(cart);
  }
}
