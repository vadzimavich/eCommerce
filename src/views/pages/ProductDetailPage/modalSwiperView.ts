import { elementCreator } from '../../../utils/dom-helpers';
import { ProductModel } from './productModel';
import Swiper from 'swiper';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';

export class ProductModalSwiperView {
  private swiper: HTMLDivElement;
  private thumbsSwiper: HTMLDivElement;
  private container: HTMLElement;
  private buttonClose: HTMLButtonElement;

  constructor(private readonly model: ProductModel) {
    this.container = elementCreator(document.createElement('section'), {
      classNames: ['page-wrapper', 'product', 'modal'],
      attributes: { id: 'modal-swiper' },
    });
    this.swiper = elementCreator(document.createElement('div'), {
      classNames: ['product__wrapper__main-slider', 'swiper'],
    });
    this.thumbsSwiper = elementCreator(document.createElement('div'), {
      classNames: ['product__wrapper__thumbs-swiper', 'swiper'],
    });
    this.buttonClose = elementCreator(document.createElement('button'), {
      classNames: ['button'],
      attributes: { id: 'button-close' },
    });
  }

  public render(): void {
    this.container.append(this.createSwiperElements());
    this.initializeSwiper();
    document.body.append(this.container);
    document.body.classList.toggle('modal_active');
  }

  public closeModal(): void {
    this.container.replaceChildren();
    document.body.classList.toggle('modal_active');
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
