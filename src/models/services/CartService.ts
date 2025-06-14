import { ByProjectKeyCartsRequestBuilder, ByProjectKeyMeCartsRequestBuilder, Cart } from '@commercetools/platform-sdk';
import { CustomerService } from './AuthService';
import { REFRESH_TOKEN } from '../../controllers/AuthController';

export const CART_ID_KEY = 'cart_anon';

export class CartService {
  private static instance: CartService;
  private readonly service = CustomerService.getInstance();

  private constructor() {}

  public static getInstance(): CartService {
    if (!CartService.instance) CartService.instance = new CartService();
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

  public async getCurrentCart(): Promise<Cart> {
    const cart = await this.getOrCreateCart();
    return cart;
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
    const client = this.service.getCurrentClient();
    const cartId = sessionStorage.getItem(CART_ID_KEY);

    if (cartId) {
      try {
        const cartResp = await this.cartBuilder().withId({ ID: cartId }).get().execute();

        if (cartResp.body.cartState === 'Active') {
          return cartResp.body;
        }
      } catch (error) {
        console.error('Error fetching existing cart', error);
      }
    }

    if (this.isAuthoriziredCustomer()) {
      try {
        const cart = await client.me().activeCart().get().execute();
        return cart.body;
      } catch (error) {
        console.error('Error fetching existing cart for customer', error);
      }
    }

    return null;
  }

  private async createCart(): Promise<Cart> {
    const response = await this.cartBuilder()
      .post({ body: { currency: 'USD' } })
      .execute();

    this.saveAnonCart(response.body);
    return response.body;
  }

  private async getOrCreateCart(): Promise<Cart> {
    const existing = await this.getExistingCart();

    if (existing) {
      return existing;
    }
    return this.createCart();
  }

  private saveAnonCart(cart: Cart): void {
    sessionStorage.setItem(CART_ID_KEY, cart.id);
  }
}
