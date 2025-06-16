import {
  ByProjectKeyCartsRequestBuilder,
  ByProjectKeyMeCartsRequestBuilder,
  Cart,
  LineItem,
} from '@commercetools/platform-sdk';
import { CUSTOMER_CART, CustomerService } from './AuthService';
import { REFRESH_TOKEN } from '../../controllers/AuthController';
import { AppModel } from '../state/AppState';

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

  public async removeLineItem(cart: Cart, lineItem: LineItem): Promise<Cart> {
    try {
      const response = await this.cartBuilder()
        .withId({ ID: cart.id })
        .post({
          body: {
            version: cart.version,
            actions: [
              {
                action: 'removeLineItem',
                lineItemId: lineItem.id,
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
    if (this.isAuthorizedCustomer()) {
      try {
        const customerCart = sessionStorage.getItem(CUSTOMER_CART);
        if (customerCart) {
          const cartResp = await this.cartBuilder().withId({ ID: customerCart }).get().execute();

          return cartResp.body;
        } else {
          const cartsList = await this.cartBuilder().get().execute();
          const activeCart = cartsList.body.results.find((item) => item.cartState === 'Active');

          if (activeCart) {
            sessionStorage.setItem(CUSTOMER_CART, activeCart.id);
            return activeCart;
          }
        }
      } catch (error) {
        console.error('Error fetching existing cart for customer', error);
      }
    }

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

    return null;
  }

  private async createCart(): Promise<Cart> {
    const response = await this.cartBuilder()
      .post({ body: { currency: 'USD' } })
      .execute();
    if (!this.isAuthorizedCustomer()) {
      sessionStorage.setItem(ANON_CART_ID, response.body.id);
    }
    this.appModel.setCartItems(response.body);
    return response.body;
  }
}
