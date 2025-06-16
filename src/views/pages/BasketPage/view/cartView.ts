import { elementCreator } from '../../../../utils/dom-helpers';
import { CartModel } from '../cartModel';
import { loaderView } from '../../../components/Loader';
import { route } from '../../../../app';
import { LineItemView } from './lineItemView';
import { formatPrice } from '../../../../utils/formatters';
import { DiscountCodeInfo } from '@commercetools/platform-sdk';

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
    if (!cart) {
      return summaryContainer;
    }

    // FIX: Correctly calculate subtotal as the sum of line item total prices
    const subtotalCentAmount = cart.lineItems.reduce((acc, item) => acc + item.totalPrice.centAmount, 0);
    const subtotalMoney = { ...cart.totalPrice, centAmount: subtotalCentAmount };

    // FIX: Compare calculated subtotal with the final cart total price
    const hasCartDiscount = subtotalCentAmount !== cart.totalPrice.centAmount;

    // Always show Subtotal
    const subtotalElement = this.createSummaryLine('Subtotal', formatPrice(subtotalMoney));
    if (hasCartDiscount) {
      subtotalElement.classList.add('price-old');
    }
    summaryContainer.append(subtotalElement);

    const appliedDiscountsContainer = this.createAppliedDiscounts(cart.discountCodes);
    if (appliedDiscountsContainer.hasChildNodes()) {
      summaryContainer.append(appliedDiscountsContainer);
    }

    const totalElement = this.createSummaryLine('Total', formatPrice(cart.totalPrice), ['cart-summary__total']);
    summaryContainer.append(totalElement);

    const promoContainer = this.createPromoCodeContainer();
    const clearCartButton = elementCreator(document.createElement('button'), {
      classNames: ['cart-summary__clear-button', 'button', 'button--danger'],
      content: 'Clear Cart',
      attributes: { 'data-action': 'clear-cart' },
    });

    summaryContainer.append(promoContainer, clearCartButton);
    return summaryContainer;
  }

  private createSummaryLine(label: string, value: string, classes: string[] = []): HTMLElement {
    const lineElement = elementCreator(document.createElement('div'), {
      classNames: ['cart-summary__line', ...classes],
    });
    const labelElement = elementCreator(document.createElement('span'), {
      classNames: ['cart-summary__label'],
      content: label,
    });
    const valueElement = elementCreator(document.createElement('span'), {
      classNames: ['cart-summary__value'],
      content: value,
    });
    lineElement.append(labelElement, valueElement);
    return lineElement;
  }

  private createAppliedDiscounts(discounts: DiscountCodeInfo[]): HTMLElement {
    const container = elementCreator(document.createElement('div'), { classNames: ['applied-discounts'] });
    discounts.forEach((discountInfo) => {
      const discount = discountInfo.discountCode.obj;
      if (discount) {
        const line = elementCreator(document.createElement('div'), { classNames: ['applied-discounts__item'] });
        const description = discount.description?.['en-US'] || '';
        const nameText = `${discount.code}${description ? ` - ${description}` : ''}`;
        const name = elementCreator(document.createElement('span'), {
          classNames: ['applied-discounts__name'],
          content: nameText,
        });
        const removeButton = elementCreator(document.createElement('button'), {
          classNames: ['applied-discounts__remove'],
          attributes: { 'data-action': 'remove-promo', 'data-id': discount.id },
          content: '×',
        });
        line.append(name, removeButton);
        container.append(line);
      }
    });
    return container;
  }

  private createPromoCodeContainer(): HTMLElement {
    const promoContainer = elementCreator(document.createElement('div'), {
      classNames: ['promo-code'],
    });
    const promoInput = elementCreator(document.createElement('input'), {
      classNames: ['promo-code__input'],
      attributes: { placeholder: 'Enter promo code', id: 'promo-code-input' },
    });
    const applyButton = elementCreator(document.createElement('button'), {
      classNames: ['promo-code__apply-button', 'button'],
      content: 'Apply',
      attributes: { 'data-action': 'apply-promo' },
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
