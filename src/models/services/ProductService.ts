import type { Category, ProductProjection, QueryParam } from '@commercetools/platform-sdk';
import { CustomerService } from './AuthService';
import { ProductQueryParameters } from '../types/api-types';
import { parserFilters } from '../../utils/parsers';

export class ProductsService {
  private static instance: ProductsService;
  private readonly service = CustomerService.getInstance();

  public static getInstance(): ProductsService {
    if (!ProductsService.instance) {
      ProductsService.instance = new ProductsService();
    }
    return ProductsService.instance;
  }

  public async getAllProducts(
    parameters: ProductQueryParameters
  ): Promise<{ results: ProductProjection[]; total: number | undefined } | Error> {
    try {
      const limit = parameters.limit;
      const page = parameters.page;
      let offset = 0;
      if (limit && page) {
        offset = (page - 1) * limit;
      }
      const queryArguments: Record<string, QueryParam> = {
        sort: parameters.sort ?? 'name.en-US asc',
        limit: parameters.limit,
        offset,
      };

      if (parameters.searchText) {
        queryArguments['text.en-US'] = parameters.searchText;
        queryArguments['fuzzy'] = true;
        queryArguments['fuzzyLevel'] = 1;
      }

      if (parameters.filters) {
        const filterExpressions = parserFilters(parameters.filters);
        if (filterExpressions.length > 0) {
          queryArguments.filter = filterExpressions;
        }
      }

      const response = await this.service
        .getCurrentClient()
        .productProjections()
        .search()
        .get({ queryArgs: queryArguments })
        .execute();
      return {
        results: response.body.results,
        total: response.body.total,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return new Error('Failed to fetch products');
    }
  }

  public async getAllCategories(): Promise<Category[] | Error> {
    try {
      const response = await this.service.getCurrentClient().categories().get().execute();
      return response.body.results;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return new Error('Failed to fetch categories');
    }
  }

  public async getProductById(productId: string): Promise<ProductProjection> {
    try {
      const response = await this.service
        .getCurrentClient()
        .productProjections()
        .withId({ ID: productId })
        .get()
        .execute();

      return response.body;
    } catch (error) {
      console.log('getProductById', error);

      throw error;
    }
  }
}
