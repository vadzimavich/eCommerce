import { LineItem } from '@commercetools/platform-sdk';
import { elementCreator } from '../../../../utils/dom-helpers';
import { formatPrice } from '../../../../utils/formatters';

export class LineItemView {
  public readonly element: HTMLElement;
  private readonly lineItem: LineItem;

  constructor(lineItem: LineItem) {
    this.lineItem = lineItem;
    this.element = this.createLineItemElement();
  }

  private createLineItemElement(): HTMLElement {
    const lineItemElement = elementCreator(document.createElement('div'), {
      classNames: ['cart-item'],
      attributes: { 'data-line-item-id': this.lineItem.id },
    });

    const image = this.createImage();
    const details = this.createDetails();
    const actions = this.createActions();

    lineItemElement.append(image, details, actions);
    return lineItemElement;
  }

  private createImage(): HTMLElement {
    const imageUrl = this.lineItem.variant.images?.[0]?.url || './assets/icons/no-image-placeholder.svg';
    const imageWrapper = elementCreator(document.createElement('div'), { classNames: ['cart-item__image-wrapper'] });
    const imageElement = elementCreator(document.createElement('img'), {
      classNames: ['cart-item__image'],
      attributes: { src: imageUrl, alt: this.lineItem.name['en-US'] },
    });
    imageWrapper.append(imageElement);
    return imageWrapper;
  }

  private createDetails(): HTMLElement {
    const detailsWrapper = elementCreator(document.createElement('div'), { classNames: ['cart-item__details'] });
    const name = elementCreator(document.createElement('h3'), {
      classNames: ['cart-item__name'],
      content: this.lineItem.name['en-US'],
    });
    const price = this.createPriceElement();

    detailsWrapper.append(name, price);
    return detailsWrapper;
  }

  private createPriceElement(): HTMLElement {
    const priceWrapper = elementCreator(document.createElement('div'), { classNames: ['cart-item__price-wrapper'] });
    const currentPrice = this.lineItem.price.discounted?.value || this.lineItem.price.value;
    const priceElement = elementCreator(document.createElement('span'), {
      classNames: ['cart-item__price-current'],
      content: formatPrice(currentPrice),
    });
    priceWrapper.append(priceElement);

    if (this.lineItem.price.discounted) {
      const originalPriceElement = elementCreator(document.createElement('span'), {
        classNames: ['cart-item__price-original', 'price-old'],
        content: formatPrice(this.lineItem.price.value),
      });
      priceWrapper.prepend(originalPriceElement);
    }
    return priceWrapper;
  }

  private createActions(): HTMLElement {
    const actionsWrapper = elementCreator(document.createElement('div'), { classNames: ['cart-item__actions'] });

    const quantityControl = this.createQuantityControl();
    const totalItemPrice = this.createTotalItemPrice();
    const removeButton = elementCreator(document.createElement('button'), {
      classNames: ['cart-item__remove-button', 'button--text'],
      content: 'Remove',
      attributes: { 'data-action': 'remove' },
    });

    actionsWrapper.append(quantityControl, totalItemPrice, removeButton);
    return actionsWrapper;
  }

  private createQuantityControl(): HTMLElement {
    const quantityWrapper = elementCreator(document.createElement('div'), { classNames: ['quantity-control'] });
    const decreaseButton = elementCreator(document.createElement('button'), {
      content: '-',
      attributes: { 'data-action': 'decrease' },
    });

    if (this.lineItem.quantity === 1) {
      decreaseButton.disabled = true;
    }

    const quantityInput = elementCreator(document.createElement('input'), {
      classNames: ['quantity-control__input'],
      attributes: {
        type: 'number',
        value: this.lineItem.quantity.toString(),
        min: '1',
        'data-action': 'set-quantity',
      },
    });
    const increaseButton = elementCreator(document.createElement('button'), {
      content: '+',
      attributes: { 'data-action': 'increase' },
    });

    quantityWrapper.append(decreaseButton, quantityInput, increaseButton);
    return quantityWrapper;
  }

  private createTotalItemPrice(): HTMLElement {
    const totalWrapper = elementCreator(document.createElement('div'), { classNames: ['cart-item__total-price'] });
    const totalPrice = formatPrice(this.lineItem.totalPrice);
    totalWrapper.textContent = totalPrice;
    return totalWrapper;
  }
}
