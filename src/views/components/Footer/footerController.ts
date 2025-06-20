import { ProductsService } from '../../../models/services/ProductService';
import { AppModel } from '../../../models/state/AppState';
import { FooterModel } from './footerModel';
import { FooterView } from './footerView';

export class FooterController {
  private readonly productServive: ProductsService;
  constructor(
    private readonly appModel: AppModel,
    private readonly model: FooterModel,
    private readonly view: FooterView
  ) {
    this.productServive = ProductsService.getInstance();
    this.getCategories();
  }

  private async getCategories(): Promise<void> {
    try {
      const resultCategories = await this.productServive.getAllCategories();
      if (resultCategories instanceof Error || resultCategories.length === 0) {
        return;
      }
      this.model.setCategories(resultCategories);
      this.view.updateRender();
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }
}
