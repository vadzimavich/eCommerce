import { route } from '../../../app';
import { AuthController } from '../../../controllers/AuthController';
import { CartService } from '../../../models/services/CartService';
import { ProductsService } from '../../../models/services/ProductService';
import { AppModel } from '../../../models/state/AppState';
import { ProductQueryParameters } from '../../../models/types/api-types';
import { RouteParameters } from '../../../models/types/router-types';
import { parserSortRequest } from '../../../utils/parsers';
import { CatalogModel } from './catalogModel';
import { CatalogView } from './view/catalodView';
import { ProductsView } from './view/productsView';

export class CatalogController {
  private readonly service: ProductsService;
  private readonly cartService: CartService;
  constructor(
    private readonly appModel: AppModel,
    private readonly model: CatalogModel,
    private readonly view: CatalogView,
    private readonly productsView: ProductsView,
    private readonly parametrs: RouteParameters
  ) {
    this.service = ProductsService.getInstance();
    this.cartService = CartService.getInstance();
    this.init();
    this.handlerProductsContainer();
    this.handlerSortSelect();
    this.handlerSearchForm();
    this.handlerFiltersContainer();
    this.handlerClearButton();
    this.handlerPagination();
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
    new AuthController(this.appModel).checkAuthorization();
    await this.getCategories();
    const categoryId = this.model.checkCategory(this.parametrs.category);

    if (categoryId) {
      if (categoryId === 'all') {
        this.model.setParameters({});
      } else {
        this.model.setParameters({ filters: { categoryId } });
        this.model.setSelectegCategoty(this.parametrs.category);
        this.view.updateBreadCrumbs();
      }
    } else {
      route.navigate('/not-found');
    }
    await this.initProducts(this.model.getParameters());
    await this.getProductsInCurrentCart();
    this.productsView.updateButtonAdToCart();
  }

  private async initProducts(parameters: ProductQueryParameters): Promise<void> {
    try {
      this.productsView.renderLoader();
      const resultProducts = await this.service.getAllProducts(parameters);
      if (resultProducts instanceof Error) {
        this.productsView.renderMessage(resultProducts.message);
        return;
      }

      if (resultProducts.results.length === 0) {
        this.productsView.renderMessage('No products found.');
        return;
      }

      this.model.setProducts(resultProducts.results);
      this.model.setParameters({ total: resultProducts.total });
      this.productsView.updatePagination();
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

  private async getProductsInCurrentCart(): Promise<void> {
    const productsIdInCart = await this.cartService.getProductIdsInCart();
    this.model.setCartItems(productsIdInCart);
  }

  private handlerProductsContainer(): void {
    const container = this.productsView.getProductsContainer();

    container.addEventListener('click', async (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof HTMLElement)) return;

      const card = target.closest('.product-card');
      if (!(card instanceof HTMLElement)) return;

      const cardId = card.getAttribute('data-id');
      if (!cardId) return;

      const isAddToCartButton = target.closest('.product-card__priceinform-btn');

      if (isAddToCartButton && isAddToCartButton instanceof HTMLButtonElement) {
        try {
          this.productsView.startAddAnimation(isAddToCartButton);
          await this.cartService.addProductToCart(cardId);
          await this.getProductsInCurrentCart();
          this.productsView.stopAddAnimationAndDisable(isAddToCartButton);
        } catch {}
      } else {
        route.navigate(`product/${cardId}`);
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
    const input = this.productsView.getSearchInput();
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const query = input.value.trim();
      this.model.setParameters({ searchText: query });
      this.initProducts(this.model.getParameters());
    });

    input.addEventListener('input', () => {
      if (input.value.trim() === '') {
        this.model.setParameters({ searchText: '' });
        this.initProducts(this.model.getParameters());
      }
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
      this.init();
    });
  }

  private resetFormInputs(): void {
    const container = this.view.getFiltersContainer();
    Array.from(container.elements).forEach((element, index) => {
      if (element instanceof HTMLInputElement) {
        if (element.type === 'checkbox') {
          element.checked = false;
        } else {
          element.value = '';
        }
      }

      if (element instanceof HTMLSelectElement && index !== 0) {
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

  private handlerPagination(): void {
    const nextButton = this.productsView.getButtonNext();
    const previousButton = this.productsView.getButtonPrev();

    nextButton.addEventListener('click', () => {
      const currentParameters = this.model.getParameters();
      const nextPage = (currentParameters.page ?? 1) + 1;
      this.model.setParameters({ page: nextPage });
      this.productsView.updatePagination();
      this.initProducts(this.model.getParameters());
    });

    previousButton.addEventListener('click', () => {
      const currentParameters = this.model.getParameters();
      const previousPage = (currentParameters.page ?? 1) - 1;
      this.model.setParameters({ page: previousPage });
      this.productsView.updatePagination();
      this.initProducts(this.model.getParameters());
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
