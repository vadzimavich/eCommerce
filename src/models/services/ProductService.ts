import { ProductProjection } from '@commercetools/platform-sdk';
import { CustomerService } from './AuthService';

export class ProductService {
  private static instance: ProductService;
  private readonly service = CustomerService.getInstance();

  public static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  public async getProduct(idProduct: string): Promise<ProductProjection | Error> {
    try {
      const response = await this.service.currentClient.productProjections().withId({ ID: idProduct }).get().execute();
      return response.body;
    } catch (error) {
      if (error instanceof Error) return error;
      return new Error('Unknown error');
    }
  }
}
