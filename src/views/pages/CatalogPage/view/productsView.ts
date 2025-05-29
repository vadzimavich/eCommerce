import { elementCreator } from '../../../../utils/dom-helpers';
import { ProductCard } from '../../../../utils/product-card';
import { CatalogModel } from '../catalogModel';

import { sortOptions, sortValues } from '../../../components/InputField/constants-content';
import { createInputCatalogSearch, createSelectCatalogSort } from '../../../../utils/form-inputs';

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
    this.sortSelect = createSelectCatalogSort('catalog-sort', sortOptions, sortValues);
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

  public renderCards(): void {
    const dataProducts = this.model.getProducts();
    if (!dataProducts || dataProducts.length === 0) {
      this.productsContainer.textContent = 'Wait our products';
      return;
    }
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
}
