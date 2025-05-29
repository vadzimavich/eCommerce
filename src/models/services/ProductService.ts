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
        sort: parameters.sort ?? 'name.en-US asc',
        limit: parameters.limit,
      };

      if (parameters.searchText) {
        queryArguments['text.en-US'] = parameters.searchText;
        queryArguments['fuzzy'] = true;
        queryArguments['fuzzyLevel'] = 1;
      }

      const response = await this.service
        .getCurrentClient()
        .productProjections()
        .search()
        .get({ queryArgs: queryArguments })
        .execute();
      return response.body.results;
    } catch (error) {
      console.error('getAllProducts error:', error);
      return new Error('Failed to fetch products');
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
