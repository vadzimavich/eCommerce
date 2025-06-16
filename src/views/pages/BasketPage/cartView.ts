import { elementCreator } from '../../../utils/dom-helpers';
import { CartModel } from './cartModel';
import { loaderView } from '../../components/Loader';
import { route } from '../../../app';

export class CartView {
  private container: HTMLElement;
  private title: HTMLElement;
  private contentWrapper: HTMLElement;

  constructor(private readonly model: CartModel) {
    this.container = elementCreator(document.createElement('section'), {
      classNames: ['cart-page', 'page-wrapper'],
    });
    this.title = elementCreator(document.createElement('h1'), {
      classNames: ['cart-page__title'],
      content: 'My Cart',
    });
    this.contentWrapper = elementCreator(document.createElement('div'), {
      classNames: ['cart-page__content'],
    });
    this.model.subscribeToCartUpdates(() => this.renderContent());
  }

  public render(): HTMLElement {
    this.container.innerHTML = '';
    this.container.append(this.title, this.contentWrapper);
    this.renderContent();
    return this.container;
  }

  private renderContent(): void {
    this.contentWrapper.innerHTML = '';
    const cart = this.model.getCart();

    if (!cart) {
      this.contentWrapper.append(loaderView());
      return;
    }

    if (cart.lineItems.length === 0) {
      this.showEmptyCartMessage();
    } else {
      // TODO: Implement rendering of cart items
      this.contentWrapper.textContent = JSON.stringify(cart.lineItems, null, 2);
    }
  }

  private showEmptyCartMessage(): void {
    const emptyCartContainer = elementCreator(document.createElement('div'), {
      classNames: ['cart-page__empty'],
    });
    const message = elementCreator(document.createElement('p'), {
      classNames: ['cart-page__empty-message'],
      content: 'Your cart is empty',
    });
    const catalogLink = elementCreator(document.createElement('a'), {
      classNames: ['cart-page__catalog-link', 'button'],
      content: 'Continue Shopping',
    });
    catalogLink.addEventListener('click', (event) => {
      event.preventDefault();
      route.navigate('/catalog/all');
    });

    emptyCartContainer.append(message, catalogLink);
    this.contentWrapper.append(emptyCartContainer);
  }
}
