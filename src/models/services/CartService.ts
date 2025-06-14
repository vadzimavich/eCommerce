import { ByProjectKeyCartsRequestBuilder, ByProjectKeyMeCartsRequestBuilder, Cart } from '@commercetools/platform-sdk';
import { CUSTOMER_CART, CustomerService } from './AuthService';
import { REFRESH_TOKEN } from '../../controllers/AuthController';

export const ANON_CART_ID = 'cart_anon';

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
    const cartId = sessionStorage.getItem(ANON_CART_ID);

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
        const customerCart = sessionStorage.getItem(CUSTOMER_CART);
        if (customerCart) {
          const cartResp = await this.cartBuilder().withId({ ID: customerCart }).get().execute();
          return cartResp.body;
        }
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
    if (!this.isAuthoriziredCustomer()) {
      this.saveAnonCart(response.body);
    }

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
    sessionStorage.setItem(ANON_CART_ID, cart.id);
  }
}
