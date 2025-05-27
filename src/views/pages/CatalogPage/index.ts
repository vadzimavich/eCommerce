import { CatalogController } from './catalogController';
import { CatalogModel } from './catalogModel';
import { CatalogView } from './view/catalodView';
import { ProductsView } from './view/productsView';

export class CatalogPage {
  private readonly view: CatalogView;
  private readonly model: CatalogModel;
  private readonly productsView: ProductsView;

  constructor() {
    this.model = new CatalogModel();
    this.view = new CatalogView(this.model);
    this.productsView = new ProductsView(this.model);
  }

  public render(): HTMLElement {
    const catalogView = this.view.render();
    new CatalogController(this.model, this.view, this.productsView);
    catalogView.append(this.productsView.render());
    return catalogView;
  }
}
