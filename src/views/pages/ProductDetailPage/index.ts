import { AppModel } from '../../../models/state/AppState';
import { ProductController } from './productController';
import { ProductModel } from './productModel';
import { ProductView } from './productView';

export class ProductPage {
  private readonly view: ProductView;
  private readonly model: ProductModel;

  constructor(private readonly appModel: AppModel) {
    this.model = new ProductModel();
    this.view = new ProductView(this.model);
  }

  public render(): HTMLElement {
    const render = this.view.render();
    new ProductController(this.appModel, this.model, this.view);
    return render;
  }
}
