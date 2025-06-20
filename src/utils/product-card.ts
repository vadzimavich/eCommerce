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

    if (this.product.attributes?.find((item) => item.name === 'bestsaller' && item.value === true)) {
      const badge = this.createBestsaller();
      card.append(badge);
    }

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
    const buttonContet = elementCreator(document.createElement('span'), { content: '+', classNames: ['btn-icon'] });
    buttonAdd.dataset.title = 'Add To Cart';
    buttonAdd.append(buttonContet);
    return buttonAdd;
  }

  private createBestsaller(): HTMLElement {
    const wrapper = elementCreator(document.createElement('div'), {
      classNames: ['product-card__bestsaller'],
    });
    const icon = elementCreator(document.createElement('img'), {
      classNames: ['product-card__bestsaller-img'],
      attributes: {
        src: './assets/icons/catalog-icons/catalog-bestsaller.png',
        alt: 'icon-bestsaller',
      },
    });
    wrapper.appendChild(icon);
    return wrapper;
  }
}
