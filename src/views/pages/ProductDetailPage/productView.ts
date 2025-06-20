import { Attribute } from '@commercetools/platform-sdk';
import { elementCreator } from '../../../utils/dom-helpers';
import { ProductModalSwiperView } from './modalSwiperView';
import { ProductModel } from './productModel';
import Swiper from 'swiper';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import { loaderView } from '../../components/Loader';
import { ButtonsForCart } from './components/buttons-for-cart';
import { Modal } from '../../../components/modal';

export class ProductView {
  public readonly buttonsForCart: ButtonsForCart;
  public readonly swiper: HTMLDivElement;
  public readonly modalSwiper: ProductModalSwiperView;
  private readonly thumbsSwiper: HTMLDivElement;
  private readonly container: HTMLElement;
  private readonly popup: Modal;

  constructor(private readonly model: ProductModel) {
    this.popup = Modal.getInstance();
    this.buttonsForCart = new ButtonsForCart(this.model);
    this.modalSwiper = new ProductModalSwiperView(this.model);
    this.container = elementCreator(document.createElement('section'), {
      classNames: ['page-wrapper', 'product'],
    });
    this.swiper = elementCreator(document.createElement('div'), {
      classNames: ['product__wrapper__main-slider', 'swiper'],
    });
    this.thumbsSwiper = elementCreator(document.createElement('div'), {
      classNames: ['product__wrapper__thumbs-swiper', 'swiper'],
    });
  }

  public render(): HTMLElement {
    this.loadData();
    return this.container;
  }

  public loadData(): void {
    if (!this.model.dataProduct) {
      this.container.append(loaderView());
      return;
    }
    this.container.replaceChildren();
    this.renderProduct();
  }

  public renderProduct(): void {
    this.container.replaceChildren();
    this.createWrapper();
  }

  public getContainer(): HTMLElement {
    return this.container;
  }

  public showSuccessModal(message: string): void {
    this.popup.infoMessage(message);
  }

  public showErrorModal(message: string): void {
    this.popup.errorMessage(message);
  }

  private createWrapper(): void {
    const wrapper = elementCreator(document.createElement('div'), { classNames: ['product__wrapper'] });

    wrapper.append(this.createSwiperElements(), this.createContent());
    this.container.append(wrapper);
    this.initializeSwiper();
  }

  private createContent(): HTMLDivElement {
    const wrapper = elementCreator(document.createElement('div'), { classNames: ['product__wrapper__desc'] });

    const title = elementCreator(document.createElement('h2'), {
      classNames: ['product__title'],
      content: this.model.dataProduct?.title || '',
    });

    wrapper.append(title);

    this.createDescription(wrapper);

    const wrapperAttributes = elementCreator(document.createElement('div'), {
      classNames: ['product__wrapper__attributes'],
    });
    this.createAttributes(wrapperAttributes);

    wrapper.append(wrapperAttributes, this.createPriceWrapper(), this.buttonsForCart.create());
    return wrapper;
  }

  private createAttributes(wrapper: HTMLDivElement): void {
    const ignoreAttributes = ['title', 'description', 'discount-price', 'bestsaller'];
    const attributes = this.model.dataProduct?.attributes?.filter((item) => !ignoreAttributes.includes(item.name));

    attributes?.forEach((item) => {
      this.createAttribute(wrapper, item);
    });
  }

  private createAttribute(wrapper: HTMLDivElement, attribute: Attribute): void {
    const wrapperContent = elementCreator(document.createElement('div'), {
      classNames: ['product__content__wrapper'],
    });

    const key = elementCreator(document.createElement('span'), {
      classNames: ['product__content__key'],
      content: `${attribute.name[0].toUpperCase() + attribute.name.slice(1)}: `,
    });

    const border = elementCreator(document.createElement('span'), {
      classNames: ['product__content__border'],
    });

    let valueContent: string;

    if (typeof attribute.value === 'object') {
      valueContent = attribute.value.label['en-US'] ?? attribute.value.label;
    } else {
      valueContent = attribute.value;
    }

    const value = elementCreator(document.createElement('span'), {
      classNames: ['product__content__value'],
      content: valueContent,
    });

    wrapperContent.append(key, border, value);
    wrapper.append(wrapperContent);
  }

  private createDescription(wrapper: HTMLDivElement): void {
    const content = this.model.dataProduct?.attributes?.filter((item) => item.name === 'description');

    if (content) {
      const description = elementCreator(document.createElement('p'), {
        classNames: ['product__content__description'],
        content: content[0].value['en-US'],
      });

      wrapper.append(description);
    }
  }

  private createPriceWrapper(): HTMLDivElement {
    const wrapper = elementCreator(document.createElement('div'), { classNames: ['product__wrapper__price'] });

    const currency = this.model.dataProduct?.currency || '';
    const priceContent = currency + this.model.dataProduct?.price?.toFixed(2);

    const price = elementCreator(document.createElement('p'), {
      classNames: ['product__price'],
      content: priceContent || '',
    });

    wrapper.append(price);

    if (this.model.dataProduct?.discountPrice) {
      const discountPrice = elementCreator(document.createElement('p'), {
        classNames: ['product__discount', 'price-new'],
        content: currency + this.model.dataProduct.discountPrice.toFixed(2) || '',
      });

      wrapper.append(discountPrice);

      price.classList.add('price-old');
    }

    return wrapper;
  }

  private createSwiperElements(): HTMLDivElement {
    const sliders = elementCreator(document.createElement('div'), {
      classNames: ['product__wrapper__sliders'],
    });

    const wrapperSlider = elementCreator(document.createElement('div'), {
      classNames: ['main-swiper', 'swiper-wrapper'],
    });

    const wrapperThumbsSlider = elementCreator(document.createElement('div'), {
      classNames: ['thumbs-swiper', 'swiper-wrapper'],
    });

    this.model.dataProduct?.images?.forEach((item) => {
      for (let i = 0; i < 2; i++) {
        const wrapperImg = elementCreator(document.createElement('div'), {
          classNames: ['product__wrapper__img', 'swiper-slide'],
        });

        const img = elementCreator(document.createElement('img'), {
          classNames: ['product__img'],
          attributes: {
            src: item,
            alt: this.model.dataProduct?.title || '',
          },
        });

        wrapperImg.append(img);

        if (i === 0) {
          wrapperSlider.append(wrapperImg);
        } else {
          wrapperThumbsSlider.append(wrapperImg);
        }
      }
    });

    this.swiper.append(wrapperSlider);
    this.thumbsSwiper.append(wrapperThumbsSlider);

    sliders.append(this.swiper, this.thumbsSwiper);
    return sliders;
  }

  private initializeSwiper(): void {
    const thumbsSwiperInstance = new Swiper(this.thumbsSwiper, {
      modules: [Navigation, Pagination, Thumbs],
      spaceBetween: 10,
      slidesPerView: 3,
      freeMode: true,
      watchSlidesProgress: true,
      navigation: true,
      breakpoints: {
        0: {
          slidesPerView: 3,
        },
        420: {
          slidesPerView: 4,
        },
        560: {
          slidesPerView: 6,
        },
        768: {
          slidesPerView: 8,
        },
      },
    });

    new Swiper(this.swiper, {
      modules: [Navigation, Pagination, Thumbs],
      navigation: true,
      pagination: { clickable: true },
      thumbs: {
        swiper: thumbsSwiperInstance,
      },
    });
  }
}
