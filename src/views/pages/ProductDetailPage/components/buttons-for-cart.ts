import { elementCreator } from '../../../../utils/dom-helpers';
import { ProductModel } from '../productModel';

type ButtonsForCartInProductPage = {
  wrapper: HTMLElement;
  buttonAddToCart: HTMLButtonElement;
  buttonDecrement: HTMLButtonElement;
  buttonIncrement: HTMLButtonElement;
  countElementElement: HTMLElement;
};

export class ButtonsForCart {
  private readonly buttonWrapper: HTMLElement;
  private readonly buttonAddToCart: HTMLButtonElement;
  private readonly buttonDecrement: HTMLButtonElement;
  private readonly countElement: HTMLElement;
  private readonly buttonIncrement: HTMLButtonElement;

  constructor(private readonly model: ProductModel) {
    this.buttonAddToCart = elementCreator(document.createElement('button'), {
      classNames: ['product__button_cart', 'button'],
      content: 'Add to cart',
    });
    this.buttonWrapper = elementCreator(document.createElement('div'), {
      classNames: ['product__button__wrapper'],
    });

    this.buttonDecrement = elementCreator(document.createElement('button'), {
      classNames: ['product__button__left'],
      content: '-',
    });
    this.countElement = elementCreator(document.createElement('div'), {
      classNames: ['product__button__count'],
      content: '1',
    });
    this.buttonIncrement = elementCreator(document.createElement('button'), {
      classNames: ['product__button__right'],
      content: '+',
    });
  }

  public create(): HTMLElement {
    this.update();

    return this.buttonWrapper;
  }

  public update(): void {
    if (!this.model.isAdded) {
      this.buttonWrapper.replaceChildren();
      this.buttonWrapper.append(this.buttonAddToCart);
    } else {
      this.buttonWrapper.replaceChildren();

      const buttonsWrapper = elementCreator(document.createElement('div'), {
        classNames: ['product__button__buttons'],
      });

      buttonsWrapper.append(this.buttonDecrement, this.countElement, this.buttonIncrement);
      this.buttonWrapper.append(buttonsWrapper);
      this.updateCount();
    }
  }

  public getComponents(): ButtonsForCartInProductPage {
    return {
      wrapper: this.buttonWrapper,
      buttonAddToCart: this.buttonAddToCart,
      buttonDecrement: this.buttonDecrement,
      buttonIncrement: this.buttonIncrement,
      countElementElement: this.countElement,
    };
  }

  private updateCount(): void {
    this.countElement.textContent = this.model.lineItemCart?.quantity.toString() ?? '1';
  }
}
