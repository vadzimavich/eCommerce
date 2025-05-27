import { elementCreator } from '../../../../utils/dom-helpers';
// import { ProductCard } from '../../../../utils/product-card';
import { CatalogModel } from '../catalogModel';

export class CatalogView {
  private readonly container: HTMLElement;
  constructor(private readonly model: CatalogModel) {
    this.container = elementCreator(document.createElement('section'), { classNames: ['page-wrapper'] });
  }

  public render(): HTMLElement {
    return this.container;
  }
}
