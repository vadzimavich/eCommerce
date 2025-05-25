import { CatalogController } from './catalogController';
import { CatalogModel } from './catalogModel';
import { CatalogView } from './view/catalodView';

export class CatalogPage {
  private readonly view: CatalogView;
  private readonly model: CatalogModel;

  constructor() {
    this.model = new CatalogModel();
    this.view = new CatalogView(this.model);
  }

  public render(): HTMLElement {
    const render = this.view.render();
    new CatalogController(this.model, this.view);
    return render;
  }
}
