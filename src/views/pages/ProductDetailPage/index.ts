import { AppModel } from '../../../models/state/AppState';
import { RouteParameters } from '../../../models/types/router-types';
import { ProductController } from './productController';
import { ProductModel } from './productModel';
import { ProductView } from './productView';

export class ProductPage {
  private readonly view: ProductView;
  private readonly model: ProductModel;

  constructor(
    private readonly appModel: AppModel,
    private readonly parameters: RouteParameters = {}
  ) {
    this.model = new ProductModel();
    this.view = new ProductView(this.model);
  }

  public render(): HTMLElement {
    const render = this.view.render();
    new ProductController(this.appModel, this.model, this.view, this.parameters);
    return render;
  }
}
