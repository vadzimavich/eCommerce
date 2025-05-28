import { elementCreator } from '../../../utils/dom-helpers';
import { ProductModel } from './productModel';

export class ProductView {
  private container: HTMLElement;
  private wrapperImages: HTMLDivElement;

  constructor(private readonly model: ProductModel) {
    this.container = elementCreator(document.createElement('section'), {
      classNames: ['page-wrapper', 'product'],
    });
    this.wrapperImages = elementCreator(document.createElement('div'), { classNames: ['product__wrapper__images'] });
  }

  public render(): HTMLElement {
    this.loadData();
    return this.container;
  }

  public loadData(): void {
    if (!this.model.dataProduct) {
      const message = elementCreator(document.createElement('div'), { content: 'Loading product details' });
      this.container.append(message);
      return;
    }
    this.container.replaceChildren();
    this.renderProduct();
  }

  public renderProduct(): void {
    this.container.replaceChildren();
    this.createWrapper();
  }

  private createWrapper(): void {
    const wrapper = elementCreator(document.createElement('div'), { classNames: ['product__wrapper'] });

    wrapper.append(this.createImagesWrapper(), this.createDescription());
    this.container.append(wrapper);
  }

  private createDescription(): HTMLDivElement {
    const wrapper = elementCreator(document.createElement('div'), { classNames: ['product__wrapper__desc'] });

    const title = elementCreator(document.createElement('h2'), {
      classNames: ['product__title'],
      content: this.model.dataProduct?.title || '',
    });

    const description = elementCreator(document.createElement('p'), {
      classNames: ['product__description'],
      content: this.model.dataProduct?.description || '',
    });

    wrapper.append(title, description, this.createPriceWrapper());
    return wrapper;
  }

  private createPriceWrapper(): HTMLDivElement {
    const wrapper = elementCreator(document.createElement('div'), { classNames: ['product__wrapper__price'] });

    const currency = this.model.dataProduct?.currency || '';
    const priceContent = currency + this.model.dataProduct?.price?.toString();

    const price = elementCreator(document.createElement('p'), {
      classNames: ['product__price'],
      content: priceContent || '',
    });

    wrapper.append(price);

    if (this.model.dataProduct?.discountPrice) {
      const discountPrice = elementCreator(document.createElement('p'), {
        classNames: ['product__discount', 'price-new'],
        content: this.model.dataProduct?.discountPrice?.toString() || '',
      });

      wrapper.append(discountPrice);

      price.classList.add('price-old');
    }

    return wrapper;
  }

  private createImagesWrapper(): HTMLDivElement {
    this.model.dataProduct?.images?.forEach((item) => {
      const img = elementCreator(document.createElement('img'), {
        classNames: ['product__img'],
        attributes: {
          src: item,
          alt: this.model.dataProduct?.title || '',
        },
      });
      this.wrapperImages.append(img);
    });

    return this.wrapperImages;
  }
}
