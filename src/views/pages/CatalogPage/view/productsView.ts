import { elementCreator } from '../../../../utils/dom-helpers';
import { ProductCard } from '../../../../utils/product-card';
import { CatalogModel } from '../catalogModel';

import { sortOptions, sortValues } from '../../../components/InputField/constants-content';
import { createSelectCatalogSort } from '../../../../utils/form-inputs';

export class ProductsView {
  private readonly container: HTMLElement;
  private readonly productsContainer: HTMLElement;
  private readonly sortSelect: HTMLSelectElement;

  constructor(private readonly model: CatalogModel) {
    this.container = elementCreator(document.createElement('div'), {
      classNames: ['catalog-right', 'section-item'],
    });
    this.productsContainer = elementCreator(document.createElement('div'), {
      classNames: ['catalog-right__products'],
    });
    this.sortSelect = createSelectCatalogSort('catalog-sort', sortOptions, sortValues);
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
    container.appendChild(this.sortSelect);
    return container;
  }
}
