import type { ProductProjection } from '@commercetools/platform-sdk';
import { CustomerService } from './AuthService';

export class ProductsService {
  private static instance: ProductsService;
  private readonly service = CustomerService.getInstance();

  public static getInstance(): ProductsService {
    if (!ProductsService.instance) {
      ProductsService.instance = new ProductsService();
    }
    return ProductsService.instance;
  }

  public async getAllProducts(): Promise<ProductProjection[] | Error> {
    try {
      const response = await this.service.getCurrentClient().productProjections().get().execute();
      return response.body.results;
    } catch (error) {
      if (error instanceof Error) return error;
      return new Error('Unknown registration error');
    }
  }

  public async getProductById(productId: string): Promise<ProductProjection> {
    const response = await this.service
      .getCurrentClient()
      .productProjections()
      .withId({ ID: productId })
      .get()
      .execute();
    return response.body;
  }
}
