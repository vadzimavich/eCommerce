import { elementCreator } from '../../../utils/dom-helpers';
import { ProductModel } from './productModel';
import Swiper from 'swiper';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';

export class ProductModalSwiperView {
  private readonly swiper: HTMLDivElement;
  private readonly thumbsSwiper: HTMLDivElement;
  private readonly container: HTMLElement;
  private readonly buttonClose: HTMLButtonElement;
  private readonly buttonPrev: HTMLButtonElement;
  private readonly buttonNext: HTMLButtonElement;

  constructor(private readonly model: ProductModel) {
    this.container = elementCreator(document.createElement('section'), {
      classNames: ['product', 'modal'],
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
    this.buttonPrev = elementCreator(document.createElement('button'), {
      classNames: ['button', 'swiper-button-prev'],
      attributes: { id: 'button-swiper-prev' },
    });
    this.buttonNext = elementCreator(document.createElement('button'), {
      classNames: ['button', 'swiper-button-next'],
      attributes: { id: 'button-swiper-next' },
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
    const wrapper = elementCreator(document.createElement('div'), {
      classNames: ['product__wrapper'],
    });

    const sliders = elementCreator(document.createElement('div'), {
      classNames: ['product__wrapper__sliders'],
    });

    const wrapperSlider = elementCreator(document.createElement('div'), {
      classNames: ['main-swiper', 'swiper-wrapper'],
    });

    const wrapperThumbsSlider = elementCreator(document.createElement('div'), {
      classNames: ['thumbs-swiper', 'swiper-wrapper'],
    });

    this.model.dataProduct?.images?.forEach((sourcePath) => {
      for (let i = 0; i < 2; i++) {
        if (i === 0) {
          this.addSlide(wrapperSlider, sourcePath);
        } else {
          this.addSlide(wrapperThumbsSlider, sourcePath);
        }
      }
    });

    this.swiper.append(wrapperSlider);
    this.thumbsSwiper.append(wrapperThumbsSlider);

    sliders.append(this.buttonPrev, this.swiper, this.buttonNext, this.thumbsSwiper);
    wrapper.append(sliders);
    return wrapper;
  }

  private addSlide(wrapper: HTMLElement, sourcePath: string): void {
    const wrapperImg = elementCreator(document.createElement('div'), {
      classNames: ['product__wrapper__img', 'swiper-slide'],
    });

    const img = elementCreator(document.createElement('img'), {
      classNames: ['product__img'],
      attributes: {
        src: sourcePath,
        alt: this.model.dataProduct?.title || '',
      },
    });

    wrapperImg.append(img);
    wrapper.append(wrapperImg);
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
      navigation: {
        nextEl: this.buttonNext,
        prevEl: this.buttonPrev,
      },
      pagination: { clickable: true },
      thumbs: {
        swiper: thumbsSwiperInstance,
      },
    });
  }
}
