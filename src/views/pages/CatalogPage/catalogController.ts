import { ProductsService } from '../../../models/services/ProductService';
import { parseProduct } from '../../../utils/parsers';
import { CatalogModel } from './catalogModel';
import { CatalogView } from './view/catalodView';
import { ProductsView } from './view/productsView';

export class CatalogController {
  private readonly service: ProductsService;
  constructor(
    private readonly model: CatalogModel,
    private readonly view: CatalogView,
    private readonly productsView: ProductsView
  ) {
    this.service = ProductsService.getInstance();
    console.log(this.service.getAllProducts());
    this.initProducts();

    this.model.subscribeProductsListener(() => this.handlerProducts());
  }

  public async initProducts(): Promise<void> {
    try {
      const resultProducts = await this.service.getAllProducts();

      if (resultProducts && !(resultProducts instanceof Error)) {
        const parsedProducts = resultProducts.map((item) => parseProduct(item));
        this.model.setProducts(parsedProducts);
      }
    } catch (error) {
      console.error('Error loading products', error);
    }
  }

  private handlerProducts(): void {
    this.productsView.renderCards();
  }
}
