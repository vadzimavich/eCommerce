import { elementCreator } from '../../../../utils/dom-helpers';
import { ProductCard } from '../../../../utils/product-card';
import { CatalogModel } from '../catalogModel';

import { createInputCatalogSearch, createSelectCatalogSort } from '../../../../utils/catalog-inputs';
import { sortOptions, sortValues } from './constant-conrent';

export class ProductsView {
  private readonly container: HTMLElement;
  private readonly productsContainer: HTMLElement;
  private readonly sortSelect: HTMLSelectElement;
  private readonly searchInput: HTMLInputElement;
  private readonly searchButton: HTMLButtonElement;
  private readonly formSearch: HTMLFormElement;

  constructor(private readonly model: CatalogModel) {
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
  }

  public render(): HTMLElement {
    this.renderCards();
    const headContainer = this.buildHeadContainer();
    this.container.append(headContainer, this.productsContainer);
    this.renderMessage('Loading products...');
    return this.container;
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
}
