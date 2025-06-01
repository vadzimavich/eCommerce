import { route } from '../../../app';
import { ProductsService } from '../../../models/services/ProductService';
import { AppModel } from '../../../models/state/AppState';
import { RouteParameters } from '../../../models/types/router-types';
import { parseProduct } from '../../../utils/parsers';
import { ProductModel } from './productModel';
import { ProductView } from './productView';

export class ProductController {
  private readonly service: ProductsService;
  constructor(
    private readonly appModel: AppModel,
    private readonly model: ProductModel,
    private readonly view: ProductView,
    private readonly parameters: RouteParameters
  ) {
    this.service = ProductsService.getInstance();
    this.initProduct();
    this.model.subscribeProductListener(() => this.handlerLoadProduct());
    this.handlerOpenModalSwiper();
    this.handlerCloseModalSwiper();
  }

  private async initProduct(): Promise<void> {
    try {
      const data = await this.service.getProductById(this.parameters.id);

      if (data && !(data instanceof Error)) {
        const parsedProducts = parseProduct([data]);
        this.model.setProducts(parsedProducts[0]);
      }
    } catch {
      route.navigate('/not-found');
    }
  }

  private handlerLoadProduct(): void {
    this.view.renderProduct();
  }

  private handlerOpenModalSwiper(): void {
    this.view.swiper.addEventListener('click', (event: MouseEvent) => {
      console.log('🚀 ~ ProductController ~ this.view.swiper.addEventListener ~ event:', event.target);
      if (event.target instanceof HTMLElement) {
        const imgSource = event.target.closest('img');
        if (imgSource) {
          this.view.modalSwiper.render(imgSource.src);
        }
      }
    });
  }

  private handlerCloseModalSwiper(): void {
    this.view.modalSwiper.buttonClose.addEventListener('click', () => {
      this.view.modalSwiper.closeModal();
    });
  }
}
