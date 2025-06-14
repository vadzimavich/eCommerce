import { elementCreator } from '../../../../utils/dom-helpers';
import { ProductModel } from '../productModel';

type ButtonsForCartInProductPage = {
  wrapper: HTMLElement;
  buttonAddToCart: HTMLButtonElement;
  buttonDecrement: HTMLButtonElement;
  buttonIncrement: HTMLButtonElement;
  delete: HTMLButtonElement;
  countElementElement: HTMLElement;
};

export class ButtonsForCart {
  private readonly buttonWrapper: HTMLElement;
  private readonly buttonAddToCart: HTMLButtonElement;
  private readonly buttonDecrement: HTMLButtonElement;
  private readonly countElement: HTMLElement;
  private readonly buttonIncrement: HTMLButtonElement;
  private readonly buttonDelete: HTMLButtonElement;

  constructor(private readonly model: ProductModel) {
    this.buttonAddToCart = elementCreator(document.createElement('button'), {
      classNames: ['button_add-to-cart', 'button'],
      content: 'Add to cart',
    });
    this.buttonWrapper = elementCreator(document.createElement('div'), {
      classNames: ['add-to-cart__wrapper'],
    });

    this.buttonDecrement = elementCreator(document.createElement('button'), {
      classNames: ['button_decrement', 'button'],
      content: '-',
    });
    this.countElement = elementCreator(document.createElement('div'), {
      content: '1',
    });
    this.buttonIncrement = elementCreator(document.createElement('button'), {
      classNames: ['button_increment', 'button'],
      content: '+',
    });
    this.buttonDelete = elementCreator(document.createElement('button'), {
      classNames: ['button_delete', 'button'],
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
        classNames: ['buttons'],
      });

      buttonsWrapper.append(this.buttonDecrement, this.countElement, this.buttonIncrement);
      this.buttonWrapper.append(buttonsWrapper, this.buttonDelete);
      this.updateCount();

      if (this.model.lineItemCart?.quantity === this.model.lineItemCart?.variant.availability?.availableQuantity) {
        this.buttonIncrement.disabled = true;
      } else {
        this.buttonIncrement.disabled = false;
      }
    }
  }

  public getComponents(): ButtonsForCartInProductPage {
    return {
      wrapper: this.buttonWrapper,
      buttonAddToCart: this.buttonAddToCart,
      buttonDecrement: this.buttonDecrement,
      buttonIncrement: this.buttonIncrement,
      countElementElement: this.countElement,
      delete: this.buttonDelete,
    };
  }

  private updateCount(): void {
    this.countElement.textContent = this.model.lineItemCart?.quantity.toString() ?? '1';
  }
}
