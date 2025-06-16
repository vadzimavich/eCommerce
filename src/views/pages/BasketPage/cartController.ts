import { CartService } from '../../../models/services/CartService';
import { AppModel } from '../../../models/state/AppState';
import { CartModel } from './cartModel';
import { CartView } from './view/cartView';
import { Modal } from '../../../components/modal';

export class CartController {
  private cartService: CartService;
  private modal: Modal;

  constructor(
    private readonly appModel: AppModel,
    private readonly cartModel: CartModel,
    private readonly cartView: CartView
  ) {
    this.cartService = CartService.getInstance(this.appModel);
    this.modal = Modal.getInstance();
    this.init();
  }

  private async init(): Promise<void> {
    this.attachEventListeners();
    const cart = await this.cartService.getOrCreateCart();
    this.cartModel.setCart(cart);
  }

  private attachEventListeners(): void {
    const contentWrapper = this.cartView.getContentWrapper();
    contentWrapper.addEventListener('click', this.handleCartActions);
    contentWrapper.addEventListener('change', this.handleQuantityInputChange);
  }

  private handleCartActions = async (event: MouseEvent): Promise<void> => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const action = target.dataset.action;
    if (!action) return;

    const lineItemElement = target.closest('.cart-item');
    if (!lineItemElement || !(lineItemElement instanceof HTMLElement)) return;

    const lineItemId = lineItemElement.dataset.lineItemId;
    if (!lineItemId) return;

    const quantityInput = lineItemElement.querySelector<HTMLInputElement>('.quantity-control__input');
    const currentQuantity = quantityInput ? Number(quantityInput.value) : 0;

    try {
      let updatedCart;
      switch (action) {
        case 'increase':
          updatedCart = await this.cartService.changeLineItemQuantity(lineItemId, currentQuantity + 1);
          break;
        case 'decrease':
          updatedCart = await this.cartService.changeLineItemQuantity(lineItemId, currentQuantity - 1);
          break;
        case 'remove':
          updatedCart = await this.cartService.removeLineItem(lineItemId);
          break;
      }
      // FIX: Update both models after a successful service call
      if (updatedCart) {
        this.cartModel.setCart(updatedCart);
        this.appModel.setCartItems(updatedCart);
      }
    } catch (error) {
      if (error instanceof Error) {
        this.modal.errorMessage(error.message);
      }
    }
  };

  private handleQuantityInputChange = async (event: Event): Promise<void> => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || target.dataset.action !== 'set-quantity') {
      return;
    }

    const lineItemElement = target.closest('.cart-item');
    if (!lineItemElement || !(lineItemElement instanceof HTMLElement)) return;

    const lineItemId = lineItemElement.dataset.lineItemId;
    if (!lineItemId) return;

    const newQuantity = Number(target.value);

    try {
      const updatedCart = await this.cartService.changeLineItemQuantity(lineItemId, newQuantity);
      // FIX: Update both models after a successful service call
      this.cartModel.setCart(updatedCart);
      this.appModel.setCartItems(updatedCart);
    } catch (error) {
      if (error instanceof Error) {
        this.modal.errorMessage(error.message);
      }
      const cart = this.cartModel.getCart();
      const lineItem = cart?.lineItems.find((item) => item.id === lineItemId);
      if (lineItem) {
        target.value = lineItem.quantity.toString();
      }
    }
  };
}
