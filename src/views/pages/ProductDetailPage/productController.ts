import { route } from '../../../app';
import { ProductsService } from '../../../models/services/ProductService';
import { AppModel } from '../../../models/state/AppState';
import { parseProduct } from '../../../utils/parsers';
import { ProductModel } from './productModel';
import { ProductView } from './productView';

export class ProductController {
  private readonly service: ProductsService;
  constructor(
    private readonly appModel: AppModel,
    private readonly model: ProductModel,
    private readonly view: ProductView
  ) {
    this.service = ProductsService.getInstance();
    this.initProduct();
    this.model.subscribeProductListener(() => this.handlerLoadProduct());
    this.handlerOpenModalSwiper();
  }

  private async initProduct(): Promise<void> {
    try {
      //const idProduct = window.location.hash.split('/').at(-1) || '';
      const data = await this.service.getProductById('3a06a607-0674-44c3-8a90-a14b8e373c11');

      if (data && !(data instanceof Error)) {
        const parsedProducts = parseProduct(data);
        this.model.setProducts(parsedProducts);
      }
    } catch {
      route.navigate('/not-found');
    }
  }

  private handlerLoadProduct(): void {
    this.view.renderProduct();
  }

  private handlerOpenModalSwiper(): void {
    this.view.swiper.addEventListener('click', () => {
      this.view.modalSwiper.render();
    });
  }
}
