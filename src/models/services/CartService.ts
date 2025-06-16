import { ByProjectKeyCartsRequestBuilder, ByProjectKeyMeCartsRequestBuilder, Cart } from '@commercetools/platform-sdk';
import { CUSTOMER_CART, CustomerService } from './AuthService';
import { REFRESH_TOKEN } from '../../controllers/AuthController';
import { AppModel } from '../state/AppState';
import { isCtErrorWithBodyMessage } from '../types/api-types';

export const ANON_CART_ID = 'cart_anon';

export class CartService {
  private static instance: CartService;

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
      const storageKey = this.isAuthoriziredCustomer() ? CUSTOMER_CART : ANON_CART_ID;
      sessionStorage.removeItem(storageKey);
      return this.createCart();
    } catch (error) {
      console.error('Error deleting cart:', error);
      throw error;
    }
  }

  private isAuthoriziredCustomer(): boolean {
    return !!sessionStorage.getItem(REFRESH_TOKEN);
  }

  private cartBuilder(): ByProjectKeyMeCartsRequestBuilder | ByProjectKeyCartsRequestBuilder {
    return this.isAuthoriziredCustomer()
      ? this.service.getCurrentClient().me().carts()
      : this.service.getCurrentClient().carts();
  }

  private async getExistingCart(): Promise<Cart | null> {
    const cartId = this.isAuthoriziredCustomer()
      ? sessionStorage.getItem(CUSTOMER_CART)
      : sessionStorage.getItem(ANON_CART_ID);
    if (!cartId) return null;
    try {
      const cartResp = await this.cartBuilder().withId({ ID: cartId }).get().execute();
      if (cartResp.body.cartState === 'Active') {
        return cartResp.body;
      }
    } catch (error) {
      console.warn('Error fetching existing cart, possibly stale ID.', error);
      if (isCtErrorWithBodyMessage(error) && error.statusCode === 404) {
        const storageKey = this.isAuthoriziredCustomer() ? CUSTOMER_CART : ANON_CART_ID;
        sessionStorage.removeItem(storageKey);
      }
    }
    return null;
  }

  private async createCart(): Promise<Cart> {
    const response = await this.cartBuilder()
      .post({ body: { currency: 'USD' } })
      .execute();
    const storageKey = this.isAuthoriziredCustomer() ? CUSTOMER_CART : ANON_CART_ID;
    sessionStorage.setItem(storageKey, response.body.id);
    this.appModel.setCartItems(response.body);
    return response.body;
  }
}
