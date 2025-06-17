import {
  ByProjectKeyCartsRequestBuilder,
  ByProjectKeyMeCartsRequestBuilder,
  Cart,
  LineItem,
  MyCartUpdateAction,
} from '@commercetools/platform-sdk';
import { CUSTOMER_CART, CustomerService } from './AuthService';
import { REFRESH_TOKEN } from '../../controllers/AuthController';
import { AppModel } from '../state/AppState';
import { isCtErrorWithBodyMessage } from '../types/api-types';

export const ANON_CART_ID = 'cart_anon';

export class CartService {
  private static instance: CartService;
  private readonly expandQueryArgs = { expand: 'discountCodes[*].discountCode' };

  constructor(
    private readonly appModel: AppModel,
    private readonly service = CustomerService.getInstance()
  ) {
    this.appModel.subscribeLoginStateListener(() => this.getOrCreateCart());
  }

  public static getInstance(appModel: AppModel): CartService {
    if (!CartService.instance) {
      CartService.instance = new CartService(appModel);
    }
    return CartService.instance;
  }

  public async addProductToCart(productId: string, quantity = 1): Promise<Cart> {
    try {
      const cart = await this.getOrCreateCart();
      const response = await this.cartBuilder()
        .withId({ ID: cart.id })
        .post({
          body: {
            version: cart.version,
            actions: [{ action: 'addLineItem', productId, quantity }],
          },
          queryArgs: this.expandQueryArgs,
        })
        .execute();
      return response.body;
    } catch (error) {
      console.error('Error add product to cart', error);
      throw error;
    }
  }

  public async getOrCreateCart(): Promise<Cart> {
    const existing = await this.getExistingCart();
    if (existing) {
      this.appModel.setCartItems(existing);
      return existing;
    }
    return this.createCart();
  }

  public async changeLineItemQuantity(lineItemId: string, quantity: number): Promise<Cart> {
    try {
      const cart = await this.getOrCreateCart();
      if (quantity < 1) {
        return this.removeLineItem(lineItemId);
      }
      const response = await this.cartBuilder()
        .withId({ ID: cart.id })
        .post({
          body: {
            version: cart.version,
            actions: [{ action: 'changeLineItemQuantity', lineItemId, quantity }],
          },
          queryArgs: this.expandQueryArgs,
        })
        .execute();
      return response.body;
    } catch (error) {
      console.error('Error changing line item quantity', error);
      throw error;
    }
  }

  public async removeLineItem(lineItemId: string): Promise<Cart> {
    try {
      const cart = await this.getOrCreateCart();
      const response = await this.cartBuilder()
        .withId({ ID: cart.id })
        .post({
          body: {
            version: cart.version,
            actions: [{ action: 'removeLineItem', lineItemId }],
          },
          queryArgs: this.expandQueryArgs,
        })
        .execute();
      return response.body;
    } catch (error) {
      console.error('Error removing product from cart', error);
      throw error;
    }
  }

  public async deleteCart(cart: Cart): Promise<Cart> {
    try {
      await this.cartBuilder()
        .withId({ ID: cart.id })
        .delete({ queryArgs: { version: cart.version } })
        .execute();
      const storageKey = this.isAuthorizedCustomer() ? CUSTOMER_CART : ANON_CART_ID;
      sessionStorage.removeItem(storageKey);
      return this.createCart();
    } catch (error) {
      console.error('Error deleting cart:', error);
      throw error;
    }
  }

  public async applyDiscountCode(code: string): Promise<Cart> {
    try {
      const cart = await this.getOrCreateCart();
      const actions: MyCartUpdateAction[] = [{ action: 'addDiscountCode', code }, { action: 'recalculate' }];
      const response = await this.cartBuilder()
        .withId({ ID: cart.id })
        .post({
          body: {
            version: cart.version,
            actions,
          },
          queryArgs: this.expandQueryArgs,
        })
        .execute();
      return response.body;
    } catch (error) {
      console.error('Error applying discount code:', error);
      throw error;
    }
  }

  public async removeDiscountCode(discountCodeId: string): Promise<Cart> {
    try {
      const cart = await this.getOrCreateCart();
      const discountCodeReference = {
        typeId: 'discount-code' as const,
        id: discountCodeId,
      };
      const actions: MyCartUpdateAction[] = [
        { action: 'removeDiscountCode', discountCode: discountCodeReference },
        { action: 'recalculate' },
      ];
      const response = await this.cartBuilder()
        .withId({ ID: cart.id })
        .post({
          body: {
            version: cart.version,
            actions,
          },
          queryArgs: this.expandQueryArgs,
        })
        .execute();
      return response.body;
    } catch (error) {
      console.error('Error removing discount code:', error);
      throw error;
    }
  }

  public async updateLineItem(cart: Cart, lineItem: LineItem, quantity: number): Promise<Cart> {
    try {
      const response = await this.cartBuilder()
        .withId({ ID: cart.id })
        .post({
          body: {
            version: cart.version,
            actions: [
              {
                action: 'changeLineItemQuantity',
                lineItemId: lineItem.id,
                quantity: quantity,
              },
            ],
          },
        })
        .execute();

      return response.body;
    } catch (error) {
      throw error;
    }
  }

  private isAuthorizedCustomer(): boolean {
    return !!sessionStorage.getItem(REFRESH_TOKEN);
  }

  private cartBuilder(): ByProjectKeyMeCartsRequestBuilder | ByProjectKeyCartsRequestBuilder {
    return this.isAuthorizedCustomer()
      ? this.service.getCurrentClient().me().carts()
      : this.service.getCurrentClient().carts();
  }

  private async getExistingCart(): Promise<Cart | null> {
    const cartId = this.isAuthorizedCustomer()
      ? sessionStorage.getItem(CUSTOMER_CART)
      : sessionStorage.getItem(ANON_CART_ID);
    if (cartId) {
      try {
        const cartResp = await this.cartBuilder()
          .withId({ ID: cartId })
          .get({ queryArgs: this.expandQueryArgs })
          .execute();
        if (cartResp.body.cartState === 'Active') {
          return cartResp.body;
        }
      } catch (error) {
        console.warn('Error fetching existing cart, possibly stale ID.', error);
        if (isCtErrorWithBodyMessage(error) && error.statusCode === 404) {
          const storageKey = this.isAuthorizedCustomer() ? CUSTOMER_CART : ANON_CART_ID;
          sessionStorage.removeItem(storageKey);
        }
      }
    }
    if (this.isAuthorizedCustomer()) {
      const cartsList = await this.cartBuilder().get({ queryArgs: this.expandQueryArgs }).execute();
      const activeCart = cartsList.body.results.find((item) => item.cartState === 'Active');

      if (activeCart) {
        sessionStorage.setItem(CUSTOMER_CART, activeCart.id);
        return activeCart;
      }
    }
    return null;
  }

  private async createCart(): Promise<Cart> {
    const response = await this.cartBuilder()
      .post({ body: { currency: 'USD' }, queryArgs: this.expandQueryArgs })
      .execute();
    const storageKey = this.isAuthorizedCustomer() ? CUSTOMER_CART : ANON_CART_ID;
    sessionStorage.setItem(storageKey, response.body.id);
    this.appModel.setCartItems(response.body);
    return response.body;
  }
}
