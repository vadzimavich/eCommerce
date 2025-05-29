import type { ProductProjection, QueryParam } from '@commercetools/platform-sdk';
import { CustomerService } from './AuthService';
import { ProductQueryParameters } from '../types/api-types';

export class ProductsService {
  private static instance: ProductsService;
  private readonly service = CustomerService.getInstance();

  public static getInstance(): ProductsService {
    if (!ProductsService.instance) {
      ProductsService.instance = new ProductsService();
    }
    return ProductsService.instance;
  }

  public async getAllProducts(parameters: ProductQueryParameters): Promise<ProductProjection[] | Error> {
    try {
      const queryArguments: Record<string, QueryParam> = {
        sort: parameters.sort,
        limit: parameters.limit,
        search: parameters.searchText,
      };

      if (parameters.searchText) {
        queryArguments['text.en-US'] = parameters.searchText;
      }

      const response = await this.service
        .getCurrentClient()
        .productProjections()
        .search()
        .get({ queryArgs: queryArguments })
        .execute();
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
