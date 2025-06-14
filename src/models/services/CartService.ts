import { Cart, CartPagedQueryResponse } from '@commercetools/platform-sdk';
import { CustomerService } from './AuthService';

export class CartService {
  private static instance: CartService;
  private readonly service = CustomerService.getInstance();

  public static getInstance(): CartService {
    if (!CartService.instance) {
      CartService.instance = new CartService();
    }
    return CartService.instance;
  }

  public async getCartByID(ID: string): Promise<Cart> {
    try {
      const response = await this.service.getCurrentClient().me().carts().withId({ ID }).get().execute();

      return response.body;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw Error('Failed to fetch cart');
    }
  }

  public async getCart(): Promise<CartPagedQueryResponse> {
    try {
      const response = await this.service.getCurrentClient().me().carts().get().execute();

      return response.body;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw Error('Failed to fetch cart');
    }
  }

  public async addProductToCart(productID: string): Promise<Cart> {
    try {
      const request = await this.service
        .getCurrentClient()
        .me()
        .carts()
        .post({
          body: {
            currency: 'USD',
            lineItems: [{ productId: productID }],
          },
        })
        .execute();

      return request.body;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw Error('Failed to post cart');
    }
  }

  public async addProductToCartByID(cart: Cart, productId: string): Promise<Cart> {
    try {
      const request = await this.service
        .getCurrentClient()
        .me()
        .carts()
        .withId({ ID: cart.id })
        .post({
          body: {
            version: cart.version,
            actions: [
              {
                action: 'addLineItem',
                productId,
              },
            ],
          },
        })
        .execute();

      return request.body;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw Error('Failed to post cart');
    }
  }
}
