import { AppModel } from '../../../models/state/AppState';
import { RouteParameters } from '../../../models/types/router-types';
import { CatalogController } from './catalogController';
import { CatalogModel } from './catalogModel';
import { CatalogView } from './view/catalodView';
import { ProductsView } from './view/productsView';

export class CatalogPage {
  private readonly view: CatalogView;
  private readonly model: CatalogModel;
  private readonly productsView: ProductsView;

  constructor(
    private readonly appModel: AppModel,
    private readonly parameters: RouteParameters = {}
  ) {
    this.model = new CatalogModel();
    this.view = new CatalogView(this.model);
    this.productsView = new ProductsView(this.model);
  }

  public render(): HTMLElement {
    const cataloWrapper = this.view.createWrapper();
    new CatalogController(this.appModel, this.model, this.view, this.productsView, this.parameters);
    cataloWrapper.append(this.productsView.render());
    const page = this.view.render();
    page.append(cataloWrapper);
    return page;
  }
}
