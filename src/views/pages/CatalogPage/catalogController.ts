import { route } from '../../../app';
import { ProductsService } from '../../../models/services/ProductService';
import { ProductQueryParameters } from '../../../models/types/api-types';
import { RouteParameters } from '../../../models/types/router-types';
import { parserSortRequest } from '../../../utils/parsers';
import { CatalogModel } from './catalogModel';
import { CatalogView } from './view/catalodView';
import { ProductsView } from './view/productsView';

export class CatalogController {
  private readonly service: ProductsService;
  constructor(
    private readonly model: CatalogModel,
    private readonly view: CatalogView,
    private readonly productsView: ProductsView,
    private readonly parametrs: RouteParameters
  ) {
    this.service = ProductsService.getInstance();
    this.init();
    this.handlerProductsContainer();
    this.handlerSortSelect();
    this.handlerSearchForm();
    this.handlerFiltersContainer();
    this.handlerClearButton();
    this.model.subscribeProductsListener(() => {
      this.handlerProducts();
      this.updateCleanButton();
    });
    this.model.subscribeFiltersListener(() => {
      this.updateFiltersValue();
    });
    this.handlerSelectCategory();
  }

  private async init(): Promise<void> {
    await this.getCategories();
    const categoryId = this.model.checkCategory(this.parametrs.category);
    if (categoryId) {
      categoryId === 'all' ? this.model.setParameters({}) : this.model.setParameters({ filters: { categoryId } });
    } else {
      route.navigate('/not-found');
    }

    await this.initProducts(this.model.getParameters());
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
      this.view.updateCategories();
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
          route.navigate(`product/${cardId}`);
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
          const parameters = this.model.getParameters();
          const currentFilters = parameters.filters || {};

          if (element instanceof HTMLInputElement && element.type === 'checkbox') {
            if (element.checked) {
              currentFilters[element.id] = true;
            } else {
              delete currentFilters[element.id];
            }
          } else {
            currentFilters[element.id] = element.value;
          }

          this.model.setParameters({ filters: currentFilters });
          this.initProducts(this.model.getParameters());
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
      route.navigate('/catalog/all');
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

  private handlerSelectCategory(): void {
    const select = this.view.getSelectCategory();
    select.addEventListener('change', () => {
      const selectedOption = select.options[select.selectedIndex];
      const optionId = selectedOption.id;
      route.navigate(`/catalog/${optionId}`);
    });
  }

  private handlerProducts(): void {
    this.productsView.renderCards();
  }

  private updateCleanButton(): void {
    this.view.changeClearButton();
  }

  private updateFiltersValue(): void {
    const select = this.view.getSelectCategory();
    const currentId = this.model.getParameters().filters?.categoryId;
    if (typeof currentId === 'string') select.value = currentId;
  }
}
