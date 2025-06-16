import { elementCreator } from '../../../../utils/dom-helpers';
import { CartModel } from '../cartModel';
import { loaderView } from '../../../components/Loader';
import { route } from '../../../../app';
import { LineItemView } from './lineItemView';
import { formatPrice } from '../../../../utils/formatters';

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

  public getContentWrapper(): HTMLElement {
    return this.contentWrapper;
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
      const itemsContainer = elementCreator(document.createElement('div'), {
        classNames: ['cart-page__items-container'],
      });
      cart.lineItems.forEach((item) => {
        const lineItemView = new LineItemView(item);
        itemsContainer.append(lineItemView.element);
      });
      const summaryContainer = this.createSummaryContainer();
      this.contentWrapper.append(itemsContainer, summaryContainer);
    }
  }

  private createSummaryContainer(): HTMLElement {
    const summaryContainer = elementCreator(document.createElement('div'), {
      classNames: ['cart-summary'],
    });
    const cart = this.model.getCart();
    if (!cart) return summaryContainer;

    const totalElement = elementCreator(document.createElement('div'), {
      classNames: ['cart-summary__total'],
    });
    const totalLabel = elementCreator(document.createElement('span'), { content: 'Subtotal' });
    const totalValue = elementCreator(document.createElement('span'), {
      content: formatPrice(cart.totalPrice),
    });
    totalElement.append(totalLabel, totalValue);

    const promoContainer = this.createPromoCodeContainer();
    const clearCartButton = elementCreator(document.createElement('button'), {
      classNames: ['cart-summary__clear-button', 'button', 'button--danger'],
      content: 'Clear Cart',
      attributes: { 'data-action': 'clear-cart' },
    });

    summaryContainer.append(totalElement, promoContainer, clearCartButton);
    return summaryContainer;
  }

  private createPromoCodeContainer(): HTMLElement {
    const promoContainer = elementCreator(document.createElement('div'), {
      classNames: ['promo-code'],
    });
    const promoInput = elementCreator(document.createElement('input'), {
      classNames: ['promo-code__input'],
      attributes: { placeholder: 'Enter promo code' },
    });
    const applyButton = elementCreator(document.createElement('button'), {
      classNames: ['promo-code__apply-button', 'button'],
      content: 'Apply',
    });
    promoContainer.append(promoInput, applyButton);
    return promoContainer;
  }

  private showEmptyCartMessage(): void {
    const emptyCartContainer = elementCreator(document.createElement('div'), {
      classNames: ['cart-page__empty'],
    });
    const message = elementCreator(document.createElement('p'), {
      classNames: ['cart-page__empty-message'],
      content: 'Your cart is empty.',
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
