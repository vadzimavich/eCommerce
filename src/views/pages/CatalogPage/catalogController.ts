import { ProductsService } from '../../../models/services/ProductService';
import { CatalogModel } from './catalogModel';
import { CatalogView } from './view/catalodView';

export class CatalogController {
  private readonly service: ProductsService;
  constructor(
    private readonly model: CatalogModel,
    private readonly view: CatalogView
  ) {
    this.service = ProductsService.getInstance();
    console.log('Products', this.service.getAllProducts());
  }
}
