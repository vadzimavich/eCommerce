import { elementCreator } from '../../../../utils/dom-helpers';
import { ProductCard } from '../../../../utils/product-card';
import { CatalogModel } from '../catalogModel';

export class ProductsView {
  private readonly container: HTMLElement;
  private readonly productsContainer: HTMLElement;

  constructor(private readonly model: CatalogModel) {
    this.container = elementCreator(document.createElement('div'), {
      classNames: ['catalog-right', 'section-item'],
    });
    this.productsContainer = elementCreator(document.createElement('div'), {
      classNames: ['catalog-right__products'],
    });
  }

  public render(): HTMLElement {
    this.renderCards();
    this.container.append(this.productsContainer);
    return this.container;
  }

  public getProductsContainer(): HTMLElement {
    return this.productsContainer;
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
}
