import { Cart, CartPagedQueryResponse, LineItem, MyCartUpdateAction } from '@commercetools/platform-sdk';
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

  public async addProductCartByID(cart: Cart, productId: string, quantity: number = 1): Promise<Cart> {
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
                quantity,
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

  public async updateCartByID(cart: Cart, lineItem: LineItem, quantity: number): Promise<Cart> {
    try {
      const updateActions: MyCartUpdateAction[] = [];

      if (quantity > 0) {
        updateActions.push({
          action: 'changeLineItemQuantity',
          lineItemId: lineItem.id,
          quantity: quantity,
        });
      } else {
        updateActions.push({
          action: 'removeLineItem',
          lineItemId: lineItem.id,
        });
      }

      const request = await this.service
        .getCurrentClient()
        .me()
        .carts()
        .withId({ ID: cart.id })
        .post({
          body: {
            version: cart.version,
            actions: updateActions,
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
