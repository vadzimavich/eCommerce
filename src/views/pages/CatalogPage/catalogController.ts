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
    this.initProducts({});
    this.handlerProductsContainer();
    this.handlerSortSelect();
    this.handlerSearchForm();
    this.model.subscribeProductsListener(() => this.handlerProducts());
  }

  private async initProducts(parameters: ProductQueryParameters): Promise<void> {
    try {
      const resultProducts = await this.service.getAllProducts(parameters);

      if (resultProducts instanceof Error) {
        this.productsView.renderMessage(resultProducts.message);
        return;
      }

      if (resultProducts.length === 0) {
        this.productsView.renderMessage('No products found.');
        return;
      }

      const parsedProducts = resultProducts.map(parseProduct);
      this.model.setProducts(parsedProducts);
      this.productsView.renderCards();
    } catch (error) {
      console.error('Error loading products:', error);
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

    select.addEventListener('change', () => {
      const sortString = parserSortRequest(select.value);
      this.initProducts({ sort: sortString });
    });
  }

  private handlerSearchForm(): void {
    const form = this.productsView.getFormSearch();

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = this.productsView.getSearchInput();
      const query = input.value.trim();

      if (query === '') {
        this.initProducts({});
      } else {
        this.initProducts({ searchText: query });
      }
      input.value = '';
    });
  }

  private handlerProducts(): void {
    this.productsView.renderCards();
  }
}
