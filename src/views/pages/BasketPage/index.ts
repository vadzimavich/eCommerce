import { CartService } from '../../../models/services/CartService';

export class CartPage {
  private readonly cartService: CartService;
  constructor() {
    this.cartService = CartService.getInstance();
  }
  public render(): HTMLElement {
    const container = document.createElement('div');
    // Заглушка класс для страниц потом удалим
    container.classList.add('plug');
    container.innerHTML = 'cartPage';
    console.log(this.cartService.getCurrentCart());
    return container;
  }
}
