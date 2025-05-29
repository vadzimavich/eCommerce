import { ProductsService } from '../../../models/services/ProductService';
import { ProductQueryParameters } from '../../../models/types/api-types';
import { parseProduct, parserSortRequest } from '../../../utils/parsers';
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

    this.handlerProductsContainer();
    this.handlerSortSelect();
    // this.initProducts({});
    this.model.subscribeProductsListener(() => this.handlerProducts());
  }

  private async initProducts(parameters: ProductQueryParameters): Promise<void> {
    try {
      const resultProducts = await this.service.getAllProducts(parameters);

      if (resultProducts && !(resultProducts instanceof Error)) {
        const parsedProducts = resultProducts.map((item) => parseProduct(item));
        this.model.setProducts(parsedProducts);
      }
    } catch (error) {
      console.error('Error loading products', error);
    }
  }

  private handlerProductsContainer(): void {
    const container = this.productsView.getProductsContainer();

    container.addEventListener('click', (event: MouseEvent) => {
      const target = event.target;

      if (target instanceof HTMLElement) {
        const card = target.closest('.product-card');

        if (card instanceof HTMLElement) {
          const cardId = card.getAttribute('data-id');
          console.log(cardId);
        }
      }
    });
  }

  private handlerSortSelect(): void {
    const select = this.productsView.getSortSelect();

    const initialSort = parserSortRequest(select.value);
    this.initProducts({ sort: initialSort });

    select.addEventListener('change', () => {
      const sortString = parserSortRequest(select.value);
      this.initProducts({ sort: sortString });
    });
  }

  private handlerProducts(): void {
    this.productsView.renderCards();
  }
}
