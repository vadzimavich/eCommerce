import { CartService } from '../../../models/services/CartService';
import { AppModel } from '../../../models/state/AppState';
import { CartModel } from './cartModel';
import { CartView } from './view/cartView';
import { Modal } from '../../../components/modal';
import { Cart } from '@commercetools/platform-sdk';

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
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const action = target.dataset.action;
    if (!action) {
      return;
    }

    try {
      let updatedCart: Cart | undefined;
      if (action.includes('promo')) {
        updatedCart = await this.handlePromoAction(action, target);
      } else if (action === 'clear-cart') {
        updatedCart = await this.handleClearCartAction();
      } else {
        updatedCart = await this.handleLineItemAction(action, target);
      }

      if (updatedCart) {
        // console.log('Updated cart from API:', JSON.stringify(updatedCart, null, 2));
        this.cartModel.setCart(updatedCart);
        this.appModel.setCartItems(updatedCart);
      }
    } catch (error) {
      if (error instanceof Error) {
        this.modal.errorMessage(error.message);
      }
    }
  };

  private async handlePromoAction(action: string, target: HTMLElement): Promise<Cart | undefined> {
    if (action === 'apply-promo') {
      const promoInput = document.getElementById('promo-code-input');
      if (promoInput instanceof HTMLInputElement && promoInput.value.trim()) {
        const code = promoInput.value.trim();
        promoInput.value = '';
        return this.cartService.applyDiscountCode(code);
      }
    } else if (action === 'remove-promo') {
      const promoId = target.dataset.id;
      if (promoId) {
        return this.cartService.removeDiscountCode(promoId);
      }
    }
    return undefined;
  }

  private async handleClearCartAction(): Promise<Cart | undefined> {
    const currentCart = this.cartModel.getCart();
    if (currentCart && window.confirm('Are you sure you want to clear your cart?')) {
      return this.cartService.deleteCart(currentCart);
    }
    return undefined;
  }

  private async handleLineItemAction(action: string, target: HTMLElement): Promise<Cart | undefined> {
    const lineItemElement = target.closest('.cart-item');
    if (!lineItemElement || !(lineItemElement instanceof HTMLElement)) {
      return undefined;
    }
    const lineItemId = lineItemElement.dataset.lineItemId;
    if (!lineItemId) {
      return undefined;
    }
    const quantityInput = lineItemElement.querySelector<HTMLInputElement>('.quantity-control__input');
    const currentQuantity = quantityInput ? Number(quantityInput.value) : 0;
    switch (action) {
      case 'increase':
        return this.cartService.changeLineItemQuantity(lineItemId, currentQuantity + 1);
      case 'decrease':
        return this.cartService.changeLineItemQuantity(lineItemId, currentQuantity - 1);
      case 'remove':
        return this.cartService.removeLineItem(lineItemId);
      default:
        return undefined;
    }
  }

  private handleQuantityInputChange = async (event: Event): Promise<void> => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || target.dataset.action !== 'set-quantity') {
      return;
    }

    const lineItemElement = target.closest('.cart-item');
    if (!lineItemElement || !(lineItemElement instanceof HTMLElement)) {
      return;
    }

    const lineItemId = lineItemElement.dataset.lineItemId;
    if (!lineItemId) {
      return;
    }

    const newQuantity = Number(target.value);

    try {
      const updatedCart = await this.cartService.changeLineItemQuantity(lineItemId, newQuantity);
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
