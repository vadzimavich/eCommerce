import { route } from '../../../app';
import { CartService } from '../../../models/services/CartService';
import { ProductsService } from '../../../models/services/ProductService';
import { AppModel } from '../../../models/state/AppState';
import { RouteParameters } from '../../../models/types/router-types';
import { parseProduct } from '../../../utils/parsers';
import { ProductModel } from './productModel';
import { ProductView } from './productView';

export class ProductController {
  private readonly service: ProductsService;
  private readonly serviceCart: CartService;
  constructor(
    private readonly appModel: AppModel,
    private readonly model: ProductModel,
    private readonly view: ProductView,
    private readonly parameters: RouteParameters
  ) {
    this.service = ProductsService.getInstance();
    this.serviceCart = CartService.getInstance();
    this.initProduct();
    this.getCart();
    this.model.subscribeProductListener(() => this.handlerLoadProduct());
    this.handlerOpenModalSwiper();
    this.handlerCloseModalSwiper();
    this.handlerAddToCart();
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

  private async getCart(): Promise<void> {
    try {
      if (this.model.cart) {
        const data = await this.serviceCart.getCartByID(this.model.cart.id);
        this.model.cart = data;

        console.log('🚀 ~ ProductController ~ getCart ~ data:', data);
      } else {
        const data = await this.serviceCart.getCart();
        this.model.cart = data.results[0];

        console.log('🚀 ~ ProductController ~ getCart ~ data:', data);
      }
      this.model.checkProductInCart();
      this.view.buttonsForCart.update();
    } catch {
      console.error('error getCart');
    }
  }

  private async addProduct(productId: string): Promise<void> {
    try {
      console.log('🚀 ~ ProductController ~ this.view.getButtonAddToCart ~ this.model.cart:', this.model.cart);
      if (!this.model.cart) {
        const data = await this.serviceCart.addProductToCart(productId);
        console.log('🚀 ~ ProductController ~ this.view.addProductToCart ~ data:', data);

        this.model.cart = data;
        console.log('🚀 ~ ProductController ~ this.model.cartID:', this.model.cart);
      } else {
        const data = await this.serviceCart.addProductToCartByID(this.model.cart, productId);
        console.log('🚀 ~ ProductController ~ this.view.addProductToCartByID ~ data:', data);

        this.model.cart = data;
      }

      this.model.checkProductInCart();
      this.view.buttonsForCart.update();
    } catch {
      console.error('error addProduct');
    }
  }

  private handlerAddToCart(): void {
    this.view.buttonsForCart.getComponents().buttonAddToCart.addEventListener('click', () => {
      const productId = window.location.hash.split('/').at(-1);

      if (productId) {
        this.addProduct(productId);
      }
    });
  }

  private handlerLoadProduct(): void {
    this.view.renderProduct();
  }

  private handlerOpenModalSwiper(): void {
    this.view.swiper.addEventListener('click', (event: MouseEvent) => {
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
