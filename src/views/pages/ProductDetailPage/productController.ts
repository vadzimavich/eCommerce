import { route } from '../../../app';
import { ProductsService } from '../../../models/services/ProductService';
import { AppModel } from '../../../models/state/AppState';
import { parseProduct } from '../../../utils/parsers';
import { ProductModel } from './productModel';
import { ProductView } from './productView';

export class ProductController {
  private readonly service: ProductsService;
  constructor(
    private readonly appModel: AppModel,
    private readonly model: ProductModel,
    private readonly view: ProductView
  ) {
    this.service = ProductsService.getInstance();
    this.initProduct();
    this.model.subscribeProductListener(() => this.handlerLoadProduct());
  }

  private async initProduct(): Promise<void> {
    try {
      //const idProduct = window.location.hash.split('/').at(-1) || '';
      const data = await this.service.getProductById('364444e3-4e66-4897-aeaf-146e46edb5c1');

      if (data && !(data instanceof Error)) {
        const parsedProducts = parseProduct(data);
        this.model.setProducts(parsedProducts);
      }
    } catch {
      route.navigate('/not-found');
    }
  }

  private handlerLoadProduct(): void {
    this.view.renderProduct();
  }
}
