import { elementCreator } from '../../../../utils/dom-helpers';
import { ProductCard } from '../../../../utils/product-card';
import { CatalogModel } from '../catalogModel';

export class ProductsView {
  private readonly container: HTMLElement;
  private readonly productsContainer: HTMLElement;
  constructor(private readonly model: CatalogModel) {
    this.container = elementCreator(document.createElement('section'), {
      content: 'Wait our products',
      classNames: ['catalog-right', 'section-item'],
    });
    this.productsContainer = elementCreator(document.createElement('div'), {
      classNames: ['catalog-right__products'],
    });
  }

  public render(): HTMLElement {
    return this.container;
  }

  public renderCards(): void {
    const dataProducts = this.model.getProducts();
    console.log(dataProducts);
    if (!dataProducts) {
      console.log('Error render');
      return;
    }
    this.container.replaceChildren();
    dataProducts.forEach((product) => {
      const card = new ProductCard(product).create();
      this.container.appendChild(card);
    });
  }
}
