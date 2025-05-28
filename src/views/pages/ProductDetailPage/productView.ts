import { elementCreator } from '../../../utils/dom-helpers';
import { ProductModel } from './productModel';
import Swiper from 'swiper';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';

export class ProductView {
  private swiper: HTMLDivElement;
  private thumbsSwiper: HTMLDivElement;
  private container: HTMLElement;

  constructor(private readonly model: ProductModel) {
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
    this.createEcoClass(wrapper);

    wrapper.append(this.createPriceWrapper());
    return wrapper;
  }

  private createEcoClass(wrapper: HTMLDivElement): void {
    const content = this.model.dataProduct?.attributes?.filter((item) => item.name === 'eco-class');

    if (content) {
      const wrapperContent = elementCreator(document.createElement('div'), {
        classNames: ['product__content__wrapper'],
      });

      const key = elementCreator(document.createElement('span'), {
        classNames: ['product__content__key'],
        content: 'Eco-class: ',
      });

      const value = elementCreator(document.createElement('span'), {
        classNames: ['product__content__value'],
        content: content[0].value.label['en-US'].toUpperCase(),
      });

      wrapperContent.append(key, value);
      wrapper.append(wrapperContent);
    }
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
    const priceContent = currency + this.model.dataProduct?.price?.toString();

    const price = elementCreator(document.createElement('p'), {
      classNames: ['product__price'],
      content: priceContent || '',
    });

    wrapper.append(price);

    if (this.model.dataProduct?.discountPrice) {
      const discountPrice = elementCreator(document.createElement('p'), {
        classNames: ['product__discount', 'price-new'],
        content: currency + this.model.dataProduct.discountPrice || '',
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
