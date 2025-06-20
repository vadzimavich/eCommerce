import { elementCreator } from '../../../../utils/dom-helpers';
import { ProductCard } from '../../../../utils/product-card';
import { CatalogModel } from '../catalogModel';

import { createInputCatalogSearch, createSelectCatalogSort } from '../../../../utils/catalog-inputs';
import { sortOptions, sortValues } from './constant-conrent';
import { loaderView } from '../../../components/Loader';
import { AppModel } from '../../../../models/state/AppState';

export class ProductsView {
  private readonly container: HTMLElement;
  private readonly productsContainer: HTMLElement;
  private readonly sortSelect: HTMLSelectElement;
  private readonly searchInput: HTMLInputElement;
  private readonly searchButton: HTMLButtonElement;
  private readonly formSearch: HTMLFormElement;
  private readonly buttonPrevious: HTMLButtonElement;
  private readonly buttonNext: HTMLButtonElement;
  private readonly pageCounter: HTMLElement;

  constructor(
    private readonly appModel: AppModel,
    private readonly model: CatalogModel
  ) {
    this.container = elementCreator(document.createElement('div'), {
      classNames: ['catalog-right', 'section-item'],
    });
    this.productsContainer = elementCreator(document.createElement('div'), {
      classNames: ['catalog-right__products'],
    });
    this.sortSelect = createSelectCatalogSort('catalog-sort', sortOptions, sortValues, ['catalog-right__head-sort']);
    this.searchInput = createInputCatalogSearch('catalog-search');
    this.searchButton = elementCreator(document.createElement('button'), {
      classNames: ['form__button', 'button'],
      attributes: { type: 'submit' },
    });
    this.formSearch = elementCreator(document.createElement('form'), {
      classNames: ['catalog-right__head-search'],
    });

    this.buttonPrevious = elementCreator(document.createElement('button'), {
      classNames: ['form__button', 'btn', 'pagination__btn'],
      content: 'Prev',
      attributes: { id: 'prev-page' },
    });

    this.buttonNext = elementCreator(document.createElement('button'), {
      classNames: ['form__button', 'btn', 'pagination__btn'],
      content: 'Next',
    });

    this.pageCounter = elementCreator(document.createElement('span'), {
      classNames: ['pagination__count', 'count'],
      content: '1',
      attributes: { id: 'next-page' },
    });
  }

  public render(): HTMLElement {
    this.updatePagination();
    this.renderCards();
    const headContainer = this.buildHeadContainer();
    const paginationContainer = this.buildPagination();
    this.container.append(headContainer, this.productsContainer, paginationContainer);

    return this.container;
  }

  public renderLoader(): void {
    this.productsContainer.replaceChildren();
    this.productsContainer.append(loaderView());
  }

  public getProductsContainer(): HTMLElement {
    return this.productsContainer;
  }

  public getSortSelect(): HTMLSelectElement {
    return this.sortSelect;
  }

  public getFormSearch(): HTMLFormElement {
    return this.formSearch;
  }

  public getSearchInput(): HTMLInputElement {
    return this.searchInput;
  }

  public getButtonNext(): HTMLButtonElement {
    return this.buttonNext;
  }

  public getButtonPrev(): HTMLButtonElement {
    return this.buttonPrevious;
  }

  public updatePagination(): void {
    const parametrs = this.model.getParameters();

    if (parametrs.page) {
      this.pageCounter.textContent = parametrs.page.toString();
    }

    parametrs.page === 1 ? (this.buttonPrevious.disabled = true) : (this.buttonPrevious.disabled = false);

    this.buttonPrevious.disabled = parametrs.page === 1;

    if (parametrs.page && parametrs.limit && parametrs.total !== undefined) {
      parametrs.page * parametrs.limit >= parametrs.total
        ? (this.buttonNext.disabled = true)
        : (this.buttonNext.disabled = false);
    }
  }

  public updateButtonAdToCart(): void {
    const idCardInCart = this.appModel.getProductsIdInCart();
    if (!idCardInCart) {
      return;
    }
    const cards = Array.from(this.productsContainer.children);
    cards.forEach((card) => {
      const productId = card.getAttribute('data-id');
      if (!productId) return;
      const button = card.lastElementChild?.lastElementChild;
      if (idCardInCart.includes(productId)) {
        if (button instanceof HTMLButtonElement) {
          button.disabled = true;
          button.textContent = '✓';
        }
      }
    });
  }

  public startAddAnimation(button: HTMLButtonElement): void {
    const content = button.lastElementChild;
    if (content) {
      content.classList.add('btn-animate');
    }
  }

  public stopAddAnimationAndDisable(button: HTMLButtonElement): void {
    const content = button.lastElementChild;
    if (content) {
      content.classList.remove('btn-animate');
    }
    button.disabled = true;

    button.textContent = '✓';
  }

  public renderMessage(message: string): void {
    this.productsContainer.replaceChildren();
    const messageContainer = this.buildErrorsMessage(message);
    this.productsContainer.appendChild(messageContainer);
  }

  public renderCards(): void {
    const dataProducts = this.model.getProducts();
    this.productsContainer.replaceChildren();
    dataProducts.forEach((product) => {
      const card = new ProductCard(product).create();
      this.productsContainer.appendChild(card);
    });
    this.updateButtonAdToCart();
  }

  private buildHeadContainer(): HTMLElement {
    const container = elementCreator(document.createElement('header'), {
      classNames: ['catalog-right__head'],
    });

    this.formSearch.append(this.searchInput, this.searchButton);
    container.append(this.formSearch, this.sortSelect);

    return container;
  }

  private buildErrorsMessage(message: string): HTMLElement {
    const container = elementCreator(document.createElement('div'), {
      classNames: ['catalog-right__message'],
      content: message,
    });
    return container;
  }

  private buildPagination(): HTMLElement {
    const paginationContainer = elementCreator(document.createElement('div'), {
      classNames: ['pagination', 'catalog-right__pagination'],
    });

    paginationContainer.append(this.buttonPrevious, this.pageCounter, this.buttonNext);
    return paginationContainer;
  }
}
