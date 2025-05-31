import { ProductsService } from '../../../models/services/ProductService';
import { ProductQueryParameters } from '../../../models/types/api-types';
import { parserSortRequest } from '../../../utils/parsers';
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
    this.handlerFocusSelectCategory();
    this.handlerProductsContainer();
    this.handlerSortSelect();
    this.handlerSearchForm();
    this.handlerFiltersContainer();
    this.handlerClearButton();
    this.model.subscribeProductsListener(() => {
      this.handlerProducts();
      this.updateCleanButton();
    });
    this.model.subscribeToCategoryUpdate(() => this.updateSelectCategory());
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

      this.model.setProducts(resultProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }

  private async getCategories(): Promise<void> {
    try {
      const resultCategories = await this.service.getAllCategories();
      if (resultCategories instanceof Error || resultCategories.length === 0) {
        this.view.showNoCategoryOption();
        return;
      }
      this.model.setCategories(resultCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
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
      this.model.setParameters({ sort: sortString });
      this.initProducts(this.model.getParameters());
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

  private handlerFocusSelectCategory(): void {
    const select = this.view.getSelectCategory();
    select.addEventListener('focus', () => {
      this.getCategories();
    });
  }

  private handlerFiltersContainer(): void {
    const container = this.view.getFiltersContainer();

    Array.from(container.elements).forEach((element) => {
      if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement) {
        let eventType: 'input' | 'change';
        if (element instanceof HTMLSelectElement) {
          eventType = 'change';
        } else if (element.type === 'checkbox') {
          eventType = 'change';
        } else {
          eventType = 'input';
        }

        element.addEventListener(eventType, () => {
          const filter = { [element.id]: element.type === 'checkbox' ? element.checked : element.value };
          this.model.setParameters({ filters: filter });
          const allFilters = this.model.getParameters();
          this.initProducts(allFilters);
        });
      }
    });
  }

  private handlerClearButton(): void {
    const button = this.view.getButtonClearFilter();
    button.addEventListener('click', (event) => {
      event.preventDefault();
      this.model.clearParametrs();
      this.resetFormInputs();
      this.initProducts(this.model.getParameters());
    });
  }

  private resetFormInputs(): void {
    const container = this.view.getFiltersContainer();
    Array.from(container.elements).forEach((element) => {
      if (element instanceof HTMLInputElement) {
        if (element.type === 'checkbox') {
          element.checked = false;
        } else {
          element.value = '';
        }
      }

      if (element instanceof HTMLSelectElement) {
        element.selectedIndex = 0;
      }
    });
  }

  private updateSelectCategory(): void {
    this.view.updateCategories();
  }

  private handlerProducts(): void {
    this.productsView.renderCards();
  }

  private updateCleanButton(): void {
    this.view.changeClearButton();
  }
}
