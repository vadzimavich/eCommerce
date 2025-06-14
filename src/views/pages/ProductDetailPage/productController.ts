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
    this.handlerDecrementToCart();
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
    const cart = await this.serviceCart.getCurrentCart();

    this.model.cart = cart;
    this.model.checkProductInCart(cart);
    this.view.buttonsForCart.update();
  }

  private async addProduct(productId: string): Promise<void> {
    try {
      if (this.model.cart) {
        const data = await this.serviceCart.addProductToCart(this.model.cart, productId);

        this.model.checkProductInCart(data);
        this.view.buttonsForCart.update();
      }
    } catch {
      console.error('error addProduct');
    }
  }

  private async decrementProduct(): Promise<void> {
    try {
      if (this.model.cart && this.model.lineItemCart) {
        const quantity = this.model.lineItemCart?.quantity - 1;
        const data = await this.serviceCart.updateLineItemByID(this.model.cart, this.model.lineItemCart, quantity);

        this.model.checkProductInCart(data);
        this.view.buttonsForCart.update();
      }
    } catch {
      console.error('error decrementProduct');
    }
  }

  private handlerAddToCart(): void {
    this.view.buttonsForCart.getComponents().buttonAddToCart.addEventListener('click', () => {
      const productId = window.location.hash.split('/').at(-1);

      if (productId) {
        this.addProduct(productId);
      }
    });

    this.view.buttonsForCart.getComponents().buttonIncrement.addEventListener('click', () => {
      if (this.model.lineItemCart) {
        this.addProduct(this.model.lineItemCart.productId);
      }
    });
  }

  private handlerDecrementToCart(): void {
    this.view.buttonsForCart.getComponents().buttonDecrement.addEventListener('click', () => {
      if (this.model.lineItemCart) {
        this.decrementProduct();
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
