import { route } from '../../../app';
import { ProductsService } from '../../../models/services/ProductService';
import { AppModel } from '../../../models/state/AppState';
import { RouteParameters } from '../../../models/types/router-types';
import { parseProduct } from '../../../utils/parsers';
import { ProductModel } from './productModel';
import { ProductView } from './productView';

export class ProductController {
  private readonly service: ProductsService;
  constructor(
    private readonly appModel: AppModel,
    private readonly model: ProductModel,
    private readonly view: ProductView,
    private readonly parameters: RouteParameters
  ) {
    this.service = ProductsService.getInstance();
    this.initProduct();
    this.model.subscribeProductListener(() => this.handlerLoadProduct());
  }

  private async initProduct(): Promise<void> {
    try {
      const data = await this.service.getProductById(this.parameters.id);

      if (data && !(data instanceof Error)) {
        const parsedProducts = parseProduct([data]);
        this.model.setProducts(parsedProducts[0]);
      }
    } catch {
      route.navigate('/not-found');
    }
  }

  private handlerLoadProduct(): void {
    this.view.renderProduct();
  }
}
