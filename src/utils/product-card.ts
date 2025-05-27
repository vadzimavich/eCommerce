import { ProductData } from '../models/types/api-types';
import { elementCreator } from './dom-helpers';

export class ProductCard {
  constructor(private readonly product: ProductData) {}

  public create(): HTMLElement {
    const card = elementCreator(document.createElement('div'), {
      classNames: ['product-card'],
      attributes: { 'data-id': this.product.id },
    });

    const priceCartContainer = elementCreator(document.createElement('div'), {
      classNames: ['product-card__priceinform'],
    });

    const image = this.createImage();
    const title = this.createTitle();
    const description = this.createDescription();
    const price = this.createPrice();
    const buttonToCart = this.createButtonToCart();
    priceCartContainer.append(price, buttonToCart);
    card.append(image, title, description, priceCartContainer);
    return card;
  }

  private createImage(): HTMLElement {
    const img = elementCreator(document.createElement('img'), {
      classNames: ['product-card__img'],
    });
    if (this.product.image) {
      img.src = this.product.image;
    }
    img.alt = this.product.title;
    return img;
  }

  private createTitle(): HTMLElement {
    const title = elementCreator(document.createElement('h3'), {
      classNames: ['product-card__title'],
    });
    title.textContent = this.product.title;
    return title;
  }

  private createDescription(): HTMLElement {
    const description = elementCreator(document.createElement('p'), {
      classNames: ['product-card__description'],
    });
    description.textContent = this.product.description;
    return description;
  }

  private createPrice(): HTMLElement {
    const wrapper = elementCreator(document.createElement('div'), {
      classNames: ['product-card__priceinform-price'],
    });

    const { price, discountPrice } = this.product;

    if (discountPrice && price) {
      const oldPrice = elementCreator(document.createElement('span'), {
        classNames: ['price-old'],
      });
      oldPrice.textContent = `$${price.toFixed(2)}`;

      const newPrice = elementCreator(document.createElement('span'), {
        classNames: ['price-new'],
      });
      newPrice.textContent = `$${discountPrice.toFixed(2)}`;

      wrapper.append(oldPrice, newPrice);
    } else if (price) {
      const regularPrice = elementCreator(document.createElement('span'), {
        classNames: ['price-regular'],
      });
      regularPrice.textContent = `$${price.toFixed(2)}`;
      wrapper.append(regularPrice);
    }

    return wrapper;
  }

  private createButtonToCart(): HTMLElement {
    const buttonAdd = elementCreator(document.createElement('button'), {
      classNames: ['product-card__priceinform-btn'],
    });
    buttonAdd.textContent = '+';
    buttonAdd.dataset.title = 'Add To Cart';
    return buttonAdd;
  }
}
