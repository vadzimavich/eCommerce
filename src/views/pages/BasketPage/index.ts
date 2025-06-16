import { AppModel } from '../../../models/state/AppState';
import { CartController } from './cartController';
import { CartModel } from './cartModel';
import { CartView } from './cartView';

export class CartPage {
  private readonly view: CartView;
  private readonly model: CartModel;
  private readonly controller: CartController;

  constructor(private readonly appModel: AppModel) {
    this.model = new CartModel();
    this.view = new CartView(this.model);
    this.controller = new CartController(this.appModel, this.model, this.view);
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
